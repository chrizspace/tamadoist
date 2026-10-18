import type { ActionDef } from "./types";

export const TASKS_ACTION: ActionDef = {
  id: "tasks",
  label: "Zadania",
  icon: "list",
  screen: "tasks",
  /** Tasks wait for the morning: no ticking things off while the character sleeps. */
  blockedWhenSleeping: true,
  highlightedWhenTired: false,
};

export const HABITS_ACTION: ActionDef = {
  id: "habits",
  label: "Nawyki",
  icon: "repeat",
  screen: "habits",
  blockedWhenSleeping: true,
  highlightedWhenTired: false,
};

/** A task for today or a habit to keep the streak alive. */
export interface ChecklistItem {
  id: string;
  title: string;
  done: boolean;
}

export function checklistProgress(items: readonly ChecklistItem[]): { done: number; total: number } {
  return { done: items.filter((i) => i.done).length, total: items.length };
}

/** The first item that is not done yet, if any. */
export function nextOpenItem<T extends ChecklistItem>(items: readonly T[]): T | undefined {
  return items.find((i) => !i.done);
}

export function toggleItem<T extends ChecklistItem>(items: readonly T[], id: string): T[] {
  return items.map((i) => (i.id === id ? { ...i, done: !i.done } : i));
}

/** Marks the first open item as done (the "Zrobione" button). */
export function completeNext<T extends ChecklistItem>(items: readonly T[]): T[] {
  const next = nextOpenItem(items);
  return next ? toggleItem(items, next.id) : [...items];
}
