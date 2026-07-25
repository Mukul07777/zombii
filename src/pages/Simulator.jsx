import { useState } from "react";
import { useStore } from "../store";
import Topbar from "../components/Topbar";
import TrendChart from "../components/TrendChart";
import MerchantLogo from "../components/MerchantLogo";
import CountUp from "../components/CountUp";

const RATE = 0.12; // assumed annual return

export default function Simulator() {
  const { data } = useStore();
  const cancelable = data.subscriptions.filter((s) => s.save > 0);
  const [picked, setPicked] = useState(() => new Set(cancelable.filter((s) => s.type === "zombie").map((s) => s.name)));
  const [years, setYears] = useState(5);

  const toggle = (name) =>
    setPicked((p) => { const n = new Set(p); n.has(name) ? n.delete(name) : n.add(name); return n; });

  const annualSaved = cancelable.filter((s) => picked.has(s.name)).reduce((a, s) => a + s.save, 0);
  const monthlySaved = Math.round(annualSaved / 12);

  // future value of monthly contributions compounding monthly
  const fv = (yrs) => {
    const m = RATE / 12, n = yrs * 12;
    return Math.round(monthlySaved * ((Math.pow(1 + m, n) - 1) / m));
  };
  const projected = fv(years);
  const contributed = monthlySaved * 12 * years;

  const curve = Array.from({ length: years + 1 }, (_, i) => ({ month: `${2026 + i}-01`, total: fv(i) }));

  return (
    <>
      <Topbar k="What if you invested it" title="Leak → Wealth simulator" />

      <div className="leakbanner" style={{ marginBottom: 22 }}>
        <div className="inner">
          <div>
            <div className="lbl"><span className="dot" /> If you cancel {picked.size} and invest the savings</div>
            <div className="big">₹<CountUp value={projected} dur={1400} /></div>
            <div className="cap">in {years} years at ~12% p.a. — from ₹{monthlySaved.toLocaleString("en-IN")}/mo you'd otherwise leak away.</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="lbl" style={{ justifyContent: "flex-end" }}>You put in</div>
            <div className="big" style={{ fontSize: 38 }}>₹<CountUp value={contributed} /></div>
            <div className="cap" style={{ marginLeft: "auto" }}>growth: ₹{(projected - contributed).toLocaleString("en-IN")}</div>
          </div>
        </div>
      </div>

      <div className="grid">
        <div className="panel">
          <h3>Pick what to cancel</h3>
          <div className="pdesc">Toggle subscriptions — watch the projection update</div>
          {cancelable.map((s) => {
            const on = picked.has(s.name);
            return (
              <div key={s.name} onClick={() => toggle(s.name)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 10px", borderRadius: 14, cursor: "pointer",
                  border: "1px solid var(--line)", marginBottom: 10, background: on ? "var(--bg-tint)" : "var(--surface)", transition: ".15s" }}>
                <MerchantLogo domain={s.domain} icon={s.icon} color={s.color} size={38} radius={10} />
                <div><div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 14 }}>{s.name}</div>
                  <div style={{ color: "var(--muted)", fontSize: 12 }}>saves ₹{s.save.toLocaleString("en-IN")}/yr</div></div>
                <div style={{ marginLeft: "auto", width: 44, height: 26, borderRadius: 100, background: on ? "var(--primary)" : "var(--bg-tint)", position: "relative", transition: ".2s" }}>
                  <div style={{ position: "absolute", top: 3, left: on ? 21 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: ".2s", boxShadow: "0 1px 4px rgba(0,0,0,.3)" }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="panel">
          <h3>Wealth projection</h3>
          <div className="pdesc">Horizon: {years} years · assumes 12% annual return</div>
          <input type="range" min="1" max="15" value={years} onChange={(e) => setYears(+e.target.value)}
            style={{ width: "100%", accentColor: "var(--primary)", marginBottom: 16 }} />
          <TrendChart data={curve} height={220} />
          <div style={{ display: "flex", justifyContent: "space-around", marginTop: 12, textAlign: "center" }}>
            <div><div style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 22 }}>₹{monthlySaved.toLocaleString("en-IN")}</div><div style={{ color: "var(--muted)", fontSize: 12 }}>saved / month</div></div>
            <div><div style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 22, color: "var(--green)" }}>₹{projected.toLocaleString("en-IN")}</div><div style={{ color: "var(--muted)", fontSize: 12 }}>in {years} yrs</div></div>
          </div>
        </div>
      </div>
    </>
  );
}
