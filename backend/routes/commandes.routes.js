const router  = require("express").Router();
const { body } = require("express-validator");
const ctrl    = require("../controllers/commandes.controller");
const { verifyToken } = require("../middleware/auth");
const { requireRole } = require("../middleware/roles");
const { validate }    = require("../middleware/validate");

router.post("/", verifyToken, requireRole("client"), [
  body("items").isArray({ min: 1 }),
  body("items.*.articleId").isInt({ min: 1 }),
  body("items.*.qty").isInt({ min: 1 }),
  body("adresse.prenom").trim().notEmpty(),
  body("adresse.nom").trim().notEmpty(),
  body("adresse.telephone").notEmpty(),
  body("adresse.ville").notEmpty(),
  body("adresse.adresse").notEmpty(),
  body("modePaiement").isIn(["stripe", "cash"]),
], validate, ctrl.create);

router.get("/me",  verifyToken, requireRole("client"), ctrl.myOrders);
router.get("/",    verifyToken, requireRole("admin"),  ctrl.adminList);
router.patch("/:id/advance", verifyToken, requireRole("admin", "livreur"), ctrl.advance);

module.exports = router;
