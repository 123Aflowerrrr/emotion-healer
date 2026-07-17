import Dexie, { type Table } from 'dexie';
import type { EmotionEntry, ChatSession, ChatMessage, SedonaSession, AppSettings, CustomBackground } from '../types';

export class EmotionHealerDB extends Dexie {
  emotionEntries!: Table<EmotionEntry, string>;
  chatSessions!: Table<ChatSession, string>;
  chatMessages!: Table<ChatMessage, string>;
  sedonaSessions!: Table<SedonaSession, string>;
  settings!: Table<AppSettings, string>;
  customBackgrounds!: Table<CustomBackground, string>;

  constructor() {
    super('EmotionHealerDB');
    this.version(2).stores({
      emotionEntries: 'id, timestamp, date, sceneId, mood',
      chatSessions: 'id, sceneId, createdAt, updatedAt',
      chatMessages: 'id, sessionId, timestamp',
      sedonaSessions: 'id, timestamp, sceneId',
      settings: '&id',
      customBackgrounds: 'id, sceneId',
    });
  }
}

export const db = new EmotionHealerDB();
