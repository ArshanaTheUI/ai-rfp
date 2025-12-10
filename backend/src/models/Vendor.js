const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({
  name: String,
  contactEmail: String,
  contactPerson: String,
});

module.exports = mongoose.model("Vendor", VendorSchema);
