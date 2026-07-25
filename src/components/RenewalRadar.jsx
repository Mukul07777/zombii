import MerchantLogo from "./MerchantLogo";
import { useStore } from "../store";

export default function RenewalRadar() {
  const { data, setDrawerSub, cancelled } = useStore();
  // upcoming charges within 45 days, soonest first (skip already cancelled)
  const upcoming = data.subscriptions
    .filter((s) => s.daysUntil >= 0 && s.daysUntil <= 45 && !cancelled.includes(s.name))
    .sort((a, b) => a.daysUntil - b.daysUntil);

  if (!upcoming.length)
    return <div className="pdesc">No charges expected in the next 45 days.</div>;

  return (
    <div className="radar">
      {upcoming.map((s) => {
        const soon = s.daysUntil <= 5;
        return (
          <div key={s.name} className="radarrow" onClick={() => setDrawerSub(s)}>
            <MerchantLogo domain={s.domain} icon={s.icon} color={s.color} size={40} radius={11} />
            <div>
              <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 14 }}>{s.name}</div>
              <div style={{ color: "var(--muted)", fontSize: 12 }}>
                charges ₹{s.price.toLocaleString("en-IN")} on {new Date(s.nextChargeDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </div>
            </div>
            <div className={`radarday ${soon ? "soon" : ""}`}>
              {s.daysUntil === 0 ? "today" : `in ${s.daysUntil}d`}
            </div>
          </div>
        );
      })}
    </div>
  );
}
