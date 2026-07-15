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

/* ── PaymentIntent pour les commandes clients ── */
const createOrderPaymentIntent = async (totalDh, orderId) => {
  return stripe.paymentIntents.create({
    amount:   Math.round(totalDh * 100),
    currency: "mad",
    metadata: { orderId: String(orderId) },
    automatic_payment_methods: { enabled: true },
  });
};

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
  createOrderPaymentIntent,
  createPromoCheckoutSession,
  refundPaymentIntent,
  constructWebhookEvent,
  PACK_PRICES,
};
