import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";
import Logo from "../components/Logo";
import CountUp from "../components/CountUp";

const STEPS = [
  { no: "01", t: "Connect", p: "Upload a bank statement, or paste SMS alerts. Nothing is stored — it's analysed on the spot." },
  { no: "02", t: "Detect", p: "Zombii spots every recurring charge from messy statement lines using pattern + cadence analysis." },
  { no: "03", t: "Score", p: "Each subscription gets a leak score — flagging silent price hikes and zombie (unused) charges." },
  { no: "04", t: "Act", p: "Get a concrete plan per subscription — and let the AI draft your cancellation email." },
];

const FEATURES = [
  { i: "🧟", t: "Zombie detection", p: "Finds subscriptions that quietly kept charging after you stopped using them." },
  { i: "📈", t: "Silent hike alerts", p: "Catches price increases you never noticed — with the exact before/after." },
  { i: "🛰️", t: "Renewal Radar", p: "Predicts the next charge date so you can cancel before the money leaves." },
  { i: "🚀", t: "Leak → Wealth sim", p: "Shows what your wasted money becomes if invested instead. The wake-up call." },
  { i: "💬", t: "Ask Zombii (AI)", p: "A finance assistant that answers from your real data and drafts cancellation emails." },
  { i: "🔒", t: "Private by design", p: "Your statement never gets stored — analysis happens on demand and is discarded." },
];

export default function Landing() {
  const { data, analyzeFile, theme, toggleTheme } = useStore();
  const nav = useNavigate();
  const fileRef = useRef();
  const s = data?.summary;

  async function onFile(f) { await analyzeFile(f); nav("/app"); }

  return (
    <div className="landing fadein">
      <input ref={fileRef} type="file" accept=".csv" hidden onChange={(e) => onFile(e.target.files[0])} />
      <nav className="lnav">
        <Logo />
        <div className="links"><a href="#how">How it works</a><a href="#features">Features</a></div>
        <div className="sp" />
        <button className="btn btn-out btn-sm" onClick={toggleTheme}>{theme === "light" ? "🌙" : "☀"}</button>
        <button className="btn btn-grad btn-sm" onClick={() => nav("/app")}>Open app ↗</button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div>
          <div className="pill"><span className="dot" /> Live subscription-leak tracking</div>
          <h1>Stop Paying for<br /><span className="g">Things You Forgot</span></h1>
          <p className="lede">Zombii scans your bank statement, hunts down every recurring charge, silent price hike and zombie subscription — then tells you exactly what to cancel, downgrade or renegotiate.</p>
          <div className="ctas">
            <button className="btn btn-grad" onClick={() => fileRef.current.click()}>Scan my statement ↗</button>
            <button className="btn btn-out" onClick={() => nav("/app")}>See the live demo</button>
          </div>
          <div className="herostats">
            <div><div className="n">₹{s ? <CountUp value={s.totalLeak} /> : "…"}</div><div className="t">Leaking every year</div></div>
            <div><div className="n">{s?.count ?? "…"}</div><div className="t">Subscriptions found</div></div>
            <div><div className="n">{s?.zombies ?? "…"}</div><div className="t">Zombies to kill</div></div>
          </div>
        </div>
        <div className="stack">
          <div className="floatcard fc1"><div className="ic">🔍</div><div className="st">Detect</div><div className="sd">Recurring charges from raw statement lines</div></div>
          <div className="floatcard fc2"><div className="ic">📊</div><div className="st">Leak score</div><div className="big">{s?.overallScore ?? "…"}<span style={{ fontSize: 16, opacity: .6 }}>/100</span></div></div>
          <div className="floatcard fc3"><div className="ic">💰</div><div className="st">Reclaim</div><div className="big">₹{s ? s.totalLeak.toLocaleString("en-IN") : "…"}</div><div className="sd">per year</div></div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" id="how">
        <div className="sk">How it works</div>
        <h2>From messy statement to money back</h2>
        <p className="lead">Four steps. No bank login, no spreadsheets, no reading line by line.</p>
        <div className="pipe">
          {STEPS.map((st, i) => (
            <div className="step" key={st.no}>
              <div className="no">{st.no}</div>
              <h4>{st.t}</h4>
              <p>{st.p}</p>
              {i < STEPS.length - 1 && <div className="ar">→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="section" id="features">
        <div className="sk">Why Zombii</div>
        <h2>More than a subscription list</h2>
        <p className="lead">It predicts, persuades and acts — not just reports.</p>
        <div className="featgrid">
          {FEATURES.map((f) => (
            <div className="feat" key={f.t}>
              <div className="fi">{f.i}</div>
              <h4>{f.t}</h4>
              <p>{f.p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="ctaband">
        <h2>See what's draining your account</h2>
        <p>Takes 5 seconds. Try a sample statement or upload your own.</p>
        <button className="btn btn-lg" style={{ padding: "15px 30px" }} onClick={() => nav("/app")}>Open the dashboard →</button>
      </section>

      <footer>Zombii · your statement is analysed on-demand and never stored · built for InnovaHack</footer>
    </div>
  );
}
