const db     = require("../config/db");
const bcrypt = require("bcryptjs");

const list = async (req, res) => {
  const { q, role, page = 1, limit = 20 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const where = [];
  const vals  = [];

  if (q)    { where.push("(u.prenom LIKE ? OR u.nom LIKE ? OR u.email LIKE ?)"); vals.push(`%${q}%`, `%${q}%`, `%${q}%`); }
  if (role) { where.push("ur.role = ?"); vals.push(role); }

  const whereStr = where.length ? "WHERE " + where.join(" AND ") : "";
  const joinRole = role ? "JOIN user_roles ur ON ur.user_id = u.id" : "LEFT JOIN user_roles ur ON ur.user_id = u.id";

  const [rows] = await db.query(
    `SELECT u.id, u.prenom, u.nom, u.email, u.telephone, u.ville, u.statut, u.created_at,
            GROUP_CONCAT(DISTINCT ur2.role) AS roles
     FROM users u
     ${role ? "JOIN user_roles ur ON ur.user_id = u.id AND ur.role=?" : ""}
     LEFT JOIN user_roles ur2 ON ur2.user_id = u.id
     WHERE 1=1
     ${q ? " AND (u.prenom LIKE ? OR u.nom LIKE ? OR u.email LIKE ?)" : ""}
     GROUP BY u.id
     ORDER BY u.created_at DESC
     LIMIT ? OFFSET ?`,
    [
      ...(role ? [role] : []),
      ...(q ? [`%${q}%`, `%${q}%`, `%${q}%`] : []),
      parseInt(limit),
      offset,
    ]
  );

  res.json(rows);
};

const toggleStatut = async (req, res) => {
  const [rows] = await db.query("SELECT statut FROM users WHERE id=?", [req.params.id]);
  if (!rows.length) return res.status(404).json({ message: "Utilisateur introuvable" });
  const next = rows[0].statut === "actif" ? "bloqué" : "actif";
  await db.query("UPDATE users SET statut=? WHERE id=?", [next, req.params.id]);
  res.json({ statut: next });
};

const createFournisseur = async (req, res) => {
  const { prenom, nom, email, telephone, ville, boutique, password } = req.body;
  if (!prenom || !nom || !email || !password)
    return res.status(400).json({ message: "Champs obligatoires : prénom, nom, email, mot de passe" });

  const normalizedEmail = email.trim().toLowerCase();
  const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [normalizedEmail]);
  if (existing.length) return res.status(409).json({ message: "Cet email est déjà utilisé" });

  const hash = await bcrypt.hash(password, 12);
  const conn = await db.getConnection();
  await conn.beginTransaction();
  try {
    const [result] = await conn.query(
      `INSERT INTO users (prenom, nom, email, telephone, ville, password_hash) VALUES (?, ?, ?, ?, ?, ?)`,
      [prenom.trim(), nom.trim(), normalizedEmail, telephone || null, ville || null, hash]
    );
    const uid = result.insertId;
    await conn.query("INSERT INTO user_roles (user_id, role) VALUES (?, 'fournisseur')", [uid]);
    await conn.query(
      "INSERT INTO boutiques (user_id, nom, description) VALUES (?, ?, '')",
      [uid, (boutique || `${prenom} ${nom}`).trim()]
    );
    await conn.commit();
    conn.release();
    res.status(201).json({ message: "Fournisseur créé avec succès", userId: uid });
  } catch (e) {
    await conn.rollback();
    conn.release();
    throw e;
  }
};

const createLivreur = async (req, res) => {
  const { prenom, nom, email, telephone, ville, password } = req.body;
  if (!prenom || !nom || !email || !password)
    return res.status(400).json({ message: "Champs obligatoires : prénom, nom, email, mot de passe" });

  const normalizedEmail = email.trim().toLowerCase();
  const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [normalizedEmail]);
  if (existing.length) return res.status(409).json({ message: "Cet email est déjà utilisé" });

  const hash = await bcrypt.hash(password, 12);
  const conn = await db.getConnection();
  await conn.beginTransaction();
  try {
    const [result] = await conn.query(
      `INSERT INTO users (prenom, nom, email, telephone, ville, password_hash) VALUES (?, ?, ?, ?, ?, ?)`,
      [prenom.trim(), nom.trim(), normalizedEmail, telephone || null, ville || null, hash]
    );
    const uid = result.insertId;
    await conn.query("INSERT INTO user_roles (user_id, role) VALUES (?, 'livreur')", [uid]);
    await conn.commit();
    conn.release();
    res.status(201).json({ message: "Livreur créé avec succès", userId: uid });
  } catch (e) {
    await conn.rollback();
    conn.release();
    throw e;
  }
};

/* ── Boutique du fournisseur connecté ── */
const getBoutique = async (req, res) => {
  const [[b]] = await db.query(
    `SELECT id, nom, description FROM boutiques WHERE user_id = ?`,
    [req.user.id]
  );
  res.json(b || { nom: "", description: "" });
};

const updateBoutique = async (req, res) => {
  const { nom, description } = req.body;
  await db.query(
    `UPDATE boutiques SET nom=?, description=? WHERE user_id=?`,
    [(nom || "").trim(), (description || "").trim() || null, req.user.id]
  );
  const [[b]] = await db.query(
    `SELECT id, nom, description FROM boutiques WHERE user_id=?`,
    [req.user.id]
  );
  res.json(b);
};

/* ── Mise à jour profil (utilisateur connecté) ── */
const updateMe = async (req, res) => {
  const { prenom, nom, telephone, ville, quartier, rue } = req.body;
  await db.query(
    `UPDATE users SET prenom=?, nom=?, telephone=?, ville=?, quartier=?, rue=? WHERE id=?`,
    [
      (prenom  || "").trim() || null,
      (nom     || "").trim() || null,
      (telephone||"").trim() || null,
      ville    || null,
      (quartier||"").trim() || null,
      (rue     ||"").trim() || null,
      req.user.id,
    ]
  );
  const [[u]] = await db.query(
    `SELECT id, prenom, nom, email, telephone, ville, quartier, rue, created_at FROM users WHERE id=?`,
    [req.user.id]
  );
  res.json(u);
};

/* ── Changement de mot de passe ── */
const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 8)
    return res.status(400).json({ message: "Données invalides" });

  const [[u]] = await db.query("SELECT password_hash FROM users WHERE id=?", [req.user.id]);
  const ok = await bcrypt.compare(currentPassword, u.password_hash);
  if (!ok) return res.status(400).json({ message: "Mot de passe actuel incorrect" });

  const hash = await bcrypt.hash(newPassword, 12);
  await db.query("UPDATE users SET password_hash=? WHERE id=?", [hash, req.user.id]);
  res.json({ message: "Mot de passe mis à jour" });
};

module.exports = { list, toggleStatut, createFournisseur, createLivreur, updateMe, updatePassword, getBoutique, updateBoutique };
