export const ML_PER_KG = 35;
export const MIN_GOAL_ML = 1500;
export const MAX_GOAL_ML = 4000;
export const GLASS_ML = 250;

/**
 * Daily water goal from body weight: the common 30-35 ml/kg rule of thumb
 * (we use 35), rounded to 50 ml and clamped to a sensible range.
 * A practical estimate, not a clinical recommendation.
 */
export function waterGoalMl(weightKg: number): number {
  if (!Number.isFinite(weightKg) || weightKg <= 0) return MIN_GOAL_ML;
  const rounded = Math.round((weightKg * ML_PER_KG) / 50) * 50;
  return Math.min(MAX_GOAL_ML, Math.max(MIN_GOAL_ML, rounded));
}
