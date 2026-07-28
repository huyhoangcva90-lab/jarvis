import React from 'react';

export default function JarvisCore() {
  return (
    <div className="flex flex-col items-center justify-center animate-floatY pointer-events-none">
      <div className="relative flex items-center justify-center rounded-full border-2 border-cyanCore/30 bg-void/80 shadow-[0_0_30px_rgba(34,211,238,0.2)] md:w-[280px] md:h-[280px] w-[200px] h-[200px] overflow-hidden">
        {/* Radar concentric circles */}
        <div className="absolute inset-0 rounded-full border border-cyanCore/20 m-4"></div>
        <div className="absolute inset-0 rounded-full border border-cyanCore/10 m-12"></div>
        <div className="absolute inset-0 rounded-full border border-cyanCore/5 m-20"></div>
        
        {/* Radar crosshairs */}
        <div className="absolute w-full h-[1px] bg-cyanCore/20"></div>
        <div className="absolute h-full w-[1px] bg-cyanCore/20"></div>
        
        {/* Sweep line */}
        <div className="absolute inset-0 origin-center animate-[spin_4s_linear_infinite] rounded-full">
          <div className="w-1/2 h-1/2 bg-gradient-to-br from-cyanCore/40 to-transparent origin-bottom-right rounded-tl-full border-l border-t border-cyanCore/50"></div>
        </div>
        
        {/* Core text */}
        <div className="core-text z-10 flex flex-col items-center">
          <div className="text-3xl md:text-5xl font-bold text-cyanCore font-mono tracking-widest drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
            JARVIS
          </div>
          <div className="text-[10px] md:text-xs text-cyanCore/70 font-mono tracking-[0.3em] mt-1">
            HERMES CORE
          </div>
        </div>
      </div>
      
      <div className="core-status mt-4 text-xs font-mono text-cyanCore/80 tracking-widest animate-pulse">
        [ ORCHESTRATOR ONLINE ]
      </div>
    </div>
  );
}
