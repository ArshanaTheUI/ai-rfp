const express = require("express");
const router = express.Router();

const { sendRfpToVendors } = require("../controllers/sendRfpController");

// POST /api/send-rfp
router.post("/", sendRfpToVendors);

module.exports = router;
