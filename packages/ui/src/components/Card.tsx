import type { ReactNode } from "react";

export interface CardProps { title?: string; children?: ReactNode }

export function Card({ title, children }: CardProps) {
  return (
    <section className="td-card">
      {title && <h3 className="td-card__title">{title}</h3>}
      {children && <div className="td-card__body">{children}</div>}
    </section>
  );
}
