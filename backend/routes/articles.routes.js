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

// Routes spécifiques AVANT les routes paramétrées (évite que /:id capture "me", "admin", etc.)
router.get("/homepage",   ctrl.homepage);
router.get("/",           ctrl.list);
router.get("/me/list",    verifyToken, requireRole("fournisseur"), ctrl.myArticles);
router.get("/me/stats",   verifyToken, requireRole("fournisseur"), ctrl.myStats);
router.get("/admin/list", verifyToken, requireRole("admin"),       ctrl.adminListAll);

// Routes fournisseur
router.post("/",       verifyToken, requireRole("fournisseur"), upload.single("image"), articleRules, validate, ctrl.create);
router.put("/:id",     verifyToken, requireRole("fournisseur"), upload.single("image"), articleRules, validate, ctrl.update);
router.delete("/:id",  verifyToken, requireRole("fournisseur"), ctrl.remove);

// Routes admin
router.patch("/:id/toggle", verifyToken, requireRole("admin"), ctrl.adminToggle);

// Vue publique (fire-and-forget, pas d'auth requise)
router.post("/:id/view", ctrl.recordView);

// Route publique avec paramètre EN DERNIER
router.get("/:id", ctrl.getOne);

module.exports = router;
