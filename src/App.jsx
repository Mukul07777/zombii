import { Routes, Route } from "react-router-dom";
import AppShell from "./components/AppShell";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Subscriptions from "./pages/Subscriptions";
import Insights from "./pages/Insights";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/app" element={<AppShell />}>
        <Route index element={<Dashboard />} />
        <Route path="subscriptions" element={<Subscriptions />} />
        <Route path="insights" element={<Insights />} />
      </Route>
    </Routes>
  );
}
