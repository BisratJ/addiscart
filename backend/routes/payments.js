const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Cart = require('../models/Cart');
const { authenticate } = require('../middleware/auth');

// @route   POST api/payments/create-payment-intent
// @desc    Create payment intent for Stripe
// @access  Private
router.post(
  '/create-payment-intent',
  authenticate,
  [body('cartId', 'Cart ID is required').not().isEmpty()],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const { cartId } = req.body;
      
      // Find cart
      const cart = await Cart.findOne({
        _id: cartId,
        user: req.user.id,
        isActive: true,
      });
      
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
      
      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(cart.total * 100), // Stripe expects amount in cents
        currency: 'usd',
        metadata: {
          cartId: cart._id.toString(),
          userId: req.user.id,
        },
      });
      
      res.json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error('Error creating payment intent:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   POST api/payments/webhook
// @desc    Handle Stripe webhook events
// @access  Public
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!', paymentIntent.id);
      // Handle successful payment (e.g., update order status)
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed!', failedPayment.id);
      // Handle failed payment
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  
  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
});

// @route   POST api/payments/save-payment-method
// @desc    Save a payment method to user profile
// @access  Private
router.post(
  '/save-payment-method',
  authenticate,
  [
    body('paymentMethodId', 'Payment method ID is required').not().isEmpty(),
    body('makeDefault', 'Make default flag is required').isBoolean(),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const { paymentMethodId, makeDefault } = req.body;
      
      // Retrieve payment method details from Stripe
      const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
      
      // Find user and update payment methods
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Create new payment method object
      const newPaymentMethod = {
        type: paymentMethod.type,
        cardType: paymentMethod.card.brand,
        lastFourDigits: paymentMethod.card.last4,
        default: makeDefault,
        stripePaymentMethodId: paymentMethodId,
      };
      
      // If this payment method is set as default, update all other payment methods
      if (makeDefault) {
        user.paymentMethods.forEach((method) => {
          method.default = false;
        });
      }
      
      // Add new payment method to user
      user.paymentMethods.push(newPaymentMethod);
      
      // Save user
      await user.save();
      
      res.json(user.paymentMethods);
    } catch (error) {
      console.error('Error saving payment method:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
