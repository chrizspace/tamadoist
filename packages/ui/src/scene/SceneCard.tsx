import { getGroup, getLocation, type LocationId, type PeriodId } from "@tamadoist/core";
import { Icon } from "../components/Icon";
import { Scene } from "./Scene";

export interface SceneCardProps {
  location: LocationId;
  period?: PeriodId;
  selected?: boolean;
  compact?: boolean;
  onSelect?: () => void;
}

/** Thumbnail of one location, used by the scene picker. */
export function SceneCard({ location, period = "noon", selected, compact, onSelect }: SceneCardProps) {
  const loc = getLocation(location);
  return (
    <button type="button" className={`td-scenecard${compact ? " td-scenecard--compact" : ""}`} aria-pressed={!!selected} onClick={onSelect}>
      <div className="td-scenecard__thumb"><div><Scene location={location} period={period} /></div></div>
      <div className="td-scenecard__label">{loc.label}{selected && <Icon name="check" />}</div>
    </button>
  );
}

/** Small tag with the group name (Dom, Praca, Rekreacja) or the location. */
export function LocationPill({ location, group }: { location?: LocationId; group?: boolean }) {
  if (!location) return null;
  const loc = getLocation(location);
  const label = group ? getGroup(loc.group).label : loc.label;
  const cls = loc.group === "work" ? "td-pill td-pill--water" : loc.group === "recreation" ? "td-pill td-pill--sun" : "td-pill";
  return <span className={cls}>{label}</span>;
}
