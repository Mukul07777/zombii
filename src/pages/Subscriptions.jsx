import { useState } from "react";
import { useStore } from "../store";
import Topbar from "../components/Topbar";
import SubCard from "../components/SubCard";

export default function Subscriptions() {
  const { data, setDrawerSub, killAllZombies, cancelled } = useStore();
  const { subscriptions } = data;
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("leak");
  const liveZombies = subscriptions.filter((s) => s.type === "zombie" && !cancelled.includes(s.name)).length;

  let list = [...subscriptions];
  if (filter === "high") list = list.filter((s) => s.score >= 60);
  if (filter === "zombie") list = list.filter((s) => s.type === "zombie");
  if (filter === "hike") list = list.filter((s) => s.type === "hike");
  list.sort((a, b) => (sort === "price" ? b.price - a.price : sort === "save" ? b.save - a.save : b.score - a.score));

  return (
    <>
      <Topbar k="Take action" title="Your subscriptions" />

      {!subscriptions.length ? (
        <div className="empty">
          <div className="empty-ic">🧟</div>
          <h3>No recurring subscriptions detected</h3>
          <p>Zombii didn't find repeating charges in this statement. Try a sample persona or upload a statement with a few months of history.</p>
        </div>
      ) : (
        <>
        {liveZombies > 0 && (
          <div className="killall">
            <div><b>{liveZombies} zombie{liveZombies > 1 ? "s" : ""} draining you right now</b><small>Cancel them all in one tap and reclaim the money</small></div>
            <button className="btn btn-grad" onClick={killAllZombies}>💥 Kill all zombies</button>
          </div>
        )}
      <div className="subhead">
        <div className="filters">
          {[["all", "All"], ["high", "🔴 High leak"], ["zombie", "🧟 Zombie"], ["hike", "📈 Hikes"]].map(([k, l]) => (
            <div key={k} className={`chip ${filter === k ? "active" : ""}`} onClick={() => setFilter(k)}>{l}</div>
          ))}
        </div>
        <div className="filters">
          {[["leak", "Sort: Leak"], ["price", "Sort: Price"], ["save", "Sort: Savings"]].map(([k, l]) => (
            <div key={k} className={`chip ${sort === k ? "active" : ""}`} onClick={() => setSort(k)}>{l}</div>
          ))}
        </div>
      </div>

      <div className="cards">
        {list.map((s, i) => <SubCard key={s.name} s={s} index={i} onOpen={() => setDrawerSub(s)} />)}
      </div>
      {!list.length && <div className="err" style={{ marginTop: 20 }}>No subscriptions match this filter.</div>}
        </>
      )}
    </>
  );
}
