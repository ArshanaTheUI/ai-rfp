const express = require("express");
const router = express.Router();

const { receiveEmail } = require("../controllers/emailController");

// This will be called by IMAP or webhook
router.post("/receive", receiveEmail);

module.exports = router;
