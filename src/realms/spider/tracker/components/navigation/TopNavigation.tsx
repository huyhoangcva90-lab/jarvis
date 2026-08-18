import React, { useState, useEffect } from 'react';
import { Menu, Bell, Volume2, VolumeX } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';
import { theme } from '../../config/theme';
import { brand } from '../../config/brand';
import { PanelType } from '../../types';
import { MobileMenu } from './MobileMenu';

export const TopNavigation: React.FC = () => {
  const { state, dispatch } = useTracker();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems: { label: string; panel: PanelType }[] = [
    { label: 'ACTIVITY', panel: 'activity' },
    { label: 'REPORT', panel: 'report' },
    { label: 'INTELLIGENCE', panel: 'intelligence' },
    { label: 'MEDIA', panel: 'media' },
    { label: 'EVENTS', panel: 'events' },
    { label: 'HELP', panel: 'help' },
  ];

  const handleNavClick = (panel: PanelType) => {
    if (state.activePanel === panel) {
      dispatch({ type: 'SET_PANEL', panel: null });
    } else {
      dispatch({ type: 'SET_PANEL', panel: panel });
    }
  };

  const goHome = () => {
    try {
      const raw = localStorage.getItem('jarvis.commandOrb.v2');
      const stored = raw ? JSON.parse(raw) : {};
      localStorage.setItem('jarvis.commandOrb.v2', JSON.stringify({ ...stored, palette: 'orange' }));
    } catch {}
    window.location.href = './';
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 30,
          height: '48px',
          background: 'linear-gradient(180deg, rgba(7,9,13,0.9) 0%, rgba(7,9,13,0.4) 100%)',
          borderBottom: `1px solid ${theme.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
        }}
      >
        {/* Left Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(true)}
              style={{ background: 'none', border: 'none', color: theme.primary, cursor: 'pointer' }}
            >
              <Menu size={20} />
            </button>
          )}
          <button
            type="button"
            onClick={goHome}
            title="Quay lại J-Core Console"
            style={{
              fontWeight: '700',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
              letterSpacing: '0.08em',
              color: '#ff3b56',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 59, 86, 0.12)',
              border: '1px solid rgba(255, 59, 86, 0.4)',
              borderRadius: '6px',
              cursor: 'pointer',
              padding: '4px 10px',
              textTransform: 'uppercase',
              transition: 'all 0.2s ease',
            }}
          >
            <span>← QUAY LẠI J-CORE</span>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: theme.accent, boxShadow: `0 0 6px ${theme.accent}` }} />
          </button>
        </div>

        {/* Center Nav Items */}
        {!isMobile && (
          <div style={{ display: 'flex', height: '100%' }}>
            {navItems.map((item) => {
              const isActive = state.activePanel === item.panel;
              return (
                <button
                  key={item.panel}
                  onClick={() => handleNavClick(item.panel)}
                  style={{
                    background: 'none',
                    border: 'none',
                    borderBottom: isActive ? `2px solid ${theme.accent}` : '2px solid transparent',
                    color: isActive ? '#fff' : theme.muted,
                    textShadow: isActive ? `0 0 8px ${theme.accent}` : 'none',
                    cursor: 'pointer',
                    padding: '0 16px',
                    fontFamily: 'Space Grotesk',
                    fontSize: '11px',
                    letterSpacing: '0.15em',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    transition: 'all 0.2s',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = theme.muted; }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SOUND' })} style={{ background: 'none', border: 'none', color: theme.muted, cursor: 'pointer' }}>{state.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}</button>
          <button style={{ background: 'none', border: 'none', color: theme.muted, cursor: 'pointer' }}>
            <Bell size={18} />
          </button>
        </div>
      </div>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};
