import { useId } from "react";
import { makePaint } from "../scene/paint";
import { Box, Shadow } from "../scene/solids";
import { Pet } from "./Pet";

/** The pet stands on a 2.5D bathroom scale while the user enters their weight. */
export function PetScale({ weightKg }: { weightKg?: number }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const p = makePaint(`sc${uid}`);
  const body = (
    <>
      <Shadow p={p} cx={116} cy={74} rx={108} ry={8} o={0.32} />
      <Box p={p} x={6} y={24} w={216} h={46} d={14} color="#F4F7F6" rx={18}>
        <rect x="64" y="36" width="104" height="30" rx="9" fill="#1F2D2A" />
        <text x="116" y="58" textAnchor="middle" fontFamily="Nunito, sans-serif" fontWeight="800" fontSize="18" fill="#1FBF8F">{weightKg ? `${weightKg} kg` : "— kg"}</text>
      </Box>
      <rect x="0" y="12" width="236" height="22" rx="11" fill={p.lin("#FFFFFF", { light: 0, dark: 0.1 })} />
      <rect x="4" y="14" width="228" height="4" rx="2" fill="#fff" opacity=".7" />
    </>
  );
  return (
    <div style={{ position: "relative", width: 240, height: 260 }}>
      <div style={{ position: "absolute", left: 30, top: 0 }}><Pet state="awake" size={180} /></div>
      <svg style={{ position: "absolute", left: 0, top: 168 }} width="240" height="86" viewBox="0 0 240 86" role="img" aria-label="Waga">
        {body}
        {p.defs()}
      </svg>
    </div>
  );
}
