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
  commande_expediee: (d) => ({
    subject: `Commande ${d.ref} expédiée`,
    html: `
      <h2 style="color:#009fe3">Votre commande est en route !</h2>
      <p>Bonjour ${d.prenom},</p>
      <p>La commande <strong>${d.ref}</strong> a été expédiée et arrivera sous peu.</p>
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
