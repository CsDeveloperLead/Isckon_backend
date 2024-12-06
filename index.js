const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const productsRouter = require("./routes/products");

const app = express();
const api = process.env.API_URL || "/api/v1";

// Middleware
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(bodyParser.json());
app.use(morgan("tiny"));

// Routes
app.use(`${api}/products`, productsRouter);

// Database connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Database connection error:", err));

// Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
