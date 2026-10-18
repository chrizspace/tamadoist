import { MINUTES_PER_DAY, minutesOfDay } from "../shared/time";
import { DEFAULT_SUN, type SunTimes } from "./sun";

export type PeriodId = "morning" | "noon" | "evening" | "night";

export interface Period {
  id: PeriodId;
  label: string;
  /** 0 = dark, 1 = full daylight. Drives window light and outdoor sky. */
  daylight: number;
  /** Lamps and ceiling lights switch on. */
  artificialLight: boolean;
}

/** What each time of day looks like. When it happens is derived from the sun, see periodWindows. */
export const PERIODS: readonly Period[] = [
  { id: "morning", label: "Rano", daylight: 0.65, artificialLight: false },
  { id: "noon", label: "Południe", daylight: 1, artificialLight: false },
  { id: "evening", label: "Wieczór", daylight: 0.3, artificialLight: true },
  { id: "night", label: "Noc", daylight: 0, artificialLight: true },
];

export function getPeriod(id: PeriodId): Period {
  return PERIODS.find((p) => p.id === id)!;
}

export interface PeriodWindow {
  id: PeriodId;
  /** Minutes after local midnight; `end` may exceed 1440 when the window runs past midnight. */
  start: number;
  end: number;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Boundaries, in minutes, relative to local midnight. The night window comes last and wraps. */
interface Bounds { morningStart: number; morningEnd: number; noonEnd: number; eveningEnd: number }

function boundsFor(sun: SunTimes): Bounds {
  // Polar day or night: there is no sunrise to follow, so fall back to a clock around solar noon.
  const s = sun.polar ? { ...DEFAULT_SUN, sunrise: sun.solarNoon - 360, sunset: sun.solarNoon + 360, dayLengthMinutes: 720 } : sun;
  const len = s.dayLengthMinutes;
  const morningStart = s.sunrise - 30; // first light
  const morningEnd = s.sunrise + clamp(len * 0.25, 90, 180);
  const noonEnd = Math.max(morningEnd, s.sunset - clamp(len * 0.2, 60, 150));
  const eveningEnd = Math.max(noonEnd, s.sunset + 45); // end of dusk
  return { morningStart, morningEnd, noonEnd, eveningEnd };
}

/** The four windows of a day, in order: morning, noon, evening, night. */
export function periodWindows(sun: SunTimes = DEFAULT_SUN): PeriodWindow[] {
  const b = boundsFor(sun);
  return [
    { id: "morning", start: b.morningStart, end: b.morningEnd },
    { id: "noon", start: b.morningEnd, end: b.noonEnd },
    { id: "evening", start: b.noonEnd, end: b.eveningEnd },
    { id: "night", start: b.eveningEnd, end: b.morningStart + MINUTES_PER_DAY },
  ];
}

/** Morning starts at first light (30 min before sunrise) and lasts a quarter of the daylight (1.5–3 h);
 *  evening starts 1–2.5 h before sunset and ends 45 min after it; the rest of the day is noon or night. */
export function periodAtMinutes(minutes: number, sun: SunTimes = DEFAULT_SUN): Period {
  const b = boundsFor(sun);
  const t = (((minutes - b.morningStart) % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const id: PeriodId = t < b.morningEnd - b.morningStart ? "morning" : t < b.noonEnd - b.morningStart ? "noon" : t < b.eveningEnd - b.morningStart ? "evening" : "night";
  return getPeriod(id);
}

export function periodAt(now: Date, sun: SunTimes = DEFAULT_SUN): Period {
  return periodAtMinutes(minutesOfDay(now), sun);
}
