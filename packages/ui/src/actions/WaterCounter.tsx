/** Interaction bar content: one block: the water level (drunk / goal) with a progress bar directly below it. */
export function WaterCounter({ drunkMl, goalMl, gain }: { drunkMl: number; goalMl: number; gain?: string }) {
  const pct = goalMl > 0 ? Math.min(100, Math.max(0, Math.round((drunkMl / goalMl) * 100))) : 0;
  return (
    <div className="td-counter">
      {gain && <span className="td-counter__gain" role="status">{gain}</span>}
      <b>{drunkMl} / {goalMl} ml</b>
      <div className="td-counter__track" role="progressbar" aria-label="Woda" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="td-counter__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
