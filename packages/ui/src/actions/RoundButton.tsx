import { Icon, type IconName } from "../components/Icon";

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

export interface RoundActionProps {
  /** "primary" is the green main action ("Zrobione"), "plain" the white secondary one ("Lista"); water, food and sleep are the nutrition buttons. */
  tone: "primary" | "plain" | "water" | "food" | "sleep";
  icon: IconName;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}

/** Round 3D action button with a caption, for actions other than water. */
export function RoundAction({ tone, icon, label, disabled, onClick }: RoundActionProps) {
  return (
    <div className="td-roundbtn">
      <button type="button" className={`td-circle td-circle--${tone}`} aria-label={label} disabled={disabled} onClick={onClick}>
        <Icon name={icon} />
      </button>
      {label}
    </div>
  );
}
