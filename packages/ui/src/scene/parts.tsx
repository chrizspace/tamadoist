import type { ReactNode } from "react";
import type { Lighting } from "./lighting";

export const W = 390;
export const H = 844;

export function Sky({ light, id }: { light: Lighting; id: string }) {
  const sun = light.sun;
  return (
    <>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={light.skyTop} />
          {light.skyMid && <stop offset="0.55" stopColor={light.skyMid} />}
          <stop offset="1" stopColor={light.skyBottom} />
        </linearGradient>
        {sun && (
          <radialGradient id={`${id}-sun`}>
            <stop offset="0" stopColor={sun.glow} stopOpacity=".85" />
            <stop offset="1" stopColor={sun.glow} stopOpacity="0" />
          </radialGradient>
        )}
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-sky)`} />
      {light.starsOpacity > 0 && [[40, 80], [120, 50], [200, 110], [260, 60], [340, 90], [60, 190], [330, 210], [170, 40]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill="#fff" opacity={0.8 * light.starsOpacity} />)}
      {sun && (<><circle cx={sun.x} cy={sun.y} r={sun.r * 3.2} fill={`url(#${id}-sun)`} /><circle cx={sun.x} cy={sun.y} r={sun.r} fill={sun.color} opacity=".95" /></>)}
      {light.moon && (<><circle cx={light.moon.x} cy={light.moon.y} r="26" fill="#FFF6D6" /><circle cx={light.moon.x + 10} cy={light.moon.y - 6} r="22" fill={light.skyTop} /></>)}
    </>
  );
}

export function Cloud({ x, y, w, light }: { x: number; y: number; w: number; light: Lighting }) {
  const o = light.lit ? 0.25 : 0.8;
  return (
    <g opacity={o} fill="#fff">
      <ellipse cx={x + w / 2} cy={y + w * 0.19} rx={w / 2} ry={w * 0.19} />
      <ellipse cx={x + w * 0.47} cy={y + w * 0.06} rx={w * 0.27} ry={w * 0.2} />
    </g>
  );
}

export function Win({ x, y, w, h, light, children }: { x: number; y: number; w: number; h: number; light: Lighting; children?: ReactNode }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="14" fill={light.windowSky} />
      {light.starsOpacity > 0.5 && [[0.2, 0.2], [0.7, 0.3], [0.45, 0.6]].map(([a, b]) => <circle key={`${a}`} cx={x + w * a} cy={y + h * b} r="2" fill="#fff" />)}
      {children}
      <rect x={x} y={y} width={w} height={h} rx="14" fill="none" stroke="#fff" strokeWidth="8" />
      <path d={`M${x + w / 2} ${y}V${y + h}M${x} ${y + h / 2}H${x + w}`} stroke="#fff" strokeWidth="6" />
    </g>
  );
}

export function Plant({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width="44" height="50" rx="8" fill="#E07A5F" />
      <ellipse cx={x + 22} cy={y - 20} rx="26" ry="30" fill="#1FBF8F" />
      <ellipse cx={x + 6} cy={y - 6} rx="13" ry="20" fill="#159A72" />
      <ellipse cx={x + 40} cy={y - 6} rx="13" ry="20" fill="#159A72" />
    </g>
  );
}

export interface Lamp { x: number; y: number; r: number }

/** Warm light pools, drawn above the dark tint so lamps still read at night. */
export function Glows({ lamps, light, id, color = "#FFE9A8" }: { lamps: Lamp[]; light: Lighting; id: string; color?: string }) {
  if (!light.lit) return null;
  return (
    <>
      <defs>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor={color} stopOpacity=".85" />
          <stop offset="0.5" stopColor={color} stopOpacity=".32" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      {lamps.map((l, i) => <circle key={i} cx={l.x} cy={l.y} r={l.r} fill={`url(#${id}-glow)`} />)}
    </>
  );
}

export function Tint({ light }: { light: Lighting }) {
  return light.tintOpacity > 0 ? <rect width={W} height={H} fill={light.tint} opacity={light.tintOpacity} /> : null;
}

export interface LocationProps { light: Lighting; id: string }
