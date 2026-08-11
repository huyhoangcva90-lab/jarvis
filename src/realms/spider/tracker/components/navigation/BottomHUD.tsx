import React, { useState, useEffect } from 'react';
import { Compass, Mail, Layers, Eye, Calendar } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';
import { theme } from '../../config/theme';

export const BottomHUD: React.FC = () => {
  const { state, dispatch } = useTracker();
  const [showFilters, setShowFilters] = useState(false);
  const [time, setTime] = useState(new Date().toISOString().substring(11, 19) + ' UTC');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toISOString().substring(11, 19) + ' UTC');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sectionStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0 16px',
    cursor: 'pointer',
    color: isActive ? theme.accent : theme.muted,
    borderRight: `1px solid ${theme.border}`,
    height: '100%',
    background: 'none',
    borderTop: 'none',
    borderBottom: 'none',
    borderLeft: 'none',
    fontFamily: 'Space Grotesk',
    fontSize: '10px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  });

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        zIndex: 30,
        height: isMobile ? '40px' : '52px',
        background: 'linear-gradient(0deg, rgba(7,9,13,0.95) 0%, rgba(7,9,13,0.6) 100%)',
        borderTop: `1px solid ${theme.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backdropFilter: 'blur(4px)',
      }}
    >
      {!isMobile && (
        <div style={{ padding: '0 16px', fontSize: '10px', color: theme.muted, fontFamily: 'monospace' }}>
          {state.mapCenter ? `LAT: ${state.mapCenter[1].toFixed(4)} LON: ${state.mapCenter[0].toFixed(4)}` : 'WAITING FOR SIGNAL'}
        </div>
      )}

      <div style={{ display: 'flex', height: '100%', flex: 1, justifyContent: 'center' }}>
        <button style={sectionStyle(false)}>
          <Compass size={16} /> {!isMobile && 'Navigation'}
        </button>
        <button 
          style={sectionStyle(state.activePanel === 'messages')}
          onClick={() => dispatch({ type: 'SET_PANEL', panel: state.activePanel === 'messages' ? null : 'messages' })}
        >
          <Mail size={16} /> {!isMobile && 'Message Center'}
        </button>
        
        <div style={{ position: 'relative', height: '100%' }}>
          <button 
            style={{...sectionStyle(showFilters), borderRight: isMobile ? 'none' : `1px solid ${theme.border}`}}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Layers size={16} /> {!isMobile && 'Map Filters'}
          </button>
          
          {showFilters && (
            <div style={{
              position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
              marginBottom: '8px', padding: '12px', background: theme.glass, border: `1px solid ${theme.border}`,
              display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '150px'
            }}>
              <label style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: theme.primary, cursor: 'pointer'}}>
                <input type="checkbox" checked={state.filters.confirmed} onChange={() => dispatch({type: 'TOGGLE_FILTER', filter: 'confirmed'})} />
                CONFIRMED
              </label>
              <label style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: theme.primary, cursor: 'pointer'}}>
                <input type="checkbox" checked={state.filters.rumored} onChange={() => dispatch({type: 'TOGGLE_FILTER', filter: 'rumored'})} />
                RUMORED
              </label>
              <label style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: theme.primary, cursor: 'pointer'}}>
                <input type="checkbox" checked={state.filters.events} onChange={() => dispatch({type: 'TOGGLE_FILTER', filter: 'events'})} />
                EVENTS
              </label>
            </div>
          )}
        </div>

        <button 
          style={sectionStyle(state.activePanel === 'media')}
          onClick={() => dispatch({ type: 'SET_PANEL', panel: state.activePanel === 'media' ? null : 'media' })}
        >
          <Eye size={16} /> {!isMobile && 'Watch'}
        </button>
        <button 
          style={{...sectionStyle(state.activePanel === 'events'), borderRight: 'none'}}
          onClick={() => dispatch({ type: 'SET_PANEL', panel: state.activePanel === 'events' ? null : 'events' })}
        >
          <Calendar size={16} /> {!isMobile && 'Events'}
        </button>
      </div>

      {!isMobile && (
        <div style={{ padding: '0 16px', fontSize: '10px', color: theme.muted, fontFamily: 'monospace' }}>
          {time}
        </div>
      )}
    </div>
  );
};
