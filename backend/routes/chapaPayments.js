const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const chapaService = require('../services/chapaService');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { authenticate } = require('../middleware/auth');

// @route   POST api/chapa/initialize
// @desc    Initialize Chapa payment
// @access  Private
router.post(
  '/initialize',
  authenticate,
  [
    body('amount', 'Amount is required').isNumeric(),
    body('currency', 'Currency is required').optional().isString(),
    body('email', 'Valid email is required').isEmail(),
    body('firstName', 'First name is required').not().isEmpty(),
    body('lastName', 'Last name is required').not().isEmpty(),
    body('phoneNumber', 'Phone number is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        amount,
        currency = 'ETB',
        email,
        firstName,
        lastName,
        phoneNumber,
        cartId,
        customization
      } = req.body;

      // Generate unique transaction reference
      const txRef = chapaService.generateTxRef();

      // Create order with pending status (simplified for now)
      const order = new Order({
        user: req.user.id,
        orderNumber: `ORD-${Date.now()}`,
        store: null, // Will be set later
        items: [], // Will be populated from cart later
        subtotal: amount,
        tax: 0,
        deliveryFee: 0,
        serviceFee: 0,
        total: amount,
        paymentMethod: { type: 'chapa' },
        paymentStatus: 'pending',
        deliveryAddress: {
          street: 'Pending',
          city: 'Addis Ababa',
          state: 'AA',
          zipCode: '1000'
        },
        status: 'pending',
        txRef,
        currency
      });

      await order.save();

      // Initialize Chapa payment
      const paymentData = {
        amount,
        currency,
        email,
        firstName,
        lastName,
        phoneNumber,
        txRef,
        callbackUrl: `${process.env.BACKEND_URL || 'http://localhost:5001'}/api/chapa/webhook`,
        returnUrl: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/orders/${order._id}/success`,
        customization
      };

      const payment = await chapaService.initializePayment(paymentData);

      // Update order with payment details
      order.chapaPaymentId = payment.data.tx_ref;
      await order.save();

      res.json({
        success: true,
        orderId: order._id,
        checkoutUrl: payment.checkoutUrl,
        txRef: payment.data.tx_ref
      });
    } catch (error) {
      console.error('Chapa payment initialization error:', error);
      res.status(500).json({ 
        message: 'Error initializing payment',
        error: error.message 
      });
    }
  }
);

// @route   GET api/chapa/verify/:txRef
// @desc    Verify Chapa payment
// @access  Private
router.get('/verify/:txRef', authenticate, async (req, res) => {
  try {
    const { txRef } = req.params;

    // Verify payment with Chapa
    const verification = await chapaService.verifyPayment(txRef);

    if (!verification.success) {
      return res.status(400).json({ 
        message: 'Payment verification failed',
        status: verification.status 
      });
    }

    // Find and update order
    const order = await Order.findOne({ txRef });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order status based on payment status
    if (verification.status === 'success') {
      order.paymentStatus = 'paid';
      order.status = 'confirmed';
      order.paidAt = new Date();

      // Try to clear the cart (optional, as cart may be in localStorage)
      try {
        await Cart.findOneAndDelete({ user: req.user.id });
      } catch (e) {
        // Cart not found in DB, that's okay
      }
    } else {
      order.paymentStatus = 'failed';
      order.status = 'cancelled';
    }

    await order.save();

    res.json({
      success: verification.success,
      order: order,
      payment: verification.data
    });
  } catch (error) {
    console.error('Chapa payment verification error:', error);
    res.status(500).json({ 
      message: 'Error verifying payment',
      error: error.message 
    });
  }
});

// @route   POST api/chapa/webhook
// @desc    Handle Chapa webhook
// @access  Public
router.post('/webhook', express.json(), async (req, res) => {
  try {
    const { tx_ref, status, amount, currency, email } = req.body;

    console.log('Chapa webhook received:', { tx_ref, status, amount });

    // Find order by transaction reference
    const order = await Order.findOne({ txRef: tx_ref });
    
    if (!order) {
      console.error('Order not found for tx_ref:', tx_ref);
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order based on payment status
    if (status === 'success') {
      order.paymentStatus = 'paid';
      order.status = 'confirmed';
      order.paidAt = new Date();

      // Try to clear user's cart (optional, as cart may be in localStorage)
      try {
        await Cart.findOneAndDelete({ user: order.user });
      } catch (e) {
        // Cart not found in DB, that's okay
      }
    } else if (status === 'failed') {
      order.paymentStatus = 'failed';
      order.status = 'cancelled';
    }

    await order.save();

    // Send success response to Chapa
    res.json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Chapa webhook error:', error);
    res.status(500).json({ 
      message: 'Error processing webhook',
      error: error.message 
    });
  }
});

// @route   GET api/chapa/banks
// @desc    Get list of supported banks
// @access  Public
router.get('/banks', async (req, res) => {
  try {
    const banks = await chapaService.getBanks();
    res.json({ success: true, banks });
  } catch (error) {
    console.error('Error fetching banks:', error);
    res.status(500).json({ 
      message: 'Error fetching banks',
      error: error.message 
    });
  }
});

// @route   GET api/chapa/payment-methods
// @desc    Get available payment methods
// @access  Public
router.get('/payment-methods', (req, res) => {
  res.json({
    success: true,
    methods: [
      {
        id: 'chapa_card',
        name: 'Credit/Debit Card',
        type: 'card',
        description: 'Pay with Visa, Mastercard, or other cards',
        supported: true
      },
      {
        id: 'chapa_mobile',
        name: 'Mobile Money',
        type: 'mobile',
        description: 'Pay with M-Pesa, Telebirr, etc.',
        supported: true
      },
      {
        id: 'chapa_bank',
        name: 'Bank Transfer',
        type: 'bank',
        description: 'Direct bank transfer',
        supported: true
      }
    ]
  });
});

module.exports = router;
