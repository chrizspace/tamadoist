import { MINUTES_PER_DAY } from './constants';

/** A calendar date in the user's timezone, `YYYY-MM-DD`. */
export type LocalDate = string;

/** Minutes since local midnight, 0..1439. */
export type TimeOfDay = number;

const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;
const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseTimeOfDay(value: string): TimeOfDay {
  const match = TIME_RE.exec(value);
  if (!match) throw new RangeError(`Invalid time of day: ${value}`);
  return Number(match[1]) * 60 + Number(match[2]);
}

export function formatTimeOfDay(minutes: TimeOfDay): string {
  const m = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
}

/** Adds minutes to a time of day, wrapping around midnight. */
export function addToTimeOfDay(time: TimeOfDay, minutes: number): TimeOfDay {
  return (((time + minutes) % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
}

function parseDate(date: LocalDate): [number, number, number] {
  const match = DATE_RE.exec(date);
  if (!match) throw new RangeError(`Invalid date: ${date}`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

export function addDays(date: LocalDate, days: number): LocalDate {
  const [y, m, d] = parseDate(date);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

const formatters = new Map<string, Intl.DateTimeFormat>();

function formatterFor(timeZone: string): Intl.DateTimeFormat {
  let formatter = formatters.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    formatters.set(timeZone, formatter);
  }
  return formatter;
}

function zonedParts(instant: Date, timeZone: string) {
  const parts: Record<string, number> = {};
  for (const part of formatterFor(timeZone).formatToParts(instant)) {
    if (part.type !== 'literal') parts[part.type] = Number(part.value);
  }
  return parts as Record<'year' | 'month' | 'day' | 'hour' | 'minute' | 'second', number>;
}

/** Offset of `timeZone` from UTC at `instant`, in milliseconds. */
function offsetMs(instant: number, timeZone: string): number {
  const p = zonedParts(new Date(instant), timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return asUtc - Math.floor(instant / 1000) * 1000;
}

/**
 * The instant at which the wall clock in `timeZone` shows `date` + `time`.
 * Times skipped by a DST jump resolve to the instant just after the jump.
 */
export function zonedInstant(date: LocalDate, time: TimeOfDay, timeZone: string): Date {
  const [y, m, d] = parseDate(date);
  const wall = Date.UTC(y, m - 1, d, 0, time);
  const first = wall - offsetMs(wall, timeZone);
  const second = wall - offsetMs(first, timeZone);
  return new Date(Math.max(first, second));
}

/** The local date and time of day of `instant` in `timeZone`. */
export function toZoned(instant: Date, timeZone: string): { date: LocalDate; time: TimeOfDay } {
  const p = zonedParts(instant, timeZone);
  const pad = (n: number, len = 2) => String(n).padStart(len, '0');
  return {
    date: `${pad(p.year, 4)}-${pad(p.month)}-${pad(p.day)}`,
    time: p.hour * 60 + p.minute,
  };
}
