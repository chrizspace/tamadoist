import { Glows, Tint, type LocationProps } from "../parts";

export function Gym({ light, id }: LocationProps) {
  return (
    <>
      <rect width="390" height="844" fill="#2B3A42" />
      <rect y="190" width="390" height="14" fill="#FF8A3D" />
      <rect x="20" y="230" width="190" height="250" rx="10" fill="#9FC3D6" opacity=".75" />
      <rect x="20" y="230" width="190" height="250" rx="10" fill="none" stroke="#C9E0EC" strokeWidth="6" />
      <path d="M40 470L120 240M90 470L170 240" stroke="#fff" strokeWidth="10" opacity=".3" />
      <rect y="560" width="390" height="284" fill="#3A3F46" />
      <g fill="#2F343A">{Array.from({ length: 7 }, (_, r) => <rect key={r} y={600 + r * 40} width="390" height="3" />)}</g>
      <rect y="552" width="390" height="10" fill="#FF8A3D" />
      <rect x="250" y="410" width="132" height="12" rx="4" fill="#C9D3DC" />
      <rect x="258" y="422" width="8" height="136" fill="#9AA6B0" /><rect x="364" y="422" width="8" height="136" fill="#9AA6B0" />
      {[[274, 380, 14, "#FF5A5F"], [304, 384, 11, "#4CC3FF"], [332, 380, 14, "#FFC93C"], [360, 384, 11, "#1FBF8F"]].map(([x, y, r, c]) => <g key={`${x}`}><circle cx={x as number} cy={y as number} r={r as number} fill={c as string} /><rect x={(x as number) - 8} y={(y as number) + 4} width="16" height="6" fill="#1F2D2A" /></g>)}
      <rect x="250" y="490" width="132" height="10" rx="4" fill="#C9D3DC" />
      <rect x="22" y="520" width="110" height="26" rx="8" fill="#1F2D2A" />
      <rect x="104" y="440" width="10" height="90" fill="#1F2D2A" /><rect x="76" y="436" width="62" height="24" rx="6" fill="#4CC3FF" />
      <circle cx="180" cy="590" r="20" fill="#FF8A3D" /><rect x="170" y="560" width="20" height="14" rx="4" fill="#1F2D2A" />
      {[40, 170, 290].map((x) => <rect key={x} x={x} y="20" width="70" height="14" rx="4" fill="#E8F4FF" />)}
      <Tint light={light} />
      <Glows lamps={[{ x: 75, y: 30, r: 150 }, { x: 205, y: 30, r: 150 }, { x: 325, y: 30, r: 150 }]} light={{ ...light, lit: true }} id={id} color="#E8F4FF" />
    </>
  );
}
