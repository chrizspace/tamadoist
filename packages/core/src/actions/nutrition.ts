import type { ActionDef } from "./types";

/**
 * The icon is "recharge" (a battery with a bolt): eating, drinking and sleeping all renew energy.
 * Nutrition is one action that groups what keeps the character going: drinking, eating and sleeping.
 * You can drink and eat in the evening and at night too, so it stays available during sleep.
 */
export const NUTRITION_ACTION: ActionDef = {
  id: "nutrition",
  label: "Odżywianie",
  icon: "recharge",
  screen: "nutrition",
  blockedWhenSleeping: false,
  highlightedWhenTired: true,
};

/** Meals counted per day (breakfast, lunch, dinner, a snack). */
export const MEALS_GOAL = 4;

/** Add or remove a meal; the count stays between 0 and 12. */
export function applyMeal(meals: number, delta: number = 1): number {
  return Math.min(12, Math.max(0, meals + delta));
}
