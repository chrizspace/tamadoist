export function TimeCard({ start, end }: { start: string; end: string }) {
  return (
    <div className="td-timecard">
      <b>{start} → {end}</b>
      <span>8 godzin snu</span>
    </div>
  );
}
