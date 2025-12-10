// scripts/mergeSeed.js
require("dotenv").config();
const mongoose = require("mongoose");

const Rfp = require("../src/models/Rfp");
const Vendor = require("../src/models/Vendor");
const Proposal = require("../src/models/Proposal");

async function mergeSeed() {
  try {
    console.log("🌱 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);

    console.log("🔍 Checking existing data...");
    const existingRfps = await Rfp.countDocuments();
    const existingVendors = await Vendor.countDocuments();
    const existingProposals = await Proposal.countDocuments();

    console.log(`Existing: ${existingRfps} RFPs, ${existingVendors} Vendors, ${existingProposals} Proposals`);

    console.log("📌 Creating demo RFP (new one for comparison demo)...");
    const demoRfp = await Rfp.create({
      title: "Office Chairs Purchase (Demo RFP)",
      description: "We need ergonomic office chairs for a new office setup.",
      structured: {
        title: "Office Chairs Purchase",
        items: [{ desc: "Ergonomic Office Chair", qty: 20 }],
        budget: { amount: 50000, currency: "INR" },
        delivery_days: 10,
        payment_terms: "Net 30",
        warranty_months: 12,
        notes: "Need delivery to Hyderabad office."
      }
    });

    console.log("📌 Adding 3 demo vendors (merged, no delete)...");

    const demoVendors = await Vendor.insertMany([
      {
        name: "Comfort Seating Ltd",
        contactEmail: "comfort@vendor.com",
        contactPerson: "Arun"
      },
      {
        name: "ErgoWorks Supplies",
        contactEmail: "ergoworks@vendor.com",
        contactPerson: "Meera"
      },
      {
        name: "ChairMaster India",
        contactEmail: "chairmaster@vendor.com",
        contactPerson: "Rohit"
      }
    ]);

    console.log("📌 Creating demo proposals (linked to demoRfp)...");

    const proposalsData = [
      {
        vendor: demoVendors[0]._id,
        rfp: demoRfp._id,
        structured: {
          line_items: [
            { desc: "Office Chair Model A", qty: 20, unit_price: 2200, total: 44000 }
          ],
          total_price: 44000,
          delivery_days: 8,
          warranty_months: 12
        },
        score: 75,
        summary: "Good price and warranty. Delivery is fast.",
        receivedAt: new Date()
      },
      {
        vendor: demoVendors[1]._id,
        rfp: demoRfp._id,
        structured: {
          line_items: [
            { desc: "Ergo Chair B", qty: 20, unit_price: 2000, total: 40000 }
          ],
          total_price: 40000,
          delivery_days: 12,
          warranty_months: 6
        },
        score: 82,
        summary: "Lowest price proposal but slower delivery.",
        receivedAt: new Date()
      },
      {
        vendor: demoVendors[2]._id,
        rfp: demoRfp._id,
        structured: {
          line_items: [
            { desc: "Premium Chair C", qty: 20, unit_price: 2400, total: 48000 }
          ],
          total_price: 48000,
          delivery_days: 5,
          warranty_months: 24
        },
        score: 90,
        summary: "Fastest delivery and best warranty, but highest price.",
        receivedAt: new Date()
      }
    ];

    const demoProposals = await Proposal.insertMany(proposalsData);

    console.log("📌 Linking demo proposals to demo RFP...");
    demoRfp.proposals = demoProposals.map((p) => p._id);
    await demoRfp.save();

    console.log("🎉 MERGE SEED COMPLETE — No old data deleted!");
    console.log("➡ New Demo RFP ID:", demoRfp._id);
    console.log("➡ Added Vendors:", demoVendors.length);
    console.log("➡ Added Proposals:", demoProposals.length);

    process.exit(0);
  } catch (err) {
    console.error("❌ Merge Seed Error:", err);
    process.exit(1);
  }
}

mergeSeed();
