export interface EnergyBarProps { percent: number; label?: string }

export function EnergyBar({ percent, label = "Energia" }: EnergyBarProps) {
  const value = Math.max(0, Math.min(100, Math.round(percent)));
  return (
    <div className="td-energy" data-testid="energy-bar">
      <div className="td-energy__row">
        <span>{label}</span>
        <span className="td-energy__value">{value}%</span>
      </div>
      <div className="td-energy__track" role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
        <div className={`td-energy__fill${value <= 30 ? " td-energy__fill--low" : ""}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
