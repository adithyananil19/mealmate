const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    universityId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'staff', 'admin'], required: true },
    userType: { type: String, enum: ['regular', 'occasional'], default: 'regular' }, // ✅ Added userType
    isApproved: { type: Boolean, default: false } // ✅ Tracks admin approval
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
module.exports = User;
