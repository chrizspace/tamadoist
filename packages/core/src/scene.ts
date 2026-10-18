import { MINUTES_PER_DAY, minutesOfDay, parseTime } from "./time";

export type SceneId = "meadow" | "home" | "office" | "lunch";

export interface ScheduleSlot {
  id: string;
  label: string;
  /** "HH:MM"; end earlier than start means the slot runs past midnight. */
  start: string;
  end: string;
  scene: SceneId;
  /** 0 = Sunday ... 6 = Saturday. Every day when omitted. */
  days?: number[];
}

export type PlaceKind = "home" | "work" | "other";

export interface Place {
  id: string;
  kind: PlaceKind;
  name: string;
  lat: number;
  lng: number;
  radiusM: number;
  scene: SceneId;
}

export interface GeoPoint { lat: number; lng: number }

export interface SceneInput {
  now: Date;
  schedule: ScheduleSlot[];
  places: Place[];
  /** Last known position; the app never needs it to be live. */
  position?: GeoPoint;
  /** A scene the user picked by hand. It holds until `until`, or until cleared. */
  manual?: { scene: SceneId; until?: Date };
}

export type SceneSource = "manual" | "schedule" | "place" | "default";

export interface SceneResult {
  scene: SceneId;
  source: SceneSource;
  /** Name shown in the header, e.g. "Biuro" or the place name. */
  label: string;
}

export const SCENE_LABELS: Record<SceneId, string> = {
  meadow: "Zielona Łąka",
  home: "Dom",
  office: "Biuro",
  lunch: "Lunch",
};

const EARTH_RADIUS_M = 6_371_000;

/** Haversine distance in meters. */
export function distanceMeters(a: GeoPoint, b: GeoPoint): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

function slotLength(slot: ScheduleSlot): number {
  const len = (parseTime(slot.end) - parseTime(slot.start) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  return len === 0 ? MINUTES_PER_DAY : len;
}

export function slotActive(slot: ScheduleSlot, now: Date): boolean {
  const nowMin = minutesOfDay(now);
  const start = parseTime(slot.start);
  const since = (nowMin - start + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  if (since >= slotLength(slot)) return false;
  if (!slot.days) return true;
  // For a slot that began before midnight, the weekday is the one it started on.
  const startedYesterday = nowMin < start;
  const day = (now.getDay() - (startedYesterday ? 1 : 0) + 7) % 7;
  return slot.days.includes(day);
}

/**
 * Which scene to show. Priority: manual pick, then the daily schedule
 * (the shortest matching slot wins, so lunch beats the workday), then the
 * place you are standing in, then the default meadow.
 */
export function resolveScene({ now, schedule, places, position, manual }: SceneInput): SceneResult {
  if (manual && (!manual.until || now < manual.until)) {
    return { scene: manual.scene, source: "manual", label: SCENE_LABELS[manual.scene] };
  }

  const active = schedule.filter((s) => slotActive(s, now)).sort((a, b) => slotLength(a) - slotLength(b));
  if (active[0]) return { scene: active[0].scene, source: "schedule", label: active[0].label };

  if (position) {
    const inside = places
      .map((p) => ({ p, d: distanceMeters(position, p) }))
      .filter(({ p, d }) => d <= p.radiusM)
      .sort((a, b) => a.d - b.d);
    if (inside[0]) return { scene: inside[0].p.scene, source: "place", label: inside[0].p.name };
  }

  return { scene: "meadow", source: "default", label: SCENE_LABELS.meadow };
}
