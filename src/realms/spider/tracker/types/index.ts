export type MarkerStatus = 'confirmed' | 'rumored' | 'event';
export type PanelType = 'activity' | 'events' | 'intelligence' | 'messages' | 'report' | 'help' | 'media' | 'settings' | null;
export type TimeFilter = 'all' | 'today' | 'week';

export interface Sighting {
  id: string;
  title: string;
  location: string;
  coordinates: [number, number]; // [lng, lat]
  status: MarkerStatus;
  timestamp: string;
  timeAgo: string;
  description: string;
  source: string;
  image?: string;
}

export interface TrackerEvent {
  id: string;
  title: string;
  location: string;
  coordinates: [number, number];
  date: string;
  description: string;
  image?: string;
  status: 'upcoming' | 'active' | 'completed';
}

export interface IntelReport {
  id: string;
  reportNumber: string;
  title: string;
  location: string;
  coordinates: [number, number];
  confidence: number;
  source: string;
  timestamp: string;
  status: 'confirmed' | 'likely' | 'unverified';
  description: string;
}

export interface Message {
  id: string;
  from: string;
  content: string;
  timestamp: string;
  read: boolean;
  priority: 'normal' | 'high' | 'critical';
}

export interface TrackerState {
  activePanel: PanelType;
  selectedMarkerId: string | null;
  mapCenter: [number, number];
  mapZoom: number;
  filters: {
    confirmed: boolean;
    rumored: boolean;
    events: boolean;
    timeFilter: TimeFilter;
  };
  soundEnabled: boolean;
  introComplete: boolean;
  tutorialComplete: boolean;
  notifications: string[];
}

export type TrackerAction =
  | { type: 'SET_PANEL'; panel: PanelType }
  | { type: 'SELECT_MARKER'; id: string | null }
  | { type: 'SET_MAP_VIEW'; center: [number, number]; zoom?: number }
  | { type: 'TOGGLE_FILTER'; filter: 'confirmed' | 'rumored' | 'events' }
  | { type: 'SET_TIME_FILTER'; timeFilter: TimeFilter }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'SET_INTRO_COMPLETE' }
  | { type: 'SET_TUTORIAL_COMPLETE' }
  | { type: 'ADD_NOTIFICATION'; message: string }
  | { type: 'CLEAR_NOTIFICATIONS' };
