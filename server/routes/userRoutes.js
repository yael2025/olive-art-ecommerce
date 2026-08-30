const express = require("express");
const router = express.Router();
const { protect,admin  } = require("../middleware/authMiddleware");

const { registerUser, loginUser,getWishlist,addToWishlist,
  removeFromWishlist, getUsers, updateUserRole,} = require("../controllers/userController");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/", protect, admin, getUsers);

router.put( "/:id/role",protect,admin,updateUserRole);

router.get("/wishlist", protect, getWishlist);

router.post("/wishlist/:productId", protect, addToWishlist);

router.delete("/wishlist/:productId", protect, removeFromWishlist);

module.exports = router;