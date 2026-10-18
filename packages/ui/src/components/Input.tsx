import { useId, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, ...rest }: InputProps) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <div className={`td-field${error ? " td-field--error" : ""}`}>
      <label className="td-field__label" htmlFor={inputId}>{label}</label>
      <input id={inputId} className="td-field__input" aria-invalid={!!error} aria-describedby={error ? `${inputId}-err` : undefined} {...rest} />
      {error && <span id={`${inputId}-err`} className="td-field__error" role="alert">{error}</span>}
    </div>
  );
}
