import { useRef, useState, useEffect } from "react";
import { useStore } from "../store";

const SUGGESTIONS = [
  "What should I cancel first?",
  "How much can I save this year?",
  "Which subscription raised its price?",
];

export default function ChatWidget() {
  const { data, chatOpen, setChatOpen } = useStore();
  const [msgs, setMsgs] = useState([{ role: "bot", text: "Hey, I'm Zombii 🧟 — ask me what's draining your money." }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const bodyRef = useRef();
  const recogRef = useRef();

  function toggleVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Voice input isn't supported in this browser — try Chrome."); return; }
    if (listening) { recogRef.current?.stop(); return; }
    const rec = new SR();
    rec.lang = "en-IN"; rec.interimResults = false; rec.maxAlternatives = 1;
    rec.onresult = (e) => { const t = e.results[0][0].transcript; setInput(t); send(t); };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recogRef.current = rec; setListening(true); rec.start();
  }

  useEffect(() => { bodyRef.current?.scrollTo(0, bodyRef.current.scrollHeight); }, [msgs, busy]);

  async function send(text) {
    const q = (text ?? input).trim();
    if (!q || busy) return;
    setInput("");
    setMsgs((m) => [...m, { role: "me", text: q }]);
    setBusy(true);
    try {
      const context = {
        summary: data.summary,
        subscriptions: data.subscriptions.map((s) => ({
          name: s.name, price: s.price, cadence: s.cadence, type: s.type,
          leakScore: s.score, save: s.save, flag: s.flag.txt, nextCharge: s.nextChargeDate,
        })),
      };
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, context }),
      });
      const j = await r.json();
      setMsgs((m) => [...m, { role: "bot", text: j.reply || j.error || "No reply." }]);
    } catch {
      setMsgs((m) => [...m, { role: "bot", text: "⚠ Couldn't reach the assistant. Is it running under `vercel dev`?" }]);
    }
    setBusy(false);
  }

  return (
    <>
      <button className="chatfab" onClick={() => setChatOpen((o) => !o)} title="Ask Zombii">
        {chatOpen ? "✕" : "🧟"}
      </button>
      {chatOpen && (
        <div className="chatpanel">
          <div className="chathead">
            <span className="dot" /> Ask Zombii <span className="chatai">AI</span>
          </div>
          <div className="chatbody" ref={bodyRef}>
            {msgs.map((m, i) => <div key={i} className={`bubble ${m.role}`}>{m.text}</div>)}
            {busy && <div className="bubble bot typing"><span></span><span></span><span></span></div>}
            {msgs.length === 1 && (
              <div className="suggests">
                {SUGGESTIONS.map((s) => <button key={s} onClick={() => send(s)}>{s}</button>)}
              </div>
            )}
          </div>
          <div className="chatinput">
            <button className={`micbtn ${listening ? "on" : ""}`} onClick={toggleVoice} title="Speak to Zombii">🎤</button>
            <input value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={listening ? "Listening…" : "Ask or speak…"} />
            <button onClick={() => send()} disabled={busy}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}
