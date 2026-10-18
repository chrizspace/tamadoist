export type GroupId = "home" | "work" | "recreation";

export type LocationId =
  | "home.bedroom" | "home.office" | "home.kitchen"
  | "work.openspace" | "work.kitchen"
  | "recreation.park" | "recreation.pool" | "recreation.gym" | "recreation.bike";

export interface LocationGroup {
  id: GroupId;
  label: string;
  /** Where the pet appears when you are at a place of this kind and nothing else applies. */
  defaultLocation: LocationId;
}

export interface Location {
  id: LocationId;
  group: GroupId;
  label: string;
  hint: string;
  indoor: boolean;
}

/** The scene library. A new location is one entry here plus one drawing in the UI package. */
export const LOCATION_GROUPS: readonly LocationGroup[] = [
  { id: "home", label: "Dom", defaultLocation: "home.bedroom" },
  { id: "work", label: "Praca", defaultLocation: "work.openspace" },
  { id: "recreation", label: "Rekreacja", defaultLocation: "recreation.park" },
];

export const LOCATIONS: readonly Location[] = [
  { id: "home.bedroom", group: "home", label: "Sypialnia", hint: "Łóżko i lampka nocna", indoor: true },
  { id: "home.office", group: "home", label: "Biuro domowe", hint: "Biurko, laptop, regał", indoor: true },
  { id: "home.kitchen", group: "home", label: "Kuchnia", hint: "Blat, lodówka, stół", indoor: true },
  { id: "work.openspace", group: "work", label: "Open space", hint: "Komputer i biurko", indoor: true },
  { id: "work.kitchen", group: "work", label: "Kuchnia w pracy", hint: "Ekspres, mikrofala, jedzenie", indoor: true },
  { id: "recreation.park", group: "recreation", label: "Park", hint: "Łąka, ławka, drzewa", indoor: false },
  { id: "recreation.pool", group: "recreation", label: "Basen", hint: "Woda i tory", indoor: true },
  { id: "recreation.gym", group: "recreation", label: "Siłownia", hint: "Hantle i bieżnia", indoor: true },
  { id: "recreation.bike", group: "recreation", label: "Rower", hint: "Ścieżka rowerowa", indoor: false },
];

export const DEFAULT_LOCATION: LocationId = "recreation.park";

export function getLocation(id: LocationId): Location {
  return LOCATIONS.find((l) => l.id === id)!;
}

export function getGroup(id: GroupId): LocationGroup {
  return LOCATION_GROUPS.find((g) => g.id === id)!;
}

export function locationsOf(group: GroupId): Location[] {
  return LOCATIONS.filter((l) => l.group === group);
}
