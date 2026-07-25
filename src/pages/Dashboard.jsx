import { useRef, useState } from "react";
import { useStore } from "../store";
import Topbar from "../components/Topbar";
import CountUp from "../components/CountUp";
import Gauge from "../components/Gauge";
import Donut from "../components/Donut";

export default function Dashboard() {
  const { data, analyzeFile } = useStore();
  const { summary, profile } = data;
  const [over, setOver] = useState(false);
  const fileRef = useRef();

  const stats = [
    { ico: "🔁", n: summary.count, t: "Recurring subscriptions" },
    { ico: "🧟", n: summary.zombies, t: "Zombie / unused" },
    { ico: "📈", n: summary.hikes, t: "Silent price hikes" },
    { ico: "💰", n: summary.totalLeak, t: "Reclaimable / year", money: true },
  ];

  return (
    <>
      <Topbar k={`${profile.greeting}, ${profile.name}`} title="Your money, decoded" />

      <div className="leakbanner">
        <div className="inner">
          <div>
            <div className="lbl"><span className="dot" /> Total leakage detected</div>
            <div className="big">₹<CountUp value={summary.totalLeak} dur={1600} /></div>
            <div className="cap">bleeding out every year across {summary.count} subscriptions — scanned from {summary.scannedTxns} transactions.</div>
            <div className="status">✓ Analysis complete · updated just now</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="lbl" style={{ justifyContent: "flex-end" }}>Monthly recurring</div>
            <div className="big" style={{ fontSize: 42 }}>₹<CountUp value={summary.monthlyRecurring} /></div>
          </div>
        </div>
      </div>

      <input ref={fileRef} type="file" accept=".csv" hidden onChange={(e) => analyzeFile(e.target.files[0])} />
      <div className={`drop ${over ? "over" : ""}`}
        onClick={() => fileRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); analyzeFile(e.dataTransfer.files[0]); }}>
        ⬆ Drag &amp; drop your own bank statement (.csv) — columns: date, description, amount
      </div>

      <div className="stats">
        {stats.map((s, i) => (
          <div className="stat" key={i}>
            <div className="ico">{s.ico}</div>
            <div className="n">{s.money ? <CountUp value={s.n} prefix="₹" dur={1600} /> : <CountUp value={s.n} dur={900} />}</div>
            <div className="t">{s.t}</div>
          </div>
        ))}
      </div>

      <div className="grid">
        <div className="panel">
          <h3>Where your money goes</h3>
          <div className="pdesc">Monthly recurring spend by category</div>
          <Donut data={summary.byCategory} />
        </div>
        <div className="panel">
          <h3>Leak Score</h3>
          <div className="pdesc">How much of your recurring spend is wasted</div>
          <Gauge value={summary.overallScore} />
        </div>
      </div>
    </>
  );
}
