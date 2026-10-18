import { MINUTES_PER_DAY, parseTime } from "../shared/time";

/** What the character needs next: it picks the icon of the "Zadbaj" action. */
export type Need = "drink" | "eat" | "sleep";

export interface NeedInput {
  /** Minutes since midnight. */
  minutes: number;
  sleepStart: string;
  sleepEnd: string;
  sleeping: boolean;
  drunkMl: number;
  goalMl: number;
  meals: number;
  mealsGoal: number;
}

/** Within this many minutes of bedtime, sleeping is the nearest need. */
export const WIND_DOWN_MINUTES = 60;

const wrap = (m: number) => ((m % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;

/**
 * Nearest need. Asleep or close to bedtime: sleep. Otherwise compare how far drinking and eating are behind
 * the share of the waking day that has passed (water and meals are expected to fill up evenly); the one
 * further behind wins, and drinking wins a tie. `urgency` is how far behind it is (0..1).
 */
export function predictNeed(i: NeedInput): { need: Need; urgency: number } {
  if (i.sleeping) return { need: "sleep", urgency: 1 };
  const bed = parseTime(i.sleepStart);
  const wake = parseTime(i.sleepEnd);
  const minutesToBed = wrap(bed - i.minutes);
  const awakeLength = wrap(bed - wake) || MINUTES_PER_DAY;
  const sinceWake = wrap(i.minutes - wake);
  if (minutesToBed <= WIND_DOWN_MINUTES || sinceWake >= awakeLength) {
    return { need: "sleep", urgency: Math.min(1, 1 - minutesToBed / WIND_DOWN_MINUTES) };
  }
  const passed = Math.min(1, sinceWake / awakeLength);
  const waterBehind = passed - (i.goalMl > 0 ? i.drunkMl / i.goalMl : 1);
  const foodBehind = passed - (i.mealsGoal > 0 ? i.meals / i.mealsGoal : 1);
  const need: Need = waterBehind >= foodBehind ? "drink" : "eat";
  return { need, urgency: Math.max(0, Math.min(1, Math.max(waterBehind, foodBehind))) };
}
