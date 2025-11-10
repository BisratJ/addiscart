const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Store = require('../models/Store');
const { authenticate } = require('../middleware/auth');

// @route   GET api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    // Find active cart for user
    let cart = await Cart.findOne({
      user: req.user.id,
      isActive: true,
    }).populate({
      path: 'items.product',
      select: 'name images price salePrice onSale stock unit',
    });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    res.json(cart);
  } catch (error) {
    console.error('Error getting cart:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/cart
// @desc    Create or update cart
// @access  Private
router.post(
  '/',
  authenticate,
  [
    body('store', 'Store is required').not().isEmpty(),
    body('items', 'Items are required').isArray(),
    body('items.*.product', 'Product ID is required').not().isEmpty(),
    body('items.*.quantity', 'Quantity is required').isNumeric(),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const { store, items } = req.body;
      
      // Check if store exists
      const storeExists = await Store.findById(store);
      if (!storeExists) {
        return res.status(400).json({ message: 'Store not found' });
      }
      
      // Check if all products exist and belong to the store
      for (const item of items) {
        const product = await Product.findOne({
          _id: item.product,
          store,
          isActive: true,
        });
        
        if (!product) {
          return res.status(400).json({
            message: `Product ${item.product} not found or does not belong to this store`,
          });
        }
        
        // Check if product is in stock
        if (product.stock < item.quantity) {
          return res.status(400).json({
            message: `Not enough stock for product ${product.name}. Available: ${product.stock}`,
          });
        }
        
        // Add price to item
        item.price = product.onSale && product.salePrice > 0
          ? product.salePrice
          : product.price;
      }
      
      // Find existing active cart for user and store
      let cart = await Cart.findOne({
        user: req.user.id,
        store,
        isActive: true,
      });
      
      if (cart) {
        // Update existing cart
        cart.items = items;
      } else {
        // Create new cart
        cart = new Cart({
          user: req.user.id,
          store,
          items,
        });
      }
      
      // Calculate totals
      cart.calculateTotals();
      
      // Save cart
      await cart.save();
      
      res.json(cart);
    } catch (error) {
      console.error('Error creating/updating cart:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT api/cart/add
// @desc    Add item to cart
// @access  Private
router.put(
  '/add',
  authenticate,
  [
    body('productId', 'Product ID is required').not().isEmpty(),
    body('quantity', 'Quantity is required').isNumeric(),
    body('notes', 'Notes must be a string').optional().isString(),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const { productId, quantity, notes } = req.body;
      
      // Get product details
      const product = await Product.findOne({
        _id: productId,
        isActive: true,
      });
      
      if (!product) {
        return res.status(400).json({ message: 'Product not found' });
      }
      
      // Check if product is in stock
      if (product.stock < quantity) {
        return res.status(400).json({
          message: `Not enough stock for product ${product.name}. Available: ${product.stock}`,
        });
      }
      
      // Find existing active cart for user and store
      let cart = await Cart.findOne({
        user: req.user.id,
        store: product.store,
        isActive: true,
      });
      
      // Calculate product price
      const price = product.onSale && product.salePrice > 0
        ? product.salePrice
        : product.price;
      
      if (cart) {
        // Check if product already exists in cart
        const itemIndex = cart.items.findIndex(
          (item) => item.product.toString() === productId
        );
        
        if (itemIndex > -1) {
          // Update existing item
          cart.items[itemIndex].quantity += quantity;
          cart.items[itemIndex].notes = notes || cart.items[itemIndex].notes;
        } else {
          // Add new item
          cart.items.push({
            product: productId,
            quantity,
            price,
            notes,
          });
        }
      } else {
        // Create new cart
        cart = new Cart({
          user: req.user.id,
          store: product.store,
          items: [
            {
              product: productId,
              quantity,
              price,
              notes,
            },
          ],
        });
      }
      
      // Calculate totals
      cart.calculateTotals();
      
      // Save cart
      await cart.save();
      
      // Populate product details
      await cart.populate({
        path: 'items.product',
        select: 'name images price salePrice onSale stock unit',
      });
      
      res.json(cart);
    } catch (error) {
      console.error('Error adding item to cart:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT api/cart/update/:itemId
// @desc    Update cart item
// @access  Private
router.put(
  '/update/:itemId',
  authenticate,
  [
    body('quantity', 'Quantity is required').isNumeric(),
    body('notes', 'Notes must be a string').optional().isString(),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const { quantity, notes } = req.body;
      
      // Find active cart for user
      let cart = await Cart.findOne({
        user: req.user.id,
        isActive: true,
        'items._id': req.params.itemId,
      });
      
      if (!cart) {
        return res.status(404).json({ message: 'Cart or item not found' });
      }
      
      // Find item index
      const itemIndex = cart.items.findIndex(
        (item) => item._id.toString() === req.params.itemId
      );
      
      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found in cart' });
      }
      
      // Get product details
      const product = await Product.findById(cart.items[itemIndex].product);
      
      // Check if product is in stock
      if (product.stock < quantity) {
        return res.status(400).json({
          message: `Not enough stock for product ${product.name}. Available: ${product.stock}`,
        });
      }
      
      // Update item
      cart.items[itemIndex].quantity = quantity;
      if (notes !== undefined) {
        cart.items[itemIndex].notes = notes;
      }
      
      // Calculate totals
      cart.calculateTotals();
      
      // Save cart
      await cart.save();
      
      // Populate product details
      await cart.populate({
        path: 'items.product',
        select: 'name images price salePrice onSale stock unit',
      });
      
      res.json(cart);
    } catch (error) {
      console.error('Error updating cart item:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   DELETE api/cart/remove/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/remove/:itemId', authenticate, async (req, res) => {
  try {
    // Find active cart for user
    let cart = await Cart.findOne({
      user: req.user.id,
      isActive: true,
      'items._id': req.params.itemId,
    });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart or item not found' });
    }
    
    // Find item index
    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === req.params.itemId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    // Remove item
    cart.items.splice(itemIndex, 1);
    
    // If cart is empty, delete it
    if (cart.items.length === 0) {
      await Cart.findByIdAndDelete(cart._id);
      return res.json({ message: 'Cart is now empty' });
    }
    
    // Calculate totals
    cart.calculateTotals();
    
    // Save cart
    await cart.save();
    
    // Populate product details
    await cart.populate({
      path: 'items.product',
      select: 'name images price salePrice onSale stock unit',
    });
    
    res.json(cart);
  } catch (error) {
    console.error('Error removing item from cart:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/cart
// @desc    Clear cart
// @access  Private
router.delete('/', authenticate, async (req, res) => {
  try {
    // Find active cart for user
    const cart = await Cart.findOne({
      user: req.user.id,
      isActive: true,
    });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    // Delete cart
    await Cart.findByIdAndDelete(cart._id);
    
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Error clearing cart:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/cart/checkout
// @desc    Prepare cart for checkout
// @access  Private
router.put(
  '/checkout',
  authenticate,
  [
    body('deliveryFee', 'Delivery fee is required').isNumeric(),
    body('serviceFee', 'Service fee is required').isNumeric(),
    body('tip', 'Tip must be a number').optional().isNumeric(),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const { deliveryFee, serviceFee, tip } = req.body;
      
      // Find active cart for user
      let cart = await Cart.findOne({
        user: req.user.id,
        isActive: true,
      }).populate({
        path: 'items.product',
        select: 'name images price salePrice onSale stock unit',
      });
      
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
      
      // Update cart with fees
      cart.deliveryFee = deliveryFee;
      cart.serviceFee = serviceFee;
      cart.tip = tip || 0;
      
      // Calculate totals
      cart.calculateTotals();
      
      // Save cart
      await cart.save();
      
      res.json(cart);
    } catch (error) {
      console.error('Error preparing cart for checkout:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
