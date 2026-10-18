import { Glows, Plant, Tint, Win, type LocationProps } from "../parts";

export function OpenSpace({ light, id }: LocationProps) {
  const desk = (x: number, y: number) => (
    <g>
      <rect x={x} y={y} width="140" height="14" rx="5" fill="#C58B52" />
      <rect x={x + 10} y={y + 14} width="10" height="52" fill="#A8723F" /><rect x={x + 120} y={y + 14} width="10" height="52" fill="#A8723F" />
      <rect x={x + 30} y={y - 66} width="80" height="58" rx="6" fill="#1F2D2A" />
      <rect x={x + 36} y={y - 60} width="68" height="46" rx="3" fill="#4CC3FF" />
      <rect x={x + 62} y={y - 8} width="16" height="8" fill="#1F2D2A" />
      <rect x={x + 24} y={y - 4} width="92" height="6" rx="3" fill="#fff" />
    </g>
  );
  return (
    <>
      <rect width="390" height="844" fill="#E6EEF6" />
      <rect y="560" width="390" height="284" fill="#B8C4D2" />
      <g fill="#A9B6C6">{[610, 670, 730, 790].map((y) => <rect key={y} y={y} width="390" height="3" />)}</g>
      <rect y="552" width="390" height="10" fill="#fff" />
      <Win x={24} y={110} w={342} h={190} light={light}>
        <g fill="#8FA8C4"><rect x="44" y="200" width="40" height="100" /><rect x="92" y="160" width="52" height="140" /><rect x="152" y="210" width="36" height="90" /><rect x="196" y="140" width="56" height="160" /><rect x="260" y="190" width="44" height="110" /><rect x="312" y="220" width="40" height="80" /></g>
        {light.lit && <g fill="#FFE9A8">{[[104, 180], [120, 180], [104, 204], [212, 160], [228, 160], [212, 186], [272, 210], [324, 240]].map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width="8" height="10" />)}</g>}
      </Win>
      <circle cx="338" cy="350" r="20" fill="#fff" stroke="#8FA8C4" strokeWidth="5" />
      <path d="M338 350V337M338 350l9 5" stroke="#1F2D2A" strokeWidth="4" strokeLinecap="round" />
      {desk(234, 504)}
      {desk(10, 504)}
      <rect x="364" y="476" width="18" height="22" rx="4" fill="#E07A5F" />
      <Plant x={160} y={520} />
      {[40, 170, 290].map((x) => <rect key={x} x={x} y="20" width="70" height="14" rx="4" fill="#fff" />)}
      <Tint light={light} />
      <Glows lamps={[{ x: 75, y: 30, r: 150 }, { x: 205, y: 30, r: 150 }, { x: 325, y: 30, r: 150 }, { x: 304, y: 470, r: 90 }]} light={light} id={id} color="#E8F4FF" />
    </>
  );
}
