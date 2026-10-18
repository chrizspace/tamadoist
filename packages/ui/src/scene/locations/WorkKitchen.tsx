import { Glows, Tint, Win, type LocationProps } from "../parts";

export function WorkKitchen({ light, id }: LocationProps) {
  return (
    <>
      <rect width="390" height="844" fill="#F3F6F8" />
      <g fill="#E2E8EE">{Array.from({ length: 13 }, (_, i) => <rect key={i} x={i * 32} y="260" width="3" height="300" />)}{[320, 380, 440, 500].map((y) => <rect key={y} y={y} width="390" height="3" />)}</g>
      <rect y="560" width="390" height="284" fill="#C7D0D9" />
      <g fill="#B6C0CB">{Array.from({ length: 7 }, (_, r) => <rect key={r} y={600 + r * 40} width="390" height="3" />)}</g>
      <rect y="552" width="390" height="10" fill="#fff" />
      <Win x={24} y={90} w={110} h={120} light={light} />
      <rect x="0" y="480" width="200" height="80" rx="6" fill="#C58B52" />
      <rect x="0" y="470" width="200" height="14" fill="#E9C58E" />
      <rect x="18" y="404" width="56" height="66" rx="8" fill="#B43A3A" />
      <rect x="28" y="414" width="36" height="22" rx="4" fill="#1F2D2A" />
      <rect x="34" y="446" width="24" height="24" rx="4" fill="#fff" />
      <rect x="96" y="420" width="72" height="50" rx="6" fill="#DDE7EF" stroke="#8FA8C4" strokeWidth="3" />
      <rect x="104" y="428" width="40" height="34" rx="4" fill="#1F2D2A" />
      <circle cx="156" cy="440" r="4" fill="#1FBF8F" /><circle cx="156" cy="454" r="4" fill="#FFC93C" />
      <ellipse cx="176" cy="462" rx="18" ry="7" fill="#fff" stroke="#E2E8E6" strokeWidth="2" />
      <circle cx="170" cy="456" r="6" fill="#FF5A5F" /><circle cx="182" cy="458" r="6" fill="#FFC93C" />
      <rect x="284" y="260" width="92" height="300" rx="10" fill="#4B4FA8" />
      <rect x="294" y="274" width="72" height="150" rx="6" fill="#DDE7EF" />
      {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={300 + c * 22} y={282 + r * 44} width="16" height="30" rx="3" fill={["#FF5A5F", "#FFC93C", "#1FBF8F", "#4CC3FF"][(r + c) % 4]} />))}
      <rect x="294" y="440" width="72" height="24" rx="4" fill="#1F2D2A" />
      <ellipse cx="200" cy="716" rx="140" ry="32" fill="#C58B52" />
      <ellipse cx="200" cy="708" rx="140" ry="30" fill="#D9A066" />
      <rect x="160" y="690" width="80" height="14" rx="4" fill="#fff" stroke="#E2E8E6" strokeWidth="2" />
      <path d="M170 690l24-12 26 12z" fill="#F4B860" />
      {[40, 170, 290].map((x) => <rect key={x} x={x} y="20" width="70" height="14" rx="4" fill="#fff" />)}
      <Tint light={light} />
      <Glows lamps={[{ x: 75, y: 30, r: 150 }, { x: 205, y: 30, r: 150 }, { x: 325, y: 30, r: 150 }, { x: 330, y: 340, r: 90 }]} light={light} id={id} color="#E8F4FF" />
    </>
  );
}
