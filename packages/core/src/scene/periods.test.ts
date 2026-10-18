import { describe, expect, it } from "vitest";
import { PERIODS, periodAtMinutes } from "../index";

const m = (h: number, min = 0) => h * 60 + min;

describe("periods", () => {
  it("cover the whole day without gaps", () => {
    for (let t = 0; t < 1440; t += 5) expect(periodAtMinutes(t)).toBeDefined();
  });
  it("maps the boundaries", () => {
    expect(periodAtMinutes(m(6)).id).toBe("morning");
    expect(periodAtMinutes(m(9, 59)).id).toBe("morning");
    expect(periodAtMinutes(m(10)).id).toBe("noon");
    expect(periodAtMinutes(m(14)).id).toBe("afternoon");
    expect(periodAtMinutes(m(18)).id).toBe("evening");
    expect(periodAtMinutes(m(22)).id).toBe("lateNight");
    expect(periodAtMinutes(m(23, 59)).id).toBe("lateNight");
    expect(periodAtMinutes(m(0)).id).toBe("night");
    expect(periodAtMinutes(m(5, 59)).id).toBe("night");
  });
  it("switches artificial light on from the evening until the morning", () => {
    const lit = PERIODS.filter((p) => p.artificialLight).map((p) => p.id);
    expect(lit).toEqual(["evening", "lateNight", "night"]);
  });
});
