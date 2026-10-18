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
  /** Accent color of its chips and progress bar. */
  color?: string;
}

export interface Backlog {
  sections: Section[];
  goals: Goal[];
  tasks: Task[];
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

export function toggleToday(b: Backlog, id: string): Backlog {
  return mapTask(b, id, (t) => ({ ...t, today: !t.today }));
}

export const todayTasks = (b: Backlog): Task[] => b.tasks.filter((t) => t.today);

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
  return b.sections.map((section) => ({ section, tasks: b.tasks.filter((t) => t.sectionId === section.id) }));
}

export const tasksOfGoal = (b: Backlog, goalId: string): Task[] => b.tasks.filter((t) => t.goalId === goalId);
