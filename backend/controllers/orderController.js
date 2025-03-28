const Order = require("../models/Order");
const Meal = require("../models/Meal");
const User = require("../models/User"); // ✅ Add missing User import

// Create an order
const createOrder = async (req, res) => {
    try {
        const { universityId, mealId, quantity } = req.body;

        // Find the user
        const user = await User.findOne({ universityId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if occasional users are approved
        if (user.userType === "occasional" && !user.isApproved) {
            return res.status(403).json({ message: "User requires admin approval before ordering" });
        }

        // Calculate total price
        const meal = await Meal.findById(mealId);
        if (!meal) {
            return res.status(404).json({ message: "Meal not found" });
        }

        const totalPrice = meal.price * quantity;

        // Create new order
        const newOrder = new Order({
            universityId,
            mealId,
            quantity,
            totalPrice
        });

        await newOrder.save();
        res.status(201).json({ message: "Order placed successfully", order: newOrder });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
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
        const { orderId, status } = req.body; // status should be 'approved' or 'rejected'
        
        // Validate status
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        // Find and update the order
        const order = await Order.findByIdAndUpdate(orderId, { approvalStatus: status }, { new: true });
        if (!order) return res.status(404).json({ message: "Order not found" });

        res.json({ message: `Order ${status} successfully`, order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Export all functions properly
module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    approveOrder  // ✅ Add this line
};
