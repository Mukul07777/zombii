import { useRef, useState } from "react";
import { useStore } from "../store";

const TABS = [
  { id: "csv", label: "📄 Upload CSV" },
  { id: "sms", label: "💬 Paste SMS" },
  { id: "email", label: "✉ Paste email" },
];

const PLACEHOLDER = {
  sms: "Paste your bank SMS alerts, e.g.\nRs 649 debited from A/c XX21 to NETFLIX on 06-Jul UPI Ref 8890\nRs 119 debited to SPOTIFY on 11-Jul...",
  email: "Paste subscription / payment emails here — receipts, renewal notices, invoices. Zombii's AI will pull out the charges.",
};

export default function ImportPanel() {
  const { analyzeFile, importText } = useStore();
  const [tab, setTab] = useState("csv");
  const [text, setText] = useState("");
  const [over, setOver] = useState(false);
  const fileRef = useRef();

  return (
    <div className="import">
      <div className="import-tabs">
        {TABS.map((t) => (
          <button key={t.id} className={`import-tab ${tab === t.id ? "on" : ""}`} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
        <span className="import-ai">⚡ AI-powered parsing</span>
      </div>

      {tab === "csv" ? (
        <>
          <input ref={fileRef} type="file" accept=".csv" hidden onChange={(e) => analyzeFile(e.target.files[0])} />
          <div className={`drop ${over ? "over" : ""}`}
            onClick={() => fileRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setOver(true); }}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => { e.preventDefault(); setOver(false); analyzeFile(e.dataTransfer.files[0]); }}>
            ⬆ Drag &amp; drop a bank statement (.csv) — or click to browse · columns: date, description, amount
          </div>
        </>
      ) : (
        <div className="paste">
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={PLACEHOLDER[tab]} rows={5} />
          <button className="btn btn-grad" onClick={() => importText(text, tab)} disabled={!text.trim()}>
            ⚡ Analyze with AI →
          </button>
        </div>
      )}
    </div>
  );
}
