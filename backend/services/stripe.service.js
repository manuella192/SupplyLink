const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

const PACK_PRICES = {
  starter: 19900,
  pro:     34900,
  elite:   59900,
};

const createPaymentIntent = async (amountCents, metadata = {}) => {
  return stripe.paymentIntents.create({
    amount:   amountCents,
    currency: "mad",
    metadata,
    automatic_payment_methods: { enabled: true },
  });
};

const createOrderPaymentIntent = async (totalDh, orderId) => {
  return createPaymentIntent(Math.round(totalDh * 100), { orderId: String(orderId) });
};

const createPromoPaymentIntent = async (pack, promoId) => {
  const amount = PACK_PRICES[pack];
  if (!amount) throw new Error("Pack invalide");
  return createPaymentIntent(amount, { promoId: String(promoId) });
};

const refundPaymentIntent = async (paymentIntentId, amountDh) => {
  const params = { payment_intent: paymentIntentId };
  if (amountDh) params.amount = Math.round(amountDh * 100);
  return stripe.refunds.create(params);
};

const constructWebhookEvent = (payload, sig) =>
  stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);

module.exports = {
  createOrderPaymentIntent,
  createPromoPaymentIntent,
  refundPaymentIntent,
  constructWebhookEvent,
  PACK_PRICES,
};
