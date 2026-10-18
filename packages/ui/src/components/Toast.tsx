import { Icon } from "./Icon";

export function Toast({ children, inline }: { children: string; inline?: boolean }) {
  return <div className={`td-toast${inline ? " td-toast--inline" : ""}`} role="status"><Icon name="drop" />{children}</div>;
}
