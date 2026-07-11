const db = require("../config/db");

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

module.exports = { list, toggleStatut };
