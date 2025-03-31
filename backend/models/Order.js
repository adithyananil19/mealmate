const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for cart items within an order
const CartItemSchema = new Schema({
  mealId: {
    type: Schema.Types.ObjectId,
    ref: 'Meal',  // Reference to your Meal model if you have one
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

// Define the main Order schema
const OrderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',  // Reference to your User model
    required: true
  },
  cart: {
    type: [CartItemSchema],
    required: true,
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: 'An order must have at least one item'
    }
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'paid', 'closed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit', 'debit', 'mobile', null],
    default: null
  },
  paymentTime: {
    type: Date,
    default: null
  },
  qrToken: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
OrderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', OrderSchema);