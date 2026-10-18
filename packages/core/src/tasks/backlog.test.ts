import { describe, expect, it } from "vitest";
import {
  completeNextStep, goalProgress, isTaskDone, nextTask, subtaskProgress, tasksBySection, tasksOfGoal, todayProgress,
  toggleSubtask, toggleTask, toggleToday, type Backlog,
} from "../index";

const sub = (id: string, done = false) => ({ id, title: id, done });
const make = (): Backlog => ({
  sections: [{ id: "work", title: "Praca" }, { id: "kgp", title: "Korona Gór Polski" }],
  goals: [{ id: "kgp", title: "Korona Gór Polski" }],
  tasks: [
    { id: "mail", title: "Maile", done: false, sectionId: "work", today: true, subtasks: [] },
    { id: "rysy", title: "Wyjazd: Rysy", done: false, sectionId: "kgp", goalId: "kgp", today: true, subtasks: [sub("pack"), sub("route"), sub("peak")] },
    { id: "sniezka", title: "Wyjazd: Śnieżka", done: false, sectionId: "kgp", goalId: "kgp", today: false, subtasks: [sub("pack", true), sub("peak")] },
  ],
});

describe("backlog", () => {
  it("a task with subtasks is done when all subtasks are", () => {
    let b = make();
    b = toggleSubtask(b, "rysy", "pack");
    expect(subtaskProgress(b.tasks[1]!)).toEqual({ done: 1, total: 3 });
    expect(isTaskDone(b.tasks[1]!)).toBe(false);
    b = toggleSubtask(toggleSubtask(b, "rysy", "route"), "rysy", "peak");
    expect(isTaskDone(b.tasks[1]!)).toBe(true);
    expect(b.tasks[1]!.done).toBe(true);
  });
  it("toggling a task with subtasks ticks all of them, and back", () => {
    const done = toggleTask(make(), "rysy");
    expect(done.tasks[1]!.subtasks.every((s) => s.done)).toBe(true);
    expect(toggleTask(done, "rysy").tasks[1]!.subtasks.some((s) => s.done)).toBe(false);
  });
  it("plain tasks toggle their own flag", () => {
    expect(isTaskDone(toggleTask(make(), "mail").tasks[0]!)).toBe(true);
  });
  it("today list and progress follow the today flag", () => {
    let b = make();
    expect(todayProgress(b)).toEqual({ done: 0, total: 2 });
    b = toggleToday(b, "sniezka");
    expect(todayProgress(b)).toEqual({ done: 0, total: 3 });
    b = toggleTask(b, "mail");
    expect(todayProgress(b)).toEqual({ done: 1, total: 3 });
    expect(nextTask(b)?.id).toBe("rysy");
  });
  it("Zrobione finishes steps one by one, then the task", () => {
    let b = toggleTask(make(), "mail");
    b = completeNextStep(b);
    expect(subtaskProgress(b.tasks[1]!).done).toBe(1);
    b = completeNextStep(completeNextStep(b));
    expect(isTaskDone(b.tasks[1]!)).toBe(true);
    expect(completeNextStep(b)).toBe(b);
  });
  it("goal progress is the share of its tasks that are done", () => {
    let b = make();
    expect(goalProgress(b, "kgp")).toEqual({ done: 0, total: 2, percent: 0 });
    b = toggleTask(b, "sniezka");
    expect(goalProgress(b, "kgp")).toEqual({ done: 1, total: 2, percent: 50 });
    expect(tasksOfGoal(b, "kgp").map((t) => t.id)).toEqual(["rysy", "sniezka"]);
  });
  it("groups tasks by section in section order", () => {
    expect(tasksBySection(make()).map((g) => [g.section.id, g.tasks.length])).toEqual([["work", 1], ["kgp", 2]]);
  });
});
