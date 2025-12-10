// ====== IMPORTS ======
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import Routes
const rfpRoutes = require("./src/routes/rfpRoutes");
const vendorRoutes = require("./src/routes/vendorRoutes");
const emailRoutes = require("./src/routes/emailRoutes");
const sendRfpRoutes = require("./src/routes/sendRfpRoutes");
const statsRoutes = require("./src/routes/statsRoutes");

// ====== APP INIT ======
const app = express();

// Allow frontend to talk to backend
app.use(cors());

// Allow JSON body in requests
app.use(express.json());

// ====== REGISTER ROUTES ======
app.use("/api/rfps", rfpRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/email", emailRoutes);
//+++
app.use("/api/send-rfp", sendRfpRoutes);
// ====== CONNECT STATS ======

app.use("/api/stats", statsRoutes);

// ====== CONNECT DB & START SERVER ======
const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("📦 MongoDB Connected Successfully");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.log("❌ DB Connection Error: ", err));
