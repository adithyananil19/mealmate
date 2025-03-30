const Order = require("../models/Order");
const Meal = require("../models/Meal");
const User = require("../models/User");
const Transaction = require("../models/Transaction"); // Added missing Transaction import
const Penalty = require("../models/Penalty");

// Create an order
const createOrUpdateOrder = async (req, res) => {
    try {
        const { userId, cart } = req.body;

        // Find user
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if user has unpaid penalties (alternative to isPenalized flag)
        const unpaidPenalties = await Penalty.find({ 
            universityId: user.universityId, 
            status: "pending" 
        });
        
        if (unpaidPenalties.length > 0) 
            return res.status(403).json({ 
                message: "User has unpaid penalties. Please clear penalties before placing new orders.",
                penalties: unpaidPenalties
            });

        let totalPrice = 0;
        for (const item of cart) {
            const meal = await Meal.findById(item.mealId);
            if (!meal) return res.status(404).json({ message: "Meal not found" });

            totalPrice += meal.price * item.quantity;
        }

        const newOrder = new Order({ userId, cart, totalPrice });
        await newOrder.save();

        res.status(201).json({ message: "Order submitted for approval", order: newOrder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all orders
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Get an order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Update an order
const updateOrder = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Delete an order
const deleteOrder = async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: "Order deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Approve or reject an order
const approveOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        order.status = "approved";
        order.qrToken = `QR-${order._id}-${Date.now()}`;
        await order.save();

        res.status(200).json({ message: "Order approved", qrToken: order.qrToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mark Order as Paid
const markOrderPaid = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { paymentMethod, upiTransactionId, upiStatus } = req.body;

        // Find the order
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.status === "paid") return res.status(400).json({ message: "Order already paid" });

        // Create a new transaction
        const transaction = new Transaction({
            userId: order.userId,
            orderId: order._id,
            amount: order.totalPrice,
            paymentMethod,
            upiTransactionId: paymentMethod === "upi" ? upiTransactionId : null,
            paymentTime: new Date()
        });

        await transaction.save();

        // Update order as paid
        order.paymentMethod = paymentMethod;
        order.paymentTime = transaction.paymentTime;
        order.status = "paid";
        await order.save();

        res.status(200).json({ message: "Payment received", transaction });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrderByQR = async (req, res) => {
    try {
        const { qrToken } = req.params;

        const order = await Order.findOne({ qrToken })
            .populate("userId")
            .populate("cart.mealId");

        if (!order) return res.status(404).json({ message: "Invalid QR Code" });

        res.status(200).json({
            orderId: order._id,
            userName: order.userId.name,
            userId: order.userId._id,
            userPhoto: order.userId.photo,
            cart: order.cart.map(item => ({
                mealName: item.mealId.name,
                quantity: item.quantity,
                price: item.mealId.price
            })),
            total: order.totalPrice,
            status: order.status,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePayment = async (req, res) => {
    try {
        const { orderId, paymentMethod, upiTransactionId } = req.body;

        const order = await Order.findById(orderId);
        if (!order || order.status !== "approved") {
            return res.status(400).json({ message: "Invalid order for payment" });
        }

        // Create transaction record
        const transaction = new Transaction({
            orderId,
            userId: order.userId,
            amount: order.totalPrice,
            paymentMethod,
            upiTransactionId: paymentMethod === "upi" ? upiTransactionId : null,
            paymentTime: new Date()
        });

        await transaction.save();

        order.status = "paid";
        order.paymentTime = new Date();
        await order.save();

        res.status(200).json({ message: "Payment successful", order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export all functions properly
module.exports = {
    createOrUpdateOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    approveOrder,
    markOrderPaid,
    getOrderByQR,      // Added missing exports
    updatePayment      // Added missing exports
};