import { z } from 'zod';
import { DEFAULT_BEDTIME, DEFAULT_SAD_AFTER_DAYS } from './constants';

export const timeOfDaySchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Expected HH:MM');
export const localDateSchema = z.iso.date();

export const timeZoneSchema = z.string().refine((tz) => {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}, 'Unknown time zone');

export const activityKindSchema = z.enum(['task', 'habit', 'vitamin', 'finance']);

/** Anything the energy engine counts: a task now; habits, vitamins and finance habits later. */
export const activitySchema = z.object({
  id: z.string(),
  kind: activityKindSchema,
  weight: z.number().int().min(1).max(3).default(1),
  /** The day this activity is planned for. */
  scheduledFor: localDateSchema,
  completedAt: z.date().nullable(),
});

/**
 * Only the bedtime is stored; wake time (bedtime + 8h) and the cutoff (wake + 9h)
 * are always derived, so the 8-hour sleep invariant cannot be broken.
 */
export const scheduleSettingsSchema = z.object({
  bedtime: timeOfDaySchema.default(DEFAULT_BEDTIME),
  timeZone: timeZoneSchema,
  sadAfterDays: z.number().int().min(1).default(DEFAULT_SAD_AFTER_DAYS),
});

export type ActivityKind = z.infer<typeof activityKindSchema>;
export type Activity = z.infer<typeof activitySchema>;
export type ScheduleSettings = z.infer<typeof scheduleSettingsSchema>;
