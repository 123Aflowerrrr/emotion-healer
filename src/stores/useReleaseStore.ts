import { create } from 'zustand';
import type { SedonaSession } from '../types';
import { SEDONA_STEPS } from '../data/sedonaContent';
import { db } from '../db';

interface ReleaseStore {
  activeSession: SedonaSession | null;
  sessions: SedonaSession[];
  isLoading: boolean;
  startSession: (sceneId: string, animalId: string, emotionEntryId?: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  recordIntensity: (level: number) => void;
  completeSession: () => Promise<void>;
  cancelSession: () => void;
  loadSessions: () => Promise<void>;
}

let idCounter = Date.now();

export const useReleaseStore = create<ReleaseStore>((set, get) => ({
  activeSession: null,
  sessions: [],
  isLoading: false,

  startSession: (sceneId, animalId, emotionEntryId) => {
    const session: SedonaSession = {
      id: `sedona_${++idCounter}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: Date.now(),
      sceneId,
      emotionEntryId,
      currentStep: 0,
      totalSteps: SEDONA_STEPS.length,
      completed: false,
      compassionAnimal: animalId,
      intensityLevels: [],
    };
    set({ activeSession: session });
  },

  nextStep: () => {
    set((state) => {
      if (!state.activeSession) return state;
      const next = state.activeSession.currentStep + 1;
      if (next >= state.activeSession.totalSteps) return state;
      return {
        activeSession: { ...state.activeSession, currentStep: next },
      };
    });
  },

  previousStep: () => {
    set((state) => {
      if (!state.activeSession) return state;
      const prev = Math.max(0, state.activeSession.currentStep - 1);
      return {
        activeSession: { ...state.activeSession, currentStep: prev },
      };
    });
  },

  recordIntensity: (level) => {
    set((state) => {
      if (!state.activeSession) return state;
      const levels = [...state.activeSession.intensityLevels];
      levels[state.activeSession.currentStep] = level;
      return {
        activeSession: { ...state.activeSession, intensityLevels: levels },
      };
    });
  },

  completeSession: async () => {
    const session = get().activeSession;
    if (!session) return;
    const completed = { ...session, completed: true };
    await db.sedonaSessions.add(completed);
    set((state) => ({
      sessions: [completed, ...state.sessions],
      activeSession: completed,
    }));
  },

  cancelSession: () => set({ activeSession: null }),

  loadSessions: async () => {
    set({ isLoading: true });
    const sessions = await db.sedonaSessions.orderBy('timestamp').reverse().toArray();
    set({ sessions, isLoading: false });
  },
}));
