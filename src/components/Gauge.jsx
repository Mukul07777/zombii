import { useEffect, useState } from "react";

// Semi-circular animated gauge (pure SVG)
export default function Gauge({ value }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf, t0;
    const step = (t) => {
      if (!t0) t0 = t;
      const p = Math.min((t - t0) / 1200, 1);
      setV(Math.round((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const color = v > 70 ? "#f43f5e" : v > 45 ? "#f59e0b" : "#10b981";
  const tag = v > 70 ? "🚨 Heavy leakage" : v > 45 ? "⚠ Moderate leakage" : "✅ Fairly tight";
  const r = 90, cx = 110, cy = 110;
  const circ = Math.PI * r; // half circle
  const offset = circ - (v / 100) * circ;

  return (
    <div className="gaugewrap">
      <svg width="220" height="130" viewBox="0 0 220 130">
        <path d={`M20 ${cy} A ${r} ${r} 0 0 1 200 ${cy}`} fill="none" style={{ stroke: "var(--bg-tint)" }} strokeWidth="16" strokeLinecap="round" />
        <path
          d={`M20 ${cy} A ${r} ${r} 0 0 1 200 ${cy}`}
          fill="none" stroke={color} strokeWidth="16" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset .1s linear" }}
        />
      </svg>
      <div className="gaugeval">
        <div className="g" style={{ color }}>{v}</div>
        <div className="l">out of 100</div>
      </div>
      <div className="gtag" style={{ background: color + "22", color }}>{tag}</div>
    </div>
  );
}
