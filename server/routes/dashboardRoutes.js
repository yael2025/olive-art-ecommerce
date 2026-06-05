const express = require("express");
const router = express.Router();

const { getDashboardStats } = require("../controllers/dashboardController");
const { protect, businessManager } = require("../middleware/authMiddleware");

router.get("/stats", protect, businessManager, getDashboardStats);

module.exports = router;