export type BatteryRange = "0%" | "1–24%" | "25–49%" | "50–74%" | "75–100%";

export function batteryRange(percent: number): BatteryRange {
  const p = Math.round(percent);
  return p <= 0 ? "0%" : p < 25 ? "1–24%" : p < 50 ? "25–49%" : p < 75 ? "50–74%" : "75–100%";
}

/** Bar color: 1–24% red, 25–49% yellow, 50–100% green. The outline is always dark. */
export function batteryColor(percent: number): string {
  return percent < 25 ? "var(--color-danger)" : percent < 50 ? "var(--color-accent)" : "var(--color-primary)";
}

/** Four slots load proportionally: slot i is filled clamp(percent/25 - i, 0, 1). */
export function slotFill(percent: number, index: number): number {
  return Math.max(0, Math.min(1, percent / 25 - index));
}

export function Battery({ percent }: { percent: number }) {
  const p = Math.max(0, Math.min(100, Math.round(percent)));
  return (
    <div className="td-battery" role="img" aria-label={`Energia ${p}%`}>
      <div className="td-battery__shell">
        <span className="td-battery__pct">{p}%</span>
        <div className="td-battery__slots">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="td-battery__slot">
              <b style={{ width: `${slotFill(p, i) * 100}%`, background: batteryColor(p) }} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
