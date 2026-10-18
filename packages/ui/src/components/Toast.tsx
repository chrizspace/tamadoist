/** Dark translucent notification, full width. Shown in the info slot under the header (or just below the context card). */
export function Toast({ children, inline, top }: { children: string; inline?: boolean; top?: number }) {
  return <div className={`td-toast${inline ? " td-toast--inline" : ""}`} role="status" style={top !== undefined ? { top } : undefined}>{children}</div>;
}
