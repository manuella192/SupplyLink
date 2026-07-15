const { Router }    = require("express");
const { body }      = require("express-validator");
const rateLimit     = require("express-rate-limit");
const { sendContact } = require("../controllers/contact.controller");

const router = Router();

// Max 5 messages / heure / IP
const contactLimiter = rateLimit({
  windowMs:  60 * 60 * 1000,
  max:       5,
  message:   { message: "Trop de messages envoyés. Réessayez dans une heure." },
  standardHeaders: true,
  legacyHeaders:   false,
});

const validate = [
  body("nom")
    .trim()
    .notEmpty().withMessage("Nom requis")
    .isLength({ max: 100 }).withMessage("Nom trop long (100 caractères max)"),
  body("email")
    .trim()
    .notEmpty().withMessage("Email requis")
    .isEmail().withMessage("Email invalide")
    .toLowerCase(),
  body("sujet")
    .trim()
    .notEmpty().withMessage("Sujet requis")
    .isLength({ max: 200 }).withMessage("Sujet trop long"),
  body("message")
    .trim()
    .notEmpty().withMessage("Message requis")
    .isLength({ min: 10 }).withMessage("Le message doit contenir au moins 10 caractères")
    .isLength({ max: 2000 }).withMessage("Message trop long (2000 caractères max)"),
];

router.post("/", contactLimiter, validate, sendContact);

module.exports = router;
