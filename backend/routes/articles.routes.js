const router  = require("express").Router();
const { body } = require("express-validator");
const ctrl    = require("../controllers/articles.controller");
const { verifyToken } = require("../middleware/auth");
const { requireRole } = require("../middleware/roles");
const { validate }    = require("../middleware/validate");
const upload          = require("../middleware/upload");

const articleRules = [
  body("nom").trim().notEmpty().isLength({ max: 300 }),
  body("prix").isFloat({ min: 0 }),
  body("stock").isInt({ min: 0 }),
  body("categorie").trim().notEmpty(),
];

// Public
router.get("/homepage", ctrl.homepage);
router.get("/",         ctrl.list);
router.get("/:id",      ctrl.getOne);

// Fournisseur
router.get("/me/list", verifyToken, requireRole("fournisseur"), ctrl.myArticles);
router.post("/",   verifyToken, requireRole("fournisseur"), upload.single("image"), articleRules, validate, ctrl.create);
router.put("/:id", verifyToken, requireRole("fournisseur"), upload.single("image"), articleRules, validate, ctrl.update);
router.delete("/:id", verifyToken, requireRole("fournisseur"), ctrl.remove);

// Admin
router.patch("/:id/toggle", verifyToken, requireRole("admin"), ctrl.adminToggle);

module.exports = router;
