const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Order = require('../models/Order');

// User login using university ID
const loginUser = async (req, res) => {
    const { universityId, password } = req.body;
    try {
        const user = await User.findOne({ universityId });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // Send only necessary user data without password
        res.json({ 
            token, 
            user: {
                _id: user._id,
                name: user.name,
                universityId: user.universityId,
                email: user.email,
                role: user.role,
                userType: user.userType,
                isApproved: user.isApproved
            } 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user by university ID
const getUserByUniversityId = async (req, res) => {
    try {
        const user = await User.findOne({ universityId: req.params.universityId });
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        // Remove password from response
        const userData = user.toObject();
        delete userData.password;
        
        res.json(userData);
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
            isApproved: userType === "regular", // Regular users are auto-approved
            photo: req.file.filename // Store the filename in MongoDB
        });

        await newUser.save();
        
        // Remove password from response
        const userData = newUser.toObject();
        delete userData.password;
        
        res.status(201).json({ message: "User registered successfully", user: userData });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Approve an order - Use OrderController's approach instead, remove this duplicated function
// If you need admin order approval logic, redirect to OrderController
const approveOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        order.status = "approved";
        order.qrToken = `QR-${order._id}-${Date.now()}`;
        await order.save();

        res.status(200).json({ message: "Order approved", qrToken: order.qrToken });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Approve non-regular users
const approveUser = async (req, res) => {
    try {
        const { universityId } = req.params;

        const user = await User.findOne({ universityId });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.userType !== "non-regular") {  // Changed from "occasional" to "non-regular"
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

// Export all functions correctly
module.exports = {
    loginUser,
    getUserByUniversityId,
    registerUser,
    approveOrder,
    approveUser,
    getUserPhoto
};