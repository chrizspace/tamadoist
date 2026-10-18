import type { EnergyResult } from "./energy";

/** All states the one character can be in. Add a state here and render it in the Pet component. */
export const PET_STATES = ["awake", "tired", "sleeping", "happy", "drinking"] as const;
export type PetState = (typeof PET_STATES)[number];

export interface PetStateInput {
  energy: Pick<EnergyResult, "state">;
  /** True for a moment right after a glass of water. */
  justDrank?: boolean;
  /** True while something good just happened (a goal reached, lunch). */
  celebrating?: boolean;
}

/** Priority: sleeping, tired, drinking, happy, awake. */
export function derivePetState({ energy, justDrank, celebrating }: PetStateInput): PetState {
  if (energy.state === "sleeping") return "sleeping";
  if (energy.state === "tired") return "tired";
  if (justDrank) return "drinking";
  if (celebrating) return "happy";
  return "awake";
}
