const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST || "smtp.gmail.com",
  port:   parseInt(process.env.SMTP_PORT || "465"),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = process.env.EMAIL_FROM || '"SupplyLink" <no-reply@supplylink.ma>';

const TEMPLATES = {
  commande_confirmee: (d) => ({
    subject: `Commande ${d.ref} confirmée`,
    html: `
      <h2 style="color:#009fe3">Commande confirmée !</h2>
      <p>Bonjour ${d.prenom},</p>
      <p>Votre commande <strong>${d.ref}</strong> a bien été reçue et est en cours de traitement.</p>
      <p>Total : <strong>${d.total} dh</strong></p>
      <p>Vous recevrez un email à chaque étape de votre livraison.</p>
    `,
  }),
  commande_en_preparation: (d) => ({
    subject: `Commande ${d.ref} en préparation`,
    html: `
      <h2 style="color:#009fe3">Votre commande est en préparation !</h2>
      <p>Bonjour ${d.prenom},</p>
      <p>La commande <strong>${d.ref}</strong> est en cours de préparation par nos équipes.</p>
      <p>Vous recevrez un email dès qu'elle sera expédiée.</p>
    `,
  }),
  commande_expediee: (d) => ({
    subject: `Commande ${d.ref} expédiée`,
    html: `
      <h2 style="color:#009fe3">Votre commande est en route !</h2>
      <p>Bonjour ${d.prenom},</p>
      <p>La commande <strong>${d.ref}</strong> a été confiée à notre livreur.</p>
      ${d.heureLivraison ? `<p>📦 Créneau de livraison estimé : <strong>${d.heureLivraison}</strong></p>` : ""}
      <p>Assurez-vous d'être disponible à l'adresse de livraison.</p>
    `,
  }),
  commande_livree: (d) => ({
    subject: `Commande ${d.ref} livrée`,
    html: `
      <h2 style="color:#2cb34a">Livraison effectuée !</h2>
      <p>Bonjour ${d.prenom},</p>
      <p>Votre commande <strong>${d.ref}</strong> a été livrée. Merci pour votre confiance !</p>
      <p>N'hésitez pas à laisser un avis sur les articles reçus.</p>
    `,
  }),
  litige_recu: (d) => ({
    subject: `Litige ${d.ref} reçu`,
    html: `
      <h2 style="color:#f59e0b">Litige enregistré</h2>
      <p>Bonjour ${d.prenom},</p>
      <p>Votre demande de retour pour la commande <strong>${d.commande_ref}</strong> a été reçue.</p>
      <p>Notre équipe la traite sous 48h.</p>
    `,
  }),
  litige_resolu: (d) => ({
    subject: `Litige ${d.ref} résolu — Code retrait`,
    html: `
      <h2 style="color:#2cb34a">Remboursement en cours</h2>
      <p>Bonjour ${d.prenom},</p>
      <p>Votre litige <strong>${d.ref}</strong> a été accepté.</p>
      <p>Votre code de retrait Cash Plus / Wafa Cash :</p>
      <h1 style="letter-spacing:4px;color:#009fe3;font-size:28px">${d.code_retrait}</h1>
      <p>Montant remboursé : <strong>${d.montant} dh</strong></p>
    `,
  }),
  litige_resolu_stripe: (d) => ({
    subject: `Litige ${d.ref} — Remboursement Stripe initié`,
    html: `
      <h2 style="color:#2cb34a">Remboursement initié</h2>
      <p>Bonjour ${d.prenom},</p>
      <p>Votre litige <strong>${d.ref}</strong> a été validé.</p>
      <p>Le remboursement de <strong>${d.montant} dh</strong> a été initié sur votre carte bancaire.</p>
      <p>Il apparaîtra sur votre relevé sous 3 à 5 jours ouvrés.</p>
    `,
  }),
  litige_livreur_pickup: (d) => ({
    subject: `[Action requise] Récupération article — Litige ${d.ref}`,
    html: `
      <h2 style="color:#f59e0b">Récupération d'article à effectuer</h2>
      <p>Bonjour,</p>
      <p>Un litige <strong>${d.ref}</strong> a été validé par l'administration.</p>
      <p><strong>Client :</strong> ${d.client_nom}<br>
         <strong>Adresse :</strong> ${d.adresse}, ${d.ville}<br>
         <strong>Téléphone :</strong> ${d.telephone}</p>
      <p>Merci de vous rendre chez le client pour récupérer l'article retourné, puis de marquer la récupération dans votre espace livreur.</p>
    `,
  }),
  litige_client_recupere: (d) => ({
    subject: `Litige ${d.ref} — Article récupéré`,
    html: `
      <h2 style="color:#009fe3">Votre retour a été pris en charge</h2>
      <p>Bonjour ${d.prenom},</p>
      <p>Notre livreur a bien récupéré l'article de la commande <strong>${d.commande_ref}</strong>.</p>
      <p>${d.mode_paiement === "stripe"
        ? "Le remboursement sur votre carte sera effectué dès validation de notre équipe."
        : "Vous recevrez très prochainement un code de retrait pour récupérer votre remboursement."
      }</p>
    `,
  }),
  litige_admin_action: (d) => ({
    subject: `[Action requise] Litige ${d.ref} — article récupéré`,
    html: `
      <h2 style="color:#009fe3">Article récupéré — votre action est requise</h2>
      <p>Le livreur a confirmé la récupération de l'article pour le litige <strong>${d.ref}</strong> (commande ${d.commande_ref}).</p>
      <p><strong>Client :</strong> ${d.client_nom}<br>
         <strong>Mode de paiement :</strong> ${d.mode_paiement === "stripe" ? "Carte bancaire (remboursement Stripe)" : "Cash (saisir un code de retrait)"}</p>
      <p>Connectez-vous à l'espace admin pour clôturer ce litige.</p>
    `,
  }),
  bienvenue: (d) => ({
    subject: "Bienvenue sur SupplyLink !",
    html: `
      <h2 style="color:#009fe3">Bienvenue ${d.prenom} !</h2>
      <p>Votre compte SupplyLink est créé. Bonne découverte !</p>
    `,
  }),

  contact_recu: (d) => ({
    subject: `[Contact] ${d.sujet} — ${d.nom}`,
    html: `
      <h2 style="color:#009fe3">Nouveau message de contact</h2>
      <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
        <tr><td style="padding:8px;font-weight:700;width:120px">Nom</td><td style="padding:8px">${d.nom}</td></tr>
        <tr style="background:#f8fafc"><td style="padding:8px;font-weight:700">Email</td><td style="padding:8px"><a href="mailto:${d.email}">${d.email}</a></td></tr>
        <tr><td style="padding:8px;font-weight:700">Sujet</td><td style="padding:8px">${d.sujet}</td></tr>
        <tr style="background:#f8fafc"><td style="padding:8px;font-weight:700;vertical-align:top">Message</td><td style="padding:8px;white-space:pre-wrap">${d.message}</td></tr>
      </table>
    `,
  }),

  contact_confirmation: (d) => ({
    subject: "Nous avons bien reçu votre message — SupplyLink",
    html: `
      <h2 style="color:#009fe3">Merci ${d.nom} !</h2>
      <p>Nous avons bien reçu votre message concernant : <strong>${d.sujet}</strong>.</p>
      <p>Notre équipe vous répondra sous <strong>24h ouvrées</strong>.</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0"/>
      <p style="color:#6b7280;font-size:12px">Cet email est envoyé automatiquement, merci de ne pas y répondre.</p>
    `,
  }),
};

const sendEmail = async (to, templateKey, data = {}) => {
  if (!process.env.SMTP_USER) return;
  const tpl = TEMPLATES[templateKey]?.(data);
  if (!tpl) throw new Error(`Template email inconnu: ${templateKey}`);

  await transporter.sendMail({
    from:    FROM,
    to,
    subject: tpl.subject,
    html:    tpl.html,
  });
};

module.exports = { sendEmail };
