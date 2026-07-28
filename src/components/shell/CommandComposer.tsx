import { useTesseract } from '../../tesseract/useTesseract';

export default function CommandComposer() {
  const { setEmotion } = useTesseract();
  return (
    <section className="command-composer">
      <div>
        <span>Command</span>
        <input
          aria-label="Command input"
          placeholder="Nói với J-Core: lập plan, mở office, kiểm tra Hermes, gửi mission..."
          onFocus={() => setEmotion("listening")}
          onBlur={() => setEmotion("calm")}
        />
      </div>
      <button onClick={() => setEmotion("thinking")}>Plan</button>
      <button onClick={() => setEmotion("speaking")}>Speak</button>
      <button className="spider-command" onClick={() => setEmotion("spider")}>Spider</button>
    </section>
  );
}
