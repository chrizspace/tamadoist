import type { ReactNode } from "react";
import { darken, lighten, mix, type Paint } from "./paint";
import type { Lighting } from "./lighting";

export const W = 390;
export const H = 844;

export interface Ctx { p: Paint; light: Lighting }

/** A block seen slightly from above and from the left: front, top and right side get different light. */
export function Box({ p, x, y, w, h, d = 16, color, rx = 3, children }: { p: Paint; x: number; y: number; w: number; h: number; d?: number; color: string; rx?: number; children?: ReactNode }) {
  const dy = d * 0.6;
  return (
    <g>
      {d > 0 && <polygon points={`${x + w},${y} ${x + w + d},${y - dy} ${x + w + d},${y + h - dy} ${x + w},${y + h}`} fill={darken(color, 0.3)} />}
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={p.lin(color, { light: 0.1, dark: 0.14 })} />
      {d > 0 && <polygon points={`${x},${y} ${x + d},${y - dy} ${x + w + d},${y - dy} ${x + w},${y}`} fill={lighten(color, 0.38)} />}
      <rect x={x} y={y} width={w} height={Math.min(3, h / 4)} rx={rx} fill="#fff" opacity=".3" />
      {children}
    </g>
  );
}

/** Soft contact shadow on the floor. */
export function Shadow({ p, cx, cy, rx, ry, o = 0.3 }: { p: Paint; cx: number; cy: number; rx: number; ry: number; o?: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#0B1020" opacity={o} filter={p.blur(Math.max(3, ry / 2))} />;
}

/** Sphere with a highlight. */
export function Ball({ p, cx, cy, r, color }: { p: Paint; cx: number; cy: number; r: number; color: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={p.rad(color, { cx: 0.35, cy: 0.3, light: 0.45, dark: 0.3 })} />
      <circle cx={cx - r * 0.35} cy={cy - r * 0.4} r={Math.max(1, r * 0.2)} fill="#fff" opacity=".6" />
    </g>
  );
}

/** Wall with ceiling shade, side shade (room corners) and a baseboard. */
export function Wall({ p, y = 552, color }: { p: Paint; y?: number; color: string }) {
  return (
    <g>
      <rect width={W} height={y} fill={p.lin(color, { light: 0.14, dark: 0.1 })} />
      <rect width={70} height={y} fill={p.fade("#0B1020", 0.2, 0, "h")} />
      <rect x={W - 70} width={70} height={y} fill={p.fade("#0B1020", 0, 0.2, "h")} />
      <rect width={W} height={90} fill={p.fade("#0B1020", 0.18, 0)} />
      <rect y={y - 14} width={W} height={14} fill={p.lin(lighten(color, 0.55), { light: 0.2, dark: 0.12 })} />
      <rect y={y - 14} width={W} height={2} fill="#fff" opacity=".6" />
    </g>
  );
}

/** Floor with perspective lines running to a vanishing point, and shade where it meets the wall. */
export function Floor({ p, y = 552, color, kind = "wood" }: { p: Paint; y?: number; color: string; kind?: "wood" | "tile" | "carpet" | "rubber" }) {
  const line = darken(color, kind === "rubber" ? 0.4 : 0.18);
  const fan = kind === "wood" || kind === "tile" || kind === "rubber";
  const cross = kind === "tile" || kind === "rubber" || kind === "carpet";
  return (
    <g>
      <rect y={y} width={W} height={H - y} fill={p.lin(color, { light: 0.16, dark: 0.22 })} />
      {fan && Array.from({ length: 13 }, (_, i) => {
        const xTop = -200 + i * 66;
        return <line key={i} x1={xTop * 0.5 + 97} y1={y} x2={xTop * 1.6 + 70} y2={H} stroke={line} strokeWidth={kind === "wood" ? 2 : 2.5} opacity=".35" />;
      })}
      {cross && [1, 2, 3, 4, 5, 6].map((k) => <rect key={k} y={y + (H - y) * Math.pow(k / 7, 1.7)} width={W} height={1 + k * 0.5} fill={line} opacity=".28" />)}
      <rect y={y} width={W} height={46} fill={p.fade("#0B1020", 0.32, 0)} />
    </g>
  );
}

/** Window with frame, glare, a sill and (in daylight) a light shaft falling on the floor. */
export function Window3D({ p, light, x, y, w, h, children }: Ctx & { x: number; y: number; w: number; h: number; children?: ReactNode }) {
  const sky = light.windowSky;
  return (
    <g>
      <rect x={x - 5} y={y - 5} width={w + 10} height={h + 10} rx="14" fill={darken("#E8E2D6", 0.15)} />
      <rect x={x} y={y} width={w} height={h} rx="10" fill={p.lin(sky, { light: 0.3, dark: 0.08 })} />
      {light.starsOpacity > 0.5 && [[0.2, 0.2], [0.7, 0.3], [0.45, 0.6], [0.8, 0.7]].map(([a, b]) => <circle key={`${a}`} cx={x + w * a!} cy={y + h * b!} r="2" fill="#fff" />)}
      {children}
      <polygon points={`${x + 6},${y + h - 6} ${x + w * 0.45},${y + 6} ${x + w * 0.62},${y + 6} ${x + 22},${y + h - 6}`} fill="#fff" opacity=".22" />
      <rect x={x} y={y} width={w} height={h} rx="10" fill="none" stroke="#fff" strokeWidth="7" />
      <rect x={x + w / 2 - 3} y={y} width="6" height={h} fill="#fff" />
      <rect x={x} y={y + h / 2 - 3} width={w} height="6" fill="#fff" />
      <rect x={x - 8} y={y + h + 3} width={w + 16} height="9" rx="3" fill={lighten("#E8E2D6", 0.3)} />
      <rect x={x - 8} y={y + h + 10} width={w + 16} height="3" rx="1.5" fill={darken("#E8E2D6", 0.2)} />
    </g>
  );
}

/** Sunlight coming through a window onto the floor. */
export function Shaft({ p, light, x, w, from, to = 700 }: Ctx & { x: number; w: number; from: number; to?: number }) {
  if (light.daylight < 0.55) return null;
  const warm = light.period === "morning" ? "#FFE3A8" : "#FFFFFF";
  const o = light.period === "morning" ? 0.5 : 0.42;
  return (
    <polygon
      points={`${x + 4},${from} ${x + w - 4},${from} ${x + w + 150},${to} ${x + 70},${to}`}
      fill={p.fade(warm, o, 0)}
    />
  );
}

export function Plant3D({ p, x, y }: { p: Paint; x: number; y: number }) {
  const leaf = (cx: number, cy: number, rx: number, ry: number, rot: number, c: string) => (
    <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={p.rad(c, { cx: 0.35, cy: 0.25, light: 0.4, dark: 0.3 })} transform={`rotate(${rot} ${cx} ${cy})`} />
  );
  return (
    <g>
      <Shadow p={p} cx={x + 22} cy={y + 52} rx={34} ry={6} />
      {leaf(x + 4, y - 14, 11, 28, -28, "#159A72")}
      {leaf(x + 40, y - 14, 11, 28, 28, "#159A72")}
      {leaf(x + 22, y - 26, 14, 34, 0, "#1FBF8F")}
      {leaf(x + 14, y - 6, 10, 22, -12, "#1FBF8F")}
      {leaf(x + 30, y - 6, 10, 22, 12, "#1FBF8F")}
      <polygon points={`${x - 2},${y} ${x + 46},${y} ${x + 40},${y + 50} ${x + 4},${y + 50}`} fill={p.lin("#E07A5F", { light: 0.18, dark: 0.22 })} />
      <rect x={x - 3} y={y - 3} width="52" height="8" rx="4" fill={lighten("#E07A5F", 0.25)} />
      <ellipse cx={x + 22} cy={y} rx="22" ry="3" fill={darken("#6B4A2B", 0.2)} />
    </g>
  );
}

/** Soft, shaded cloud. */
export function Cloud3D({ x, y, w, light }: { x: number; y: number; w: number; light: Lighting }) {
  if (light.cloudOpacity <= 0) return null;
  const night = light.daylight < 0.2;
  const top = night ? "#7C84B8" : "#FFFFFF";
  const bottom = night ? "#4B5288" : "#CFDDF0";
  return (
    <g opacity={light.cloudOpacity}>
      <ellipse cx={x + w / 2} cy={y + w * 0.2} rx={w / 2} ry={w * 0.2} fill={bottom} />
      <ellipse cx={x + w * 0.3} cy={y + w * 0.12} rx={w * 0.24} ry={w * 0.2} fill={top} />
      <ellipse cx={x + w * 0.56} cy={y + w * 0.04} rx={w * 0.28} ry={w * 0.24} fill={top} />
      <ellipse cx={x + w * 0.72} cy={y + w * 0.14} rx={w * 0.22} ry={w * 0.16} fill={top} />
      <ellipse cx={x + w * 0.5} cy={y + w * 0.22} rx={w * 0.4} ry={w * 0.1} fill={bottom} opacity=".6" />
    </g>
  );
}

/** Two-tone cone tree with a trunk and a shadow. */
export function Tree3D({ p, x, y, s = 1 }: { p: Paint; x: number; y: number; s?: number }) {
  const tier = (top: number, bottom: number, half: number) => (
    <g>
      <polygon points={`${x},${top} ${x - half},${bottom} ${x},${bottom + 8 * s}`} fill={p.lin("#18B084", { light: 0.18, dark: 0.1 })} />
      <polygon points={`${x},${top} ${x},${bottom + 8 * s} ${x + half},${bottom}`} fill={p.lin("#0B7D5F", { light: 0.05, dark: 0.25 })} />
    </g>
  );
  return (
    <g>
      <Shadow p={p} cx={x + 14 * s} cy={y + 62 * s} rx={46 * s} ry={7 * s} o={0.28} />
      <rect x={x - 5 * s} y={y + 30 * s} width={10 * s} height={32 * s} rx={2} fill={p.lin("#2D6FA3", { light: 0.2, dark: 0.3, dir: "h" })} />
      {tier(y - 52 * s, y + 4 * s, 34 * s)}
      {tier(y - 28 * s, y + 24 * s, 42 * s)}
      {tier(y - 4 * s, y + 46 * s, 50 * s)}
    </g>
  );
}

/** Rounded hill with a lit top edge. */
export function Hill({ p, cx, cy, rx, ry, color, rim = 0.45 }: { p: Paint; cx: number; cy: number; rx: number; ry: number; color: string; rim?: number }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={p.lin(color, { light: 0.2, dark: 0.14 })} />
      <path d={`M${cx - rx} ${cy}A${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`} fill="none" stroke={lighten(color, rim)} strokeWidth="4" opacity=".55" />
    </g>
  );
}

