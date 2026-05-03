const express = require("express");
const path = require("path");
const multer = require("multer");
const router = express.Router();
const { Product } = require("../utility/database");

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "..", "uploads"));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const sanitizedName = file.originalname.replace(/\s+/g, "-");
      cb(null, `${uniqueSuffix}-${sanitizedName}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed"), false);
    } else {
      cb(null, true);
    }
  }
});

// Middleware to verify token (optional, can be added for authentication)
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  next();
};

// ✅ CREATE - Add a new product
router.post("/products", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, quantity, category } = req.body;

    if (!name || !description || !price || !quantity || !category) {
      return res.status(400).json({ message: "All fields required" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const newProduct = new Product({
      name,
      description,
      price,
      quantity,
      category,
      imageUrl
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
router.put("/products/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, quantity, category } = req.body;

    if (!name || !description || !price || !quantity || !category) {
      return res.status(400).json({ message: "All fields required" });
    }

    const updates = {
      name,
      description,
      price,
      quantity,
      category,
      updatedAt: Date.now()
    };

    if (req.file) {
      updates.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updates,
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
