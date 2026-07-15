const db     = require("../config/db");
const { sendEmail }              = require("../services/email.service");
const { createOrderPaymentIntent } = require("../services/stripe.service");

const genRef = () => "SL-" + Math.random().toString(36).slice(2, 8).toUpperCase();

/* ── Crée la commande + PaymentIntent Stripe si besoin ── */
const create = async (req, res) => {
  const { items, adresse, modePaiement } = req.body;
  const clientId = req.user.id;

  const ids = items.map((i) => i.articleId);
  const [articles] = await db.query(
    `SELECT id, prix, stock, nom, fournisseur_id FROM articles WHERE id IN (?) AND statut='actif'`,
    [ids]
  );
  const artMap = Object.fromEntries(articles.map((a) => [a.id, a]));

  let total = 0;
  for (const item of items) {
    const art = artMap[item.articleId];
    if (!art)               return res.status(400).json({ message: `Article ${item.articleId} introuvable` });
    if (art.stock < item.qty) return res.status(400).json({ message: `Stock insuffisant pour "${art.nom}"` });
    total += parseFloat(art.prix) * item.qty;
  }

  const ref = genRef();
  let stripeClientSecret = null;

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

    const [[{ email, prenom }]] = await db.query("SELECT email, prenom FROM users WHERE id=?", [clientId]);
    sendEmail(email, "commande_confirmee", { ref, prenom, total: total.toFixed(2) }).catch(() => {});

    res.status(201).json({ ref, cmdId, total, stripeClientSecret });
  } catch (e) {
    await conn.rollback();
    conn.release();
    throw e;
  }
};

