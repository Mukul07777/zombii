// Small request-hardening helpers shared by the serverless endpoints.

const MAX_BYTES = 200_000; // ~200 KB cap on any request body

// Parse + validate a JSON body. Returns { ok, body, error }.
export function readBody(req) {
  let body = req.body;
  if (typeof body === "string") {
    if (body.length > MAX_BYTES) return { ok: false, error: "Payload too large" };
    try { body = JSON.parse(body || "{}"); } catch { return { ok: false, error: "Invalid JSON" }; }
  }
  if (body && typeof body === "object") {
    const size = JSON.stringify(body).length;
    if (size > MAX_BYTES) return { ok: false, error: "Payload too large" };
    return { ok: true, body };
  }
  return { ok: true, body: {} };
}

// Ensure a value is a non-empty string within a length bound.
export function str(v, max = 20000) {
  if (typeof v !== "string") return "";
  return v.slice(0, max);
}

export function methodPost(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed — use POST" });
    return false;
  }
  return true;
}
