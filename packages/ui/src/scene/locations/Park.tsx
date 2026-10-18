import { Cloud, Glows, Sky, Tint, type LocationProps } from "../parts";

export function Park({ light, id }: LocationProps) {
  const tree = (x: number, s: number) => (
    <g transform={`translate(${x} 0) scale(${s})`}>
      <rect x="16" y={520 / s} width="10" height={60 / s} fill="#2D6FA3" />
      {[330, 390, 450].map((y, i) => <polygon key={y} points={`21,${y / s} ${51 + i * 6},${(y + 76) / s} ${-9 - i * 6},${(y + 76) / s}`} fill="#0B8F6F" />)}
    </g>
  );
  return (
    <>
      <Sky light={light} id={id} />
      <Cloud x={30} y={110} w={110} light={light} /><Cloud x={250} y={60} w={90} light={light} /><Cloud x={300} y={230} w={70} light={light} />
      <ellipse cx="200" cy="670" rx="380" ry="200" fill="#8EC5FF" />
      {tree(10, 1)}{tree(340, 0.85)}
      <ellipse cx="195" cy="960" rx="495" ry="380" fill="#10B38A" />
      <path d="M150 844C170 740 200 640 250 590" stroke="#E9D6A8" strokeWidth="50" fill="none" strokeLinecap="round" opacity=".8" />
      <g><rect x="250" y="560" width="84" height="12" rx="4" fill="#C58B52" /><rect x="254" y="540" width="76" height="10" rx="4" fill="#A8723F" /><rect x="258" y="572" width="8" height="26" fill="#8B5A33" /><rect x="318" y="572" width="8" height="26" fill="#8B5A33" /></g>
      <g><rect x="46" y="440" width="6" height="150" fill="#1F2D2A" /><path d="M32 440h34l-6-20h-22z" fill="#FFC93C" /></g>
      {[[90, 700], [300, 740], [120, 790]].map(([x, y]) => <g key={`${x}`}><circle cx={x} cy={y} r="6" fill="#FFC93C" /><circle cx={x + 14} cy={y + 6} r="5" fill="#FF9AA2" /></g>)}
      <Tint light={light} />
      <Glows lamps={[{ x: 49, y: 430, r: 150 }]} light={light} id={id} />
    </>
  );
}
