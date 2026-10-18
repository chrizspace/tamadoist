import { describe, expect, it } from 'vitest';
import { SLEEP_HOURS } from './constants';
import { cutoffTimeFor, daySchedule, petDayAt, wakeTimeFor } from './schedule';
import { scheduleSettingsSchema } from './schemas';
import { addDays, formatTimeOfDay, parseTimeOfDay, toZoned } from './time';

const settings = (bedtime = '22:00', timeZone = 'Europe/Warsaw') =>
  scheduleSettingsSchema.parse({ bedtime, timeZone });
const local = (instant: Date, tz = 'Europe/Warsaw') => {
  const { date, time } = toZoned(instant, tz);
  return `${date} ${formatTimeOfDay(time)}`;
};

describe('derived times', () => {
  it('defaults to bedtime 22:00, wake 06:00, cutoff 15:00', () => {
    const s = scheduleSettingsSchema.parse({ timeZone: 'Europe/Warsaw' });
    expect(s.bedtime).toBe('22:00');
    expect(wakeTimeFor(s.bedtime)).toBe('06:00');
    expect(cutoffTimeFor(s.bedtime)).toBe('15:00');
  });

  it('handles a bedtime after midnight', () => {
    expect(wakeTimeFor('01:00')).toBe('09:00');
    expect(cutoffTimeFor('01:00')).toBe('18:00');
  });

  it('always gives the user exactly 8 hours of sleep', () => {
    for (let minutes = 0; minutes < 24 * 60; minutes += 15) {
      const bedtime = formatTimeOfDay(minutes);
      const gap = (parseTimeOfDay(wakeTimeFor(bedtime)) - minutes + 24 * 60) % (24 * 60);
      expect(gap).toBe(SLEEP_HOURS * 60);
    }
  });

  it('rejects malformed settings', () => {
    expect(scheduleSettingsSchema.safeParse({ bedtime: '25:00', timeZone: 'UTC' }).success).toBe(
      false,
    );
    expect(scheduleSettingsSchema.safeParse({ timeZone: 'Mars/Olympus' }).success).toBe(false);
  });
});

describe('daySchedule', () => {
  it('lays out the default day', () => {
    const d = daySchedule('2026-10-18', settings());
    expect(local(d.wake)).toBe('2026-10-18 06:00');
    expect(local(d.cutoff)).toBe('2026-10-18 15:00');
    expect(local(d.bedtime)).toBe('2026-10-18 22:00');
    expect(local(d.nextWake)).toBe('2026-10-19 06:00');
  });

  it('puts a bedtime after midnight on the next date', () => {
    const d = daySchedule('2026-10-18', settings('01:00'));
    expect(local(d.wake)).toBe('2026-10-18 09:00');
    expect(local(d.cutoff)).toBe('2026-10-18 18:00');
    expect(local(d.bedtime)).toBe('2026-10-19 01:00');
    expect(local(d.nextWake)).toBe('2026-10-19 09:00');
  });

  it('keeps wall-clock times across the autumn DST change', () => {
    // Warsaw falls back 03:00 → 02:00 on 2026-10-25: the night before is 9 real hours.
    const before = daySchedule('2026-10-24', settings());
    expect(local(before.bedtime)).toBe('2026-10-24 22:00');
    expect(local(before.nextWake)).toBe('2026-10-25 06:00');
    expect(before.nextWake.getTime() - before.bedtime.getTime()).toBe(9 * 3600_000);
  });

  it('works in other time zones', () => {
    const d = daySchedule('2026-10-18', settings('22:00', 'America/Los_Angeles'));
    expect(local(d.wake, 'America/Los_Angeles')).toBe('2026-10-18 06:00');
  });
});

describe('petDayAt', () => {
  const s = settings();
  const at = (date: string, time: string) =>
    daySchedule(date, s).wake.getTime() + (parseTimeOfDay(time) - parseTimeOfDay('06:00')) * 60_000;

  it('starts the day at wake time', () => {
    expect(petDayAt(new Date(at('2026-10-18', '06:00')), s)).toBe('2026-10-18');
    expect(petDayAt(new Date(at('2026-10-18', '05:59')), s)).toBe('2026-10-17');
  });

  it('keeps a late bedtime in the same pet day', () => {
    const late = settings('01:00');
    const halfPastMidnight =
      daySchedule(addDays('2026-10-18', 0), late).bedtime.getTime() - 30 * 60_000;
    expect(petDayAt(new Date(halfPastMidnight), late)).toBe('2026-10-18');
  });
});
