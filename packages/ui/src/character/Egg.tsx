import { useId } from "react";
import { darken, lighten, makePaint } from "../scene/paint";

/** The egg in the same soft 3D vinyl style as the character: matte shading, no outline, big soft shadow. */
export function Egg({ size = 200 }: { size?: number }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const p = makePaint(`egg${uid}`);
  const shell = "#A9C8F0";
  const spot = "#7FA6DC";
  const content = (
    <>
      <ellipse cx="78" cy="190" rx="62" ry="9" fill="#0B2A4A" opacity=".34" filter={p.blur(4.5)} />
      <ellipse cx="75" cy="98" rx="66" ry="92" fill={darken(shell, 0.45)} />
      <ellipse cx="75" cy="94" rx="65" ry="90" fill={p.rad(shell, { cx: 0.36, cy: 0.22, light: 0.42, dark: 0.34 })} />
      <ellipse cx="50" cy="48" rx="26" ry="12" fill="#fff" opacity=".28" transform="rotate(-38 50 48)" filter={p.blur(4)} />
      {[[89, 95, 17, 15], [68, 129, 20, 17], [110, 142, 14, 12], [94, 57, 10, 9], [46, 108, 9, 8]].map(([x, y, rx, ry]) => (
        <g key={`${x}-${y}`}>
          <ellipse cx={x} cy={(y as number) + 2} rx={rx} ry={ry} fill={darken(spot, 0.3)} opacity=".5" />
          <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={p.rad(spot, { cx: 0.35, cy: 0.3, light: 0.25, dark: 0.18 })} />
        </g>
      ))}
      <ellipse cx="75" cy="150" rx="46" ry="26" fill={lighten(shell, 0.2)} opacity=".14" />
    </>
  );
  return (
    <svg width={size * 0.75} height={size} viewBox="0 0 150 200" role="img" aria-label="Jajko" overflow="visible">
      {content}
      {p.defs()}
    </svg>
  );
}
