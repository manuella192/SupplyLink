require("dotenv").config();
const express = require("express");
const helmet  = require("helmet");
const cors    = require("cors");
const morgan  = require("morgan");
const path    = require("path");

const { apiLimiter }  = require("./middleware/rateLimiter");
const { constructWebhookEvent } = require("./services/stripe.service");
const db = require("./config/db");

const app = express();

// ── Sécurité (OWASP A05) ──────────────────────────────────
app.use(helmet());
app.use(cors({
  origin:      process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  methods:     ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ── Logging (OWASP A09) ──────────────────────────────────
app.use(morgan("combined"));

// ── Rate limiting global ──────────────────────────────────
app.use("/api/", apiLimiter);

// ── Stripe webhook (raw body AVANT express.json) ─────────
app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = constructWebhookEvent(req.body, sig);
  } catch {
    return res.status(400).send("Webhook signature invalide");
  }

  // ── Paiement commande client (PaymentIntent) ──────────────
  if (event.type === "payment_intent.succeeded") {
    const pi      = event.data.object;
    const orderId = pi.metadata?.orderId;
    if (orderId) {
      await db.query(
        "UPDATE commandes SET statut='en_preparation' WHERE ref=? AND statut='en_attente' AND mode_paiement='stripe'",
        [orderId]
      ).catch(console.error);
    }
  }

  // ── Paiement promotion fournisseur (Checkout Session) ─────
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const promoId = session.metadata?.promoId;
    if (promoId && session.payment_status === "paid") {
      // Activer la promo et mettre l'article en avant
      const [[promo]] = await db.query(
        "SELECT article_id FROM promotions WHERE id=?", [promoId]
      ).catch(() => [[]]);
      if (promo) {
        await Promise.all([
          db.query("UPDATE promotions SET statut='actif' WHERE id=?", [promoId]),
          db.query("UPDATE articles SET is_promoted=1 WHERE id=?", [promo.article_id]),
        ]).catch(console.error);
      }
    }
  }

  res.json({ received: true });
});

// ── Body parsers ──────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));

// ── Fichiers uploads (images articles) ───────────────────
// helmet() applique Cross-Origin-Resource-Policy: same-origin par défaut,
// ce qui bloque les <img> cross-origin (localhost:3000 → localhost:5000).
// On écrase ce header uniquement pour la route uploads.
app.use("/uploads", (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static(path.join(__dirname, "uploads")));

// ── Routes API ────────────────────────────────────────────
app.use("/api/auth",       require("./routes/auth.routes"));
app.use("/api/articles",   require("./routes/articles.routes"));
app.use("/api/commandes",  require("./routes/commandes.routes"));
app.use("/api/avis",       require("./routes/avis.routes"));
app.use("/api/litiges",    require("./routes/litiges.routes"));
app.use("/api/promotions", require("./routes/promotions.routes"));
app.use("/api/users",      require("./routes/users.routes"));
app.use("/api/contact",    require("./routes/contact.routes"));

// ── Health check ──────────────────────────────────────────
app.get("/api/health", (_req, res) => res.json({ status: "ok", ts: new Date() }));

// ── 404 ────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ message: "Route introuvable" }));

// ── Gestion erreurs globale ────────────────────────────────
app.use((err, _req, res, _next) => {
  if (err.code === "LIMIT_FILE_SIZE") return res.status(413).json({ message: "Fichier trop volumineux" });
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    message: process.env.NODE_ENV === "production" ? "Erreur serveur" : err.message,
  });
});

// ── Démarrage ──────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✔  Serveur démarré sur http://localhost:${PORT}`));
