import { darken, lighten, makePaint } from "../paint";
import { Glows, Tint, type LocationProps } from "../parts";
import { Ball, Box, CeilingLights, Shadow, Wall, Window3D } from "../solids";

export function Pool({ light, id }: LocationProps) {
  const p = makePaint(id);
  const ctx = { p, light };
  const rope = (y: number, s: number) => (
    <g>
      <path d={`M0 ${y}Q195 ${y + 8 * s} 390 ${y}`} stroke={darken("#E8F4FF", 0.3)} strokeWidth={2 * s} fill="none" opacity=".6" />
      {Array.from({ length: 12 }, (_, i) => <Ball key={i} p={p} cx={16 + i * 33} cy={y + 4 * s * Math.sin((i / 11) * Math.PI)} r={7 * s} color={i % 2 ? "#FFC93C" : "#FF5A5F"} />)}
    </g>
  );
  const body = (
    <>
      <Wall p={p} y={470} color="#CFEFF5" />
      <g fill="#B9E2EA" opacity=".8">{Array.from({ length: 13 }, (_, i) => <rect key={i} x={i * 32} y="0" width="3" height="456" />)}{[100, 200, 300, 400].map((y) => <rect key={y} y={y} width="390" height="3" />)}</g>
      <Window3D {...ctx} x={30} y={84} w={108} h={112} />
      <Window3D {...ctx} x={252} y={84} w={108} h={112} />
      <rect y="470" width="390" height="92" fill={p.lin("#F6EEDC", { light: 0.12, dark: 0.1 })} />
      <rect y="470" width="390" height="30" fill={p.fade("#0B1020", 0.18, 0)} />
      <rect y="556" width="390" height="14" fill={p.lin("#E3D3B3", { light: 0.1, dark: 0.3 })} />
      <rect y="556" width="390" height="3" fill="#fff" opacity=".7" />
      <rect y="570" width="390" height="274" fill={p.lin("#58C8FF", { light: 0.18, dark: 0.3 })} />
      <rect y="570" width="390" height="26" fill={p.fade("#0B3A66", 0.3, 0)} />
      {[610, 664, 722, 784].map((y, i) => <path key={y} d={`M0 ${y}q48 ${-10 - i * 2} 97 0t98 0t98 0t97 0`} stroke="#A9E5FF" strokeWidth={4 + i} fill="none" opacity={0.75 - i * 0.1} />)}
      {[[70, 700, 46, 12], [250, 640, 38, 10], [330, 770, 54, 14], [150, 800, 40, 11]].map(([x, y, rx, ry]) => <ellipse key={`${x}`} cx={x} cy={y} rx={rx} ry={ry} fill="#fff" opacity=".13" />)}
      {rope(650, 0.8)}{rope(746, 1.1)}
      <Shadow p={p} cx={366} cy={566} rx={34} ry={5} o={0.25} />
      <g stroke="#C9D3DC" strokeWidth="7" fill="none" strokeLinecap="round"><path d="M340 564v-74q0 -20 20 -20h22" /><path d="M370 564v-74" /></g>
      <g stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".7"><path d="M338 560v-70q0 -17 18 -17" /></g>
      <CeilingLights {...ctx} />
      <Tint light={light} />
      <Glows lamps={[{ x: 75, y: 30, r: 150 }, { x: 205, y: 30, r: 150 }, { x: 325, y: 30, r: 150 }]} light={light} id={id} color="#E8F8FF" />
      <Glows lamps={[{ x: 195, y: 710, r: 230 }]} light={light} id={`${id}p`} color="#7FE0FF" />
      {light.lit && <rect y="570" width="390" height="274" fill={lighten("#7FE0FF", 0.2)} opacity=".08" />}
    </>
  );
  return <>{body}{p.defs()}</>;
}
