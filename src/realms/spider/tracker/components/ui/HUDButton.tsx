import React from 'react';
import { motion } from 'framer-motion';
import { theme } from '../../config/theme';

interface HUDButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'danger';
  active?: boolean;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: React.CSSProperties;
}

export const HUDButton: React.FC<HUDButtonProps> = ({
  children,
  onClick,
  variant = 'ghost',
  active = false,
  icon,
  size = 'md',
  disabled = false,
  style = {},
}) => {
  let background: string = 'transparent';
  let border: string = '1px solid rgba(255, 255, 255, 0.08)';
  let color: string = theme.primary;
  let boxShadow: string = 'none';

  if (variant === 'primary') {
    background = theme.accent;
    border = `1px solid ${theme.accent}`;
    color = '#fff';
    boxShadow = active ? `0 0 15px ${theme.accent}80` : 'none';
  } else if (variant === 'danger') {
    border = `1px solid #ff3b30`;
    color = '#ff3b30';
  }

  if (active && variant === 'ghost') {
    border = `1px solid ${theme.accent}`;
    background = `${theme.accent}20`;
  }

  let fontSize = '12px';
  let padding = '8px 16px';
  if (size === 'sm') {
    fontSize = '10px';
    padding = '4px 8px';
  } else if (size === 'lg') {
    fontSize = '14px';
    padding = '12px 24px';
  }

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02, borderColor: variant === 'ghost' ? 'rgba(255, 255, 255, 0.2)' : border, boxShadow: variant === 'primary' ? `0 0 10px ${theme.accent}80` : boxShadow } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      style={{
        background,
        border,
        color,
        boxShadow,
        fontSize,
        padding,
        borderRadius: '2px',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontFamily: 'Space Grotesk, sans-serif',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s ease',
        ...style,
      }}
    >
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </motion.button>
  );
};
