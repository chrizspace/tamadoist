import { Battery } from "./Battery";
import { Icon } from "./Icon";
import { IconButton } from "./IconButton";

export interface HeaderBarProps {
  left?: "menu" | "menu-back" | "close" | "none";
  title?: string;
  /** Energy 0-100, shown on the right. */
  percent: number;
  ghost?: boolean;
  /** When set the title is a button that opens the scene picker. */
  onTitle?: () => void;
  onMenu?: () => void;
  onBack?: () => void;
  onClose?: () => void;
}

/** Left: hamburger (+ back), center: title, right: energy indicator. */
export function HeaderBar({ left = "menu", title = "Zielona Łąka", percent, ghost, onTitle, onMenu, onBack, onClose }: HeaderBarProps) {
  return (
    <div className="td-header">
      <div className={`td-header__left${ghost ? " td-ghost" : ""}`}>
        {(left === "menu" || left === "menu-back") && <IconButton icon="menu" label="Menu" onClick={onMenu} />}
        {left === "menu-back" && <IconButton icon="back" label="Wstecz" onClick={onBack} />}
        {left === "close" && <IconButton icon="close" label="Zamknij menu" onClick={onClose} />}
      </div>
      {onTitle ? (
        <button type="button" className="td-header__title td-header__title--btn" onClick={onTitle} aria-label={`Scena: ${title}. Zmień scenę`}>
          {title}<Icon name="chevronDown" />
        </button>
      ) : (
        <div className="td-header__title">{title}</div>
      )}
      <div className="td-header__right"><Battery percent={percent} /></div>
    </div>
  );
}
