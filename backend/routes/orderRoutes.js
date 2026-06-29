const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Meal = require('../models/Meal');
const auth = require('../middleware/auth');

// Generate a clean 6-char alphanumeric order code
function generateOrderCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No ambiguous chars (0,O,1,I)
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// ── USER ROUTES ──────────────────────────────────────────────────────────────

// Create a new order
router.post('/', auth, async (req, res) => {
    try {
        const { userId, cart, totalPrice, paymentMethod } = req.body;

        if (!userId || !cart || !Array.isArray(cart) || cart.length === 0) {
            return res.status(400).json({ message: 'Invalid order data' });
        }

        // Users can only create orders for themselves
        if (req.user.id !== userId) {
            return res.status(403).json({ message: 'Unauthorized: Cannot create order for another user' });
        }

        // Validate all meals exist and have stock
        let calculatedTotal = 0;
        for (const item of cart) {
            const meal = await Meal.findById(item.mealId);
            if (!meal) return res.status(404).json({ message: `Meal not found: ${item.mealId}` });
            if (!meal.availability || meal.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for: ${meal.name}` });
            }
            calculatedTotal += meal.price * item.quantity;
        }

        const newOrder = new Order({
            userId,
            cart,
            totalPrice: totalPrice || parseFloat(calculatedTotal.toFixed(2)),
            status: 'pending',
            paymentMethod: paymentMethod || null,
            createdAt: new Date()
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get orders for a specific user
router.get('/user/:userId', auth, async (req, res) => {
    try {
        const { userId } = req.params;

        if (req.user.id !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Cancel/update own order
router.patch('/:orderId', auth, async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        // User can only cancel their own pending orders
        if (req.user.id !== order.userId.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Regular users can only close (cancel) their own pending orders
        if (req.user.role !== 'admin') {
            if (order.status !== 'pending') {
                return res.status(400).json({ message: 'Can only cancel pending orders' });
            }
            if (status !== 'closed') {
                return res.status(403).json({ message: 'Users can only cancel orders' });
            }
        }

        order.status = status;
        if (status === 'paid') order.paymentTime = new Date();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get a specific order
router.get('/:orderId', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate('cart.mealId');
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (req.user.id !== order.userId.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ── ADMIN ROUTES ─────────────────────────────────────────────────────────────

// Get ALL orders (admin only)
router.get('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        const orders = await Order.find()
            .populate('userId', 'name universityId email')
            .populate('cart.mealId', 'name price photo')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Admin approve order → generates 6-char order code
router.patch('/admin/:orderId', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const { orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.status = status;

        // Generate order code when approving
        if (status === 'approved' && !order.qrToken) {
            let code;
            let isUnique = false;
            // Ensure uniqueness
            while (!isUnique) {
                code = generateOrderCode();
                const existing = await Order.findOne({ qrToken: code });
                if (!existing) isUnique = true;
            }
            order.qrToken = code;
        }

        if (status === 'paid') order.paymentTime = new Date();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Counter: Look up order by 6-char code
router.get('/counter/:code', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const order = await Order.findOne({ qrToken: req.params.code.toUpperCase() })
            .populate('userId', 'name universityId email')
            .populate('cart.mealId', 'name price category photo');

        if (!order) return res.status(404).json({ message: 'Invalid code — order not found' });

        res.json({
            orderId: order._id,
            code: order.qrToken,
            userName: order.userId?.name,
            universityId: order.userId?.universityId,
            cart: order.cart.map(item => ({
                mealName: item.mealId?.name || 'Unknown',
                quantity: item.quantity,
                price: item.mealId?.price || 0
            })),
            total: order.totalPrice,
            status: order.status,
            createdAt: order.createdAt
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Counter: Mark order as paid
router.patch('/counter/:code/pay', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const order = await Order.findOne({ qrToken: req.params.code.toUpperCase() });
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.status === 'paid') {
            return res.status(400).json({ message: 'Order already paid' });
        }
        if (order.status !== 'approved') {
            return res.status(400).json({ message: 'Order must be approved before payment' });
        }

        order.status = 'paid';
        order.paymentTime = new Date();
        order.paymentMethod = req.body.paymentMethod || 'cash';

        await order.save();

        // Reduce stock for each meal in the order
        for (const item of order.cart) {
            await Meal.findByIdAndUpdate(item.mealId, {
                $inc: { stock: -item.quantity }
            });
        }

        res.json({ message: 'Payment confirmed', order });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;