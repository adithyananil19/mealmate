const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    universityId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    userType: { type: String, enum: ["regular", "non-regular"], default: "regular" },
    isApproved: { type: Boolean, default: false },
    photo: { type: String, required: true }, // Store the filename from GridFS
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
