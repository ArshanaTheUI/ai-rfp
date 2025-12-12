const mongoose = require("mongoose");

const RfpSchema = new mongoose.Schema({
  title: String,
  description: String,
  structured: Object,

  vendorsSent: [
    {
      vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
      sentAt: Date,
    },
  ],

  proposals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Proposal" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Rfp", RfpSchema);
