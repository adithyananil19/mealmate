const express = require("express");
const router = express.Router();
const penaltyController = require("../controllers/penaltyController"); // ✅ Ensure this path is correct

// Routes
router.post("/add", penaltyController.addPenalty);  // Check if addPenalty exists
router.get("/:universityId", penaltyController.getPenaltiesByUser);

module.exports = router;
