const db     = require("../config/db");
const { createPromoCheckoutSession, PACK_PRICES } = require("../services/stripe.service");

const DUREES = { starter: 7, pro: 30, elite: 60 };

/* ── Création d'une promo + Checkout Session Stripe ── */
const create = async (req, res) => {
  const { articleId, pack } = req.body;
  const userId = req.user.id;

  if (!PACK_PRICES[pack]) return res.status(400).json({ message: "Pack invalide" });

  const [rows] = await db.query(
    "SELECT id FROM articles WHERE id=? AND fournisseur_id=? AND statut='actif'",
    [articleId, userId]
  );
  if (!rows.length) return res.status(403).json({ message: "Article introuvable ou inactif" });

  const duree = DUREES[pack];
  const debut = new Date();
  const fin   = new Date(debut.getTime() + duree * 24 * 60 * 60 * 1000);

  // La promo est créée en statut 'annulé' — le webhook la passera en 'actif' après paiement
  const [result] = await db.query(
    `INSERT INTO promotions (fournisseur_id, article_id, pack, montant, date_debut, date_fin, statut)
     VALUES (?, ?, ?, ?, ?, ?, 'annulé')`,
    [userId, articleId, pack, PACK_PRICES[pack] / 100,
     debut.toISOString().slice(0, 10), fin.toISOString().slice(0, 10)]
  );
  const promoId = result.insertId;

  const base       = process.env.CLIENT_URL || "http://localhost:3000";
  const successUrl = `${base}/fournisseur/promotions?success=1&promoId=${promoId}`;
  const cancelUrl  = `${base}/fournisseur/promotions?cancel=1&promoId=${promoId}`;

  const session = await createPromoCheckoutSession(pack, promoId, successUrl, cancelUrl);

  res.status(201).json({ checkoutUrl: session.url });
};

const myPromos = async (req, res) => {
  const [rows] = await db.query(
    `SELECT p.id, p.pack, p.montant, p.date_debut, p.date_fin, p.statut,
            a.nom AS article, a.id AS article_id
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
  await db.query(
    `UPDATE articles SET is_promoted=0
     WHERE id = (SELECT article_id FROM promotions WHERE id=?)`,
    [req.params.id]
  );
  res.json({ message: "Promotion annulée" });
};

module.exports = { create, myPromos, adminList, adminCancel };
