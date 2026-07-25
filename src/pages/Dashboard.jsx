import { useRef, useState } from "react";
import { useStore } from "../store";
import Topbar from "../components/Topbar";
import CountUp from "../components/CountUp";
import Gauge from "../components/Gauge";
import Donut from "../components/Donut";
import RenewalRadar from "../components/RenewalRadar";
import TrendChart from "../components/TrendChart";
import Sparkline from "../components/Sparkline";
import MerchantLogo from "../components/MerchantLogo";

export default function Dashboard() {
  const { data, analyzeFile } = useStore();
  const { summary, subscriptions, profile } = data;
  const [over, setOver] = useState(false);
  const fileRef = useRef();

  const trendVals = summary.trend.map((t) => t.total);
  const kpis = [
    { t: "Annual leakage", v: summary.totalLeak, money: true, delta: "+ leaking", down: true, color: "#e23e2e", spark: trendVals },
    { t: "Monthly recurring", v: summary.monthlyRecurring, money: true, delta: `${summary.count} active`, color: "#f7941d", spark: trendVals },
    { t: "Zombies found", v: summary.zombies, delta: "cancel now", down: true, color: "#f0553a", spark: [2, 3, 2, 4, 3, summary.zombies + 2, summary.zombies] },
    { t: "Leak score", v: summary.overallScore, suffix: "/100", delta: summary.overallScore > 45 ? "needs work" : "healthy", color: "#35c07d", spark: [20, 34, 28, 40, 36, summary.overallScore] },
  ];

  // recent charges feed (flatten histories)
  const activity = subscriptions
    .flatMap((s) => s.history.map((h) => ({ ...h, name: s.name, domain: s.domain, icon: s.icon, color: s.color })))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  return (
    <>
      <Topbar k={`${profile.greeting}, ${profile.name}`} title="Overview" />

      <input ref={fileRef} type="file" accept=".csv" hidden onChange={(e) => analyzeFile(e.target.files[0])} />

      {/* KPI ROW */}
      <div className="kpirow">
        {kpis.map((k, i) => (
          <div className="kpi" key={i}>
            <div className="kpi-top">
              <span className="kpi-t">{k.t}</span>
              <span className="kpi-delta" style={{ color: k.color, background: k.color + "1f" }}>{k.delta}</span>
            </div>
            <div className="kpi-n">{k.money && "₹"}<CountUp value={k.v} dur={1300} />{k.suffix || ""}</div>
            <Sparkline data={k.spark} color={k.color} w={150} h={40} />
          </div>
        ))}
      </div>

      {/* HERO CASHFLOW + SIDE */}
      <div className="dashgrid">
        <div className="panel">
          <div className="panel-head">
            <div>
              <h3>Recurring cashflow</h3>
              <div className="pdesc">Monthly total of every detected subscription</div>
            </div>
            <div className="bignum">₹{summary.monthlyRecurring.toLocaleString("en-IN")}<span>/mo now</span></div>
          </div>
          <TrendChart data={summary.trend} height={240} />
        </div>

        <div className="panel">
          <h3>Leak Score</h3>
          <div className="pdesc">Share of recurring spend wasted</div>
          <Gauge value={summary.overallScore} />
        </div>
      </div>

      {/* RADAR + ACTIVITY + DONUT */}
      <div className="dashgrid2">
        <div className="panel">
          <h3>🛰️ Renewal Radar</h3>
          <div className="pdesc">Predicted upcoming charges — cancel before they hit</div>
          <RenewalRadar />
        </div>

        <div className="panel">
          <h3>Recent charges</h3>
          <div className="pdesc">Latest recurring debits</div>
          <div className="feed">
            {activity.map((a, i) => (
              <div className="feedrow" key={i}>
                <MerchantLogo domain={a.domain} icon={a.icon} color={a.color} size={36} radius={10} />
                <div>
                  <div className="fn">{a.name}</div>
                  <div className="fd">{new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}</div>
                </div>
                <div className="fa">– ₹{a.amount.toLocaleString("en-IN")}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <h3>By category</h3>
          <div className="pdesc">Where money concentrates</div>
          <Donut data={summary.byCategory} />
        </div>
      </div>

      <div className={`drop ${over ? "over" : ""}`}
        onClick={() => fileRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); analyzeFile(e.dataTransfer.files[0]); }}>
        ⬆ Drag &amp; drop your own bank statement (.csv) — columns: date, description, amount
      </div>
    </>
  );
}
