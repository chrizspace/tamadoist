import type { Activity, ScheduleSettings } from './schemas';
import { daySchedule, petDayAt, type DaySchedule } from './schedule';
import type { LocalDate } from './time';

export interface Progress {
  planned: number;
  done: number;
  /** done / planned, or 1 when nothing is planned. */
  completion: number;
}

const isDoneBy = (activity: Activity, at: Date) =>
  activity.completedAt !== null && activity.completedAt <= at;

export function computeProgress(activities: Activity[], day: LocalDate, at: Date): Progress {
  let planned = 0;
  let done = 0;
  for (const activity of activities) {
    if (activity.scheduledFor !== day) continue;
    planned += activity.weight;
    if (isDoneBy(activity, at)) done += activity.weight;
  }
  return { planned, done, completion: planned === 0 ? 1 : done / planned };
}

/** Maps completion to the share of the cutoff→bedtime window the pet stays awake. Linear in v1. */
export type CompletionCurve = (completion: number) => number;
export const linearCurve: CompletionCurve = (completion) => completion;

function sleepTarget(schedule: DaySchedule, completion: number, curve: CompletionCurve): Date {
  const share = Math.min(1, Math.max(0, curve(completion)));
  const window = schedule.bedtime.getTime() - schedule.cutoff.getTime();
  return new Date(schedule.cutoff.getTime() + window * share);
}

/**
 * When the pet falls asleep on `day`, given what is completed by `now`.
 *
 * sleep = cutoff + (bedtime - cutoff) * f(completion). Tasks completed after the cutoff still
 * push the time later, but only while the pet is awake: once asleep it stays asleep until the
 * next wake time. Before the cutoff (or while awake) the result is a projection.
 */
export function computeSleepTime(
  activities: Activity[],
  now: Date,
  settings: ScheduleSettings,
  options: { day?: LocalDate; curve?: CompletionCurve } = {},
): Date {
  const day = options.day ?? petDayAt(now, settings);
  const curve = options.curve ?? linearCurve;
  const schedule = daySchedule(day, settings);

  const atCutoff = now < schedule.cutoff ? now : schedule.cutoff;
  let sleep = sleepTarget(schedule, computeProgress(activities, day, atCutoff).completion, curve);
  const lateCompletions = activities
    .filter((a) => a.scheduledFor === day && a.completedAt !== null)
    .map((a) => a.completedAt as Date)
    .filter((at) => at > schedule.cutoff && at <= now)
    .sort((a, b) => a.getTime() - b.getTime());

  for (const at of lateCompletions) {
    if (at >= sleep) break;
    sleep = sleepTarget(schedule, computeProgress(activities, day, at).completion, curve);
  }
  return sleep;
}

export interface EnergyState {
  day: LocalDate;
  /** 0..1: awake time left until the sleep time, as a share of the full 16-hour day. */
  energy: number;
  asleep: boolean;
  sleepTime: Date;
  /** True once the sleep time can no longer change (the pet is asleep). */
  sleepTimeFinal: boolean;
  progress: Progress;
  sleptEarly: boolean;
}

/**
 * The energy bar falls with time and rises with completed tasks: unfinished tasks pull the
 * sleep time earlier, so the bar drains faster until they are done.
 */
export function computeEnergy(
  activities: Activity[],
  now: Date,
  settings: ScheduleSettings,
  options: { curve?: CompletionCurve } = {},
): EnergyState {
  const day = petDayAt(now, settings);
  const schedule = daySchedule(day, settings);
  const sleepTime = computeSleepTime(activities, now, settings, { day, ...options });
  const fullDay = schedule.bedtime.getTime() - schedule.wake.getTime();
  const asleep = now >= sleepTime;
  return {
    day,
    energy: asleep ? 0 : Math.min(1, Math.max(0, (sleepTime.getTime() - now.getTime()) / fullDay)),
    asleep,
    sleepTime,
    sleepTimeFinal: asleep,
    progress: computeProgress(activities, day, now),
    sleptEarly: sleepTime < schedule.bedtime,
  };
}
