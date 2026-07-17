import { create } from 'zustand';
import type { Scene } from '../types';
import { SCENES } from '../data/scenes';

interface SceneStore {
  scenes: Scene[];
  currentSceneId: string | null;
  setCurrentScene: (id: string) => void;
  getCurrentScene: () => Scene | undefined;
}

export const useSceneStore = create<SceneStore>((set, get) => ({
  scenes: SCENES,
  currentSceneId: null,
  setCurrentScene: (id) => set({ currentSceneId: id }),
  getCurrentScene: () => SCENES.find((s) => s.id === get().currentSceneId),
}));
