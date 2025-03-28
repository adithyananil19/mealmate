const Penalty = require("../models/Penalty");  // Ensure correct model import

// Add Penalty
exports.addPenalty = async (req, res) => {
    try {
        const { universityId, reason, amount } = req.body;
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
