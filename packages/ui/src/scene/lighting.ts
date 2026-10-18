import { getPeriod, type PeriodId } from "@tamadoist/core";

export interface Lighting {
  period: PeriodId;
  /** Outdoor sky, top to bottom. */
  skyTop: string;
  skyBottom: string;
  /** What you see through a window. */
  windowSky: string;
  /** Overlay that darkens or warms everything in the scene. */
  tint: string;
  tintOpacity: number;
  /** Lamps and ceiling lights are on: scenes draw glows. */
  lit: boolean;
  sun?: { x: number; y: number; color: string };
  moon?: { x: number; y: number };
  stars: boolean;
}

const TABLE: Record<PeriodId, Omit<Lighting, "period" | "lit">> = {
  morning: { skyTop: "#FFD9A8", skyBottom: "#E8F7F1", windowSky: "#FFE2B8", tint: "#FFB86B", tintOpacity: 0.1, sun: { x: 62, y: 300, color: "#FFC93C" }, stars: false },
  noon: { skyTop: "#8ED0FF", skyBottom: "#E6FAF6", windowSky: "#BFE3FF", tint: "#FFFFFF", tintOpacity: 0, sun: { x: 195, y: 90, color: "#FFE066" }, stars: false },
  evening: { skyTop: "#5B5FB0", skyBottom: "#F2A36B", windowSky: "#F6B27A", tint: "#6B3A7A", tintOpacity: 0.3, sun: { x: 330, y: 300, color: "#FF9A4D" }, stars: false },
  night: { skyTop: "#0D1240", skyBottom: "#252B70", windowSky: "#1B2160", tint: "#0A0E3A", tintOpacity: 0.5, moon: { x: 90, y: 140 }, stars: true },
};

export function lightingFor(period: PeriodId): Lighting {
  return { period, lit: getPeriod(period).artificialLight, ...TABLE[period] };
}
