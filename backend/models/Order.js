const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
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

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
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
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      required: true,
    },
    serviceFee: {
      type: Number,
      required: true,
    },
    tip: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shopping', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: {
        type: String,
        enum: ['card', 'paypal'],
        required: true,
      },
      details: {
        cardType: String,
        lastFourDigits: String,
      },
    },
    paymentId: {
      type: String,
    },
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    deliveryInstructions: {
      type: String,
    },
    deliveryTime: {
      type: Date,
    },
    shopper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ['pending', 'processing', 'shopping', 'out_for_delivery', 'delivered', 'cancelled'],
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Generate unique order number before saving
orderSchema.pre('save', async function (next) {
  if (!this.isNew) {
    return next();
  }

  try {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    this.orderNumber = `ORD-${year}${month}${day}-${random}`;
    
    // Add initial status to history
    this.statusHistory.push({
      status: this.status,
      timestamp: Date.now(),
      note: 'Order created',
    });
    
    next();
  } catch (error) {
    next(error);
  }
});

// Method to update order status
orderSchema.methods.updateStatus = function (status, note = '') {
  this.status = status;
  this.statusHistory.push({
    status,
    timestamp: Date.now(),
    note,
  });
  return this;
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
