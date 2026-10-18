import { useCallback, useState } from "react";
import { DEFAULT_PROFILE, dailyWaterGoalMl, normalizeName, type CharacterProfile } from "@tamadoist/core";

/** Module 1: the character (name, sleep, weight, water goal). Add a trait to CharacterProfile in core, then here. */
export function useCharacter() {
  const [profile, setProfile] = useState<CharacterProfile>({ ...DEFAULT_PROFILE });
  const patch = useCallback((p: Partial<CharacterProfile>) => setProfile((cur) => ({ ...cur, ...p })), []);
  return {
    profile,
    goalMl: dailyWaterGoalMl(profile),
    setName: (name: string) => patch({ name: name.slice(0, 20) }),
    saveName: (name: string) => patch({ name: normalizeName(name) }),
    setSleepStart: (sleepStart: string) => patch({ sleepStart }),
    setWeight: (v: string) => patch({ weightKg: Number(v) || 0 }),
    reset: () => setProfile({ ...DEFAULT_PROFILE }),
  };
}
export type CharacterModule = ReturnType<typeof useCharacter>;
