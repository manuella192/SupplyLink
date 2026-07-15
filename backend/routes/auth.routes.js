const router  = require("express").Router();
const { body } = require("express-validator");
const ctrl    = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth");
const { validate }    = require("../middleware/validate");
const { authLimiter } = require("../middleware/rateLimiter");

const PWD_RULES = body("password").isLength({ min: 8 }).withMessage("Mot de passe min 8 caractères");

router.post("/register", authLimiter, [
  body("prenom").trim().notEmpty(),
  body("nom").trim().notEmpty(),
  body("email").isEmail().normalizeEmail(),
  body("telephone").matches(/^(\+212|0)[5-7]\d{8}$/).withMessage("Numéro marocain invalide"),
  PWD_RULES,
], validate, ctrl.register);

router.post("/login", authLimiter, [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
], validate, ctrl.login);

router.get("/me",            verifyToken, ctrl.me);
router.patch("/me",          verifyToken, ctrl.updateMe);
router.patch("/me/password", verifyToken, [
  body("currentPassword").notEmpty(),
  body("newPassword").isLength({ min: 8 }),
], validate, ctrl.changePassword);
router.post("/become-fournisseur", verifyToken, [
  body("nomBoutique").trim().notEmpty(),
], validate, ctrl.becomeFournisseur);

module.exports = router;
