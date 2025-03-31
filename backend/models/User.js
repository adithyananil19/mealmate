const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    universityId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    userType: { type: String, enum: ["regular", "non-regular"], default: "regular" }, // Changed from "occasional" to match the checks
    isApproved: { type: Boolean, default: false },
    photo: { type: String, required: false }, // Store the filename from GridFS
    createdAt: { type: Date, default: Date.now }
});

// Virtual property for penalty status (better than adding a field that might get out of sync)
UserSchema.virtual('penaltyStatus').get(async function() {
    // This requires the mongoose-lean-virtuals plugin to work with lean queries
    const Penalty = mongoose.model('Penalty');
    const unpaidPenalties = await Penalty.find({ 
        universityId: this.universityId, 
        status: "pending" 
    });
    return {
        hasPenalty: unpaidPenalties.length > 0,
        penalties: unpaidPenalties
    };
});

module.exports = mongoose.model("User", UserSchema);