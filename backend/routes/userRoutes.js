const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../middleware/upload"); // ✅ Import GridFS upload middleware

// User routes using universityId
router.get("/:universityId", userController.getUserByUniversityId);
router.post("/login", userController.loginUser);
router.put("/approve/:universityId", userController.approveUser);

// ✅ Register user with photo upload using GridFS
router.post("/register", upload.single("photo"), userController.registerUser);

// ✅ Get user photo from GridFS
router.get("/photo/:filename", userController.getUserPhoto);

module.exports = router;
