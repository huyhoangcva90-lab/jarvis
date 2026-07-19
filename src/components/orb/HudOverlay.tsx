import { FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import type { AiActivity } from "../../App";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  at: number;
};

type Palette = "gold" | "blue" | "green" | "red";
type IconName = "chat" | "settings" | "reset" | "external" | "copy" | "trash" | "close" | "mic" | "send";

const STORAGE_KEY = "jarvis.commandOrb.v2";

const paletteLabels: Record<Palette, string> = {
  gold: "Gold",
  blue: "Blue",
  green: "Green",
  red: "Red"
};

const activityLabels: Record<AiActivity, string> = {
  idle: "Sẵn sàng",
  listening: "Đang lắng nghe",
  thinking: "Đang xử lý",
  speaking: "Đang phản hồi"
};

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    chat: <><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" /><path d="M8 9h8M8 13h5" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9.6v-.09A1.7 1.7 0 0 0 8.5 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3V9.6h.09A1.7 1.7 0 0 0 4.6 8.5a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.09A1.7 1.7 0 0 0 15.5 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.16.37.37.72.6 1 .3.3.69.44 1.1.4h.1v4h-.1A1.7 1.7 0 0 0 19.4 15Z" /></>,
    reset: <><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v6h6" /><path d="M12 8v4l3 2" /></>,
    external: <><path d="M14 3h7v7M10 14 21 3" /><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" /></>,
    copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>,
    trash: <><path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createReply(input: string) {
  const text = input.toLowerCase();
  if (text.includes("mệt") || text.includes("tired")) {
    return "T nghe thấy năng lượng của bạn đang thấp. Hãy uống nước, chọn một việc nhỏ nhất và làm trong 12 phút trước.";
  }
  if (text.includes("plan") || text.includes("kế hoạch") || text.includes("ngày")) {
    return "Kế hoạch gọn: một nhiệm vụ chính, hai nhiệm vụ phụ và một khoảng nghỉ cố định. T có thể chuyển nó thành prompt để bạn gửi sang ChatGPT.";
  }
  if (text.includes("debug") || text.includes("lỗi")) {
    return "Chế độ debug: gửi mô tả lỗi, bước tái hiện, log cuối cùng và kết quả mong đợi. T sẽ giúp bạn đóng khung vấn đề.";
  }
  if (text.includes("chatgpt")) {
    return "T có thể mở ChatGPT Web. Bản này chưa có API thật nên phần phản hồi hiện vẫn chạy cục bộ trên trình duyệt.";
  }
  return "Đã nhận lệnh. T đang lưu lịch sử, nhận giọng nói, đọc phản hồi và điều khiển trạng thái lõi AI ngay trên thiết bị này.";
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as { messages?: Message[]; palette?: Palette; voiceReply?: boolean; handsFree?: boolean };
  } catch {
    return null;
  }
}

type HudOverlayProps = {
  onActivityChange: (activity: AiActivity) => void;
  onResetView: () => void;
};

