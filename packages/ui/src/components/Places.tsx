import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

export interface ListCardProps { icon: IconName; title: string; sub?: string; right?: ReactNode; onClick?: () => void }

export function ListCard({ icon, title, sub, right, onClick }: ListCardProps) {
  const body = (
    <>
      <span className="td-listcard__icon"><Icon name={icon} /></span>
      <span className="td-listcard__body"><b>{title}</b>{sub && <span className="sub">{sub}</span>}</span>
      {right}
    </>
  );
  return onClick ? <button type="button" className="td-listcard" onClick={onClick}>{body}</button> : <div className="td-listcard">{body}</div>;
}

export function AddCard({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button type="button" className="td-listcard td-listcard--add" onClick={onClick}>
      <Icon name="plus" />{label}
    </button>
  );
}

export function Switch({ label, checked, onChange }: { label: string; checked: boolean; onChange?: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={checked} className="td-switch" onClick={() => onChange?.(!checked)} style={{ border: 0, width: "100%", textAlign: "left", cursor: "pointer", color: "inherit" }}>
      {label}<span className="td-switch__track" />
    </button>
  );
}

/** Stylised map with a pin; the real app uses the device location. */
export function MapArt() {
  return (
    <div className="td-mapart" aria-hidden="true">
      <svg viewBox="0 0 300 150" preserveAspectRatio="xMidYMid slice">
        <rect width="300" height="150" fill="#DDEFE8" />
        <path d="M-10 100C60 70 120 120 190 80S280 60 320 90" stroke="#fff" strokeWidth="14" fill="none" />
        <path d="M80 -10C90 40 70 90 100 160" stroke="#fff" strokeWidth="10" fill="none" />
        <rect x="190" y="14" width="70" height="40" rx="10" fill="#B9E3D1" />
        <circle cx="150" cy="78" r="34" fill="#1FBF8F" opacity=".18" />
        <path d="M150 104s16-15 16-28a16 16 0 0 0-32 0c0 13 16 28 16 28z" fill="#159A72" />
        <circle cx="150" cy="76" r="6" fill="#fff" />
      </svg>
    </div>
  );
}

export interface SettingRowProps { label: string; value: string; onEdit?: () => void }

/** A settings row. When `onEdit` is set the whole row is tappable and shows an edit icon on the right. */
export function SettingRow({ label, value, onEdit }: SettingRowProps) {
  const body = (
    <>
      <span className="td-listcard__body"><span className="sub">{label}</span><b>{value}</b></span>
      {onEdit && <span className="td-editbadge"><Icon name="edit" /></span>}
    </>
  );
  return onEdit ? (
    <button type="button" className="td-listcard" onClick={onEdit} aria-label={`${label}: ${value}. Edytuj`}>{body}</button>
  ) : (
    <div className="td-listcard">{body}</div>
  );
}
