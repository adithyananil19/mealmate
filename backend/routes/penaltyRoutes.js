const express = require("express");
const router = express.Router();
const penaltyController = require("../controllers/penaltyController");

// Routes
router.post("/add", penaltyController.addPenalty);
router.get("/:universityId", penaltyController.getPenaltiesByUser);
router.post("/pay/:penaltyId", penaltyController.markPenaltyAsPaid); // Added new route

module.exports = router;