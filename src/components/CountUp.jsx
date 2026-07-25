import { useEffect, useRef, useState } from "react";

export default function CountUp({ value, prefix = "", dur = 1400 }) {
  const [n, setN] = useState(0);
  const ref = useRef();
  useEffect(() => {
    let t0;
    cancelAnimationFrame(ref.current);
    const step = (t) => {
      if (!t0) t0 = t;
      const p = Math.min((t - t0) / dur, 1);
      setN(Math.floor((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) ref.current = requestAnimationFrame(step);
    };
    ref.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(ref.current);
  }, [value, dur]);
  return <>{prefix}{n.toLocaleString("en-IN")}</>;
}
