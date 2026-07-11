const db     = require("../config/db");
const { createPromoPaymentIntent, PACK_PRICES } = require("../services/stripe.service");

const DUREES = { starter: 7, pro: 15, elite: 30 };

const create = async (req, res) => {
  const { articleId, pack } = req.body;
  const userId = req.user.id;

  if (!PACK_PRICES[pack]) return res.status(400).json({ message: "Pack invalide" });

  // Vérifier que l'article appartient au fournisseur
  const [rows] = await db.query(
    "SELECT id FROM articles WHERE id=? AND fournisseur_id=? AND statut='actif'",
    [articleId, userId]
  );
  if (!rows.length) return res.status(403).json({ message: "Article introuvable" });

  const duree = DUREES[pack];
  const debut = new Date();
  const fin   = new Date(debut.getTime() + duree * 24 * 60 * 60 * 1000);

  const [result] = await db.query(
    `INSERT INTO promotions (fournisseur_id, article_id, pack, montant, date_debut, date_fin)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, articleId, pack, PACK_PRICES[pack] / 100, debut.toISOString().slice(0, 10), fin.toISOString().slice(0, 10)]
  );

  const pi = await createPromoPaymentIntent(pack, result.insertId);

  res.status(201).json({ promoId: result.insertId, clientSecret: pi.client_secret });
};

const confirmPayment = async (req, res) => {
  const { promoId } = req.body;
  const [rows] = await db.query("SELECT id, article_id FROM promotions WHERE id=? AND fournisseur_id=?", [promoId, req.user.id]);
  if (!rows.length) return res.status(404).json({ message: "Promotion introuvable" });

  await db.query("UPDATE articles SET is_promoted=1 WHERE id=?", [rows[0].article_id]);
  res.json({ message: "Promotion activée" });
};

const myPromos = async (req, res) => {
  const [rows] = await db.query(
    `SELECT p.id, p.pack, p.montant, p.date_debut, p.date_fin, p.statut,
            a.nom AS article
     FROM promotions p
     JOIN articles a ON a.id = p.article_id
     WHERE p.fournisseur_id=?
     ORDER BY p.created_at DESC`,
    [req.user.id]
  );
  res.json(rows);
};

const adminList = async (req, res) => {
  const [rows] = await db.query(
    `SELECT p.id, p.pack, p.montant, p.date_debut, p.date_fin, p.statut,
            a.nom AS article,
            CONCAT(u.prenom,' ',u.nom) AS fournisseur
     FROM promotions p
     JOIN articles a ON a.id = p.article_id
     JOIN users u ON u.id = p.fournisseur_id
     ORDER BY p.created_at DESC`
  );
  res.json(rows);
};

const adminCancel = async (req, res) => {
  await db.query("UPDATE promotions SET statut='annulé' WHERE id=?", [req.params.id]);
  res.json({ message: "Promotion annulée" });
};

module.exports = { create, confirmPayment, myPromos, adminList, adminCancel };
