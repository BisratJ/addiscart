const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const chapaService = require('../services/chapaService');
const Order = require('../models/Order');
const { authenticate, optionalAuthenticate } = require('../middleware/auth');

/**
 * @route   POST /api/chapa/initialize
 * @desc    Initialize Chapa payment
 * @access  Public (optionally authenticated)
 * @docs    https://developer.chapa.co/docs/accept-payments
 */
router.post(
  '/initialize',
  optionalAuthenticate,
  [
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('currency').optional().isString(),
    body('email').isEmail().withMessage('Valid email is required'),
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        amount,
        currency = 'ETB',
        email,
        first_name,
        last_name,
        phone_number,
        customization
      } = req.body;

      // Generate unique transaction reference
      const tx_ref = chapaService.generateTxRef();

      // Transform cart items to match Order model structure
      const transformedItems = (req.body.items || []).map(item => ({
        productId: item.id || item.productId, // Store string ID
        name: item.name,
        quantity: item.quantity || 1,
        price: item.price,
        notes: item.notes || ''
      }));

      // Ensure delivery address has all required fields
      const deliveryAddress = req.body.deliveryAddress || {};
      const completeAddress = {
        street: deliveryAddress.street || 'To be provided',
        city: deliveryAddress.city || 'Addis Ababa',
        state: deliveryAddress.state || 'AA',
        zipCode: deliveryAddress.zipCode || '1000'
      };

      // Create order in database with pending status
      const orderData = {
        orderNumber: tx_ref,
        store: req.body.store || null,
        items: transformedItems,
        subtotal: parseFloat(amount),
        tax: 0,
        deliveryFee: 0,
        serviceFee: 0,
        total: parseFloat(amount),
        paymentMethod: {
          type: 'card',
        },
        paymentStatus: 'pending',
        status: 'pending',
        deliveryAddress: completeAddress,
        chapaData: {
          tx_ref,
          currency
        },
        guestEmail: req.user ? null : email, // Store email for guest orders
        guestName: req.user ? null : `${first_name} ${last_name}`, // Store name for guest orders
        guestPhone: req.user ? null : phone_number // Store phone for guest orders
      };

      // Add user reference if authenticated
      if (req.user) {
        orderData.user = req.user.id;
      }

      const order = new Order(orderData);

      await order.save();

      // Prepare payment data for Chapa
      const paymentData = {
        amount: amount.toString(),
        currency,
        email,
        first_name,
        last_name,
        phone_number,
        tx_ref,
        callback_url: `${process.env.BACKEND_URL || 'http://localhost:5001'}/api/chapa/webhook`,
        return_url: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/orders/${order._id}`,
        customization: {
          title: customization?.title || 'Addiscart Payment',
          description: customization?.description || 'Order Payment',
          logo: customization?.logo
        }
      };

      // Initialize payment with Chapa
      const chapaResponse = await chapaService.initializePayment(paymentData);

      res.json({
        success: true,
        message: 'Payment initialized successfully',
        orderId: order._id,
        tx_ref,
        checkoutUrl: chapaResponse.checkoutUrl,
        data: chapaResponse.data
      });

    } catch (error) {
      console.error('Chapa initialization error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to initialize payment',
        error: error.message
      });
    }
  }
);

/**
 * @route   GET /api/chapa/verify/:tx_ref
 * @desc    Verify Chapa payment status
 * @access  Private
 * @docs    https://developer.chapa.co/docs/verify-payments
 */
router.get('/verify/:tx_ref', authenticate, async (req, res) => {
  try {
    const { tx_ref } = req.params;

    // Verify payment with Chapa
    const verification = await chapaService.verifyPayment(tx_ref);

    // Find order in database
    const order = await Order.findOne({ 'chapaData.tx_ref': tx_ref });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order based on payment status
    if (verification.status === 'success') {
      order.paymentStatus = 'paid';
      order.status = 'confirmed';
      order.paymentId = verification.data.reference;
      await order.save();
    } else if (verification.status === 'failed') {
      order.paymentStatus = 'failed';
      order.status = 'cancelled';
      await order.save();
    }

    res.json({
      success: verification.success,
      message: verification.message,
      payment: verification,
      order: {
        id: order._id,
        status: order.status,
        paymentStatus: order.paymentStatus,
        total: order.total
      }
    });

  } catch (error) {
    console.error('Chapa verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/chapa/webhook
 * @desc    Handle Chapa webhook notifications
 * @access  Public
 * @docs    https://developer.chapa.co/docs/webhooks
 */
router.post('/webhook', express.json(), async (req, res) => {
  try {
    // Verify webhook secret
    const webhookSecret = req.headers['chapa-signature'] || req.headers['x-chapa-signature'];
    const expectedSecret = process.env.CHAPA_WEBHOOK_SECRET;

    if (expectedSecret && webhookSecret !== expectedSecret) {
      console.error('Webhook signature verification failed');
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid webhook signature'
      });
    }

    const { tx_ref, status, amount, currency, email, first_name, last_name } = req.body;

    console.log('Chapa webhook received:', {
      tx_ref,
      status,
      amount,
      currency
    });

    // Find order by transaction reference
    const order = await Order.findOne({ 'chapaData.tx_ref': tx_ref });
    
    if (!order) {
      console.error('Order not found for tx_ref:', tx_ref);
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order based on webhook status
    if (status === 'success') {
      order.paymentStatus = 'paid';
      order.status = 'confirmed';
      console.log(`Order ${order._id} marked as paid`);
    } else if (status === 'failed') {
      order.paymentStatus = 'failed';
      order.status = 'cancelled';
      console.log(`Order ${order._id} marked as failed`);
    }

    await order.save();

    // Respond to Chapa
    res.json({
      success: true,
      message: 'Webhook processed successfully'
    });

  } catch (error) {
    console.error('Chapa webhook processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process webhook',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/chapa/banks
 * @desc    Get list of supported banks
 * @access  Public
 */
router.get('/banks', async (req, res) => {
  try {
    const result = await chapaService.getBanks();
    res.json(result);
  } catch (error) {
    console.error('Error fetching banks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch banks',
      error: error.message
    });
  }
});

module.exports = router;
