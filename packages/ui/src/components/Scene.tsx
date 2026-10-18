export function Scene({ night = false }: { night?: boolean }) {
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
    <svg className="td-scene" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="390" height="844" fill={sky} />
      {cloud(30, 110, 110)}{cloud(250, 60, 90)}{cloud(300, 230, 70)}
      <ellipse cx="200" cy="670" rx="380" ry="200" fill={far} />
      {tree(10, 1)}{tree(340, 0.85)}
      <ellipse cx="195" cy="960" rx="495" ry="380" fill={hill} />
    </svg>
  );
}
