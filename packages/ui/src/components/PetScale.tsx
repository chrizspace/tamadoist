import { Pet } from "./Pet";

/** The pet stands on a scale while the user enters their weight. */
export function PetScale({ weightKg }: { weightKg?: number }) {
  return (
    <div style={{ position: "relative", width: 240, height: 260 }}>
      <div style={{ position: "absolute", left: 30, top: 0 }}><Pet state="awake" size={180} /></div>
      <svg style={{ position: "absolute", left: 0, top: 168 }} width="240" height="84" viewBox="0 0 240 84" role="img" aria-label="Waga">
        <rect x="8" y="22" width="224" height="58" rx="20" fill="#F4F7F6" stroke="#CBD5D2" strokeWidth="2" />
        <rect x="0" y="6" width="240" height="26" rx="13" fill="#F4F7F6" stroke="#CBD5D2" strokeWidth="2" />
        <rect x="70" y="40" width="100" height="32" rx="10" fill="#1F2D2A" />
        <text x="120" y="63" textAnchor="middle" fontFamily="Nunito, sans-serif" fontWeight="800" fontSize="18" fill="#1FBF8F">{weightKg ? `${weightKg} kg` : "— kg"}</text>
      </svg>
    </div>
  );
}
