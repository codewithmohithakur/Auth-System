const express = require("express");
const router = express.Router();
const { Product } = require("../utility/database");

// Middleware to verify token (optional, can be added for authentication)
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  next();
};

// ✅ CREATE - Add a new product
router.post("/products", async (req, res) => {
  try {
    const { name, description, price, quantity, category } = req.body;

    if (!name || !description || !price || !quantity || !category) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      quantity,
      category
    });

    await newProduct.save();

    res.status(201).json({ 
      message: "Product created successfully", 
      product: newProduct 
    });

  } catch (err) {
    console.error("Product creation error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ READ - Get all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Products fetched successfully",
      products
    });

  } catch (err) {
    console.error("Fetch products error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ READ - Get a single product by ID
router.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      product
    });

  } catch (err) {
    console.error("Fetch product error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ UPDATE - Edit a product
router.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, quantity, category } = req.body;

    if (!name || !description || !price === undefined || !quantity === undefined || !category) {
      return res.status(400).json({ message: "All fields required" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        quantity,
        category,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct
    });

  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ DELETE - Remove a product
router.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct
    });

  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
