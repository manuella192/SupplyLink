const db     = require("../config/db");
const { sendEmail }                                        = require("../services/email.service");
const { createOrderCheckoutSession, retrieveCheckoutSession } = require("../services/stripe.service");

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

  const conn = await db.getConnection();
  await conn.beginTransaction();
  try {
    const [cmd] = await conn.query(
      `INSERT INTO commandes (ref, client_id, prenom_livr, nom_livr, telephone_livr, ville_livr, adresse_livr, mode_paiement, total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [ref, clientId, adresse.prenom, adresse.nom, adresse.telephone, adresse.ville, adresse.adresse, modePaiement, total]
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

    // Email de confirmation : uniquement pour cash (Stripe → envoyé après paiement confirmé)
    if (modePaiement === "cash") {
      sendEmail(email, "commande_confirmee", { ref, prenom, total: total.toFixed(2) }).catch(() => {});
    }

    // Pour paiement cash → confirmation directe
    // Pour paiement stripe → on crée la Checkout Session et on renvoie l'URL
    let checkoutUrl = null;
    if (modePaiement === "stripe") {
      const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
      const session = await createOrderCheckoutSession(
        total, ref, cmdId,
        `${clientUrl}/commandes?stripe=ok&ref=${ref}&session_id={CHECKOUT_SESSION_ID}`,
        `${clientUrl}/`
      );
      checkoutUrl = session.url;
      await db.query("UPDATE commandes SET stripe_pi_id=? WHERE id=?", [session.id, cmdId]);
    }

    res.status(201).json({ ref, cmdId, total, checkoutUrl });
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
      `SELECT ci.article_id, ci.nom_article, ci.prix_unitaire, ci.quantite, a.image
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

// Créneaux fixes : 09:00 | 10:30 | 12:00 | 13:30 | 15:00
const SLOT_MINS = [9*60, 10*60+30, 12*60, 13*60+30, 15*60];
const BUFFER_MIN = 60; // délai minimum (en min) entre maintenant et la livraison
const pad2 = (n) => String(n).padStart(2, "0");
const isWeekend = (d) => d.getDay() === 0 || d.getDay() === 6; // 0=dim, 6=sam

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

  const now    = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();

  // Parcourt les jours ouvrables jusqu'à trouver un créneau libre
  const cursor = new Date(now);
  for (let attempt = 0; attempt < 30; attempt++) {
    if (isWeekend(cursor)) { cursor.setDate(cursor.getDate() + 1); continue; }

    const isToday = cursor.toDateString() === now.toDateString();
    const dateStr = `${cursor.getFullYear()}-${pad2(cursor.getMonth()+1)}-${pad2(cursor.getDate())}`;

    for (const l of livreurs) {
      const [taken] = await db.query(
        `SELECT heure_livraison FROM commandes WHERE livreur_id=? AND DATE(heure_livraison)=?`,
        [l.id, dateStr]
      );

      // Extrait les minutes des créneaux déjà pris (sans dépendance timezone)
      const takenMins = new Set(taken.map((r) => {
        const t = String(r.heure_livraison).split(" ")[1] || "00:00";
        const [hh, mm] = t.split(":").map(Number);
        return hh * 60 + (mm || 0);
      }));

      for (const slotMin of SLOT_MINS) {
        // Aujourd'hui : ignorer les créneaux passés ou trop proches
        if (isToday && slotMin < nowMin + BUFFER_MIN) continue;
        // Ignorer les créneaux déjà pris pour ce livreur
        if (takenMins.has(slotMin)) continue;

        // Créneau trouvé → on l'assigne
        const heureLivraison = `${dateStr} ${pad2(Math.floor(slotMin/60))}:${pad2(slotMin%60)}:00`;
        await db.query(
          "UPDATE commandes SET statut='expedie', livreur_id=?, heure_livraison=? WHERE id=?",
          [l.id, heureLivraison, commandeId]
        );
        return heureLivraison;
      }
    }

    // Aucun créneau disponible ce jour → jour suivant
    cursor.setDate(cursor.getDate() + 1);
  }

  // Fallback : aucun livreur dispo dans les 30 jours
  await db.query("UPDATE commandes SET statut='expedie' WHERE id=?", [commandeId]);
  return null;
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
  const isLivreurOnly = req.user.roles.includes("livreur") && !req.user.roles.includes("fournisseur") && !req.user.roles.includes("admin");
  if (isLivreurOnly) {
    if (statut !== "expedie")       return res.status(403).json({ message: "Vous ne pouvez que confirmer vos livraisons" });
    if (livreur_id !== req.user.id) return res.status(403).json({ message: "Cette livraison ne vous est pas assignée" });
  }

  // Restriction fournisseur : uniquement en_attente→en_preparation et en_preparation→expedie,
  // et seulement pour les commandes contenant leurs articles
  const isFournisseurOnly = req.user.roles.includes("fournisseur") && !req.user.roles.includes("admin");
  if (isFournisseurOnly) {
    if (statut === "expedie") return res.status(403).json({ message: "La confirmation de livraison est réservée au livreur" });
    const [[{ cnt }]] = await db.query(
      "SELECT COUNT(*) AS cnt FROM commande_items WHERE commande_id=? AND fournisseur_id=?",
      [req.params.id, req.user.id]
    );
    if (!Number(cnt)) return res.status(403).json({ message: "Cette commande ne contient pas vos articles" });
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
     WHERE c.livreur_id = ? AND c.statut IN ('expedie','livre','retourné')
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

/* ── Vérification paiement Stripe au retour du Checkout ── */
const verifyStripePayment = async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ message: "sessionId requis" });

  const session = await retrieveCheckoutSession(sessionId);
  if (session.payment_status !== "paid") return res.json({ ok: false });

  const ref = session.metadata?.ref;
  if (ref) {
    const [result] = await db.query(
      "UPDATE commandes SET statut='en_preparation' WHERE ref=? AND statut='en_attente' AND mode_paiement='stripe'",
      [ref]
    );
    // Si affectedRows > 0, c'est nous qui mettons à jour en premier → on envoie l'email
    if (result.affectedRows > 0) {
      const [[cmd]] = await db.query(
        "SELECT c.total, u.email, u.prenom FROM commandes c JOIN users u ON u.id=c.client_id WHERE c.ref=?",
        [ref]
      );
      if (cmd) {
        sendEmail(cmd.email, "commande_confirmee", { ref, prenom: cmd.prenom, total: Number(cmd.total).toFixed(2) })
          .catch(() => {});
      }
    }
  }
  res.json({ ok: true, ref });
};

module.exports = { create, myOrders, adminList, advance, fournisseurOrders, fournisseurStats, livreurOrders, verifyStripePayment };
