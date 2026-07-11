const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const db     = require("../config/db");
const { sendEmail } = require("../services/email.service");

const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, roles: user.roles },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

const register = async (req, res) => {
  const { prenom, nom, email, telephone, password, ville, quartier, rue } = req.body;

  const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
  if (existing.length) return res.status(409).json({ message: "Email déjà utilisé" });

  const hash = await bcrypt.hash(password, 12);

  const [result] = await db.query(
    `INSERT INTO users (prenom, nom, email, telephone, password_hash, ville, quartier, rue)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [prenom, nom, email, telephone, hash, ville || null, quartier || null, rue || null]
  );

  const userId = result.insertId;
  await db.query("INSERT INTO user_roles (user_id, role) VALUES (?, 'client')", [userId]);

  const user = { id: userId, email, roles: ["client"] };
  const token = signToken(user);

  sendEmail(email, "bienvenue", { prenom }).catch(() => {});

  res.status(201).json({
    token,
    user: { id: userId, prenom, nom, email, telephone, roles: ["client"] },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await db.query(
    `SELECT u.id, u.prenom, u.nom, u.email, u.telephone, u.statut, u.password_hash,
            u.ville, u.quartier, u.rue,
            GROUP_CONCAT(ur.role) AS roles_str
     FROM users u
     LEFT JOIN user_roles ur ON ur.user_id = u.id
     WHERE u.email = ?
     GROUP BY u.id`,
    [email]
  );

  if (!rows.length) return res.status(401).json({ message: "Identifiants incorrects" });

  const u = rows[0];
  if (u.statut === "bloqué") return res.status(403).json({ message: "Compte bloqué" });

  const match = await bcrypt.compare(password, u.password_hash);
  if (!match) return res.status(401).json({ message: "Identifiants incorrects" });

  const roles = u.roles_str ? u.roles_str.split(",") : ["client"];
  const token = signToken({ id: u.id, email: u.email, roles });

  res.json({
    token,
    user: { id: u.id, prenom: u.prenom, nom: u.nom, email: u.email, telephone: u.telephone, ville: u.ville, quartier: u.quartier, rue: u.rue, roles },
  });
};

const me = async (req, res) => {
  const [rows] = await db.query(
    `SELECT u.id, u.prenom, u.nom, u.email, u.telephone, u.ville, u.quartier, u.rue,
            GROUP_CONCAT(ur.role) AS roles_str
     FROM users u
     LEFT JOIN user_roles ur ON ur.user_id = u.id
     WHERE u.id = ?
     GROUP BY u.id`,
    [req.user.id]
  );
  if (!rows.length) return res.status(404).json({ message: "Utilisateur introuvable" });
  const u = rows[0];
  const roles = u.roles_str ? u.roles_str.split(",") : [];
  res.json({ id: u.id, prenom: u.prenom, nom: u.nom, email: u.email, telephone: u.telephone, ville: u.ville, quartier: u.quartier, rue: u.rue, roles });
};

const updateMe = async (req, res) => {
  const { prenom, nom, email, telephone, ville, quartier, rue } = req.body;
  await db.query(
    `UPDATE users SET prenom=?, nom=?, email=?, telephone=?, ville=?, quartier=?, rue=? WHERE id=?`,
    [prenom, nom, email, telephone, ville || null, quartier || null, rue || null, req.user.id]
  );
  res.json({ message: "Profil mis à jour" });
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const [rows] = await db.query("SELECT password_hash FROM users WHERE id=?", [req.user.id]);
  if (!rows.length) return res.status(404).json({ message: "Utilisateur introuvable" });

  const match = await bcrypt.compare(currentPassword, rows[0].password_hash);
  if (!match) return res.status(401).json({ message: "Mot de passe actuel incorrect" });

  const hash = await bcrypt.hash(newPassword, 12);
  await db.query("UPDATE users SET password_hash=? WHERE id=?", [hash, req.user.id]);
  res.json({ message: "Mot de passe mis à jour" });
};

const becomeFournisseur = async (req, res) => {
  const { nomBoutique, description } = req.body;
  const userId = req.user.id;

  const [existing] = await db.query("SELECT id FROM user_roles WHERE user_id=? AND role='fournisseur'", [userId]);
  if (existing.length) return res.status(409).json({ message: "Déjà fournisseur" });

  await db.query("INSERT INTO user_roles (user_id, role) VALUES (?, 'fournisseur')", [userId]);
  await db.query(
    "INSERT INTO boutiques (user_id, nom, description) VALUES (?, ?, ?)",
    [userId, nomBoutique, description || null]
  );

  const [roles] = await db.query("SELECT role FROM user_roles WHERE user_id=?", [userId]);
  const roleList = roles.map((r) => r.role);
  const token = signToken({ id: userId, email: req.user.email, roles: roleList });

  res.json({ token, roles: roleList });
};

module.exports = { register, login, me, updateMe, changePassword, becomeFournisseur };
