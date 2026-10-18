import { DEFAULT_SLEEP_START } from "./sleep";
import { waterGoalMl } from "./water";

/** Everything the user tells us about their character. Add new traits here. */
export interface CharacterProfile {
  name: string;
  /** "HH:MM" — sleep always lasts 8h, so only the bedtime is stored. */
  sleepStart: string;
  weightKg: number;
  /** Manual override of the weight-based goal. */
  waterGoalOverrideMl?: number;
}

export const NAME_MAX_LENGTH = 20;

export const DEFAULT_PROFILE: CharacterProfile = { name: "", sleepStart: DEFAULT_SLEEP_START, weightKg: 70 };

export function validateName(name: string): string | null {
  const n = name.trim();
  if (n.length < 1) return "Nadaj imię swojej postaci";
  if (n.length > NAME_MAX_LENGTH) return `Imię może mieć najwyżej ${NAME_MAX_LENGTH} znaków`;
  return null;
}

export function normalizeName(name: string): string {
  return name.trim().slice(0, NAME_MAX_LENGTH);
}

export function dailyWaterGoalMl(profile: Pick<CharacterProfile, "weightKg" | "waterGoalOverrideMl">): number {
  return profile.waterGoalOverrideMl ?? waterGoalMl(profile.weightKg);
}
