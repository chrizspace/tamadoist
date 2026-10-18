import { Battery } from "./Battery";

export interface EnergyChipProps {
  percent: number;
  /** When set the chip is a pressable (3D) button that can open the energy details. */
  onClick?: () => void;
}

/** The energy indicator: the battery on a white chip. Flat when it only informs, 3D when it can be pressed. */
export function EnergyChip({ percent, onClick }: EnergyChipProps) {
  const p = Math.round(percent);
  return onClick ? (
    <button type="button" className="td-chip" onClick={onClick} aria-label={`Energia ${p}%. Pokaż szczegóły`}>
      <Battery percent={percent} />
    </button>
  ) : (
    <div className="td-chip"><Battery percent={percent} /></div>
  );
}
