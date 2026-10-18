import { MINUTES_PER_DAY } from "../shared/time";

export interface GeoPoint { lat: number; lng: number }

export interface CalendarDate { year: number; month: number; day: number }

/**
 * Sun events as minutes after local midnight. Values can fall slightly outside 0..1440
 * (for example a sunset after midnight in an Icelandic summer); everything downstream is circular.
 */
export interface SunTimes {
  sunrise: number;
  sunset: number;
  solarNoon: number;
  dayLengthMinutes: number;
  /** The sun does not rise or does not set on this date at this latitude. */
  polar?: "day" | "night";
}

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;
const mod = (n: number, m: number) => ((n % m) + m) % m;

/** Julian day number at 12:00 UT of a calendar date. */
function julianDay({ year, month, day }: CalendarDate): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

/**
 * Sunrise, sunset and solar noon from the standard sunrise equation (the sun's upper limb
 * touching the horizon, with refraction: -0.833 degrees). Accurate to a few minutes.
 * `utcOffsetMinutes` is the local timezone offset east of UTC on that date.
 */
export function sunTimes(date: CalendarDate, point: GeoPoint, utcOffsetMinutes: number): SunTimes {
  const n = julianDay(date) - 2451545.0 + 0.0008;
  const jStar = n - point.lng / 360;
  const M = mod(357.5291 + 0.98560028 * jStar, 360);
  const C = 1.9148 * Math.sin(rad(M)) + 0.02 * Math.sin(rad(2 * M)) + 0.0003 * Math.sin(rad(3 * M));
  const lambda = mod(M + C + 180 + 102.9372, 360);
  const transit = jStar + 0.0053 * Math.sin(rad(M)) - 0.0069 * Math.sin(rad(2 * lambda)); // days since J2000 noon
  const sinDec = Math.sin(rad(lambda)) * Math.sin(rad(23.4397));
  const cosDec = Math.cos(Math.asin(sinDec));
  const cosH = (Math.sin(rad(-0.833)) - Math.sin(rad(point.lat)) * sinDec) / (Math.cos(rad(point.lat)) * cosDec);

  // Julian date 2451545.0 is noon UT, so the fraction of the day since midnight UT is (transit + 0.5) mod 1.
  const noonUtc = mod(transit + 0.5, 1) * MINUTES_PER_DAY;
  const solarNoon = mod(noonUtc + utcOffsetMinutes, MINUTES_PER_DAY);

  if (cosH > 1) return { sunrise: solarNoon, sunset: solarNoon, solarNoon, dayLengthMinutes: 0, polar: "night" };
  if (cosH < -1) return { sunrise: solarNoon - 720, sunset: solarNoon + 720, solarNoon, dayLengthMinutes: MINUTES_PER_DAY, polar: "day" };

  const halfDay = deg(Math.acos(cosH)) * 4; // 1 degree of hour angle = 4 minutes
  return { sunrise: solarNoon - halfDay, sunset: solarNoon + halfDay, solarNoon, dayLengthMinutes: 2 * halfDay };
}

/** Used when the location is unknown: an equinox day at mid latitude. */
export const DEFAULT_SUN: SunTimes = { sunrise: 6 * 60 + 30, sunset: 18 * 60 + 30, solarNoon: 12 * 60 + 30, dayLengthMinutes: 720 };

/** Timezone offset (minutes east of UTC) of an IANA zone at noon on a date. Works in browsers and Node. */
export function zoneOffsetMinutes(timeZone: string, { year, month, day }: CalendarDate): number {
  const instant = Date.UTC(year, month - 1, day, 12, 0, 0);
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" }).formatToParts(new Date(instant));
  const get = (t: string) => Number(parts.find((p) => p.type === t)!.value);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"));
  return Math.round((asUtc - instant) / 60000);
}

export function calendarDateOf(d: Date): CalendarDate {
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
}
