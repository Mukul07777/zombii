import { createContext, useContext, useEffect, useState } from "react";
import { fetchDemo, fetchSamples, analyzeCSV, analyzeText } from "./api";
import { fireConfetti } from "./confetti";

const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);

export function StoreProvider({ children }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [drawerSub, setDrawerSub] = useState(null);
  const [cancelled, setCancelled] = useState([]);   // names of killed subs
  const [reclaimed, setReclaimed] = useState(0);     // running ₹ reclaimed
  const [chatOpen, setChatOpen] = useState(false);
  const [samples, setSamples] = useState([]);
  const [persona, setPersona] = useState("professional");
  const [scanning, setScanning] = useState(false);
  const [toasts, setToasts] = useState([]);

  function toast(msg, kind = "info") {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400);
  }
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("zombii-theme") || "dark"; } catch { return "dark"; }
  });
  const [settings, setSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem("zombii-settings")) || { alertThreshold: 60, notify: true, bankConnected: false }; }
    catch { return { alertThreshold: 60, notify: true, bankConnected: false }; }
  });
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("zombii-history")) || []; } catch { return []; }
  });

  function updateSettings(patch) {
    setSettings((s) => {
      const next = { ...s, ...patch };
      try { localStorage.setItem("zombii-settings", JSON.stringify(next)); } catch {}
      return next;
    });
  }

  useEffect(() => {
    fetchDemo("professional").then(setData).catch((e) => setError(e.message));
    fetchSamples().then(setSamples);
  }, []);

  async function loadSample(id) {
    setError(null); setData(null); setCancelled([]); setReclaimed(0); setPersona(id);
    try { setData(await fetchDemo(id)); }
    catch (e) { setError(e.message); }
  }

  useEffect(() => {
    document.body.classList.toggle("light", theme === "light");
    try { localStorage.setItem("zombii-theme", theme); } catch {}
  }, [theme]);

  // record every analysis to a rolling history (monitoring over time)
  useEffect(() => {
    if (!data) return;
    setHistory((h) => {
      const entry = { at: Date.now(), leak: data.summary.totalLeak, score: data.summary.overallScore, count: data.summary.count, persona: data.profile.persona || "custom" };
      const next = [...h, entry].slice(-12);
      try { localStorage.setItem("zombii-history", JSON.stringify(next)); } catch {}
      return next;
    });
  }, [data]);

  async function analyzeFile(file) {
    if (!file) return;
    setError(null); setData(null); setCancelled([]); setReclaimed(0); setPersona("custom"); setScanning(true);
    try { const d = await analyzeCSV(file); setData(d); toast(`✓ Analysed ${d.summary.scannedTxns} transactions · ${d.summary.count} subscriptions found`, "good"); }
    catch (e) { setError(e.message); toast("⚠ " + e.message, "bad"); }
    finally { setScanning(false); }
  }

  async function importText(text, source) {
    if (!text?.trim()) return;
    setError(null); setData(null); setCancelled([]); setReclaimed(0); setPersona("custom"); setScanning(true);
    try { const d = await analyzeText(text, source); setData(d); toast(`✓ AI parsed ${d.parsedCount ?? d.summary.scannedTxns} transactions from your ${source}`, "good"); }
    catch (e) { setError(e.message); toast("⚠ " + e.message, "bad"); }
    finally { setScanning(false); }
  }

  function killSub(sub) {
    if (cancelled.includes(sub.name)) return;
    setCancelled((c) => [...c, sub.name]);
    setReclaimed((r) => r + (sub.save || 0));
    fireConfetti();
    toast(`🧟 Killed ${sub.name} — ₹${(sub.save || 0).toLocaleString("en-IN")}/yr reclaimed!`, "good");
  }

  function killAllZombies() {
    if (!data) return;
    const zombies = data.subscriptions.filter((s) => s.type === "zombie" && !cancelled.includes(s.name));
    if (!zombies.length) { toast("No live zombies left to kill 🎉", "good"); return; }
    const sum = zombies.reduce((a, s) => a + (s.save || 0), 0);
    setCancelled((c) => [...c, ...zombies.map((s) => s.name)]);
    setReclaimed((r) => r + sum);
    fireConfetti();
    toast(`💥 Killed ${zombies.length} zombies — ₹${sum.toLocaleString("en-IN")}/yr reclaimed!`, "good");
  }

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <Ctx.Provider value={{
      data, error, analyzeFile, theme, toggleTheme,
      drawerSub, setDrawerSub, cancelled, reclaimed, killSub, killAllZombies,
      chatOpen, setChatOpen,
      samples, persona, loadSample,
      scanning, importText,
      toasts, toast,
      settings, updateSettings, history,
    }}>
      {children}
    </Ctx.Provider>
  );
}
