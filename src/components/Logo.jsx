// Zombii wordmark + coin-with-a-bite mark
export default function Logo({ showText = true }) {
  return (
    <div className="brand">
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="zg" x1="0" y1="0" x2="40" y2="40">
            <stop offset="0" stopColor="#7c3aed" />
            <stop offset="1" stopColor="#db2777" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="12" fill="url(#zg)" />
        {/* coin */}
        <circle cx="20" cy="20" r="11" fill="#fff" opacity="0.95" />
        {/* bite taken out (the "leak") */}
        <circle cx="29" cy="14" r="6" fill="url(#zg)" />
        {/* Z */}
        <path d="M15 16h9l-8.5 8H24" stroke="#6d28d9" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      {showText && <span>Zombii</span>}
    </div>
  );
}
