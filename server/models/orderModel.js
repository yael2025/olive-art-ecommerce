const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      qty: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        default: "",
      },
      price: {
        type: Number,
        required: true,
      },
      category: {
        type: String,
        default: "Unknown",
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    },
    {
      _id: false,
    }
  ); 

  const orderSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      orderItems: [orderItemSchema],
      shippingDetails: {
        fullName:{
          type: String,
          required : true,
        },
        phone: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        address: {
          type: String,
          required: true,
        },
        shippingMethod: {
          type: String,
          required: true,
        },
      },
      totalPrice: {
        type: Number,
        required: true,
        default: 0,
      },
      isPaid: {
        type: Boolean,
        default: false,
      },
      paidAt: {
        type: Date,
      },
      isDelivered: {
        type: Boolean,
        default: false,
      },
      deliveredAt: {
        type: Date,
      },
      
    },
    {
      timestamps: true,
    }
  );

  module.exports = mongoose.model("Order", orderSchema); 