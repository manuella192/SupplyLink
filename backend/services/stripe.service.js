const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

// Prix en centimes MAD — correspondance avec les packs affichés (10/100/200 dh)
const PACK_PRICES = {
  starter:  1000,   // 10 dh
  pro:     10000,   // 100 dh
  elite:   20000,   // 200 dh
};

const PACK_LABELS = {
  starter: "Starter — 1 000 acheteurs / 7 jours",
  pro:     "Pro — 15 000 acheteurs / 30 jours",
  elite:   "Elite — 40 000 acheteurs / 60 jours",
};

/* ── Checkout Session pour les commandes clients ── */
const createOrderCheckoutSession = async (totalDh, ref, cmdId, successUrl, cancelUrl) => {
  return stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency:     "mad",
        product_data: { name: `Commande SupplyLink — ${ref}` },
        unit_amount:  Math.round(totalDh * 100),
      },
      quantity: 1,
    }],
    mode:        "payment",
    success_url: successUrl,
    cancel_url:  cancelUrl,
    metadata:    { ref, cmdId: String(cmdId), type: "order" },
  });
};

const retrieveCheckoutSession = (sessionId) => stripe.checkout.sessions.retrieve(sessionId);

/* ── Checkout Session pour les promotions fournisseur ── */
const createPromoCheckoutSession = async (pack, promoId, successUrl, cancelUrl) => {
  const amount = PACK_PRICES[pack];
  if (!amount) throw new Error("Pack invalide");
  return stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency:     "mad",
        product_data: { name: `SupplyLink — Pack ${PACK_LABELS[pack]}` },
        unit_amount:  amount,
      },
      quantity: 1,
    }],
    mode:        "payment",
    success_url: successUrl,
    cancel_url:  cancelUrl,
    metadata:    { promoId: String(promoId) },
  });
};

/* ── Remboursement litiges ── */
const refundPaymentIntent = async (paymentIntentId, amountDh) => {
  const params = { payment_intent: paymentIntentId };
  if (amountDh) params.amount = Math.round(amountDh * 100);
  return stripe.refunds.create(params);
};

const constructWebhookEvent = (payload, sig) =>
  stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);

module.exports = {
  createOrderCheckoutSession,
  retrieveCheckoutSession,
  createPromoCheckoutSession,
  refundPaymentIntent,
  constructWebhookEvent,
  PACK_PRICES,
};
