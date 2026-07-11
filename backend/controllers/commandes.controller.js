const db     = require("../config/db");
const { sendEmail }              = require("../services/email.service");
const { createOrderPaymentIntent } = require("../services/stripe.service");

const genRef = () => "SL-" + Math.random().toString(36).slice(2, 8).toUpperCase();

const create = async (req, res) => {
  const { items, adresse, modePaiement } = req.body;
  const clientId = req.user.id;

  // Vérifier stock et récupérer prix réels (OWASP A04 — ne pas faire confiance au prix du client)
  const ids = items.map((i) => i.articleId);
  const [articles] = await db.query(
    `SELECT id, prix, stock, nom, fournisseur_id FROM articles WHERE id IN (?) AND statut='actif'`,
    [ids]
  );
  const artMap = Object.fromEntries(articles.map((a) => [a.id, a]));

  let total = 0;
  for (const item of items) {
    const art = artMap[item.articleId];
    if (!art)              return res.status(400).json({ message: `Article ${item.articleId} introuvable` });
    if (art.stock < item.qty) return res.status(400).json({ message: `Stock insuffisant pour "${art.nom}"` });
    total += parseFloat(art.prix) * item.qty;
  }

  const ref = genRef();
  let stripeClientSecret = null;

  // Stripe PaymentIntent si paiement en ligne
  if (modePaiement === "stripe") {
    const pi = await createOrderPaymentIntent(total, ref);
    stripeClientSecret = pi.client_secret;
  }

  const conn = await db.getConnection();
  await conn.beginTransaction();
  try {
    const [cmd] = await conn.query(
      `INSERT INTO commandes (ref, client_id, prenom_livr, nom_livr, telephone_livr, ville_livr, adresse_livr, mode_paiement, total, stripe_pi_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [ref, clientId, adresse.prenom, adresse.nom, adresse.telephone, adresse.ville, adresse.adresse,
       modePaiement, total, stripeClientSecret ? stripeClientSecret.split("_secret")[0] : null]
    );
    const cmdId = cmd.insertId;

    for (const item of items) {
      const art = artMap[item.articleId];
      await conn.query(
        `INSERT INTO commande_items (commande_id, article_id, fournisseur_id, nom_article, prix_unitaire, quantite)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [cmdId, art.id, art.fournisseur_id, art.nom, art.prix, item.qty]
      );
      await conn.query("UPDATE articles SET stock = stock - ? WHERE id=?", [item.qty, art.id]);
    }

    await conn.commit();
    conn.release();

    // Email de confirmation asynchrone
    const [[{ email, prenom }]] = await db.query("SELECT email, prenom FROM users WHERE id=?", [clientId]);
    sendEmail(email, "commande_confirmee", { ref, prenom, total: total.toFixed(2) }).catch(() => {});

    res.status(201).json({ ref, cmdId, total, stripeClientSecret });
  } catch (e) {
    await conn.rollback();
    conn.release();
    throw e;
  }
};

const myOrders = async (req, res) => {
  const [rows] = await db.query(
    `SELECT c.id, c.ref, c.statut, c.total, c.mode_paiement, c.created_at,
            c.ville_livr, c.adresse_livr
     FROM commandes c
     WHERE c.client_id = ?
     ORDER BY c.created_at DESC`,
    [req.user.id]
  );

  for (const cmd of rows) {
    const [items] = await db.query(
      `SELECT ci.nom_article, ci.prix_unitaire, ci.quantite, a.image
       FROM commande_items ci
       LEFT JOIN articles a ON a.id = ci.article_id
       WHERE ci.commande_id = ?`,
      [cmd.id]
    );
    cmd.items = items;
    // Si livré → peut laisser avis (vérifier qu'il n'en a pas déjà)
    if (cmd.statut === "livre") {
      const [avRows] = await db.query(
        `SELECT article_id FROM avis WHERE commande_id=? AND client_id=?`,
        [cmd.id, req.user.id]
      );
      cmd.articlesAvisRestants = items
        .map((i) => i.article_id)
        .filter((id) => !avRows.find((av) => av.article_id === id));
      cmd.canReturn = true;
    }
  }

  res.json(rows);
};

const adminList = async (req, res) => {
  const { statut, q, page = 1, limit = 20 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const where = [];
  const vals  = [];

  if (statut) { where.push("c.statut=?"); vals.push(statut); }
  if (q)      { where.push("(c.ref LIKE ? OR u.email LIKE ?)"); vals.push(`%${q}%`, `%${q}%`); }

  const whereStr = where.length ? "WHERE " + where.join(" AND ") : "";

  const [rows] = await db.query(
    `SELECT c.id, c.ref, c.statut, c.total, c.mode_paiement, c.created_at,
            CONCAT(u.prenom,' ',u.nom) AS client, u.email AS client_email
     FROM commandes c
     JOIN users u ON u.id = c.client_id
     ${whereStr}
     ORDER BY c.created_at DESC
     LIMIT ? OFFSET ?`,
    [...vals, parseInt(limit), offset]
  );

  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) AS total FROM commandes c JOIN users u ON u.id = c.client_id ${whereStr}`,
    vals
  );

  res.json({ data: rows, total });
};

const advance = async (req, res) => {
  const NEXT = {
    en_attente:     "en_preparation",
    en_preparation: "expedie",
    expedie:        "livre",
  };
  const [rows] = await db.query("SELECT statut, client_id, ref FROM commandes WHERE id=?", [req.params.id]);
  if (!rows.length) return res.status(404).json({ message: "Commande introuvable" });

  const next = NEXT[rows[0].statut];
  if (!next) return res.status(400).json({ message: "Statut final atteint" });

  await db.query("UPDATE commandes SET statut=? WHERE id=?", [next, req.params.id]);

  const [[{ email, prenom }]] = await db.query("SELECT email, prenom FROM users WHERE id=?", [rows[0].client_id]);
  const tplMap = { expedie: "commande_expediee", livre: "commande_livree" };
  if (tplMap[next]) sendEmail(email, tplMap[next], { ref: rows[0].ref, prenom }).catch(() => {});

  res.json({ statut: next });
};

module.exports = { create, myOrders, adminList, advance };
