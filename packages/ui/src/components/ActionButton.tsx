import { Icon } from "./Icon";

export interface ActionButtonProps { active?: boolean; disabled?: boolean; label?: string; onClick?: () => void }

export function ActionButton({ active, disabled, label = "Woda", onClick }: ActionButtonProps) {
  return (
    <button type="button" className={`td-action${active ? " td-action--active" : ""}`} disabled={disabled} onClick={onClick}>
      <span className="td-action__box"><Icon name="drop" /></span>
      {label}
    </button>
  );
}
