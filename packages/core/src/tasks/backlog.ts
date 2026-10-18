/** A step of a task, e.g. "Spakować się" inside "Wyjazd: Rysy". */
export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  /** Only used while the task has no subtasks; otherwise the task is done when all subtasks are. */
  done: boolean;
  sectionId: string;
  /** Optional link to a goal; the goal's progress is the share of its tasks that are done. */
  goalId?: string;
  /** Planned for today: these tasks make up the "today" list and the indicator. */
  today: boolean;
  /** Time of day ("HH:MM") the task is planned for; only meaningful for today's tasks. */
  time?: string;
  /** Pushed to tomorrow: off today's list, waiting for tomorrow. */
  tomorrow?: boolean;
  subtasks: Subtask[];
}

/** The backlog can be split into sections (Praca, Dom, ...). */
export interface Section {
  id: string;
  title: string;
}

/** A goal, e.g. "Korona Gór Polski", fed by tasks (26 trips, each with its own subtasks). */
export interface Goal {
  id: string;
  title: string;
  /** What the goal is about, in the user's own words. */
  description?: string;
  /** Accent color of its chips and progress bar. */
  color?: string;
}

/** Colors handed out to new goals in turn. */
export const GOAL_COLORS = ["#3C8F5A", "#D9663F", "#2A9BD8", "#8E6CD8", "#D6A21E", "#D6558A"] as const;

export interface Backlog {
  sections: Section[];
  goals: Goal[];
  tasks: Task[];
  /**
   * Manual order of today's tasks (task ids), set by dragging. While it is undefined (the default) tasks are
   * sorted by date and time. Setting a time or pressing "sort by time" drops the manual order again.
   */
  todayOrder?: string[];
}

export interface Progress {
  done: number;
  total: number;
}

export const isTaskDone = (t: Task): boolean => (t.subtasks.length > 0 ? t.subtasks.every((s) => s.done) : t.done);

export function subtaskProgress(t: Task): Progress {
  return { done: t.subtasks.filter((s) => s.done).length, total: t.subtasks.length };
}

function mapTask(b: Backlog, id: string, fn: (t: Task) => Task): Backlog {
  return { ...b, tasks: b.tasks.map((t) => (t.id === id ? fn(t) : t)) };
}

/** Ticks a task off or back. A task with subtasks ticks all of them. */
export function toggleTask(b: Backlog, id: string): Backlog {
  return mapTask(b, id, (t) => {
    const next = !isTaskDone(t);
    return t.subtasks.length > 0
      ? { ...t, done: next, subtasks: t.subtasks.map((s) => ({ ...s, done: next })) }
      : { ...t, done: next };
  });
}

export function toggleSubtask(b: Backlog, taskId: string, subtaskId: string): Backlog {
  return mapTask(b, taskId, (t) => {
    const subtasks = t.subtasks.map((s) => (s.id === subtaskId ? { ...s, done: !s.done } : s));
    return { ...t, subtasks, done: subtasks.length > 0 && subtasks.every((s) => s.done) };
  });
}

/** Plans a task for today or takes it off today's list (clearing its time). */
export function toggleToday(b: Backlog, id: string): Backlog {
  const task = b.tasks.find((t) => t.id === id);
  if (!task) return b;
  const todayOrder = keepManual(b, (o) => (task.today ? o.filter((x) => x !== id) : [...o, id]));
  return { ...mapTask(b, id, (t) => ({ ...t, today: !t.today, tomorrow: false, time: t.today ? undefined : t.time })), todayOrder };
}

export const tomorrowTasks = (b: Backlog): Task[] => sortByDateAndTime(b.tasks.filter((t) => t.tomorrow && !t.today));

/** Pushes a task from today to tomorrow (clearing its time and its place in today's order). */
export function deferToTomorrow(b: Backlog, id: string): Backlog {
  const task = b.tasks.find((t) => t.id === id);
  if (!task) return b;
  return { ...mapTask(b, id, (t) => ({ ...t, today: false, tomorrow: true, time: undefined })), todayOrder: b.todayOrder?.filter((x) => x !== id) };
}

