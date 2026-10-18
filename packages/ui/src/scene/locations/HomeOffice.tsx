import { darken, makePaint } from "../paint";
import { Glows, Tint, type LocationProps } from "../parts";
import { Box, Floor, Pendant, Plant3D, Shadow, Shaft, Wall, Window3D } from "../solids";

export function HomeOffice({ light, id }: LocationProps) {
  const p = makePaint(id);
  const ctx = { p, light };
  const books = ["#E07A5F", "#4CC3FF", "#FFC93C", "#1FBF8F", "#7C84D6", "#FF9AA2"];
  const body = (
    <>
      <Wall p={p} color="#D6EDE4" />
      <Floor p={p} color="#D9A56E" kind="wood" />
      <Window3D {...ctx} x={240} y={118} w={118} h={124} />
      <Shaft {...ctx} x={240} w={118} from={256} to={730} />
      <Shadow p={p} cx={64} cy={548} rx={64} ry={9} o={0.35} />
      <Box p={p} x={14} y={186} w={104} h={356} d={18} color="#A8723F" rx={5} />
      <rect x="22" y="194" width="88" height="340" rx="3" fill={darken("#A8723F", 0.5)} />
      {[262, 336, 410, 484].map((y) => <rect key={y} x="22" y={y} width="88" height="7" fill={p.lin("#A8723F", { light: 0.3, dark: 0.1 })} />)}
      {[200, 270, 344, 418, 492].map((y, r) => (
        <g key={y}>
          {books.slice(0, 5).map((c, i) => <rect key={i} x={26 + i * 16.5} y={y + (r % 2) * 5} width="13" height={54 - (r % 2) * 5} rx="2" fill={p.lin(books[(i + r) % books.length]!, { light: 0.25, dark: 0.18, dir: "h" })} />)}
        </g>
      ))}
      <Shadow p={p} cx={296} cy={584} rx={104} ry={11} o={0.32} />
      <Box p={p} x={196} y={500} w={194} h={14} d={22} color="#C58B52" rx={4} />
      <Box p={p} x={206} y={514} w={12} h={64} d={8} color="#A8723F" rx={2} />
      <Box p={p} x={366} y={514} w={12} h={64} d={8} color="#A8723F" rx={2} />
      <Box p={p} x={250} y={432} w={94} h={58} d={8} color="#26323A" rx={6}>
        <rect x="256" y="438" width="82" height="46" rx="3" fill={p.lin("#4CC3FF", { light: 0.35, dark: 0.1 })} />
        <polygon points="262,478 286,440 300,440 276,478" fill="#fff" opacity=".22" />
      </Box>
      <rect x="291" y="490" width="14" height="10" fill="#26323A" />
      <Box p={p} x={244} y={494} w={106} h={6} d={14} color="#F4F4F4" rx={2} />
      <rect x="352" y="440" width="6" height="62" fill="#26323A" />
      <path d="M332 446h42l-9-20h-24z" fill={p.lin("#FFC93C", { light: 0.3, dark: 0.2 })} />
      <Shadow p={p} cx={168} cy={584} rx={42} ry={7} o={0.3} />
      <Box p={p} x={146} y={484} w={44} h={60} d={10} color="#4B4FA8" rx={8} />
      <Box p={p} x={138} y={548} w={60} h={16} d={18} color="#5C61C2" rx={6} />
      <Plant3D p={p} x={332} y={562} />
      <Pendant p={p} x={195} y={56} />
      <Tint light={light} />
      <Glows lamps={[{ x: 355, y: 432, r: 130 }, { x: 195, y: 100, r: 200 }]} light={light} id={id} />
    </>
  );
  return <>{body}{p.defs()}</>;
}