export default function HudOverlay({ onActivityChange, onResetView }: HudOverlayProps) {
  const initial = useMemo(() => (typeof window === "undefined" ? null : loadState()), []);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(
    () => initial?.messages?.length ? initial.messages : [{ id: createId(), role: "assistant", text: "Kết nối đã sẵn sàng. Bạn có thể chat hoặc nói trực tiếp với t.", at: Date.now() }]
  );
  const [palette, setPalette] = useState<Palette>(initial?.palette ?? "gold");
  const [voiceReply, setVoiceReply] = useState(initial?.voiceReply ?? true);
  const [handsFree, setHandsFree] = useState(initial?.handsFree ?? true);
  const [voiceMode, setVoiceMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(() => typeof window !== "undefined" && window.innerWidth > 760);
  const [listening, setListening] = useState(false);
  const [activity, setActivity] = useState<AiActivity>("idle");
  const [toast, setToast] = useState("");
  const recognitionRef = useRef<any>(null);
  const voiceModeRef = useRef(false);
  const recognitionActiveRef = useRef(false);
  const manualStopRef = useRef(false);
  const resultHandledRef = useRef(false);
  const thinkingTimer = useRef<number | null>(null);
  const idleTimer = useRef<number | null>(null);
  const restartTimer = useRef<number | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.dataset.palette = palette;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, palette, voiceReply, handsFree }));
  }, [handsFree, messages, palette, voiceReply]);

  useEffect(() => onActivityChange(activity), [activity, onActivityChange]);
  useEffect(() => { voiceModeRef.current = voiceMode; }, [voiceMode]);
  useEffect(() => { messageEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);
  useEffect(() => () => {
    if (thinkingTimer.current) window.clearTimeout(thinkingTimer.current);
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    if (restartTimer.current) window.clearTimeout(restartTimer.current);
    recognitionRef.current?.abort?.();
    window.speechSynthesis?.cancel();
  }, []);

  const scheduleVoiceRestart = (delay = 520) => {
    if (!voiceModeRef.current || !handsFree) return;
    if (restartTimer.current) window.clearTimeout(restartTimer.current);
    restartTimer.current = window.setTimeout(() => startRecognition(), delay);
  };

  const speak = (text: string) => {
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    setActivity("speaking");
    const startedAt = Date.now();
    const minimumSpeakingMs = Math.min(5600, Math.max(2400, text.length * 42));
    const finishSpeaking = () => {
      const remaining = Math.max(300, minimumSpeakingMs - (Date.now() - startedAt));
      idleTimer.current = window.setTimeout(() => { setActivity("idle"); scheduleVoiceRestart(); }, remaining);
    };
    if (!voiceReply || !("speechSynthesis" in window)) {
      finishSpeaking();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "vi-VN";
    utterance.rate = 1;
    utterance.pitch = 0.92;
    utterance.onend = finishSpeaking;
    utterance.onerror = finishSpeaking;
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = (value = input) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setMessages((current) => [...current, { id: createId(), role: "user" as const, text: trimmed, at: Date.now() }].slice(-80));
    setInput("");
    setHistoryOpen(true);
    setActivity("thinking");
    if (thinkingTimer.current) window.clearTimeout(thinkingTimer.current);
    thinkingTimer.current = window.setTimeout(() => {
      const reply = { id: createId(), role: "assistant" as const, text: createReply(trimmed), at: Date.now() + 1 };
      setMessages((current) => [...current, reply].slice(-80));
      speak(reply.text);
    }, 980);
  };

  const submit = (event: FormEvent) => { event.preventDefault(); sendMessage(); };

  function startRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { setToast("Trình duyệt này chưa hỗ trợ nhận giọng nói."); return; }
    if (recognitionActiveRef.current || activity === "thinking" || activity === "speaking") return;
    manualStopRef.current = false;
    resultHandledRef.current = false;
    const recognition = new SpeechRecognition();
    recognition.lang = "vi-VN";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onstart = () => { recognitionActiveRef.current = true; setListening(true); setActivity("listening"); };
    recognition.onend = () => {
      recognitionActiveRef.current = false;
      setListening(false);
      if (manualStopRef.current) { setActivity("idle"); return; }
      if (!resultHandledRef.current) { setActivity((current) => current === "listening" ? "idle" : current); scheduleVoiceRestart(700); }
    };
    recognition.onerror = () => { recognitionActiveRef.current = false; setListening(false); setActivity("idle"); setToast("Không thể truy cập microphone."); };
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      resultHandledRef.current = true;
      setInput(transcript);
      if (transcript) sendMessage(transcript);
    };
    recognitionRef.current = recognition;
    try { recognition.start(); } catch { recognitionActiveRef.current = false; }
  }

  const stopVoice = () => {
    manualStopRef.current = true;
    if (restartTimer.current) window.clearTimeout(restartTimer.current);
    recognitionRef.current?.stop?.();
    setVoiceMode(false);
    setListening(false);
    setActivity("idle");
  };

  const toggleVoiceMode = () => {
    if (voiceModeRef.current || listening) { stopVoice(); return; }
    setVoiceMode(true);
    voiceModeRef.current = true;
    setToast("Voice mode đã bật. T sẽ tự nghe lại sau mỗi câu.");
    startRecognition();
  };

  const copyContext = async () => {
    await navigator.clipboard.writeText(messages.map((message) => `${message.role === "user" ? "User" : "J-Core"}: ${message.text}`).join("\n"));
    setToast("Đã copy lịch sử chat.");
  };

  const clearChat = () => {
    window.speechSynthesis?.cancel();
    setActivity("idle");
    setMessages([{ id: createId(), role: "assistant", text: "Lịch sử đã được xóa. Kết nối vẫn hoạt động.", at: Date.now() }]);
  };

  const toggleHistory = () => {
    setHistoryOpen((current) => {
      const next = !current;
      if (next) setSettingsOpen(false);
      return next;
    });
  };

  const toggleSettings = () => {
    setSettingsOpen((current) => {
      const next = !current;
      if (next) setHistoryOpen(false);
      return next;
    });
  };

  return (
    <div className="hud-overlay" aria-label="J-Core AI interface">
      <nav className="hud-dock" aria-label="Điều khiển giao diện">
        <button className={historyOpen ? "active" : ""} type="button" aria-label="Mở lịch sử chat" onClick={toggleHistory}><Icon name="chat" /></button>
        <button className={settingsOpen ? "active" : ""} type="button" aria-label="Mở cài đặt" onClick={toggleSettings}><Icon name="settings" /></button>
        <button type="button" aria-label="Reset góc nhìn" onClick={onResetView}><Icon name="reset" /></button>
      </nav>

      {historyOpen && (
        <aside className="history-panel" aria-label="Lịch sử chat">
          <div className="panel-head">
            <div><i className={`status-dot ${activity}`} /><span>ĐỐI THOẠI</span></div>
            <div className="panel-actions">
              <button type="button" aria-label="Copy lịch sử" onClick={copyContext}><Icon name="copy" /></button>
              <button type="button" aria-label="Xóa lịch sử" onClick={clearChat}><Icon name="trash" /></button>
              <button type="button" aria-label="Đóng lịch sử" onClick={() => setHistoryOpen(false)}><Icon name="close" /></button>
            </div>
          </div>
          <div className="message-list">
            {messages.map((message) => (
              <article className={`message ${message.role}`} key={message.id}>
                <b>{message.role === "user" ? "BẠN" : "J-CORE"}</b>
                <p>{message.text}</p>
              </article>
            ))}
            <div ref={messageEndRef} />
          </div>
        </aside>
      )}

      {settingsOpen && (
        <aside className="settings-panel" aria-label="Cài đặt">
          <div className="settings-hero">
            <div><span>HỆ THỐNG</span><b>{voiceMode ? "VOICE ACTIVE" : "LOCAL MODE"}</b></div>
            <button type="button" aria-label="Đóng cài đặt" onClick={() => setSettingsOpen(false)}><Icon name="close" /></button>
          </div>
          <section className="settings-block">
            <div className="settings-block-head"><span>Voice link</span><button className={voiceMode ? "danger" : "primary"} type="button" onClick={toggleVoiceMode}>{voiceMode ? "Tắt" : "Bật"}</button></div>
            <label className="toggle-row"><span>Tự nghe tiếp</span><input checked={handsFree} type="checkbox" onChange={(event) => setHandsFree(event.target.checked)} /></label>
            <label className="toggle-row"><span>Đọc phản hồi</span><input checked={voiceReply} type="checkbox" onChange={(event) => setVoiceReply(event.target.checked)} /></label>
          </section>
          <section className="settings-block">
            <div className="settings-block-head"><span>Màu năng lượng</span></div>
            <div className="palette-grid">
              {(Object.keys(paletteLabels) as Palette[]).map((key) => <button className={palette === key ? "active" : ""} key={key} type="button" onClick={() => setPalette(key)}><i />{paletteLabels[key]}</button>)}
            </div>
          </section>
          <section className="settings-actions">
            <button type="button" onClick={() => window.open("https://chatgpt.com/", "_blank", "noopener,noreferrer")}><Icon name="external" /><span>Mở ChatGPT Web</span></button>
            <button type="button" onClick={copyContext}><Icon name="copy" /><span>Copy ngữ cảnh</span></button>
            <button className="danger-text" type="button" onClick={clearChat}><Icon name="trash" /><span>Xóa lịch sử</span></button>
          </section>
        </aside>
      )}

      <section className="hud-bottom">
        <div className={`ai-state-readout ${activity}`}>
          <i className={`status-dot ${activity}`} />
          <span>{activityLabels[activity]}</span>
          <div className="voice-wave" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} style={{ animationDelay: `${index * 48}ms` }} />)}</div>
        </div>
        <form className="prompt-shell" onSubmit={submit}>
          <button className={voiceMode || listening ? "listening" : ""} type="button" aria-label="Bật chế độ giọng nói" onClick={toggleVoiceMode}><Icon name="mic" /></button>
          <label className="sr-only" htmlFor="jcore-command">Nhập tin nhắn</label>
          <input id="jcore-command" placeholder="Nói hoặc nhập lệnh..." value={input} onChange={(event) => setInput(event.target.value)} />
          <button type="submit" aria-label="Gửi tin nhắn"><Icon name="send" /></button>
        </form>
        <p aria-live="polite">{toast}</p>
      </section>
    </div>
  );
}
