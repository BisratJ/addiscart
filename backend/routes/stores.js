const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Store = require('../models/Store');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { authenticate, isAdmin } = require('../middleware/auth');

// @route   GET api/stores
// @desc    Get all stores
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let query = { isActive: true };
    
    // Add search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    const stores = await Store.find(query)
      .sort({ rating: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await Store.countDocuments(query);
    
    res.json({
      stores,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error getting stores:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/stores/:id
// @desc    Get store by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const store = await Store.findOne({
      _id: req.params.id,
      isActive: true,
    }).populate('categories');
    
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    res.json(store);
  } catch (error) {
    console.error('Error getting store:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/stores
// @desc    Create a store
// @access  Private (admin only)
router.post(
  '/',
  authenticate,
  isAdmin,
  [
    body('name', 'Name is required').not().isEmpty(),
    body('description', 'Description is required').not().isEmpty(),
    body('logo', 'Logo is required').not().isEmpty(),
    body('address.street', 'Street address is required').not().isEmpty(),
    body('address.city', 'City is required').not().isEmpty(),
    body('address.state', 'State is required').not().isEmpty(),
    body('address.zipCode', 'Zip code is required').not().isEmpty(),
    body('phone', 'Phone number is required').not().isEmpty(),
    body('email', 'Email is required').isEmail(),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const {
        name,
        description,
        logo,
        coverImage,
        address,
        phone,
        email,
        website,
        hours,
        deliveryFee,
        minimumOrder,
      } = req.body;
      
      // Check if store with same name already exists
      const existingStore = await Store.findOne({ name });
      if (existingStore) {
        return res.status(400).json({ message: 'Store with this name already exists' });
      }
      
      // Create new store
      const store = new Store({
        name,
        description,
        logo,
        coverImage,
        address,
        phone,
        email,
        website,
        hours,
        deliveryFee,
        minimumOrder,
      });
      
      // Save store
      await store.save();
      
      res.status(201).json(store);
    } catch (error) {
      console.error('Error creating store:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT api/stores/:id
// @desc    Update a store
// @access  Private (admin only)
router.put(
  '/:id',
  authenticate,
  isAdmin,
  async (req, res) => {
    try {
      const {
        name,
        description,
        logo,
        coverImage,
        address,
        phone,
        email,
        website,
        hours,
        deliveryFee,
        minimumOrder,
        isActive,
      } = req.body;
      
      // Build store object
      const storeFields = {};
      if (name !== undefined) storeFields.name = name;
      if (description !== undefined) storeFields.description = description;
      if (logo !== undefined) storeFields.logo = logo;
      if (coverImage !== undefined) storeFields.coverImage = coverImage;
      if (address !== undefined) storeFields.address = address;
      if (phone !== undefined) storeFields.phone = phone;
      if (email !== undefined) storeFields.email = email;
      if (website !== undefined) storeFields.website = website;
      if (hours !== undefined) storeFields.hours = hours;
      if (deliveryFee !== undefined) storeFields.deliveryFee = deliveryFee;
      if (minimumOrder !== undefined) storeFields.minimumOrder = minimumOrder;
      if (isActive !== undefined) storeFields.isActive = isActive;
      
      // Check if store exists
      let store = await Store.findById(req.params.id);
      if (!store) {
        return res.status(404).json({ message: 'Store not found' });
      }
      
      // Update store
      store = await Store.findByIdAndUpdate(
        req.params.id,
        { $set: storeFields },
        { new: true }
      );
      
      res.json(store);
    } catch (error) {
      console.error('Error updating store:', error.message);
      
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Store not found' });
      }
      
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   DELETE api/stores/:id
// @desc    Delete a store
// @access  Private (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    // Instead of deleting, deactivate the store
    const store = await Store.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    res.json({ message: 'Store deactivated' });
  } catch (error) {
    console.error('Error deactivating store:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/stores/:id/categories
// @desc    Get all categories for a store
// @access  Public
router.get('/:id/categories', async (req, res) => {
  try {
    const categories = await Category.find({
      store: req.params.id,
      isActive: true,
    });
    
    res.json(categories);
  } catch (error) {
    console.error('Error getting categories:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/stores/:id/products
// @desc    Get all products for a store
// @access  Public
router.get('/:id/products', async (req, res) => {
  try {
    const { category, search, limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let query = {
      store: req.params.id,
      isActive: true,
    };
    
    // Filter by category if provided
    if (category) {
      query.category = category;
    }
    
    // Add search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    const products = await Product.find(query)
      .populate('category')
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error getting products:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/stores/:id/featured
// @desc    Get featured products for a store
// @access  Public
router.get('/:id/featured', async (req, res) => {
  try {
    const store = await Store.findById(req.params.id)
      .populate({
        path: 'featuredProducts',
        match: { isActive: true },
      });
    
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    res.json(store.featuredProducts);
  } catch (error) {
    console.error('Error getting featured products:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/stores/:id/featured
// @desc    Update featured products for a store
// @access  Private (admin only)
router.put('/:id/featured', authenticate, isAdmin, async (req, res) => {
  try {
    const { productIds } = req.body;
    
    if (!Array.isArray(productIds)) {
      return res.status(400).json({ message: 'Product IDs must be an array' });
    }
    
    // Check if store exists
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    // Check if all products exist and belong to the store
    for (const productId of productIds) {
      const product = await Product.findOne({
        _id: productId,
        store: req.params.id,
      });
      
      if (!product) {
        return res.status(400).json({
          message: `Product ${productId} not found or does not belong to this store`,
        });
      }
    }
    
    // Update featured products
    store.featuredProducts = productIds;
    await store.save();
    
    res.json(store.featuredProducts);
  } catch (error) {
    console.error('Error updating featured products:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Store or product not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
