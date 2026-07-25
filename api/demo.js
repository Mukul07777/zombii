import { analyze, parseCSV, greeting, DEMO_TODAY } from "./_detector.js";
import { SAMPLES } from "./_samples.js";

const NAMES = { professional: "Mukul", student: "Aarav", family: "The Sharmas" };

export default function handler(req, res) {
  const id = (req.query?.profile || "professional").toLowerCase();
  const sample = SAMPLES[id] || SAMPLES.professional;
  const txns = parseCSV(sample.csv);
  const result = analyze(txns, { today: DEMO_TODAY, unused: sample.unused });
  res.status(200).json({
    profile: { name: NAMES[id] || "You", greeting: greeting(), currency: "₹", persona: id },
    ...result,
  });
}
