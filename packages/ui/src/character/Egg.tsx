import { useId } from "react";
import { darken, lighten, makePaint } from "../scene/paint";

/** The egg in the same flat game-illustration style as the character: light rim, flat spots, soft shadow. */
export function Egg({ size = 200 }: { size?: number }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const p = makePaint(`egg${uid}`);
  const shell = "#A9C8F0";
  const spot = "#7FA6DC";
  const content = (
    <>
      <ellipse cx="76" cy="192" rx="58" ry="7" fill="#0B2A4A" opacity=".3" filter={p.blur(3.5)} />
      <ellipse cx="75" cy="96" rx="65" ry="91" fill={p.lin(shell, { light: 0.08, dark: 0.14 })} stroke={lighten(shell, 0.55)} strokeWidth="5" />
      {[[89, 95, 17, 15], [68, 129, 20, 17], [110, 142, 14, 12], [94, 57, 10, 9], [46, 108, 9, 8]].map(([x, y, rx, ry]) => <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={rx} ry={ry} fill={darken(spot, 0.04)} opacity=".85" />)}
      <path d="M36 82C36 52 50 30 70 22" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" opacity=".4" />
    </>
  );
  return (
    <svg width={size * 0.75} height={size} viewBox="0 0 150 200" role="img" aria-label="Jajko" overflow="visible">
      {content}
      {p.defs()}
    </svg>
  );
}
