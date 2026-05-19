import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { StateStorage } from "zustand/middleware";

import type { StudySettings } from "#/types/study";

const NOOP_STORAGE: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

interface StudySettingsStore extends StudySettings {
  setRevealDelaySeconds: (value: number) => void;
  setAutoNextDelaySeconds: (value: number) => void;
  setAutoplay: (value: boolean) => void;
}

export const useStudySettingsStore = create<StudySettingsStore>()(
  persist(
    (set) => ({
      revealDelaySeconds: 10,
      autoNextDelaySeconds: 20,
      autoplay: true,
      setRevealDelaySeconds: (value) => set({ revealDelaySeconds: Math.max(1, value) }),
      setAutoNextDelaySeconds: (value) => set({ autoNextDelaySeconds: Math.max(1, value) }),
      setAutoplay: (value) => set({ autoplay: value }),
    }),
    {
      name: "driftrecall-study-settings",
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? NOOP_STORAGE : localStorage,
      ),
    },
  ),
);
