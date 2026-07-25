import { analyze, parseCSV, greeting, SAMPLE_CSV, DEMO_TODAY, DEMO_UNUSED } from "./_detector.js";

export default function handler(req, res) {
  const txns = parseCSV(SAMPLE_CSV);
  const result = analyze(txns, { today: DEMO_TODAY, unused: DEMO_UNUSED });
  res.status(200).json({
    profile: { name: "Mukul", greeting: greeting(), currency: "₹" },
    ...result,
  });
}
