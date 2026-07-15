const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token  = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ message: "Token manquant" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

module.exports = { verifyToken };
