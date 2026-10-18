import { Battery } from "./Battery";
import { IconButton } from "./IconButton";

export interface HeaderBarProps {
  left?: "menu" | "menu-back" | "close" | "none";
  title?: string;
  /** Energy 0-100, shown on the right. */
  percent: number;
  ghost?: boolean;
  onMenu?: () => void;
  onBack?: () => void;
  onClose?: () => void;
}

/** Left: hamburger (+ back), center: title, right: energy indicator. */
export function HeaderBar({ left = "menu", title = "Zielona Łąka", percent, ghost, onMenu, onBack, onClose }: HeaderBarProps) {
  return (
    <div className="td-header">
      <div className={`td-header__left${ghost ? " td-ghost" : ""}`}>
        {(left === "menu" || left === "menu-back") && <IconButton icon="menu" label="Menu" onClick={onMenu} />}
        {left === "menu-back" && <IconButton icon="back" label="Wstecz" onClick={onBack} />}
        {left === "close" && <IconButton icon="close" label="Zamknij menu" onClick={onClose} />}
      </div>
      <div className="td-header__title">{title}</div>
      <div className="td-header__right"><Battery percent={percent} /></div>
    </div>
  );
}
