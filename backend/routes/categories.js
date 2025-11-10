const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Store = require('../models/Store');
const { authenticate, isAdmin } = require('../middleware/auth');

// @route   GET api/categories
// @desc    Get all categories (with optional filtering)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      store, 
      parentCategory, 
      level, 
      featured,
      includeSubcategories = 'false'
    } = req.query;
    
    let query = { isActive: true };
    
    // Filter by store if provided
    if (store) {
      query.store = store;
    }
    
    // Filter by parent category
    if (parentCategory === 'null' || parentCategory === 'none') {
      query.parentCategory = null;
    } else if (parentCategory) {
      query.parentCategory = parentCategory;
    }
    
    // Filter by level
    if (level !== undefined) {
      query.level = parseInt(level);
    }
    
    // Filter by featured
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    let categories = await Category.find(query)
      .populate('store', 'name logo')
      .populate('parentCategory', 'name slug')
      .sort({ order: 1, name: 1 });
    
    // Include subcategories if requested
    if (includeSubcategories === 'true') {
      for (let category of categories) {
        const subcategories = await Category.find({
          parentCategory: category._id,
          isActive: true,
        }).sort({ order: 1, name: 1 });
        category._doc.subcategories = subcategories;
      }
    }
    
    res.json(categories);
  } catch (error) {
    console.error('Error getting categories:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/categories/hierarchy/:storeId
// @desc    Get category hierarchy for a store
// @access  Public
router.get('/hierarchy/:storeId', async (req, res) => {
  try {
    // Get all top-level categories
    const topCategories = await Category.find({
      store: req.params.storeId,
      parentCategory: null,
      isActive: true,
    }).sort({ order: 1, name: 1 });
    
    // Build hierarchy
    const hierarchy = await Promise.all(
      topCategories.map(async (category) => {
        const subcategories = await Category.find({
          parentCategory: category._id,
          isActive: true,
        }).sort({ order: 1, name: 1 });
        
        // Get sub-subcategories for each subcategory
        const subcategoriesWithChildren = await Promise.all(
          subcategories.map(async (sub) => {
            const subSubcategories = await Category.find({
              parentCategory: sub._id,
              isActive: true,
            }).sort({ order: 1, name: 1 });
            
            return {
              ...sub.toObject(),
              subcategories: subSubcategories,
            };
          })
        );
        
        return {
          ...category.toObject(),
          subcategories: subcategoriesWithChildren,
        };
      })
    );
    
    res.json(hierarchy);
  } catch (error) {
    console.error('Error getting category hierarchy:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/categories/:id
// @desc    Get category by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      isActive: true,
    })
      .populate('store', 'name logo')
      .populate('parentCategory', 'name slug icon');
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Get subcategories
    const subcategories = await Category.find({
      parentCategory: category._id,
      isActive: true,
    }).sort({ order: 1, name: 1 });
    
    // Get product count
    const productCount = await Product.countDocuments({
      category: category._id,
      isActive: true,
    });
    
    res.json({
      ...category.toObject(),
      subcategories,
      productCount,
    });
  } catch (error) {
    console.error('Error getting category:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/categories/slug/:slug/:storeId
// @desc    Get category by slug and store
// @access  Public
router.get('/slug/:slug/:storeId', async (req, res) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug,
      store: req.params.storeId,
      isActive: true,
    })
      .populate('store', 'name logo')
      .populate('parentCategory', 'name slug icon');
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Get subcategories
    const subcategories = await Category.find({
      parentCategory: category._id,
      isActive: true,
    }).sort({ order: 1, name: 1 });
    
    // Get products in this category
    const products = await Product.find({
      category: category._id,
      isActive: true,
    })
      .populate('store', 'name logo')
      .limit(20);
    
    res.json({
      ...category.toObject(),
      subcategories,
      products,
    });
  } catch (error) {
    console.error('Error getting category by slug:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/categories
// @desc    Create a category
// @access  Private (admin only)
router.post(
  '/',
  authenticate,
  isAdmin,
  [
    body('name', 'Name is required').not().isEmpty(),
    body('slug', 'Slug is required').not().isEmpty(),
    body('store', 'Store is required').not().isEmpty(),
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
        slug,
        description,
        image,
        icon,
        store,
        parentCategory,
        level,
        order,
        isFeatured,
        metadata,
      } = req.body;
      
      // Check if store exists
      const storeExists = await Store.findById(store);
      if (!storeExists) {
        return res.status(400).json({ message: 'Store not found' });
      }
      
      // Check if category with same slug exists for this store
      const existingCategory = await Category.findOne({ slug, store });
      if (existingCategory) {
        return res.status(400).json({ 
          message: 'Category with this slug already exists for this store' 
        });
      }
      
      // If parent category is provided, validate it
      if (parentCategory) {
        const parentExists = await Category.findOne({
          _id: parentCategory,
          store,
        });
        
        if (!parentExists) {
          return res.status(400).json({
            message: 'Parent category not found or does not belong to the specified store',
          });
        }
      }
      
      // Create new category
      const category = new Category({
        name,
        slug,
        description,
        image,
        icon: icon || '📦',
        store,
        parentCategory: parentCategory || null,
        level: level !== undefined ? level : (parentCategory ? 1 : 0),
        order: order || 0,
        isFeatured: isFeatured || false,
        metadata,
      });
      
      // Save category
      await category.save();
      
      res.status(201).json(category);
    } catch (error) {
      console.error('Error creating category:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT api/categories/:id
// @desc    Update a category
// @access  Private (admin only)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      image,
      icon,
      parentCategory,
      level,
      order,
      isActive,
      isFeatured,
      metadata,
    } = req.body;
    
    // Check if category exists
    let category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // If slug is being updated, check for duplicates
    if (slug && slug !== category.slug) {
      const existingCategory = await Category.findOne({
        slug,
        store: category.store,
        _id: { $ne: req.params.id },
      });
      
      if (existingCategory) {
        return res.status(400).json({
          message: 'Category with this slug already exists for this store',
        });
      }
    }
    
    // If parent category is being updated, validate it
    if (parentCategory && parentCategory !== category.parentCategory?.toString()) {
      const parentExists = await Category.findOne({
        _id: parentCategory,
        store: category.store,
      });
      
      if (!parentExists) {
        return res.status(400).json({
          message: 'Parent category not found or does not belong to the same store',
        });
      }
      
      // Prevent circular reference
      if (parentCategory === req.params.id) {
        return res.status(400).json({
          message: 'Category cannot be its own parent',
        });
      }
    }
    
    // Build category object
    const categoryFields = {};
    if (name !== undefined) categoryFields.name = name;
    if (slug !== undefined) categoryFields.slug = slug;
    if (description !== undefined) categoryFields.description = description;
    if (image !== undefined) categoryFields.image = image;
    if (icon !== undefined) categoryFields.icon = icon;
    if (parentCategory !== undefined) categoryFields.parentCategory = parentCategory || null;
    if (level !== undefined) categoryFields.level = level;
    if (order !== undefined) categoryFields.order = order;
    if (isActive !== undefined) categoryFields.isActive = isActive;
    if (isFeatured !== undefined) categoryFields.isFeatured = isFeatured;
    if (metadata !== undefined) categoryFields.metadata = metadata;
    
    // Update category
    category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: categoryFields },
      { new: true }
    )
      .populate('store', 'name logo')
      .populate('parentCategory', 'name slug');
    
    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/categories/:id
// @desc    Delete/deactivate a category
// @access  Private (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    // Check if category has products
    const productCount = await Product.countDocuments({
      category: req.params.id,
      isActive: true,
    });
    
    if (productCount > 0) {
      return res.status(400).json({
        message: `Cannot delete category with ${productCount} active products. Please reassign or deactivate products first.`,
      });
    }
    
    // Check if category has subcategories
    const subcategoryCount = await Category.countDocuments({
      parentCategory: req.params.id,
      isActive: true,
    });
    
    if (subcategoryCount > 0) {
      return res.status(400).json({
        message: `Cannot delete category with ${subcategoryCount} active subcategories. Please delete subcategories first.`,
      });
    }
    
    // Deactivate the category instead of deleting
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json({ message: 'Category deactivated successfully' });
  } catch (error) {
    console.error('Error deleting category:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/categories/:id/reorder
// @desc    Update category order
// @access  Private (admin only)
router.put('/:id/reorder', authenticate, isAdmin, async (req, res) => {
  try {
    const { order } = req.body;
    
    if (order === undefined) {
      return res.status(400).json({ message: 'Order is required' });
    }
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { order: parseInt(order) },
      { new: true }
    );
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    console.error('Error reordering category:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
