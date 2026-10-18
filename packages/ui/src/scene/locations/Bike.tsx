import { Cloud, Glows, Sky, Tint, type LocationProps } from "../parts";

export function Bike({ light, id }: LocationProps) {
  const tree = (x: number, y: number, s: number) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-4" y="40" width="8" height="30" fill="#2D6FA3" />
      <polygon points="0,-20 26,30 -26,30" fill="#0B8F6F" /><polygon points="0,-44 20,0 -20,0" fill="#0B8F6F" />
    </g>
  );
  return (
    <>
      <Sky light={light} id={id} />
      <Cloud x={40} y={100} w={100} light={light} /><Cloud x={260} y={150} w={80} light={light} />
      <ellipse cx="100" cy="520" rx="260" ry="90" fill="#8EC5FF" /><ellipse cx="330" cy="530" rx="240" ry="80" fill="#7DB7F0" />
      <rect y="520" width="390" height="324" fill="#10B38A" />
      <polygon points="180,520 212,520 330,844 40,844" fill="#6E7B8A" />
      <polygon points="195,520 197,520 215,844 175,844" fill="#fff" opacity=".6" />
      <path d="M186 560l10 0M188 600l12 0M190 650l16 0M192 710l22 0M194 780l28 0" stroke="#fff" strokeWidth="5" opacity=".8" />
      {tree(40, 560, 0.9)}{tree(110, 540, 0.6)}{tree(350, 580, 1)}{tree(290, 545, 0.65)}
      <g transform="translate(250 650)">
        <circle cx="0" cy="40" r="30" fill="none" stroke="#1F2D2A" strokeWidth="6" /><circle cx="90" cy="40" r="30" fill="none" stroke="#1F2D2A" strokeWidth="6" />
        <path d="M0 40L36 0H72L90 40M36 0L48 40H0M48 40L72 0M30 -10h22M72 0l-4 -14h14" stroke="#FF5A5F" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g><rect x="46" y="450" width="6" height="130" fill="#1F2D2A" /><path d="M32 450h34l-6-20h-22z" fill="#FFC93C" /></g>
      <Tint light={light} />
      <Glows lamps={[{ x: 49, y: 440, r: 150 }]} light={light} id={id} />
    </>
  );
}
