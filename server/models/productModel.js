const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    countInStock: {
      type: Number,
      default: 0,
    },
    category: {
      type: String
    },
    nameHe: {
      type: String,
    },

    descriptionHe: {
      type: String,
    },

    categoryHe: {
      type: String,
    },
  },
  {
    timeseries: true
  }
)
module.exports = mongoose.model("Product", productSchema)