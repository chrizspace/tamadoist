import { describe, expect, it } from "vitest";
import {
  computeEnergy,
  energyBudgetMinutes,
  formatTime,
  isSleeping,
  parseTime,
  sleepWindow,
  waterGoalMl,
} from "../index";

const at = (h: number, m = 0) => new Date(2026, 0, 15, h, m);

describe("sleep", () => {
  it("defaults to 22:00-06:00 and is always 8h", () => {
    expect(sleepWindow()).toEqual({ start: "22:00", end: "06:00" });
    expect(sleepWindow("23:30")).toEqual({ start: "23:30", end: "07:30" });
    expect(sleepWindow("00:00")).toEqual({ start: "00:00", end: "08:00" });
  });
  it("detects sleeping across midnight", () => {
    expect(isSleeping(at(23), "22:00")).toBe(true);
    expect(isSleeping(at(3), "22:00")).toBe(true);
    expect(isSleeping(at(6), "22:00")).toBe(false);
    expect(isSleeping(at(21, 59), "22:00")).toBe(false);
  });
  it("rejects invalid times", () => {
    expect(() => parseTime("25:00")).toThrow();
    expect(formatTime(-60)).toBe("23:00");
  });
});

describe("water goal", () => {
  it("is weight * 35 ml rounded to 50", () => {
    expect(waterGoalMl(70)).toBe(2450);
    expect(waterGoalMl(63)).toBe(2200);
  });
  it("clamps and handles bad input", () => {
    expect(waterGoalMl(30)).toBe(1500);
    expect(waterGoalMl(200)).toBe(4000);
    expect(waterGoalMl(0)).toBe(1500);
    expect(waterGoalMl(NaN)).toBe(1500);
  });
});

describe("energy", () => {
  it("base energy covers 30% of the 16h active day", () => {
    expect(energyBudgetMinutes(0)).toBeCloseTo(288);
    expect(energyBudgetMinutes(1)).toBeCloseTo(960);
  });
  it("without water energy runs out at ~10:48 for 22-06 sleep", () => {
    const r = computeEnergy({ now: at(8), sleepStart: "22:00", drunkMl: 0, goalMl: 2450 });
    expect(r.energyUntil).toBe("10:48");
    expect(r.state).toBe("awake");
    expect(r.percent).toBe(58);
    expect(computeEnergy({ now: at(11), sleepStart: "22:00", drunkMl: 0, goalMl: 2450 }).state).toBe("tired");
  });
  it("water extends the bar", () => {
    const dry = computeEnergy({ now: at(10), sleepStart: "22:00", drunkMl: 0, goalMl: 2000 });
    const wet = computeEnergy({ now: at(10), sleepStart: "22:00", drunkMl: 2000, goalMl: 2000 });
    expect(wet.percent).toBeGreaterThan(dry.percent);
    expect(wet.energyUntil).toBe("22:00");
  });
  it("sleep charges the bar steadily from empty to full", () => {
    const at22 = computeEnergy({ now: at(22), sleepStart: "22:00", drunkMl: 0, goalMl: 2000 });
    const at02 = computeEnergy({ now: at(2), sleepStart: "22:00", drunkMl: 0, goalMl: 2000 });
    const at0559 = computeEnergy({ now: at(5, 59), sleepStart: "22:00", drunkMl: 0, goalMl: 2000 });
    expect(at22).toMatchObject({ state: "sleeping", percent: 0 });
    expect(at02).toMatchObject({ state: "sleeping", percent: 50 });
    expect(at0559.percent).toBe(100);
  });
  it("is continuous: no jump at bedtime or at wake-up", () => {
    const before = computeEnergy({ now: at(21, 59), sleepStart: "22:00", drunkMl: 2000, goalMl: 2000 });
    const after = computeEnergy({ now: at(22, 1), sleepStart: "22:00", drunkMl: 2000, goalMl: 2000 });
    expect(Math.abs(before.percent - after.percent)).toBeLessThanOrEqual(1);
    const lastSleep = computeEnergy({ now: at(5, 59), sleepStart: "22:00", drunkMl: 0, goalMl: 2000 });
    const wake = computeEnergy({ now: at(6), sleepStart: "22:00", drunkMl: 0, goalMl: 2000 });
    expect(wake).toMatchObject({ state: "awake", percent: 100 });
    expect(Math.abs(lastSleep.percent - wake.percent)).toBeLessThanOrEqual(1);
  });
  it("never decreases while sleeping", () => {
    let prev = -1;
    for (let m = 22 * 60; m < 24 * 60 + 6 * 60; m += 15) {
      const e = computeEnergy({ now: new Date(2026, 0, 15, Math.floor((m % 1440) / 60), m % 60), sleepStart: "22:00", drunkMl: 500, goalMl: 2000 });
      expect(e.percent).toBeGreaterThanOrEqual(prev);
      prev = e.percent;
    }
  });
  it("water above goal is capped", () => {
    expect(computeEnergy({ now: at(7), sleepStart: "22:00", drunkMl: 9999, goalMl: 2000 }).waterRatio).toBe(1);
  });
});

import { DEFAULT_PROFILE, dailyWaterGoalMl, normalizeName, validateName } from "../index";

describe("profile", () => {
  it("validates the name", () => {
    expect(validateName("")).not.toBeNull();
    expect(validateName("   ")).not.toBeNull();
    expect(validateName("Tama")).toBeNull();
    expect(validateName("x".repeat(21))).not.toBeNull();
    expect(normalizeName("  Kiwi  ")).toBe("Kiwi");
  });
  it("derives the water goal from weight unless overridden", () => {
    expect(dailyWaterGoalMl({ weightKg: 70 })).toBe(2450);
    expect(dailyWaterGoalMl({ weightKg: 70, waterGoalOverrideMl: 3000 })).toBe(3000);
    expect(DEFAULT_PROFILE.sleepStart).toBe("22:00");
  });
});
