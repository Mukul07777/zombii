const COLORS = ["#7c3aed", "#db2777", "#4f46e5", "#f59e0b", "#10b981", "#f43f5e"];

// Pure-SVG donut with legend
export default function Donut({ data }) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  let acc = 0;
  const R = 70, C = 90, sw = 26, circ = 2 * Math.PI * R;

  return (
    <div className="donutwrap">
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle cx={C} cy={C} r={R} fill="none" style={{ stroke: "var(--bg-tint)" }} strokeWidth={sw} />
        {data.map((d, i) => {
          const frac = d.value / total;
          const dash = frac * circ;
          const seg = (
            <circle
              key={i} cx={C} cy={C} r={R} fill="none"
              stroke={COLORS[i % COLORS.length]} strokeWidth={sw}
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-acc * circ}
              transform={`rotate(-90 ${C} ${C})`}
              style={{ transition: "stroke-dasharray .8s ease" }}
            />
          );
          acc += frac;
          return seg;
        })}
        <text x={C} y={C - 4} textAnchor="middle" fontFamily="Poppins" fontSize="13" style={{ fill: "var(--muted)" }}>Monthly</text>
        <text x={C} y={C + 16} textAnchor="middle" fontFamily="Poppins" fontSize="18" fontWeight="700" style={{ fill: "var(--ink)" }}>
          ₹{total.toLocaleString("en-IN")}
        </text>
      </svg>
      <div className="legend">
        {data.map((d, i) => (
          <div className="legrow" key={i}>
            <span className="sw" style={{ background: COLORS[i % COLORS.length] }} />
            {d.label}
            <span className="amt">₹{d.value.toLocaleString("en-IN")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
