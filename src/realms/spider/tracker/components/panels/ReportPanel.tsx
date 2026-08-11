import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../../config/theme';
import { useTracker } from '../../context/TrackerContext';
import { GlassPanel } from '../ui/GlassPanel';
import { HUDButton } from '../ui/HUDButton';

const panelStyles: React.CSSProperties = {
  position: 'fixed',
  left: 0,
  top: '48px',
  bottom: '52px',
  width: '420px',
  maxWidth: 'calc(100vw - 24px)',
  zIndex: 25,
};

const inputStyles: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'rgba(0,0,0,0.3)',
  border: `1px solid ${theme.border}`,
  color: theme.primary,
  padding: '8px 12px',
  fontSize: '13px',
  outline: 'none',
  marginBottom: '16px',
  boxSizing: 'border-box',
};

const labelStyles: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  color: theme.muted,
  marginBottom: '4px',
  textTransform: 'uppercase',
};

export const ReportPanel: React.FC = () => {
  const { dispatch } = useTracker();
  const [location, setLocation] = useState('');
  const [type, setType] = useState('CONFIRMED');
  const [description, setDescription] = useState('');
  const [confidence, setConfidence] = useState(50);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    const report = {
      id: `report-${Date.now()}`,
      location,
      type,
      description,
      confidence,
      timestamp: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem('nexus-reports') || '[]');
    localStorage.setItem('nexus-reports', JSON.stringify([...existing, report]));
    
    setSubmitted(true);
    setTimeout(() => {
      dispatch({ type: 'SET_PANEL', panel: null });
    }, 2000);
  };

  return (
    <>
      <style>{`
        .report-input:focus {
          border-color: ${theme.primary} !important;
        }
        .report-input::placeholder {
          color: ${theme.muted};
        }
        input[type=range] {
          -webkit-appearance: none;
          width: 100%;
          background: transparent;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 16px;
          width: 8px;
          background: ${theme.primary};
          cursor: pointer;
          margin-top: -6px;
        }
        input[type=range]::-webkit-slider-runnable-track {
          width: 100%;
          height: 4px;
          cursor: pointer;
          background: ${theme.border};
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
          title="REPORT SIGHTING"
          subtitle="SUBMIT INTELLIGENCE"
          onClose={() => dispatch({ type: 'SET_PANEL', panel: null })}
        >
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px' }}
                >
                  <div style={{ color: theme.confirmed, fontSize: '24px', fontWeight: 'bold' }}>REPORT RECEIVED</div>
                  <div style={{ color: theme.muted, textAlign: 'center', fontSize: '13px' }}>
                    Your intelligence has been added to the local tracker.
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
                    <label style={labelStyles}>Location</label>
                    <input
                      className="report-input"
                      style={inputStyles}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Coordinates or description"
                    />

                    <label style={labelStyles}>Type</label>
                    <select
                      className="report-input"
                      style={inputStyles}
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="RUMORED">RUMORED</option>
                      <option value="EVENT">EVENT</option>
                    </select>

                    <label style={labelStyles}>Description</label>
                    <textarea
                      className="report-input"
                      style={{ ...inputStyles, minHeight: '100px', resize: 'vertical' }}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter details..."
                    />

                    <label style={labelStyles}>Confidence: {confidence}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={confidence}
                      onChange={(e) => setConfidence(Number(e.target.value))}
                      style={{ width: '100%', marginBottom: '24px' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    <HUDButton
                      variant="ghost"
                      onClick={() => dispatch({ type: 'SET_PANEL', panel: null })}
                      style={{ flex: 1 }}
                    >
                      CANCEL
                    </HUDButton>
                    <HUDButton
                      variant="primary"
                      onClick={handleSubmit}
                      style={{ flex: 2 }}
                    >
                      SUBMIT REPORT
                    </HUDButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlassPanel>
      </motion.div>
    </>
  );
};
