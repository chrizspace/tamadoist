import { Glows, Plant, Tint, Win, type LocationProps } from "../parts";

export function Bedroom({ light, id }: LocationProps) {
  return (
    <>
      <rect width="390" height="844" fill="#E9E3FF" />
      <rect y="548" width="390" height="296" fill="#C9A27A" />
      <g fill="#B88F66">{[600, 660, 720, 780].map((y) => <rect key={y} y={y} width="390" height="4" />)}</g>
      <rect y="540" width="390" height="12" fill="#fff" />
      <Win x={36} y={130} w={120} h={150} light={light} />
      <rect x="20" y="120" width="26" height="176" rx="10" fill="#F6A5C0" />
      <rect x="146" y="120" width="26" height="176" rx="10" fill="#F6A5C0" />
      <rect x="276" y="150" width="76" height="96" rx="8" fill="#CDEBE2" stroke="#fff" strokeWidth="6" />
      <path d="M284 238l20-26 14 16 12-12 18 22z" fill="#7C84D6" />
      <circle cx="318" cy="182" r="12" fill="#FFF6D6" />
      <ellipse cx="195" cy="770" rx="170" ry="36" fill="#CFC6F5" />
      <rect x="236" y="404" width="154" height="118" rx="16" fill="#8B5A33" />
      <rect x="224" y="476" width="166" height="96" rx="18" fill="#fff" />
      <rect x="224" y="512" width="166" height="60" rx="14" fill="#7C84D6" />
      <rect x="224" y="528" width="166" height="8" fill="#9AA0E8" />
      <ellipse cx="320" cy="478" rx="44" ry="18" fill="#F4F0FF" />
      <rect x="176" y="500" width="48" height="64" rx="8" fill="#C58B52" />
      <rect x="208" y="470" width="6" height="30" fill="#8B5A33" />
      <path d="M190 470h38l-8-26h-22z" fill="#FFC93C" />
      <Plant x={20} y={500} />
      <Tint light={light} />
      <Glows lamps={[{ x: 209, y: 452, r: 150 }]} light={light} id={id} />
    </>
  );
}
