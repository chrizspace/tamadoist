import { EnergyChip } from "../character/EnergyChip";
import { Icon } from "./Icon";
import { IconButton } from "./IconButton";

export interface HeaderBarProps {
  /** Exactly one button on the left: menu on top-level screens, back on sub-pages, close while the menu is open. */
  left?: "menu" | "back" | "close" | "none";
  title?: string;
  /** Energy 0-100, shown on the right. */
  percent: number;
  ghost?: boolean;
  /** When set the title is a button that opens the scene picker. */
  onTitle?: () => void;
  onMenu?: () => void;
  onBack?: () => void;
  onClose?: () => void;
  /** When set the energy indicator is pressable (3D) and opens the energy details. */
  onEnergy?: () => void;
}

/** Left: one button (hamburger, back or close), center: title, right: energy indicator. */
export function HeaderBar({ left = "menu", title = "Zielona Łąka", percent, ghost, onTitle, onMenu, onBack, onClose, onEnergy }: HeaderBarProps) {
  return (
    <div className="td-header">
      <div className={`td-header__left${ghost ? " td-ghost" : ""}`}>
        {left === "menu" && <IconButton icon="menu" label="Menu" onClick={onMenu} />}
        {left === "back" && <IconButton icon="back" label="Wstecz" onClick={onBack} />}
        {left === "close" && <IconButton icon="close" label="Zamknij menu" onClick={onClose} />}
      </div>
      {onTitle ? (
        <button type="button" className="td-header__title td-header__title--btn" onClick={onTitle} aria-label={`Scena: ${title}. Zmień scenę`}>
          {title}<Icon name="chevronDown" />
        </button>
      ) : (
        <div className="td-header__title">{title}</div>
      )}
      <div className="td-header__right"><EnergyChip percent={percent} onClick={onEnergy} /></div>
    </div>
  );
}
