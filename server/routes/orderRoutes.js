const express = require("express");
const router = express.Router();

const {
    createOrder,
    getMyOrders,
    getOrders,
    markAsDelivered,
    markAsPaid,
    getOrderById,
  } = require("../controllers/orderController");

  const { protect, admin } = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.get("/", protect, admin, getOrders);
router.put("/:id/deliver", protect, admin, markAsDelivered);
router.put("/:id/pay", protect, admin, markAsPaid);
router.get("/:id", protect, getOrderById);

module.exports = router;