const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Assuming you have an Order model
const auth = require('../middleware/auth'); // Middleware for authentication

// Create a new order
router.post('/', auth, async (req, res) => {
  try {
    const { userId, cart, totalPrice, status, paymentMethod } = req.body;
    
    // Validate incoming data
    if (!userId || !cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ message: 'Invalid order data' });
    }
    
    // Ensure the authenticated user can only create orders for themselves
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Unauthorized: Cannot create order for another user' });
    }
    
    // Create new order
    const newOrder = new Order({
      userId,
      cart,
      totalPrice,
      status: status || 'pending',
      paymentMethod,
      createdAt: new Date()
    });
    
    // Save to database
    const savedOrder = await newOrder.save();
    
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all orders for a specific user
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Ensure the authenticated user can only view their own orders
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Unauthorized: Cannot view orders for another user' });
    }
    
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error retrieving orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a specific order by ID
router.get('/:orderId', auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Ensure the authenticated user can only view their own orders
    if (req.user.id !== order.userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized: Cannot view order for another user' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error retrieving order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update order status
router.patch('/:orderId', auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Ensure the authenticated user can only update their own orders
    if (req.user.id !== order.userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized: Cannot update order for another user' });
    }
    
    // Update order status
    order.status = status;
    
    // If status is 'paid', add payment time
    if (status === 'paid') {
      order.paymentTime = new Date();
    }
    
    // Save updated order
    const updatedOrder = await order.save();
    
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin routes for managing orders (optional)
// These would typically have additional authentication/authorization

// Get all orders (admin only)
router.get('/', auth, async (req, res) => {
  try {
    // Check if user is admin (assuming you have a role field in your user model)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized: Admin access required' });
    }
    
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error retrieving all orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin update order (can set any status including 'approved', 'completed', etc.)
router.patch('/admin/:orderId', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized: Admin access required' });
    }
    
    const { orderId } = req.params;
    const { status, qrToken } = req.body;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Update fields that were provided
    if (status) order.status = status;
    if (qrToken) order.qrToken = qrToken;
    
    // If status is 'approved' and there's no QR token, generate one
    if (status === 'approved' && !order.qrToken) {
      // Simple QR token generation - in production you'd want something more robust
      order.qrToken = `${order._id.toString().substr(-6)}-${Date.now().toString().substr(-6)}`;
    }
    
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order as admin:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;