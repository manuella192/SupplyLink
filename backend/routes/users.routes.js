const router  = require("express").Router();
const ctrl    = require("../controllers/users.controller");
const { verifyToken } = require("../middleware/auth");
const { requireRole } = require("../middleware/roles");

const { body } = require("express-validator");
const { validate } = require("../middleware/validate");

router.get("/",              verifyToken, requireRole("admin"), ctrl.list);
router.patch("/:id/toggle",  verifyToken, requireRole("admin"), ctrl.toggleStatut);
router.post("/fournisseur",  verifyToken, requireRole("admin"), [
  body("prenom").trim().notEmpty().withMessage("Prénom requis"),
  body("nom").trim().notEmpty().withMessage("Nom requis"),
  body("email").trim().isEmail().withMessage("Email invalide"),
  body("password").isLength({ min: 8 }).withMessage("Mot de passe : 8 caractères minimum"),
], validate, ctrl.createFournisseur);

router.post("/livreur", verifyToken, requireRole("admin"), [
  body("prenom").trim().notEmpty().withMessage("Prénom requis"),
  body("nom").trim().notEmpty().withMessage("Nom requis"),
  body("email").trim().isEmail().withMessage("Email invalide"),
  body("password").isLength({ min: 8 }).withMessage("Mot de passe : 8 caractères minimum"),
], validate, ctrl.createLivreur);

module.exports = router;
