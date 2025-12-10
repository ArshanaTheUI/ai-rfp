// const Rfp = require("../models/Rfp");
// const Vendor = require("../models/Vendor");
// const { sendRfpEmail } = require("../services/emailService");

// exports.sendRfpToVendors = async (req, res) => {
//   try {
//     const { rfpId, vendorIds } = req.body;

//     const rfp = await Rfp.findById(rfpId);
//     const vendors = await Vendor.find({ _id: { $in: vendorIds } });

//     const emailHtml = `
//       <h2>RFP: ${rfp.structured.title}</h2>
//       <p>${rfp.description}</p>
//       <h3>Structured Details:</h3>
//       <pre>${JSON.stringify(rfp.structured, null, 2)}</pre>
//       <p>Please reply with your proposal.</p>
//     `;

//     for (let v of vendors) {
//       await sendRfpEmail(
//         v.contactEmail,
//         `RFP: ${rfp.structured.title}`,
//         emailHtml
//       );
//     }

//     res.json({
//       success: true,
//       sentTo: vendors.map((v) => v.contactEmail),
//     });
//   } catch (err) {
//     console.log("Email Send Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };
const Rfp = require("../models/Rfp");
const Vendor = require("../models/Vendor");
const { sendRfpEmail } = require("../services/emailService");

exports.sendRfpToVendors = async (req, res) => {
  try {
    const { rfpId, vendorIds } = req.body;

    const rfp = await Rfp.findById(rfpId);
    if (!rfp) return res.status(404).json({ error: "RFP not found" });

    const vendors = await Vendor.find({ _id: { $in: vendorIds } });

    const emailHtml = `
      <h2>RFP: ${rfp.structured.title}</h2>
      <p>${rfp.description}</p>
      <h3>Structured Details:</h3>
      <pre>${JSON.stringify(rfp.structured, null, 2)}</pre>
      <p>Please reply with your proposal.</p>
    `;

    const sentTo = [];

    for (let v of vendors) {
      // 1️⃣ Send email
      await sendRfpEmail(
        v.contactEmail,
        `RFP: ${rfp.structured.title}`,
        emailHtml
      );

      // 2️⃣ Update RFP document
      await Rfp.findByIdAndUpdate(rfpId, {
        $push: {
          vendorsSent: {
            vendor: v._id,
            sentAt: new Date(),
          },
        },
      });

      sentTo.push(v.contactEmail);
    }

    res.json({
      success: true,
      message: "RFP sent to vendors and saved in DB.",
      sentTo,
    });
  } catch (err) {
    console.log("Send RFP Error:", err);
    res.status(500).json({ error: err.message });
  }
};
