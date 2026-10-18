import { colors } from "../tokens";

export interface PetProps {
  state?: "awake" | "tired" | "sleeping";
  size?: number;
}

/** Original mascot, drawn as SVG so it scales and can later be reused in React Native (react-native-svg). */
export function Pet({ state = "awake", size = 160 }: PetProps) {
  const eyes = [58, 110];
  return (
    <svg className={`td-pet td-pet--${state}`} width={size} height={size} viewBox="0 0 200 200" role="img" aria-label={`Postać: ${state}`} data-state={state} data-testid="pet">
      <g className="td-pet__body">
        <ellipse cx="100" cy="110" rx="80" ry="75" fill={colors.primary} stroke={colors.primaryDark} strokeWidth="4" />
        <ellipse cx="100" cy="140" rx="45" ry="35" fill={colors.primarySoft} />
        <ellipse cx="100" cy="27" rx="11" ry="17" fill={colors.accent} stroke={colors.accentDark} strokeWidth="3" />
        {[51, 159].map((x) => <ellipse key={x} cx={x} cy="187" rx="17" ry="9" fill={colors.accent} stroke={colors.accentDark} strokeWidth="3" />)}
        {[53, 155].map((x) => <ellipse key={x} cx={x} cy="115" rx="11" ry="7" fill="#FF9999" opacity="0.55" />)}
        {eyes.map((x) =>
          state === "sleeping" ? (
            <ellipse key={x} cx={x + 16} cy="92" rx="16" ry="4" fill={colors.text} />
          ) : (
            <g key={x}>
              <ellipse cx={x + 16} cy="89" rx="16" ry="19" fill={colors.bg} stroke={colors.primaryDark} strokeWidth="3" />
              <ellipse cx={x + 16} cy={state === "tired" ? 100 : 94} rx="7" ry="9" fill={colors.text} />
              {state === "tired" && <rect x={x - 2} y="66" width="36" height="22" fill={colors.primary} />}
            </g>
          ),
        )}
        {state === "awake" && <ellipse cx="100" cy="129" rx="17" ry="11" fill={colors.text} />}
        {state === "tired" && <ellipse cx="100" cy="129" rx="11" ry="3" fill={colors.text} />}
        {state === "sleeping" && <circle cx="100" cy="129" r="7" fill={colors.text} />}
      </g>
      {state === "sleeping" && <text x="150" y="26" fontFamily="Nunito, sans-serif" fontWeight="700" fontSize="18" fill={colors.night}>Zzz</text>}
    </svg>
  );
}
