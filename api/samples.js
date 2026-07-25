import { SAMPLE_LIST } from "./_samples.js";

export default function handler(_req, res) {
  res.status(200).json({ samples: SAMPLE_LIST });
}
