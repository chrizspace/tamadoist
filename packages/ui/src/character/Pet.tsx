import { useId } from "react";
import { darken, lighten, makePaint, mix } from "../scene/paint";
import { colors } from "../tokens";

export type PetState = "awake" | "tired" | "sleeping" | "happy" | "drinking";

export interface PetProps {
  state?: PetState;
  size?: number;
}

const FOOT = "#FF9A3C";

/**
 * Original mascot in a soft 3D "vinyl toy" style: smooth rounded forms, matte shading from the top left,
 * a darker underside, big white eyes with a single highlight, small wings, feather marks, orange feet and a
 * big soft ground shadow. No outlines. Plain SVG, so it can move to react-native-svg.
 */
export function Pet({ state = "awake", size = 160 }: PetProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const p = makePaint(`pet${uid}`);
  const body = colors.primary;
  const hi = mix(body, "#EAFFB0", 0.3);
  const eyesX = [72, 128];
  const eyeY = 80;
  const pupilDy = state === "tired" ? 8 : state === "happy" ? 2 : 3;

  const feather = (x: number, y: number, r: number, flip: number) => (
    <path d={`M${x} ${y}c${6 * flip} -8 ${14 * flip} -10 ${18 * flip} -6c${-2 * flip} 10 ${-10 * flip} 18 ${-18 * flip} 16c${-2 * flip} -3 ${-2 * flip} -7 0 -10z`} fill={lighten(body, 0.28)} opacity=".7" transform={`rotate(${r * flip} ${x} ${y})`} />
  );

  const content = (
    <>
      {/* ground shadow */}
      <ellipse cx="102" cy="193" rx="78" ry="9" fill="#0B2A22" opacity=".34" filter={p.blur(4.5)} />
      {/* wings */}
      {[[20, 1], [180, -1]].map(([x, f]) => (
        <ellipse key={x} cx={x} cy="124" rx="15" ry="26" fill={p.lin(darken(body, 0.12), { light: 0.1, dark: 0.3 })} transform={`rotate(${(f as number) * -18} ${x} 124)`} />
      ))}
      {/* feet */}
      {[[58, -10], [142, 10]].map(([x, r]) => (
        <g key={x} transform={`rotate(${r} ${x} 186)`}>
          <ellipse cx={x} cy="188" rx="21" ry="11" fill={darken(FOOT, 0.35)} />
          <ellipse cx={x} cy="185" rx="20" ry="10.5" fill={p.rad(FOOT, { cx: 0.4, cy: 0.25, light: 0.35, dark: 0.22 })} />
        </g>
      ))}
      {/* body: darker underside first, then the lit form */}
      <ellipse cx="100" cy="112" rx="83" ry="76" fill={darken(body, 0.45)} />
      <ellipse cx="100" cy="108" rx="82" ry="75" fill={p.rad(body, { cx: 0.38, cy: 0.22, light: 0.38, dark: 0.34 })} />
      <ellipse cx="100" cy="108" rx="82" ry="75" fill={p.rad(hi, { cx: 0.32, cy: 0.18, light: 0.2, dark: 0 })} opacity=".45" />
      <ellipse cx="68" cy="46" rx="36" ry="15" fill="#fff" opacity=".24" transform="rotate(-24 68 46)" filter={p.blur(5)} />
      {/* feather marks */}
      {feather(34, 108, 8, 1)}{feather(30, 132, 14, 1)}
      {feather(166, 108, 8, -1)}{feather(170, 132, 14, -1)}
      {/* tuft */}
      <ellipse cx="100" cy="30" rx="11" ry="17" fill={darken(FOOT, 0.3)} />
      <ellipse cx="99" cy="28" rx="10" ry="16" fill={p.rad(colors.accent, { cx: 0.35, cy: 0.25, light: 0.45, dark: 0.18 })} />
      {/* belly */}
      <ellipse cx="100" cy="150" rx="46" ry="30" fill={darken(colors.primarySoft, 0.28)} opacity=".5" filter={p.blur(3)} />
      <ellipse cx="100" cy="146" rx="44" ry="30" fill={p.rad(colors.primarySoft, { cx: 0.4, cy: 0.2, light: 0.55, dark: 0.15 })} />
      {/* eyes */}
      {eyesX.map((x) =>
        state === "sleeping" ? (
          <g key={x}>
            <path d={`M${x - 20} ${eyeY + 4}Q${x} ${eyeY + 20} ${x + 20} ${eyeY + 4}`} fill="none" stroke={darken(body, 0.55)} strokeWidth="5.5" strokeLinecap="round" />
          </g>
        ) : (
          <g key={x}>
            <ellipse cx={x} cy={eyeY + 3} rx="25" ry="27" fill={darken(body, 0.35)} opacity=".55" />
            <ellipse cx={x} cy={eyeY} rx="24" ry="26" fill={p.rad("#FFFFFF", { cx: 0.4, cy: 0.25, light: 0, dark: 0.1 })} />
            <ellipse cx={x + 2} cy={eyeY + pupilDy} rx={state === "happy" ? 12.5 : 11} ry={state === "happy" ? 14 : 12.5} fill={p.rad("#2B3A36", { cx: 0.35, cy: 0.3, light: 0.2, dark: 0 })} />
            <circle cx={x - 2} cy={eyeY + pupilDy - 4} r="4.2" fill="#fff" />
            {state === "happy" && <circle cx={x + 7} cy={eyeY + pupilDy + 5} r="2" fill="#fff" opacity=".85" />}
            {state === "tired" && <path d={`M${x - 24} ${eyeY}A24 26 0 0 1 ${x + 24} ${eyeY}Q${x} ${eyeY + 10} ${x - 24} ${eyeY}Z`} fill={p.lin(body, { light: 0.05, dark: 0.22 })} />}
          </g>
        ),
      )}
      {/* mouth */}
      {state === "awake" && <><ellipse cx="100" cy="128" rx="15" ry="10" fill="#26332F" /><ellipse cx="100" cy="133" rx="8" ry="4.5" fill="#F0607A" /></>}
      {state === "tired" && <path d="M90 130Q100 125 110 130" fill="none" stroke="#26332F" strokeWidth="4" strokeLinecap="round" />}
      {state === "sleeping" && <ellipse cx="100" cy="129" rx="6" ry="5" fill="#26332F" />}
      {state === "happy" && <><path d="M80 123Q100 148 120 123Q100 129 80 123Z" fill="#26332F" /><ellipse cx="100" cy="133" rx="9" ry="4.5" fill="#F0607A" /></>}
      {state === "drinking" && <ellipse cx="100" cy="130" rx="11" ry="12" fill={p.rad(colors.waterDark, { cx: 0.4, cy: 0.3, light: 0.4, dark: 0.2 })} />}
      {/* extras */}
      {state === "sleeping" && <text x="150" y="30" fontFamily="Nunito, sans-serif" fontWeight="800" fontSize="18" fill={colors.night}>Zzz</text>}
      {state === "drinking" && (
        <>
          <ellipse cx="164" cy="42" rx="9" ry="12" fill={p.rad(colors.water, { cx: 0.35, cy: 0.3, light: 0.5, dark: 0.15 })} />
          <ellipse cx="182" cy="72" rx="6" ry="8" fill={p.rad(colors.water, { cx: 0.35, cy: 0.3, light: 0.5, dark: 0.15 })} />
        </>
      )}
    </>
  );

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" role="img" aria-label={`Postać: ${state}`} data-state={state} data-testid="pet" overflow="visible">
      {content}
      {p.defs()}
    </svg>
  );
}
