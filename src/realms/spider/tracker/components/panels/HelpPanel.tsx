import React from 'react';
import { motion } from 'framer-motion';
import { theme } from '../../config/theme';
import { useTracker } from '../../context/TrackerContext';
import { GlassPanel } from '../ui/GlassPanel';
import { HUDButton } from '../ui/HUDButton';
import { MapPin, MousePointer2, Settings2, Filter, Keyboard } from 'lucide-react';

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
  gap: '24px',
};

const sectionTitleStyles: React.CSSProperties = {
  fontSize: '11px',
  color: theme.muted,
  textTransform: 'uppercase',
  marginBottom: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const paragraphStyles: React.CSSProperties = {
  fontSize: '13px',
  color: theme.primary,
  lineHeight: 1.5,
};

export const HelpPanel: React.FC = () => {
  const { dispatch } = useTracker();

  const handleGotIt = () => {
    // In a real app we might save this to context/localStorage
    dispatch({ type: 'SET_PANEL', panel: null });
  };

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
          title="HELP"
          subtitle="SYSTEM GUIDE"
          onClose={() => dispatch({ type: 'SET_PANEL', panel: null })}
        >
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="custom-scroll" style={contentStyles}>
              <div>
                <div style={sectionTitleStyles}><MapPin size={14} /> MARKERS</div>
                <div style={paragraphStyles}>
                  The map displays 3 types of intelligence markers:<br/>
                  <span style={{ color: theme.primary }}>Ă¢â‚¬Â¢</span> Red: Confirmed sightings<br/>
                  <span style={{ color: theme.secondary }}>Ă¢â‚¬Â¢</span> Amber: Rumored sightings<br/>
                  <span style={{ color: theme.confirmed }}>Ă¢â‚¬Â¢</span> Green: Events
                </div>
              </div>

              <div>
                <div style={sectionTitleStyles}><MousePointer2 size={14} /> NAVIGATION</div>
                <div style={paragraphStyles}>
                  Use the top navigation bar to switch between different data views and the bottom HUD to access system functions and active status.
                </div>
              </div>

              <div>
                <div style={sectionTitleStyles}><Settings2 size={14} /> MAP CONTROLS</div>
                <div style={paragraphStyles}>
                  Zoom in/out using scroll wheel or bottom HUD buttons. Use the crosshair icon to re-center the map to the global view.
                </div>
              </div>

              <div>
                <div style={sectionTitleStyles}><Filter size={14} /> FILTERS</div>
                <div style={paragraphStyles}>
                  Click the filter icon in the HUD to toggle visibility of different marker types and clean up your view.
                </div>
              </div>

              <div>
                <div style={sectionTitleStyles}><Keyboard size={14} /> KEYBOARD SHORTCUTS</div>
                <div style={paragraphStyles}>
                  <strong>ESC</strong> - Close active panels<br/>
                  <strong>F</strong> - Toggle filters menu
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '16px' }}>
              <HUDButton variant="primary" style={{ width: '100%' }} onClick={handleGotIt}>
                GOT IT
              </HUDButton>
            </div>
          </div>
        </GlassPanel>
      </motion.div>
    </>
  );
};
