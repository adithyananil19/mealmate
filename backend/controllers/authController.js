const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Signup controller function
const signup = async (req, res) => {
    console.log("Signup request received:", req.body); // Debug log
    try {
        console.log("In try", req.body); // Debug log
        const { universityId, password, name, email, userType } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ universityId });
        if (existingUser) return res.status(400).json({ message: "User already exists" });
        console.log("Existing user check:", existingUser); // ✅ Debugging step

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed Password:", hashedPassword); // ✅ Debugging step
        

        // Create new user
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            universityId: req.body.universityId,
            userType: req.body.userType,
            password: hashedPassword,
          
        });


        const savedUser = await newUser.save();
        console.log("User saved:", savedUser); // ✅ Debugging step

        res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
        console.error("Signup Error:", error); // 🛑 This will show the exact error
        res.status(500).json({ message: "Internal server error" });
        }
        };

// Login controller function
const login = async (req, res) => {
    try {
        const { universityId, password, isAdmin } = req.body;
        
        // Find user by university ID and if admin mode is enabled, check userType
        const query = { universityId };
        if (isAdmin) {
            query.userType = "admin";
        }
        
        const user = await User.findOne(query);
        if (!user) {
            return res.status(404).json({ 
                message: isAdmin ? "Admin not found" : "User not found" 
            });
        }
        
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
        
        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user._id,
                isAdmin: user.userType === "admin" 
            }, 
            "yourSuperSecretKey123!@#", 
            { expiresIn: "1h" }
        );
        
        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                universityId: user.universityId,
                userType: user.userType,
                isAdmin: user.userType === "admin"
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

// Admin login controller function
const adminLogin = async (req, res) => {
    try {
        const { universityId, password } = req.body;
        
        // Find admin by university ID
        const admin = await User.findOne({ 
            universityId,
            role: "admin" 
        });
        
        if (!admin) return res.status(404).json({ message: "Admin not found" });
        
        // Compare password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
        
        // Generate JWT token
        const token = jwt.sign(
            { 
                id: admin._id,
                isAdmin:  admin.role === "admin"  // ✅ Use "role" instead of "userType" 
            }, 
            "yourSuperSecretKey123!@#", 
            { expiresIn: "1h" }
        );
        
        return res.status(200).json({
            message: "Admin login successful",
            token,
            user: {
                id: admin._id,
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