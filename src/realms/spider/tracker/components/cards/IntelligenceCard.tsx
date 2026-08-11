import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Shield } from 'lucide-react';
import { IntelReport } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { theme } from '../../config/theme';

interface IntelligenceCardProps {
  report: IntelReport;
  onClick?: () => void;
}

export const IntelligenceCard: React.FC<IntelligenceCardProps> = ({ report, onClick }) => {
  const getConfidenceColor = (conf: number) => {
    if (conf > 80) return '#4ade80'; // green
    if (conf > 60) return '#60a5fa'; // blue
    if (conf > 40) return '#fbbf24'; // amber
    return theme.accent; // red
  };

  const confColor = getConfidenceColor(report.confidence);

  return (
    <motion.div
      whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.2)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        background: theme.surface,
        border: `1px solid ${theme.glassBorder}`,
        borderRadius: '2px',
        padding: '16px',
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '10px', color: theme.muted, fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          INTEL #{report.id.substring(0, 8)}
        </span>
        <StatusBadge status={report.status} size="sm" />
      </div>

      <h4 style={{ margin: 0, fontFamily: 'Oswald, sans-serif', fontSize: '18px', color: theme.primary, textTransform: 'uppercase' }}>
        {report.title}
      </h4>

      <div style={{ fontSize: '12px', color: theme.muted, fontFamily: 'Space Grotesk, sans-serif', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <MapPin size={12} color={theme.accent} />
        <span>{report.location}</span>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontFamily: 'Space Grotesk, sans-serif', color: theme.muted, marginBottom: '4px' }}>
          <span>CONFIDENCE</span>
          <span style={{ color: confColor }}>{report.confidence}%</span>
        </div>
        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: `${report.confidence}%`, height: '100%', background: confColor, transition: 'width 0.5s ease-out' }} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', fontSize: '10px', color: theme.muted, fontFamily: 'Space Grotesk, sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Shield size={10} color={theme.accent} />
          <span>{report.source}</span>
        </div>
        <span>{new Date(report.timestamp).toLocaleDateString()}</span>
      </div>
    </motion.div>
  );
};
