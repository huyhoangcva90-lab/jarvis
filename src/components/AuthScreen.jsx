import React, { useState, useEffect } from 'react';
import { soundManager } from '../utils/soundManager.js';

export default function AuthScreen({ data, onUnlock }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const PIN_LENGTH = 4;
  const CORRECT_PIN = data?.auth?.pinCode || '1234';

  useEffect(() => {
    // Cập nhật trạng thái bật/tắt âm thanh trong soundManager
    soundManager.setEnabled(data?.soundEnabled !== false);
  }, [data]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (attempts >= 3) return;
      if (e.key >= '0' && e.key <= '9') {
        handleNumClick(e.key);
      } else if (e.key === 'Backspace') {
        handleBack();
      } else if (e.key === 'Escape' || e.key === 'Delete') {
        handleClear();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, attempts]);

  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      if (pin === CORRECT_PIN) {
        soundManager.play('success');
        onUnlock();
      } else {
        soundManager.play('warning');
        setError(true);
        setAttempts(a => a + 1);
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 500);
      }
    }
  }, [pin]);

  const handleNumClick = (num) => {
    if (pin.length < PIN_LENGTH && !error) {
      setPin(prev => prev + num);
    }
  };

  const handleBack = () => {
    if (!error) setPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (!error) setPin('');
  };

  if (attempts >= 3) {
    return (
      <div className="fixed inset-0 bg-void flex items-center justify-center z-50 text-dangerCore font-mono text-center p-6">
        <div>
          <div className="text-4xl mb-4">⚠️ SYSTEM LOCKED</div>
          <div className="text-sm opacity-80">Maximum attempts exceeded. Reboot required.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-void flex items-center justify-center z-50 overflow-hidden">
      {/* Cyberpunk grid bg */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-sm bg-panel border border-cyanCore/30 p-8 rounded-xl shadow-[0_0_50px_rgba(34,211,238,0.1)] flex flex-col items-center">
        
        {/* Logo */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-3 h-3 rounded-full bg-greenCore shadow-[0_0_10px_#4ade80] animate-pulse"></div>
          <h1 className="text-2xl font-mono text-white font-bold tracking-widest">JARVIS</h1>
        </div>
        <div className="text-[10px] text-cyanCore/70 font-mono tracking-[0.3em] uppercase mb-8">
          Infinity Core
        </div>

        {/* Subtitle */}
        <div className="text-gray-400 text-sm font-mono mb-4 text-center h-5">
          {error ? <span className="text-dangerCore">INVALID PIN</span> : 'ENTER SECURITY PIN'}
        </div>

        {/* Dots */}
        <div className={`flex gap-4 mb-8 ${error ? 'animate-bounce' : ''}`}>
          {[...Array(PIN_LENGTH)].map((_, i) => (
            <div 
              key={i} 
              className={`pin-dot w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                i < pin.length 
                  ? 'filled bg-cyanCore border-cyanCore shadow-[0_0_10px_rgba(34,211,238,0.8)]' 
                  : 'bg-transparent border-gray-600'
              }`}
            ></div>
          ))}
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleNumClick(num.toString())}
              className="aspect-square flex items-center justify-center text-xl font-mono text-white bg-white/5 hover:bg-cyanCore/20 border border-white/10 hover:border-cyanCore/50 rounded transition-all active:scale-95"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="aspect-square flex items-center justify-center text-sm font-mono text-gray-400 bg-white/5 hover:bg-dangerCore/20 border border-white/10 hover:border-dangerCore/50 rounded transition-all active:scale-95"
          >
            CLR
          </button>
          <button
            onClick={() => handleNumClick('0')}
            className="aspect-square flex items-center justify-center text-xl font-mono text-white bg-white/5 hover:bg-cyanCore/20 border border-white/10 hover:border-cyanCore/50 rounded transition-all active:scale-95"
          >
            0
          </button>
          <button
            onClick={handleBack}
            className="aspect-square flex items-center justify-center text-sm font-mono text-gray-400 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded transition-all active:scale-95"
          >
            DEL
          </button>
        </div>
      </div>
    </div>
  );
}
