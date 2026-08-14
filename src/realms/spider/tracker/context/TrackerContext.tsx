import React, { createContext, useContext, useReducer, useEffect, useRef, ReactNode } from 'react';
import type maplibregl from 'maplibre-gl';
import { TrackerState, TrackerAction, PanelType } from '../types';

interface TrackerContextType {
  state: TrackerState;
  dispatch: React.Dispatch<TrackerAction>;
  mapRef: React.MutableRefObject<maplibregl.Map | null>;
  flyTo: (coordinates: [number, number], markerId?: string) => void;
}

const initialState: TrackerState = {
  activePanel: null,
  selectedMarkerId: null,
  mapCenter: [15, 30],
  mapZoom: 2.5,
  filters: {
    confirmed: true,
    rumored: true,
    events: true,
    timeFilter: 'all',
  },
  soundEnabled: false,
  introComplete: true,
  tutorialComplete: true,
  notifications: [],
};

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

function trackerReducer(state: TrackerState, action: TrackerAction): TrackerState {
  switch (action.type) {
    case 'SET_PANEL':
      return { ...state, activePanel: action.panel };
    case 'SELECT_MARKER':
      return { ...state, selectedMarkerId: action.id };
    case 'SET_MAP_VIEW':
      return {
        ...state,
        mapCenter: action.center,
        mapZoom: action.zoom ?? state.mapZoom,
      };
    case 'TOGGLE_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.filter]: !state.filters[action.filter],
        },
      };
    case 'SET_TIME_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          timeFilter: action.timeFilter,
        },
      };
    case 'TOGGLE_SOUND':
      return { ...state, soundEnabled: !state.soundEnabled };
    case 'SET_INTRO_COMPLETE':
      return { ...state, introComplete: true };
    case 'SET_TUTORIAL_COMPLETE':
      return { ...state, tutorialComplete: true };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.message],
      };
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
    default:
      return state;
  }
}

function loadInitialState(): TrackerState {
  try {
    const soundEnabled = localStorage.getItem('nexus-sound') === 'true';
    const introComplete = localStorage.getItem('nexus-intro-complete') !== 'false';
    const tutorialComplete = localStorage.getItem('nexus-tutorial-complete') !== 'false';
    return {
      ...initialState,
      soundEnabled,
      introComplete,
      tutorialComplete,
    };
  } catch {
    return initialState;
  }
}

export function TrackerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(trackerReducer, initialState, loadInitialState);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    localStorage.setItem('nexus-sound', String(state.soundEnabled));
  }, [state.soundEnabled]);

  useEffect(() => {
    localStorage.setItem('nexus-intro-complete', String(state.introComplete));
  }, [state.introComplete]);

  useEffect(() => {
    localStorage.setItem('nexus-tutorial-complete', String(state.tutorialComplete));
  }, [state.tutorialComplete]);

  const flyTo = (coordinates: [number, number], markerId?: string) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: coordinates,
        zoom: 8,
        essential: true,
      });
    }
    if (markerId) {
      dispatch({ type: 'SELECT_MARKER', id: markerId });
    }
  };

  return (
    <TrackerContext.Provider value={{ state, dispatch, mapRef, flyTo }}>
      {children}
    </TrackerContext.Provider>
  );
}

export function useTracker() {
  const context = useContext(TrackerContext);
  if (context === undefined) {
    throw new Error('useTracker must be used within a TrackerProvider');
  }
  return context;
}
