import { isActionAvailable, type ActionContext, type ActionDef } from "./types";
import { HABITS_ACTION, TASKS_ACTION } from "./checklist";
import { WATER_ACTION } from "./water";

/** The action bar is built from this list, in this order. */
export const ACTIONS: readonly ActionDef[] = [WATER_ACTION, TASKS_ACTION, HABITS_ACTION];

export function getAction(id: string): ActionDef | undefined {
  return ACTIONS.find((a) => a.id === id);
}

export function availableActions(ctx: ActionContext): ActionDef[] {
  return ACTIONS.filter((a) => isActionAvailable(a, ctx));
}
