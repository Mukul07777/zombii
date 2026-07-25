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
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("zombii-theme") || "dark"; } catch { return "dark"; }
  });

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

  async function analyzeFile(file) {
    if (!file) return;
    setError(null); setData(null); setCancelled([]); setReclaimed(0); setPersona("custom"); setScanning(true);
    try { setData(await analyzeCSV(file)); }
    catch (e) { setError(e.message); }
    finally { setScanning(false); }
  }

  async function importText(text, source) {
    if (!text?.trim()) return;
    setError(null); setData(null); setCancelled([]); setReclaimed(0); setPersona("custom"); setScanning(true);
    try { setData(await analyzeText(text, source)); }
    catch (e) { setError(e.message); }
    finally { setScanning(false); }
  }

  function killSub(sub) {
    if (cancelled.includes(sub.name)) return;
    setCancelled((c) => [...c, sub.name]);
    setReclaimed((r) => r + (sub.save || 0));
    fireConfetti();
  }

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <Ctx.Provider value={{
      data, error, analyzeFile, theme, toggleTheme,
      drawerSub, setDrawerSub, cancelled, reclaimed, killSub,
      chatOpen, setChatOpen,
      samples, persona, loadSample,
      scanning, importText,
    }}>
      {children}
    </Ctx.Provider>
  );
}
