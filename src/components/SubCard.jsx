import { useEffect, useRef, useState } from "react";

const BADGE = {
  zombie: { cls: "b-red", txt: "🧟 Zombie" },
  hike: { cls: "b-amber", txt: "📈 Price hike" },
  review: { cls: "b-violet", txt: "🔍 Review" },
  active: { cls: "b-green", txt: "✓ Active" },
};

export default function SubCard({ s, index, onOpen }) {
  const [w, setW] = useState(0);
  const ref = useRef();
  useEffect(() => {
    const t1 = setTimeout(() => ref.current?.classList.add("show"), index * 70);
    const t2 = setTimeout(() => setW(s.score), index * 70 + 150);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [index, s.score]);

  const bar = s.score > 70 ? "#f43f5e" : s.score > 45 ? "#f59e0b" : "#10b981";
  const badge = BADGE[s.type] || BADGE.active;

  return (
    <div className="card" ref={ref} onClick={onOpen}>
      <span className={`badge ${badge.cls}`}>{badge.txt}</span>
      <div className="top">
        <div className="ic" style={{ background: s.color }}>{s.icon}</div>
        <div>
          <div className="name">{s.name}</div>
          <div className="cat">{s.cat}</div>
        </div>
        <div className="price">
          <div className="amt">₹{s.price.toLocaleString("en-IN")}</div>
          <div className="per">/mo · {s.cadence}</div>
        </div>
      </div>
      <div className={`flag ${s.flag.warn ? "warn" : ""}`}>
        {s.flag.warn ? "⚠" : "✓"} {s.flag.txt}
      </div>
      <div className="leakbar"><i style={{ width: w + "%", background: bar }} /></div>
      <div className="leakrow">
        <span>Leak score</span>
        <span style={{ color: bar, fontWeight: 600 }}>{s.score}/100</span>
      </div>
      <button className={`act ${s.action}`} onClick={(e) => { e.stopPropagation(); onOpen?.(); }}>{s.actLabel}</button>
      {s.save > 0 && <div className="savenote">💰 Saves ₹{s.save.toLocaleString("en-IN")}/year</div>}
    </div>
  );
}
