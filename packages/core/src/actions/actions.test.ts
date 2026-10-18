import { describe, expect, it } from "vitest";
import { ACTIONS, applyWater, availableActions, derivePetState, getAction, isActionHighlighted } from "../index";

describe("water action", () => {
  it("adds and removes a glass, never below zero", () => {
    expect(applyWater(0)).toBe(250);
    expect(applyWater(500, -250)).toBe(250);
    expect(applyWater(100, -250)).toBe(0);
  });
  it("is blocked while sleeping and highlighted when tired", () => {
    expect(availableActions({ sleeping: true, tired: false })).toEqual([]);
    expect(availableActions({ sleeping: false, tired: false }).map((a) => a.id)).toEqual(["water"]);
    expect(isActionHighlighted(getAction("water")!, { sleeping: false, tired: true })).toBe(true);
    expect(isActionHighlighted(getAction("water")!, { sleeping: true, tired: true })).toBe(false);
  });
  it("is the only action for now", () => {
    expect(ACTIONS.map((a) => a.id)).toEqual(["water"]);
  });
});

describe("pet state", () => {
  it("follows the priority sleeping > tired > drinking > happy > awake", () => {
    expect(derivePetState({ energy: { state: "sleeping" }, justDrank: true })).toBe("sleeping");
    expect(derivePetState({ energy: { state: "tired" }, justDrank: true })).toBe("tired");
    expect(derivePetState({ energy: { state: "awake" }, justDrank: true, celebrating: true })).toBe("drinking");
    expect(derivePetState({ energy: { state: "awake" }, celebrating: true })).toBe("happy");
    expect(derivePetState({ energy: { state: "awake" } })).toBe("awake");
  });
});
