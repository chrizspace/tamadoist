import { Icon, type IconName } from "../components/Icon";

export interface ActionButtonProps { active?: boolean; disabled?: boolean; label?: string; icon?: IconName; onClick?: () => void }

export function ActionButton({ active, disabled, label = "Woda", icon = "drop", onClick }: ActionButtonProps) {
  return (
    <button type="button" className={`td-action${active ? " td-action--active" : ""}`} disabled={disabled} onClick={onClick}>
      <span className="td-action__box"><Icon name={icon} /></span>
      {label}
    </button>
  );
}
