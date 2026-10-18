import { createContext, useContext, useState, type ReactNode } from "react";
import { Icon } from "../components/Icon";

export type EnergyRange = "0%" | "1–24%" | "25–49%" | "50–74%" | "75–100%";

export function energyRange(percent: number): EnergyRange {
  const p = Math.round(percent);
  return p <= 0 ? "0%" : p < 25 ? "1–24%" : p < 50 ? "25–49%" : p < 75 ? "50–74%" : "75–100%";
}

/** Ring color for energy: below 25% red, 25–49% yellow, 50–100% green. */
export function energyColor(percent: number): string {
  return percent < 25 ? "#FF5A5F" : percent < 50 ? "#FFB400" : "#1FBF8F";
}

export const INDICATOR_COLORS = { tasks: "#7C84D6", streak: "#FF8A3D" } as const;

const GLYPHS = {
  bolt: "M13.2 2 4.5 13.6h6.2L9.8 22l9.7-12.2h-6.3z",
  check: "M9.3 17.4 4.9 13 2.4 15.5l6.9 6.9L22 8.7 19.5 6.2z",
  flame: "M12 2c1 3.5 5.5 5.7 5.5 11a5.5 5.5 0 0 1-11 0c0-2 1-3.4 2-4.5.2 1.6 1 2.4 1.8 2.6C10 8.6 10.5 5 12 2z",
} as const;

export type IndicatorGlyph = keyof typeof GLYPHS;

export interface IndicatorChipProps {
  glyph: IndicatorGlyph;
  /** 0..1, how much of the ring is filled. */
  progress: number;
  color: string;
  /** Small number in the corner. */
  badge?: string | number;
  label: string;
  /** When set the chip is a pressable (3D) button. */
  onClick?: () => void;
}

const R = 17;
const C = 2 * Math.PI * R;

/**
 * Round indicator: a progress ring around a glyph, on a small white chip with a gray lip.
 * The header holds up to three of them (energy, tasks done today and a third one).
 */
function Ring({ glyph, progress, color, size = 44 }: { glyph: IndicatorGlyph; progress: number; color: string; size?: number }) {
  const v = Math.max(0, Math.min(1, progress));
  return (
    <svg viewBox="0 0 44 44" width={size} height={size} aria-hidden="true">
      <circle cx="22" cy="22" r={R} fill="none" stroke="#E4EAE8" strokeWidth="4.5" />
      {v > 0 && <circle cx="22" cy="22" r={R} fill="none" stroke={color} strokeWidth="4.5" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - v)} transform="rotate(-90 22 22)" />}
      <g transform="translate(11.5 11.5) scale(0.875)"><path d={GLYPHS[glyph]} fill={color} /></g>
    </svg>
  );
}

export function IndicatorChip({ glyph, progress, color, badge, label, onClick }: IndicatorChipProps) {
  const v = Math.max(0, Math.min(1, progress));
  const body = (
    <>
      <svg viewBox="0 0 44 44" width="44" height="44" aria-hidden="true">
        <circle cx="22" cy="22" r={R} fill="none" stroke="#E4EAE8" strokeWidth="4.5" />
        {v > 0 && <circle cx="22" cy="22" r={R} fill="none" stroke={color} strokeWidth="4.5" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - v)} transform="rotate(-90 22 22)" />}
        <g transform="translate(11.5 11.5) scale(0.875)"><path d={GLYPHS[glyph]} fill={color} /></g>
      </svg>
      {badge !== undefined && <span className="td-ichip__badge">{badge}</span>}
    </>
  );
  return onClick ? (
    <button type="button" className="td-ichip" onClick={onClick} aria-label={`${label}. Pokaż szczegóły`}>{body}</button>
  ) : (
    <div className="td-ichip" role="img" aria-label={label}>{body}</div>
  );
}

export function EnergyIndicator({ percent, onClick }: { percent: number; onClick?: () => void }) {
  const p = Math.max(0, Math.min(100, Math.round(percent)));
  return <IndicatorChip glyph="bolt" progress={p / 100} color={energyColor(p)} badge={p} label={`Energia ${p}%`} onClick={onClick} />;
}