/** The "push to tomorrow" button at the bottom: moves everything from today that is not done yet. */
export function deferOpenToTomorrow(b: Backlog): Backlog {
  return todayTasks(b).filter((t) => !isTaskDone(t)).reduce((acc, t) => deferToTomorrow(acc, t.id), b);
}

/** Brings a task back from tomorrow to the end of today's list. */
export function bringBackToToday(b: Backlog, id: string): Backlog {
  const task = b.tasks.find((t) => t.id === id);
  if (!task || task.today) return b;
  return { ...mapTask(b, id, (t) => ({ ...t, today: true, tomorrow: false })), todayOrder: keepManual(b, (o) => [...o, id]) };
}

/** Moves a task of today's list to a new position (what drag and drop does). */
export function moveToday(b: Backlog, id: string, toIndex: number): Backlog {
  const order = todayTasks(b).map((t) => t.id);
  const from = order.indexOf(id);
  if (from === -1) return b;
  order.splice(from, 1);
  order.splice(Math.max(0, Math.min(order.length, toIndex)), 0, id);
  return { ...b, todayOrder: order };
}

/** Sets the whole order of today's list at once (the result of a drag gesture). */
export function reorderToday(b: Backlog, ids: string[]): Backlog {
  const known = new Set(todayTasks(b).map((t) => t.id));
  const order = [...ids.filter((id) => known.has(id)), ...todayTasks(b).map((t) => t.id).filter((id) => !ids.includes(id))];
  return { ...b, todayOrder: order };
}

/** Assigns a task to a time of day ("HH:MM"), or clears it with undefined. Today's list goes back to sorting by time. */
export function setTaskTime(b: Backlog, id: string, time: string | undefined): Backlog {
  return { ...mapTask(b, id, (t) => ({ ...t, time: time || undefined })), todayOrder: undefined };
}

/** Drops the manual order: today's list goes back to the default sort by date and time. */
export function sortTodayByTime(b: Backlog): Backlog {
  return { ...b, todayOrder: undefined };
}

/** Adds a task to a section (optionally linked to a goal and planned for today). The caller supplies the id. */
export function addTask(b: Backlog, input: { id: string; title: string; sectionId: string; goalId?: string; today?: boolean; time?: string }): Backlog {
  const title = input.title.trim();
  if (!title || !b.sections.some((s) => s.id === input.sectionId)) return b;
  const task: Task = { id: input.id, title, done: false, sectionId: input.sectionId, goalId: input.goalId, today: Boolean(input.today), time: input.time, subtasks: [] };
  return { ...b, tasks: [...b.tasks, task], todayOrder: input.today ? keepManual(b, (o) => [...o, input.id]) : b.todayOrder };
}

export function removeTask(b: Backlog, id: string): Backlog {
  return { ...b, tasks: b.tasks.filter((t) => t.id !== id), todayOrder: b.todayOrder?.filter((x) => x !== id) };
}

export function addSubtask(b: Backlog, taskId: string, id: string, title: string): Backlog {
  const clean = title.trim();
  if (!clean) return b;
  return mapTask(b, taskId, (t) => ({ ...t, done: false, subtasks: [...t.subtasks, { id, title: clean, done: false }] }));
}

export function removeSubtask(b: Backlog, taskId: string, subtaskId: string): Backlog {
  return mapTask(b, taskId, (t) => {
    const subtasks = t.subtasks.filter((s) => s.id !== subtaskId);
    return { ...t, subtasks, done: subtasks.length > 0 ? subtasks.every((s) => s.done) : t.done };
  });
}

/** Creates a section; blank names are ignored. The caller supplies the id. */
export function addSection(b: Backlog, id: string, title: string): Backlog {
  const clean = title.trim();
  if (!clean) return b;
  return { ...b, sections: [...b.sections, { id, title: clean }] };
}

/** Removes a section, but only an empty one, so no task is lost by accident. */
export function removeSection(b: Backlog, id: string): Backlog {
  if (b.tasks.some((t) => t.sectionId === id)) return b;
  return { ...b, sections: b.sections.filter((s) => s.id !== id) };
}

const dayRank = (t: Task): number => (t.today ? 0 : t.tomorrow ? 1 : 2);

