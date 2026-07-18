const db     = require("../config/db");
const { sendEmail }             = require("../services/email.service");
const { retrieveCheckoutSession, refundPaymentIntent } = require("../services/stripe.service");

const genRef = () => "LIT-" + Math.random().toString(36).slice(2, 7).toUpperCase();

/* ── 1. Client ouvre un litige (<7j après livraison) ── */
const create = async (req, res) => {
  const { commandeId, raison, description } = req.body;
  const clientId = req.user.id;

  const [rows] = await db.query(
    `SELECT id, ref, total, stripe_pi_id, mode_paiement, updated_at FROM commandes
     WHERE id=? AND client_id=? AND statut='livre'`,
    [commandeId, clientId]
  );
  if (!rows.length) return res.status(403).json({ message: "Commande non éligible" });

  const cmd = rows[0];
  const delai = (Date.now() - new Date(cmd.updated_at).getTime()) / (1000 * 60 * 60 * 24);
  if (delai > 7) return res.status(400).json({ message: "Délai de retour de 7 jours dépassé" });

  const ref = genRef();
  const [result] = await db.query(
    "INSERT INTO litiges (ref, commande_id, client_id, raison, description) VALUES (?, ?, ?, ?, ?)",
    [ref, commandeId, clientId, raison, description]
  );
  void result;

  const [[{ email, prenom }]] = await db.query("SELECT email, prenom FROM users WHERE id=?", [clientId]);
  sendEmail(email, "litige_recu", { ref, prenom, commande_ref: cmd.ref }).catch(() => {});

  res.status(201).json({ ref, message: "Litige enregistré" });
};

/* ── 2. Admin : liste de tous les litiges ── */
const adminList = async (req, res) => {
  const [rows] = await db.query(
    `SELECT l.id, l.ref, l.raison, l.description, l.statut, l.code_retrait, l.created_at, l.livreur_id,
            c.ref AS commande_ref, c.total, c.stripe_pi_id, c.mode_paiement,
            c.adresse_livr, c.ville_livr, c.telephone_livr,
            c.updated_at AS date_livraison,
            CONCAT(u.prenom,' ',u.nom) AS client, u.email,
            CONCAT(lv.prenom,' ',lv.nom) AS livreur_nom
     FROM litiges l
     JOIN commandes c  ON c.id  = l.commande_id
     JOIN users u      ON u.id  = l.client_id
     LEFT JOIN users lv ON lv.id = l.livreur_id
     ORDER BY l.created_at DESC`
  );
  res.json(rows);
};

/* ── 3. Admin valide le litige → notifie le livreur ── */
const adminValidate = async (req, res) => {
  const [rows] = await db.query(
    `SELECT l.*, c.ref AS commande_ref, c.livreur_id AS cmd_livreur_id,
            c.adresse_livr, c.ville_livr, c.telephone_livr,
            CONCAT(u.prenom,' ',u.nom) AS client_nom
     FROM litiges l
     JOIN commandes c ON c.id = l.commande_id
     JOIN users u     ON u.id = l.client_id
     WHERE l.id=? AND l.statut='ouvert'`,
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ message: "Litige introuvable ou déjà traité" });

  const l = rows[0];
  const livreurId = l.cmd_livreur_id;
  if (!livreurId) return res.status(400).json({ message: "Aucun livreur assigné à cette commande" });

  await db.query(
    "UPDATE litiges SET statut='validé', livreur_id=? WHERE id=?",
    [livreurId, l.id]
  );

  // Email au livreur
  const [[lv]] = await db.query("SELECT email, prenom FROM users WHERE id=?", [livreurId]);
  if (lv) {
    sendEmail(lv.email, "litige_livreur_pickup", {
      ref:        l.ref,
      client_nom: l.client_nom,
      adresse:    l.adresse_livr,
      ville:      l.ville_livr,
      telephone:  l.telephone_livr,
    }).catch(() => {});
  }

  res.json({ message: "Litige validé, livreur notifié" });
};

/* ── 4. Livreur : liste des litiges à récupérer ── */
const livreurList = async (req, res) => {
  const [rows] = await db.query(
    `SELECT l.id, l.ref, l.raison, l.description, l.statut, l.created_at,
            c.ref AS commande_ref, c.adresse_livr, c.ville_livr, c.telephone_livr,
            CONCAT(u.prenom,' ',u.nom) AS client_nom
     FROM litiges l
     JOIN commandes c ON c.id = l.commande_id
     JOIN users u     ON u.id = l.client_id
     WHERE l.livreur_id=? AND l.statut='validé'
     ORDER BY l.created_at DESC`,
    [req.user.id]
  );
  res.json(rows);
};

