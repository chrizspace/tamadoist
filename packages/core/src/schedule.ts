import { CUTOFF_HOURS_AFTER_WAKE, SLEEP_HOURS } from './constants';
import type { ScheduleSettings } from './schemas';
import {
  addDays,
  addToTimeOfDay,
  formatTimeOfDay,
  parseTimeOfDay,
  toZoned,
  zonedInstant,
  type LocalDate,
} from './time';

/** Wake time is always bedtime + 8h; it is never stored or edited on its own. */
export function wakeTimeFor(bedtime: string): string {
  return formatTimeOfDay(addToTimeOfDay(parseTimeOfDay(bedtime), SLEEP_HOURS * 60));
}

/** The cutoff is always wake + 9h (15:00 with the default 22:00 bedtime). */
export function cutoffTimeFor(bedtime: string): string {
  return formatTimeOfDay(
    addToTimeOfDay(parseTimeOfDay(bedtime), (SLEEP_HOURS + CUTOFF_HOURS_AFTER_WAKE) * 60),
  );
}

export interface DaySchedule {
  /** The pet's day, named after the local date it wakes up on. */
  day: LocalDate;
  wake: Date;
  cutoff: Date;
  /** The full-day bedtime: when the pet sleeps if every task is done. */
  bedtime: Date;
  /** The next morning's wake time, which also ends any early sleep. */
  nextWake: Date;
}

/**
 * The instants of one pet day. All of them are local wall-clock times, so across a DST
 * change the real durations shift by an hour while the clock times stay the same.
 */
export function daySchedule(day: LocalDate, settings: ScheduleSettings): DaySchedule {
  const bed = parseTimeOfDay(settings.bedtime);
  const wake = addToTimeOfDay(bed, SLEEP_HOURS * 60);
  const cutoff = addToTimeOfDay(wake, CUTOFF_HOURS_AFTER_WAKE * 60);
  // Times earlier on the clock than the wake time fall on the next calendar date.
  const dateOf = (time: number) => (time < wake ? addDays(day, 1) : day);
  return {
    day,
    wake: zonedInstant(day, wake, settings.timeZone),
    cutoff: zonedInstant(dateOf(cutoff), cutoff, settings.timeZone),
    bedtime: zonedInstant(dateOf(bed), bed, settings.timeZone),
    nextWake: zonedInstant(addDays(day, 1), wake, settings.timeZone),
  };
}

/** The pet day in progress at `now`: the one whose wake time came last. */
export function petDayAt(now: Date, settings: ScheduleSettings): LocalDate {
  const { date } = toZoned(now, settings.timeZone);
  return now < daySchedule(date, settings).wake ? addDays(date, -1) : date;
}
