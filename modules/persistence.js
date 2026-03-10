import { useState, useEffect } from "react";

// ── PERSISTENCE ───────────────────────────────────────────────────────────────
export function usePersist(key, init) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; } catch { return init; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }, [val, key]);
  return [val, setVal];
}
