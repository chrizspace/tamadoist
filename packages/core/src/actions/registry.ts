import { isActionAvailable, type ActionContext, type ActionDef } from "./types";
import { WATER_ACTION } from "./water";

/** The action bar is built from this list. For now there is one action, water. */
export const ACTIONS: readonly ActionDef[] = [WATER_ACTION];

export function getAction(id: string): ActionDef | undefined {
  return ACTIONS.find((a) => a.id === id);
}

export function availableActions(ctx: ActionContext): ActionDef[] {
  return ACTIONS.filter((a) => isActionAvailable(a, ctx));
}
