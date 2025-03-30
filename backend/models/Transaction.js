const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["cash", "upi"], required: true },
    upiTransactionId: { type: String, required: function() { return this.paymentMethod === "upi"; } }, // Store UPI details if UPI
    paymentTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
