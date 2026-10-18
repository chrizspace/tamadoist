import type { ActionDef } from "./types";

export const GLASS_ML = 250;

export const WATER_ACTION: ActionDef = {
  id: "water",
  label: "Woda",
  icon: "drop",
  screen: "water",
  blockedWhenSleeping: true,
  highlightedWhenTired: true,
};

/** Add or remove water; the total never goes below zero. Default step is one glass. */
export function applyWater(drunkMl: number, deltaMl: number = GLASS_ML): number {
  return Math.max(0, drunkMl + deltaMl);
}
