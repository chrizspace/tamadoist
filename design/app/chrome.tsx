import { useEffect, useRef, useState, type ReactNode } from "react";

export function Section({ title, lead, children }: { title: string; lead?: string; children: ReactNode }) {
  return (
    <section className="sec">
      <h2>{title}</h2>
      {lead && <p className="lead">{lead}</p>}
      {children}
    </section>
  );
}

export function Spec({ title, note, children, stage = "" }: { title: string; note?: string; children: ReactNode; stage?: string }) {
  return (
    <div className="box spec">
      <h3>{title}</h3>
      {note && <p className="note">{note}</p>}
      <div className={`stage ${stage}`}>{children}</div>
    </div>
  );
}

export const SpecGrid = ({ children }: { children: ReactNode }) => <div className="specgrid">{children}</div>;

/** A phone-sized screen scaled down for galleries. */
export function PhoneThumb({ scale = 0.641, children }: { scale?: number; children: ReactNode }) {
  return (
    <div className="scaler" style={{ width: 390 * scale, height: 844 * scale }}>
      <div className="phonescale" style={{ transform: `scale(${scale})` }}>{children}</div>
    </div>
  );
}

export function Gallery({ items }: { items: { title: string; note?: string; node: ReactNode }[] }) {
  return (
    <div className="gallery">
      {items.map((it, i) => (
        <div key={it.title} className="gcell">
          <h4>{String(i + 1).padStart(2, "0")} · {it.title}</h4>
          {it.note && <p>{it.note}</p>}
          <PhoneThumb>{it.node}</PhoneThumb>
        </div>
      ))}
    </div>
  );
}

/** Scales a 390px-wide child down to the container width on narrow screens. */
export function Fit({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const upd = () => setS(Math.min(1, (el.clientWidth - 16) / 406));
    upd();
    const ro = new ResizeObserver(upd);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="fit" style={{ height: 860 * s + 8 }}>
      <div style={{ width: 390, height: 844, transform: `scale(${s})`, transformOrigin: "top left", margin: "4px 8px" }}>{children}</div>
    </div>
  );
}

export const Code = ({ children }: { children: ReactNode }) => <code className="mono">{children}</code>;

export function copyText(txt: string, done: () => void) {
  const fin = () => done();
  try { navigator.clipboard.writeText(txt).then(fin, fin); } catch { fin(); }
}

const PERIOD_COLORS: Record<string, string> = { morning: "#FFD9A8", noon: "#8ED0FF", evening: "#F2A36B", night: "#1B2060" };

/** 24-hour bar with the four times of day; the night window wraps around midnight. */
export function Timeline({ windows, sunrise, sunset }: { windows: { id: string; start: number; end: number }[]; sunrise?: number; sunset?: number }) {
  const pct = (v: number) => `${(v / 1440) * 100}%`;
  const segs: { id: string; a: number; b: number }[] = [];
  for (const w of windows) {
    const a = w.start, b = w.end;
    if (b <= 1440 && a >= 0) segs.push({ id: w.id, a, b });
    else if (a < 0) { segs.push({ id: w.id, a: 0, b }); segs.push({ id: w.id, a: a + 1440, b: 1440 }); }
    else { segs.push({ id: w.id, a, b: 1440 }); segs.push({ id: w.id, a: 0, b: b - 1440 }); }
  }
  return (
    <div className="timeline" aria-hidden="true">
      {segs.map((g, i) => <i key={i} style={{ left: pct(g.a), width: pct(g.b - g.a), background: PERIOD_COLORS[g.id] }} />)}
      {sunrise !== undefined && <u style={{ left: pct(((sunrise % 1440) + 1440) % 1440) }} />}
      {sunset !== undefined && <u style={{ left: pct(((sunset % 1440) + 1440) % 1440) }} />}
    </div>
  );
}
