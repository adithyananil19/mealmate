const mongoose = require("mongoose");

const MealSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    availability: { type: Boolean, default: true },
    onMenu: { type: Boolean, default: true },
    stock: { type: Number, default: 0, min: 0 },
    category: { type: String, required: true, enum: ['Hot Dishes', 'Cold Dishes', 'Soup', 'Grill', 'Appetizer', 'Dessert'] },
    description: { type: String, default: '' },
    photo: { type: String, default: null }, // URL or filename
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Meal", MealSchema);
