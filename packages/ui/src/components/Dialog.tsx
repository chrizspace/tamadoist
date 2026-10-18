import type { ReactNode } from "react";

export interface DialogProps { title: string; description?: string; children?: ReactNode; actions?: ReactNode; inline?: boolean }

export function Dialog({ title, description, children, actions, inline }: DialogProps) {
  return (
    <div className="td-dialog" role="dialog" aria-label={title} style={inline ? { position: "static", width: 300 } : undefined}>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {children}
      {actions && <div className="td-dialog__btns">{actions}</div>}
    </div>
  );
}