/** Tasks finished today out of today's tasks, e.g. 3/10; the ring is the share done. */
export function TasksIndicator({ done, total, onClick }: { done: number; total: number; onClick?: () => void }) {
  const progress = total > 0 ? Math.min(1, done / total) : 0;
  return <IndicatorChip glyph="check" progress={progress} color={INDICATOR_COLORS.tasks} badge={`${done}/${total}`} label={`Zadania na dziś: ${done} z ${total}`} onClick={onClick} />;
}

/** Proposed third indicator: days in a row with the daily goals met; the ring is today's progress. */
export function StreakIndicator({ days, progress, onClick }: { days: number; progress: number; onClick?: () => void }) {
  return <IndicatorChip glyph="flame" progress={progress} color={INDICATOR_COLORS.streak} badge={days} label={`Seria ${days} dni, dziś ${Math.round(progress * 100)}%`} onClick={onClick} />;
}

export interface ExtraIndicators {
  tasks?: { done: number; total: number };
  streak?: { days: number; progress: number };
}

/** Lets every screen's header show the extra indicators without passing them through each screen. */
/** Placeholder values until tasks and streak are real: the rail always shows all three slots. */
export const PLACEHOLDER_INDICATORS: ExtraIndicators = { tasks: { done: 6, total: 10 }, streak: { days: 12, progress: 0.7 } };
export const IndicatorsContext = createContext<ExtraIndicators>(PLACEHOLDER_INDICATORS);
export const useExtraIndicators = () => useContext(IndicatorsContext);
export const IndicatorsProvider = ({ value, children }: { value: ExtraIndicators; children: ReactNode }) => <IndicatorsContext.Provider value={value}>{children}</IndicatorsContext.Provider>;

export interface IndicatorClusterProps {
  energyPercent: number;
  onEnergy?: () => void;
  onTasks?: () => void;
  onStreak?: () => void;
}

export interface IndicatorClusterProps {
  energyPercent: number;
  onEnergy?: () => void;
  onTasks?: () => void;
  onStreak?: () => void;
}

/** Energy always, then tasks done today and streak when the app provides them. `collapsed` hides everything but energy. */
export function IndicatorCluster({ energyPercent, onEnergy, onTasks, onStreak, collapsed }: IndicatorClusterProps & { collapsed?: boolean }) {
  const extra = useExtraIndicators();
  return (
    <div className="td-indicators">
      <EnergyIndicator percent={energyPercent} onClick={onEnergy} />
      <div className={`td-indicators__more${collapsed ? " is-collapsed" : ""}`} aria-hidden={collapsed || undefined} inert={collapsed || undefined}>
        {extra.tasks && <TasksIndicator {...extra.tasks} onClick={onTasks} />}
        {extra.streak && <StreakIndicator {...extra.streak} onClick={onStreak} />}
      </div>
    </div>
  );
}

/**
 * Vertical HUD rail on the right edge, starting on the top bar line (level with the menu button):
 * up to three round indicators stacked, with a green toggle underneath that folds all but energy away.
 */
export function IndicatorRail({ defaultCollapsed = false, ...props }: IndicatorClusterProps & { defaultCollapsed?: boolean }) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const extra = useExtraIndicators();
  const hasMore = Boolean(extra.tasks || extra.streak);
  return (
    <div className="td-rail">
      <IndicatorCluster {...props} collapsed={collapsed} />
      {hasMore && (
        <button type="button" className={`td-railtoggle${collapsed ? " is-collapsed" : ""}`} aria-expanded={!collapsed} aria-label={collapsed ? "Rozwiń wskaźniki" : "Zwiń wskaźniki"} onClick={() => setCollapsed((v) => !v)}>
          <Icon name="chevronDown" />
        </button>
      )}
    </div>
  );
}

/* ---------------- Horizontal variant: one capsule with all three ---------------- */

export type IndicatorsLayout = "dial" | "bar" | "rail";
/** "dial": one round chip with three dots to switch (default). "bar": one horizontal capsule. "rail": round chips stacked on the right edge. */
export const IndicatorsLayoutContext = createContext<IndicatorsLayout>("dial");
export const useIndicatorsLayout = () => useContext(IndicatorsLayoutContext);

