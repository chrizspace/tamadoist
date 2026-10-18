import { describe, expect, it } from 'vitest';
import { computeEarlySleepStreak, computeMood, type MoodInput } from './mood';

const now = new Date('2026-10-18T10:00:00Z');
const base: MoodInput = {
  energy: { energy: 0.6, asleep: false, progress: { planned: 2, done: 1, completion: 0.5 } },
  now,
  lastCompletedAt: null,
  earlySleepStreak: 0,
  sadAfterDays: 3,
};
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60_000);

describe('computeMood', () => {
  it('is idle by default', () => {
    expect(computeMood(base)).toBe('idle');
  });

  it('sleeps when asleep, whatever else is true', () => {
    expect(
      computeMood({ ...base, energy: { ...base.energy, asleep: true }, lastCompletedAt: now }),
    ).toBe('sleeping');
  });

  it('is happy right after a completion, then calms down', () => {
    expect(computeMood({ ...base, lastCompletedAt: minutesAgo(1) })).toBe('happy');
    expect(computeMood({ ...base, lastCompletedAt: minutesAgo(5) })).toBe('idle');
  });

  it('is happy when all planned tasks are done', () => {
    const allDone = { planned: 2, done: 2, completion: 1 };
    expect(computeMood({ ...base, energy: { ...base.energy, progress: allDone } })).toBe('happy');
  });

  it('is not happy about an empty plan', () => {
    const empty = { planned: 0, done: 0, completion: 1 };
    expect(computeMood({ ...base, energy: { ...base.energy, progress: empty } })).toBe('idle');
  });

  it('is sad after too many early nights in a row', () => {
    expect(computeMood({ ...base, earlySleepStreak: 3 })).toBe('sad');
    expect(computeMood({ ...base, earlySleepStreak: 2 })).toBe('idle');
  });

  it('is tired when energy is low', () => {
    expect(computeMood({ ...base, energy: { ...base.energy, energy: 0.2 } })).toBe('tired');
  });
});

describe('computeEarlySleepStreak', () => {
  it('counts consecutive early nights ending with the latest day', () => {
    expect(
      computeEarlySleepStreak([
        { date: '2026-10-15', sleptEarly: true },
        { date: '2026-10-17', sleptEarly: true },
        { date: '2026-10-16', sleptEarly: false },
        { date: '2026-10-18', sleptEarly: true },
      ]),
    ).toBe(2);
  });

  it('is zero without history', () => {
    expect(computeEarlySleepStreak([])).toBe(0);
  });
});
