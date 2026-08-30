require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("../config/db");
const Product = require("../models/productModel");

const {
  translateProductToHebrew,
} = require("../services/translationService");

const backfillProductTranslations = async () => {
  try {
    await connectDB();

    const products = await Product.find({
      $or: [
        { nameHe: { $exists: false } },
        { nameHe: "" },
        { descriptionHe: { $exists: false } },
        { descriptionHe: "" },
        { categoryHe: { $exists: false } },
        { categoryHe: "" },
      ],
    });

    console.log(
      `Found ${products.length} products that need translation.`
    );

    for (const product of products) {
      try {
        console.log(`Translating: ${product.name}`);

        const translation =
          await translateProductToHebrew({
            name: product.name,
            description: product.description,
            category: product.category,
          });

        product.nameHe = translation.nameHe;
        product.descriptionHe =
          translation.descriptionHe;
        product.categoryHe =
          translation.categoryHe;

        await product.save();

        console.log(`✓ Translated: ${product.name}`);
      } catch (error) {
        console.error(
          `✗ Failed to translate ${product.name}:`,
          error.message
        );
      }
    }

    console.log("Translation backfill completed.");
  } catch (error) {
    console.error(
      "Backfill failed:",
      error.message
    );
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

backfillProductTranslations();