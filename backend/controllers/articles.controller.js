const db = require("../config/db");

// Endpoint dédié page d'accueil : retourne 4 sections en un seul appel
const homepage = async (req, res) => {
  const BASE = `
    SELECT a.id, a.nom, a.prix, a.prix_barre, a.stock, a.categorie, a.image,
           a.note_moy, a.nb_avis, a.is_promoted, b.nom AS boutique
    FROM articles a
    LEFT JOIN boutiques b ON b.user_id = a.fournisseur_id
    WHERE a.statut = 'actif'`;

  const [[sponsorises], [topNotes], [nouveautes], [tendances]] = await Promise.all([
    db.query(BASE + ` AND a.is_promoted = 1 ORDER BY a.created_at DESC LIMIT 12`),
    db.query(BASE + ` AND a.nb_avis >= 1 ORDER BY a.note_moy DESC, a.nb_avis DESC LIMIT 12`),
    db.query(BASE + ` ORDER BY a.created_at DESC LIMIT 12`),
    db.query(BASE + ` ORDER BY a.nb_avis DESC, a.note_moy DESC LIMIT 12`),
  ]);

  res.json({ sponsorises, topNotes, nouveautes, tendances });
};

const list = async (req, res) => {
  const { q, categorie, sort, page = 1, limit = 24 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  let where  = ["a.statut = 'actif'"];
  const vals = [];

  if (q) { where.push("a.nom LIKE ?"); vals.push(`%${q}%`); }
  if (categorie && categorie !== "Tout") { where.push("a.categorie = ?"); vals.push(categorie); }

  const ORDER = {
    price_asc:  "a.prix ASC",
    price_desc: "a.prix DESC",
    rating:     "a.note_moy DESC",
    default:    "a.is_promoted DESC, a.created_at DESC",
  };
  const orderBy = ORDER[sort] || ORDER.default;

  const whereStr = where.length ? "WHERE " + where.join(" AND ") : "";

  const [rows] = await db.query(
    `SELECT a.id, a.nom, a.prix, a.prix_barre, a.stock, a.categorie, a.image,
            a.note_moy, a.nb_avis, a.is_promoted,
            b.nom AS boutique
     FROM articles a
     LEFT JOIN boutiques b ON b.user_id = a.fournisseur_id
     ${whereStr}
     ORDER BY ${orderBy}
     LIMIT ? OFFSET ?`,
    [...vals, parseInt(limit), offset]
  );

  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) AS total FROM articles a ${whereStr}`,
    vals
  );

  res.json({ data: rows, total, page: parseInt(page), limit: parseInt(limit) });
};

const getOne = async (req, res) => {
  const [rows] = await db.query(
    `SELECT a.*, b.nom AS boutique, b.description AS boutique_desc
     FROM articles a
     LEFT JOIN boutiques b ON b.user_id = a.fournisseur_id
     WHERE a.id = ? AND a.statut = 'actif'`,
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ message: "Article introuvable" });

  const [avis] = await db.query(
    `SELECT av.note, av.commentaire, av.created_at, u.prenom
     FROM avis av
     JOIN users u ON u.id = av.client_id
     WHERE av.article_id = ?
     ORDER BY av.created_at DESC
     LIMIT 10`,
    [req.params.id]
  );

  res.json({ ...rows[0], avis });
};

const myArticles = async (req, res) => {
  const [rows] = await db.query(
    `SELECT id, nom, prix, stock, categorie, image, statut, is_promoted, note_moy, nb_avis, created_at
     FROM articles WHERE fournisseur_id = ? ORDER BY created_at DESC`,
    [req.user.id]
  );
  res.json(rows);
};

const create = async (req, res) => {
  const { nom, description, prix, prixBarre, stock, categorie } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const [result] = await db.query(
    `INSERT INTO articles (fournisseur_id, nom, description, prix, prix_barre, stock, categorie, image)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [req.user.id, nom, description || null, prix, prixBarre || null, stock, categorie, image]
  );
  res.status(201).json({ id: result.insertId, message: "Article créé" });
};

