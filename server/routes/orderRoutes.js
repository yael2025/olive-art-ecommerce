const express = require("express");
const router = express.Router();

const {
    createOrder,
    getMyOrders,
    getOrders,
    markAsDelivered,
  } = require("../controllers/orderController");

  const { protect, admin } = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.get("/", protect, admin, getOrders);
router.put("/:id/deliver", protect, admin, markAsDelivered);

module.exports = router;