const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const dotenv = require("dotenv");

dotenv.config();

// Ensure MongoDB URI is defined
if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not set in .env file!");
    process.exit(1);
}

// GridFS Storage Engine
const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: async (req, file) => {
        console.log("Uploading file:", file);
        return new Promise((resolve, reject) => {
            if (!file) {
                console.error("❌ File is missing!");
                return reject(new Error("File is missing"));
            }
            resolve({
                filename: `${Date.now()}-${file.originalname}`,
                bucketName: "uploads",
            });
        });
    },
});

// Handle storage errors
storage.on("connectionFailed", (err) => {
    console.error("❌ GridFS Storage Connection Failed:", err);
});

const upload = multer({ storage });

module.exports = upload;
