import { useStore } from "../store";

// Little Zombii character that reacts to how bad the leak is / how much you've reclaimed.
export default function Mascot() {
  const { data, reclaimed, cancelled } = useStore();
  if (!data) return null;
  const score = data.summary.overallScore;

  let face = "🧟", mood = "on the hunt…", cls = "ok";
  if (reclaimed > 0) { face = "🧟‍♂️"; mood = `${cancelled.length} killed! 🎉`; cls = "happy"; }
  else if (score > 70) { face = "🧟"; mood = "big leaks detected!"; cls = "alarm"; }
  else if (score > 45) { face = "🧟"; mood = "a few zombies about…"; cls = "warn"; }
  else { face = "🧟"; mood = "looking clean!"; cls = "happy"; }

  return (
    <div className={`mascot ${cls}`}>
      <div className="mascot-face">{face}</div>
      <div className="mascot-txt">
        <b>Zombii</b>
        <small>{mood}</small>
      </div>
    </div>
  );
}