/* ── Commandes du client ── */
const myOrders = async (req, res) => {
  const [rows] = await db.query(
    `SELECT c.id, c.ref, c.statut, c.total, c.mode_paiement, c.created_at,
            c.ville_livr, c.adresse_livr, c.heure_livraison
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

/* ── Liste admin ── */
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
            c.heure_livraison,
            CONCAT(u.prenom,' ',u.nom) AS client, u.email AS client_email,
            IF(c.livreur_id IS NOT NULL, CONCAT(l.prenom,' ',l.nom), NULL) AS livreur_nom
     FROM commandes c
     JOIN users u ON u.id = c.client_id
     LEFT JOIN users l ON l.id = c.livreur_id
     ${whereStr}
     ORDER BY c.created_at DESC
     LIMIT ? OFFSET ?`,
    [...vals, parseInt(limit), offset]
  );

  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) AS total FROM commandes c JOIN users u ON u.id = c.client_id ${whereStr}`,
    vals
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
  }

  res.json({ data: rows, total });
};

/* ── Auto-assignation livreur + créneau horaire ── */
const assignLivreur = async (commandeId) => {
  const [livreurs] = await db.query(
    `SELECT u.id FROM users u
     JOIN user_roles ur ON ur.user_id = u.id AND ur.role = 'livreur'
     WHERE u.statut = 'actif'
     ORDER BY u.id`
  );

  if (!livreurs.length) {
    await db.query("UPDATE commandes SET statut='expedie' WHERE id=?", [commandeId]);
    return null;
  }

  const today = new Date().toISOString().slice(0, 10);
  let selectedId = null;
  let slotIndex  = 0;
  let delivDate  = today;

  for (const l of livreurs) {
    const [[{ cnt }]] = await db.query(
      `SELECT COUNT(*) AS cnt FROM commandes WHERE livreur_id=? AND DATE(heure_livraison)=?`,
      [l.id, today]
    );
    if (Number(cnt) < 5) { selectedId = l.id; slotIndex = Number(cnt); break; }
  }

  // Tous pleins aujourd'hui → demain, premier livreur, créneau 0
  if (!selectedId) {
    const tmrw = new Date(); tmrw.setDate(tmrw.getDate() + 1);
    delivDate  = tmrw.toISOString().slice(0, 10);
    selectedId = livreurs[0].id;
    slotIndex  = 0;
  }

  // 9h00 + n × 90 min  (5 créneaux sur 9h→16h30)
  const totalMin = 9 * 60 + slotIndex * 90;
  const h = String(Math.floor(totalMin / 60)).padStart(2, "0");
  const m = String(totalMin % 60).padStart(2, "0");
  const heureLivraison = `${delivDate} ${h}:${m}:00`;

  await db.query(
    "UPDATE commandes SET statut='expedie', livreur_id=?, heure_livraison=? WHERE id=?",
    [selectedId, heureLivraison, commandeId]
  );

  return heureLivraison;
};

/* ── Avancement statut ── */
const advance = async (req, res) => {
  const NEXT = {
    en_attente:     "en_preparation",
    en_preparation: "expedie",
    expedie:        "livre",
  };

  const [rows] = await db.query(
    "SELECT statut, client_id, ref, livreur_id FROM commandes WHERE id=?",
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ message: "Commande introuvable" });

  const { statut, client_id, ref, livreur_id } = rows[0];
  const next = NEXT[statut];
  if (!next) return res.status(400).json({ message: "Statut final atteint" });

  // Restriction livreur : uniquement expedie→livre sur ses propres commandes
  const isLivreurOnly = req.user.roles.includes("livreur") && !req.user.roles.includes("admin");
  if (isLivreurOnly) {
    if (statut !== "expedie")       return res.status(403).json({ message: "Vous ne pouvez que confirmer vos livraisons" });
    if (livreur_id !== req.user.id) return res.status(403).json({ message: "Cette livraison ne vous est pas assignée" });
  }

  let heureLivraison = null;

  if (next === "expedie") {
    heureLivraison = await assignLivreur(req.params.id);
  } else {
    await db.query("UPDATE commandes SET statut=? WHERE id=?", [next, req.params.id]);
  }

  // Emails à chaque transition
  const [[{ email, prenom }]] = await db.query("SELECT email, prenom FROM users WHERE id=?", [client_id]);
  const emailMap = {
    en_preparation: "commande_en_preparation",
    expedie:        "commande_expediee",
    livre:          "commande_livree",
  };
  if (emailMap[next]) {
    const emailData = { ref, prenom };
    if (next === "expedie" && heureLivraison) {
      emailData.heureLivraison = new Date(heureLivraison).toLocaleString("fr-MA", {
        weekday: "long", day: "numeric", month: "long",
        hour: "2-digit", minute: "2-digit",
      });
    }
    sendEmail(email, emailMap[next], emailData).catch(() => {});
  }

  res.json({ statut: next });
};

/* ── Commandes fournisseur ── */
const fournisseurOrders = async (req, res) => {
  const fid = req.user.id;
  const [rows] = await db.query(
    `SELECT c.id, c.ref, c.statut, c.total, c.mode_paiement, c.created_at,
            c.prenom_livr, c.nom_livr, c.telephone_livr, c.ville_livr, c.adresse_livr,
            c.heure_livraison,
            CONCAT(u.prenom,' ',u.nom) AS client_nom, u.telephone AS client_tel
     FROM commandes c
     JOIN users u ON u.id = c.client_id
     WHERE c.id IN (SELECT DISTINCT commande_id FROM commande_items WHERE fournisseur_id = ?)
     ORDER BY c.created_at DESC`,
    [fid]
  );
  for (const cmd of rows) {
    const [items] = await db.query(
      `SELECT ci.nom_article, ci.prix_unitaire, ci.quantite, a.image
       FROM commande_items ci
       LEFT JOIN articles a ON a.id = ci.article_id
       WHERE ci.commande_id = ? AND ci.fournisseur_id = ?`,
      [cmd.id, fid]
    );
    cmd.items = items;
  }
  res.json(rows);
};

/* ── Stats fournisseur ── */
const fournisseurStats = async (req, res) => {
  const fid = req.user.id;
  const [[stats]] = await db.query(
    `SELECT COUNT(DISTINCT c.id) AS nb_commandes,
            COALESCE(SUM(ci.prix_unitaire * ci.quantite), 0) AS ca_total
     FROM commande_items ci
     JOIN commandes c ON c.id = ci.commande_id
     WHERE ci.fournisseur_id = ?`,
    [fid]
  );
  const [[arts]] = await db.query(
    `SELECT COUNT(*) AS nb_articles,
            COALESCE(ROUND(AVG(note_moy), 1), 0) AS note_moy
     FROM articles WHERE fournisseur_id = ? AND statut = 'actif'`,
    [fid]
  );
  res.json({
    nb_commandes: Number(stats.nb_commandes),
    ca_total:     Number(stats.ca_total),
    nb_articles:  Number(arts.nb_articles),
    note_moy:     Number(arts.note_moy),
  });
};

/* ── Livraisons du livreur ── */
const livreurOrders = async (req, res) => {
  const lid = req.user.id;
  const [rows] = await db.query(
    `SELECT c.id, c.ref, c.statut, c.heure_livraison,
            c.prenom_livr, c.nom_livr, c.telephone_livr, c.ville_livr, c.adresse_livr,
            CONCAT(u.prenom,' ',u.nom) AS client_nom, u.telephone AS client_tel
     FROM commandes c
     JOIN users u ON u.id = c.client_id
     WHERE c.livreur_id = ? AND c.statut IN ('expedie','livre')
     ORDER BY c.heure_livraison ASC`,
    [lid]
  );
  for (const cmd of rows) {
    const [items] = await db.query(
      `SELECT ci.nom_article, ci.quantite FROM commande_items ci WHERE ci.commande_id = ?`,
      [cmd.id]
    );
    cmd.items = items;
  }
  res.json(rows);
};

module.exports = { create, myOrders, adminList, advance, fournisseurOrders, fournisseurStats, livreurOrders };
