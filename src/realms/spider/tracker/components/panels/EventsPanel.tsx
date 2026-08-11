import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { theme } from '../../config/theme';
import { useTracker } from '../../context/TrackerContext';
import { GlassPanel } from '../ui/GlassPanel';
import { EventCard } from '../cards/EventCard';
import { events } from '../../data/events';

const panelStyles: React.CSSProperties = {
  position: 'fixed',
  left: 0,
  top: '48px',
  bottom: '52px',
  width: '420px',
  maxWidth: 'calc(100vw - 24px)',
  zIndex: 25,
};

const contentStyles: React.CSSProperties = {
  overflowY: 'auto',
  height: '100%',
  paddingRight: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const tabsStyles: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  marginBottom: '16px',
  borderBottom: `1px solid ${theme.border}`,
  paddingBottom: '8px',
};

type FilterTab = 'ALL' | 'UPCOMING' | 'ACTIVE' | 'COMPLETED';

export const EventsPanel: React.FC = () => {
  const { dispatch, flyTo } = useTracker();
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');

  const filteredEvents = events.filter((e) => {
    if (activeTab === 'ALL') return true;
    return e.status === activeTab.toLowerCase();
  });

  return (
    <>
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }
      `}</style>
      <motion.div
        style={panelStyles}
        initial={{ x: -420, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -420, opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        <GlassPanel
          title="EVENTS"
          subtitle="GLOBAL EVENT TRACKER"
          onClose={() => dispatch({ type: 'SET_PANEL', panel: null })}
        >
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={tabsStyles}>
              {(['ALL', 'UPCOMING', 'ACTIVE', 'COMPLETED'] as FilterTab[]).map((tab) => (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    fontSize: '11px',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    color: activeTab === tab ? theme.primary : theme.muted,
                    borderBottom: activeTab === tab ? `1px solid ${theme.primary}` : 'none',
                    marginBottom: activeTab === tab ? '-9px' : '0',
                  }}
                >
                  {tab}
                </div>
              ))}
            </div>
            <div className="custom-scroll" style={contentStyles}>
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => {
                    flyTo(event.coordinates);
                    dispatch({ type: 'SELECT_MARKER', id: event.id });
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </div>
        </GlassPanel>
      </motion.div>
    </>
  );
};
