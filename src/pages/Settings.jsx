import { useState } from "react";
import { useStore } from "../store";
import Topbar from "../components/Topbar";

export default function Settings() {
  const { theme, toggleTheme, settings, updateSettings, history, toast } = useStore();
  const [connecting, setConnecting] = useState(false);

  function connectBank() {
    setConnecting(true);
    setTimeout(() => { setConnecting(false); updateSettings({ bankConnected: true }); toast("🏦 Bank connected (demo) — auto-scans enabled", "good"); }, 1400);
  }

  return (
    <>
      <Topbar k="Preferences" title="Settings" />

      <div className="grid">
        <div className="panel">
          <h3>Appearance</h3>
          <div className="pdesc">Theme and display</div>
          <div className="setrow">
            <div><b>Dark mode</b><small>Charcoal + orange premium theme</small></div>
            <button className="toggle" data-on={theme === "dark"} onClick={toggleTheme}><span /></button>
          </div>
        </div>

        <div className="panel">
          <h3>Alerts</h3>
          <div className="pdesc">When Zombii should warn you</div>
          <div className="setrow">
            <div><b>Leak-score alert threshold</b><small>Flag anything above {settings.alertThreshold}/100</small></div>
            <input type="range" min="30" max="90" value={settings.alertThreshold}
              onChange={(e) => updateSettings({ alertThreshold: +e.target.value })} style={{ accentColor: "var(--primary)", width: 140 }} />
          </div>
          <div className="setrow">
            <div><b>Renewal notifications</b><small>Nudge me before a charge hits</small></div>
            <button className="toggle" data-on={settings.notify} onClick={() => updateSettings({ notify: !settings.notify })}><span /></button>
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 18 }}>
        <h3>🏦 Connect your bank <span className="concept-tag">Concept · for reference</span></h3>
        <div className="pdesc">Illustrates the production vision — Zombii would auto-import transactions via a secure aggregator (Account Aggregator / Plaid), no manual uploads. This button is a mock to show the roadmap.</div>
        {settings.bankConnected ? (
          <div className="bank-connected">✓ Connected (demo) · auto-scan every day</div>
        ) : (
          <button className="btn btn-grad" onClick={connectBank} disabled={connecting}>
            {connecting ? "Connecting…" : "Connect bank account (demo)"}
          </button>
        )}
      </div>

      <div className="panel">
        <h3>Scan history</h3>
        <div className="pdesc">Zombii keeps watch — your leak over time</div>
        {history.length ? (
          <div className="histlist">
            {[...history].reverse().map((h, i) => (
              <div className="histrow" key={i}>
                <span className="hd">{new Date(h.at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                <span className="hp">{h.persona}</span>
                <span className="hc">{h.count} subs</span>
                <span className="hl">₹{h.leak.toLocaleString("en-IN")}</span>
                <span className="hs" style={{ color: h.score > 60 ? "var(--red)" : h.score > 40 ? "var(--amber)" : "var(--green)" }}>{h.score}/100</span>
              </div>
            ))}
          </div>
        ) : <div className="pdesc">No scans yet.</div>}
      </div>
    </>
  );
}
