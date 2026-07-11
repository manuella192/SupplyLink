const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs:  15 * 60 * 1000,
  max:       10,
  message:   { message: "Trop de tentatives, réessayez dans 15 minutes." },
  standardHeaders: true,
  legacyHeaders:   false,
});

const apiLimiter = rateLimit({
  windowMs:  60 * 1000,
  max:       120,
  message:   { message: "Limite de requêtes atteinte." },
  standardHeaders: true,
  legacyHeaders:   false,
});

module.exports = { authLimiter, apiLimiter };
