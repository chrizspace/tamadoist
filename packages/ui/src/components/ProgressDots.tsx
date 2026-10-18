export interface ProgressDotsProps { total: number; current: number }

export function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <div className="td-dots" role="img" aria-label={`Krok ${current} z ${total}`}>
      {Array.from({ length: total }, (_, i) => {
        const n = i + 1;
        const cls = n === current ? " td-dots__dot--active" : n < current ? " td-dots__dot--done" : "";
        return <span key={n} className={`td-dots__dot${cls}`} />;
      })}
    </div>
  );
}
