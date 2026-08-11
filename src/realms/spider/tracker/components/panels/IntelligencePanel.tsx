import React from 'react';
import { motion } from 'framer-motion';
import { theme } from '../../config/theme';
import { useTracker } from '../../context/TrackerContext';
import { GlassPanel } from '../ui/GlassPanel';
import { IntelligenceCard } from '../cards/IntelligenceCard';
import { intelligence } from '../../data/intelligence';

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

const statsContainerStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '12px',
  backgroundColor: 'rgba(0,0,0,0.2)',
  border: `1px solid ${theme.border}`,
  marginBottom: '16px',
};

const statBlockStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const statValueStyles: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: theme.primary,
};

const statLabelStyles: React.CSSProperties = {
  fontSize: '10px',
  color: theme.muted,
  textTransform: 'uppercase',
};

export const IntelligencePanel: React.FC = () => {
  const { dispatch, flyTo } = useTracker();

  const confirmedCount = intelligence.filter((i) => i.status === 'confirmed').length;
  const avgConfidence = Math.round(
    intelligence.reduce((acc, curr) => acc + curr.confidence, 0) / intelligence.length
  );

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
          title="INTELLIGENCE"
          subtitle="CLASSIFIED REPORTS"
          onClose={() => dispatch({ type: 'SET_PANEL', panel: null })}
        >
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={statsContainerStyles}>
              <div style={statBlockStyles}>
                <div style={statValueStyles}>{intelligence.length}</div>
                <div style={statLabelStyles}>TOTAL REPORTS</div>
              </div>
              <div style={statBlockStyles}>
                <div style={statValueStyles}>{avgConfidence}%</div>
                <div style={statLabelStyles}>AVG CONFIDENCE</div>
              </div>
              <div style={statBlockStyles}>
                <div style={statValueStyles}>{confirmedCount}</div>
                <div style={statLabelStyles}>CONFIRMED</div>
              </div>
            </div>
            
            <div className="custom-scroll" style={contentStyles}>
              {intelligence.map((report) => (
                <div
                  key={report.id}
                  onClick={() => flyTo(report.coordinates)}
                  style={{ cursor: 'pointer' }}
                >
                  <IntelligenceCard report={report} />
                </div>
              ))}
            </div>
          </div>
        </GlassPanel>
      </motion.div>
    </>
  );
};
