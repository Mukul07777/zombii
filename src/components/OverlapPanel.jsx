import { useStore } from "../store";
import MerchantLogo from "./MerchantLogo";

export default function OverlapPanel() {
  const { data } = useStore();
  const overlaps = data.summary.overlaps || [];
  if (!overlaps.length)
    return <div className="pdesc">No overlapping subscriptions found — nicely consolidated.</div>;

  return (
    <div className="overlaps">
      {overlaps.map((o) => (
        <div className="overlap" key={o.category}>
          <div className="overlap-head">
            <div>
              <div className="overlap-cat">{o.category} · {o.count} overlapping</div>
              <div className="overlap-sub">You're paying for {o.count} services that do the same job</div>
            </div>
            <div className="overlap-save">save ₹{o.annualWaste.toLocaleString("en-IN")}<span>/yr</span></div>
          </div>
          <div className="overlap-logos">
            {o.items.map((it) => (
              <div className="ostack" key={it.name} title={`${it.name} · ₹${it.price}/mo`}>
                <MerchantLogo domain={it.domain} icon={it.icon} color={it.color} size={38} radius={11} />
              </div>
            ))}
            <div className="overlap-tip">→ keep the cheapest, drop the rest</div>
          </div>
        </div>
      ))}
    </div>
  );
}
