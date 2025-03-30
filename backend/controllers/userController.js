const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Order = require('../models/Order'); // Ensure Order model is imported

// User login using university ID
const loginUser = async (req, res) => {
    const { universityId, password } = req.body;
    try {
        const user = await User.findOne({ universityId });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user by university ID
const getUserByUniversityId = async (req, res) => {
    try {
        const user = await User.findOne({ universityId: req.params.universityId });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Register user with university ID and Photo Upload
const registerUser = async (req, res) => {
    try {
        const { universityId, name, email, password, role, userType } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ universityId });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Ensure photo is uploaded
        if (!req.file) return res.status(400).json({ message: "Photo is required" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            universityId,
            name,
            email,
            password: hashedPassword,
            role,
            userType: userType || "regular",
            isApproved: userType === "regular",
            photo: req.file.filename // Store the filename in MongoDB
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully", user: newUser });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Approve an order
const approveOrder = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const order = await Order.findByIdAndUpdate(orderId, { approvalStatus: status }, { new: true });
        if (!order) return res.status(404).json({ message: "Order not found" });

        res.json({ message: `Order ${status} successfully`, order });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Approve occasional users
const approveUser = async (req, res) => {
    try {
        const { universityId } = req.params;

        const user = await User.findOne({ universityId });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.userType !== "occasional") {
            return res.status(400).json({ message: "Regular users do not need approval" });
        }

        user.isApproved = true;
        await user.save();

        res.status(200).json({ message: "User approved successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Serve user photo
const getUserPhoto = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.redirect(`/image/${user.photo}`); // Fetch image from GridFS
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Export all functions correctly
module.exports = {
    loginUser,
    getUserByUniversityId,
    registerUser,
    approveOrder,
    approveUser,
    getUserPhoto
};
