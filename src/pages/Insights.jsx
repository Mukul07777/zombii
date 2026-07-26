import { useStore } from "../store";
import Topbar from "../components/Topbar";
import TrendChart from "../components/TrendChart";
import Donut from "../components/Donut";
import CountUp from "../components/CountUp";
import OverlapPanel from "../components/OverlapPanel";
import Benchmark from "../components/Benchmark";

export default function Insights() {
  const { data } = useStore();
  const { summary, subscriptions } = data;
  const trend = summary.trend;

  const first = trend[0]?.total || 0;
  const last = trend[trend.length - 1]?.total || 0;
  const change = first ? Math.round(((last - first) / first) * 100) : 0;
  const peak = trend.reduce((a, b) => (b.total > a.total ? b : a), trend[0]);
  const worst = subscriptions[0];

  const cards = [
    { t: "Recurring spend now", n: last, money: true, sub: "per month" },
    { t: "Change since start", n: Math.abs(change), suffix: "%", sub: change >= 0 ? "↑ higher" : "↓ lower", color: change >= 0 ? "var(--red)" : "var(--green)" },
    { t: "Biggest leak", n: worst?.name, text: true, sub: `${worst?.score}/100 leak score` },
  ];

  return (
    <>
      <Topbar k="Trends & patterns" title="Insights" />

      <div className="grid3">
        {cards.map((c, i) => (
          <div className="panel" key={i} style={{ padding: 24 }}>
            <div className="pdesc" style={{ marginBottom: 8 }}>{c.t}</div>
            <div style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: c.text ? 22 : 32, letterSpacing: "-1px", color: c.color || "var(--ink)" }}>
              {c.text ? c.n : <>{c.money && "₹"}<CountUp value={c.n} />{c.suffix || ""}</>}
            </div>
            <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      <div className="panel" style={{ marginBottom: 24 }}>
        <h3>📊 How you compare</h3>
        <div className="pdesc">Your subscription waste vs. the average person</div>
        <Benchmark />
      </div>

      <div className="panel" style={{ marginBottom: 24 }}>
        <h3>🔀 Overlap detector <span style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)" }}>— duplicate services doing the same job</span></h3>
        <div className="pdesc">Extra money nobody else's tool catches — you're double-paying within a category</div>
        <OverlapPanel />
      </div>

      <div className="panel" style={{ marginBottom: 24 }}>
        <h3>Recurring spend over time</h3>
        <div className="pdesc">Monthly total of all detected subscriptions · peak in {new Date(peak.month + "-01").toLocaleDateString("en-IN", { month: "long" })}</div>
        <TrendChart data={trend} />
      </div>

      <div className="grid">
        <div className="panel">
          <h3>Category split</h3>
          <div className="pdesc">Where recurring money concentrates</div>
          <Donut data={summary.byCategory} />
        </div>
        <div className="panel">
          <h3>What to do first</h3>
          <div className="pdesc">Ranked by leak score</div>
          {subscriptions.slice(0, 4).map((s, i) => (
            <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px dashed var(--line)" }}>
              <div style={{ width: 26, fontFamily: "Poppins", fontWeight: 800, color: "var(--muted)" }}>{i + 1}</div>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: s.color, color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, fontFamily: "Poppins", fontSize: 13 }}>{s.icon}</div>
              <div><div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 14 }}>{s.name}</div><div style={{ color: "var(--muted)", fontSize: 12 }}>{s.actLabel}</div></div>
              <div style={{ marginLeft: "auto", fontFamily: "Poppins", fontWeight: 800, color: s.score > 70 ? "var(--red)" : s.score > 45 ? "var(--amber)" : "var(--green)" }}>{s.score}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
