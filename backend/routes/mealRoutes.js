const express = require("express");
const { getMeals, getMealById, createMeal, updateMeal, deleteMeal } = require("../controllers/mealController");

const router = express.Router();

router.get("/", getMeals);
router.get("/:id", getMealById);
router.post("/", createMeal);  // This is where the error occurs if undefined
router.put("/:id", updateMeal);
router.delete("/:id", deleteMeal);

module.exports = router;
