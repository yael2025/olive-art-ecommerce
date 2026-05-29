const express = require("express");
const router = express.Router();

const { generateProductDescription } = require("../controllers/aiController");
const { protect, admin } = require("../middleware/authMiddleware");

router.post("/product-description", protect, admin, generateProductDescription);

module.exports = router;