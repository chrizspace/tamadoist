import { ACTIONS, isActionAvailable, isActionHighlighted, type ActionContext } from "@tamadoist/core";
import { ActionButton } from "./ActionButton";

export interface ActionBarProps {
  context: ActionContext;
  onAction?: (id: string) => void;
}

/** Built from the actions registry in core: add an action there and it shows up here. */
export function ActionBar({ context, onAction }: ActionBarProps) {
  return (
    <div className="td-actionbar">
      {ACTIONS.map((a) => (
        <ActionButton
          key={a.id}
          label={a.label}
          icon={a.icon as "drop"}
          active={isActionHighlighted(a, context)}
          disabled={!isActionAvailable(a, context)}
          onClick={() => onAction?.(a.id)}
        />
      ))}
    </div>
  );
}
