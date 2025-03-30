const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const dotenv = require("dotenv");

dotenv.config();

// GridFS Storage Engine
const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: (req, file) => ({
        filename: `${Date.now()}-${file.originalname}`,
        bucketName: "uploads"
    })
});

// Multer upload middleware
const upload = multer({ storage });

module.exports = upload;
