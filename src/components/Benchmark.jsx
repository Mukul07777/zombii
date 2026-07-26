import { useStore } from "../store";
import CountUp from "./CountUp";

// Estimated national average wasted on unused/overpriced subscriptions per year.
const NATIONAL_AVG = 9600; // ₹800/mo

export default function Benchmark() {
  const { data } = useStore();
  const leak = data.summary.totalLeak;
  const ratio = leak / NATIONAL_AVG;
  // map ratio → percentile of people you waste MORE than
  const percentile = Math.max(5, Math.min(95, Math.round(50 + Math.log2(ratio || 0.5) * 22)));
  const worse = leak >= NATIONAL_AVG;

  return (
    <div className="bench">
      <div className="bench-headline">
        You waste more than <span className="bench-pct">{percentile}%</span> of people
      </div>
      <div className="bench-sub">
        Based on an estimated national average of ₹{NATIONAL_AVG.toLocaleString("en-IN")}/yr lost to forgotten subscriptions.
      </div>
      <div className="bench-bars">
        <div className="bench-row">
          <span className="bl">You</span>
          <div className="bt"><i className="you" style={{ width: Math.min(100, ratio * 50) + "%" }} /></div>
          <span className="bv">₹<CountUp value={leak} /></span>
        </div>
        <div className="bench-row">
          <span className="bl">Average</span>
          <div className="bt"><i className="avg" style={{ width: "50%" }} /></div>
          <span className="bv">₹{NATIONAL_AVG.toLocaleString("en-IN")}</span>
        </div>
      </div>
      <div className={`bench-tag ${worse ? "bad" : "good"}`}>
        {worse ? "🚨 Above average — act on the leaks below" : "✅ Below average — nicely managed"}
      </div>
    </div>
  );
}
