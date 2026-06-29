const express = require("express");
const router = express.Router();
const mealController = require("../controllers/mealController");
const auth = require("../middleware/auth");

// Public — anyone can view meals
router.get("/", mealController.getMeals);
router.get("/:id", mealController.getMealById);

// Admin only — create, update, delete
router.post("/", auth, mealController.createMeal);
router.put("/:id", auth, mealController.updateMeal);
router.delete("/:id", auth, mealController.deleteMeal);

module.exports = router;
