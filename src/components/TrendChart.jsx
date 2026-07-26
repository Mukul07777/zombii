// Pure-SVG area + line chart for monthly recurring spend
export default function TrendChart({ data, height = 240 }) {
  if (!data?.length) return null;
  const W = 640, H = height, pad = 34;
  const max = Math.max(...data.map((d) => d.total)) * 1.15 || 1;
  const min = 0;
  const x = (i) => pad + (i * (W - pad * 2)) / (data.length - 1 || 1);
  const y = (v) => H - pad - ((v - min) / (max - min)) * (H - pad * 2);

  const line = data.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d.total)}`).join(" ");
  const area = `${line} L${x(data.length - 1)},${H - pad} L${x(0)},${H - pad} Z`;
  const fmtMonth = (m) => new Date(m + "-01").toLocaleDateString("en-IN", { month: "short" });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7941d" stopOpacity="0.38" />
          <stop offset="1" stopColor="#f7941d" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lineG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f9a825" />
          <stop offset="1" stopColor="#e23e2e" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((f, i) => (
        <line key={i} x1={pad} x2={W - pad} y1={y(max * f)} y2={y(max * f)} style={{ stroke: "var(--line)" }} strokeDasharray="4 5" />
      ))}
      <path d={area} fill="url(#areaG)" className="tc-area" />
      <path d={line} fill="none" stroke="url(#lineG)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="tc-line" />
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(d.total)} r="4.5" style={{ fill: "var(--surface)" }} stroke="url(#lineG)" strokeWidth="2.5" />
          <text x={x(i)} y={H - 12} textAnchor="middle" fontSize="12" style={{ fill: "var(--muted)" }} fontFamily="Inter">{fmtMonth(d.month)}</text>
        </g>
      ))}
    </svg>
  );
}
