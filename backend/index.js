const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const mealRoutes = require("./routes/mealRoutes");
const orderRoutes = require("./routes/orderRoutes");
const penaltyRoutes = require("./routes/penaltyRoutes"); // Added penalty routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/penalties", penaltyRoutes); // Added penalty route

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    // Removed deprecated options
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Root Route
app.get("/", (req, res) => {
  res.send("🚀 Canteen Management Backend Running!");
});


app.use((err, req, res, next) => {
    console.error("🔥 Global Error:", err);
    res.status(500).json({ message: "Unexpected server error", error: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
