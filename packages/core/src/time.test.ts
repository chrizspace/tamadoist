import { describe, expect, it } from 'vitest';
import {
  addDays,
  addToTimeOfDay,
  formatTimeOfDay,
  parseTimeOfDay,
  toZoned,
  zonedInstant,
} from './time';

describe('time of day', () => {
  it('parses and formats HH:MM', () => {
    expect(parseTimeOfDay('22:00')).toBe(1320);
    expect(parseTimeOfDay('00:05')).toBe(5);
    expect(formatTimeOfDay(1320)).toBe('22:00');
    expect(formatTimeOfDay(-60)).toBe('23:00');
  });

  it('rejects invalid times', () => {
    expect(() => parseTimeOfDay('24:00')).toThrow(RangeError);
    expect(() => parseTimeOfDay('7:00')).toThrow(RangeError);
  });

  it('wraps around midnight', () => {
    expect(addToTimeOfDay(parseTimeOfDay('22:00'), 480)).toBe(parseTimeOfDay('06:00'));
    expect(addToTimeOfDay(parseTimeOfDay('01:00'), -120)).toBe(parseTimeOfDay('23:00'));
  });
});

describe('dates', () => {
  it('adds days across month and year ends', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
  });

  it('rejects invalid dates', () => {
    expect(() => addDays('2026/01/01', 1)).toThrow(RangeError);
  });
});

describe('time zones', () => {
  it('converts wall-clock time to an instant', () => {
    expect(zonedInstant('2026-07-01', 360, 'Europe/Warsaw').toISOString()).toBe(
      '2026-07-01T04:00:00.000Z',
    );
    expect(zonedInstant('2026-01-15', 360, 'Europe/Warsaw').toISOString()).toBe(
      '2026-01-15T05:00:00.000Z',
    );
    expect(zonedInstant('2026-07-01', 360, 'America/New_York').toISOString()).toBe(
      '2026-07-01T10:00:00.000Z',
    );
  });

  it('resolves a time skipped by DST to just after the jump', () => {
    // Warsaw jumps 02:00 → 03:00 on 2026-03-29.
    expect(zonedInstant('2026-03-29', 150, 'Europe/Warsaw').toISOString()).toBe(
      '2026-03-29T01:30:00.000Z',
    );
  });

  it('round-trips through toZoned', () => {
    const instant = zonedInstant('2026-10-25', 22 * 60, 'Europe/Warsaw');
    expect(toZoned(instant, 'Europe/Warsaw')).toEqual({ date: '2026-10-25', time: 22 * 60 });
  });
});
