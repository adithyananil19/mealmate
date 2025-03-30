const express = require("express");
const { 
    createOrUpdateOrder,  // ✅ Make sure this matches the function in the controller
    getOrders, 
    getOrderById, 
    updateOrder, 
    deleteOrder, 
    approveOrder, 
    markOrderPaid  
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", createOrUpdateOrder); // ✅ Corrected function name
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);
router.post("/approve", approveOrder);
router.post("/mark-paid/:orderId", markOrderPaid);

module.exports = router;