const update = async (req, res) => {
  const { nom, description, prix, prixBarre, stock, categorie } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : undefined;

  const fields = ["nom=?", "description=?", "prix=?", "prix_barre=?", "stock=?", "categorie=?"];
  const vals   = [nom, description || null, prix, prixBarre || null, stock, categorie];

  if (image !== undefined) { fields.push("image=?"); vals.push(image); }

  vals.push(req.params.id, req.user.id);

  await db.query(
    `UPDATE articles SET ${fields.join(",")} WHERE id=? AND fournisseur_id=?`,
    vals
  );
  res.json({ message: "Article mis à jour" });
};

const remove = async (req, res) => {
  await db.query("DELETE FROM articles WHERE id=? AND fournisseur_id=?", [req.params.id, req.user.id]);
  res.json({ message: "Article supprimé" });
};

const adminToggle = async (req, res) => {
  const [rows] = await db.query("SELECT statut FROM articles WHERE id=?", [req.params.id]);
  if (!rows.length) return res.status(404).json({ message: "Article introuvable" });
  const next = rows[0].statut === "actif" ? "suspendu" : "actif";
  await db.query("UPDATE articles SET statut=? WHERE id=?", [next, req.params.id]);
  res.json({ statut: next });
};

const adminListAll = async (req, res) => {
  const { q, categorie, statut: statutFilter, page = 1, limit = 30 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const where = [];
  const vals  = [];
  if (q)                                     { where.push("(a.nom LIKE ? OR b.nom LIKE ?)"); vals.push(`%${q}%`, `%${q}%`); }
  if (categorie && categorie !== "all")      { where.push("a.categorie = ?"); vals.push(categorie); }
  if (statutFilter && statutFilter !== "all"){ where.push("a.statut = ?");    vals.push(statutFilter); }
  const whereStr = where.length ? "WHERE " + where.join(" AND ") : "";
  const [rows] = await db.query(
    `SELECT a.id, a.nom, a.prix, a.stock, a.categorie, a.image, a.statut, a.created_at,
            b.nom AS fournisseur
     FROM articles a
     LEFT JOIN boutiques b ON b.user_id = a.fournisseur_id
     ${whereStr}
     ORDER BY a.created_at DESC
     LIMIT ? OFFSET ?`,
    [...vals, parseInt(limit), offset]
  );
  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) AS total FROM articles a JOIN boutiques b ON b.user_id = a.fournisseur_id ${whereStr}`,
    vals
  );
  res.json({ data: rows, total });
};

/* ── Enregistrement d'une vue (public) ── */
const recordView = async (req, res) => {
  const id = parseInt(req.params.id);
  if (!isNaN(id)) {
    await db.query("INSERT INTO article_views (article_id) VALUES (?)", [id]);
  }
  res.json({ ok: true });
};

/* ── Stats fournisseur : vues ce mois + acheteurs exposés ── */
const PACK_REACH = { starter: 1000, pro: 15000, elite: 40000 };

const myStats = async (req, res) => {
  const userId = req.user.id;

  const [[{ vues_mois }]] = await db.query(`
    SELECT COUNT(*) AS vues_mois
    FROM article_views av
    JOIN articles a ON a.id = av.article_id
    WHERE a.fournisseur_id = ?
      AND av.viewed_at >= DATE_FORMAT(NOW(), '%Y-%m-01')
  `, [userId]);

  const [promos] = await db.query(
    `SELECT pack FROM promotions
     WHERE fournisseur_id = ? AND statut = 'actif' AND date_fin >= CURDATE()`,
    [userId]
  );
  const acheteurs = promos.reduce((sum, p) => sum + (PACK_REACH[p.pack] || 0), 0);

  res.json({ vues_mois: Number(vues_mois), acheteurs });
};

module.exports = { homepage, list, getOne, myArticles, create, update, remove, adminToggle, adminListAll, recordView, myStats };
