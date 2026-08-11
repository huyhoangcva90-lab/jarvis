import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Info } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';
import { GlassPanel } from '../ui/GlassPanel';
import { StatusBadge } from '../ui/StatusBadge';
import { HUDButton } from '../ui/HUDButton';
import { sightings } from '../../data/sightings';
import { events } from '../../data/events';
import { theme } from '../../config/theme';

export const SightingCard: React.FC = () => {
  const { state, dispatch } = useTracker();
  const selectedMarkerId = state.selectedMarkerId;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!selectedMarkerId) return null;

  const item = sightings.find(s => s.id === selectedMarkerId) || events.find(e => e.id === selectedMarkerId);
  if (!item) return null;

  const isEvent = 'date' in item;
  const title = item.title;

  const animationProps = isMobile
    ? { initial: { y: '100%', opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: '100%', opacity: 0 } }
    : { initial: { x: '100%', opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: '100%', opacity: 0 } };

  return (
    <AnimatePresence>
      <motion.div
        {...animationProps}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{
          position: 'fixed',
          bottom: isMobile ? 0 : '16px',
          right: isMobile ? 0 : '16px',
          width: isMobile ? '100%' : '400px',
          height: isMobile ? '70vh' : 'calc(100vh - 32px)',
          zIndex: 1000,
        }}
      >
        <GlassPanel
          onClose={() => dispatch({ type: 'SELECT_MARKER', id: null })}
          style={{ height: '100%', borderLeft: `4px solid ${theme.accent}` }}
        >
          <div style={{ height: '160px', background: 'linear-gradient(to bottom, #1a1a2e, #111)', borderRadius: '2px', marginBottom: '16px', border: `1px solid ${theme.glassBorder}` }} />
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <StatusBadge status={item.status} pulse={item.status === 'active' || item.status === 'confirmed'} />
          </div>

          <h2 style={{ fontFamily: 'Oswald, sans-serif', fontSize: '24px', margin: '0 0 16px 0', color: theme.primary, textTransform: 'uppercase' }}>
            {title}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', color: theme.muted, fontSize: '14px', fontFamily: 'Space Grotesk, sans-serif' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} color={theme.accent} />
              <span>{item.location}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color={theme.accent} />
              <span>{isEvent ? item.date : new Date(item.timestamp).toLocaleString()}</span>
            </div>
          </div>

          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.6, color: theme.primary, marginBottom: '24px' }}>
            {item.description}
          </p>

          {'source' in item && (
            <div style={{ fontSize: '12px', color: theme.muted, fontFamily: 'Space Grotesk, sans-serif', marginBottom: '24px' }}>
              <span style={{ color: theme.accent }}>SOURCE:</span> {(item as any).source}
            </div>
          )}

          <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
            <HUDButton variant="primary" style={{ width: '100%' }} icon={<Info size={16} />}>
              VIEW INTELLIGENCE
            </HUDButton>
          </div>
        </GlassPanel>
      </motion.div>
    </AnimatePresence>
  );
};
