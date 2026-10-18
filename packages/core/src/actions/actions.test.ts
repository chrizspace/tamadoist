import { describe, expect, it } from "vitest";
import { predictNeed, ACTIONS, applyMeal, applyWater, checklistProgress, completeNext, nextOpenItem, toggleItem, availableActions, derivePetState, getAction, isActionHighlighted } from "../index";

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

describe("predictNeed (icon of the Zadbaj action)", () => {
  const base = { sleepStart: "22:00", sleepEnd: "06:00", sleeping: false, drunkMl: 0, goalMl: 2450, meals: 0, mealsGoal: 4 };
  it("starts the day with drinking (tie goes to water)", () => {
    expect(predictNeed({ ...base, minutes: 8 * 60 }).need).toBe("drink");
  });
  it("asks for food when meals are further behind than water", () => {
    expect(predictNeed({ ...base, minutes: 12 * 60, drunkMl: 1100, meals: 1 }).need).toBe("eat");
  });
  it("asks for water when water is further behind than meals", () => {
    expect(predictNeed({ ...base, minutes: 15 * 60, drunkMl: 500, meals: 3 }).need).toBe("drink");
  });
  it("switches to sleep within an hour of bedtime and while sleeping", () => {
    expect(predictNeed({ ...base, minutes: 21 * 60 + 15 }).need).toBe("sleep");
    expect(predictNeed({ ...base, minutes: 2 * 60, sleeping: true }).need).toBe("sleep");
    expect(predictNeed({ ...base, minutes: 20 * 60 }).need).not.toBe("sleep");
  });
  it("follows a non-default bedtime", () => {
    expect(predictNeed({ ...base, sleepStart: "00:00", sleepEnd: "08:00", minutes: 23 * 60 + 30 }).need).toBe("sleep");
    expect(predictNeed({ ...base, sleepStart: "00:00", sleepEnd: "08:00", minutes: 21 * 60 }).need).not.toBe("sleep");
  });
});
