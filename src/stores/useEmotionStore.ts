import { create } from 'zustand';
import type { EmotionEntry, MoodLevel } from '../types';
import { db } from '../db';

interface EmotionStore {
  entries: EmotionEntry[];
  isLoading: boolean;
  loadEntries: () => Promise<void>;
  addEntry: (entry: Omit<EmotionEntry, 'id' | 'timestamp'>) => Promise<string>;
  updateEntry: (id: string, updates: Partial<EmotionEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  getRecentEntries: (limit?: number) => EmotionEntry[];
  getTodayEntries: () => EmotionEntry[];
  getEntriesByDateRange: (start: number, end: number) => EmotionEntry[];
  getMoodStats: () => { mood: MoodLevel; count: number }[];
}

let idCounter = Date.now();
const generateId = () => `entry_${++idCounter}_${Math.random().toString(36).slice(2, 7)}`;

export const useEmotionStore = create<EmotionStore>((set, get) => ({
  entries: [],
  isLoading: false,

  loadEntries: async () => {
    set({ isLoading: true });
    const entries = await db.emotionEntries.orderBy('timestamp').reverse().toArray();
    set({ entries, isLoading: false });
  },

  addEntry: async (entry) => {
    const id = generateId();
    const timestamp = Date.now();
    const newEntry: EmotionEntry = { ...entry, id, timestamp };
    await db.emotionEntries.add(newEntry);
    set((state) => ({ entries: [newEntry, ...state.entries] }));
    return id;
  },

  updateEntry: async (id, updates) => {
    await db.emotionEntries.update(id, updates);
    set((state) => ({
      entries: state.entries.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
  },

  deleteEntry: async (id) => {
    await db.emotionEntries.delete(id);
    set((state) => ({ entries: state.entries.filter((e) => e.id !== id) }));
  },

  getRecentEntries: (limit = 10) => {
    return get().entries.slice(0, limit);
  },

  getTodayEntries: () => {
    const today = new Date().toISOString().split('T')[0];
    return get().entries.filter((e) => e.date === today);
  },

  getEntriesByDateRange: (start, end) => {
    return get().entries.filter((e) => e.timestamp >= start && e.timestamp <= end);
  },

  getMoodStats: () => {
    const entries = get().entries;
    const moodCounts: Record<string, number> = {};
    entries.forEach((e) => {
      moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
    });
    return Object.entries(moodCounts).map(([mood, count]) => ({
      mood: mood as MoodLevel,
      count,
    }));
  },
}));
