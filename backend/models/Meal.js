const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    availability: { type: Boolean, default: true }
});

const Meal = mongoose.model('Meal', MealSchema);
module.exports = Meal;
