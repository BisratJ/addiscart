const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    salePrice: {
      type: Number,
      min: 0,
      default: 0,
    },
    onSale: {
      type: Boolean,
      default: false,
    },
    images: [
      {
        type: String,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      enum: ['each', 'lb', 'oz', 'kg', 'g', 'l', 'ml'],
    },
    weight: {
      type: Number,
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    brand: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
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
    nutritionFacts: {
      calories: Number,
      fat: Number,
      carbs: Number,
      protein: Number,
      ingredients: String,
      allergens: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for search functionality
productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });

// Virtual for current price (sale price if on sale, otherwise regular price)
productSchema.virtual('currentPrice').get(function () {
  return this.onSale && this.salePrice > 0 ? this.salePrice : this.price;
});

// Ensure virtuals are included in JSON output
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
