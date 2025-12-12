const mongoose = require("mongoose");

const ProposalSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
  rfp: { type: mongoose.Schema.Types.ObjectId, ref: "Rfp" },
  rawEmail: Object,
  structured: Object,
  score: Number,
  summary: String,
  receivedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Proposal", ProposalSchema);
