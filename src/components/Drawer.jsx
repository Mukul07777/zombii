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

  async function draftEmail() {
    setDrafting(true); setEmail(""); setCopied(false);
    try {
      const r = await fetch("/api/draft", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sub: { name: s.name, price: s.price, cadence: s.cadence, type: s.type, flag: s.flag } }),
      });
      const j = await r.json();
      setEmail(j.email || j.error || "Could not draft.");
    } catch { setEmail("⚠ Couldn't reach the AI. Run `vercel dev` with GROQ_API_KEY set."); }
    setDrafting(false);
  }
  function copyEmail() { navigator.clipboard?.writeText(email); setCopied(true); }

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

        <button className="act downgrade" style={{ marginTop: 12 }} onClick={draftEmail} disabled={drafting}>
          {drafting ? "✍ Drafting…" : "✍ Draft cancellation email (AI)"}
        </button>
        {email && (
          <div className="emailbox">
            <textarea value={email} readOnly rows={9} />
            <button className="copybtn" onClick={copyEmail}>{copied ? "✓ Copied" : "Copy email"}</button>
          </div>
        )}
      </div>
    </>
  );
}
