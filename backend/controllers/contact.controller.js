const { validationResult } = require("express-validator");
const { sendEmail }        = require("../services/email.service");

const ADMIN_EMAIL = process.env.CONTACT_EMAIL || process.env.SMTP_USER;

const sendContact = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });

  const { nom, email, sujet, message } = req.body;

  try {
    // Email à l'équipe SupplyLink
    await sendEmail(ADMIN_EMAIL, "contact_recu", { nom, email, sujet, message });

    // Confirmation à l'expéditeur
    await sendEmail(email, "contact_confirmation", { nom, sujet });

    return res.status(200).json({ message: "Message envoyé avec succès." });
  } catch (err) {
    console.error("[contact] sendEmail error:", err.message);
    return res.status(500).json({ message: "Erreur lors de l'envoi. Réessayez plus tard." });
  }
};

module.exports = { sendContact };
