const Proposal = require("../models/Proposal");
const Vendor = require("../models/Vendor");
const Rfp = require("../models/Rfp");
const { parseProposalFromEmail } = require("../services/aiService");

exports.receiveEmail = async (req, res) => {
  try {
    const { rfpId, vendorEmail, emailBody } = req.body;

    // Find vendor by email
    const vendor = await Vendor.findOne({ contactEmail: vendorEmail });
    if (!vendor) return res.status(404).json({ error: "Vendor not found" });

    //  AI reads vendor email and extracts structured proposal
    const structured = await parseProposalFromEmail(emailBody);

    //  Create new proposal record
    const proposal = await Proposal.create({
      vendor: vendor._id,
      rfp: rfpId,
      rawEmail: { body: emailBody },
      structured,
    });

    //  Attach proposal to RFP
    await Rfp.findByIdAndUpdate(rfpId, {
      $push: { proposals: proposal._id },
    });

    res.json({ message: "Proposal parsed + saved", proposal });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
