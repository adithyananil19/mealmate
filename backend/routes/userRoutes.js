const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User routes using universityId
router.get('/:universityId', userController.getUserByUniversityId);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.put('/approve/:universityId', userController.approveUser);


module.exports = router;
