const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const { protect } = require("./middleware/authMiddleware");

const app = express();

//connect to DB 
connectDB()

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

app.get("/api/test-protected", protect, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.user,
  });
});

// const products = [
//   {
//     _id: "1",
//     name: "Olive Wood Mezuzah",
//     price: 120,
//     image: "",
//     description: "Handmade mezuzah made from olive wood.",
//   },
//   {
//     _id: "2",
//     name: "Epoxy Menorah",
//     price: 250,
//     image: "",
//     description: "Decorative epoxy menorah in unique colors.",
//   },
//   {
//     _id: "3",
//     name: "Wood & Resin Necklace",
//     price: 80,
//     image: "",
//     description: "Handcrafted necklace made from wood and resin.",
//   },
// ];

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "API is working" });
});

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p._id === req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});