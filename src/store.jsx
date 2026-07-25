import { createContext, useContext, useEffect, useState } from "react";
import { fetchDemo, analyzeCSV } from "./api";

const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);

export function StoreProvider({ children }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [drawerSub, setDrawerSub] = useState(null);
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("zombii-theme") || "light"; } catch { return "light"; }
  });

  useEffect(() => {
    fetchDemo().then(setData).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
    try { localStorage.setItem("zombii-theme", theme); } catch {}
  }, [theme]);

  async function analyzeFile(file) {
    if (!file) return;
    setError(null); setData(null);
    try { setData(await analyzeCSV(file)); }
    catch (e) { setError(e.message); }
  }

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <Ctx.Provider value={{ data, error, analyzeFile, theme, toggleTheme, drawerSub, setDrawerSub }}>
      {children}
    </Ctx.Provider>
  );
}
