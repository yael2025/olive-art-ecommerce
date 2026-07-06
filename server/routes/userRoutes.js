const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const { registerUser, loginUser,getWishlist,addToWishlist,
  removeFromWishlist, } = require("../controllers/userController");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/wishlist", protect, getWishlist);

router.post("/wishlist/:productId", protect, addToWishlist);

router.delete("/wishlist/:productId", protect, removeFromWishlist);

module.exports = router;