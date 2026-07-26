import { useStore } from "../store";

export default function Toasts() {
  const { toasts } = useStore();
  if (!toasts?.length) return null;
  return (
    <div className="toasts">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.kind}`}>{t.msg}</div>
      ))}
    </div>
  );
}
