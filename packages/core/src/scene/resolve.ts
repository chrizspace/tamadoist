import { MINUTES_PER_DAY, minutesOfDay, parseTime } from "../shared/time";
import { isSleeping } from "../character/sleep";
import { DEFAULT_LOCATION, getLocation, type GroupId, type LocationId } from "./locations";
import { periodAt, type Period } from "./periods";

export interface ScheduleSlot {
  id: string;
  label: string;
  /** "HH:MM"; end earlier than start means the slot runs past midnight. */
  start: string;
  end: string;
  location: LocationId;
  /** 0 = Sunday ... 6 = Saturday. Every day when omitted. */
  days?: number[];
}

export interface Place {
  id: string;
  group: GroupId;
  name: string;
  lat: number;
  lng: number;
  radiusM: number;
  /** Which scene to show while you are here. */
  location: LocationId;
}

export interface GeoPoint { lat: number; lng: number }

export interface SceneInput {
  now: Date;
  schedule: ScheduleSlot[];
  places: Place[];
  /** Last known position; the app never needs it to be live. */
  position?: GeoPoint;
  /** A location the user picked by hand. It holds until `until`, or until cleared. */
  manual?: { location: LocationId; until?: Date };
  /** When given, the pet goes to bed (home.bedroom) inside the sleep window. */
  sleepStart?: string;
}

export type SceneSource = "manual" | "sleep" | "schedule" | "place" | "default";

export interface SceneResult {
  location: LocationId;
  group: GroupId;
  label: string;
  period: Period;
  source: SceneSource;
}

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

function result(location: LocationId, source: SceneSource, now: Date): SceneResult {
  const loc = getLocation(location);
  return { location, group: loc.group, label: loc.label, period: periodAt(now), source };
}

/**
 * Which location to show. Priority: manual pick, bedtime (the pet sleeps in the
 * bedroom), the daily schedule (the shortest matching slot wins, so lunch beats
 * the workday), the place you are standing in, then the default park.
 * The time of day is independent: it only changes the light.
 */
export function resolveScene({ now, schedule, places, position, manual, sleepStart }: SceneInput): SceneResult {
  if (manual && (!manual.until || now < manual.until)) return result(manual.location, "manual", now);

  if (sleepStart && isSleeping(now, sleepStart)) return result("home.bedroom", "sleep", now);

  const active = schedule.filter((s) => slotActive(s, now)).sort((a, b) => slotLength(a) - slotLength(b));
  if (active[0]) return result(active[0].location, "schedule", now);

  if (position) {
    const inside = places
      .map((p) => ({ p, d: distanceMeters(position, p) }))
      .filter(({ p, d }) => d <= p.radiusM)
      .sort((a, b) => a.d - b.d);
    if (inside[0]) return result(inside[0].p.location, "place", now);
  }

  return result(DEFAULT_LOCATION, "default", now);
}
