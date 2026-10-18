import {
  calendarDateOf, computeEnergy, derivePetState, getLocation, resolveScene, sleepWindow, sunTimes, zoneOffsetMinutes,
  type CalendarDate, type PetState, type SunTimes,
} from "@tamadoist/core";
import type { ActionsModule } from "./modules/actions";
import type { CharacterModule } from "./modules/character";
import type { SceneModule } from "./modules/scene";

export interface City { id: string; label: string; lat: number; lng: number; tz: string }

/** Where the user lives decides when the sun rises. The app gets this from the device location. */
export const CITIES: City[] = [
  { id: "warsaw", label: "Warszawa", lat: 52.2297, lng: 21.0122, tz: "Europe/Warsaw" },
  { id: "reykjavik", label: "Reykjavik", lat: 64.1466, lng: -21.9426, tz: "Atlantic/Reykjavik" },
  { id: "singapore", label: "Singapur", lat: 1.3521, lng: 103.8198, tz: "Asia/Singapore" },
  { id: "sydney", label: "Sydney", lat: -33.8688, lng: 151.2093, tz: "Australia/Sydney" },
  { id: "tromso", label: "Tromsø", lat: 69.6492, lng: 18.9553, tz: "Europe/Oslo" },
];

/** All Wednesdays, so the weekday schedule applies. */
export const SEASONS: { id: string; label: string; date: CalendarDate }[] = [
  { id: "winter", label: "Zima (17 gru)", date: { year: 2025, month: 12, day: 17 } },
  { id: "spring", label: "Wiosna (18 mar)", date: { year: 2026, month: 3, day: 18 } },
  { id: "summer", label: "Lato (17 cze)", date: { year: 2026, month: 6, day: 17 } },
  { id: "autumn", label: "Jesień (16 wrz)", date: { year: 2026, month: 9, day: 16 } },
];

export interface Env { city: City; date: CalendarDate }
export const DEFAULT_ENV: Env = { city: CITIES[0]!, date: { year: 2026, month: 1, day: 14 } };

export function sunFor(env: Env): SunTimes {
  return sunTimes(env.date, env.city, zoneOffsetMinutes(env.city.tz, env.date));
}

export const dateAt = (minutes: number, date: CalendarDate = DEFAULT_ENV.date) =>
  new Date(date.year, date.month - 1, date.day, Math.floor(minutes / 60), minutes % 60);

export const fmt = (minutes: number) => {
  const m = Math.round(((minutes % 1440) + 1440) % 1440);
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};

export const isoDate = (d: CalendarDate) => `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
export const parseIso = (s: string): CalendarDate => { const [year, month, day] = s.split("-").map(Number); return { year: year!, month: month!, day: day! }; };
export { calendarDateOf };

/** Everything the screens need, derived from the three modules, the clock and where/when we are. */
export function deriveWorld(ch: CharacterModule, sc: SceneModule, ac: ActionsModule, minutes: number, forced: PetState | undefined, env: Env = DEFAULT_ENV) {
  const now = dateAt(minutes, env.date);
  const sun = sunFor(env);
  const energy = computeEnergy({ now, sleepStart: ch.profile.sleepStart, drunkMl: ac.drunkMl, goalMl: ch.goalMl });
  const scene = resolveScene({
    now,
    schedule: sc.schedule,
    places: sc.places,
    position: sc.position,
    manual: sc.manual ? { location: sc.manual } : undefined,
    sleepStart: ch.profile.sleepStart,
    sun,
  });
  const celebrating = scene.location.endsWith(".kitchen");
  const petState = forced ?? derivePetState({ energy, justDrank: ac.justDrank, celebrating });
  return {
    now,
    sun,
    energy,
    scene,
    petState,
    locationLabel: getLocation(scene.location).label,
    sleepEnd: sleepWindow(ch.profile.sleepStart).end,
    name: ch.profile.name || "Tama",
  };
}
export type World = ReturnType<typeof deriveWorld>;
