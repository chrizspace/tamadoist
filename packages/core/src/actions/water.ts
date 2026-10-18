export const GLASS_ML = 250;

/** Add or remove water; the total never goes below zero. Default step is one glass. */
export function applyWater(drunkMl: number, deltaMl: number = GLASS_ML): number {
  return Math.max(0, drunkMl + deltaMl);
}
