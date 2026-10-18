export interface ActionContext {
  sleeping: boolean;
  tired: boolean;
}

export interface ActionDef {
  id: string;
  label: string;
  /** Name of an icon in the UI package. */
  icon: string;
  /** Screen the action opens. */
  screen: string;
  blockedWhenSleeping: boolean;
  /** A tired character should be nudged toward this action. */
  highlightedWhenTired: boolean;
}

export function isActionAvailable(def: ActionDef, ctx: ActionContext): boolean {
  return !(def.blockedWhenSleeping && ctx.sleeping);
}

export function isActionHighlighted(def: ActionDef, ctx: ActionContext): boolean {
  return def.highlightedWhenTired && ctx.tired && !ctx.sleeping;
}
