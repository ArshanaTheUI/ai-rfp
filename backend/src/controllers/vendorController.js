const Vendor = require("../models/Vendor");

exports.addVendor = async (req, res) => {
  try {
    const vendor = await Vendor.create(req.body);
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getVendors = async (req, res) => {
  const vendors = await Vendor.find();
  res.json(vendors);
};
