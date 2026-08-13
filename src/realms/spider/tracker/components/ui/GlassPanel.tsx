import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { theme } from '../../config/theme';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClose?: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className = '',
  style = {},
  onClose,
  title,
  subtitle,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={className}
      style={{
        background: theme.glass,
        backdropFilter: 'blur(20px)',
        border: `1px solid ${theme.glassBorder}`,
        borderRadius: '2px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
    >
      {(title || onClose) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            borderBottom: `1px solid ${theme.glassBorder}`,
            borderLeft: title ? `3px solid ${theme.accent}` : 'none',
          }}
        >
          <div>
            {title && (
              <h3
                style={{
                  margin: 0,
                  color: theme.primary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p
                style={{
                  margin: '4px 0 0 0',
                  color: theme.muted,
                  fontSize: '12px',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: theme.muted,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>
      )}
      <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
        {children}
      </div>
    </motion.div>
  );
};
