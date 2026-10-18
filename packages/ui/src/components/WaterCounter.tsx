export function WaterCounter({ drunkMl, goalMl, top = 455 }: { drunkMl: number; goalMl: number; top?: number }) {
  return (
    <div className="td-counter" style={{ top }}>
      <b>{drunkMl} / {goalMl} ml</b>
      <span>Dodawaj po szklance (250 ml)</span>
    </div>
  );
}
