const Penalty = require("../models/Penalty");
const User = require("../models/User");

// Add Penalty
exports.addPenalty = async (req, res) => {
    try {
        const { universityId, reason, amount } = req.body;
        
        // Validate user exists
        const user = await User.findOne({ universityId });
        if (!user) return res.status(404).json({ message: "User not found" });
        
        const penalty = new Penalty({ universityId, reason, amount });
        await penalty.save();
        
        res.status(201).json({ message: "Penalty added successfully", penalty });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Get Penalties by University ID
exports.getPenaltiesByUser = async (req, res) => {
    try {
        const penalties = await Penalty.find({ universityId: req.params.universityId });
        res.json(penalties);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Mark penalty as paid
exports.markPenaltyAsPaid = async (req, res) => {
    try {
        const { penaltyId } = req.params;
        
        const penalty = await Penalty.findById(penaltyId);
        if (!penalty) return res.status(404).json({ message: "Penalty not found" });
        
        penalty.status = "paid";
        await penalty.save();
        
        res.json({ message: "Penalty marked as paid", penalty });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};