/** The user's sleep always lasts exactly this long; wake time = bedtime + SLEEP_HOURS. */
export const SLEEP_HOURS = 8;

/** Hours after wake time at which unfinished tasks start making the pet sleep early. */
export const CUTOFF_HOURS_AFTER_WAKE = 9;

export const DEFAULT_BEDTIME = '22:00';
export const DEFAULT_REVIEW_TIME = '08:00';

/** Consecutive early-sleep days after which the pet turns sad. */
export const DEFAULT_SAD_AFTER_DAYS = 3;

/** How long the pet stays happy after a task is completed. */
export const HAPPY_REACTION_MS = 2 * 60 * 1000;

/** Energy below this makes the pet tired. */
export const TIRED_BELOW_ENERGY = 0.3;

export const MINUTES_PER_DAY = 24 * 60;
