import type { LocationId } from "@tamadoist/core";
import type { PetState } from "./Pet";

/**
 * Where the character stands in each scene and what it does there.
 * Pure data (no React, no animation library), so the same table can drive Framer Motion on web
 * and Reanimated/Moti in the Expo app.
 *
 * `x`/`y`/`scale` place the character relative to the default stage spot (scaling happens around the feet,
 * positive y moves down). `idle` names a loop from IDLES.
 */
export interface Placement { x: number; y: number; scale: number }

export type IdleId = "breathe" | "type" | "stir" | "sip" | "walk" | "float" | "squat" | "ride" | "droop" | "hop";

export const PLACEMENTS: Record<LocationId, Placement & { idle: IdleId }> = {
  "home.bedroom": { x: -16, y: 70, scale: 0.86, idle: "breathe" },
  "home.office": { x: -22, y: 78, scale: 0.82, idle: "type" },
  "home.kitchen": { x: -10, y: 58, scale: 0.8, idle: "stir" },
  "work.openspace": { x: 0, y: 78, scale: 0.82, idle: "type" },
  "work.kitchen": { x: -30, y: 66, scale: 0.8, idle: "sip" },
  "recreation.park": { x: 0, y: 52, scale: 0.92, idle: "walk" },
  "recreation.pool": { x: 0, y: 84, scale: 0.8, idle: "float" },
  "recreation.gym": { x: 18, y: 78, scale: 0.82, idle: "squat" },
  "recreation.bike": { x: 0, y: 66, scale: 0.78, idle: "ride" },
};

/** A looping animation: keyframes per property, one duration in seconds. `walk` also moves the whole figure sideways. */
export interface Idle {
  duration: number;
  /** Optional keyframe timing (0..1) so a loop can pause between moves. */
  times?: number[];
  x?: number[];
  y?: number[];
  rotate?: number[];
  scaleX?: number[];
  scaleY?: number[];
  /** Move the name tag together with the figure (only the sideways walk does). */
  travel?: boolean;
}

export const IDLES: Record<IdleId, Idle> = {
  breathe: { duration: 3.6, scaleY: [1, 1.035, 1], scaleX: [1, 0.99, 1] },
  type: { duration: 0.7, y: [0, -3, 0, -2, 0], rotate: [0, 1.2, 0, -1.2, 0] },
  stir: { duration: 2.4, x: [-5, 5, -5], rotate: [-3, 3, -3] },
  sip: { duration: 4.4, times: [0, 0.45, 0.55, 0.8, 1], rotate: [0, 0, -9, 0, 0], y: [0, 0, -3, 0, 0] },
  walk: { duration: 6, x: [-70, 70, -70], y: [0, -7, 0, -7, 0, -7, 0, -7, 0], rotate: [-2.5, 2.5, -2.5], travel: true },
  float: { duration: 3.2, y: [0, -9, 0], rotate: [-2.5, 2.5, -2.5] },
  squat: { duration: 2.2, times: [0, 0.35, 0.5, 0.85, 1], scaleY: [1, 0.86, 0.86, 1.03, 1], scaleX: [1, 1.05, 1.05, 0.98, 1] },
  ride: { duration: 1.1, x: [-8, 8, -8], y: [0, -4, 0, -4, 0], rotate: [-4, 4, -4] },
  droop: { duration: 4, scaleY: [0.96, 0.94, 0.96], rotate: [-1.5, 1.5, -1.5] },
  hop: { duration: 0.8, y: [0, -22, 0], scaleY: [1, 1.05, 0.94, 1] },
};

/** The pet state can override what the scene suggests: asleep and tired characters do not play the scene's loop. */
export function idleFor(location: LocationId, state: PetState): IdleId {
  if (state === "sleeping") return "breathe";
  if (state === "tired") return "droop";
  if (state === "drinking") return "hop";
  return PLACEMENTS[location].idle;
}
