const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const config = require("config");

dotenv.config();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));

// MongoDB Connection
const mongoURI = config.get("mongoURI");
mongoose
    .connect(mongoURI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const mealRoutes = require("./routes/mealRoutes");
const orderRoutes = require("./routes/orderRoutes");
const penaltyRoutes = require("./routes/penaltyRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/penalties", penaltyRoutes);

// Health check
app.get("/", (req, res) => {
    res.json({ message: "🚀 MealMate Backend Running!", status: "ok" });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("🔥 Error:", err.message);
    res.status(err.statusCode || 500).json({
        message: err.message || "Unexpected server error"
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});