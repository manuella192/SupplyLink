const router  = require("express").Router();
const { body } = require("express-validator");
const ctrl    = require("../controllers/avis.controller");
const { verifyToken } = require("../middleware/auth");
const { requireRole } = require("../middleware/roles");
const { validate }    = require("../middleware/validate");

router.post("/", verifyToken, requireRole("client"), [
  body("commandeId").isInt({ min: 1 }),
  body("articleId").isInt({ min: 1 }),
  body("note").isInt({ min: 1, max: 5 }),
  body("commentaire").optional().trim().isLength({ max: 1000 }),
], validate, ctrl.create);

module.exports = router;
