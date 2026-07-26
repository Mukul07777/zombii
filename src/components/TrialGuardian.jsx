import { useStore } from "../store";
import MerchantLogo from "./MerchantLogo";

export default function TrialGuardian() {
  const { data } = useStore();
  const trials = data.summary.trials || [];
  if (!trials.length)
    return <div className="pdesc">No trials about to convert — you're safe for now.</div>;

  return (
    <div className="trials">
      {trials.map((t) => (
        <div className="trial" key={t.name}>
          <MerchantLogo domain={t.domain} icon={t.icon} color={t.color} size={40} radius={11} />
          <div className="trial-body">
            <div className="trial-name">{t.name}</div>
            <div className="trial-sub">First charge {t.daysAgo}d ago · likely to auto-charge <b>₹{t.amount.toLocaleString("en-IN")}</b> again</div>
          </div>
          <div className="trial-warn">⏳ in {t.daysUntilNext}d</div>
        </div>
      ))}
    </div>
  );
}
