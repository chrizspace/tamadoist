import { Glows, Tint, Win, type LocationProps } from "../parts";

export function Pool({ light, id }: LocationProps) {
  return (
    <>
      <rect width="390" height="844" fill="#D9F2F7" />
      <g fill="#C3E7EE">{Array.from({ length: 13 }, (_, i) => <rect key={i} x={i * 32} y="0" width="3" height="500" />)}{[100, 200, 300, 400].map((y) => <rect key={y} y={y} width="390" height="3" />)}</g>
      <Win x={30} y={90} w={110} h={120} light={light} /><Win x={250} y={90} w={110} h={120} light={light} />
      <rect y="470" width="390" height="90" fill="#F4EBD9" />
      <rect y="556" width="390" height="10" fill="#fff" />
      <rect y="566" width="390" height="278" fill="#4CC3FF" />
      {[600, 650, 700, 750, 800].map((y, i) => <path key={y} d={`M0 ${y}q48 -12 97 0t98 0t98 0t97 0`} stroke="#9ADFFF" strokeWidth="5" fill="none" opacity={0.8 - i * 0.08} />)}
      {[640, 730].map((y) => <g key={y}>{Array.from({ length: 14 }, (_, i) => <circle key={i} cx={14 + i * 28} cy={y} r="6" fill={i % 2 ? "#FFC93C" : "#FF5A5F"} />)}</g>)}
      <g stroke="#C9D3DC" strokeWidth="7" fill="none" strokeLinecap="round"><path d="M340 560v-70q0 -20 20 -20h20" /><path d="M368 560v-70" /></g>
      {[40, 170, 290].map((x) => <rect key={x} x={x} y="20" width="70" height="14" rx="4" fill="#fff" />)}
      <Tint light={light} />
      <Glows lamps={[{ x: 75, y: 30, r: 150 }, { x: 205, y: 30, r: 150 }, { x: 325, y: 30, r: 150 }]} light={light} id={id} color="#E8F8FF" />
      <Glows lamps={[{ x: 195, y: 700, r: 220 }]} light={light} id={`${id}p`} color="#7FE0FF" />
    </>
  );
}
