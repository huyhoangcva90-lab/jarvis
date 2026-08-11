import { useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { TrackerProvider, useTracker } from './context/TrackerContext';
import { IntroScreen } from './components/cinematic/IntroScreen';
import { WorldMap } from './components/map/WorldMap';
import { MapControls } from './components/map/MapControls';
import { MapLegend } from './components/map/MapLegend';
import { TopNavigation } from './components/navigation/TopNavigation';
import { BottomHUD } from './components/navigation/BottomHUD';
import { MobileMenu } from './components/navigation/MobileMenu';
import { ActivityPanel } from './components/panels/ActivityPanel';
import { EventsPanel } from './components/panels/EventsPanel';
import { IntelligencePanel } from './components/panels/IntelligencePanel';
import { MessageCenter } from './components/panels/MessageCenter';
import { ReportPanel } from './components/panels/ReportPanel';
import { HelpPanel } from './components/panels/HelpPanel';
import { MediaPanel } from './components/panels/MediaPanel';
import { SightingCard } from './components/cards/SightingCard';

function TrackerExperience() {
  const { state, dispatch } = useTracker();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable);
      if (isTyping) return;

      if (e.key === 'Escape') {
        if (state.selectedMarkerId) {
          dispatch({ type: 'SELECT_MARKER', id: null });
        } else if (state.activePanel) {
          dispatch({ type: 'SET_PANEL', panel: null });
        }
      }
      if (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.metaKey) {
        // Toggle filters panel in BottomHUD (handled there)
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.activePanel, state.selectedMarkerId, dispatch]);

  // If intro not complete, show intro
  if (!state.introComplete) {
    return (
      <IntroScreen
        onComplete={() => dispatch({ type: 'SET_INTRO_COMPLETE' })}
      />
    );
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      position: 'relative',
      background: '#07090D',
    }}>
      {/* Map Layer - z-index 0 */}
      <WorldMap />

      {/* Navigation - z-index 30 */}
      <TopNavigation />
      <BottomHUD />

      {/* Map Controls - z-index 20 */}
      <MapControls />
      <MapLegend />

      {/* Panels - z-index 25 */}
      <AnimatePresence mode="wait">
        {state.activePanel === 'activity' && <ActivityPanel key="activity" />}
        {state.activePanel === 'events' && <EventsPanel key="events" />}
        {state.activePanel === 'intelligence' && <IntelligencePanel key="intelligence" />}
        {state.activePanel === 'messages' && <MessageCenter key="messages" />}
        {state.activePanel === 'report' && <ReportPanel key="report" />}
        {state.activePanel === 'help' && <HelpPanel key="help" />}
        {state.activePanel === 'media' && <MediaPanel key="media" />}
      </AnimatePresence>

      {/* Sighting Detail Card - z-index 35 */}
      <AnimatePresence>
        {state.selectedMarkerId && <SightingCard key="sighting-card" />}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <TrackerProvider>
      <TrackerExperience />
    </TrackerProvider>
  );
}
