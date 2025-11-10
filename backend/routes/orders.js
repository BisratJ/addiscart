const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { authenticate, isAdmin, isAdminOrShopper } = require('../middleware/auth');

// @route   GET api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const orders = await Order.find({ user: req.user.id })
      .populate('store', 'name logo')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await Order.countDocuments({ user: req.user.id });
    
    res.json({
      orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error getting orders:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/orders/all
// @desc    Get all orders (admin or shopper)
// @access  Private (admin or shopper)
router.get('/all', authenticate, isAdminOrShopper, async (req, res) => {
  try {
    const { status, limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let query = {};
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    // If shopper, only show orders assigned to them
    if (req.user.role === 'shopper') {
      query.shopper = req.user.id;
    }
    
    const orders = await Order.find(query)
      .populate('user', 'name')
      .populate('store', 'name logo')
      .populate('shopper', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await Order.countDocuments(query);
    
    res.json({
      orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error getting all orders:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('store', 'name logo address phone')
      .populate('shopper', 'name phone')
      .populate('items.product', 'name images');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is authorized to view this order
    if (
      order.user._id.toString() !== req.user.id &&
      req.user.role !== 'admin' &&
      (req.user.role !== 'shopper' || order.shopper?._id.toString() !== req.user.id)
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error getting order:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/orders
// @desc    Create a new order
// @access  Private
router.post(
  '/',
  authenticate,
  [
    body('cartId', 'Cart ID is required').not().isEmpty(),
    body('paymentMethod.type', 'Payment method type is required').isIn(['card', 'paypal']),
    body('deliveryAddress.street', 'Street address is required').not().isEmpty(),
    body('deliveryAddress.city', 'City is required').not().isEmpty(),
    body('deliveryAddress.state', 'State is required').not().isEmpty(),
    body('deliveryAddress.zipCode', 'Zip code is required').not().isEmpty(),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const {
        cartId,
        paymentMethod,
        paymentId,
        deliveryAddress,
        deliveryInstructions,
      } = req.body;
      
      // Find cart
      const cart = await Cart.findOne({
        _id: cartId,
        user: req.user.id,
        isActive: true,
      }).populate('items.product');
      
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
      
      // Check if all products are still in stock
      for (const item of cart.items) {
        const product = await Product.findById(item.product);
        
        if (!product || !product.isActive) {
          return res.status(400).json({
            message: `Product ${item.product.name} is no longer available`,
          });
        }
        
        if (product.stock < item.quantity) {
          return res.status(400).json({
            message: `Not enough stock for product ${product.name}. Available: ${product.stock}`,
          });
        }
      }
      
      // Create order items from cart items
      const orderItems = cart.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        notes: item.notes,
      }));
      
      // Create new order
      const order = new Order({
        user: req.user.id,
        store: cart.store,
        items: orderItems,
        subtotal: cart.subtotal,
        tax: cart.tax,
        deliveryFee: cart.deliveryFee,
        serviceFee: cart.serviceFee,
        tip: cart.tip,
        total: cart.total,
        paymentMethod,
        paymentId,
        deliveryAddress,
        deliveryInstructions,
      });
      
      // Save order
      await order.save();
      
      // Update product stock
      for (const item of cart.items) {
        await Product.findByIdAndUpdate(item.product._id, {
          $inc: { stock: -item.quantity },
        });
      }
      
      // Deactivate cart
      cart.isActive = false;
      await cart.save();
      
      res.status(201).json(order);
    } catch (error) {
      console.error('Error creating order:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT api/orders/:id/status
// @desc    Update order status
// @access  Private (admin or shopper)
router.put(
  '/:id/status',
  authenticate,
  isAdminOrShopper,
  [
    body('status', 'Status is required').isIn([
      'pending',
      'processing',
      'shopping',
      'out_for_delivery',
      'delivered',
      'cancelled',
    ]),
    body('note', 'Note must be a string').optional().isString(),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const { status, note } = req.body;
      
      // Find order
      const order = await Order.findById(req.params.id);
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      // Check if shopper is assigned to this order
      if (
        req.user.role === 'shopper' &&
        (!order.shopper || order.shopper.toString() !== req.user.id)
      ) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      
      // Update order status
      order.updateStatus(status, note);
      
      // Save order
      await order.save();
      
      res.json(order);
    } catch (error) {
      console.error('Error updating order status:', error.message);
      
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT api/orders/:id/assign
// @desc    Assign shopper to order
// @access  Private (admin only)
router.put(
  '/:id/assign',
  authenticate,
  isAdmin,
  [body('shopperId', 'Shopper ID is required').not().isEmpty()],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const { shopperId } = req.body;
      
      // Find order
      const order = await Order.findById(req.params.id);
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      // Update shopper
      order.shopper = shopperId;
      
      // Add status history entry
      order.statusHistory.push({
        status: order.status,
        timestamp: Date.now(),
        note: `Shopper assigned`,
      });
      
      // Save order
      await order.save();
      
      res.json(order);
    } catch (error) {
      console.error('Error assigning shopper:', error.message);
      
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT api/orders/:id/delivery-time
// @desc    Set delivery time
// @access  Private (admin or shopper)
router.put(
  '/:id/delivery-time',
  authenticate,
  isAdminOrShopper,
  [body('deliveryTime', 'Delivery time is required').isISO8601()],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const { deliveryTime } = req.body;
      
      // Find order
      const order = await Order.findById(req.params.id);
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      // Check if shopper is assigned to this order
      if (
        req.user.role === 'shopper' &&
        (!order.shopper || order.shopper.toString() !== req.user.id)
      ) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      
      // Update delivery time
      order.deliveryTime = new Date(deliveryTime);
      
      // Add status history entry
      order.statusHistory.push({
        status: order.status,
        timestamp: Date.now(),
        note: `Delivery time set to ${new Date(deliveryTime).toLocaleString()}`,
      });
      
      // Save order
      await order.save();
      
      res.json(order);
    } catch (error) {
      console.error('Error setting delivery time:', error.message);
      
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT api/orders/:id/payment-status
// @desc    Update payment status
// @access  Private (admin only)
router.put(
  '/:id/payment-status',
  authenticate,
  isAdmin,
  [
    body('paymentStatus', 'Payment status is required').isIn([
      'pending',
      'paid',
      'failed',
      'refunded',
    ]),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const { paymentStatus } = req.body;
      
      // Find order
      const order = await Order.findById(req.params.id);
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      // Update payment status
      order.paymentStatus = paymentStatus;
      
      // Add status history entry
      order.statusHistory.push({
        status: order.status,
        timestamp: Date.now(),
        note: `Payment status updated to ${paymentStatus}`,
      });
      
      // Save order
      await order.save();
      
      res.json(order);
    } catch (error) {
      console.error('Error updating payment status:', error.message);
      
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
