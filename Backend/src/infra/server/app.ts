const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // ✅ correct import

dotenv.config(); // ✅ loads .env variables

const app = express();

app.use(cors()); // ✅ enables CORS
app.use(express.json());

// health check route
app.get("/", (req, res) => {
  res.send("FuelEU Maritime Backend is running 🚢");
});

module.exports = app; // ✅ CommonJS export
