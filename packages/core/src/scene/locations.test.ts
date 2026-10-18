import { describe, expect, it } from "vitest";
import { LOCATIONS, LOCATION_GROUPS, getLocation, locationsOf } from "../index";

describe("locations", () => {
  it("has the three groups with their rooms", () => {
    expect(locationsOf("home").map((l) => l.label)).toEqual(["Sypialnia", "Biuro domowe", "Kuchnia"]);
    expect(locationsOf("work").map((l) => l.label)).toEqual(["Open space", "Kuchnia w pracy"]);
    expect(locationsOf("recreation").map((l) => l.label)).toEqual(["Park", "Basen", "Siłownia", "Rower"]);
  });
  it("every location id is prefixed by its group and unique", () => {
    for (const l of LOCATIONS) expect(l.id.startsWith(l.group + ".")).toBe(true);
    expect(new Set(LOCATIONS.map((l) => l.id)).size).toBe(LOCATIONS.length);
  });
  it("group defaults point into the same group", () => {
    for (const g of LOCATION_GROUPS) expect(getLocation(g.defaultLocation).group).toBe(g.id);
  });
});
