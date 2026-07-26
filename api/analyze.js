import { analyze, parseCSV, greeting } from "./_detector.js";
import { readBody, str, methodPost } from "./_guard.js";

// Analyse a raw CSV. Body: { csv: "<raw csv text>" }
export default function handler(req, res) {
  if (!methodPost(req, res)) return;
  const { ok, body, error } = readBody(req);
  if (!ok) return res.status(400).json({ error });

  const csv = str(body?.csv, 200000);
  if (!csv) return res.status(400).json({ error: "No CSV provided" });

  const txns = parseCSV(csv);
  if (!txns.length) return res.status(400).json({ error: "Could not parse any transactions from that CSV." });

  const result = analyze(txns, { today: new Date().toISOString() });
  res.status(200).json({
    profile: { name: "You", greeting: greeting(), currency: "₹" },
    ...result,
  });
}
