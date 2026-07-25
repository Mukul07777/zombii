import { useRef } from "react";
import { useStore } from "../store";
import { downloadLeakCard } from "../shareCard";

export default function Topbar({ k, title, share }) {
  const { data, analyzeFile } = useStore();
  const fileRef = useRef();
  const profile = data?.profile || { name: "You" };

  return (
    <div className="topbar">
      <input ref={fileRef} type="file" accept=".csv" hidden onChange={(e) => analyzeFile(e.target.files[0])} />
      <div className="greet">
        <div className="k">{k}</div>
        <h1>{title}</h1>
      </div>
      <div className="actions">
        {share && data && (
          <button className="btn btn-out btn-sm" onClick={() => downloadLeakCard(data.summary, profile.name)}>📸 Share card</button>
        )}
        <button className="btn btn-grad btn-sm" onClick={() => fileRef.current.click()}>⬆ Scan statement</button>
        <div className="userchip">
          <div className="av">{profile.name[0]}</div>
          <div><div className="un">{profile.name}</div><div className="ur">Member</div></div>
        </div>
      </div>
    </div>
  );
}