interface SegmentProps { glyph: IndicatorGlyph; progress: number; color: string; value: string | number; label: string; onClick?: () => void }

function Segment({ glyph, progress, color, value, label, onClick }: SegmentProps) {
  const body = (<><Ring glyph={glyph} progress={progress} color={color} size={22} /><b>{value}</b></>);
  return onClick ? (
    <button type="button" className="td-ibar__seg" onClick={onClick} aria-label={`${label}. Pokaż szczegóły`}>{body}</button>
  ) : (
    <span className="td-ibar__seg" role="img" aria-label={label}>{body}</span>
  );
}

/** All indicators in one capsule (white, gray lip). Energy first, then tasks done today and streak. */
export function IndicatorBar({ energyPercent, onEnergy, onTasks, onStreak }: IndicatorClusterProps) {
  const extra = useExtraIndicators();
  const p = Math.max(0, Math.min(100, Math.round(energyPercent)));
  return (
    <div className="td-ibar">
      <Segment glyph="bolt" progress={p / 100} color={energyColor(p)} value={p} label={`Energia ${p}%`} onClick={onEnergy} />
      {extra.tasks && <Segment glyph="check" progress={extra.tasks.total > 0 ? extra.tasks.done / extra.tasks.total : 0} color={INDICATOR_COLORS.tasks} value={`${extra.tasks.done}/${extra.tasks.total}`} label={`Zadania na dziś: ${extra.tasks.done} z ${extra.tasks.total}`} onClick={onTasks} />}
      {extra.streak && <Segment glyph="flame" progress={extra.streak.progress} color={INDICATOR_COLORS.streak} value={extra.streak.days} label={`Seria ${extra.streak.days} dni`} onClick={onStreak} />}
    </div>
  );
}

/* ---------------- Single round dial with three switch dots ---------------- */

export type DialKey = "energy" | "tasks" | "streak";

export interface IndicatorDialProps extends IndicatorClusterProps {
  /** Controlled selection; when omitted the dial keeps its own. */
  value?: DialKey;
  onChange?: (key: DialKey) => void;
  /** Tapping the chip opens the status card for the shown indicator. Dots only switch indicators. */
  onOpen?: (key: DialKey) => void;
}


/**
 * One round indicator that shows energy, tasks done today or streak. Three small dots in a column beside it
 * show which one is active (its dot takes the indicator's color). Tapping a dot always loads the next indicator; tapping the chip opens the status card (`onOpen`).
 */
export function IndicatorDial({ energyPercent, value, onChange, onOpen }: IndicatorDialProps) {
  const extra = useExtraIndicators();
  const [inner, setInner] = useState<DialKey>("energy");
  const p = Math.max(0, Math.min(100, Math.round(energyPercent)));
  const slots: { key: DialKey; label: string; color: string; chip: (open?: () => void) => ReactNode }[] = [
    { key: "energy", label: "Energia", color: energyColor(p), chip: (open) => <EnergyIndicator percent={p} onClick={open} /> },
  ];
  if (extra.tasks) slots.push({ key: "tasks", label: "Zadania", color: INDICATOR_COLORS.tasks, chip: (open) => <TasksIndicator {...extra.tasks!} onClick={open} /> });
  if (extra.streak) slots.push({ key: "streak", label: "Seria", color: INDICATOR_COLORS.streak, chip: (open) => <StreakIndicator {...extra.streak!} onClick={open} /> });
  const active = slots.find((x) => x.key === (value ?? inner)) ?? slots[0]!;
  const select = (k: DialKey) => { setInner(k); onChange?.(k); };
  const next = () => select(slots[(slots.indexOf(active) + 1) % slots.length]!.key);
  return (
    <div className="td-dial">
      {active.chip(onOpen ? () => onOpen(active.key) : undefined)}
      {slots.length > 1 && (
        <div className="td-dial__dots" role="tablist" aria-label="Wskaźnik">
          {slots.map((x, i) => {
            return (
              <button
                key={x.key}
                type="button"
                role="tab"
                aria-selected={x.key === active.key}
                aria-label={x.label}
                className={`td-dial__dot${x.key === active.key ? " is-active" : ""}`}
                style={{ ["--dot" as string]: x.color }}
                onClick={next}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
