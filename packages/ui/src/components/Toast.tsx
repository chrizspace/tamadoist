import { Icon } from "./Icon";

export function Toast({ children, inline, top }: { children: string; inline?: boolean; top?: number }) {
  return <div className={`td-toast${inline ? " td-toast--inline" : ""}`} role="status" style={top !== undefined ? { top } : undefined}><Icon name="drop" />{children}</div>;
}
