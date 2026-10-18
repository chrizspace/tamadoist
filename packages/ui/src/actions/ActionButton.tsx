import { Icon, type IconName } from "../components/Icon";

export interface ActionButtonProps { active?: boolean; disabled?: boolean; label?: string; icon?: IconName; /** Spoken hint, e.g. "pora na picie". */ hint?: string; onClick?: () => void }

export function ActionButton({ active, disabled, label = "Woda", icon = "drop", hint, onClick }: ActionButtonProps) {
  return (
    <button type="button" className={`td-action${active ? " td-action--active" : ""}`} disabled={disabled} aria-label={hint ? `${label}: ${hint}` : undefined} onClick={onClick}>
      <span className="td-action__box"><span key={icon} className="td-action__icon"><Icon name={icon} /></span></span>
      {label}
    </button>
  );
}
