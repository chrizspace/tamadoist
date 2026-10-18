import { darken, lighten, makePaint } from "../paint";
import { Glows, Tint, type LocationProps } from "../parts";
import { Box, Floor, Pendant, Shadow, Shaft, Wall, Window3D } from "../solids";

export function HomeKitchen({ light, id }: LocationProps) {
  const p = makePaint(id);
  const ctx = { p, light };
  const body = (
    <>
      <Wall p={p} color="#FFEFD5" />
      <rect y="276" width="390" height="262" fill={p.lin("#FFE2B8", { light: 0.12, dark: 0.12 })} />
      <g fill="#fff" opacity=".7">{Array.from({ length: 13 }, (_, i) => <rect key={i} x={i * 32} y="276" width="3" height="262" />)}{[336, 396, 456].map((y) => <rect key={y} y={y} width="390" height="3" />)}</g>
      <rect y="276" width="390" height="30" fill={p.fade("#0B1020", 0.14, 0)} />
      <Floor p={p} color="#F2D9B3" kind="tile" />
      <Window3D {...ctx} x={150} y={90} w={106} h={112} />
      <Shaft {...ctx} x={150} w={106} from={216} to={740} />
      <Box p={p} x={14} y={180} w={124} h={74} d={22} color="#FFFFFF" rx={6}><rect x="70" y="190" width="3" height="54" fill="#D9E1E8" /></Box>
      <Box p={p} x={268} y={180} w={34} h={74} d={14} color="#FFFFFF" rx={6} />
      <Shadow p={p} cx={70} cy={566} rx={80} ry={9} o={0.32} />
      <Box p={p} x={0} y={470} w={134} h={92} d={26} color="#C58B52" rx={4}>
        <rect x="8" y="486" width="56" height="64" rx="4" fill={darken("#C58B52", 0.12)} /><rect x="70" y="486" width="56" height="64" rx="4" fill={darken("#C58B52", 0.12)} />
      </Box>
      <rect x="16" y="444" width="48" height="28" rx="4" fill={p.lin("#8FA8C4", { light: 0.3, dark: 0.25 })} />
      <ellipse cx="40" cy="444" rx="24" ry="6" fill={lighten("#8FA8C4", 0.3)} />
      <Shadow p={p} cx={348} cy={568} rx={52} ry={8} o={0.32} />
      <Box p={p} x={300} y={262} w={78} h={300} d={22} color="#DDE7EF" rx={8}>
        <rect x="300" y="396" width="78" height="4" fill="#B7C5D2" />
        <rect x="310" y="318" width="6" height="42" rx="3" fill="#8FA8C4" /><rect x="310" y="418" width="6" height="42" rx="3" fill="#8FA8C4" />
      </Box>
      <Shadow p={p} cx={182} cy={738} rx={152} ry={14} o={0.3} />
      <rect x="170" y="706" width="12" height="40" fill="#8B5A33" /><rect x="40" y="700" width="12" height="36" fill="#8B5A33" opacity=".0" />
      <ellipse cx="185" cy="710" rx="150" ry="34" fill={darken("#C58B52", 0.25)} />
      <ellipse cx="185" cy="700" rx="150" ry="34" fill={p.rad("#D9A066", { cx: 0.4, cy: 0.3, light: 0.2, dark: 0.12 })} />
      <ellipse cx="140" cy="698" rx="42" ry="12" fill={darken("#E2E8E6", 0.1)} /><ellipse cx="140" cy="695" rx="40" ry="11" fill="#fff" />
      <path d="M116 692l24-12 26 12z" fill={p.lin("#F4B860", { light: 0.3, dark: 0.15 })} /><rect x="118" y="690" width="48" height="5" rx="2" fill="#10B38A" />
      <circle cx="226" cy="692" r="9" fill={p.rad("#FF5A5F", { cx: 0.35, cy: 0.3, light: 0.4, dark: 0.3 })} />
      {[62, 130].map((x) => <Pendant key={x} p={p} x={x} y={74} color="#E07A5F" />)}
      <Tint light={light} />
      <Glows lamps={[{ x: 62, y: 104, r: 120 }, { x: 130, y: 104, r: 120 }]} light={light} id={id} />
    </>
  );
  return <>{body}{p.defs()}</>;
}
