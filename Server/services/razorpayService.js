// services/razorpayService.js
const Razorpay = require('razorpay');

const IS_TEST_MODE = process.env.RAZORPAY_TEST_MODE === 'true';
const RAZORPAY_KEY_ID = IS_TEST_MODE
  ? process.env.RAZORPAY_TEST_KEY_ID
  : process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = IS_TEST_MODE
  ? process.env.RAZORPAY_TEST_KEY_SECRET
  : process.env.RAZORPAY_KEY_SECRET;

if (IS_TEST_MODE) {
  console.log('[Razorpay] Running in TEST mode');
} else {
  console.log('[Razorpay] Running in LIVE mode');
}

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

/**
 * Create a Razorpay order for payment collection (card/UPI/netbanking)
 * @param {Object} opts - { amount, currency, receipt, notes }
 * @returns {Promise<Object>} Razorpay order response
 */
async function createOrder(opts) {
  // See https://razorpay.com/docs/api/orders/#create-an-order
  const params = {
    amount: opts.amount, // in paise
    currency: opts.currency || 'INR',
    receipt: opts.receipt,
    payment_capture: 1, // auto-capture
    notes: opts.notes,
  };
  return razorpay.orders.create(params);
}

/**
 * Capture a payment after successful authorization (optional for manual capture flows)
 * @param {string} paymentId
 * @param {number} amount
 * @returns {Promise<Object>} Razorpay payment response
 */
async function capturePayment(paymentId, amount) {
  // See https://razorpay.com/docs/api/payments/#capture-a-payment
  return razorpay.payments.capture(paymentId, amount, 'INR');
}

module.exports = {
  createOrder,
  capturePayment,
};
