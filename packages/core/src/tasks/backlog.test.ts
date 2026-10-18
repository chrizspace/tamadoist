import { describe, expect, it } from "vitest";
import {
  sortByDateAndTime, bringBackToToday, deferOpenToTomorrow, deferToTomorrow, tomorrowTasks, addGoal, removeGoal, setTaskGoal, updateGoal, addSection, addSubtask, addTask, moveToday, removeSection, removeSubtask, removeTask, reorderToday, setTaskTime, sortTodayByTime, todayTasks,
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

describe("today order and time", () => {
  const b3 = (): Backlog => {
    const b = make();
    return { ...b, tasks: [...b.tasks, { id: "extra", title: "Extra", done: false, sectionId: "work", today: true, subtasks: [] }] };
  };
  it("follows backlog order until dragged, then the dragged order", () => {
    expect(todayTasks(b3()).map((t) => t.id)).toEqual(["mail", "rysy", "extra"]);
    expect(todayTasks(moveToday(b3(), "extra", 0)).map((t) => t.id)).toEqual(["extra", "mail", "rysy"]);
    expect(todayTasks(moveToday(b3(), "mail", 99)).map((t) => t.id)).toEqual(["rysy", "extra", "mail"]);
    expect(todayTasks(reorderToday(b3(), ["rysy", "extra", "mail"])).map((t) => t.id)).toEqual(["rysy", "extra", "mail"]);
  });
  it("the next task follows the dragged order", () => {
    expect(nextTask(moveToday(b3(), "extra", 0))?.id).toBe("extra");
  });
  it("assigns times and sorts by them, untimed last", () => {
    let b = b3();
    b = setTaskTime(setTaskTime(b, "extra", "08:00"), "rysy", "14:30");
    expect(todayTasks(sortTodayByTime(b)).map((t) => t.id)).toEqual(["extra", "rysy", "mail"]);
    expect(setTaskTime(b, "extra", undefined).tasks.find((t) => t.id === "extra")!.time).toBeUndefined();
  });
  it("taking a task off today clears its time and its place in the order", () => {
    const b = toggleToday(setTaskTime(b3(), "extra", "09:00"), "extra");
    expect(b.tasks.find((t) => t.id === "extra")!.time).toBeUndefined();
    expect(todayTasks(b).map((t) => t.id)).toEqual(["mail", "rysy"]);
    expect(todayTasks(toggleToday(b, "extra")).map((t) => t.id)).toEqual(["mail", "rysy", "extra"]);
  });
});

describe("editing the backlog", () => {
  it("adds and removes tasks and subtasks", () => {
    let b = addTask(make(), { id: "n1", title: "  Nowe  ", sectionId: "work", today: true });
    expect(b.tasks.at(-1)!.title).toBe("Nowe");
    expect(todayTasks(b).at(-1)!.id).toBe("n1");
    expect(addTask(b, { id: "n2", title: "   ", sectionId: "work" })).toBe(b);
    expect(addTask(b, { id: "n3", title: "x", sectionId: "missing" })).toBe(b);
    b = addSubtask(b, "n1", "n1-s1", "Krok");
    expect(b.tasks.at(-1)!.subtasks.map((s) => s.title)).toEqual(["Krok"]);
    expect(removeSubtask(b, "n1", "n1-s1").tasks.at(-1)!.subtasks).toEqual([]);
    b = removeTask(b, "n1");
    expect(b.tasks.some((t) => t.id === "n1")).toBe(false);
    expect(todayTasks(b).some((t) => t.id === "n1")).toBe(false);
  });
  it("creates sections and only removes empty ones", () => {
    let b = addSection(make(), "s9", " Hobby ");
    expect(b.sections.at(-1)).toEqual({ id: "s9", title: "Hobby" });
    expect(addSection(b, "s10", " ")).toBe(b);
    expect(removeSection(b, "work")).toBe(b);
    b = removeSection(b, "s9");
    expect(b.sections.map((s) => s.id)).toEqual(["work", "kgp"]);
  });
});

describe("goals", () => {
  it("creates, edits and removes goals, and links tasks to them", () => {
    let b = addGoal(make(), "g2", " Maraton ", " Przebiec 42 km ");
    expect(b.goals.at(-1)).toMatchObject({ id: "g2", title: "Maraton", description: "Przebiec 42 km" });
    expect(b.goals.at(-1)!.color).not.toBe(b.goals[0]!.color);
    expect(addGoal(b, "g3", "  ")).toBe(b);
    b = setTaskGoal(b, "mail", "g2");
    expect(goalProgress(b, "g2")).toEqual({ done: 0, total: 1, percent: 0 });
    expect(setTaskGoal(b, "mail", "nope")).toBe(b);
    b = updateGoal(b, "g2", { title: "Maraton Warszawa", description: "" });
    expect(b.goals.at(-1)).toMatchObject({ title: "Maraton Warszawa", description: undefined });
    b = removeGoal(b, "g2");
    expect(b.goals.map((g) => g.id)).toEqual(["kgp"]);
    expect(b.tasks.find((t) => t.id === "mail")!.goalId).toBeUndefined();
    expect(setTaskGoal(b, "mail", undefined).tasks.find((t) => t.id === "mail")!.goalId).toBeUndefined();
  });
});

describe("tomorrow", () => {
  it("pushes a task to tomorrow and back", () => {
    let b = setTaskTime(make(), "rysy", "10:00");
    b = deferToTomorrow(b, "rysy");
    expect(todayTasks(b).map((t) => t.id)).toEqual(["mail"]);
    expect(tomorrowTasks(b).map((t) => t.id)).toEqual(["rysy"]);
    expect(b.tasks.find((t) => t.id === "rysy")!.time).toBeUndefined();
    b = bringBackToToday(b, "rysy");
    expect(todayTasks(b).map((t) => t.id)).toEqual(["mail", "rysy"]);
    expect(tomorrowTasks(b)).toEqual([]);
  });
  it("pushes only what is not done yet", () => {
    const b = deferOpenToTomorrow(toggleTask(make(), "mail"));
    expect(todayTasks(b).map((t) => t.id)).toEqual(["mail"]);
    expect(tomorrowTasks(b).map((t) => t.id)).toEqual(["rysy"]);
    expect(todayProgress(b)).toEqual({ done: 1, total: 1 });
  });
  it("planning a task for today clears its tomorrow flag", () => {
    expect(tomorrowTasks(toggleToday(deferToTomorrow(make(), "rysy"), "rysy"))).toEqual([]);
  });
});

describe("default sort: date and time", () => {
  const withTimes = (): Backlog => {
    let b = make();
    b = { ...b, tasks: [...b.tasks, { id: "late", title: "Late", done: false, sectionId: "work", today: true, subtasks: [] }, { id: "tom", title: "Tom", done: false, sectionId: "work", today: false, tomorrow: true, subtasks: [] }] };
    return setTaskTime(setTaskTime(b, "rysy", "14:00"), "late", "08:15");
  };
  it("sorts today by time by default, untimed last", () => {
    expect(todayTasks(withTimes()).map((t) => t.id)).toEqual(["late", "rysy", "mail"]);
  });
  it("sorts by day first: today, then tomorrow, then undated", () => {
    expect(sortByDateAndTime(withTimes().tasks).map((t) => t.id)).toEqual(["late", "rysy", "mail", "tom", "sniezka"]);
  });
  it("dragging switches to a manual order; setting a time or sorting returns to date and time", () => {
    let b = moveToday(withTimes(), "mail", 0);
    expect(todayTasks(b).map((t) => t.id)).toEqual(["mail", "late", "rysy"]);
    expect(b.todayOrder).toBeDefined();
    expect(todayTasks(setTaskTime(b, "mail", "07:00")).map((t) => t.id)).toEqual(["mail", "late", "rysy"]);
    expect(setTaskTime(b, "mail", "20:00").todayOrder).toBeUndefined();
    expect(todayTasks(sortTodayByTime(b)).map((t) => t.id)).toEqual(["late", "rysy", "mail"]);
  });
  it("a new task keeps the default order when no manual order is set", () => {
    const b = addTask(withTimes(), { id: "n", title: "N", sectionId: "work", today: true });
    expect(b.todayOrder).toBeUndefined();
    expect(todayTasks(b).at(-1)!.id).toBe("n");
  });
});
