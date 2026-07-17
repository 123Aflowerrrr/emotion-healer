import { create } from 'zustand';
import type { AppSettings } from '../types';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  soundEnabled: false,
  aiProvider: 'custom',
  aiEndpoint: 'https://api.openai.com/v1/chat/completions',
  aiApiKey: '',
  aiModel: 'gpt-3.5-turbo',
  selectedCompanionId: 'cat',
  firstLaunchComplete: false,
};

interface SettingsStore {
  settings: AppSettings;
  loadSettings: () => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  isAIConfigured: () => boolean;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: { ...DEFAULT_SETTINGS },

  loadSettings: () => {
    try {
      const saved = localStorage.getItem('emotion-healer-settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        set({ settings: { ...DEFAULT_SETTINGS, ...parsed } });
      }
    } catch {
      // Use defaults
    }
  },

  updateSettings: (updates) => {
    set((state) => {
      const newSettings = { ...state.settings, ...updates };
      localStorage.setItem('emotion-healer-settings', JSON.stringify(newSettings));
      return { settings: newSettings };
    });
  },

  isAIConfigured: () => {
    const { aiApiKey, aiEndpoint } = get().settings;
    return aiApiKey.length > 0 && aiEndpoint.length > 0;
  },
}));
