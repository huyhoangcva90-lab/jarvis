import JarvisCore from './JarvisCore.jsx';
import InfinityStoneNode from './InfinityStoneNode.jsx';
import Panel from './Panel.jsx';
import { ALL_STONES, STONE_META } from '../types/stones.js';
import { useAllStoneStatuses } from '../utils/stoneState.jsx';

export default function CommandCenter({ data, currentTime, onStoneClick, onOpenChat }) {
  const stoneStatuses = useAllStoneStatuses();

  const recentLogs = (data.logs || []).slice(-4).reverse();

  return (
    <div className="command-center">

      {/* LEFT COLUMN: Orbit Display */}
      <div className="flex flex-col items-center">
        <div className="orbit-container mx-auto mb-6">

          {/* Orbit Rings */}
          <div className="orbit-ring" />
          <div className="orbit-ring inner" />
          <div className="orbit-ring core" />

          {/* Jarvis Core at center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <JarvisCore />
          </div>

          {/* 6 Infinity Stones */}
          {ALL_STONES.map((stoneId) => {
            const angleDeg = STONE_META[stoneId].orbitAngle;
            const angleRad = (angleDeg - 90) * (Math.PI / 180);
            const radius = 42;
            const top = 50 + Math.sin(angleRad) * radius;
            const left = 50 + Math.cos(angleRad) * radius;

            return (
              <div
                key={stoneId}
                className="stone-orbit-slot"
                style={{
                  top: `${top}%`,
                  left: `${left}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <InfinityStoneNode stoneId={stoneId} onClick={onStoneClick} />
              </div>
            );
          })}
        </div>

        {/* Quick Info Row */}
        <div className="grid w-full max-w-[560px] grid-cols-3 gap-3">
          <div className="rounded border border-cyan-300/20 bg-slate-950/60 p-3 text-center">
            <p className="font-mono text-2xl text-cyanCore">0</p>
            <p className="font-mono text-[10px] uppercase text-cyan-100/50">Active Missions</p>
          </div>
          <div className="rounded border border-cyan-300/20 bg-slate-950/60 p-3 text-center">
            <p className="font-mono text-2xl text-greenCore">{currentTime}</p>
            <p className="font-mono text-[10px] uppercase text-cyan-100/50">System Time</p>
          </div>
          <div className="rounded border border-cyan-300/20 bg-slate-950/60 p-3 text-center">
            <p className="font-mono text-2xl text-amberCore">6</p>
            <p className="font-mono text-[10px] uppercase text-cyan-100/50">Infinity Stones</p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Status Sidebar */}
      <div className="flex flex-col gap-4">

        <button
          type="button"
          onClick={onOpenChat}
          className="hud-button primary w-full py-3 text-base"
        >
          💬 Chat with Jarvis
        </button>

        <Panel title="System Status" kicker="Node diagnostics">
          <div className="space-y-2">
            {stoneStatuses.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded border border-cyan-300/10 bg-slate-950/40 p-2.5">
                <div className="flex items-center gap-2 font-mono text-sm text-cyan-100/80">
                  <span>{STONE_META[s.id].icon}</span>
                  <span>{STONE_META[s.id].label}</span>
                </div>
                <span className="rounded border border-cyan-300/20 bg-cyan-300/5 px-2 py-0.5 font-mono text-[10px] uppercase text-cyan-100/60">
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Active Mission" kicker="Current focus">
          <div className="rounded border-l-2 border-amberCore bg-slate-950/40 p-3 font-mono text-sm text-cyan-100/70">
            {data.mainQuest || 'No active missions assigned.'}
          </div>
        </Panel>

        <Panel title="Recent Logs" kicker="System activity">
          <div className="space-y-2">
            {recentLogs.length > 0 ? recentLogs.map((log, index) => (
              <div key={`log-${index}`} className="rounded border border-cyan-300/10 bg-cyan-300/5 p-2 font-mono text-xs text-cyan-100/70">
                <span className="text-greenCore">&gt;</span> {log}
              </div>
            )) : (
              <p className="font-mono text-xs text-cyan-100/40">No logs available.</p>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
