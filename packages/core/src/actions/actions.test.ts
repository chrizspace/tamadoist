import { describe, expect, it } from "vitest";
import { ACTIONS, applyMeal, applyWater, checklistProgress, completeNext, nextOpenItem, toggleItem, availableActions, derivePetState, getAction, isActionHighlighted } from "../index";

describe("nutrition action", () => {
  it("adds and removes a glass, never below zero", () => {
    expect(applyWater(0)).toBe(250);
    expect(applyWater(500, -250)).toBe(250);
    expect(applyWater(100, -250)).toBe(0);
  });
  it("stays available while sleeping (you can drink and eat at night) and is highlighted only when tired and awake", () => {
    expect(availableActions({ sleeping: true, tired: false }).map((a) => a.id)).toEqual(["nutrition"]);
    expect(availableActions({ sleeping: false, tired: false }).map((a) => a.id)).toEqual(["nutrition", "tasks", "habits"]);
    expect(isActionHighlighted(getAction("nutrition")!, { sleeping: false, tired: true })).toBe(true);
    expect(isActionHighlighted(getAction("nutrition")!, { sleeping: true, tired: true })).toBe(false);
  });
  it("registers nutrition, tasks and habits in that order", () => {
    expect(ACTIONS.map((a) => a.id)).toEqual(["nutrition", "tasks", "habits"]);
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

describe("checklists (tasks and habits)", () => {
  const items = [
    { id: "a", title: "A", done: true },
    { id: "b", title: "B", done: false },
    { id: "c", title: "C", done: false },
  ];
  it("counts progress and finds the next open item", () => {
    expect(checklistProgress(items)).toEqual({ done: 1, total: 3 });
    expect(nextOpenItem(items)?.id).toBe("b");
  });
  it("toggles an item and completes the next one", () => {
    expect(toggleItem(items, "a")[0]!.done).toBe(false);
    expect(completeNext(items).map((i) => i.done)).toEqual([true, true, false]);
    expect(completeNext(completeNext(completeNext(items))).every((i) => i.done)).toBe(true);
    expect(nextOpenItem(completeNext(completeNext(items)))).toBeUndefined();
  });
});

describe("meals", () => {
  it("counts meals between zero and twelve", () => {
    expect(applyMeal(0)).toBe(1);
    expect(applyMeal(0, -1)).toBe(0);
    expect(applyMeal(12)).toBe(12);
  });
});
