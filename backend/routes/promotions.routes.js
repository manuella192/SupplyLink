const router  = require("express").Router();
const { body } = require("express-validator");
const ctrl    = require("../controllers/promotions.controller");
const { verifyToken } = require("../middleware/auth");
const { requireRole } = require("../middleware/roles");
const { validate }    = require("../middleware/validate");

// Crée une promo + retourne l'URL Stripe Checkout
router.post("/", verifyToken, requireRole("fournisseur"), [
  body("articleId").isInt({ min: 1 }),
  body("pack").isIn(["starter", "pro", "elite"]),
], validate, ctrl.create);

router.get("/me",     verifyToken, requireRole("fournisseur"), ctrl.myPromos);
router.get("/",       verifyToken, requireRole("admin"),       ctrl.adminList);
router.delete("/:id", verifyToken, requireRole("admin"),       ctrl.adminCancel);

module.exports = router;
