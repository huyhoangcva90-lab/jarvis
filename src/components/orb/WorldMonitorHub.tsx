import { FormEvent, useMemo, useRef, useState } from "react";
import worldMonitorShot from "../../../external/worldmonitor/docs/images/worldmonitor-7-mar-2026.jpg";

type Message = { id: string; role: "user" | "assistant"; text: string; at: number };

type WorldMonitorHubProps = {
  currentTime: string;
  username: string;
  messages: Message[];
  isSending: boolean;
  onAskAi: (prompt: string) => void;
  onExit: () => void;
};

const QUICK_PROMPTS = [
  "Tóm tắt 5 biến động thế giới quan trọng nhất lúc này.",
  "Phân tích các điểm nóng địa chính trị đang leo thang.",
  "Có rủi ro nào có thể ảnh hưởng tới Việt Nam hôm nay?",
  "Đối chiếu tin nóng với thị trường, năng lượng và chuỗi cung ứng.",
];

const WORLD_LAYERS = [
  ["CONFLICTS", "Live crisis, strikes, protests", "56"],
  ["MARKETS", "Finance radar, commodities, crypto", "07"],
  ["INFRA", "Ports, cables, nuclear, datacenters", "18"],
  ["CLIMATE", "Fires, quakes, weather anomaly", "09"],
  ["INTEL", "500+ feeds, AI briefs, local Ollama", "AI"],
];

function SparkIcon({ name }: { name: "ai" | "send" | "close" | "reload" }) {
  const paths = {
    ai: <><path d="M12 2l1.5 5.2L19 9l-5.5 1.8L12 16l-1.5-5.2L5 9l5.5-1.8L12 2Z"/><path d="m18 15 .8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15Z"/></>,
    send: <><path d="m21 3-7.5 18-3.2-7.3L3 10.5 21 3Z"/><path d="m10.3 13.7 4.8-4.8"/></>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    reload: <><path d="M20 6v5h-5"/><path d="M18.5 15a7 7 0 1 1-.7-7.8L20 11"/></>,
  } as const;
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

export default function WorldMonitorHub({ currentTime, username, messages, isSending, onAskAi, onExit }: WorldMonitorHubProps) {
  const [railOpen, setRailOpen] = useState(true);
  const [prompt, setPrompt] = useState("");
  const streamRef = useRef<HTMLDivElement>(null);
  const worldMessages = useMemo(() => messages.slice(-8), [messages]);

  const ask = (event: FormEvent) => {
    event.preventDefault();
    const value = prompt.trim();
    if (!value || isSending) return;
    onAskAi(`[WORLD MONITOR] ${value}`);
    setPrompt("");
    window.setTimeout(() => streamRef.current?.scrollTo({ top: streamRef.current.scrollHeight, behavior: "smooth" }), 120);
  };

  return (
    <section className={`world-monitor-shell world-native-shell ${railOpen ? "is-ai-open" : ""}`} aria-label="World Monitor native realm">
      <aside className="world-ai-rail" aria-label="AI phân tích thế giới">
        <header>
          <button className="world-ai-mark" type="button" onClick={() => setRailOpen((open) => !open)} aria-label={railOpen ? "Thu gọn AI" : "Mở AI"} aria-expanded={railOpen}>
            <SparkIcon name="ai" />
            <i />
          </button>
          <div><span>external/worldmonitor</span><b>World Monitor Native</b></div>
          <button className="world-icon-button" type="button" onClick={() => setRailOpen(false)} aria-label="Thu gọn thanh AI"><SparkIcon name="close" /></button>
        </header>

        <div className="world-ai-status"><i /><span>{isSending ? "ĐANG PHÂN TÍCH TÍN HIỆU" : "SOURCE CLONE ĐÃ NẠP"}</span><time>{currentTime}</time></div>

        <div className="world-ai-stream" ref={streamRef} aria-live="polite">
          {worldMessages.length === 0 ? (
            <article className="assistant"><small>WORLD MONITOR</small><p>Dashboard này đang chạy native trong J-Core, lấy nhận diện và kiến trúc từ repo đã clone: 500+ feeds, 56 layer map, finance radar, local AI.</p></article>
          ) : worldMessages.map((message) => (
            <article className={message.role} key={message.id}>
              <small>{message.role === "assistant" ? "J-CORE AI" : username.toUpperCase()}</small>
              <p>{message.text.replace(/^\[WORLD MONITOR\]\s*/, "")}</p>
            </article>
          ))}
          {isSending && <div className="world-ai-thinking"><i /><i /><i /><span>Đang tổng hợp qua Gateway</span></div>}
        </div>

        <div className="world-quick-grid">
          {QUICK_PROMPTS.map((item, index) => <button type="button" key={item} onClick={() => setPrompt(item)}><small>0{index + 1}</small>{item}</button>)}
        </div>

        <form onSubmit={ask}>
          <label htmlFor="world-ai-prompt">HỎI AI CỦA BẠN</label>
          <div>
            <textarea id="world-ai-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ví dụ: điều gì đang diễn ra ở Biển Đỏ?" onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }} />
            <button type="submit" disabled={!prompt.trim() || isSending} aria-label="Gửi câu hỏi"><SparkIcon name="send" /></button>
          </div>
        </form>

        <footer><span>NO IFRAME</span><b>NATIVE PORT</b></footer>
      </aside>

      {!railOpen && <button className="world-ai-restore" type="button" onClick={() => setRailOpen(true)} aria-label="Mở AI phân tích"><SparkIcon name="ai" /><span>ASK AI</span><i /></button>}

      <main className="world-monitor-stage world-native-stage">
        <section className="world-native-map">
          <img src={worldMonitorShot} alt="World Monitor dashboard captured from cloned repository" />
          <div className="world-native-map-overlay">
            <small>REAL SOURCE MIRROR</small>
            <h1>World Monitor</h1>
            <p>Real-time global intelligence dashboard — map, feeds, markets, infrastructure and AI briefs ported into J-Core without iframe.</p>
          </div>
        </section>

        <aside className="world-native-command">
          <header><span>WORLD://LAYERS</span><b>56 MAP TYPES</b></header>
          <div className="world-native-layer-grid">
            {WORLD_LAYERS.map(([label, detail, value]) => (
              <article key={label}><small>{value}</small><b>{label}</b><span>{detail}</span></article>
            ))}
          </div>
          <section className="world-native-brief">
            <h2>Repo DNA</h2>
            <p>Vanilla TypeScript + Vite, globe.gl, deck.gl, MapLibre, Tauri desktop, local Ollama/Groq/OpenRouter AI, six variants from one codebase.</p>
          </section>
        </aside>

        <nav className="world-floating-controls" aria-label="Điều khiển World Monitor">
          <button type="button" aria-label="Source loaded"><SparkIcon name="reload" /></button>
          <button type="button" onClick={onExit} aria-label="Trở về J-Core"><span>J</span><b>J-CORE</b></button>
        </nav>
      </main>
    </section>
  );
}
