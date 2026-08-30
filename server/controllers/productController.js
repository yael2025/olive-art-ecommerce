const Product = require("../models/productModel");

const {
  translateProductToHebrew,
} = require("../services/translationService");

// GET all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE product
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      image,
      countInStock,
      category,
    } = req.body;

    let translation = {
      nameHe: "",
      descriptionHe: "",
      categoryHe: "",
    };

    try {
      translation = await translateProductToHebrew({
        name,
        description,
        category,
      });
    } catch (translationError) {
      console.error(
        "Product translation failed:",
        translationError.message
      );
    }

    const product = new Product({
      name,
      nameHe: translation.nameHe,

      price,

      description,
      descriptionHe: translation.descriptionHe,

      image,
      countInStock,

      category,
      categoryHe: translation.categoryHe,
    });

    const createdProduct = await product.save();

    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Create product error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// UPDATE product
// UPDATE product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const oldName = product.name;
    const oldDescription = product.description;
    const oldCategory = product.category;

    if (req.body.name !== undefined) {
      product.name = req.body.name;
    }

    if (req.body.price !== undefined) {
      product.price = req.body.price;
    }

    if (req.body.description !== undefined) {
      product.description = req.body.description;
    }

    if (req.body.image !== undefined) {
      product.image = req.body.image;
    }

    if (req.body.countInStock !== undefined) {
      product.countInStock = req.body.countInStock;
    }

    if (req.body.category !== undefined) {
      product.category = req.body.category;
    }

    const textChanged =
      product.name !== oldName ||
      product.description !== oldDescription ||
      product.category !== oldCategory;

    if (textChanged) {
      try {
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
      } catch (translationError) {
        console.error(
          "Product translation update failed:",
          translationError.message
        );
      }
    }

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    console.error(
      "Update product error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// DELETE product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.deleteOne();

    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};