/* ── 5. Livreur confirme la récupération → notifie client + admin ── */
const livreurRecupere = async (req, res) => {
  const [rows] = await db.query(
    `SELECT l.*, c.ref AS commande_ref, c.mode_paiement,
            CONCAT(u.prenom,' ',u.nom) AS client_nom, u.email AS client_email, u.prenom AS client_prenom
     FROM litiges l
     JOIN commandes c ON c.id = l.commande_id
     JOIN users u     ON u.id = l.client_id
     WHERE l.id=? AND l.livreur_id=? AND l.statut='validé'`,
    [req.params.id, req.user.id]
  );
  if (!rows.length) return res.status(404).json({ message: "Litige introuvable" });

  const l = rows[0];

  await db.query("UPDATE litiges SET statut='recuperé' WHERE id=?", [l.id]);
  await db.query("UPDATE commandes SET statut='retourné' WHERE id=?", [l.commande_id]);

  // Email au client
  sendEmail(l.client_email, "litige_client_recupere", {
    ref:           l.ref,
    prenom:        l.client_prenom,
    commande_ref:  l.commande_ref,
    mode_paiement: l.mode_paiement,
  }).catch(() => {});

  // Email à l'admin
  const [[admin]] = await db.query(
    "SELECT u.email FROM users u JOIN user_roles ur ON ur.user_id=u.id WHERE ur.role='admin' LIMIT 1"
  );
  if (admin) {
    sendEmail(admin.email, "litige_admin_action", {
      ref:           l.ref,
      commande_ref:  l.commande_ref,
      client_nom:    l.client_nom,
      mode_paiement: l.mode_paiement,
    }).catch(() => {});
  }

  res.json({ message: "Récupération confirmée" });
};

/* ── 6. Admin clôture le litige ── */
const resolve = async (req, res) => {
  const { codeRetrait } = req.body;

  const [rows] = await db.query(
    `SELECT l.*, c.stripe_pi_id, c.total, c.mode_paiement,
            u.email, u.prenom
     FROM litiges l
     JOIN commandes c ON c.id = l.commande_id
     JOIN users u     ON u.id = l.client_id
     WHERE l.id=? AND l.statut='recuperé'`,
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ message: "Litige introuvable ou non récupéré" });

  const l = rows[0];

  if (l.mode_paiement === "stripe") {
    // Remboursement Stripe automatique
    let refundId = null;
    try {
      const session = await retrieveCheckoutSession(l.stripe_pi_id);
      const piId    = session.payment_intent;
      if (piId) {
        const refund = await refundPaymentIntent(piId, parseFloat(l.total));
        refundId = refund.id;
      }
    } catch (e) {
      console.error("Stripe refund error:", e.message);
    }
    await db.query(
      "UPDATE litiges SET statut='résolu', stripe_refund_id=?, montant_rembourse=? WHERE id=?",
      [refundId, l.total, l.id]
    );
    sendEmail(l.email, "litige_resolu_stripe", {
      ref: l.ref, prenom: l.prenom, montant: Number(l.total).toFixed(2),
    }).catch(() => {});

  } else {
    // Cash : admin entre le code de retrait manuellement
    if (!codeRetrait?.trim()) return res.status(400).json({ message: "Code de retrait requis" });
    await db.query(
      "UPDATE litiges SET statut='résolu', code_retrait=?, montant_rembourse=? WHERE id=?",
      [codeRetrait.trim(), l.total, l.id]
    );
    sendEmail(l.email, "litige_resolu", {
      ref: l.ref, prenom: l.prenom,
      code_retrait: codeRetrait.trim(), montant: Number(l.total).toFixed(2),
    }).catch(() => {});
  }

  res.json({ message: "Litige clôturé" });
};

/* ── 7. Admin rejette le litige ── */
const reject = async (req, res) => {
  await db.query(
    "UPDATE litiges SET statut='rejeté' WHERE id=? AND statut IN ('ouvert','validé')",
    [req.params.id]
  );
  res.json({ message: "Litige rejeté" });
};

module.exports = { create, adminList, adminValidate, livreurList, livreurRecupere, resolve, reject };
