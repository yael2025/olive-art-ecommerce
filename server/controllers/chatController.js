const OpenAI = require("openai");
const Product = require("../models/productModel");
const { model } = require("mongoose");


const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const customerChat = async (req, res) => {
    try {
        const { message } = req.body

        if (!message || !message.trim()) {
            return res.status(400).json({
                message: "Message is required",
            });
        }
        const products = await Product.find({})
            .select("name category price description countInStock")
            .limit(20)

        const productsText = products.map(
            (product) => `Name :${product.name},
         Category: ${product.category}, 
         Price:${product.price}, 
         Stock:${product.countInStock},
          Description: ${product.description}`
        ).join("\n")

        const prompt =
            `You are a helpful customer assistant for Olive Art Creations, an ecommerce store that sells handmade Judaica products made from olive wood and epoxy resin.

            You help customers:
            - choose suitable products
            - find gift ideas
            - understand product categories
            - choose items by occasion, budget, or style

            Store products:
            ${productsText}

            Customer question:
            ${message}

            Rules:
            - Answer in the same language as the customer.
            - Be friendly and helpful.
            - Recommend only products that exist in the store list above.
            - If you are not sure, suggest browsing the products page.
            - Keep the answer short and clear.`

        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        res.json({
            reply: response.choices[0].message.content,
        });
    } catch (error) {
        console.error("CUSTOMER CHAT ERROR:", error.message);

        res.status(500).json({
            message: "Failed to generate chat response"
        })
    }
}

module.exports = {
    customerChat
}