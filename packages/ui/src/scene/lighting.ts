import { getPeriod, type PeriodId } from "@tamadoist/core";

export interface Lighting {
  period: PeriodId;
  /** Outdoor sky, top to bottom. */
  skyTop: string;
  skyMid?: string;
  skyBottom: string;
  /** What you see through a window. */
  windowSky: string;
  /** Overlay that darkens or warms everything in the scene. */
  tint: string;
  tintOpacity: number;
  /** Lamps and ceiling lights are on: scenes draw glows. */
  lit: boolean;
  sun?: { x: number; y: number; color: string; glow: string; r: number };
  moon?: { x: number; y: number };
  /** 0 = no stars, 1 = full night sky. */
  starsOpacity: number;
  /** 0 = clear sky. */
  cloudOpacity: number;
}

/**
 * Four looks. Morning is fresh and pastel (blue, pink, gold) with a small sun rising on the left. Noon is a
 * clear, vivid blue sky without clouds. Evening is a medium blue dusk that is not dark yet but already leans
 * toward night. Night is near black navy with stars and a moon.
 */
const TABLE: Record<PeriodId, Omit<Lighting, "period" | "lit">> = {
  morning: { skyTop: "#9ED0F5", skyMid: "#FFC6D0", skyBottom: "#FFE7B0", windowSky: "#FFD9C2", tint: "#FFC9B0", tintOpacity: 0.1, sun: { x: 62, y: 330, color: "#FFD36B", glow: "#FFF1B8", r: 30 }, starsOpacity: 0, cloudOpacity: 0.8 },
  noon: { skyTop: "#3FA2FF", skyBottom: "#BFE6FF", windowSky: "#9DD3FF", tint: "#FFFFFF", tintOpacity: 0, sun: { x: 195, y: 90, color: "#FFE066", glow: "#FFF6B0", r: 30 }, starsOpacity: 0, cloudOpacity: 0 },
  evening: { skyTop: "#27408B", skyBottom: "#7FA3DE", windowSky: "#5C82CC", tint: "#2B45B0", tintOpacity: 0.3, starsOpacity: 0.25, cloudOpacity: 0.3 },
  night: { skyTop: "#02030C", skyBottom: "#0A1130", windowSky: "#0B1235", tint: "#050A26", tintOpacity: 0.72, moon: { x: 90, y: 140 }, starsOpacity: 1, cloudOpacity: 0.12 },
};

export function lightingFor(period: PeriodId): Lighting {
  return { period, lit: getPeriod(period).artificialLight, ...TABLE[period] };
}
