const Meal = require("../models/Meal");

exports.getMeals = async (req, res) => {
    try {
        const meals = await Meal.find();
        res.json(meals);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.getMealById = async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.id);
        if (!meal) return res.status(404).json({ message: "Meal not found" });
        res.json(meal);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.createMeal = async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const meal = new Meal({ name, price, description });

        await meal.save();
        res.status(201).json({ message: "Meal created successfully", mealId: meal._id });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


exports.updateMeal = async (req, res) => {
    try {
        const updatedMeal = await Meal.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedMeal);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteMeal = async (req, res) => {
    try {
        await Meal.findByIdAndDelete(req.params.id);
        res.json({ message: "Meal deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
