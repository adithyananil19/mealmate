const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = "yourSuperSecretKey123!@#";

// Signup
const signup = async (req, res) => {
    try {
        const { universityId, password, name, email, userType } = req.body;

        if (!universityId || !password || !name || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ $or: [{ universityId }, { email }] });
        if (existingUser) return res.status(400).json({ message: "User already exists with this ID or email" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            universityId,
            userType: userType || "regular",
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// User Login
const login = async (req, res) => {
    try {
        const { universityId, password } = req.body;

        const user = await User.findOne({ universityId });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        // Block admin from logging in via user endpoint
        if (user.role === "admin") {
            return res.status(403).json({ message: "Please use the admin login" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, isAdmin: false },
            JWT_SECRET,
            { expiresIn: "8h" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                universityId: user.universityId,
                userType: user.userType,
                uniId: user.universityId,
                isAdmin: false
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

// Admin Login
const adminLogin = async (req, res) => {
    try {
        const { universityId, password } = req.body;

        // Check role field
        const admin = await User.findOne({ universityId, role: "admin" });
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: admin._id, role: "admin", isAdmin: true },
            JWT_SECRET,
            { expiresIn: "8h" }
        );

        return res.status(200).json({
            message: "Admin login successful",
            token,
            user: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                universityId: admin.universityId,
                userType: admin.userType,
                isAdmin: true
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { signup, login, adminLogin };