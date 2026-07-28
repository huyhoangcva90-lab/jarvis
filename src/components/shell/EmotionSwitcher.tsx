import { useTesseract } from '../../tesseract/useTesseract';
import { emotions } from '../../tesseract/constants';
import type { AiEmotion } from '../../tesseract/tesseract';

export default function EmotionSwitcher() {
  const { emotion, setEmotion } = useTesseract();
  return (
    <section className="emotion-switcher" aria-label="AI emotional states">
      {Object.entries(emotions).map(([id, value]) => (
        <button
          key={id}
          className={emotion === id ? "is-active" : ""}
          style={{ "--state": value.color, "--state-rgb": value.rgb } as React.CSSProperties}
          onClick={() => setEmotion(id as AiEmotion)}
        >
          <i />
          <span>{value.label}</span>
        </button>
      ))}
    </section>
  );
}
