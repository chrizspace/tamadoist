import { Glows, Plant, Tint, Win, type LocationProps } from "../parts";

export function HomeOffice({ light, id }: LocationProps) {
  const books = ["#E07A5F", "#4CC3FF", "#FFC93C", "#1FBF8F", "#7C84D6", "#FF9AA2", "#159A72"];
  return (
    <>
      <rect width="390" height="844" fill="#E3F1EC" />
      <rect y="548" width="390" height="296" fill="#C9A27A" />
      <g fill="#B88F66">{[600, 660, 720, 780].map((y) => <rect key={y} y={y} width="390" height="4" />)}</g>
      <rect y="540" width="390" height="12" fill="#fff" />
      <rect x="14" y="190" width="104" height="352" rx="8" fill="#A8723F" />
      {[250, 320, 390, 460].map((y) => <rect key={y} x="22" y={y} width="88" height="6" fill="#8B5A33" />)}
      {[196, 266, 336, 406, 476].map((y, r) => <g key={y}>{books.slice(0, 5).map((c, i) => <rect key={i} x={24 + i * 17} y={y + (r % 2) * 4} width="13" height={50 - (r % 2) * 4} rx="2" fill={books[(i + r) % books.length]} />)}</g>)}
      <Win x={238} y={120} w={120} h={130} light={light} />
      <rect x="200" y="504" width="190" height="16" rx="6" fill="#C58B52" />
      <rect x="212" y="520" width="12" height="60" fill="#A8723F" /><rect x="366" y="520" width="12" height="60" fill="#A8723F" />
      <rect x="250" y="456" width="92" height="50" rx="6" fill="#1F2D2A" />
      <rect x="256" y="462" width="80" height="38" rx="3" fill="#4CC3FF" />
      <rect x="240" y="500" width="112" height="6" rx="3" fill="#fff" />
      <rect x="352" y="440" width="6" height="64" fill="#1F2D2A" />
      <path d="M334 444h40l-8-18h-24z" fill="#FFC93C" />
      <rect x="140" y="540" width="54" height="40" rx="12" fill="#4B4FA8" />
      <Plant x={338} y={560} />
      <rect x="192" y="40" width="6" height="40" fill="#8B5A33" />
      <path d="M170 82h50l-10 24h-30z" fill="#FFC93C" />
      <Tint light={light} />
      <Glows lamps={[{ x: 355, y: 440, r: 130 }, { x: 195, y: 100, r: 190 }]} light={light} id={id} />
    </>
  );
}
