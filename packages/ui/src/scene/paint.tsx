import type { ReactNode } from "react";

const toRgb = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
};
const toHex = (r: number, g: number, b: number) => `#${[r, g, b].map((x) => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, "0")).join("")}`;

export const mix = (a: string, b: string, t: number) => {
  const [r1, g1, b1] = toRgb(a);
  const [r2, g2, b2] = toRgb(b);
  return toHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
};
export const lighten = (c: string, t: number) => mix(c, "#ffffff", t);
export const darken = (c: string, t: number) => mix(c, "#000000", t);

export interface GradOpts {
  /** How much lighter the lit end is, 0..1. */
  light?: number;
  /** How much darker the shaded end is, 0..1. */
  dark?: number;
  /** v = top to bottom, h = left to right, d = top-left to bottom-right. */
  dir?: "v" | "h" | "d";
}

export interface RadOpts {
  /** Light position inside the shape, 0..1 (default top-left). */
  cx?: number;
  cy?: number;
  light?: number;
  dark?: number;
}

export interface Paint {
  /** Gradient that goes from a lit tone to a shaded tone of the same color. Returns a `url(#id)` fill. */
  lin(color: string, o?: GradOpts): string;
  /** Sphere-like shading: a highlight near the light and a shaded edge. */
  rad(color: string, o?: RadOpts): string;
  /** Soft gaussian blur filter, as a `url(#id)`. */
  blur(std?: number): string;
  defs(): ReactNode;
}

/** Collects gradient and filter definitions while a scene is being built, so shapes can ask for shaded fills. */
export function makePaint(uid: string): Paint {
  const entries = new Map<string, ReactNode>();
  let n = 0;
  const get = (key: string, build: (id: string) => ReactNode): string => {
    let id = `${uid}g${[...entries.keys()].indexOf(key)}`;
    if (!entries.has(key)) {
      id = `${uid}g${n++}`;
      entries.set(key, build(id));
      entries.set(`${key}#id`, id);
    }
    return `url(#${entries.get(`${key}#id`)})`;
  };
  return {
    lin(color, { light = 0.22, dark = 0.2, dir = "v" } = {}) {
      return get(`l${color}${light}${dark}${dir}`, (id) => (
        <linearGradient key={id} id={id} x1="0" y1="0" x2={dir === "v" ? 0 : 1} y2={dir === "h" ? 0 : 1}>
          <stop offset="0" stopColor={lighten(color, light)} />
          <stop offset="1" stopColor={darken(color, dark)} />
        </linearGradient>
      ));
    },
    rad(color, { cx = 0.35, cy = 0.3, light = 0.35, dark = 0.28 } = {}) {
      return get(`r${color}${cx}${cy}${light}${dark}`, (id) => (
        <radialGradient key={id} id={id} cx={cx} cy={cy} r="0.8" fx={cx} fy={cy}>
          <stop offset="0" stopColor={lighten(color, light)} />
          <stop offset="0.55" stopColor={color} />
          <stop offset="1" stopColor={darken(color, dark)} />
        </radialGradient>
      ));
    },
    blur(std = 6) {
      return get(`b${std}`, (id) => (
        <filter key={id} id={id} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={std} />
        </filter>
      ));
    },
    defs() {
      return <defs>{[...entries.entries()].filter(([k]) => !k.endsWith("#id")).map(([, v]) => v)}</defs>;
    },
  };
}
