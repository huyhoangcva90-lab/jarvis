import React from 'react';
import { motion } from 'framer-motion';
import { theme } from '../../config/theme';
import { useTracker } from '../../context/TrackerContext';
import { GlassPanel } from '../ui/GlassPanel';
import { StatusBadge } from '../ui/StatusBadge';
import { MapPin, Clock } from 'lucide-react';
import { sightings } from '../../data/sightings';

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

const itemStyles: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
  padding: '12px',
  borderBottom: `1px solid ${theme.border}`,
  cursor: 'pointer',
  transition: 'background-color 0.2s',
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export const ActivityPanel: React.FC = () => {
  const { dispatch, flyTo } = useTracker();

  return (
    <>
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }
        .activity-item:hover { background-color: rgba(255,255,255,0.05); }
      `}</style>
      <motion.div
        style={panelStyles}
        initial={{ x: -420, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -420, opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        <GlassPanel
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>ACTIVITY LOG</span>
              <motion.div
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: theme.confirmed,
                }}
              />
            </div>
          }
          subtitle="LIVE INTELLIGENCE FEED"
          onClose={() => dispatch({ type: 'SET_PANEL', panel: null })}
        >
          <motion.div
            className="custom-scroll"
            style={contentStyles}
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {sightings.length === 0 && (
              <div style={{ padding: '18px', color: theme.muted, fontSize: '13px', lineHeight: 1.6 }}>
                Chưa có địa điểm nào được lưu. Map đang sạch để bạn dùng làm tracker đồ ăn/uống cá nhân.
              </div>
            )}
            {sightings.map((sighting) => (
              <motion.div
                key={sighting.id}
                className="activity-item"
                style={itemStyles}
                variants={itemVariants}
                onClick={() => flyTo(sighting.coordinates, sighting.id)}
              >
                <div style={{ paddingTop: '4px' }}>
                  <motion.div
                    animate={sighting.status === 'confirmed' ? { scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] } : {}}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: sighting.status === 'confirmed' ? theme.confirmed : theme.secondary,
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <StatusBadge status={sighting.status} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: theme.muted }}>
                      <Clock size={12} />
                      {sighting.timeAgo}
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', color: theme.primary, marginBottom: '6px' }}>
                    {sighting.description}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: theme.muted }}>
                    <MapPin size={12} />
                    {sighting.location}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </GlassPanel>
      </motion.div>
    </>
  );
};
