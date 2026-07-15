const router = require("express").Router();
const { body } = require("express-validator");
const { validate } = require("../middleware/validate");
const { chat } = require("../controllers/chatbot.controller");

router.post("/", [
  body("message").isString().isLength({ min: 1, max: 400 }).withMessage("Message invalide"),
  body("history").optional().isArray({ max: 10 }),
], validate, chat);

module.exports = router;
