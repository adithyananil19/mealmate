const mongoose = require("mongoose");

const MealSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    availability: { type: Boolean, default: true },
    category: { type: String, required: true },
    description: { type: String },
    photo: { type: String } // Stores the uploaded image filename
});

module.exports = mongoose.model("Meal", MealSchema);
