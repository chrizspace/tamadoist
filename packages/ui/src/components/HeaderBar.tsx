import { IndicatorBar, IndicatorDial, IndicatorRail, useIndicatorsLayout } from "../character/Indicators";
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
  onTasks?: () => void;
  onStreak?: () => void;
  /** Show the indicator rail under the bar (scene screens). Off on full-content screens. */
  rail?: boolean;
}

/** Left: one button (hamburger, back or close), center: title, right: indicators, either one capsule here ("bar") or a rail under the bar ("rail", see IndicatorsLayoutContext). */
export function HeaderBar({ left = "menu", title = "Zielona Łąka", percent, ghost, onTitle, onMenu, onBack, onClose, onEnergy, onTasks, onStreak, rail = true }: HeaderBarProps) {
  const layout = useIndicatorsLayout();
  return (
    <>
    <div className="td-header">
      <div className={`td-header__left${ghost ? " td-ghost" : ""}`}>
        {left === "menu" && <IconButton icon="menu" label="Menu" onClick={onMenu} />}
        {left === "back" && <IconButton icon="back" label="Wstecz" onClick={onBack} />}
        {left === "close" && <IconButton icon="close" label="Zamknij menu" onClick={onClose} />}
      </div>
      {onTitle ? (
        <button type="button" className="td-header__title td-header__title--btn" onClick={onTitle} aria-label={`Scena: ${title}. Zmień scenę`}>
          <span className="td-header__label">{title}</span><Icon name="chevronDown" />
        </button>
      ) : (
        <div className="td-header__title">{title}</div>
      )}
      <div className="td-header__right">{rail && layout === "bar" && <IndicatorBar energyPercent={percent} onEnergy={onEnergy} onTasks={onTasks} onStreak={onStreak} />}
      {rail && layout === "dial" && <IndicatorDial energyPercent={percent} onEnergy={onEnergy} onTasks={onTasks} onStreak={onStreak} />}</div>
    </div>
    {rail && layout === "rail" && <IndicatorRail energyPercent={percent} onEnergy={onEnergy} onTasks={onTasks} onStreak={onStreak} />}
    </>
  );
}
