const asyncHandler = require('express-async-handler');
const stripe = require('../config/stripe');
const Payment = require('../models/Payment');
const Course = require('../models/Course');

// @desc    Create payment intent
// @route   POST /api/payment/create-intent
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { courseId } = req.body;

  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.isFree) {
    res.status(400);
    throw new Error('Course is free');
  }

  // Check if already enrolled
  if (course.enrolledStudents.includes(req.user._id)) {
    res.status(400);
    throw new Error('Already enrolled in this course');
  }

  const amount = Math.round(course.price * 100); // Convert to cents

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    metadata: {
      courseId: course._id.toString(),
      userId: req.user._id.toString(),
    },
  });

  res.json({
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    amount,
  });
});

// @desc    Confirm payment and enroll
// @route   POST /api/payment/confirm
const confirmPayment = asyncHandler(async (req, res) => {
  const { paymentIntentId } = req.body;

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== 'succeeded') {
    res.status(400);
    throw new Error('Payment not successful');
  }

  const { courseId, userId } = paymentIntent.metadata;

  // Check if already processed
  const existingPayment = await Payment.findOne({
    stripePaymentIntentId: paymentIntentId,
  });

  if (existingPayment) {
    return res.json({ message: 'Already enrolled' });
  }

  const course = await Course.findById(courseId);

  // Create payment record
  await Payment.create({
    user: userId,
    course: courseId,
    amount: paymentIntent.amount / 100,
    currency: paymentIntent.currency,
    stripePaymentIntentId: paymentIntentId,
    status: 'completed',
  });

  // Enroll student
  course.enrolledStudents.push(userId);
  await course.save();

  // Update user's enrolled courses
  const User = require('../models/User');
  await User.findByIdAndUpdate(userId, {
    $push: {
      enrolledCourses: {
        course: courseId,
        enrolledAt: new Date(),
        progress: 0,
        completedLectures: [],
      },
    },
  });

  res.json({ message: 'Payment confirmed and enrolled successfully' });
});

// @desc    Get payment history
// @route   GET /api/payment/history
const getPaymentHistory = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user._id })
    .populate('course', 'title thumbnail')
    .sort({ createdAt: -1 });

  res.json(payments);
});

// @desc    Stripe webhook
// @route   POST /api/payment/webhook
const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      // Already handled in confirmPayment
      break;
    case 'payment_intent.payment_failed':
      const paymentIntent = event.data.object;
      await Payment.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        { status: 'failed' }
      );
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  stripeWebhook,
};

