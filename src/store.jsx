import { createContext, useContext, useEffect, useState } from "react";
import { fetchDemo, analyzeCSV } from "./api";
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
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("zombii-theme") || "dark"; } catch { return "dark"; }
  });

  useEffect(() => {
    fetchDemo().then(setData).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    document.body.classList.toggle("light", theme === "light");
    try { localStorage.setItem("zombii-theme", theme); } catch {}
  }, [theme]);

  async function analyzeFile(file) {
    if (!file) return;
    setError(null); setData(null); setCancelled([]); setReclaimed(0);
    try { setData(await analyzeCSV(file)); }
    catch (e) { setError(e.message); }
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
    }}>
      {children}
    </Ctx.Provider>
  );
}
