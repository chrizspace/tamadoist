import { MINUTES_PER_DAY, formatTime, minutesOfDay } from "../shared/time";
import { ACTIVE_MINUTES, isSleeping, wakeMinutes } from "./sleep";

/** Without any water, energy lasts for this share of the active day. */
export const BASE_ENERGY_SHARE = 0.3;

export type EnergyState = "awake" | "tired" | "sleeping";

export interface EnergyInput {
  now: Date;
  sleepStart: string;
  drunkMl: number;
  goalMl: number;
}

export interface EnergyResult {
  state: EnergyState;
  /** 0-100 */
  percent: number;
  /** Minutes of the active day the energy budget covers. */
  budgetMinutes: number;
  /** "HH:MM" until which energy lasts today. */
  energyUntil: string;
  waterRatio: number;
}

export function waterRatio(drunkMl: number, goalMl: number): number {
  if (goalMl <= 0) return 0;
  return Math.min(1, Math.max(0, drunkMl / goalMl));
}

/** energy budget (min) = active day * (30% + 70% * water ratio) */
export function energyBudgetMinutes(ratio: number): number {
  return ACTIVE_MINUTES * (BASE_ENERGY_SHARE + (1 - BASE_ENERGY_SHARE) * ratio);
}

export function computeEnergy({ now, sleepStart, drunkMl, goalMl }: EnergyInput): EnergyResult {
  const ratio = waterRatio(drunkMl, goalMl);
  const budgetMinutes = energyBudgetMinutes(ratio);
  const wake = wakeMinutes(sleepStart);
  const energyUntil = formatTime(wake + budgetMinutes);

  if (isSleeping(now, sleepStart)) {
    return { state: "sleeping", percent: 100, budgetMinutes, energyUntil, waterRatio: ratio };
  }

  const sinceWake = (minutesOfDay(now) - wake + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const percent = Math.max(0, Math.min(100, Math.round((1 - sinceWake / budgetMinutes) * 100)));
  return {
    state: percent === 0 ? "tired" : "awake",
    percent,
    budgetMinutes,
    energyUntil,
    waterRatio: ratio,
  };
}
