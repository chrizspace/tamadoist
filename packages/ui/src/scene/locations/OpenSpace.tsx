import { makePaint } from "../paint";
import { Glows, Tint, type LocationProps } from "../parts";
import { Box, CeilingLights, Floor, Plant3D, Shadow, Shaft, Wall, Window3D } from "../solids";

export function OpenSpace({ light, id }: LocationProps) {
  const p = makePaint(id);
  const ctx = { p, light };
  const desk = (x: number, y: number) => (
    <g key={x}>
      <Shadow p={p} cx={x + 76} cy={y + 76} rx={84} ry={8} o={0.3} />
      <Box p={p} x={x + 30} y={y - 66} w={80} h={56} d={8} color="#26323A" rx={5}>
        <rect x={x + 36} y={y - 60} width="68" height="44" rx="3" fill={p.lin("#4CC3FF", { light: 0.35, dark: 0.1 })} />
        <polygon points={`${x + 42},${y - 20} ${x + 62},${y - 60} ${x + 74},${y - 60} ${x + 54},${y - 20}`} fill="#fff" opacity=".22" />
      </Box>
      <rect x={x + 62} y={y - 10} width="16" height="10" fill="#26323A" />
      <Box p={p} x={x} y={y} w={140} h={14} d={20} color="#C58B52" rx={4} />
      <Box p={p} x={x + 8} y={y + 14} w={10} h={56} d={8} color="#A8723F" rx={2} />
      <Box p={p} x={x + 122} y={y + 14} w={10} h={56} d={8} color="#A8723F" rx={2} />
      <Box p={p} x={x + 26} y={y - 6} w={92} h={5} d={12} color="#FFFFFF" rx={2} />
    </g>
  );
  const body = (
    <>
      <Wall p={p} color="#E3ECF5" />
      <Floor p={p} color="#B4C0CE" kind="carpet" />
      <Window3D {...ctx} x={24} y={104} w={342} h={186}>
        <g>
          {[[44, 196, 40, 94], [92, 156, 52, 134], [152, 206, 36, 84], [196, 138, 56, 152], [260, 186, 44, 104], [312, 216, 40, 74]].map(([x, y, w, h]) => (
            <g key={`${x}`}>
              <rect x={x} y={y} width={w} height={h} fill={p.lin("#8FA8C4", { light: 0.2, dark: 0.25, dir: "h" })} />
              <rect x={x! + w! - 8} y={y} width="8" height={h} fill="#000" opacity=".12" />
            </g>
          ))}
          {light.lit && <g fill="#FFE9A8">{[[104, 176], [120, 176], [104, 200], [212, 156], [228, 156], [212, 182], [272, 206], [324, 236]].map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width="8" height="10" />)}</g>}
        </g>
      </Window3D>
      <Shaft {...ctx} x={24} w={342} from={304} to={760} />
      <circle cx="338" cy="352" r="21" fill={p.rad("#FFFFFF", { cx: 0.4, cy: 0.3, light: 0, dark: 0.12 })} stroke="#8FA8C4" strokeWidth="5" />
      <path d="M338 352V338M338 352l10 5" stroke="#1F2D2A" strokeWidth="4" strokeLinecap="round" />
      {desk(234, 504)}
      {desk(10, 504)}
      <Plant3D p={p} x={166} y={520} />
      <CeilingLights {...ctx} />
      <Tint light={light} />
      <Glows lamps={[{ x: 75, y: 30, r: 150 }, { x: 205, y: 30, r: 150 }, { x: 325, y: 30, r: 150 }]} light={light} id={id} color="#E8F4FF" />
    </>
  );
  return <>{body}{p.defs()}</>;
}
