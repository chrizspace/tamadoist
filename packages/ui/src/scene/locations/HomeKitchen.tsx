import { Glows, Tint, Win, type LocationProps } from "../parts";

export function HomeKitchen({ light, id }: LocationProps) {
  return (
    <>
      <rect width="390" height="844" fill="#FFF4E0" />
      <rect y="300" width="390" height="260" fill="#FFE2B8" />
      <g fill="#fff" opacity=".7">{Array.from({ length: 13 }, (_, i) => <rect key={i} x={i * 32} y="300" width="3" height="260" />)}{[360, 420, 480].map((y) => <rect key={y} y={y} width="390" height="3" />)}</g>
      <rect y="560" width="390" height="284" fill="#F2D9B3" />
      <g fill="#E9C58E">{Array.from({ length: 6 }, (_, r) => Array.from({ length: 7 }, (_, c) => (r + c) % 2 === 0 ? <rect key={`${r}-${c}`} x={c * 60 - 15} y={600 + r * 40} width="60" height="40" /> : null))}</g>
      <rect y="552" width="390" height="10" fill="#fff" />
      <Win x={150} y={90} w={110} h={120} light={light} />
      <rect x="16" y="186" width="120" height="70" rx="8" fill="#fff" stroke="#E2E8E6" strokeWidth="3" />
      <rect x="274" y="186" width="100" height="70" rx="8" fill="#fff" stroke="#E2E8E6" strokeWidth="3" />
      <rect x="0" y="470" width="130" height="90" rx="6" fill="#C58B52" />
      <rect x="10" y="440" width="46" height="30" rx="6" fill="#1F2D2A" />
      <circle cx="26" cy="456" r="6" fill="#FF5A5F" />
      <rect x="302" y="270" width="76" height="290" rx="10" fill="#DDE7EF" stroke="#C4D2DE" strokeWidth="3" />
      <rect x="302" y="400" width="76" height="4" fill="#C4D2DE" />
      <rect x="312" y="320" width="6" height="40" rx="3" fill="#8FA8C4" /><rect x="312" y="420" width="6" height="40" rx="3" fill="#8FA8C4" />
      <ellipse cx="170" cy="700" rx="150" ry="36" fill="#C58B52" />
      <ellipse cx="170" cy="692" rx="150" ry="34" fill="#D9A066" />
      <ellipse cx="130" cy="690" rx="40" ry="12" fill="#fff" stroke="#E2E8E6" strokeWidth="3" />
      <path d="M106 686l24-12 26 12z" fill="#F4B860" /><rect x="108" y="684" width="48" height="5" rx="2" fill="#10B38A" />
      <circle cx="214" cy="684" r="8" fill="#FF5A5F" />
      {[60, 128].map((x) => <g key={x}><rect x={x} y="40" width="4" height="62" fill="#8B5A33" /><path d={`M${x - 22} 102h48l-10 26h-28z`} fill="#E07A5F" /></g>)}
      <Tint light={light} />
      <Glows lamps={[{ x: 62, y: 112, r: 120 }, { x: 130, y: 112, r: 120 }]} light={light} id={id} />
    </>
  );
}
