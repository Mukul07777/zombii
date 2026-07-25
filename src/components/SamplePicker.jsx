import { useStore } from "../store";

const ICON = { professional: "💼", student: "🎓", family: "👨‍👩‍👧" };

export default function SamplePicker() {
  const { samples, persona, loadSample } = useStore();
  if (!samples.length) return null;
  return (
    <div className="samplepicker">
      <div className="sp-label">Try a sample statement</div>
      <div className="sp-cards">
        {samples.map((s) => (
          <button key={s.id} className={`sp-card ${persona === s.id ? "on" : ""}`} onClick={() => loadSample(s.id)}>
            <span className="sp-ic">{ICON[s.id] || "📄"}</span>
            <span className="sp-txt"><b>{s.label}</b><small>{s.desc}</small></span>
          </button>
        ))}
      </div>
    </div>
  );
}
