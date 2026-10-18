import { describe, expect, it } from "vitest";
import { distanceMeters, resolveScene, slotActive, type Place, type ScheduleSlot } from "../index";

// 2026-01-14 is a Wednesday (day 3)
const at = (h: number, m = 0, day = 14) => new Date(2026, 0, day, h, m);

const work: ScheduleSlot = { id: "work", label: "Praca", start: "09:00", end: "17:00", location: "work.openspace", days: [1, 2, 3, 4, 5] };
const lunch: ScheduleSlot = { id: "lunch", label: "Lunch", start: "12:30", end: "13:00", location: "work.kitchen", days: [1, 2, 3, 4, 5] };
const home: Place = { id: "h", group: "home", name: "Dom", lat: 52.2297, lng: 21.0122, radiusM: 100, location: "home.office" };
const office: Place = { id: "w", group: "work", name: "Biuro", lat: 52.24, lng: 21.03, radiusM: 150, location: "work.openspace" };

describe("schedule", () => {
  it("shows the open space during work hours on weekdays", () => {
    expect(resolveScene({ now: at(10), schedule: [work, lunch], places: [] })).toMatchObject({ location: "work.openspace", group: "work", source: "schedule" });
  });
  it("lunch inside the workday wins because it is the shorter slot", () => {
    expect(resolveScene({ now: at(12, 45), schedule: [work, lunch], places: [] }).location).toBe("work.kitchen");
    expect(resolveScene({ now: at(13, 0), schedule: [work, lunch], places: [] }).location).toBe("work.openspace");
  });
  it("ignores slots on other weekdays and outside the hours", () => {
    expect(resolveScene({ now: at(10, 0, 17), schedule: [work], places: [] }).source).toBe("default"); // Saturday
    expect(resolveScene({ now: at(17, 0), schedule: [work], places: [] }).source).toBe("default");
    expect(resolveScene({ now: at(8, 59), schedule: [work], places: [] }).source).toBe("default");
  });
  it("handles slots that run past midnight", () => {
    const evening: ScheduleSlot = { id: "e", label: "Wieczór", start: "22:00", end: "02:00", location: "home.kitchen" };
    expect(slotActive(evening, at(23))).toBe(true);
    expect(slotActive(evening, at(1))).toBe(true);
    expect(slotActive(evening, at(2))).toBe(false);
  });
  it("uses the start weekday for overnight slots", () => {
    const night: ScheduleSlot = { id: "n", label: "Nocka", start: "22:00", end: "06:00", location: "work.openspace", days: [5] };
    expect(slotActive(night, at(23, 0, 16))).toBe(true); // Fri 23:00
    expect(slotActive(night, at(3, 0, 17))).toBe(true); // Sat 03:00
    expect(slotActive(night, at(3, 0, 16))).toBe(false); // Fri 03:00 belongs to Thursday night
  });
});

describe("places", () => {
  it("uses the place you stand in when no slot applies", () => {
    const r = resolveScene({ now: at(20), schedule: [work], places: [home, office], position: { lat: 52.2298, lng: 21.0123 } });
    expect(r).toMatchObject({ location: "home.office", group: "home", source: "place" });
  });
  it("falls back to the park when you are not at a known place", () => {
    expect(resolveScene({ now: at(20), schedule: [], places: [home], position: { lat: 50, lng: 19 } }).location).toBe("recreation.park");
    expect(resolveScene({ now: at(20), schedule: [], places: [home] }).location).toBe("recreation.park");
  });
  it("computes distances", () => {
    expect(distanceMeters({ lat: 52.2297, lng: 21.0122 }, { lat: 52.2297, lng: 21.0122 })).toBe(0);
    const d = distanceMeters({ lat: 52.2297, lng: 21.0122 }, { lat: 52.2397, lng: 21.0122 });
    expect(d).toBeGreaterThan(1100);
    expect(d).toBeLessThan(1120);
  });
});

describe("sleep", () => {
  it("puts the pet to bed in the bedroom during the sleep window", () => {
    expect(resolveScene({ now: at(23), schedule: [work], places: [], sleepStart: "22:00" })).toMatchObject({ location: "home.bedroom", source: "sleep" });
    expect(resolveScene({ now: at(5), schedule: [], places: [], sleepStart: "22:00" }).location).toBe("home.bedroom");
  });
  it("does nothing outside the sleep window", () => {
    expect(resolveScene({ now: at(12), schedule: [], places: [], sleepStart: "22:00" }).source).toBe("default");
  });
});

describe("manual override", () => {
  it("beats everything until it expires", () => {
    const manual = { location: "recreation.gym" as const, until: at(15) };
    expect(resolveScene({ now: at(10), schedule: [work], places: [], manual })).toMatchObject({ location: "recreation.gym", source: "manual" });
    expect(resolveScene({ now: at(15, 1), schedule: [work], places: [], manual }).location).toBe("work.openspace");
  });
  it("without an end time it holds until cleared, even during sleep", () => {
    expect(resolveScene({ now: at(23), schedule: [], places: [], manual: { location: "recreation.pool" }, sleepStart: "22:00" }).location).toBe("recreation.pool");
  });
});

describe("time of day", () => {
  it("is reported next to the location and does not change it", () => {
    expect(resolveScene({ now: at(7), schedule: [], places: [] }).period.id).toBe("morning");
    expect(resolveScene({ now: at(15), schedule: [], places: [] }).period.id).toBe("afternoon");
  });
});
