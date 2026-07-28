import { useTesseract } from '../../tesseract/useTesseract';
import { emotions } from '../../tesseract/constants';
import LivingOrb3D from '../../jcore/LivingOrb3D';

export default function LivingOrbCard() {
  const { emotion } = useTesseract();
  const state = emotions[emotion];

  return (
    <section
      className={`living-orb-card emotion-${emotion}`}
      style={{ "--emotion": state.color, "--emotion-rgb": state.rgb } as React.CSSProperties}
      aria-label={`J-Core emotional state: ${state.label}`}
    >
      <div className="orb-meta">
        <span>Living Intelligence</span>
        <b>{state.label}</b>
      </div>
      <LivingOrb3D emotion={emotion} state={state} />
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
