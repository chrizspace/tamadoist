import { useCallback, useEffect, useRef, useState } from "react";
import { GLASS_ML, applyMeal, applyWater } from "@tamadoist/core";

/** Module 3: actions. Nutrition (water and meals) for now; sleep lives in the character profile. */
export function useActions() {
  const [drunkMl, setDrunk] = useState(0);
  const [meals, setMeals] = useState(0);
  const [justDrank, setJustDrank] = useState(false);
  const [justAte, setJustAte] = useState(false);
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const add = useCallback(() => {
    setDrunk((v) => applyWater(v, GLASS_ML));
    setJustDrank(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setJustDrank(false), 1400);
  }, []);
  const eatTimer = useRef<number>();
  useEffect(() => () => window.clearTimeout(eatTimer.current), []);
  const eat = useCallback(() => {
    setMeals((v) => applyMeal(v, 1));
    setJustAte(true);
    window.clearTimeout(eatTimer.current);
    eatTimer.current = window.setTimeout(() => setJustAte(false), 1400);
  }, []);
  const remove = useCallback(() => setDrunk((v) => applyWater(v, -GLASS_ML)), []);
  return { drunkMl, justDrank, meals, justAte, add, remove, eat, reset: () => { setDrunk(0); setMeals(0); } };
}
export type ActionsModule = ReturnType<typeof useActions>;
