import Dexie, { type Table } from 'dexie';
import type { EmotionEntry, SedonaSession, AppSettings, CustomBackground } from '../types';

export class EmotionHealerDB extends Dexie {
  emotionEntries!: Table<EmotionEntry, string>;
  sedonaSessions!: Table<SedonaSession, string>;
  settings!: Table<AppSettings, string>;
  customBackgrounds!: Table<CustomBackground, string>;

  constructor() {
    super('EmotionHealerDB');
    this.version(2).stores({
      emotionEntries: 'id, timestamp, date, sceneId, mood',
      sedonaSessions: 'id, timestamp, sceneId',
      settings: '&id',
      customBackgrounds: 'id, sceneId',
    });
  }
}

export const db = new EmotionHealerDB();
