import { HAPPY_REACTION_MS, TIRED_BELOW_ENERGY } from './constants';
import type { EnergyState } from './energy';
import type { LocalDate } from './time';

export type PetMood = 'idle' | 'happy' | 'tired' | 'sleeping' | 'sad';

export interface DayRecord {
  date: LocalDate;
  sleptEarly: boolean;
}

/** Consecutive early-sleep days ending with the most recent finished day. */
export function computeEarlySleepStreak(history: DayRecord[]): number {
  const sorted = [...history].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  for (const record of sorted) {
    if (!record.sleptEarly) break;
    streak += 1;
  }
  return streak;
}

export interface MoodInput {
  energy: Pick<EnergyState, 'energy' | 'asleep' | 'progress'>;
  now: Date;
  /** Latest completion today, to play the happy reaction. */
  lastCompletedAt: Date | null;
  earlySleepStreak: number;
  sadAfterDays: number;
}

/** Precedence: sleeping > happy (just completed or all done) > sad > tired > idle. */
export function computeMood(input: MoodInput): PetMood {
  const { energy, now, lastCompletedAt } = input;
  if (energy.asleep) return 'sleeping';
  const justCompleted =
    lastCompletedAt !== null &&
    lastCompletedAt <= now &&
    now.getTime() - lastCompletedAt.getTime() < HAPPY_REACTION_MS;
  const allDone = energy.progress.planned > 0 && energy.progress.completion === 1;
  if (justCompleted || allDone) return 'happy';
  if (input.earlySleepStreak >= input.sadAfterDays) return 'sad';
  if (energy.energy < TIRED_BELOW_ENERGY) return 'tired';
  return 'idle';
}
