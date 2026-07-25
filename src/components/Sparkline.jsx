// Tiny inline sparkline (area + line) for KPI cards.
export default function Sparkline({ data, color = "#7c3aed", w = 120, h = 38 }) {
  if (!data?.length) return null;
  const max = Math.max(...data), min = Math.min(...data);
  const span = max - min || 1;
  const x = (i) => (i * w) / (data.length - 1 || 1);
  const y = (v) => h - 4 - ((v - min) / span) * (h - 8);
  const line = data.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;
  const id = "sp" + color.replace("#", "");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.28" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
