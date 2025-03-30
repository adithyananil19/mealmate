const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cart: [
        {
            mealId: { type: mongoose.Schema.Types.ObjectId, ref: "Meal", required: true },
            quantity: { type: Number, required: true },
        }
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["pending", "approved", "paid", "closed"], default: "pending" },
    qrToken: { type: String, default: null }, // Generated after approval
    paymentMethod: { type: String, enum: ["cash", "upi"], required: false },
    paymentTime: { type: Date, default: null }, // Payment timestamp
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
