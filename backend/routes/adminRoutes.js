// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');

// Admin-only route
router.get('/dashboard', adminAuth, (req, res) => {
  // Admin dashboard logic
  res.send('Admin Dashboard');
});

module.exports = router;