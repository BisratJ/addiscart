const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    icon: {
      type: String, // Emoji or icon class name
      default: '📦',
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    level: {
      type: Number,
      default: 0, // 0 = top level, 1 = subcategory, 2 = sub-subcategory
    },
    order: {
      type: Number,
      default: 0, // For custom sorting
    },
    productCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    metadata: {
      color: String, // For UI theming
      keywords: [String], // For better search
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for search functionality
categorySchema.index({ name: 'text', description: 'text' });
// Add compound index for efficient queries
categorySchema.index({ store: 1, isActive: 1, order: 1 });
categorySchema.index({ store: 1, parentCategory: 1, isActive: 1 });
categorySchema.index({ slug: 1, store: 1 }, { unique: true });

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentCategory',
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
