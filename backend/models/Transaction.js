const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    universityId: { type: String, required: true }, // Changed from email to universityId
    amount: { type: Number, required: true },
    type: { type: String, enum: ['credit', 'debit'], required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction;
