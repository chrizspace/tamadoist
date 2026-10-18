import { computeEnergy, derivePetState, getLocation, resolveScene, sleepWindow, type PetState } from "@tamadoist/core";
import type { ActionsModule } from "./modules/actions";
import type { CharacterModule } from "./modules/character";
import type { SceneModule } from "./modules/scene";

/** 2026-01-14 is a Wednesday, so the weekday schedule applies. */
export const dateAt = (minutes: number) => new Date(2026, 0, 14, Math.floor(minutes / 60), minutes % 60);

export const fmt = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

/** Everything the screens need, derived from the three modules plus the simulated clock. */
export function deriveWorld(ch: CharacterModule, sc: SceneModule, ac: ActionsModule, minutes: number, forced?: PetState) {
  const now = dateAt(minutes);
  const energy = computeEnergy({ now, sleepStart: ch.profile.sleepStart, drunkMl: ac.drunkMl, goalMl: ch.goalMl });
  const scene = resolveScene({
    now,
    schedule: sc.schedule,
    places: sc.places,
    position: sc.position,
    manual: sc.manual ? { location: sc.manual } : undefined,
    sleepStart: ch.profile.sleepStart,
  });
  const celebrating = scene.location.endsWith(".kitchen");
  const petState = forced ?? derivePetState({ energy, justDrank: ac.justDrank, celebrating });
  return {
    now,
    energy,
    scene,
    petState,
    locationLabel: getLocation(scene.location).label,
    sleepEnd: sleepWindow(ch.profile.sleepStart).end,
    name: ch.profile.name || "Tama",
  };
}
export type World = ReturnType<typeof deriveWorld>;
