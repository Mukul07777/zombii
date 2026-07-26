import { useState } from "react";
import { useStore } from "../store";
import TrendChart from "./TrendChart";
import MerchantLogo from "./MerchantLogo";

export default function Drawer() {
  const { drawerSub: s, setDrawerSub, killSub, cancelled } = useStore();
  const [email, setEmail] = useState("");
  const [drafting, setDrafting] = useState(false);
  const [copied, setCopied] = useState(false);
  if (!s) return null;
  const close = () => setDrawerSub(null);
  const isCancelled = cancelled.includes(s.name);

  // charge history as a mini trend series
  const series = s.history.map((h) => ({ month: h.date.slice(0, 7), total: h.amount }));

  async function draftEmail(intent) {
    setDrafting(true); setEmail(""); setCopied(false);
    try {
      const r = await fetch("/api/draft", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent, sub: { name: s.name, price: s.price, cadence: s.cadence, type: s.type, flag: s.flag } }),
      });
      const j = await r.json();
      setEmail(j.email || j.error || "Could not draft.");
    } catch { setEmail("⚠ Couldn't reach the AI. Run `vercel dev` with GROQ_API_KEY set."); }
    setDrafting(false);
  }
  function copyEmail() { navigator.clipboard?.writeText(email); setCopied(true); }
  function sendEmail() {
    const m = email.match(/subject:\s*(.*)/i);
    const subject = m ? m[1].trim() : `Cancellation request — ${s.name}`;
    const bodyText = email.replace(/subject:\s*.*\n?/i, "").trim();
    const to = s.domain ? `support@${s.domain}` : "";
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
  }

  return (
    <>
      <div className="drawer-back" onClick={close} />
      <div className="drawer">
        <button className="x" onClick={close}>✕</button>
        <div className="dhead">
          <MerchantLogo domain={s.domain} icon={s.icon} color={s.color} size={56} radius={16} />
          <div>
            <h2>{s.name}</h2>
            <div className="cat">{s.cat} · {s.cadence} · next charge {new Date(s.nextChargeDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
          </div>
        </div>

        <div className={`flag ${s.flag.warn ? "warn" : ""}`} style={{ marginBottom: 20 }}>
          {s.flag.warn ? "⚠" : "✓"} {s.flag.txt}
        </div>

        <div className="dmetrics">
          <div className="dmetric"><div className="n">₹{s.price.toLocaleString("en-IN")}</div><div className="t">Per month</div></div>
          <div className="dmetric"><div className="n" style={{ color: s.score > 70 ? "var(--red)" : s.score > 45 ? "var(--amber)" : "var(--green)" }}>{s.score}</div><div className="t">Leak score</div></div>
          <div className="dmetric"><div className="n">₹{s.annual.toLocaleString("en-IN")}</div><div className="t">Per year</div></div>
        </div>
        {s.confidence != null && (
          <div className="confbar">
            <div className="confbar-top"><span>Detection confidence</span><b>{s.confidence}%</b></div>
            <div className="confbar-track"><i style={{ width: s.confidence + "%" }} /></div>
          </div>
        )}

        <div className="dsub">Charge history</div>
        <TrendChart data={series} height={160} />

        <div className="dsub">Every charge</div>
        <div className="timeline">
          {s.history.map((h, i) => {
            const prev = s.history[i - 1];
            const rose = prev && h.amount > prev.amount;
            return (
              <div className="tlrow" key={i}>
                <span className="dt">{new Date(h.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}</span>
                {rose && <span className="up">↑ hike</span>}
                <span className="amt">₹{h.amount.toLocaleString("en-IN")}</span>
              </div>
            );
          })}
        </div>

        {s.save > 0 && (
          <button className={`act ${isCancelled ? "keep" : s.action}`} style={{ marginTop: 22 }}
            disabled={isCancelled}
            onClick={() => { if (s.action === "cancel") killSub(s); }}>
            {isCancelled ? "✓ Killed" : s.actLabel}
          </button>
        )}
        {s.save > 0 && !isCancelled && <div className="savenote">💰 Saves ₹{s.save.toLocaleString("en-IN")} / year</div>}

        <div className="dsub" style={{ marginTop: 18 }}>✍ Let the AI write it for you</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="act cancel" style={{ flex: 1 }} onClick={() => draftEmail("cancel")} disabled={drafting}>
            {drafting ? "…" : "Draft cancellation"}
          </button>
          <button className="act downgrade" style={{ flex: 1 }} onClick={() => draftEmail("negotiate")} disabled={drafting}>
            {drafting ? "…" : "Draft discount request"}
          </button>
        </div>
        {email && (
          <div className="emailbox">
            <textarea value={email} readOnly rows={9} />
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button className="copybtn" style={{ flex: 1 }} onClick={sendEmail}>✉ Send in mail app</button>
              <button className="copybtn" style={{ background: "var(--surface)", color: "var(--ink)", border: "1px solid var(--line)" }} onClick={copyEmail}>{copied ? "✓" : "Copy"}</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
