// Agentic parser: turns ANY statement/SMS/email text into structured transactions
// via Groq, then runs the detection engine. Falls back to CSV parsing if no key.
import { analyze, parseCSV, greeting } from "./_detector.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });
  try {
    let body = req.body;
    if (typeof body === "string") body = JSON.parse(body || "{}");
    const text = (body?.text || "").trim();
    if (!text) return res.status(400).json({ error: "No text provided" });

    let txns = [];
    const key = process.env.GROQ_API_KEY;

    if (key) {
      const prompt = `You are a bank-statement parser. Extract EVERY transaction from the text below
(it may be a bank statement, SMS alerts, or email notifications, in any format).
Return ONLY a JSON array — no prose, no markdown — of objects:
[{"date":"YYYY-MM-DD","description":"MERCHANT NAME","amount":-499}]
Rules: amount is NEGATIVE for money going out (debits/payments), positive for credits.
If the year is missing, assume 2026. Keep the raw merchant text in description.

TEXT:
${text.slice(0, 6000)}`;

      const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          temperature: 0,
          max_tokens: 2000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (r.ok) {
        const j = await r.json();
        let out = j.choices?.[0]?.message?.content || "[]";
        out = out.replace(/```json|```/g, "").trim();
        const start = out.indexOf("["), end = out.lastIndexOf("]");
        if (start >= 0 && end >= 0) out = out.slice(start, end + 1);
        try { txns = JSON.parse(out); } catch { txns = []; }
      }
    }

    // fallback: maybe it was CSV all along
    if (!txns.length) txns = parseCSV(text);
    if (!txns.length) return res.status(400).json({ error: "Could not extract any transactions from that text." });

    txns = txns.filter((t) => t && t.date && typeof t.amount === "number");
    const result = analyze(txns, { today: new Date().toISOString() });
    res.status(200).json({
      profile: { name: "You", greeting: greeting(), currency: "₹", source: body.source || "text" },
      parsedCount: txns.length,
      ...result,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
