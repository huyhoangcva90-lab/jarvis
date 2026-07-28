import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { 
  ModuleId, AiEmotion, OfficeRoomId, JCoreModule, EmotionState, EnergyPalette 
} from './tesseract';
import { modules, emotions, MODULE_REALM_MAP } from './constants';

interface TesseractState {
  activeModuleId: ModuleId;
  emotion: AiEmotion;
  selectedRoomId: OfficeRoomId;
  activeModule: JCoreModule;
  emotionState: EmotionState;
  currentPalette: EnergyPalette;
  clock: string;
}

interface TesseractActions {
  setModule: (id: ModuleId) => void;
  setEmotion: (emotion: AiEmotion) => void;
  setRoom: (id: OfficeRoomId) => void;
}

const TesseractContext = createContext<(TesseractState & TesseractActions) | null>(null);

const STORAGE_KEY = 'jcore.ui.v2';

export function TesseractProvider({ children }: { children: React.ReactNode }) {
  const [activeModuleId, setActiveModuleId] = useState<ModuleId>('chat');
  const [emotion, setEmotionState] = useState<AiEmotion>('calm');
  const [selectedRoomId, setSelectedRoomId] = useState<OfficeRoomId>('lobby');
  const [clock, setClock] = useState<string>('');

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.activeModuleId && modules.some(m => m.id === parsed.activeModuleId)) {
          setActiveModuleId(parsed.activeModuleId as ModuleId);
        }
        if (parsed.emotion && emotions[parsed.emotion as AiEmotion]) {
          setEmotionState(parsed.emotion as AiEmotion);
        }
        if (parsed.selectedRoomId) {
          setSelectedRoomId(parsed.selectedRoomId as OfficeRoomId);
        }
      }
    } catch (e) {
      console.warn("Failed to load tesseract state", e);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      activeModuleId,
      emotion,
      selectedRoomId
    }));
  }, [activeModuleId, emotion, selectedRoomId]);

  // Clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClock(now.toLocaleTimeString('vi-VN', { hour12: false }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Computed
  const activeModule = useMemo(() => {
    return modules.find(m => m.id === activeModuleId) || modules[0];
  }, [activeModuleId]);

  const emotionState = useMemo(() => {
    return emotions[emotion] || emotions.calm;
  }, [emotion]);

  const currentPalette = useMemo(() => {
    return MODULE_REALM_MAP[activeModuleId] || 'gold';
  }, [activeModuleId]);

  const contextValue = {
    activeModuleId,
    emotion,
    selectedRoomId,
    activeModule,
    emotionState,
    currentPalette,
    clock,
    setModule: setActiveModuleId,
    setEmotion: setEmotionState,
    setRoom: setSelectedRoomId,
  };

  return (
    <TesseractContext.Provider value={contextValue}>
      {children}
    </TesseractContext.Provider>
  );
}

export function useTesseract() {
  const context = useContext(TesseractContext);
  if (!context) {
    throw new Error('useTesseract must be used within a TesseractProvider');
  }
  return context;
}
