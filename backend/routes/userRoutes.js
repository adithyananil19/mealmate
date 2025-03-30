const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../middleware/upload"); // ✅ Import the upload middleware

// User routes using universityId
router.get('/:universityId', userController.getUserByUniversityId);
router.post('/login', userController.loginUser);
router.put('/approve/:universityId', userController.approveUser);

// ✅ Register user with file upload
router.post("/register", upload.single("photo"), userController.registerUser);

// ✅ Get user photo
router.get("/photo/:userId", userController.getUserPhoto);

module.exports = router;
