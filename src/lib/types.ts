// ============================================
// VEO-3 SCENE GENERATOR - TYPE DEFINITIONS
// ============================================

export type SceneDuration = 3 | 5 | 10 | 20;

export type SceneType =
  | 'cinematic-brand'
  | 'luxury-commercial'
  | 'documentary'
  | 'hyper-real-performance';

export interface SceneConfig {
  duration: SceneDuration;
  sceneType: SceneType;
  visualMood: string;
  location: string;
  brandReferences?: string;
}

export interface Shot {
  shotNumber: number;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  cameraType: string;
  lens: string;
  movement: string;
  lighting: string;
  emotionalIntent: string;
  soundCue: string;
  description: string;
}

export interface Act {
  actNumber: number;
  title: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  emotionalArc: string;
  shots: Shot[];
}

export interface SceneArchitecture {
  totalDuration: number;
  totalShots: number;
  actCount: number;
  acts: Act[];
}

export interface TimingMap {
  totalRuntime: string;
  tolerance: string;
  breakdown: {
    act: number;
    start: string;
    end: string;
    shots: number;
  }[];
}

export interface GeneratedScene {
  overview: {
    title: string;
    duration: string;
    type: string;
    mood: string;
    location: string;
    logline: string;
  };
  architecture: SceneArchitecture;
  timingMap: TimingMap;
  veoPrompt: string;
  qualityChecklist: string[];
}

export interface GeneratorState {
  isLoading: boolean;
  error: string | null;
  result: GeneratedScene | null;
}

export type OutputTab = 'storyboard' | 'veo-prompt' | 'json';

export const SCENE_TYPE_LABELS: Record<SceneType, string> = {
  'cinematic-brand': 'Cinematic Brand Film',
  'luxury-commercial': 'Luxury Commercial',
  'documentary': 'Documentary Style',
  'hyper-real-performance': 'Hyper-Real Performance'
};

export const DURATION_OPTIONS: { value: SceneDuration; label: string }[] = [
  { value: 3, label: '3 Minutes' },
  { value: 5, label: '5 Minutes' },
  { value: 10, label: '10 Minutes' },
  { value: 20, label: '20 Minutes' }
];
