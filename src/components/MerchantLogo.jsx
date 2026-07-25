import { useState } from "react";

// Real brand logo via Clearbit, falling back to the coloured letter tile.
export default function MerchantLogo({ domain, icon, color, size = 46, radius = 13 }) {
  const [failed, setFailed] = useState(false);
  const style = { width: size, height: size, borderRadius: radius };

  if (domain && !failed) {
    return (
      <div className="mlogo" style={{ ...style, background: "#fff", border: "1px solid var(--line)", display: "grid", placeItems: "center", overflow: "hidden", flexShrink: 0 }}>
        <img
          src={`https://logo.clearbit.com/${domain}`}
          alt=""
          width={size * 0.62}
          height={size * 0.62}
          style={{ objectFit: "contain" }}
          onError={() => setFailed(true)}
        />
      </div>
    );
  }
  return (
    <div className="ic" style={{ ...style, background: color, display: "grid", placeItems: "center", color: "#fff", fontWeight: 700, fontFamily: "Poppins", flexShrink: 0 }}>
      {icon}
    </div>
  );
}
