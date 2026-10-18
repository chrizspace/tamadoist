import { useState } from "react";
import type { LocationId, Place, ScheduleSlot } from "@tamadoist/core";

/** Module 2: the scene (where the pet is, and when). New places and schedule blocks are data below. */
export const SCHEDULE: ScheduleSlot[] = [
  { id: "work", label: "Praca", start: "09:00", end: "17:00", location: "work.openspace", days: [1, 2, 3, 4, 5] },
  { id: "lunch", label: "Lunch", start: "12:30", end: "13:00", location: "work.kitchen", days: [1, 2, 3, 4, 5] },
];

export const PLACES: Place[] = [
  { id: "home", group: "home", name: "Dom", lat: 52.2297, lng: 21.0122, radiusM: 100, location: "home.office" },
  { id: "work", group: "work", name: "Praca", lat: 52.24, lng: 21.03, radiusM: 150, location: "work.openspace" },
  { id: "gym", group: "recreation", name: "Siłownia", lat: 52.235, lng: 21.02, radiusM: 80, location: "recreation.gym" },
];

export type SimPosition = "none" | "home" | "work" | "gym";

export function useScene() {
  const [manual, setManual] = useState<LocationId | undefined>();
  const [pos, setPos] = useState<SimPosition>("none");
  const place = PLACES.find((p) => p.id === pos);
  return {
    schedule: SCHEDULE,
    places: PLACES,
    manual,
    setManual,
    pos,
    setPos,
    position: place ? { lat: place.lat, lng: place.lng } : undefined,
  };
}
export type SceneModule = ReturnType<typeof useScene>;
