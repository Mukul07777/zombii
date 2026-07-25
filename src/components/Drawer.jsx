import { useStore } from "../store";
import TrendChart from "./TrendChart";

export default function Drawer() {
  const { drawerSub: s, setDrawerSub } = useStore();
  if (!s) return null;
  const close = () => setDrawerSub(null);

  // charge history as a mini trend series
  const series = s.history.map((h) => ({ month: h.date.slice(0, 7), total: h.amount }));

  return (
    <>
      <div className="drawer-back" onClick={close} />
      <div className="drawer">
        <button className="x" onClick={close}>✕</button>
        <div className="dhead">
          <div className="ic" style={{ background: s.color }}>{s.icon}</div>
          <div>
            <h2>{s.name}</h2>
            <div className="cat">{s.cat} · {s.cadence}</div>
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
          <button className={`act ${s.action}`} style={{ marginTop: 22 }}>{s.actLabel}</button>
        )}
        {s.save > 0 && <div className="savenote">💰 Saves ₹{s.save.toLocaleString("en-IN")} / year</div>}
      </div>
    </>
  );
}
