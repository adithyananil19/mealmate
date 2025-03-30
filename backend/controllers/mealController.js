const Meal = require("../models/Meal");
const mongoose = require("mongoose");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");

// MongoDB connection
const conn = mongoose.connection;
let gfs, gridFSBucket;

conn.once("open", () => {
    gridFSBucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: "mealPhotos" });
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("mealPhotos");
});

// Configure GridFS storage for meal images
const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: (req, file) => ({
        filename: `${Date.now()}-${file.originalname}`,
        bucketName: "mealPhotos"
    })
});
const upload = multer({ storage });

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
        const photo = req.file ? req.file.filename : null;
        const meal = new Meal({ name, price, description, photo });

        await meal.save();
        res.status(201).json({ message: "Meal created successfully", mealId: meal._id });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.updateMeal = async (req, res) => {
    try {
        const updatedData = req.body;
        if (req.file) {
            updatedData.photo = req.file.filename;
        }
        const updatedMeal = await Meal.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        res.json(updatedMeal);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteMeal = async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.id);
        if (!meal) return res.status(404).json({ message: "Meal not found" });
        if (meal.photo) {
            await gridFSBucket.delete(new mongoose.Types.ObjectId(meal.photo));
        }
        await Meal.findByIdAndDelete(req.params.id);
        res.json({ message: "Meal deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Serve meal images from GridFS
exports.getMealPhoto = async (req, res) => {
    try {
        const file = await gfs.files.findOne({ filename: req.params.filename });
        if (!file) return res.status(404).json({ message: "File not found" });
        const readStream = gridFSBucket.openDownloadStream(file._id);
        readStream.pipe(res);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Middleware for handling file upload
exports.uploadMealPhoto = upload.single("photo");
