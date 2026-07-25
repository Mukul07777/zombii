import { useEffect, useState } from "react";
import { useStore } from "../store";

const STEPS = [
  "Reading transactions…",
  "Cleaning merchant names…",
  "Grouping recurring charges…",
  "Detecting cadence & price hikes…",
  "Hunting zombie subscriptions…",
  "Scoring the leaks…",
];

export default function Scanning() {
  const { scanning } = useStore();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!scanning) { setStep(0); return; }
    const id = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 550);
    return () => clearInterval(id);
  }, [scanning]);

  if (!scanning) return null;
  const pct = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <div className="scan-back">
      <div className="scan-card">
        <div className="scan-mascot">🧟</div>
        <div className="scan-title">Zombii is scanning…</div>
        <div className="scan-steps">
          {STEPS.map((t, i) => (
            <div key={i} className={`scan-step ${i < step ? "done" : i === step ? "active" : ""}`}>
              <span className="dot">{i < step ? "✓" : i === step ? "◐" : "○"}</span>{t}
            </div>
          ))}
        </div>
        <div className="scan-track"><i style={{ width: pct + "%" }} /></div>
        <div className="scan-pct">{pct}%</div>
      </div>
    </div>
  );
}
