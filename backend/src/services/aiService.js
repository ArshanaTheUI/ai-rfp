const OpenAI = require("openai");
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * ------------------------------------------------------------------
 * 1) PARSE NATURAL LANGUAGE RFP → STRUCTURED JSON
 * ------------------------------------------------------------------
 */
exports.parseRfpFromNL = async (text) => {
  const prompt = `
You are a professional procurement assistant.
Convert the following natural language RFP description into CLEAN JSON.

IMPORTANT RULES:
- Return ONLY JSON. No explanation. No text outside JSON.
- If value is missing, set it to null.
- Make sure it is valid JSON.

JSON FORMAT:
{
  "title": string,
  "items": [
    { "name": string, "qty": number, "specs": string }
  ],
  "budget": { "amount": number, "currency": string },
  "delivery_days": number,
  "payment_terms": string,
  "warranty_months": number,
  "notes": string
}

RFP DESCRIPTION:
${text}
  `;

  const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: prompt,
  });

  const raw = response.output_text;

  // Try clean JSON extraction
  try {
    return JSON.parse(raw);
  } catch (err) {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("AI could not generate valid JSON for RFP");
  }
};

/**
 * ------------------------------------------------------------------
 * 2) PARSE VENDOR EMAIL → STRUCTURED PROPOSAL JSON
 * ------------------------------------------------------------------
 */
exports.parseProposalFromEmail = async (emailText) => {
  const prompt = `
You are an AI that extracts proposal data from vendor emails.
Convert the vendor email below into CLEAN JSON.

IMPORTANT RULES:
- Return ONLY JSON.
- Avoid text outside JSON.
- If something is not provided, set it to null.
- Try to detect all prices, quantities, delivery, warranty, payment terms.

JSON FORMAT:
{
  "line_items": [
    { "desc": string, "qty": number, "unit_price": number, "total": number }
  ],
  "total_price": number,
  "delivery_days": number,
  "warranty_months": number,
  "payment_terms": string,
  "notes": string
}

VENDOR EMAIL:
${emailText}
  `;

  const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: prompt,
  });

  const raw = response.output_text;

  try {
    return JSON.parse(raw);
  } catch (err) {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("AI could not generate valid JSON for proposal");
  }
};
