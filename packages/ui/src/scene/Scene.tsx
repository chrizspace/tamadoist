import { useId } from "react";
import type { ReactElement } from "react";
import type { LocationId, PeriodId } from "@tamadoist/core";
import { lightingFor } from "./lighting";
import { Bedroom } from "./locations/Bedroom";
import { Bike } from "./locations/Bike";
import { Gym } from "./locations/Gym";
import { HomeKitchen } from "./locations/HomeKitchen";
import { HomeOffice } from "./locations/HomeOffice";
import { OpenSpace } from "./locations/OpenSpace";
import { Park } from "./locations/Park";
import { Pool } from "./locations/Pool";
import { WorkKitchen } from "./locations/WorkKitchen";
import type { LocationProps } from "./parts";

/** Drawing for every location. A new location in core needs one entry here. */
export const LOCATION_ART: Record<LocationId, (p: LocationProps) => ReactElement> = {
  "home.bedroom": Bedroom,
  "home.office": HomeOffice,
  "home.kitchen": HomeKitchen,
  "work.openspace": OpenSpace,
  "work.kitchen": WorkKitchen,
  "recreation.park": Park,
  "recreation.pool": Pool,
  "recreation.gym": Gym,
  "recreation.bike": Bike,
};

export interface SceneProps {
  location?: LocationId;
  /** Time of day; changes the light. */
  period?: PeriodId;
}

export function Scene({ location = "recreation.park", period = "noon" }: SceneProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const Art = LOCATION_ART[location];
  return (
    <svg className="td-scene" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" aria-hidden="true" data-location={location} data-period={period}>
      <Art light={lightingFor(period)} id={id} />
    </svg>
  );
}
