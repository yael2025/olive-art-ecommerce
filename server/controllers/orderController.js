const Order = require("../models/orderModel")
//const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const { sendEmail } = require("../services/emailService");

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
      isPaid: false,
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

    // Send the response immediately
    res.status(201).json(createdOrder);

    // Send confirmation email without blocking the order response
    const customer = await User.findById(req.user._id);

    if (customer?.email) {
      sendEmail({
        to: customer.email,
        subject: "Olive Art Creations - Order Confirmation",
        html: `
          <h2>Thank you for your order!</h2>

          <p>Hi ${customer.username},</p>

          <p>Your order has been received successfully.</p>

          <p>
            <strong>Order number:</strong>
            ${createdOrder._id}
          </p>

          <p>
            <strong>Total:</strong>
            ₪${createdOrder.totalPrice}
          </p>

          <p>We will update you when the order status changes.</p>

          <br />

          <p>Olive Art Creations</p>
        `,
      }).catch((emailError) => {
        console.error(
          "ORDER CONFIRMATION EMAIL ERROR:",
          emailError.message
        );
      });
    }
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    if (!res.headersSent) {
      res.status(500).json({
        message: error.message,
      });
    }
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
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (!order.isPaid) {
      return res.status(400).json({
        message: "Order must be paid before it can be delivered",
      });
    }

    if (order.isDelivered) {
      return res.status(400).json({
        message: "Order is already delivered",
      });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    const customer = await User.findById(order.user);

    if (customer?.email) {
      sendEmail({
        to: customer.email,
        subject: "Olive Art Creations - Order Delivered",
        html: `
      <h2>Your order has been delivered</h2>

      <p>Hi ${customer.username},</p>

      <p>Your order has been marked as delivered.</p>

      <p>
        <strong>Order number:</strong>
        ${updatedOrder._id}
      </p>

      <p>Thank you for choosing Olive Art Creations.</p>

      <br />

      <p>Olive Art Creations</p>
    `,
      }).catch((emailError) => {
        console.error(
          "DELIVERY EMAIL ERROR:",
          emailError.message
        );
      });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("DELIVER ORDER ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const markAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      })
    }

    if (order.isPaid) {
      return res.status(400).json({
        message: "Order is already paid"
      })
    }

    order.isPaid = true
    order.paidAt = Date.now()

    const updatedOrder = await order.save()

    const customer = await User.findById(order.user);

    if (customer?.email) {
      sendEmail({
        to: customer.email,
        subject: "Olive Art Creations - Payment Confirmed",
        html: `
      <h2>Payment confirmed</h2>

      <p>Hi ${customer.username},</p>

      <p>Your payment has been confirmed successfully.</p>

      <p>
        <strong>Order number:</strong>
        ${updatedOrder._id}
      </p>

      <p>We will notify you again when your order is delivered.</p>

      <br />

      <p>Olive Art Creations</p>
    `,
      }).catch((emailError) => {
        console.error(
          "PAYMENT EMAIL ERROR:",
          emailError.message
        );
      });
    }

    res.json(updatedOrder)
  }
  catch (error) {
    console.error("PAY ORDER ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
}

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