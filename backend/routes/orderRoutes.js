const express = require("express");
const { 
    createOrder, 
    getOrders, 
    getOrderById, 
    updateOrder, 
    deleteOrder, 
    approveOrder // ✅ Import this function
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);
router.post("/approve", approveOrder);  // ✅ Add this line

module.exports = router;
