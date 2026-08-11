import React from 'react';
import { theme } from '../../config/theme';

export const MapLegend: React.FC = () => {
  const itemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '10px',
    textTransform: 'uppercase',
    color: theme.primary,
    fontFamily: 'Space Grotesk, sans-serif',
    letterSpacing: '0.05em',
  };

  const dotStyle = (color: string): React.CSSProperties => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: color,
    boxShadow: `0 0 4px ${color}`,
  });

  return (
    <div
      style={{
        position: 'fixed',
        left: '16px',
        bottom: '100px',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        background: theme.glass,
        padding: '12px',
        borderRadius: '4px',
        border: `1px solid ${theme.border}`,
      }}
    >
      <div style={itemStyle}>
        <div style={dotStyle(theme.confirmed)} />
        <span>Confirmed</span>
      </div>
      <div style={itemStyle}>
        <div style={dotStyle(theme.rumored)} />
        <span>Rumored</span>
      </div>
      <div style={itemStyle}>
        <div style={dotStyle(theme.event)} />
        <span>Event</span>
      </div>
    </div>
  );
};
