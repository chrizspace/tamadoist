import { Icon } from "./Icon";

export interface RoundButtonProps { kind: "plus" | "minus"; amountMl?: number; onClick?: () => void }

export function RoundButton({ kind, amountMl = 250, onClick }: RoundButtonProps) {
  const sign = kind === "plus" ? "+" : "−";
  return (
    <div className="td-roundbtn">
      <button type="button" className={`td-circle td-circle--${kind}`} aria-label={`${kind === "plus" ? "Dodaj" : "Odejmij"} ${amountMl} ml`} onClick={onClick}>
        <Icon name={kind} />
      </button>
      {sign}{amountMl} ml
    </div>
  );
}
