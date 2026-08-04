const Order = require("../models/orderModel")
//const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");

const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      totalPrice,
      shippingDetails,
      customizationRequest,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        message: "No order items",
      });
    }

    // Validate stock before creating the order
    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.name}`,
        });
      }

      if (product.countInStock < item.qty) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`,
        });
      }
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      totalPrice,
      shippingDetails,
      customizationRequest,
      isPaid: true,
      paidAt: Date.now(),
    });

    const createdOrder = await order.save();

    // Reduce stock after the order is created
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          countInStock: -item.qty,
        },
      });
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    console.error("GET MY ORDERS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate(
      "user",
      "username email"
    ).sort({ createdAt: -1 })
    res.json(orders)
  }
  catch (error) {
    console.error("GET ORDERS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
}
const markAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    console.error("DELIVER ORDER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const markAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (!order.isPaid) {
      return res.status(400).json({
        message: "Order must be paid before it can be delivered",
      });
    }

    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    console.error("PAY ORDER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "username email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      order.user._id.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (error) {
    console.error("GET ORDER BY ID ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrders,
  markAsDelivered,
  markAsPaid,
  getOrderById,
};