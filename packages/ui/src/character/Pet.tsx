import { colors } from "../tokens";

export type PetState = "awake" | "tired" | "sleeping" | "happy" | "drinking";

export interface PetProps {
  state?: PetState;
  size?: number;
}

/** Original mascot as SVG, so it scales and can be reused in React Native (react-native-svg). */
export function Pet({ state = "awake", size = 160 }: PetProps) {
  const eyes = [58, 110];
  const pupilY = state === "tired" ? 100 : state === "happy" ? 93 : 94;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" role="img" aria-label={`Postać: ${state}`} data-state={state} data-testid="pet">
      <ellipse cx="100" cy="110" rx="80" ry="75" fill={colors.primary} stroke={colors.primaryDark} strokeWidth="4" />
      <ellipse cx="100" cy="140" rx="45" ry="35" fill={colors.primarySoft} />
      <ellipse cx="100" cy="27" rx="11" ry="17" fill={colors.accent} stroke={colors.accentDark} strokeWidth="3" />
      {[51, 149].map((x) => <ellipse key={x} cx={x} cy="187" rx="17" ry="9" fill={colors.accent} stroke={colors.accentDark} strokeWidth="3" />)}
      {[53, 147].map((x) => <ellipse key={x} cx={x} cy="115" rx="11" ry="7" fill="#FF9999" opacity=".6" />)}
      {eyes.map((x) =>
        state === "sleeping" ? (
          <ellipse key={x} cx={x + 16} cy="92" rx="16" ry="4" fill={colors.text} />
        ) : (
          <g key={x}>
            <ellipse cx={x + 16} cy="89" rx="16" ry="19" fill={colors.bg} stroke={colors.primaryDark} strokeWidth="3" />
            <ellipse cx={x + 16} cy={pupilY} rx={state === "happy" ? 9 : 7} ry={state === "happy" ? 11 : 9} fill={colors.text} />
            {state === "tired" && <rect x={x - 2} y="66" width="36" height="22" fill={colors.primary} />}
            {state === "happy" && <circle cx={x + 12} cy="88" r="3" fill="#fff" />}
          </g>
        ),
      )}
      {state === "awake" && <ellipse cx="100" cy="129" rx="17" ry="11" fill={colors.text} />}
      {state === "tired" && <ellipse cx="100" cy="129" rx="11" ry="3" fill={colors.text} />}
      {state === "sleeping" && <circle cx="100" cy="129" r="7" fill={colors.text} />}
      {state === "happy" && <ellipse cx="100" cy="129" rx="22" ry="14" fill={colors.text} />}
      {state === "drinking" && <ellipse cx="100" cy="130" rx="12" ry="13" fill={colors.waterDark} />}
      {state === "sleeping" && <text x="150" y="26" fontFamily="Nunito, sans-serif" fontWeight="800" fontSize="18" fill={colors.night}>Zzz</text>}
      {state === "drinking" && (
        <>
          <ellipse cx="160" cy="40" rx="9" ry="12" fill={colors.water} stroke={colors.waterDark} strokeWidth="3" />
          <ellipse cx="180" cy="70" rx="6" ry="8" fill={colors.water} stroke={colors.waterDark} strokeWidth="3" />
        </>
      )}
    </svg>
  );
}
