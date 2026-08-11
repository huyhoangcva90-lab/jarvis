import React from 'react';
import { motion } from 'framer-motion';
import { theme } from '../../config/theme';
import { useTracker } from '../../context/TrackerContext';
import { GlassPanel } from '../ui/GlassPanel';
import { Play } from 'lucide-react';

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
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
};

const mockMedia = [
  { id: 1, title: 'Drone Cam Alpha', time: '14:32:00', type: 'LIVE FEED', color: '#ff4444' },
  { id: 2, title: 'Sector 7 Block', time: '-2h 15m', type: 'RECORDING', color: '#4444ff' },
  { id: 3, title: 'Orbital Scan', time: '12:00:00', type: 'SATELLITE', color: '#44ff44' },
  { id: 4, title: 'Heat Sig Track', time: 'LIVE', type: 'THERMAL', color: '#ffaa00' },
];

export const MediaPanel: React.FC = () => {
  const { dispatch } = useTracker();

  return (
    <>
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }
        .media-card {
          background: rgba(0,0,0,0.4);
          border: 1px solid ${theme.border};
          transition: all 0.2s;
          cursor: pointer;
        }
        .media-card:hover {
          transform: scale(1.02);
          border-color: rgba(255,255,255,0.3);
        }
        .media-thumb {
          height: 100px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
      <motion.div
        style={panelStyles}
        initial={{ x: -420, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -420, opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        <GlassPanel
          title="MEDIA"
          subtitle="SURVEILLANCE FEEDS"
          onClose={() => dispatch({ type: 'SET_PANEL', panel: null })}
        >
          <div className="custom-scroll" style={contentStyles}>
            {mockMedia.map((media) => (
              <div key={media.id} className="media-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div 
                  className="media-thumb" 
                  style={{ 
                    background: `linear-gradient(135deg, rgba(0,0,0,0.8), ${media.color}40)`,
                  }}
                >
                  <div style={{ 
                    width: '32px', height: '32px', 
                    borderRadius: '50%', background: 'rgba(0,0,0,0.6)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    <Play size={14} color="#fff" style={{ marginLeft: '2px' }} />
                  </div>
                </div>
                <div style={{ padding: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: theme.primary, marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {media.title}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px' }}>
                    <span style={{ color: theme.muted }}>{media.time}</span>
                    <span style={{ 
                      background: 'rgba(255,255,255,0.1)', 
                      padding: '2px 4px', 
                      borderRadius: '2px',
                      color: media.color 
                    }}>
                      {media.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </motion.div>
    </>
  );
};
