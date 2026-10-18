import { MINUTES_PER_DAY, formatTime, minutesOfDay, parseTime } from "../shared/time";

export const SLEEP_HOURS = 8;
export const SLEEP_MINUTES = SLEEP_HOURS * 60;
export const ACTIVE_MINUTES = MINUTES_PER_DAY - SLEEP_MINUTES;
export const DEFAULT_SLEEP_START = "22:00";

export interface SleepWindow {
  start: string;
  end: string;
}

/** Sleep always lasts 8h, so the wake-up time is derived from the bedtime. */
export function sleepWindow(sleepStart: string = DEFAULT_SLEEP_START): SleepWindow {
  const start = parseTime(sleepStart);
  return { start: formatTime(start), end: formatTime(start + SLEEP_MINUTES) };
}

export function wakeMinutes(sleepStart: string): number {
  return (parseTime(sleepStart) + SLEEP_MINUTES) % MINUTES_PER_DAY;
}

export function isSleeping(now: Date, sleepStart: string): boolean {
  const sinceBedtime = (minutesOfDay(now) - parseTime(sleepStart) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  return sinceBedtime < SLEEP_MINUTES;
}
