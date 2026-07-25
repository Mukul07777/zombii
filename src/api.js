// Same-origin on Vercel: /api/* are serverless functions.
export async function fetchDemo(profile = "professional") {
  const r = await fetch(`/api/demo?profile=${encodeURIComponent(profile)}`);
  if (!r.ok) throw new Error("Could not load demo data");
  return r.json();
}

export async function fetchSamples() {
  try { const r = await fetch("/api/samples"); return (await r.json()).samples; }
  catch { return []; }
}

export async function analyzeCSV(file) {
  const csv = await file.text();
  const r = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ csv }),
  });
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "Analyze failed");
  return r.json();
}

// Agentic parse: any raw statement / SMS / email text → structured → analysed.
export async function analyzeText(text, source = "text") {
  const r = await fetch("/api/parse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, source }),
  });
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "Parsing failed");
  return r.json();
}
