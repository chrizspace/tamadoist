export function NameTag({ name }: { name: string }) {
  return <span className="td-nametag">{name || "…"}</span>;
}
