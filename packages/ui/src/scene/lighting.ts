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
}

/**
 * Sunrise and sunset get different palettes on purpose. Morning is fresh and pastel (blue, pink, gold) with
 * a small sun rising on the left. Evening is deep and fiery (indigo, magenta, orange), already dark enough to
 * lead into the night, with a big red sun setting on the right and the first stars.
 */
const TABLE: Record<PeriodId, Omit<Lighting, "period" | "lit">> = {
  morning: { skyTop: "#9ED0F5", skyMid: "#FFC6D0", skyBottom: "#FFE7B0", windowSky: "#FFD9C2", tint: "#FFC9B0", tintOpacity: 0.1, sun: { x: 62, y: 330, color: "#FFD36B", glow: "#FFF1B8", r: 30 }, starsOpacity: 0 },
  noon: { skyTop: "#8ED0FF", skyBottom: "#E6FAF6", windowSky: "#BFE3FF", tint: "#FFFFFF", tintOpacity: 0, sun: { x: 195, y: 90, color: "#FFE066", glow: "#FFF6B0", r: 30 }, starsOpacity: 0 },
  evening: { skyTop: "#2B2A6E", skyMid: "#B0457A", skyBottom: "#FF7A3D", windowSky: "#D9603A", tint: "#3A1B5E", tintOpacity: 0.38, sun: { x: 332, y: 340, color: "#FF5E2E", glow: "#FF8A4D", r: 40 }, starsOpacity: 0.4 },
  night: { skyTop: "#0A0E3A", skyBottom: "#252B70", windowSky: "#1B2160", tint: "#0A0E3A", tintOpacity: 0.5, moon: { x: 90, y: 140 }, starsOpacity: 1 },
};

export function lightingFor(period: PeriodId): Lighting {
  return { period, lit: getPeriod(period).artificialLight, ...TABLE[period] };
}
