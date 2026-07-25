// Same-origin on Vercel: /api/demo and /api/analyze are serverless functions.
export async function fetchDemo() {
  const r = await fetch("/api/demo");
  if (!r.ok) throw new Error("Could not load demo data");
  return r.json();
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
