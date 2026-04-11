require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userLogin = require("./user-login/login");
const { connectDB } = require("./utility/database");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

app.use(userLogin);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));