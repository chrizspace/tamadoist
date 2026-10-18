import { darken, lighten, makePaint } from "../paint";
import { Glows, Sky, Tint, type LocationProps } from "../parts";
import { Box, Cloud3D, Hill, Shadow, Tree3D } from "../solids";

export function Park({ light, id }: LocationProps) {
  const p = makePaint(id);
  const body = (
    <>
      <Sky light={light} id={id} />
      <Cloud3D x={30} y={110} w={110} light={light} /><Cloud3D x={250} y={60} w={90} light={light} /><Cloud3D x={300} y={230} w={70} light={light} />
      <Hill p={p} cx={100} cy={560} rx={270} ry={92} color="#9CCBFF" />
      <Hill p={p} cx={330} cy={572} rx={250} ry={80} color="#86B7F0" />
      <Hill p={p} cx={200} cy={676} rx={380} ry={200} color="#8EC5FF" rim={0.55} />
      <Tree3D p={p} x={150} y={546} s={0.5} /><Tree3D p={p} x={248} y={552} s={0.42} />
      <Tree3D p={p} x={34} y={470} s={1} /><Tree3D p={p} x={352} y={490} s={0.86} />
      <Hill p={p} cx={195} cy={962} rx={495} ry={380} color="#10B38A" rim={0.5} />
      <ellipse cx="120" cy="640" rx="150" ry="22" fill={darken("#10B38A", 0.25)} opacity=".25" filter={p.blur(8)} />
      <path d="M130 844C160 740 196 650 256 594L290 604C240 664 210 744 214 844Z" fill={darken("#E9D6A8", 0.2)} opacity=".6" />
      <path d="M126 844C158 738 194 646 250 590L282 598C232 660 204 742 208 844Z" fill={p.lin("#EBD9A8", { light: 0.22, dark: 0.12, dir: "d" })} />
      <Shadow p={p} cx={294} cy={598} rx={56} ry={7} o={0.3} />
      <Box p={p} x={252} y={562} w={84} h={10} d={16} color="#C58B52" rx={3} />
      <Box p={p} x={256} y={536} w={78} h={10} d={14} color="#A8723F" rx={3} />
      <Box p={p} x={260} y={572} w={8} h={26} d={6} color="#8B5A33" rx={1} /><Box p={p} x={320} y={572} w={8} h={26} d={6} color="#8B5A33" rx={1} />
      <Shadow p={p} cx={58} cy={594} rx={20} ry={5} o={0.3} />
      <Box p={p} x={46} y={444} w={6} h={152} d={4} color="#2B3A42" rx={2} />
      <path d="M30 446h38l-7-22h-24z" fill={p.lin("#FFC93C", { light: 0.3, dark: 0.2 })} />
      {[[90, 706], [300, 746], [120, 796], [230, 770]].map(([x, y]) => (
        <g key={`${x}`}>
          <circle cx={x! + 1} cy={y! + 3} r="6" fill="#000" opacity=".18" />
          <circle cx={x} cy={y} r="6" fill={p.rad("#FFC93C", { cx: 0.35, cy: 0.3, light: 0.4, dark: 0.2 })} />
          <circle cx={x! + 14} cy={y! + 6} r="5" fill={p.rad("#FF9AA2", { cx: 0.35, cy: 0.3, light: 0.4, dark: 0.2 })} />
          <circle cx={x! - 4} cy={y! + 4} r="2.4" fill={lighten("#FFFFFF", 0)} opacity=".6" />
        </g>
      ))}
      <Tint light={light} />
      <Glows lamps={[{ x: 49, y: 434, r: 150 }]} light={light} id={id} />
    </>
  );
  return <>{body}{p.defs()}</>;
}
