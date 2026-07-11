const db     = require("../config/db");
const { sendEmail }       = require("../services/email.service");
const { refundPaymentIntent } = require("../services/stripe.service");

const genRef = () => "LIT-" + Math.random().toString(36).slice(2, 7).toUpperCase();

const create = async (req, res) => {
  const { commandeId, raison, description } = req.body;
  const clientId = req.user.id;

  // Commande livrée, appartenant au client, max 7 jours après livraison
  const [rows] = await db.query(
    `SELECT id, ref, total, stripe_pi_id, updated_at FROM commandes
     WHERE id=? AND client_id=? AND statut='livre'`,
    [commandeId, clientId]
  );
  if (!rows.length) return res.status(403).json({ message: "Commande non éligible" });

  const cmd = rows[0];
  const livraisonDate = new Date(cmd.updated_at);
  const delai = (Date.now() - livraisonDate.getTime()) / (1000 * 60 * 60 * 24);
  if (delai > 7) return res.status(400).json({ message: "Délai de retour de 7 jours dépassé" });

  const ref = genRef();
  const [[{ id: litigeId }]] = await db.query(
    `INSERT INTO litiges (ref, commande_id, client_id, raison, description) VALUES (?, ?, ?, ?, ?);
     SELECT LAST_INSERT_ID() AS id`,
    [ref, commandeId, clientId, raison, description]
  ).catch(async () => {
    const [r] = await db.query(
      "INSERT INTO litiges (ref, commande_id, client_id, raison, description) VALUES (?, ?, ?, ?, ?)",
      [ref, commandeId, clientId, raison, description]
    );
    return [[{ id: r.insertId }]];
  });

  const [[{ email, prenom }]] = await db.query("SELECT email, prenom FROM users WHERE id=?", [clientId]);
  sendEmail(email, "litige_recu", { ref, prenom, commande_ref: cmd.ref }).catch(() => {});

  res.status(201).json({ ref, message: "Litige enregistré" });
};

const adminList = async (req, res) => {
  const [rows] = await db.query(
    `SELECT l.id, l.ref, l.raison, l.description, l.statut, l.code_retrait, l.created_at,
            c.ref AS commande_ref, c.total, c.stripe_pi_id,
            CONCAT(u.prenom,' ',u.nom) AS client, u.email
     FROM litiges l
     JOIN commandes c ON c.id = l.commande_id
     JOIN users u ON u.id = l.client_id
     ORDER BY l.created_at DESC`
  );
  res.json(rows);
};

const resolve = async (req, res) => {
  const { codeRetrait } = req.body;
  const [rows] = await db.query(
    `SELECT l.*, c.stripe_pi_id, c.total, c.mode_paiement,
            u.email, u.prenom
     FROM litiges l
     JOIN commandes c ON c.id = l.commande_id
     JOIN users u ON u.id = l.client_id
     WHERE l.id=?`,
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ message: "Litige introuvable" });

  const l = rows[0];
  if (l.statut !== "ouvert" && l.statut !== "en_cours")
    return res.status(400).json({ message: "Litige déjà traité" });

  // Remboursement Stripe automatique si paiement en ligne
  let refundId = null;
  if (l.stripe_pi_id && l.mode_paiement === "stripe") {
    try {
      const refund = await refundPaymentIntent(l.stripe_pi_id, parseFloat(l.total));
      refundId = refund.id;
    } catch (e) {
      console.error("Stripe refund error:", e.message);
    }
  }

  await db.query(
    `UPDATE litiges SET statut='résolu', code_retrait=?, stripe_refund_id=?, montant_rembourse=? WHERE id=?`,
    [codeRetrait, refundId, l.total, req.params.id]
  );

  sendEmail(l.email, "litige_resolu", {
    ref: l.ref, prenom: l.prenom, code_retrait: codeRetrait, montant: l.total
  }).catch(() => {});

  res.json({ message: "Litige résolu, remboursement initié" });
};

const reject = async (req, res) => {
  await db.query("UPDATE litiges SET statut='rejeté' WHERE id=? AND statut IN ('ouvert','en_cours')", [req.params.id]);
  res.json({ message: "Litige rejeté" });
};

module.exports = { create, adminList, resolve, reject };
