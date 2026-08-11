import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import { TrackerEvent } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { theme } from '../../config/theme';

interface EventCardProps {
  event: TrackerEvent;
  onClick?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.2)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        background: theme.surface,
        border: `1px solid ${theme.glassBorder}`,
        borderRadius: '2px',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ height: '80px', background: `linear-gradient(45deg, #111, ${theme.accent}30)`, borderBottom: `1px solid ${theme.glassBorder}` }} />
      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h4 style={{ margin: 0, fontFamily: 'Oswald, sans-serif', fontSize: '16px', color: theme.primary, textTransform: 'uppercase' }}>
            {event.title}
          </h4>
          <StatusBadge status={event.status} size="sm" pulse={event.status === 'active'} />
        </div>
        <div style={{ fontSize: '12px', color: theme.muted, fontFamily: 'Space Grotesk, sans-serif', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={12} color={theme.accent} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={12} color={theme.accent} />
            <span>{event.date}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
