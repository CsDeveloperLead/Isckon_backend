const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const { upload } = require("../middleware/multer.middleware");
const { uploadOnCloudinary } = require("../utils/uploadOnCloudinary");
const { Product } = require("../models/products");

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    if (!products.length) {
      return res.status(404).json({ success: false, message: "No products found" });
    }
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    console.error("Error fetching products:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get product by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Add new product
router.post("/", upload.single("Image"), async (req, res) => {
  try {
    const { name, product_id, desc, price, category, quantity, countInStock } = req.body;
    const isProductExist = await Product.findOne({ product_id });
    if (isProductExist) {
      return res.status(400).json({ success: false, message: "Product already exists" });
    }

    let imageUrl = null;
    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.path);
      imageUrl = uploadResult?.secure_url || null;
    }

    const newProduct = new Product({
      name,
      product_id,
      desc,
      price,
      category,
      quantity,
      countInStock,
      Image: imageUrl,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ success: true, data: savedProduct });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update product
router.put("/:id", upload.single("Image"), async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }

  try {
    const updateData = { ...req.body };

    // Handle image upload only if a new image is provided
    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.path);
      updateData.Image = uploadResult?.secure_url || null;

      if (!updateData.Image) {
        return res.status(500).json({ success: false, message: "Image upload failed" });
      }
    }

    // Update the product in the database
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// Delete product
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
