// middleware/adminAuth.js
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User'); // adjust path as needed

module.exports = async function(req, res, next) {
  try {
    // Get token from header
    const token = req.header('x-auth-token');
    
    // Check if no token
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    
    // Add user from payload
    const user = await User.findById(decoded.user.id);
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }
    
    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied: Admin privileges required' });
    }
    
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};