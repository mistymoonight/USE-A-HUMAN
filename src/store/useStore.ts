import { create } from 'zustand';

interface AppState {
  // Module 1: Time Management
  screenTime: number; // in hours
  sleepTime: number; // in hours
  setScreenTime: (time: number) => void;
  setSleepTime: (time: number) => void;

  // Module 2: Unlock Behavior
  unlockCount: number;
  incrementUnlock: () => void;

  // Module 3: Thumb Pilgrimage
  scrollDistance: number; // in pixels or meters
  addScrollDistance: (distance: number) => void;

  // Module 4: Bedtime Rituals
  bedtimePosition: 'side' | 'supine' | 'prone' | null;
  setBedtimePosition: (position: 'side' | 'supine' | 'prone') => void;
}

export const useStore = create<AppState>((set) => ({
  // Defaults
  screenTime: 0,
  sleepTime: 8,
  setScreenTime: (time) => set({ screenTime: time }),
  setSleepTime: (time) => set({ sleepTime: time }),

  unlockCount: 0,
  incrementUnlock: () => set((state) => ({ unlockCount: state.unlockCount + 1 })),

  scrollDistance: 0,
  addScrollDistance: (distance) => set((state) => ({ scrollDistance: state.scrollDistance + distance })),

  bedtimePosition: null,
  setBedtimePosition: (position) => set({ bedtimePosition: position }),
}));
