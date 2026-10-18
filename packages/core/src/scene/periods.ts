import { MINUTES_PER_DAY, minutesOfDay, parseTime } from "../shared/time";

export type PeriodId = "morning" | "noon" | "afternoon" | "evening" | "lateNight" | "night";

export interface Period {
  id: PeriodId;
  label: string;
  start: string;
  end: string;
  /** 0 = dark, 1 = full daylight. Drives window light and outdoor sky. */
  daylight: number;
  /** Lamps and ceiling lights switch on. */
  artificialLight: boolean;
}

/** Times of day change the light in every scene. Adjust or add periods here. */
export const PERIODS: readonly Period[] = [
  { id: "morning", label: "Poranek", start: "06:00", end: "10:00", daylight: 0.65, artificialLight: false },
  { id: "noon", label: "Południe", start: "10:00", end: "14:00", daylight: 1, artificialLight: false },
  { id: "afternoon", label: "Popołudnie", start: "14:00", end: "18:00", daylight: 0.8, artificialLight: false },
  { id: "evening", label: "Wieczór", start: "18:00", end: "22:00", daylight: 0.3, artificialLight: true },
  { id: "lateNight", label: "Danger Noc", start: "22:00", end: "24:00", daylight: 0.08, artificialLight: true },
  { id: "night", label: "Noc", start: "00:00", end: "06:00", daylight: 0, artificialLight: true },
];

const toMinutes = (t: string) => (t === "24:00" ? MINUTES_PER_DAY : parseTime(t));

export function periodAtMinutes(minutes: number): Period {
  const m = ((Math.round(minutes) % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const found = PERIODS.find((p) => m >= toMinutes(p.start) && m < toMinutes(p.end));
  return found ?? PERIODS[PERIODS.length - 1]!;
}

export function periodAt(now: Date): Period {
  return periodAtMinutes(minutesOfDay(now));
}

export function getPeriod(id: PeriodId): Period {
  return PERIODS.find((p) => p.id === id)!;
}
