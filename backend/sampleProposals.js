require("dotenv").config();
const mongoose = require("mongoose");

const Vendor = require("./src/models/Vendor");
const Proposal = require("./src/models/Proposal");
const Rfp = require("./src/models/Rfp");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("DB Connected");

  // 1️⃣ Pick a random RFP (or create one)
  let rfp = await Rfp.findOne();
  if (!rfp) {
    rfp = await Rfp.create({
      title: "Office Chairs Purchase",
      description: "Need 20 ergonomic chairs",
      structured: {
        items: [{ desc: "Chair", qty: 20 }],
        budget: { amount: 50000, currency: "INR" },
      },
    });
  }

  // 2️⃣ Add sample vendors
  const vendorA = await Vendor.create({
    name: "Omega Supplies",
    contactEmail: "omega@gmail.com",
    contactPerson: "Rahul",
  });

  const vendorB = await Vendor.create({
    name: "Furniture Hub",
    contactEmail: "furniturehub@gmail.com",
    contactPerson: "Karan",
  });

  const vendorC = await Vendor.create({
    name: "Prime Seating",
    contactEmail: "prime@gmail.com",
    contactPerson: "Anita",
  });

  // 3️⃣ Create sample proposals
  const proposals = [
    {
      vendor: vendorA._id,
      rfp: rfp._id,
      rawEmail: { body: "20 chairs @ 2500 each. Delivery 7 days." },
      structured: {
        line_items: [
          { desc: "Chair", qty: 20, unit_price: 2500, total: 50000 },
        ],
        total_price: 50000,
        delivery_days: 7,
        warranty_months: 6,
        payment_terms: "50% advance",
      },
    },
    {
      vendor: vendorB._id,
      rfp: rfp._id,
      rawEmail: { body: "20 chairs for 2200 each. Delivery 10 days" },
      structured: {
        line_items: [
          { desc: "Chair", qty: 20, unit_price: 2200, total: 44000 },
        ],
        total_price: 44000,
        delivery_days: 10,
        warranty_months: 12,
        payment_terms: "Full on delivery",
      },
    },
    {
      vendor: vendorC._id,
      rfp: rfp._id,
      rawEmail: { body: "20 chairs total 48000. Delivery 4 days" },
      structured: {
        line_items: [
          { desc: "Chair", qty: 20, unit_price: 2400, total: 48000 },
        ],
        total_price: 48000,
        delivery_days: 4,
        warranty_months: 3,
        payment_terms: "Net 30",
      },
    },
  ];

  await Proposal.insertMany(proposals);

  console.log("Sample proposals added.");
  process.exit();
}

seed();
