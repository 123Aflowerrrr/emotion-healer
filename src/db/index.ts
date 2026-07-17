import Dexie, { type Table } from 'dexie';
import type { EmotionEntry, ChatSession, ChatMessage, SedonaSession, AppSettings } from '../types';

export class EmotionHealerDB extends Dexie {
  emotionEntries!: Table<EmotionEntry, string>;
  chatSessions!: Table<ChatSession, string>;
  chatMessages!: Table<ChatMessage, string>;
  sedonaSessions!: Table<SedonaSession, string>;
  settings!: Table<AppSettings, string>;

  constructor() {
    super('EmotionHealerDB');
    this.version(1).stores({
      emotionEntries: 'id, timestamp, date, sceneId, mood',
      chatSessions: 'id, sceneId, createdAt, updatedAt',
      chatMessages: 'id, sessionId, timestamp',
      sedonaSessions: 'id, timestamp, sceneId',
      settings: '&id',
    });
  }
}

export const db = new EmotionHealerDB();
