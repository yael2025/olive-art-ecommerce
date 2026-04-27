const Order = require("../models/orderModel")

const createOrder = async (req, res) =>{
    try{
        const {orderItems, totalPrice } = req.body

        if(!orderItems || orderItems.length===0){
            return res.status(400).json ({ message: "No order items" })
        }

        const order = new Order({
            user: req.user._id,
            orderItems,
            totalPrice
        })

        const createdOrder = await order.save();

        res.status(201).json(createOrder)
    }catch(error){
        console.error("CREATE ORDER ERROR", error);
        res.status(500).json({message: "Server error"})
    }
}
const getMyOrders = async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user._id });
      res.json(orders);
    } catch (error) {
      console.error("GET MY ORDERS ERROR:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

const getOrders = async (req , res) =>{
  try{
    const orders = await Order.find({}).populate(
      "user",
      "username email"
    ).sort({createdAt:-1})
    res.json(orders)
  }
  catch(error){
    console.error("GET ORDERS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrders,
};