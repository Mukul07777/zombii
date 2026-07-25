import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Logo from "./Logo";
import Drawer from "./Drawer";
import ChatWidget from "./ChatWidget";
import Mascot from "./Mascot";
import Scanning from "./Scanning";
import { useStore } from "../store";

const LINKS = [
  { to: "/app", end: true, ic: "◱", label: "Dashboard" },
  { to: "/app/subscriptions", ic: "🔁", label: "Subscriptions" },
  { to: "/app/simulator", ic: "🚀", label: "Simulator" },
  { to: "/app/insights", ic: "📈", label: "Insights" },
];

export default function AppShell() {
  const { data, error, theme, toggleTheme, drawerSub, reclaimed, cancelled } = useStore();
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  return (
    <div className="shell">
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <Logo />
        {LINKS.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end}
            className={({ isActive }) => `navlink ${isActive ? "on" : ""}`}
            onClick={() => setOpen(false)}>
            <span className="ni">{l.ic}</span>{l.label}
          </NavLink>
        ))}
        <div className="side-spacer" />
        <Mascot />
        {reclaimed > 0 ? (
          <div className="side-card" style={{ background: "var(--grad)", color: "#fff", border: "none" }}>
            <div className="t" style={{ color: "rgba(255,255,255,.85)" }}>🎉 Reclaimed · {cancelled.length} killed</div>
            <div className="n" style={{ color: "#fff" }}>₹{reclaimed.toLocaleString("en-IN")}</div>
          </div>
        ) : data ? (
          <div className="side-card">
            <div className="t">Reclaimable / year</div>
            <div className="n">₹{data.summary.totalLeak.toLocaleString("en-IN")}</div>
          </div>
        ) : null}
        <button className="themebtn" onClick={toggleTheme}>
          {theme === "dark" ? "☀ Light mode" : "🌙 Dark mode"}
        </button>
      </aside>

      <main className="main">
        <div className="mainpad">
          {error && !data ? (
            <div className="loading"><div className="err">⚠ {error}<br />Run <b>vercel dev</b> locally so /api works.</div></div>
          ) : !data ? (
            <div className="loading"><div className="spin" /><div style={{ color: "var(--muted)", fontFamily: "Poppins", fontWeight: 600 }}>🧟 Hunting zombie subscriptions…</div></div>
          ) : (
            <div key={loc.pathname} className="fadein"><Outlet /></div>
          )}
        </div>
      </main>

      {drawerSub && <Drawer />}
      {data && <ChatWidget />}
      <Scanning />
    </div>
  );
}
