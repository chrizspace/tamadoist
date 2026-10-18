import { useId } from "react";
import { darken, lighten, makePaint } from "../scene/paint";
import { colors } from "../tokens";

export type PetState = "awake" | "tired" | "sleeping" | "happy" | "drinking";

export interface PetProps {
  state?: PetState;
  size?: number;
}

const INK = "#3A1708"; // thick dark-brown outline of the eyes and the pupils
const IRIS_TOP = "#F8CBA8";
const IRIS_BOTTOM = "#EBA283";
const BEAK = "#FF8A1F";

/**
 * Original mascot in the "flat game illustration" style: a squat owl-like body with a light rim, big oval eyes
 * with a thick dark outline and a warm iris, dark pupils with a cut-out highlight, a small orange beak, leaf-like
 * brow feathers and soft marks on the belly. Flat colors with gentle shading. Plain SVG, so it can move to
 * react-native-svg.
 */
export function Pet({ state = "awake", size = 160 }: PetProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const p = makePaint(`pet${uid}`);
  const body = colors.primary;
  const mark = lighten(body, 0.2);
  const eyeY = 92;
  const eyes = [68, 132];
  const looking = state === "tired" ? 8 : 0;
  const pupilRx = state === "happy" ? 15 : 13;
  const pupilRy = state === "happy" ? 21 : 19;

  const leaf = (x: number, y: number, rot: number, w: number, h: number) => (
    <path d={`M0 0Q${w / 2} ${-h} ${w} 0Q${w / 2} ${h * 0.35} 0 0Z`} fill={mark} opacity=".85" transform={`translate(${x} ${y}) rotate(${rot})`} />
  );

  const eye = (cx: number, i: number) => {
    const clip = `${uid}clip${i}`;
    if (state === "sleeping") {
      return <path key={cx} d={`M${cx - 26} ${eyeY + 2}Q${cx} ${eyeY + 24} ${cx + 26} ${eyeY + 2}`} fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />;
    }
    const px = cx + (i === 0 ? 2 : -2);
    const py = eyeY - 3 + looking;
    return (
      <g key={cx}>
        <clipPath id={clip}><ellipse cx={cx} cy={eyeY} rx="30" ry="36" /></clipPath>
        <ellipse cx={cx} cy={eyeY} rx="30" ry="36" fill={`url(#${uid}iris)`} />
        <g clipPath={`url(#${clip})`}>
          {[[-14, 22, 5], [0, 26, 6.5], [15, 22, 5], [-6, 12, 3.5], [10, 14, 3.5]].map(([dx, dy, r]) => <circle key={`${dx}${dy}`} cx={cx + dx!} cy={eyeY + dy!} r={r} fill="#FFE27A" opacity=".55" />)}
          <ellipse cx={px} cy={py} rx={pupilRx} ry={pupilRy} fill={INK} />
          <ellipse cx={px - 7} cy={py - 11} rx="8.5" ry="9" fill={`url(#${uid}iris)`} />
          {state === "happy" && <circle cx={px + 6} cy={py + 8} r="3" fill="#FFF3D6" opacity=".9" />}
          {state === "tired" && (
            <>
              <rect x={cx - 34} y={eyeY - 40} width="68" height="42" fill={p.lin(body, { light: 0.06, dark: 0.12 })} />
              <path d={`M${cx - 34} ${eyeY + 2}Q${cx} ${eyeY + 10} ${cx + 34} ${eyeY + 2}`} fill="none" stroke={INK} strokeWidth="7" />
            </>
          )}
        </g>
        <ellipse cx={cx} cy={eyeY} rx="30" ry="36" fill="none" stroke={INK} strokeWidth="8" />
      </g>
    );
  };

  const content = (
    <>
      <defs>
        <linearGradient id={`${uid}iris`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={IRIS_TOP} />
          <stop offset="1" stopColor={IRIS_BOTTOM} />
        </linearGradient>
      </defs>
      {/* ground shadow */}
      <ellipse cx="100" cy="195" rx="74" ry="6" fill="#0B2A22" opacity=".3" filter={p.blur(3)} />
      {/* feet */}
      {[62, 138].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy="191" rx="19" ry="8" fill={darken(BEAK, 0.25)} />
          <ellipse cx={x} cy="189" rx="18" ry="7.5" fill={BEAK} />
        </g>
      ))}
      {/* body with a light rim */}
      <path
        d="M40 42C48 22 74 24 100 36C126 24 152 22 160 42C178 72 194 112 188 150C184 182 152 192 100 192C48 192 16 182 12 150C6 112 22 72 40 42Z"
        fill={p.lin(body, { light: 0.07, dark: 0.12 })}
        stroke={lighten(body, 0.5)}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      {/* arms */}
      {[1, -1].map((f) => (
        <g key={f}>
          <path d={f === 1 ? "M18 132C10 150 14 172 30 180C34 168 34 150 30 130Z" : "M182 132C190 150 186 172 170 180C166 168 166 150 170 130Z"} fill={darken(body, 0.12)} />
          <path d={f === 1 ? "M30 124Q36 152 32 178" : "M170 124Q164 152 168 178"} fill="none" stroke={darken(body, 0.28)} strokeWidth="3" strokeLinecap="round" />
        </g>
      ))}
      {/* brow feathers */}
      {leaf(40, 58, -62, 34, 20)}{leaf(52, 44, -30, 30, 18)}
      {leaf(160, 58, 242, 34, 20)}{leaf(148, 44, 210, 30, 18)}
      {/* belly marks */}
      <path d="M58 150H96Q92 170 77 170Q62 170 58 150Z" fill={mark} opacity=".8" />
      <path d="M104 150H142Q138 170 123 170Q108 170 104 150Z" fill={mark} opacity=".8" />
      <path d="M88 176H112Q108 188 100 188Q92 188 88 176Z" fill={mark} opacity=".8" />
      {/* eyes */}
      {eyes.map(eye)}
      {/* beak and mouth */}
      {state === "happy" && <path d="M84 118Q100 150 116 118Z" fill="#7A1F2B" />}
      {state === "happy" && <ellipse cx="100" cy="136" rx="9" ry="5" fill="#F0607A" />}
      {state === "awake" && <path d="M92 122H108Q106 138 100 138Q94 138 92 122Z" fill="#D9552E" />}
      {state === "awake" && <ellipse cx="100" cy="132" rx="5.5" ry="3.5" fill="#E8A1D6" />}
      {state === "drinking" && <path d="M92 122H108Q106 140 100 140Q94 140 92 122Z" fill={colors.waterDark} />}
      <path d="M80 108Q100 98 120 108Q116 128 100 130Q84 128 80 108Z" fill={BEAK} />
      <path d="M86 108Q100 102 114 108Q110 114 100 114Q90 114 86 108Z" fill={lighten(BEAK, 0.4)} opacity=".75" />
      {/* extras */}
      {state === "sleeping" && <text x="150" y="30" fontFamily="Nunito, sans-serif" fontWeight="800" fontSize="18" fill={colors.night}>Zzz</text>}
      {state === "drinking" && (
        <>
          <ellipse cx="168" cy="40" rx="9" ry="12" fill={colors.water} stroke={colors.waterDark} strokeWidth="2" />
          <ellipse cx="184" cy="70" rx="6" ry="8" fill={colors.water} stroke={colors.waterDark} strokeWidth="2" />
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
