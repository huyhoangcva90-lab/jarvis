import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';
import { theme } from '../../config/theme';
import { brand } from '../../config/brand';
import { PanelType } from '../../types';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useTracker();

  const navItems: { label: string; panel: PanelType }[] = [
    { label: 'ACTIVITY', panel: 'activity' },
    { label: 'REPORT', panel: 'report' },
    { label: 'INTELLIGENCE', panel: 'intelligence' },
    { label: 'MEDIA', panel: 'media' },
    { label: 'EVENTS', panel: 'events' },
    { label: 'HELP', panel: 'help' },
  ];

  const handleNavClick = (panel: PanelType) => {
    dispatch({ type: 'SET_PANEL', panel: panel });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            backgroundColor: 'rgba(7,9,13,0.97)',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <div style={{ fontWeight: 'bold', fontFamily: 'Space Grotesk', fontSize: '16px', letterSpacing: '0.1em', color: theme.primary, display: 'flex', alignItems: 'center', gap: '6px' }}>
              {brand.name}
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: theme.accent, boxShadow: `0 0 6px ${theme.accent}` }} />
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: theme.primary }}>
              <X size={24} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {navItems.map((item, index) => {
              const isActive = state.activePanel === item.panel;
              return (
                <motion.button
                  key={item.panel}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleNavClick(item.panel)}
                  style={{
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    padding: '16px 0',
                    fontSize: '18px',
                    fontFamily: 'Space Grotesk',
                    letterSpacing: '0.15em',
                    color: isActive ? theme.accent : theme.primary,
                    borderBottom: `1px solid ${theme.border}`,
                    textTransform: 'uppercase',
                  }}
                >
                  {item.label}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
