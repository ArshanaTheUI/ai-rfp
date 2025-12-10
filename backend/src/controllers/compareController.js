const Rfp = require("../models/Rfp");
const Proposal = require("../models/Proposal");

exports.compareRfp = async (req, res) => {
  try {
    const rfpId = req.params.id;

    const rfp = await Rfp.findById(rfpId).lean();
    if (!rfp) return res.status(404).json({ error: "RFP not found" });

    // IMPORTANT: POPULATE VENDOR HERE
    const proposals = await Proposal.find({ rfp: rfpId })
      .populate("vendor")
      .lean();

    if (!proposals || proposals.length === 0) {
      return res.json({
        rfp,
        proposals: [],
        recommendation: {
          recommendation:
            "No vendor can be chosen due to the lack of proposals.",
          ranked: [],
          risks: [
            "No proposals received, leading to potential delays in procurement.",
          ],
        },
      });
    }

    // -----------------------
    // SCORING LOGIC
    // -----------------------
    const scored = proposals.map((p) => {
      const price = p.structured?.total_price || 0;
      const delivery = p.structured?.delivery_days || 999;
      const warranty = p.structured?.warranty_months || 0;

      const priceScore = price
        ? Math.max(0, 100 - (price / rfp.structured.budget.amount) * 100)
        : 0;
      const deliveryScore = delivery
        ? Math.max(0, 100 - (delivery / rfp.structured.delivery_days) * 100)
        : 0;
      const warrantyScore =
        warranty > 0
          ? Math.min(100, (warranty / rfp.structured.warranty_months) * 100)
          : 0;

      const completeness = Object.keys(p.structured).length * 20;

      const finalScore = Math.round(
        priceScore * 0.4 +
          deliveryScore * 0.3 +
          warrantyScore * 0.2 +
          completeness * 0.1
      );

      return {
        ...p,
        _breakdown: { priceScore, deliveryScore, warrantyScore, completeness },
        _score: finalScore,
      };
    });

    const ranked = scored.sort((a, b) => b._score - a._score);
    const top = ranked[0];

    res.json({
      rfp,
      proposals: scored,
      recommendation: {
        recommendation: `Choose the vendor with score ${top._score} due to the highest proposal score.`,
        ranked: ranked.map((r, idx) => ({
          vendor: r.vendor?.name || "Unknown",
          score: r._score,
        })),
        risks: [
          "Proposals lack complete pricing and delivery details which may affect final selection.",
        ],
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
