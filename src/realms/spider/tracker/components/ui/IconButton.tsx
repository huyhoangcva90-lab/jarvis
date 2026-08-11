import React from 'react';
import { motion } from 'framer-motion';
import { theme } from '../../config/theme';

interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  label: string;
  active?: boolean;
  size?: number;
  style?: React.CSSProperties;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  label,
  active = false,
  size = 36,
  style = {},
}) => {
  const border = active ? `1px solid ${theme.accent}` : '1px solid rgba(255,255,255,0.08)';
  const bg = active ? `${theme.accent}20` : 'transparent';
  const shadow = active ? `0 0 10px ${theme.accent}50` : 'none';

  return (
    <motion.button
      whileHover={{ scale: 1.05, borderColor: active ? theme.accent : 'rgba(255,255,255,0.3)' }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      aria-label={label}
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '2px',
        background: bg,
        border: border,
        color: active ? theme.accent : theme.primary,
        cursor: 'pointer',
        boxShadow: shadow,
        transition: 'color 0.2s, background 0.2s',
        ...style,
      }}
    >
      {icon}
    </motion.button>
  );
};
