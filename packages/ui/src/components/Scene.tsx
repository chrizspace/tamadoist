export type SceneKind = "meadow" | "home" | "office" | "lunch";

export interface SceneProps {
  /** Which place the pet is in. */
  scene?: SceneKind;
  night?: boolean;
}

const NIGHT_TINT = "#1B2060";

function Meadow({ night }: { night: boolean }) {
  const sky = night ? "#C9CCF2" : "#E6FAF6";
  const far = night ? "#7C84D6" : "#8EC5FF";
  const hill = night ? "#0E8C72" : "#10B38A";
  const co = night ? 0.35 : 0.8;
  const tree = (x: number, s: number) => (
    <g transform={`translate(${x} 0) scale(${s})`}>
      <rect x="16" y={520 / s} width="10" height={60 / s} fill="#2D6FA3" />
      {[330, 390, 450].map((y, i) => (
        <polygon key={y} points={`21,${y / s} ${51 + i * 6},${(y + 76) / s} ${-9 - i * 6},${(y + 76) / s}`} fill="#0B8F6F" />
      ))}
    </g>
  );
  const cloud = (x: number, y: number, w: number) => (
    <g opacity={co} fill="#fff">
      <ellipse cx={x + w / 2} cy={y + w * 0.19} rx={w / 2} ry={w * 0.19} />
      <ellipse cx={x + w * 0.47} cy={y + w * 0.06} rx={w * 0.27} ry={w * 0.2} />
    </g>
  );
  return (
    <>
      <rect width="390" height="844" fill={sky} />
      {cloud(30, 110, 110)}{cloud(250, 60, 90)}{cloud(300, 230, 70)}
      <ellipse cx="200" cy="670" rx="380" ry="200" fill={far} />
      {tree(10, 1)}{tree(340, 0.85)}
      <ellipse cx="195" cy="960" rx="495" ry="380" fill={hill} />
    </>
  );
}

function Window({ x, y, w, h, children }: { x: number; y: number; w: number; h: number; children?: React.ReactNode }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="14" fill="#BFE3FF" />
      {children}
      <rect x={x} y={y} width={w} height={h} rx="14" fill="none" stroke="#fff" strokeWidth="8" />
      <path d={`M${x + w / 2} ${y}V${y + h}M${x} ${y + h / 2}H${x + w}`} stroke="#fff" strokeWidth="6" />
    </g>
  );
}

function Home() {
  return (
    <>
      <rect width="390" height="844" fill="#FFF1DC" />
      <rect y="548" width="390" height="296" fill="#D9A66B" />
      <g fill="#C9935A">{[600, 660, 720, 780].map((y) => <rect key={y} y={y} width="390" height="4" />)}</g>
      <rect y="540" width="390" height="12" fill="#fff" />
      <Window x={36} y={140} w={130} h={150}>
        <ellipse cx="80" cy="190" rx="26" ry="10" fill="#fff" opacity=".9" />
        <ellipse cx="150" cy="240" rx="20" ry="8" fill="#fff" opacity=".8" />
      </Window>
      <rect x="276" y="170" width="76" height="96" rx="8" fill="#CDEBE2" stroke="#fff" strokeWidth="6" />
      <circle cx="314" cy="206" r="14" fill="#FFC93C" />
      <path d="M284 258l20-26 14 16 12-12 18 22z" fill="#1FBF8F" />
      <ellipse cx="195" cy="760" rx="165" ry="38" fill="#F6C9C0" />
      <ellipse cx="195" cy="760" rx="120" ry="26" fill="#F3B3A8" />
      <g>
        <rect x="222" y="462" width="172" height="102" rx="26" fill="#2D9C8A" />
        <rect x="236" y="500" width="144" height="66" rx="16" fill="#38B29F" />
        <rect x="214" y="500" width="30" height="66" rx="14" fill="#2D9C8A" />
        <rect x="372" y="500" width="30" height="66" rx="14" fill="#2D9C8A" />
      </g>
      <g>
        <rect x="26" y="490" width="44" height="52" rx="8" fill="#E07A5F" />
        <ellipse cx="48" cy="470" rx="26" ry="30" fill="#1FBF8F" />
        <ellipse cx="30" cy="484" rx="14" ry="20" fill="#159A72" />
        <ellipse cx="66" cy="484" rx="14" ry="20" fill="#159A72" />
      </g>
      <rect x="327" y="40" width="6" height="80" fill="#8B5A33" />
      <path d="M305 120h50l-10 26h-30z" fill="#FFC93C" />
    </>
  );
}

