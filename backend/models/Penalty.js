const mongoose = require("mongoose");

const PenaltySchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Reference to user
    reason: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "paid"], default: "pending" },
}, { timestamps: true });

const Penalty = mongoose.model("Penalty", PenaltySchema);
module.exports = Penalty;
