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
  /** 0 = dark, 1 = full daylight (drives light shafts through windows). */
  daylight: number;
}

/**
 * Four looks. Morning is a soft, light orange sunrise with a small golden sun on the left. Noon is a clear,
 * vivid blue sky without clouds. Evening is a purple-blue dusk, not very dark but already leaning toward night.
 * Night is deep dark blue with plenty of stars and a moon.
 */
const TABLE: Record<PeriodId, Omit<Lighting, "period" | "lit" | "daylight">> = {
  morning: { skyTop: "#FFBE82", skyMid: "#FFD3A3", skyBottom: "#FFEACB", windowSky: "#FFD3A3", tint: "#FFB070", tintOpacity: 0.12, sun: { x: 62, y: 330, color: "#FFC857", glow: "#FFE2A0", r: 30 }, starsOpacity: 0, cloudOpacity: 0.7 },
  noon: { skyTop: "#3FA2FF", skyBottom: "#BFE6FF", windowSky: "#9DD3FF", tint: "#FFFFFF", tintOpacity: 0, sun: { x: 195, y: 90, color: "#FFE066", glow: "#FFF6B0", r: 30 }, starsOpacity: 0, cloudOpacity: 0 },
  evening: { skyTop: "#2E3C9E", skyMid: "#5C4DB3", skyBottom: "#9279CF", windowSky: "#6A5CC4", tint: "#38288C", tintOpacity: 0.3, starsOpacity: 0.35, cloudOpacity: 0.3 },
  night: { skyTop: "#060C36", skyBottom: "#13236A", windowSky: "#0E1A5A", tint: "#050C36", tintOpacity: 0.55, moon: { x: 90, y: 140 }, starsOpacity: 1, cloudOpacity: 0.14 },
};

export function lightingFor(period: PeriodId): Lighting {
  const base = getPeriod(period);
  return { period, lit: base.artificialLight, daylight: base.daylight, ...TABLE[period] };
}
