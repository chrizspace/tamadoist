export interface TimePickerProps {
  label: string;
  value: string; // "HH:MM"
  onChange: (value: string) => void;
}

const OPTIONS = Array.from({ length: 48 }, (_, i) => `${String(Math.floor(i / 2)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`);

export function TimePicker({ label, value, onChange }: TimePickerProps) {
  return (
    <label className="td-field">
      <span className="td-field__label">{label}</span>
      <select className="td-field__input" value={value} onChange={(e) => onChange(e.target.value)}>
        {OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
