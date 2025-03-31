const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const { GridFSBucket } = require("mongodb");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Add this near the top of your index.js file
const config = require('config');
const mongoURI = config.get('mongoURI');

// MongoDB Connection (just once)
mongoose
    .connect(mongoURI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const conn = mongoose.connection;
let gridFSBucket, upload;

// ✅ Initialize GridFS after MongoDB connection
conn.once("open", () => {
    console.log("✅ MongoDB connection opened");

    // ✅ Initialize GridFSBucket
    gridFSBucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
    console.log("✅ GridFSBucket initialized");

    try {
        // ✅ Define GridFsStorage inside the connection callback
        const storage = new GridFsStorage({
            db: conn.db, // Use the active DB connection
            file: (req, file) => ({
                filename: `${Date.now()}-${file.originalname}`,
                bucketName: "uploads"
            })
        });

        storage.on("connection", () => {
            console.log("✅ GridFsStorage initialized");
            upload = multer({ storage }); // Assign to upload variable
        });

        storage.on("error", (err) => {
            console.error("❌ GridFsStorage Error:", err);
        });
    } catch (error) {
        console.error("❌ Storage Engine Initialization Error:", error);
    }
});

// ✅ Route to upload an image
app.post("/upload", (req, res, next) => {
    if (!upload) return res.status(500).json({ message: "Storage engine not initialized" });

    upload.single("photo")(req, res, (err) => {
        if (err) return res.status(500).json({ message: "Upload error", error: err.message });
        res.json({ file: req.file });
    });
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
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const mealRoutes = require("./routes/mealRoutes");
const orderRoutes = require("./routes/orderRoutes");
const penaltyRoutes = require("./routes/penaltyRoutes");

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/penalties", penaltyRoutes);


// Root Route
app.get("/", (req, res) => {
    res.send("🚀 Canteen Management Backend Running!");
});

// Global Error Handler
const errorHandler = (err, req, res, next) => {
    console.error("🔥 Error Details:", {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query,
        timestamp: new Date().toISOString()
    });
    
    // Don't expose internal error details in production
    const isProd = process.env.NODE_ENV === 'production';
    
    res.status(err.statusCode || 500).json({ 
        message: err.message || "Unexpected server error", 
        error: isProd ? 'An error occurred' : err.message,
        stack: isProd ? null : err.stack 
    });
};

app.use(errorHandler);
// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));
  
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  }

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Server available at: http://localhost:${PORT}`);
});