// const mongoose = require("mongoose");

// const RfpSchema = new mongoose.Schema({
//   title: String,
//   description: String, // original natural language text
//   structured: Object, // AI-generated structured RFP
//   vendorsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }],
//   proposals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Proposal" }],
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Rfp", RfpSchema);
const mongoose = require("mongoose");

const RfpSchema = new mongoose.Schema({
  title: String,
  description: String,
  structured: Object,

  // Correct vendorsSent structure
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