function Office() {
  return (
    <>
      <rect width="390" height="844" fill="#E6EEF6" />
      <rect y="560" width="390" height="284" fill="#B8C4D2" />
      <g fill="#A9B6C6">{[610, 670, 730, 790].map((y) => <rect key={y} y={y} width="390" height="3" />)}</g>
      <rect y="552" width="390" height="10" fill="#fff" />
      <Window x={24} y={110} w={342} h={200}>
        <g fill="#8FA8C4">
          <rect x="44" y="210" width="40" height="100" /><rect x="92" y="170" width="52" height="140" /><rect x="152" y="220" width="36" height="90" />
          <rect x="196" y="150" width="56" height="160" /><rect x="260" y="200" width="44" height="110" /><rect x="312" y="230" width="40" height="80" />
        </g>
        <g fill="#fff" opacity=".8">{[[104, 190], [120, 190], [104, 214], [212, 170], [228, 170], [212, 196], [272, 220]].map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width="8" height="10" />)}</g>
      </Window>
      <circle cx="338" cy="360" r="22" fill="#fff" stroke="#8FA8C4" strokeWidth="5" />
      <path d="M338 360V345M338 360l10 5" stroke="#1F2D2A" strokeWidth="4" strokeLinecap="round" />
      <g>
        <rect x="214" y="500" width="176" height="16" rx="6" fill="#C58B52" />
        <rect x="226" y="516" width="12" height="62" fill="#A8723F" /><rect x="364" y="516" width="12" height="62" fill="#A8723F" />
        <rect x="252" y="418" width="96" height="70" rx="8" fill="#1F2D2A" />
        <rect x="260" y="426" width="80" height="54" rx="4" fill="#4CC3FF" />
        <rect x="292" y="488" width="16" height="12" fill="#1F2D2A" />
        <rect x="244" y="492" width="112" height="8" rx="4" fill="#fff" />
        <rect x="364" y="478" width="18" height="22" rx="4" fill="#E07A5F" />
      </g>
      <g>
        <rect x="26" y="500" width="40" height="48" rx="8" fill="#4B4FA8" />
        <ellipse cx="46" cy="478" rx="24" ry="30" fill="#1FBF8F" />
        <ellipse cx="30" cy="492" rx="12" ry="18" fill="#159A72" />
      </g>
    </>
  );
}

function Lunch() {
  return (
    <>
      <rect width="390" height="844" fill="#FFF4E0" />
      <rect y="300" width="390" height="260" fill="#FFE2B8" />
      <g fill="#fff" opacity=".7">{Array.from({ length: 13 }, (_, i) => <rect key={i} x={i * 32} y="300" width="3" height="260" />)}{[360, 420, 480].map((y) => <rect key={y} y={y} width="390" height="3" />)}</g>
      <rect y="560" width="390" height="284" fill="#F2D9B3" />
      <g fill="#E9C58E">{Array.from({ length: 6 }, (_, r) => Array.from({ length: 7 }, (_, c) => (r + c) % 2 === 0 && <rect key={`${r}-${c}`} x={c * 60 - 15 + (r % 2) * 0} y={600 + r * 40} width="60" height="40" />))}</g>
      <rect y="552" width="390" height="10" fill="#fff" />
      <Window x={236} y={90} w={120} h={130}>
        <ellipse cx="290" cy="140" rx="24" ry="9" fill="#fff" opacity=".9" />
      </Window>
      {[20, 84].map((x) => (
        <g key={x}>
          <rect x={x + 18} y="40" width="4" height="60" fill="#8B5A33" />
          <path d={`M${x - 4} 100h48l-10 28h-28z`} fill="#E07A5F" />
        </g>
      ))}
      <rect x="20" y="230" width="170" height="14" rx="5" fill="#C58B52" />
      <g fill="#fff" stroke="#E2E8E6" strokeWidth="3">{[40, 80, 120, 160].map((x) => <rect key={x} x={x - 12} y="196" width="22" height="34" rx="5" />)}</g>
      <g>
        <ellipse cx="195" cy="700" rx="180" ry="40" fill="#C58B52" />
        <ellipse cx="195" cy="692" rx="180" ry="38" fill="#D9A066" />
        <ellipse cx="140" cy="690" rx="46" ry="14" fill="#fff" stroke="#E2E8E6" strokeWidth="3" />
        <path d="M112 686l28-14 30 14z" fill="#F4B860" /><rect x="114" y="684" width="56" height="6" rx="3" fill="#10B38A" />
        <circle cx="236" cy="684" r="9" fill="#FF5A5F" />
        <rect x="262" y="660" width="26" height="36" rx="6" fill="#4CC3FF" opacity=".9" /><rect x="262" y="660" width="26" height="10" rx="4" fill="#fff" />
      </g>
    </>
  );
}

export function Scene({ scene = "meadow", night = false }: SceneProps) {
  return (
    <svg className="td-scene" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" aria-hidden="true" data-scene={scene}>
      {scene === "meadow" && <Meadow night={night} />}
      {scene === "home" && <Home />}
      {scene === "office" && <Office />}
      {scene === "lunch" && <Lunch />}
      {night && scene !== "meadow" && <rect width="390" height="844" fill={NIGHT_TINT} opacity=".45" />}
    </svg>
  );
}
