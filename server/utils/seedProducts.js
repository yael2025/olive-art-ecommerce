const mongoose = require("mongoose");
require("dotenv").config();

const connectDB= require("../config/db")
const Product  = require("../models/productModel")
const products = require("../data/products")

const seedProducts = async ()=>{
    try{
        await connectDB()

        await Product.deleteMany()
        await Product.insertMany(products)

        console.log("Products seeded successfully");
        process.exit()
    } catch (error){
        console.error("Seeding error:", error.message);
        process.exit(1)  
    }
}

seedProducts();