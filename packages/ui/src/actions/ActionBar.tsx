import { ACTIONS, isActionAvailable, isActionHighlighted, type ActionContext, type Need } from "@tamadoist/core";
import type { IconName } from "../components/Icon";
import { ActionButton } from "./ActionButton";

export interface ActionBarProps {
  context: ActionContext;
  /** Nearest need of the character; the "Zadbaj" button shows its icon (drink, eat or sleep). */
  need?: Need;
  onAction?: (id: string) => void;
}

export const NEED_ICON: Record<Need, IconName> = { drink: "drop", eat: "utensils", sleep: "moon" };
const NEED_HINT: Record<Need, string> = { drink: "pora na picie", eat: "pora na jedzenie", sleep: "pora na sen" };

/** Built from the actions registry in core: add an action there and it shows up here. */
export function ActionBar({ context, need, onAction }: ActionBarProps) {
  return (
    <div className="td-actionbar">
      {ACTIONS.map((a) => (
        <ActionButton
          key={a.id}
          label={a.label}
          icon={a.id === "nutrition" && need ? NEED_ICON[need] : (a.icon as IconName)}
          hint={a.id === "nutrition" && need ? NEED_HINT[need] : undefined}
          active={isActionHighlighted(a, context)}
          disabled={!isActionAvailable(a, context)}
          onClick={() => onAction?.(a.id)}
        />
      ))}
    </div>
  );
}
