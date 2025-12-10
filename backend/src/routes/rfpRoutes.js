const express = require("express");
const router = express.Router();

const {
  createRfp,
  getAllRfps,
  getRfpDetails,
} = require("../controllers/rfpController");

const { compareRfp } = require("../controllers/compareController");

// CREATE RFP
router.post("/", createRfp);

// LIST all RFPs
router.get("/", getAllRfps);

// COMPARE proposals for an RFP
router.get("/:id/compare", compareRfp);

// GET one RFP + proposals
router.get("/:id", getRfpDetails);
router.get("/:id/details", getRfpDetails);

module.exports = router;
