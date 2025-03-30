const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const { MongoClient, GridFSBucket } = require("mongodb");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Initialize GridFSBucket
const conn = mongoose.connection;
let gfs, gridFSBucket;

conn.once("open", () => {
    gridFSBucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
    console.log("✅ GridFSBucket initialized");
});

// GridFS Storage Engine (For Uploading Files)
const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: (req, file) => ({
        filename: `${Date.now()}-${file.originalname}`,
        bucketName: "uploads" // Must match the GridFSBucket name
    })
});

const upload = multer({ storage });

// ✅ Route to upload an image
app.post("/upload", upload.single("photo"), (req, res) => {
    res.json({ file: req.file });
});

// ✅ Route to serve images
app.get("/image/:filename", async (req, res) => {
    try {
        const file = await conn.db.collection("uploads.files").findOne({ filename: req.params.filename });

        if (!file) return res.status(404).json({ message: "File not found" });

        const readStream = gridFSBucket.openDownloadStreamByName(req.params.filename);
        readStream.pipe(res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Routes (Import After Middleware)
const userRoutes = require("./routes/userRoutes");
const mealRoutes = require("./routes/mealRoutes");
const orderRoutes = require("./routes/orderRoutes");
const penaltyRoutes = require("./routes/penaltyRoutes");

app.use("/api/users", userRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/penalties", penaltyRoutes);

// Root Route
app.get("/", (req, res) => {
    res.send("🚀 Canteen Management Backend Running!");
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("🔥 Global Error:", err);
    res.status(500).json({ message: "Unexpected server error", error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
