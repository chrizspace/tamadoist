import type { ReactNode } from "react";

export function Sheet({ children }: { children: ReactNode }) {
  return <div className="td-sheet">{children}</div>;
}
