const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
  },
  product_id: {
    type: String,
    required: [true, "Product ID is required"],
    unique: true, // Ensure product_id is unique
  },
  Image: {
    type: String, // URL to the uploaded image
    default: null,
  },
  desc: {
    type: String,
    required: [true, "Description is required"],
  },
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: [true, "Category is required"],
  },
  quantity: {
    type: String,
    default: "",
  },
  countInStock: {
    type: Number,
    required: [true, "Count in stock is required"],
    min: [0, "Count in stock cannot be negative"],
    max: [1000, "Count in stock exceeds maximum limit"],
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

exports.Product = mongoose.model("Product", productSchema);
