const express = require("express");
const router = express.Router();
const mealController = require("../controllers/mealController");

// ✅ Apply `uploadMealPhoto` middleware for image handling
router.get("/", mealController.getMeals);
router.get("/:id", mealController.getMealById);
router.post("/", mealController.uploadMealPhoto, mealController.createMeal);
router.put("/:id", mealController.uploadMealPhoto, mealController.updateMeal);
router.delete("/:id", mealController.deleteMeal);

module.exports = router;
