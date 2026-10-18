import { darken, lighten, makePaint } from "../paint";
import { Glows, Sky, Tint, type LocationProps } from "../parts";
import { Box, Cloud3D, Hill, Shadow, Tree3D } from "../solids";

export function Bike({ light, id }: LocationProps) {
  const p = makePaint(id);
  const body = (
    <>
      <Sky light={light} id={id} />
      <Cloud3D x={40} y={100} w={100} light={light} /><Cloud3D x={260} y={150} w={80} light={light} />
      <Hill p={p} cx={100} cy={522} rx={270} ry={92} color="#9CCBFF" /><Hill p={p} cx={330} cy={530} rx={250} ry={80} color="#86B7F0" />
      <rect y="520" width="390" height="324" fill={p.lin("#10B38A", { light: 0.2, dark: 0.18 })} />
      <rect y="520" width="390" height="30" fill={p.fade("#0B1020", 0.18, 0)} />
      <polygon points="178,520 214,520 352,844 28,844" fill={darken("#4A5663", 0.2)} />
      <polygon points="180,520 212,520 340,844 40,844" fill={p.lin("#7C8997", { light: 0.1, dark: 0.3 })} />
      <polygon points="172,520 180,520 40,844 22,844" fill={lighten("#C9D3DC", 0.1)} /><polygon points="214,520 222,520 372,844 346,844" fill={darken("#C9D3DC", 0.2)} />
      {[[560, 3, 10], [600, 4, 16], [650, 6, 24], [715, 8, 36], [790, 11, 52]].map(([y, w, h]) => <rect key={`${y}`} x={196 - w! / 2} y={y} width={w} height={h} rx={w! / 3} fill="#fff" opacity=".8" />)}
      <Tree3D p={p} x={40} y={566} s={0.9} /><Tree3D p={p} x={112} y={540} s={0.6} /><Tree3D p={p} x={350} y={586} s={1} /><Tree3D p={p} x={290} y={548} s={0.62} />
      <Shadow p={p} cx={300} cy={722} rx={74} ry={9} o={0.4} />
      <g transform="translate(250 650)">
        {[0, 90].map((x) => (
          <g key={x}>
            <circle cx={x} cy="40" r="31" fill="none" stroke="#1F2D2A" strokeWidth="8" />
            <circle cx={x} cy="40" r="27" fill="none" stroke={lighten("#4A5663", 0.2)} strokeWidth="1.5" opacity=".5" />
            <circle cx={x} cy="40" r="4" fill="#C9D3DC" />
          </g>
        ))}
        <path d="M0 40L36 0H72L90 40M36 0L48 40H0M48 40L72 0M30 -10h22M72 0l-4 -14h14" stroke={darken("#FF5A5F", 0.25)} strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M0 38L36 -2H72L90 38M36 -2L48 38H0M48 38L72 -2M30 -12h22M72 -2l-4 -14h14" stroke="#FF5A5F" strokeWidth="5.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <Shadow p={p} cx={58} cy={598} rx={18} ry={5} o={0.3} />
      <Box p={p} x={46} y={448} w={6} h={150} d={4} color="#2B3A42" rx={2} />
      <path d="M30 450h38l-7-22h-24z" fill={p.lin("#FFC93C", { light: 0.3, dark: 0.2 })} />
      <Tint light={light} />
      <Glows lamps={[{ x: 49, y: 438, r: 150 }]} light={light} id={id} />
    </>
  );
  return <>{body}{p.defs()}</>;
}
