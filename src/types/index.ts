// ============================================================
// 自定义背景类型
// ============================================================
export type BackgroundType = 'default' | 'image' | 'video';

export interface CustomBackground {
  id: string;
  sceneId: string;
  type: BackgroundType;
  name: string;
  data: string;
  createdAt: number;
}

// ============================================================
// 场景类型
// ============================================================
export type SceneTheme = 'forest' | 'cafe' | 'seaside' | 'garden' | 'mountain';

export interface Scene {
  id: string;
  name: string;
  description: string;
  icon: string;
  theme: SceneTheme;
  bgClass: string;
  bgImage?: string;   // 自定义背景图路径，如 /backgrounds/forest.jpg
  bgVideo?: string;   // 自定义背景视频路径，如 /backgrounds/forest.mp4
  primaryColor: string;
  accentColor: string;
  ambientSounds: { type: string; label: string }[];
  particles: ParticleConfig;
}

export interface ParticleConfig {
  type: 'firefly' | 'rain' | 'sparkle' | 'petal' | 'snow';
  count: number;
  color: string;
  speed: number;
  size: number;
}

// ============================================================
// 情绪类型
// ============================================================
export type MoodLevel = 'very_sad' | 'sad' | 'neutral' | 'good' | 'great';

export interface MoodOption {
  level: MoodLevel;
  emoji: string;
  label: string;
  color: string;
}

export type FeelingCategory = 'anxiety' | 'sadness' | 'anger' | 'physical' | 'positive';

export interface FeelingTag {
  id: string;
  label: string;
  category: FeelingCategory;
}

export interface EmotionEntry {
  id: string;
  timestamp: number;
  date: string;
  sceneId: string;
  mood: MoodLevel;
  feelingTags: string[];
  note: string;
  intensity: number;
  animalCompanion: string;
}

// ============================================================
// 动物伙伴类型
// ============================================================
export type AnimalType = 'cat' | 'dog' | 'bunny' | 'fox' | 'bear';
export type CompanionMood = 'idle' | 'happy' | 'concerned' | 'celebrating' | 'guiding';
export type CompanionAnimation = 'breathing' | 'sitting' | 'wandering' | 'nuzzling' | 'jumping';

export interface AnimalCompanion {
  id: string;
  type: AnimalType;
  name: string;
  emoji: string;
  personality: string;
  color: string;
  idleMessages: string[];
  sedonaGuidance: Record<string, string>;
  unlocked: boolean;
}

// ============================================================
// 对话类型
// ============================================================
export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  sessionId: string;
  timestamp: number;
  role: ChatRole;
  content: string;
}

export interface ChatSession {
  id: string;
  sceneId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

// ============================================================
// 圣多纳释放法类型
// ============================================================
export type SedonaStep = 'allow' | 'welcome' | 'could' | 'would' | 'when';

export interface SedonaStepConfig {
  step: SedonaStep;
  stepNumber: number;
  title: string;
  guidance: string;
  companionMessage: string;
  affirmation: string;
}

export interface SedonaSession {
  id: string;
  timestamp: number;
  sceneId: string;
  emotionEntryId?: string;
  currentStep: number;
  totalSteps: number;
  completed: boolean;
  compassionAnimal: string;
  intensityLevels: number[];
}

// ============================================================
// 设置类型
// ============================================================
export type AIProvider = 'doubao' | 'openai' | 'custom';

export interface AppSettings {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  aiProvider: AIProvider;
  aiEndpoint: string;
  aiApiKey: string;
  aiModel: string;
  selectedCompanionId: string;
  firstLaunchComplete: boolean;
}

// ============================================================
// UI 类型
// ============================================================
export type SheetType = 'journal' | 'chat' | 'history' | 'settings' | 'companion' | null;
