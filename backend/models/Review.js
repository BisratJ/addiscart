const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
    },
    comment: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure that either product or store is provided
reviewSchema.pre('validate', function (next) {
  if (!this.product && !this.store) {
    next(new Error('Review must be associated with either a product or a store'));
  } else {
    next();
  }
});

// Update product or store rating after saving a review
reviewSchema.post('save', async function () {
  try {
    if (this.product) {
      await updateProductRating(this.product);
    }
    if (this.store) {
      await updateStoreRating(this.store);
    }
  } catch (error) {
    console.error('Error updating ratings:', error);
  }
});

// Update product or store rating after updating a review
reviewSchema.post('findOneAndUpdate', async function (doc) {
  try {
    if (doc.product) {
      await updateProductRating(doc.product);
    }
    if (doc.store) {
      await updateStoreRating(doc.store);
    }
  } catch (error) {
    console.error('Error updating ratings:', error);
  }
});

// Helper function to update product rating
async function updateProductRating(productId) {
  const Review = mongoose.model('Review');
  const Product = mongoose.model('Product');
  
  const reviews = await Review.find({ product: productId, isActive: true });
  const reviewCount = reviews.length;
  
  if (reviewCount === 0) {
    await Product.findByIdAndUpdate(productId, { rating: 0, reviewCount: 0 });
    return;
  }
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviewCount;
  
  await Product.findByIdAndUpdate(productId, {
    rating: averageRating.toFixed(1),
    reviewCount,
  });
}

// Helper function to update store rating
async function updateStoreRating(storeId) {
  const Review = mongoose.model('Review');
  const Store = mongoose.model('Store');
  
  const reviews = await Review.find({ store: storeId, isActive: true });
  const reviewCount = reviews.length;
  
  if (reviewCount === 0) {
    await Store.findByIdAndUpdate(storeId, { rating: 0, reviewCount: 0 });
    return;
  }
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviewCount;
  
  await Store.findByIdAndUpdate(storeId, {
    rating: averageRating.toFixed(1),
    reviewCount,
  });
}

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
