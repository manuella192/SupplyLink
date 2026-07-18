const router  = require("express").Router();
const ctrl    = require("../controllers/users.controller");
const { verifyToken } = require("../middleware/auth");
const { requireRole } = require("../middleware/roles");

const { body } = require("express-validator");
const { validate } = require("../middleware/validate");

router.get   ("/me/boutique",  verifyToken, requireRole("fournisseur"), ctrl.getBoutique);
router.patch ("/me/boutique",  verifyToken, requireRole("fournisseur"), [
  body("nom").trim().notEmpty().withMessage("Nom de boutique requis"),
], validate, ctrl.updateBoutique);

router.patch("/me",          verifyToken, ctrl.updateMe);
router.patch("/me/password", verifyToken, [
  body("currentPassword").notEmpty(),
  body("newPassword").isLength({ min: 8 }),
], validate, ctrl.updatePassword);

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
