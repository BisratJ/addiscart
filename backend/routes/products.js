const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Store = require('../models/Store');
const { authenticate, isAdmin } = require('../middleware/auth');

// @route   GET api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, category, store, limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let query = { isActive: true };
    
    // Filter by category if provided
    if (category) {
      query.category = category;
    }
    
    // Filter by store if provided
    if (store) {
      query.store = store;
    }
    
    // Add search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    const products = await Product.find(query)
      .populate('category')
      .populate('store', 'name logo')
      .sort({ createdAt: -1 })
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
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true,
    })
      .populate('category')
      .populate('store', 'name logo');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error getting product:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/products
// @desc    Create a product
// @access  Private (admin only)
router.post(
  '/',
  authenticate,
  isAdmin,
  [
    body('name', 'Name is required').not().isEmpty(),
    body('description', 'Description is required').not().isEmpty(),
    body('price', 'Price is required').isNumeric(),
    body('category', 'Category is required').not().isEmpty(),
    body('store', 'Store is required').not().isEmpty(),
    body('stock', 'Stock is required').isNumeric(),
    body('unit', 'Unit is required').isIn(['each', 'lb', 'oz', 'kg', 'g', 'l', 'ml']),
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
        price,
        salePrice,
        onSale,
        images,
        category,
        store,
        stock,
        unit,
        weight,
        dimensions,
        brand,
        tags,
        isFeatured,
        nutritionFacts,
      } = req.body;
      
      // Check if category exists and belongs to the store
      const categoryExists = await Category.findOne({
        _id: category,
        store,
      });
      
      if (!categoryExists) {
        return res.status(400).json({
          message: 'Category not found or does not belong to the specified store',
        });
      }
      
      // Check if store exists
      const storeExists = await Store.findById(store);
      if (!storeExists) {
        return res.status(400).json({ message: 'Store not found' });
      }
      
      // Create new product
      const product = new Product({
        name,
        description,
        price,
        salePrice: salePrice || 0,
        onSale: onSale || false,
        images: images || [],
        category,
        store,
        stock,
        unit,
        weight,
        dimensions,
        brand,
        tags: tags || [],
        isFeatured: isFeatured || false,
        nutritionFacts,
      });
      
      // Save product
      await product.save();
      
      res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT api/products/:id
// @desc    Update a product
// @access  Private (admin only)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      salePrice,
      onSale,
      images,
      category,
      stock,
      unit,
      weight,
      dimensions,
      brand,
      tags,
      isFeatured,
      isActive,
      nutritionFacts,
    } = req.body;
    
    // Build product object
    const productFields = {};
    if (name !== undefined) productFields.name = name;
    if (description !== undefined) productFields.description = description;
    if (price !== undefined) productFields.price = price;
    if (salePrice !== undefined) productFields.salePrice = salePrice;
    if (onSale !== undefined) productFields.onSale = onSale;
    if (images !== undefined) productFields.images = images;
    if (category !== undefined) productFields.category = category;
    if (stock !== undefined) productFields.stock = stock;
    if (unit !== undefined) productFields.unit = unit;
    if (weight !== undefined) productFields.weight = weight;
    if (dimensions !== undefined) productFields.dimensions = dimensions;
    if (brand !== undefined) productFields.brand = brand;
    if (tags !== undefined) productFields.tags = tags;
    if (isFeatured !== undefined) productFields.isFeatured = isFeatured;
    if (isActive !== undefined) productFields.isActive = isActive;
    if (nutritionFacts !== undefined) productFields.nutritionFacts = nutritionFacts;
    
    // Check if product exists
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // If category is being updated, check if it exists and belongs to the store
    if (category) {
      const categoryExists = await Category.findOne({
        _id: category,
        store: product.store,
      });
      
      if (!categoryExists) {
        return res.status(400).json({
          message: 'Category not found or does not belong to the product store',
        });
      }
    }
    
    // Update product
    product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: productFields },
      { new: true }
    );
    
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/products/:id
// @desc    Delete a product
// @access  Private (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    // Instead of deleting, deactivate the product
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deactivated' });
  } catch (error) {
    console.error('Error deactivating product:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/products/search/:query
// @desc    Search products
// @access  Public
router.get('/search/:query', async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const products = await Product.find({
      $text: { $search: req.params.query },
      isActive: true,
    })
      .populate('category')
      .populate('store', 'name logo')
      .sort({ score: { $meta: 'textScore' } })
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await Product.countDocuments({
      $text: { $search: req.params.query },
      isActive: true,
    });
    
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
    console.error('Error searching products:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
