import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";
import Logo from "../components/Logo";
import CountUp from "../components/CountUp";

export default function Landing() {
  const { data, analyzeFile, theme, toggleTheme } = useStore();
  const nav = useNavigate();
  const fileRef = useRef();
  const s = data?.summary;

  async function onFile(f) {
    await analyzeFile(f);
    nav("/app");
  }

  return (
    <div className="landing fadein">
      <input ref={fileRef} type="file" accept=".csv" hidden onChange={(e) => onFile(e.target.files[0])} />
      <nav className="lnav">
        <Logo />
        <div className="links"><a>How it works</a><a>Features</a><a>Pricing</a></div>
        <div className="sp" />
        <button className="btn btn-out btn-sm" onClick={toggleTheme}>{theme === "dark" ? "☀" : "🌙"}</button>
        <button className="btn btn-grad btn-sm" onClick={() => nav("/app")}>Open app ↗</button>
      </nav>

      <section className="hero">
        <div>
          <div className="pill"><span className="dot" /> Live subscription tracking</div>
          <h1>Stop Paying for<br /><span className="g">Things You Forgot</span></h1>
          <p className="lede">Zombii scans your bank statement, hunts down every recurring charge, silent price hike and zombie subscription — then tells you exactly what to cancel, downgrade or renegotiate.</p>
          <div className="ctas">
            <button className="btn btn-grad" onClick={() => fileRef.current.click()}>Scan my statement ↗</button>
            <button className="btn btn-out" onClick={() => nav("/app")}>See the demo</button>
          </div>
          <div className="herostats">
            <div><div className="n">₹{s ? <CountUp value={s.totalLeak} /> : "…"}</div><div className="t">Leaking every year</div></div>
            <div><div className="n">{s?.count ?? "…"}</div><div className="t">Subscriptions found</div></div>
            <div><div className="n">{s?.zombies ?? "…"}</div><div className="t">Zombies to kill</div></div>
          </div>
        </div>

        <div className="stack">
          <div className="floatcard fc1"><div className="ic">🔍</div><div className="st">1. Detect</div><div className="sd">Finds recurring charges from raw statement lines</div></div>
          <div className="floatcard fc2"><div className="ic">📊</div><div className="st">2. Score the leak</div><div className="big">{s?.overallScore ?? "…"}<span style={{ fontSize: 16, opacity: .6 }}>/100</span></div></div>
          <div className="floatcard fc3"><div className="ic">💰</div><div className="st">3. Act &amp; save</div><div className="big">₹{s ? s.totalLeak.toLocaleString("en-IN") : "…"}</div><div className="sd">reclaimable per year</div></div>
        </div>
      </section>

      <footer>Zombii · your statement is analysed on-demand and never stored · built for InnovaHack</footer>
    </div>
  );
}
