import { create } from 'zustand';
import type { SheetType } from '../types';

interface UIStore {
  activeSheet: SheetType;
  toastMessage: string | null;
  toastType: 'success' | 'info' | 'warm';
  openSheet: (sheet: SheetType) => void;
  closeSheet: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warm') => void;
  clearToast: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  activeSheet: null,
  toastMessage: null,
  toastType: 'info',

  openSheet: (sheet) => set({ activeSheet: sheet }),
  closeSheet: () => set({ activeSheet: null }),

  showToast: (message, type = 'info') => {
    set({ toastMessage: message, toastType: type });
    setTimeout(() => set({ toastMessage: null }), 2500);
  },

  clearToast: () => set({ toastMessage: null }),
}));
