/** Dark translucent notification, full width. Lives in the interaction bar above the action dock (`bottom` can lift it above a context card). */
export function Toast({ children, inline, bottom }: { children: string; inline?: boolean; bottom?: number }) {
  return <div className={`td-toast${inline ? " td-toast--inline" : ""}`} role="status" style={bottom !== undefined ? { bottom } : undefined}>{children}</div>;
}
