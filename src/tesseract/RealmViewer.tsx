import { useMemo } from 'react';
import JarvisCanvas from '../core/JarvisCanvas';
import type { EnergyPalette, AiActivity, ModuleId } from './tesseract';

const MODULE_PALETTE_MAP: Record<ModuleId, EnergyPalette> = {
  chat: 'gold',
  hermes: 'gold',
  missions: 'blue',
  agents: 'violet',
  openclaw: 'blue',
  web: 'red',
  office: 'violet',
  memory: 'green',
  router: 'blue',
  logs: 'red',
  settings: 'gold',
};

// Map AiEmotion to AiActivity for the 3D renderer
const EMOTION_ACTIVITY_MAP = {
  calm: 'idle',
  listening: 'listening',
  thinking: 'thinking',
  speaking: 'speaking',
  alert: 'thinking',
  creative: 'speaking',
  spider: 'thinking',
} as const;

export default function RealmViewer({ moduleId, emotion }: { moduleId: ModuleId; emotion: string }) {
  const palette = MODULE_PALETTE_MAP[moduleId] ?? 'gold';
  const activity: AiActivity = EMOTION_ACTIVITY_MAP[emotion as keyof typeof EMOTION_ACTIVITY_MAP] ?? 'idle';
  
  return (
    <section className="realm-viewer" aria-label="3D Realm Visualization">
      <JarvisCanvas activity={activity} palette={palette} />
    </section>
  );
}
