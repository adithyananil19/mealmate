const express = require("express");
const { 
    createOrUpdateOrder,
    getOrders, 
    getOrderById, 
    updateOrder, 
    deleteOrder, 
    approveOrder, 
    markOrderPaid,
    getOrderByQR,
    updatePayment
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", createOrUpdateOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);
router.post("/approve/:orderId", approveOrder); // Fixed to use orderId param
router.post("/mark-paid/:orderId", markOrderPaid);
router.get("/qr/:qrToken", getOrderByQR); // Added missing route
router.post("/payment", updatePayment); // Added missing route

module.exports = router;