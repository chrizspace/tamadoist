import type { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary / secondary / water are pressable with a 3D lip. ghost is the quiet, flat text action. */
  variant?: "primary" | "secondary" | "water" | "ghost";
}

export function Button({ variant = "primary", className = "", type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={`td-btn td-btn--${variant} ${className}`.trim()} {...rest} />;
}
