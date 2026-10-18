import { describe, expect, it } from 'vitest';
import { computeEnergy, computeProgress, computeSleepTime } from './energy';
import { daySchedule } from './schedule';
import { scheduleSettingsSchema, type Activity } from './schemas';
import { formatTimeOfDay, parseTimeOfDay, toZoned, zonedInstant } from './time';

const TZ = 'Europe/Warsaw';
const DAY = '2026-10-18';
const settings = scheduleSettingsSchema.parse({ timeZone: TZ });
const at = (time: string, date = DAY) => zonedInstant(date, parseTimeOfDay(time), TZ);
const hhmm = (instant: Date) => formatTimeOfDay(toZoned(instant, TZ).time);

let nextId = 0;
const task = (completedAt: string | null, weight = 1, scheduledFor = DAY): Activity => ({
  id: String(nextId++),
  kind: 'task',
  weight,
  scheduledFor,
  completedAt: completedAt === null ? null : at(completedAt),
});

describe('computeProgress', () => {
  it('weighs tasks and ignores other days', () => {
    const tasks = [task('09:00', 3), task(null, 1), task('09:00', 2, '2026-10-19')];
    expect(computeProgress(tasks, DAY, at('12:00'))).toEqual({
      planned: 4,
      done: 3,
      completion: 0.75,
    });
  });

  it('counts an empty plan as complete', () => {
    expect(computeProgress([], DAY, at('12:00')).completion).toBe(1);
  });

  it('ignores completions after the given instant', () => {
    expect(computeProgress([task('13:00')], DAY, at('12:00')).done).toBe(0);
  });
});

describe('computeSleepTime', () => {
  it('sleeps at bedtime with no tasks', () => {
    expect(hhmm(computeSleepTime([], at('16:00'), settings))).toBe('22:00');
  });

  it('sleeps at bedtime when everything is done before the cutoff', () => {
    const tasks = [task('09:00'), task('14:59')];
    expect(hhmm(computeSleepTime(tasks, at('16:00'), settings))).toBe('22:00');
  });

  it('sleeps proportionally earlier when tasks are undone at the cutoff', () => {
    expect(hhmm(computeSleepTime([task('09:00'), task(null)], at('16:00'), settings))).toBe(
      '18:30',
    );
  });

  it('sleeps at the cutoff when nothing is done, never earlier', () => {
    expect(hhmm(computeSleepTime([task(null), task(null)], at('16:00'), settings))).toBe('15:00');
  });

  it('respects task weights', () => {
    // 3 of 4 weight done → 15:00 + 7h * 0.75 = 20:15.
    expect(hhmm(computeSleepTime([task('10:00', 3), task(null)], at('16:00'), settings))).toBe(
      '20:15',
    );
  });

  it('lets one undone task make the pet sleep early', () => {
    const tasks = [task('09:00'), task('09:00'), task('09:00'), task(null)];
    const sleep = computeSleepTime(tasks, at('16:00'), settings);
    expect(sleep < daySchedule(DAY, settings).bedtime).toBe(true);
  });

  it('projects before the cutoff from what is done so far', () => {
    const tasks = [task('09:00'), task(null)];
    expect(hhmm(computeSleepTime(tasks, at('10:00'), settings))).toBe('18:30');
    // A completion that has not happened yet at `now` is not counted.
    expect(hhmm(computeSleepTime([task('09:00'), task('11:00')], at('10:00'), settings))).toBe(
      '18:30',
    );
  });

  it('lets tasks done after the cutoff push the sleep time later', () => {
    const tasks = [task('09:00'), task('17:00')];
    expect(hhmm(computeSleepTime(tasks, at('17:30'), settings))).toBe('22:00');
  });

  it('ignores tasks done after the pet fell asleep', () => {
    const tasks = [task('09:00'), task('19:00')];
    expect(hhmm(computeSleepTime(tasks, at('20:00'), settings))).toBe('18:30');
  });

  it('chains late completions', () => {
    // 1/4 at cutoff → 16:45; 2/4 at 16:30 → 18:30; 3/4 at 18:00 → 20:15.
    const tasks = [task('09:00'), task('16:30'), task('18:00'), task(null)];
    expect(hhmm(computeSleepTime(tasks, at('19:00'), settings))).toBe('20:15');
  });

  it('accepts a custom completion curve', () => {
    const tasks = [task('09:00'), task(null)];
    const sleep = computeSleepTime(tasks, at('16:00'), settings, { curve: (c) => c * c });
    expect(hhmm(sleep)).toBe('16:45');
  });

  it('handles a bedtime after midnight', () => {
    const late = scheduleSettingsSchema.parse({ bedtime: '01:00', timeZone: TZ });
    // Wake 09:00, cutoff 18:00, bedtime 01:00 → half done sleeps at 21:30.
    expect(hhmm(computeSleepTime([task('10:00'), task(null)], at('19:00'), late))).toBe('21:30');
    expect(hhmm(computeSleepTime([task('10:00')], at('23:30'), late))).toBe('01:00');
  });

  it('keeps the wall-clock bedtime on a DST day', () => {
    const dstDay = '2026-10-25';
    const tasks: Activity[] = [
      { id: 'a', kind: 'task', weight: 1, scheduledFor: dstDay, completedAt: at('09:00', dstDay) },
    ];
    expect(hhmm(computeSleepTime(tasks, at('16:00', dstDay), settings))).toBe('22:00');
  });

  it('works for any activity kind', () => {
    const habit: Activity = { ...task(null), kind: 'habit' };
    expect(hhmm(computeSleepTime([task('09:00'), habit], at('16:00'), settings))).toBe('18:30');
  });
});

describe('computeEnergy', () => {
  it('is full at wake time when everything gets done', () => {
    const state = computeEnergy([task('06:00')], at('06:00'), settings);
    expect(state.energy).toBe(1);
    expect(state.asleep).toBe(false);
  });

  it('falls over the day', () => {
    expect(computeEnergy([], at('14:00'), settings).energy).toBe(0.5);
  });

  it('drains faster with unfinished tasks and rises when they are done', () => {
    const undone = computeEnergy([task(null)], at('10:00'), settings).energy;
    const done = computeEnergy([task('09:00')], at('10:00'), settings).energy;
    expect(undone).toBeLessThan(done);
    expect(undone).toBeCloseTo(5 / 16);
  });

  it('is zero and asleep after an early sleep', () => {
    const state = computeEnergy([task(null)], at('16:00'), settings);
    expect(state).toMatchObject({
      energy: 0,
      asleep: true,
      sleepTimeFinal: true,
      sleptEarly: true,
    });
  });

  it('stays asleep until the regular wake time', () => {
    const night = computeEnergy([task(null)], at('05:59', '2026-10-19'), settings);
    expect(night).toMatchObject({ day: DAY, asleep: true });
    const morning = computeEnergy([], at('06:00', '2026-10-19'), settings);
    expect(morning).toMatchObject({ day: '2026-10-19', asleep: false, energy: 1 });
  });

  it('does not flag a full day as early sleep', () => {
    expect(computeEnergy([task('09:00')], at('21:00'), settings).sleptEarly).toBe(false);
  });
});
