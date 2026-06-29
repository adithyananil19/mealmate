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
        const { name, price, description, category, stock, onMenu, photo } = req.body;
        const meal = new Meal({
            name,
            price: parseFloat(price),
            description: description || '',
            category: category || 'Hot Dishes',
            stock: parseInt(stock) || 0,
            onMenu: onMenu === 'true' || onMenu === true,
            availability: (parseInt(stock) || 0) > 0,
            photo: photo || null,
        });
        await meal.save();
        res.status(201).json({ message: "Meal created successfully", meal });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.updateMeal = async (req, res) => {
    try {
        const updatedData = { ...req.body };
        if (updatedData.price) updatedData.price = parseFloat(updatedData.price);
        if (updatedData.stock !== undefined) {
            updatedData.stock = parseInt(updatedData.stock);
            updatedData.availability = updatedData.stock > 0;
        }
        const updatedMeal = await Meal.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!updatedMeal) return res.status(404).json({ message: "Meal not found" });
        res.json(updatedMeal);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.deleteMeal = async (req, res) => {
    try {
        const meal = await Meal.findByIdAndDelete(req.params.id);
        if (!meal) return res.status(404).json({ message: "Meal not found" });
        res.json({ message: "Meal deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
