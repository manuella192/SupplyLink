const router  = require("express").Router();
const { body } = require("express-validator");
const ctrl    = require("../controllers/litiges.controller");
const { verifyToken } = require("../middleware/auth");
const { requireRole } = require("../middleware/roles");
const { validate }    = require("../middleware/validate");

router.post("/", verifyToken, requireRole("client"), [
  body("commandeId").isInt({ min: 1 }),
  body("raison").isIn(["non_conforme", "endommage", "manquant", "autre"]),
  body("description").trim().notEmpty().isLength({ max: 2000 }),
], validate, ctrl.create);

router.get("/",          verifyToken, requireRole("admin"), ctrl.adminList);
router.patch("/:id/resolve", verifyToken, requireRole("admin"), [
  body("codeRetrait").trim().notEmpty(),
], validate, ctrl.resolve);
router.patch("/:id/reject",  verifyToken, requireRole("admin"), ctrl.reject);

module.exports = router;
