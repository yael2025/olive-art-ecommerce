const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER user
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: "customer",
      isAdmin: false,
    });

    const createdUser = await user.save();

    res.status(201).json({
      _id: createdUser._id,
      username: createdUser.username,
      email: createdUser.email,
      isAdmin: createdUser.isAdmin,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.role,
      token: jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      ),

    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist")

  res.json(user.wishlist)
}

const addToWishlist = async (req, res) => {
  const { productId } = req.params;

  const user = await User.findById(req.user._id)

  if (user.wishlist.includes(productId)) {
    return res.status(400).json({
      message: "Product already in wishlist"
    })
  }

  user.wishlist.push(productId)
  await user.save()

  const updateUser = await User.findById(req.user._id).populate("wishlist")
  res.json(updateUser.wishlist)
}

const removeFromWishlist = async (req, res) => {
  const { productId } = req.params

  const user = await User.findById(req.user._id)

  user.wishlist = user.wishlist.filter(
    (id) => id.toString() !== productId
  )

  await user.save()

  const updateUser = await User.findById(req.user._id).populate("wishlist")
  res.json(updateUser.wishlist)
}

module.exports = {
  registerUser,
  loginUser,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};