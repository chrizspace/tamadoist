import { createContext, useContext, type ReactNode } from "react";

export type EnergyRange = "0%" | "1–24%" | "25–49%" | "50–74%" | "75–100%";

export function energyRange(percent: number): EnergyRange {
  const p = Math.round(percent);
  return p <= 0 ? "0%" : p < 25 ? "1–24%" : p < 50 ? "25–49%" : p < 75 ? "50–74%" : "75–100%";
}

/** Ring color for energy: below 25% red, 25–49% yellow, 50–100% green. */
export function energyColor(percent: number): string {
  return percent < 25 ? "#FF5A5F" : percent < 50 ? "#FFB400" : "#1FBF8F";
}

export const INDICATOR_COLORS = { exp: "#7C84D6", streak: "#FF8A3D" } as const;

const GLYPHS = {
  bolt: "M13.2 2 4.5 13.6h6.2L9.8 22l9.7-12.2h-6.3z",
  star: "M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.6l1.2-6.5L2.5 9.5l6.6-.9z",
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
 * The header holds up to three of them (energy, experience and a third one).
 */
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

export function ExpIndicator({ level, progress, onClick }: { level: number; progress: number; onClick?: () => void }) {
  return <IndicatorChip glyph="star" progress={progress} color={INDICATOR_COLORS.exp} badge={level} label={`Poziom ${level}, ${Math.round(progress * 100)}% do następnego`} onClick={onClick} />;
}

/** Proposed third indicator: days in a row with the daily goals met; the ring is today's progress. */
export function StreakIndicator({ days, progress, onClick }: { days: number; progress: number; onClick?: () => void }) {
  return <IndicatorChip glyph="flame" progress={progress} color={INDICATOR_COLORS.streak} badge={days} label={`Seria ${days} dni, dziś ${Math.round(progress * 100)}%`} onClick={onClick} />;
}

export interface ExtraIndicators {
  exp?: { level: number; progress: number };
  streak?: { days: number; progress: number };
}

/** Lets every screen's header show the extra indicators without passing them through each screen. */
export const IndicatorsContext = createContext<ExtraIndicators>({});
export const useExtraIndicators = () => useContext(IndicatorsContext);
export const IndicatorsProvider = ({ value, children }: { value: ExtraIndicators; children: ReactNode }) => <IndicatorsContext.Provider value={value}>{children}</IndicatorsContext.Provider>;

export interface IndicatorClusterProps {
  energyPercent: number;
  onEnergy?: () => void;
  onExp?: () => void;
  onStreak?: () => void;
}

/** Energy always, then experience and streak when the app provides them. */
export function IndicatorCluster({ energyPercent, onEnergy, onExp, onStreak }: IndicatorClusterProps) {
  const extra = useExtraIndicators();
  return (
    <div className="td-indicators">
      <EnergyIndicator percent={energyPercent} onClick={onEnergy} />
      {extra.exp && <ExpIndicator {...extra.exp} onClick={onExp} />}
      {extra.streak && <StreakIndicator {...extra.streak} onClick={onStreak} />}
    </div>
  );
}
