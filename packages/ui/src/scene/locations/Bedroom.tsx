import { darken, lighten, makePaint } from "../paint";
import { Glows, Tint, type LocationProps } from "../parts";
import { Box, Floor, Plant3D, Shadow, Shaft, Wall, Window3D } from "../solids";

export function Bedroom({ light, id }: LocationProps) {
  const p = makePaint(id);
  const ctx = { p, light };
  const body = (
    <>
      <Wall p={p} color="#E0D8FF" />
      <Floor p={p} color="#D9A56E" kind="wood" />
      <Window3D {...ctx} x={36} y={130} w={120} h={146} />
      <Shaft {...ctx} x={36} w={120} from={282} to={720} />
      {[16, 148].map((x) => (
        <g key={x}>
          <rect x={x} y="118" width="30" height="190" rx="12" fill={p.lin("#F59AB8", { light: 0.2, dark: 0.22, dir: "h" })} />
          {[8, 15, 22].map((o) => <line key={o} x1={x + o} y1="126" x2={x + o} y2="300" stroke={darken("#F59AB8", 0.25)} strokeWidth="2" opacity=".5" />)}
        </g>
      ))}
      <Box p={p} x={276} y={150} w={76} h={96} d={5} color="#FFFFFF" rx={6}>
        <rect x="284" y="158" width="60" height="80" rx="4" fill={p.lin("#CDEBE2", { light: 0.3, dark: 0.1 })} />
        <path d="M288 232l18-24 12 14 10-10 16 20z" fill="#7C84D6" />
        <circle cx="322" cy="180" r="10" fill="#FFF3C2" />
      </Box>
      <ellipse cx="195" cy="776" rx="172" ry="38" fill={darken("#CFC6F5", 0.12)} />
      <ellipse cx="195" cy="772" rx="172" ry="38" fill={p.rad("#CFC6F5", { cx: 0.4, cy: 0.3, light: 0.3, dark: 0.12 })} />
      <ellipse cx="195" cy="772" rx="118" ry="24" fill={lighten("#CFC6F5", 0.3)} opacity=".6" />
      <Shadow p={p} cx={318} cy={574} rx={116} ry={13} o={0.35} />
      <Box p={p} x={246} y={404} w={144} h={100} d={10} color="#A9743F" rx={10} />
      <Box p={p} x={232} y={482} w={158} h={72} d={22} color="#FFFFFF" rx={8} />
      <ellipse cx="322" cy="470" rx="40" ry="16" fill={p.rad("#FFFFFF", { cx: 0.4, cy: 0.25, light: 0, dark: 0.12 })} />
      <Box p={p} x={232} y={516} w={158} h={40} d={22} color="#7C84D6" rx={8}>
        <rect x="232" y="530" width="158" height="7" fill="#9AA0E8" opacity=".7" />
      </Box>
      <Box p={p} x={180} y={508} w={46} h={56} d={14} color="#C58B52" rx={4}>
        <rect x="188" y="522" width="30" height="3" rx="1.5" fill={darken("#C58B52", 0.3)} />
        <circle cx="203" cy="540" r="3" fill="#F6E3B8" />
      </Box>
      <rect x="201" y="470" width="6" height="32" fill="#6B4A2B" />
      <path d="M186 474h34l-8-24h-18z" fill={p.lin("#FFD65C", { light: 0.3, dark: 0.2 })} />
      <Plant3D p={p} x={22} y={508} />
      <Tint light={light} />
      <Glows lamps={[{ x: 203, y: 460, r: 150 }]} light={light} id={id} />
    </>
  );
  return <>{body}{p.defs()}</>;
}
