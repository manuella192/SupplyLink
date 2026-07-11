const requireRole = (...roles) => (req, res, next) => {
  if (!req.user?.roles) return res.status(403).json({ message: "Accès refusé" });
  const has = roles.some((r) => req.user.roles.includes(r));
  if (!has) return res.status(403).json({ message: "Rôle insuffisant" });
  next();
};

module.exports = { requireRole };
