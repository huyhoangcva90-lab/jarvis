import { useState } from 'react';
import { useTesseract } from '../../tesseract/useTesseract';
import { emotions } from '../../tesseract/constants';
import LivingOrb3D from '../../jcore/LivingOrb3D';
import RealmViewer from '../../tesseract/RealmViewer';

export default function LivingOrbCard() {
  const { emotion, activeModuleId } = useTesseract();
  const [viewMode, setViewMode] = useState<'realm' | 'orb'>('realm');
  const state = emotions[emotion];

  return (
    <section
      className={`living-orb-card emotion-${emotion}`}
      style={{ "--emotion": state.color, "--emotion-rgb": state.rgb } as React.CSSProperties}
      aria-label={`J-Core emotional state: ${state.label}`}
    >
      <div className="orb-meta">
        <div>
          <span>Living Intelligence</span>
          <b>{state.label}</b>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setViewMode('realm')}
            style={{
              background: viewMode === 'realm' ? 'rgba(var(--emotion-rgb), 0.25)' : 'transparent',
              border: '1px solid var(--line)',
              color: viewMode === 'realm' ? 'var(--text)' : 'var(--muted)',
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '4px',
              fontFamily: 'IBM Plex Mono, monospace',
              cursor: 'pointer',
              textTransform: 'uppercase'
            }}
          >
            🔷 3D Tesseract Realm
          </button>
          <button
            onClick={() => setViewMode('orb')}
            style={{
              background: viewMode === 'orb' ? 'rgba(var(--emotion-rgb), 0.25)' : 'transparent',
              border: '1px solid var(--line)',
              color: viewMode === 'orb' ? 'var(--text)' : 'var(--muted)',
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '4px',
              fontFamily: 'IBM Plex Mono, monospace',
              cursor: 'pointer',
              textTransform: 'uppercase'
            }}
          >
            🔮 Orb Core
          </button>
        </div>
      </div>

      {viewMode === 'realm' ? (
        <div style={{ width: '100%', height: '100%', minHeight: '280px', position: 'relative', zIndex: 1 }}>
          <RealmViewer moduleId={activeModuleId} emotion={emotion} />
        </div>
      ) : (
        <LivingOrb3D emotion={emotion} state={state} />
      )}

      <div className="orb-state-readout">
        <p>{state.description}</p>
        <div>
          <span>Tempo</span>
          <b>{state.tempo}</b>
        </div>
      </div>
    </section>
  );
}
