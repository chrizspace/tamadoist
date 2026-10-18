import { darken, makePaint } from "../paint";
import { Ball, Box, CeilingLights, Floor, Shadow, Wall, Window3D } from "../solids";
import { Glows, Tint, type LocationProps } from "../parts";

export function WorkKitchen({ light, id }: LocationProps) {
  const p = makePaint(id);
  const ctx = { p, light };
  const body = (
    <>
      <Wall p={p} color="#EEF3F7" />
      <g fill="#E2E8EE">{Array.from({ length: 13 }, (_, i) => <rect key={i} x={i * 32} y="260" width="3" height="290" />)}{[320, 380, 440, 500].map((y) => <rect key={y} y={y} width="390" height="3" />)}</g>
      <Floor p={p} color="#C5CED8" kind="tile" />
      <Window3D {...ctx} x={24} y={90} w={106} h={116} />
      <Shadow p={p} cx={104} cy={566} rx={112} ry={10} o={0.32} />
      <Box p={p} x={0} y={478} w={206} h={84} d={24} color="#C58B52" rx={4}>
        {[8, 74, 140].map((x) => <rect key={x} x={x} y="494" width="58" height="56" rx="4" fill={darken("#C58B52", 0.12)} />)}
      </Box>
      <Box p={p} x={16} y={404} w={58} h={74} d={14} color="#B43A3A" rx={6}>
        <rect x="26" y="414" width="38" height="22" rx="4" fill="#1F2D2A" /><rect x="34" y="448" width="22" height="30" rx="4" fill={p.lin("#FFFFFF", { light: 0, dark: 0.12 })} />
        <circle cx="36" cy="426" r="3" fill="#FF8A3D" />
      </Box>
      <Box p={p} x={96} y={424} w={74} h={54} d={12} color="#DDE7EF" rx={6}>
        <rect x="104" y="432" width="42" height="38" rx="4" fill={p.lin("#26323A", { light: 0.2, dark: 0.1 })} /><circle cx="158" cy="442" r="4" fill="#1FBF8F" /><circle cx="158" cy="458" r="4" fill="#FFC93C" />
      </Box>
      <Ball p={p} cx={184} cy={466} r={9} color="#FF5A5F" /><Ball p={p} cx={196} cy={468} r={8} color="#FFC93C" />
      <Shadow p={p} cx={334} cy={566} rx={60} ry={9} o={0.34} />
      <Box p={p} x={282} y={258} w={96} h={304} d={24} color="#4B4FA8" rx={8}>
        <rect x="292" y="272" width="76" height="152" rx="6" fill={p.lin("#DDE7EF", { light: 0.2, dark: 0.1 })} />
        {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={298 + c * 23} y={280 + r * 46} width="17" height="32" rx="4" fill={p.lin(["#FF5A5F", "#FFC93C", "#1FBF8F", "#4CC3FF"][(r + c) % 4]!, { light: 0.3, dark: 0.2 })} />))}
        <rect x="292" y="440" width="76" height="24" rx="4" fill="#1F2D2A" />
      </Box>
      <Shadow p={p} cx={200} cy={744} rx={150} ry={14} o={0.3} />
      <ellipse cx="200" cy="722" rx="140" ry="32" fill={darken("#C58B52", 0.25)} />
      <ellipse cx="200" cy="712" rx="140" ry="30" fill={p.rad("#D9A066", { cx: 0.4, cy: 0.3, light: 0.2, dark: 0.12 })} />
      <Box p={p} x={158} y={690} w={84} h={14} d={10} color="#FFFFFF" rx={4} />
      <path d="M168 690l26-13 28 13z" fill={p.lin("#F4B860", { light: 0.3, dark: 0.15 })} />
      <CeilingLights {...ctx} />
      <Tint light={light} />
      <Glows lamps={[{ x: 75, y: 30, r: 150 }, { x: 205, y: 30, r: 150 }, { x: 325, y: 30, r: 150 }]} light={light} id={id} color="#E8F4FF" />
    </>
  );
  return <>{body}{p.defs()}</>;
}
