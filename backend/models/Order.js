const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    universityId: { type: String, required: true },
    mealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal', required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
    approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }, // New field
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
