export type BatteryRange = "0%" | "1–24%" | "25–49%" | "50–74%" | "75–100%";

export function batteryRange(percent: number): BatteryRange {
  const p = Math.round(percent);
  return p <= 0 ? "0%" : p < 25 ? "1–24%" : p < 50 ? "25–49%" : p < 75 ? "50–74%" : "75–100%";
}

/** Fill color: below 25% red, 25–49% yellow, 50–100% green. The outline is always dark. */
export function batteryColor(percent: number): string {
  return percent < 25 ? "var(--color-danger)" : percent < 50 ? "var(--color-accent)" : "var(--color-primary)";
}

/** One continuous fill whose width equals the percentage; the percentage is printed inside. */
export function Battery({ percent }: { percent: number }) {
  const p = Math.max(0, Math.min(100, Math.round(percent)));
  return (
    <div className="td-battery" role="img" aria-label={`Energia ${p}%`}>
      <div className="td-battery__shell">
        <div className="td-battery__fill" style={{ width: `${p}%`, background: batteryColor(p) }} />
        <span className="td-battery__pct">{p}%</span>
      </div>
    </div>
  );
}
