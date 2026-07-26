// Ask Zombii — chat grounded in the user's subscription data, powered by Groq.
// Requires env var GROQ_API_KEY (set in Vercel project settings / local .env).

import { readBody, str, methodPost } from "./_guard.js";

export default async function handler(req, res) {
  if (!methodPost(req, res)) return;

  const key = process.env.GROQ_API_KEY;
  if (!key) return res.status(200).json({ reply: "⚠ Ask Zombii isn't configured yet — add a GROQ_API_KEY env var in Vercel to enable the AI assistant." });

  try {
    const parsed = readBody(req);
    if (!parsed.ok) return res.status(400).json({ error: parsed.error });
    const body = parsed.body;
    const message = str(body?.message, 1000);
    const context = body?.context;
    if (!message) return res.status(400).json({ error: "No message" });

    const system = `You are Zombii, a sharp, friendly money assistant inside a subscription-leak app.
You ONLY answer from the user's real data below. Be concise (2-4 sentences), specific, and use ₹.
Recommend concrete actions (cancel/downgrade/renegotiate). Never invent subscriptions.

USER'S SUBSCRIPTION DATA (JSON):
${JSON.stringify(context)}`;

    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.4,
        max_tokens: 400,
        messages: [
          { role: "system", content: system },
          { role: "user", content: message },
        ],
      }),
    });

    if (!r.ok) {
      const t = await r.text();
      return res.status(200).json({ reply: "⚠ The AI service returned an error. Check the GROQ_API_KEY and model.", detail: t.slice(0, 200) });
    }
    const j = await r.json();
    const reply = j.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't generate a reply.";
    res.status(200).json({ reply });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
