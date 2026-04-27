const mongoose = require("mongoose")

const productSchema = new mongoose.Schema( 
    {
      name:{
        type: String,
        require: true,
      },
      price:{
        type: Number,
        require: true,
      },
      description:{
        type: String,
      },
      image:{
        type: String,
      },
      countInStock:{
        type: Number,
        default:0,
      },
      category:{
        type: String
      },
    },
    {
        timeseries:true
    }
)
module.exports= mongoose.model("Product", productSchema)