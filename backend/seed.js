// =============================================
//  SEED FILE – Creates RFP + Vendors + Proposals
//  Run using:  node seed.js
// =============================================

require("dotenv").config();
const mongoose = require("mongoose");

const Rfp = require("./src/models/Rfp");
const Vendor = require("./src/models/Vendor");
const Proposal = require("./src/models/Proposal");

async function seed() {
  console.log("\n⏳ Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB Connected\n");

  // --------------------------
  // CLEAN OLD DATA
  // --------------------------
  console.log("🧹 Cleaning old RFPs, Vendors & Proposals...");
  //   await Rfp.deleteMany({});
  await Vendor.deleteMany({});
  await Proposal.deleteMany({});
  console.log("✅ Cleanup complete\n");

  // --------------------------
  // CREATE RFP
  // --------------------------
  console.log("📄 Creating sample RFP...");

  const rfp = await Rfp.create({
    title: "Office Chairs Purchase",
    description: "Need 20 ergonomic office chairs.",
    structured: {
      title: "Office Chairs Purchase",
      items: [
        {
          desc: "Ergonomic Office Chair",
          qty: 20,
        },
      ],
      budget: {
        amount: 50000,
        currency: "INR",
      },
      delivery_days: 10,
      payment_terms: "Net 30",
      warranty_months: 12,
      notes: "Need delivery to Hyderabad office.",
    },
  });

  console.log("✅ RFP Created:", rfp._id, "\n");

  // --------------------------
  // CREATE VENDORS
  // --------------------------
  console.log("👥 Creating Vendors...");

  const vendors = await Vendor.insertMany([
    {
      name: "Prime Chairs",
      contactEmail: "prime@example.com",
      contactPerson: "Anil Kumar",
    },
    {
      name: "Omega Furnitures",
      contactEmail: "omega@example.com",
      contactPerson: "Priya Sharma",
    },
    {
      name: "Budget Seating",
      contactEmail: "budget@example.com",
      contactPerson: "Rahul Das",
    },
  ]);

  console.log(
    `✅ Vendors Created: ${vendors.length}, IDs:`,
    vendors.map((v) => v._id).join(", "),
    "\n"
  );

  // --------------------------
  // CREATE PROPOSALS
  // --------------------------
  console.log("📨 Creating proposals...");

  const proposals = await Proposal.insertMany([
    {
      vendor: vendors[0]._id,
      rfp: rfp._id,
      rawEmail: { body: "We offer 20 chairs at 2000 each. Delivery 5 days." },
      structured: {
        total_price: 40000,
        delivery_days: 5,
        warranty_months: 12,
        line_items: [
          { desc: "Chair", qty: 20, unit_price: 2000, total: 40000 },
        ],
      },
    },
    {
      vendor: vendors[1]._id,
      rfp: rfp._id,
      rawEmail: {
        body: "We provide 16 chairs at 2100 each. Delivery 7 days. Warranty 6 months.",
      },
      structured: {
        total_price: 33600,
        delivery_days: 7,
        warranty_months: 6,
        line_items: [
          { desc: "Chair", qty: 16, unit_price: 2100, total: 33600 },
        ],
      },
    },
    {
      vendor: vendors[2]._id,
      rfp: rfp._id,
      rawEmail: {
        body: "Offering 20 chairs at 1800. Delivery 10 days. 3 months warranty.",
      },
      structured: {
        total_price: 36000,
        delivery_days: 10,
        warranty_months: 3,
        line_items: [
          { desc: "Chair", qty: 20, unit_price: 1800, total: 36000 },
        ],
      },
    },
  ]);

  console.log(
    `✅ Proposals Created: ${proposals.length}, IDs:`,
    proposals.map((p) => p._id).join(", "),
    "\n"
  );

  console.log("🎉 SEEDING COMPLETE!");
  console.log("👉 RFP ID to test Compare Page:", rfp._id);

  // CLOSE DB
  mongoose.disconnect();
  console.log("🔌 MongoDB Disconnected\n");
}

seed().catch((err) => {
  console.error("❌ ERROR in seeding:", err);
  mongoose.disconnect();
});
