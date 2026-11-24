const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  stripeWebhook,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/create-intent', protect, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);
router.get('/history', protect, getPaymentHistory);
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

module.exports = router;