/** Default sort: date (today, tomorrow, undated), then time of day (untimed last), keeping the original order on ties. */
export function sortByDateAndTime(tasks: readonly Task[]): Task[] {
  return tasks
    .map((t, i) => ({ t, i }))
    .sort((a, c) => dayRank(a.t) - dayRank(c.t) || (a.t.time ?? "99:99").localeCompare(c.t.time ?? "99:99") || a.i - c.i)
    .map((x) => x.t);
}

/** Today's tasks: by time by default, or in the order the user dragged them into. */
export function todayTasks(b: Backlog): Task[] {
  const today = b.tasks.filter((t) => t.today);
  const order = b.todayOrder;
  if (!order) return sortByDateAndTime(today);
  const rank = (id: string) => {
    const i = order.indexOf(id);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  return today.map((t, i) => ({ t, i })).sort((a, c) => rank(a.t.id) - rank(c.t.id) || a.i - c.i).map((x) => x.t);
}

/** Keeps a manual order up to date; does nothing in the default (date and time) mode. */
const keepManual = (b: Backlog, fn: (order: string[]) => string[]): string[] | undefined => (b.todayOrder ? fn(todayTasks(b).map((t) => t.id)) : undefined);

export function todayProgress(b: Backlog): Progress {
  const today = todayTasks(b);
  return { done: today.filter(isTaskDone).length, total: today.length };
}

/** The first of today's tasks that is not done yet. */
export const nextTask = (b: Backlog): Task | undefined => todayTasks(b).find((t) => !isTaskDone(t));

/** The first open step of a task (its first open subtask), if it has any. */
export const nextStep = (t: Task): Subtask | undefined => t.subtasks.find((s) => !s.done);

/** The "Zrobione" button: finishes the next open step of the next task, or the task itself when it has no steps. */
export function completeNextStep(b: Backlog): Backlog {
  const task = nextTask(b);
  if (!task) return b;
  const step = nextStep(task);
  return step ? toggleSubtask(b, task.id, step.id) : toggleTask(b, task.id);
}

export function goalProgress(b: Backlog, goalId: string): Progress & { percent: number } {
  const tasks = b.tasks.filter((t) => t.goalId === goalId);
  const done = tasks.filter(isTaskDone).length;
  return { done, total: tasks.length, percent: tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0 };
}

/** Tasks grouped by section, in the order of the sections; sections without tasks are kept (empty lists). */
export function tasksBySection(b: Backlog): { section: Section; tasks: Task[] }[] {
  return b.sections.map((section) => ({ section, tasks: sortByDateAndTime(b.tasks.filter((t) => t.sectionId === section.id)) }));
}

export const tasksOfGoal = (b: Backlog, goalId: string): Task[] => sortByDateAndTime(b.tasks.filter((t) => t.goalId === goalId));

/** Creates a goal (a parent aim that tasks can be linked to). Blank titles are ignored; the caller supplies the id. */
export function addGoal(b: Backlog, id: string, title: string, description?: string): Backlog {
  const clean = title.trim();
  if (!clean) return b;
  const goal: Goal = { id, title: clean, description: description?.trim() || undefined, color: GOAL_COLORS[b.goals.length % GOAL_COLORS.length] };
  return { ...b, goals: [...b.goals, goal] };
}

export function updateGoal(b: Backlog, id: string, patch: { title?: string; description?: string }): Backlog {
  return {
    ...b,
    goals: b.goals.map((g) => {
      if (g.id !== id) return g;
      const title = patch.title !== undefined ? patch.title.trim() || g.title : g.title;
      const description = patch.description !== undefined ? patch.description.trim() || undefined : g.description;
      return { ...g, title, description };
    }),
  };
}

/** Removes a goal; its tasks stay in the backlog, just without the link. */
export function removeGoal(b: Backlog, id: string): Backlog {
  return { ...b, goals: b.goals.filter((g) => g.id !== id), tasks: b.tasks.map((t) => (t.goalId === id ? { ...t, goalId: undefined } : t)) };
}

/** Links a task to a goal, or unlinks it with undefined. */
export function setTaskGoal(b: Backlog, taskId: string, goalId: string | undefined): Backlog {
  if (goalId !== undefined && !b.goals.some((g) => g.id === goalId)) return b;
  return mapTask(b, taskId, (t) => ({ ...t, goalId }));
}
