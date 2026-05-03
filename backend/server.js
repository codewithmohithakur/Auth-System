require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const userLogin = require("./user-login/login");
const productRoutes = require("./product/products");
const { connectDB } = require("./utility/database");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
connectDB();

app.use(userLogin);
app.use(productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));