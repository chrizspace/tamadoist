export function Egg({ size = 200 }: { size?: number }) {
  return (
    <svg width={size * 0.75} height={size} viewBox="0 0 150 200" role="img" aria-label="Jajko">
      <ellipse cx="75" cy="187" rx="55" ry="11" fill="#000" opacity=".15" />
      <ellipse cx="75" cy="94" rx="65" ry="90" fill="#A9C8F0" stroke="#7FA6DC" strokeWidth="3" />
      <ellipse cx="47" cy="54" rx="15" ry="26" fill="#fff" opacity=".45" />
      <g fill="#7FA6DC" opacity=".7">
        <ellipse cx="89" cy="95" rx="17" ry="15" /><ellipse cx="68" cy="129" rx="20" ry="17" />
        <ellipse cx="110" cy="142" rx="14" ry="12" /><ellipse cx="94" cy="57" rx="10" ry="9" />
      </g>
    </svg>
  );
}
