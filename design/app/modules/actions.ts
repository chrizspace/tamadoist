import { useCallback, useEffect, useRef, useState } from "react";
import { GLASS_ML, applyWater } from "@tamadoist/core";

/** Module 3: actions. Only water for now; each new action gets its own hook next to this one. */
export function useActions() {
  const [drunkMl, setDrunk] = useState(0);
  const [justDrank, setJustDrank] = useState(false);
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const add = useCallback(() => {
    setDrunk((v) => applyWater(v, GLASS_ML));
    setJustDrank(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setJustDrank(false), 1400);
  }, []);
  const remove = useCallback(() => setDrunk((v) => applyWater(v, -GLASS_ML)), []);
  return { drunkMl, justDrank, add, remove, reset: () => setDrunk(0) };
}
export type ActionsModule = ReturnType<typeof useActions>;
