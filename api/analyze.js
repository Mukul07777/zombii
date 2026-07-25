import { analyze, parseCSV, greeting } from "./_detector.js";

// Accepts { csv: "<raw csv text>" } as JSON body.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });
  try {
    let body = req.body;
    if (typeof body === "string") body = JSON.parse(body || "{}");
    const csv = body?.csv;
    if (!csv) return res.status(400).json({ error: "No CSV provided" });
    const txns = parseCSV(csv);
    if (!txns.length) return res.status(400).json({ error: "Could not parse any transactions" });
    const result = analyze(txns, { today: new Date().toISOString() });
    res.status(200).json({
      profile: { name: "You", greeting: greeting(), currency: "₹" },
      ...result,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
