// backend/src/controllers/statsController.js
const Rfp = require("../models/Rfp");
const Vendor = require("../models/Vendor");
const Proposal = require("../models/Proposal");

exports.getStats = async (req, res) => {
  try {
    const rfpCount = await Rfp.countDocuments();
    const vendorCount = await Vendor.countDocuments();
    const proposalCount = await Proposal.countDocuments();

    // recent RFPs (last 5)
    const recentRfps = await Rfp.find().sort({ createdAt: -1 }).limit(5).lean();

    res.json({
      rfpCount,
      vendorCount,
      proposalCount,
      recentRfps,
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};
