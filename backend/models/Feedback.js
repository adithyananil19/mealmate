const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    universityId: { type: String, required: true }, // Changed from email to universityId
    mealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);
module.exports = Feedback;
