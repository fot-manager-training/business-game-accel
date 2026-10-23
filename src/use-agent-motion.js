import { useEffect, useRef, useState } from "react";

// A separate visual clock keeps movement smooth without changing the economy.
// Pausing preserves the exact position and resuming continues from that point.
export function useAgentMotion(status) {
  const elapsed = useRef(0);
  const [frame, setFrame] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReducedMotion(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    if (status !== "running" || reducedMotion) return;
    let previous = Date.now();
    const timer = setInterval(() => {
      const now = Date.now();
      elapsed.current += Math.min(now - previous, 250);
      previous = now;
      setFrame(elapsed.current);
    }, 100);
    return () => clearInterval(timer);
  }, [status, reducedMotion]);
  return { elapsed: frame, reducedMotion };
}
