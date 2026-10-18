import { darken, makePaint } from "../paint";
import { Glows, Tint, type LocationProps } from "../parts";
import { Ball, Box, CeilingLights, Floor, Shadow, Wall } from "../solids";

export function Gym({ light, id }: LocationProps) {
  const p = makePaint(id);
  const ctx = { p, light };
  const body = (
    <>
      <Wall p={p} color="#33444D" />
      <rect y="186" width="390" height="16" fill={p.lin("#FF8A3D", { light: 0.2, dark: 0.2 })} />
      <rect x="20" y="226" width="196" height="252" rx="10" fill={darken("#9FC3D6", 0.4)} />
      <rect x="24" y="230" width="188" height="244" rx="8" fill={p.lin("#A9CDE0", { light: 0.25, dark: 0.25 })} />
      <polygon points="44,470 120,236 150,236 74,470" fill="#fff" opacity=".22" /><polygon points="96,470 150,300 164,300 110,470" fill="#fff" opacity=".14" />
      <rect x="20" y="226" width="196" height="252" rx="10" fill="none" stroke="#DCE7EE" strokeWidth="6" />
      <Floor p={p} color="#3A4048" kind="rubber" />
      <rect y="552" width="390" height="10" fill={p.lin("#FF8A3D", { light: 0.2, dark: 0.2 })} />
      <Shadow p={p} cx={318} cy={566} rx={72} ry={9} o={0.4} />
      <Box p={p} x={250} y={414} w={132} h={10} d={14} color="#C9D3DC" rx={3} />
      <Box p={p} x={256} y={424} w={8} h={138} d={6} color="#8FA0AD" rx={2} /><Box p={p} x={366} y={424} w={8} h={138} d={6} color="#8FA0AD" rx={2} />
      <Box p={p} x={250} y={492} w={132} h={10} d={14} color="#C9D3DC" rx={3} />
      {[[276, 396, 15, "#FF5A5F"], [306, 400, 12, "#4CC3FF"], [334, 396, 15, "#FFC93C"], [362, 400, 12, "#1FBF8F"]].map(([x, y, r, c]) => (
        <g key={`${x}`}><Ball p={p} cx={x as number} cy={y as number} r={r as number} color={c as string} /><rect x={(x as number) - 9} y={(y as number) + 4} width="18" height="6" fill="#1F2D2A" /></g>
      ))}
      {[[276, 478, 15, "#FF8A3D"], [306, 480, 12, "#B36BFF"], [334, 478, 15, "#FF5A5F"], [362, 480, 12, "#4CC3FF"]].map(([x, y, r, c]) => (
        <g key={`${x}`}><Ball p={p} cx={x as number} cy={y as number} r={r as number} color={c as string} /><rect x={(x as number) - 9} y={(y as number) + 4} width="18" height="6" fill="#1F2D2A" /></g>
      ))}
      <Shadow p={p} cx={78} cy={572} rx={70} ry={8} o={0.4} />
      <Box p={p} x={22} y={518} w={112} h={26} d={18} color="#1F2D2A" rx={6} />
      <Box p={p} x={34} y={544} w={10} h={22} d={6} color="#8FA0AD" rx={2} /><Box p={p} x={110} y={544} w={10} h={22} d={6} color="#8FA0AD" rx={2} />
      <rect x="40" y="446" width="78" height="9" rx="4" fill={p.lin("#C9D3DC", { light: 0.2, dark: 0.3 })} />
      <rect x="62" y="428" width="9" height="46" rx="3" fill="#1F2D2A" /><rect x="86" y="428" width="9" height="46" rx="3" fill="#1F2D2A" />
      <Shadow p={p} cx={180} cy={598} rx={26} ry={5} o={0.4} />
      <Ball p={p} cx={180} cy={586} r={20} color="#FF8A3D" />
      <path d="M168 570Q180 552 192 570" stroke="#1F2D2A" strokeWidth="6" fill="none" strokeLinecap="round" />
      <CeilingLights {...ctx} />
      <Tint light={light} />
      <Glows lamps={[{ x: 75, y: 30, r: 150 }, { x: 205, y: 30, r: 150 }, { x: 325, y: 30, r: 150 }]} light={{ ...light, lit: true }} id={id} color="#E8F4FF" />
    </>
  );
  return <>{body}{p.defs()}</>;
}
