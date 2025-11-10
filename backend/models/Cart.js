const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    items: [cartItemSchema],
    subtotal: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    serviceFee: {
      type: Number,
      default: 0,
    },
    tip: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
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

// Method to calculate cart totals
cartSchema.methods.calculateTotals = function () {
  // Calculate subtotal
  this.subtotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // Calculate tax (assuming 8% tax rate)
  this.tax = this.subtotal * 0.08;
  
  // Calculate total
  this.total = this.subtotal + this.tax + this.deliveryFee + this.serviceFee + this.tip;
  
  return this;
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
