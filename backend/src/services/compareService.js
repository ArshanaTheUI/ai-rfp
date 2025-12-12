// backend/src/services/compareService.js
const OpenAI = require("openai");
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Simple normalized score helpers.
 * All scores are 0..1 then multiplied by weight.
 */
function normalizePriceScore(price, minPrice, maxPrice) {
  if (price == null) return 0;
  // lower price => better score
  if (maxPrice === minPrice) return 1;
  return 1 - (price - minPrice) / (maxPrice - minPrice);
}

function normalizeDeliveryScore(days, minDays, maxDays) {
  if (days == null) return 0;
  // fewer days => better score
  if (maxDays === minDays) return 1;
  return 1 - (days - minDays) / (maxDays - minDays);
}

function normalizeWarrantyScore(months, minMonths, maxMonths) {
  if (months == null) return 0;
  // more months => better score
  if (maxMonths === minMonths) return 1;
  return (months - minMonths) / (maxMonths - minMonths);
}

function completenessScore(structured) {
  // very simple completeness: count fields present among chosen keys
  const fields = [
    "line_items",
    "total_price",
    "delivery_days",
    "warranty_months",
    "payment_terms",
  ];
  let present = 0;
  for (const f of fields)
    if (structured && structured[f] !== undefined && structured[f] !== null)
      present++;
  return present / fields.length; // 0..1
}

/**
 * computeScores(proposals)
 * - proposals: array of { _id, vendor, structured }
 * returns: array of proposals with calculated numeric score and breakdown
 */
async function computeScores(proposals) {
  // Extract numeric values for price/delivery/warranty
  const totals = proposals.map((p) => {
    const s = p.structured || {};
    // Try possible keys
    const total =
      s.total_price ?? (s.pricing && s.pricing.total) ?? s.price ?? null;
    const delivery = s.delivery_days ?? s.delivery ?? s.timeline ?? null;
    const warranty = s.warranty_months ?? s.warranty ?? null;
    return {
      id: p._id,
      total: typeof total === "number" ? total : total ? Number(total) : null,
      delivery:
        typeof delivery === "number"
          ? delivery
          : delivery
          ? Number(delivery)
          : null,
      warranty:
        typeof warranty === "number"
          ? warranty
          : warranty
          ? Number(warranty)
          : null,
    };
  });

  const prices = totals.map((t) => t.total).filter((v) => v != null);
  const deliveries = totals.map((t) => t.delivery).filter((v) => v != null);
  const warranties = totals.map((t) => t.warranty).filter((v) => v != null);

  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : minPrice;
  const minDelivery = deliveries.length ? Math.min(...deliveries) : 0;
  const maxDelivery = deliveries.length ? Math.max(...deliveries) : minDelivery;
  const minWarranty = warranties.length ? Math.min(...warranties) : 0;
  const maxWarranty = warranties.length ? Math.max(...warranties) : minWarranty;

  const weights = {
    price: 0.5,
    delivery: 0.2,
    warranty: 0.1,
    completeness: 0.2,
  };

  const results = proposals.map((p) => {
    const t = totals.find((x) => String(x.id) === String(p._id));
    const priceScore =
      t && t.total != null
        ? normalizePriceScore(t.total, minPrice, maxPrice)
        : 0;
    const deliveryScore =
      t && t.delivery != null
        ? normalizeDeliveryScore(t.delivery, minDelivery, maxDelivery)
        : 0;
    const warrantyScore =
      t && t.warranty != null
        ? normalizeWarrantyScore(t.warranty, minWarranty, maxWarranty)
        : 0;
    const completeness = completenessScore(p.structured);

    const final =
      priceScore * weights.price +
      deliveryScore * weights.delivery +
      warrantyScore * weights.warranty +
      completeness * weights.completeness;

    return {
      ...p,
      _score: Math.round(final * 100),
      _breakdown: {
        priceScore: Math.round(priceScore * 100),
        deliveryScore: Math.round(deliveryScore * 100),
        warrantyScore: Math.round(warrantyScore * 100),
        completeness: Math.round(completeness * 100),
      },
    };
  });

  return results;
}

/**
 * ask LLMRecommendation(rfp, proposalsWithScores)
 * - uses the LLM to produce a short recommendation and bullet risks
 */
async function askLLMRecommendation(rfp, proposals) {
  // Build a compact prompt summarizing proposals
  const proposalsSummary = proposals.map((p) => {
    const s = p.structured || {};
    const total =
      s.total_price ?? (s.pricing && s.pricing.total) ?? s.price ?? null;
    return {
      vendor: p.vendor?.name ?? p.vendor,
      total_price: total ?? null,
      delivery_days: s.delivery_days ?? s.delivery ?? null,
      warranty_months: s.warranty_months ?? s.warranty ?? null,
      score: p._score,
    };
  });

  const prompt = `
You are a procurement assistant. Given the RFP and the list of proposals (with numeric scores 0-100), produce a short JSON summary with:
{ "recommendation": "<one-line - which vendor to choose and why>", "ranked": [{ "vendor": "...", "score": number }], "risks": ["..."] }

RFP:
${JSON.stringify(rfp.structured || rfp)}

Proposals summary:
${JSON.stringify(proposalsSummary, null, 2)}

Return ONLY JSON.
  `;

  const resp = await client.responses.create({
    model: "gpt-4o-mini",
    input: prompt,
    max_output_tokens: 400,
  });

  const raw = resp.output_text;
  try {
    return JSON.parse(raw);
  } catch (e) {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    return {
      recommendation: "No recommendation (LLM failed)",
      ranked: proposalsSummary.map((p) => ({
        vendor: p.vendor,
        score: p.score,
      })),
      risks: [],
    };
  }
}

module.exports = {
  computeScores,
  askLLMRecommendation,
};
