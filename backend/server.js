const express = require("express");
const cors = require("cors");
const userLogin = require("./user-login/login");

const app = express();
app.use(express.json());
app.use(cors());

app.use(userLogin);

app.listen(3000, () => console.log("Server running on port 3000"));