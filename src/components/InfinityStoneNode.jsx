import { useStone } from '../utils/stoneState.js';
import { STONE_META, STONE_COLORS, STONE_STATES } from '../types/stones.js';

const STATUS_LABELS = {
  [STONE_STATES.DORMANT]: 'Dormant',
  [STONE_STATES.READING]: 'Reading',
  [STONE_STATES.WORKING]: 'Working',
  [STONE_STATES.EXTERNAL_CALL]: 'Calling',
  [STONE_STATES.COMPLETED]: 'Done',
  [STONE_STATES.WARNING]: 'Warning',
  [STONE_STATES.ERROR]: 'Error',
  [STONE_STATES.APPROVAL]: 'Approve?',
};

export default function InfinityStoneNode({ stoneId, size = 52, onClick, showLabel = true }) {
  const { status } = useStone(stoneId);
  const meta = STONE_META[stoneId];
  const color = STONE_COLORS[stoneId];

  const statusLabel = STATUS_LABELS[status] || 'Unknown';
  const isDormant = status === STONE_STATES.DORMANT;

  return (
    <div
      className="flex flex-col items-center"
      onClick={() => onClick && onClick(stoneId)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick && onClick(stoneId)}
    >
      <div
        className={`stone-node stone-${stoneId} ${status}`}
        style={{ width: size, height: size }}
      >
        <span
          className="absolute inset-0 flex items-center justify-center text-lg select-none"
          style={{ fontSize: size * 0.38 }}
        >
          {meta.icon}
        </span>
        {!isDormant && (
          <span
            className="absolute -top-2 -right-3 rounded border bg-slate-950/90 px-1.5 py-0.5 font-mono text-[9px] uppercase"
            style={{ borderColor: color.border, color: color.primary }}
          >
            {statusLabel}
          </span>
        )}
      </div>

      {showLabel && (
        <div className="mt-2 flex flex-col items-center text-center">
          <span
            className="font-mono text-[11px] font-bold uppercase tracking-wider"
            style={{ color: color.primary }}
          >
            {meta.label}
          </span>
          <span className="font-mono text-[9px] text-cyan-100/50">
            {meta.domain}
          </span>
        </div>
      )}
    </div>
  );
}
