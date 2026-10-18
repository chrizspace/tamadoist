import { describe, expect, it } from "vitest";
import { DEFAULT_SUN, PERIODS, periodAtMinutes, periodWindows, sunTimes, zoneOffsetMinutes } from "../index";

const m = (h: number, min = 0) => h * 60 + min;
const WARSAW = { lat: 52.2297, lng: 21.0122 };
const hhmm = (v: number) => `${String(Math.floor(((v % 1440) + 1440) % 1440 / 60)).padStart(2, "0")}:${String(Math.round(((v % 1440) + 1440) % 1440) % 60).padStart(2, "0")}`;
const near = (actual: number, expected: number, tol = 6) => expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tol);

describe("sun times", () => {
  it("Warsaw, winter solstice: late sunrise, early sunset", () => {
    const s = sunTimes({ year: 2025, month: 12, day: 21 }, WARSAW, 60);
    near(s.sunrise, m(7, 42));
    near(s.sunset, m(15, 26));
  });
  it("Warsaw, summer solstice: early sunrise, late sunset", () => {
    const s = sunTimes({ year: 2026, month: 6, day: 21 }, WARSAW, 120);
    near(s.sunrise, m(4, 14));
    near(s.sunset, m(21, 1));
  });
  it("Sydney is mirrored: long December days", () => {
    const s = sunTimes({ year: 2025, month: 12, day: 21 }, { lat: -33.87, lng: 151.21 }, 660);
    near(s.sunrise, m(5, 41));
    near(s.sunset, m(20, 5));
  });
  it("Singapore has almost equal days all year", () => {
    const jun = sunTimes({ year: 2026, month: 6, day: 21 }, { lat: 1.35, lng: 103.82 }, 480);
    const dec = sunTimes({ year: 2025, month: 12, day: 21 }, { lat: 1.35, lng: 103.82 }, 480);
    expect(Math.abs(jun.dayLengthMinutes - dec.dayLengthMinutes)).toBeLessThan(15);
  });
  it("detects polar night and the midnight sun", () => {
    expect(sunTimes({ year: 2025, month: 12, day: 21 }, { lat: 69.65, lng: 18.96 }, 60).polar).toBe("night");
    expect(sunTimes({ year: 2026, month: 6, day: 21 }, { lat: 69.65, lng: 18.96 }, 120).polar).toBe("day");
  });
  it("derives the timezone offset from an IANA zone, including daylight saving", () => {
    expect(zoneOffsetMinutes("Europe/Warsaw", { year: 2026, month: 1, day: 14 })).toBe(60);
    expect(zoneOffsetMinutes("Europe/Warsaw", { year: 2026, month: 7, day: 14 })).toBe(120);
    expect(zoneOffsetMinutes("Australia/Sydney", { year: 2026, month: 1, day: 14 })).toBe(660);
  });
});

describe("periods follow the sun", () => {
  it("has exactly four, in order", () => {
    expect(PERIODS.map((p) => p.label)).toEqual(["Rano", "Południe", "Wieczór", "Noc"]);
  });
  it("cover the whole day without gaps in every season", () => {
    for (const month of [1, 3, 6, 9, 12]) {
      const sun = sunTimes({ year: 2026, month, day: 15 }, WARSAW, 60);
      const ids = new Set<string>();
      for (let t = 0; t < 1440; t += 5) ids.add(periodAtMinutes(t, sun).id);
      expect(ids.size).toBe(4);
    }
  });
  it("moves with the season: winter mornings start later and winter evenings earlier than summer", () => {
    const winter = periodWindows(sunTimes({ year: 2025, month: 12, day: 21 }, WARSAW, 60));
    const summer = periodWindows(sunTimes({ year: 2026, month: 6, day: 21 }, WARSAW, 120));
    expect(winter[0]!.start).toBeGreaterThan(summer[0]!.start + 120);
    expect(winter[2]!.start).toBeLessThan(summer[2]!.start - 180);
  });
  it("moves with the location: the same clock time is later in the day further west in one zone", () => {
    const east = sunTimes({ year: 2026, month: 3, day: 20 }, { lat: 52, lng: 24 }, 60);
    const west = sunTimes({ year: 2026, month: 3, day: 20 }, { lat: 52, lng: 14 }, 60);
    expect(west.sunrise).toBeGreaterThan(east.sunrise + 30);
  });
  it("labels a winter 07:00 as night and a summer 07:00 as morning or noon", () => {
    const winter = sunTimes({ year: 2025, month: 12, day: 21 }, WARSAW, 60);
    const summer = sunTimes({ year: 2026, month: 6, day: 21 }, WARSAW, 120);
    expect(periodAtMinutes(m(7), winter).id).toBe("night");
    expect(["morning", "noon"]).toContain(periodAtMinutes(m(7), summer).id);
  });
  it("lights are on in the evening and at night only", () => {
    expect(PERIODS.filter((p) => p.artificialLight).map((p) => p.id)).toEqual(["evening", "night"]);
  });
  it("works without a location", () => {
    expect(periodAtMinutes(m(12), DEFAULT_SUN).id).toBe("noon");
    expect(periodAtMinutes(m(2), DEFAULT_SUN).id).toBe("night");
    expect(hhmm(DEFAULT_SUN.sunrise)).toBe("06:30");
  });
  it("falls back to a clock around solar noon during polar day and night", () => {
    const polar = sunTimes({ year: 2025, month: 12, day: 21 }, { lat: 69.65, lng: 18.96 }, 60);
    const ids = new Set<string>();
    for (let t = 0; t < 1440; t += 15) ids.add(periodAtMinutes(t, polar).id);
    expect(ids.size).toBe(4);
  });
});
