import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../../config/theme';
import { brand } from '../../config/brand';
import { HUDButton } from '../ui/HUDButton';

interface IntroScreenProps {
  onComplete: () => void;
}

type Phase = 'boot' | 'init' | 'welcome';

export const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<Phase>('boot');
  const [initStep, setInitStep] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onComplete();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onComplete]);

  useEffect(() => {
    if (phase === 'boot') {
      const timer = setTimeout(() => setPhase('init'), 1500);
      return () => clearTimeout(timer);
    } else if (phase === 'init') {
      const timer1 = setTimeout(() => setInitStep(1), 500);
      const timer2 = setTimeout(() => setInitStep(2), 1000);
      const timer3 = setTimeout(() => setInitStep(3), 1500);
      const timer4 = setTimeout(() => setPhase('welcome'), 2000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }
  }, [phase]);

  const initMessages = [
    'CONNECTING TO SATELLITE NETWORK...',
    'LOADING INTELLIGENCE DATABASE...',
    'CALIBRATING MAP SYSTEMS...'
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, background: '#07090D',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.05,
        backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .3) 25%, rgba(255, 255, 255, .3) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .3) 75%, rgba(255, 255, 255, .3) 76%, transparent 77%, transparent)',
        backgroundSize: '100% 4px'
      }} />

      <button onClick={onComplete} style={{
        position: 'absolute', top: 20, right: 20, background: 'transparent', border: 'none',
        color: 'rgba(255,255,255,0.3)', fontFamily: 'Space Grotesk', fontSize: '10px',
        letterSpacing: '0.1em', cursor: 'pointer'
      }}>SKIP ESC</button>

      <AnimatePresence mode="wait">
        {phase === 'boot' && (
          <motion.div
            key="boot"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center' }}
          >
            <h1 style={{
              fontFamily: 'Oswald, sans-serif', fontSize: '48px', color: '#fff',
              letterSpacing: '0.2em', textShadow: `0 0 20px ${theme.accent}50`,
              margin: 0
            }}>
              {brand?.name || 'NEXUS TRACKER'}
            </h1>
          </motion.div>
        )}

        {phase === 'init' && (
          <motion.div
            key="init"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ width: '300px', textAlign: 'center', fontFamily: 'Space Grotesk' }}
          >
            <h2 style={{ fontSize: '14px', color: theme.accent, letterSpacing: '0.1em', marginBottom: '20px' }}>
              {brand?.initMessage || 'INITIALIZING TRACKER...'}
            </h2>
            <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.1)', marginBottom: '20px' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5, ease: 'linear' }}
                style={{ height: '100%', background: theme.accent, boxShadow: `0 0 10px ${theme.accent}` }}
              />
            </div>
            <div style={{ textAlign: 'left', fontSize: '10px', color: 'rgba(255,255,255,0.5)', height: '60px' }}>
              {initMessages.map((msg, idx) => (
                <motion.div key={idx} initial={{ opacity: 0 }} animate={{ opacity: initStep > idx ? 1 : 0 }} style={{ marginBottom: '4px' }}>
                  &gt; {msg}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', maxWidth: '600px' }}
          >
            <h1 style={{ fontFamily: 'Oswald, sans-serif', fontSize: '56px', margin: '0 0 16px 0', color: '#fff', textShadow: `0 0 20px ${theme.accent}50` }}>
              {brand?.welcomeTitle || 'NEXUS INTEL SYSTEM'}
            </h1>
            <p style={{ fontFamily: 'Space Grotesk', fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '40px', lineHeight: 1.6 }}>
              {brand?.welcomeMessage || 'Accessing highly classified intelligence. Viewer discretion is advised.'}
            </p>
            <HUDButton variant="primary" size="lg" onClick={onComplete}>
              START TRACKING
            </HUDButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