/** Pendant lamp; the glow comes from the scene's lamp list. */
export function Pendant({ p, x, y, color = "#FFC93C" }: { p: Paint; x: number; y: number; color?: string }) {
  return (
    <g>
      <rect x={x - 2} y="0" width="4" height={y} fill="#6B4A2B" />
      <path d={`M${x - 26} ${y + 30}Q${x - 24} ${y + 4} ${x} ${y}Q${x + 24} ${y + 4} ${x + 26} ${y + 30}Z`} fill={p.lin(color, { light: 0.25, dark: 0.2 })} />
      <ellipse cx={x} cy={y + 30} rx="26" ry="4" fill={darken(color, 0.25)} />
    </g>
  );
}

export function CeilingLights({ p, light }: Ctx) {
  return (
    <g>
      {[40, 170, 290].map((x) => (
        <g key={x}>
          <rect x={x} y="20" width="70" height="14" rx="4" fill={darken("#EEF3F7", 0.25)} />
          <rect x={x} y="18" width="70" height="14" rx="4" fill={light.lit ? "#FFFFFF" : p.lin("#EEF3F7", { light: 0.1, dark: 0.1 })} />
        </g>
      ))}
    </g>
  );
}

export const tone = (c: string, t: number) => mix(c, "#000000", t);
