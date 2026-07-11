const router  = require("express").Router();
const ctrl    = require("../controllers/users.controller");
const { verifyToken } = require("../middleware/auth");
const { requireRole } = require("../middleware/roles");

router.get("/",            verifyToken, requireRole("admin"), ctrl.list);
router.patch("/:id/toggle", verifyToken, requireRole("admin"), ctrl.toggleStatut);

module.exports = router;
