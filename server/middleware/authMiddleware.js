const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  let token;

  //console.log("AUTH HEADER:", req.headers.authorization);

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      return next();
    } catch (error) {
      console.error("JWT ERROR:", error.message);
      return res.status(401).json({ message: "Not authorized" });
    }
  }

  return res.status(401).json({ message: "No token" });
};

const admin = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.isAdmin)) {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};

const businessManager = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "business_manager" ||
      req.user.role === "admin" ||
      req.user.isAdmin)
  ) {
    next();
  } else {
    res.status(403).json({ message: "Business manager access only" });
  }
};

module.exports = {
  protect,
  admin,
  businessManager,
};