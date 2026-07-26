// Draft a cancellation / downgrade / renegotiation email for one subscription, via Groq.
import { readBody, methodPost } from "./_guard.js";

export default async function handler(req, res) {
  if (!methodPost(req, res)) return;
  const key = process.env.GROQ_API_KEY;
  if (!key) return res.status(200).json({ email: "Add a GROQ_API_KEY env var in Vercel to enable AI-drafted emails." });

  try {
    const parsed = readBody(req);
    if (!parsed.ok) return res.status(400).json({ error: parsed.error });
    const body = parsed.body;
    const s = body?.sub;
    if (!s) return res.status(400).json({ error: "No subscription provided" });

    const mode = body?.intent; // 'cancel' | 'negotiate' | undefined
    const intent = mode === "cancel" ? "cancel the subscription entirely and confirm no further charges"
      : mode === "negotiate" ? "request a retention discount or a lower plan, making clear you'll cancel otherwise"
      : s.type === "zombie" ? "cancel the subscription entirely"
      : s.type === "hike" ? "push back on the recent price increase and request the old price or a discount, otherwise cancel"
      : "downgrade to a cheaper plan";

    const prompt = `Write a short, polite but firm email to ${s.name}'s customer support to ${intent}.
Context: it's a ${s.cadence} charge of ₹${s.price}. ${s.flag?.txt || ""}.
Keep it under 120 words, ready to send, with a subject line. Use placeholder [Your Name] at the end. Plain text only.`;

    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.6,
        max_tokens: 400,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!r.ok) return res.status(200).json({ email: "⚠ AI service error — check the API key/model." });
    const j = await r.json();
    res.status(200).json({ email: j.choices?.[0]?.message?.content?.trim() || "Could not draft email." });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
