import React from 'react';
import { theme } from '../../config/theme';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', pulse = false }) => {
  const colorMap: Record<string, { main: string; dim: string }> = {
    confirmed: { main: '#4ade80', dim: '#4ade8020' },
    active: { main: '#4ade80', dim: '#4ade8020' },
    rumored: { main: '#fbbf24', dim: '#fbbf2420' },
    likely: { main: '#fbbf24', dim: '#fbbf2420' },
    unverified: { main: '#a1a1aa', dim: '#a1a1aa20' },
    upcoming: { main: '#60a5fa', dim: '#60a5fa20' },
    event: { main: '#c084fc', dim: '#c084fc20' },
    completed: { main: '#a1a1aa', dim: '#a1a1aa20' },
  };

  const s = status.toLowerCase();
  const mainColor = colorMap[s]?.main || theme.accent;
  const dimColor = colorMap[s]?.dim || `${theme.accent}20`;

  const fontSize = size === 'sm' ? '9px' : '11px';
  const padding = size === 'sm' ? '2px 6px' : '4px 8px';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding,
        borderRadius: '9999px',
        border: `1px solid ${mainColor}50`,
        background: dimColor,
        color: mainColor,
        fontSize,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontFamily: 'Space Grotesk, sans-serif',
        whiteSpace: 'nowrap',
      }}
    >
      {pulse && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: mainColor,
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
      )}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: .5; transform: scale(1.2); }
          }
        `}
      </style>
      {status}
    </div>
  );
};
