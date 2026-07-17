import { create } from 'zustand';
import type { AnimalCompanion, CompanionMood, CompanionAnimation } from '../types';
import { COMPANIONS } from '../data/animals';

interface AnimalStore {
  companions: AnimalCompanion[];
  activeCompanion: AnimalCompanion | null;
  companionMood: CompanionMood;
  companionAnimation: CompanionAnimation;
  message: string | null;
  showMessage: boolean;
  setActiveCompanion: (id: string) => void;
  setMood: (mood: CompanionMood) => void;
  setAnimation: (anim: CompanionAnimation) => void;
  showCompanionMessage: (msg: string, duration?: number) => void;
  clearMessage: () => void;
  unlockCompanion: (id: string) => void;
  getRandomIdleMessage: () => string;
}

export const useAnimalStore = create<AnimalStore>((set, get) => ({
  companions: COMPANIONS,
  activeCompanion: COMPANIONS[0],
  companionMood: 'idle',
  companionAnimation: 'breathing',
  message: null,
  showMessage: false,

  setActiveCompanion: (id) => {
    const companion = COMPANIONS.find((c) => c.id === id);
    if (companion) set({ activeCompanion: companion });
  },

  setMood: (mood) => set({ companionMood: mood }),
  setAnimation: (anim) => set({ companionAnimation: anim }),

  showCompanionMessage: (msg, duration = 4000) => {
    set({ message: msg, showMessage: true });
    setTimeout(() => set({ showMessage: false }), duration);
  },

  clearMessage: () => set({ message: null, showMessage: false }),

  unlockCompanion: (id) => {
    set((state) => ({
      companions: state.companions.map((c) =>
        c.id === id ? { ...c, unlocked: true } : c
      ),
    }));
  },

  getRandomIdleMessage: () => {
    const companion = get().activeCompanion;
    if (!companion) return '你好呀~ 🌸';
    const msgs = companion.idleMessages;
    return msgs[Math.floor(Math.random() * msgs.length)];
  },
}));
