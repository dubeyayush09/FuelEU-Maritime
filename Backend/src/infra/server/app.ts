const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // ✅ correct import
import routesRouter from "../../adapters/inbound/http/routesRouter";
import complianceRouter from "../../adapters/inbound/http/complianceRouter";

dotenv.config(); // ✅ loads .env variables

const app = express();

app.use(cors()); // ✅ enables CORS
app.use(express.json());

// health check route
app.get("/", (req, res) => {
  res.send("FuelEU Maritime Backend is running 🚢");
});
app.use("/routes", routesRouter);
app.use("/compliance", complianceRouter);

module.exports = app; // ✅ CommonJS export
