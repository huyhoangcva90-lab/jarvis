import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { AiActivity } from "../../App";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  at: number;
};

type Palette = "gold" | "blue" | "green" | "red";

const STORAGE_KEY = "jarvis.commandOrb.v2";

const paletteLabels: Record<Palette, string> = {
  gold: "Gold",
  blue: "Blue",
  green: "Green",
  red: "Red"
};

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createReply(input: string) {
  const text = input.toLowerCase();
  if (text.includes("mệt") || text.includes("tired")) {
    return "T nghe thấy trạng thái năng lượng thấp. Gợi ý nhanh: uống nước, hạ mục tiêu xuống 1 việc nhỏ nhất, làm 12 phút rồi quay lại báo t.";
  }
  if (text.includes("plan") || text.includes("kế hoạch") || text.includes("ngày")) {
    return "Kế hoạch tối giản: chọn 1 nhiệm vụ chính, 2 nhiệm vụ phụ, 1 khoảng nghỉ cố định. Nếu muốn, t có thể biến nó thành prompt đem sang ChatGPT.";
  }
  if (text.includes("debug") || text.includes("lỗi")) {
    return "Debug mode: mô tả lỗi, bước tái hiện, log cuối cùng, kỳ vọng đúng. T sẽ giúp m đóng khung vấn đề trước khi mở ChatGPT.";
  }
  if (text.includes("chatgpt")) {
    return "T có thể mở ChatGPT Web cho m. Hiện bản này chưa gắn API thật nên đoạn trả lời này là local assistant.";
  }
  return "Đã nhận lệnh. Hiện t đang chạy local: lưu lịch sử, nhận giọng nói, đọc phản hồi, copy context và mở công cụ. Khi m đưa API key, t có thể nâng lên trả lời AI thật.";
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as { messages?: Message[]; palette?: Palette; voiceReply?: boolean; handsFree?: boolean; apiKey?: string };
  } catch {
    return null;
  }
}

type HudOverlayProps = {
  onActivityChange: (activity: AiActivity) => void;
};

export default function HudOverlay({ onActivityChange }: HudOverlayProps) {
  const initial = useMemo(() => (typeof window === "undefined" ? null : loadState()), []);
  const [time, setTime] = useState(() => new Date());
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(
    () =>
      initial?.messages?.length
        ? initial.messages
        : [
            {
              id: createId(),
              role: "assistant",
              text: "System active. T có thể chat, nghe voice, đọc phản hồi và lưu lịch sử trên máy này.",
              at: Date.now()
            }
          ]
  );
  const [palette, setPalette] = useState<Palette>(initial?.palette ?? "gold");
  const [voiceReply, setVoiceReply] = useState(initial?.voiceReply ?? true);
  const [handsFree, setHandsFree] = useState(initial?.handsFree ?? true);
  const [voiceMode, setVoiceMode] = useState(false);
  const [apiKey, setApiKey] = useState(initial?.apiKey ?? "");
  const [settingsOpen, setSettingsOpen] = useState(false);
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

  useEffect(() => {
    const timer = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    document.body.dataset.palette = palette;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, palette, voiceReply, handsFree, apiKey }));
  }, [apiKey, handsFree, messages, palette, voiceReply]);

  useEffect(() => {
    onActivityChange(activity);
  }, [activity, onActivityChange]);

  useEffect(() => {
    voiceModeRef.current = voiceMode;
  }, [voiceMode]);

  useEffect(() => {
    return () => {
      if (thinkingTimer.current) window.clearTimeout(thinkingTimer.current);
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      if (restartTimer.current) window.clearTimeout(restartTimer.current);
      recognitionRef.current?.abort?.();
      window.speechSynthesis?.cancel();
    };
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const scheduleVoiceRestart = (delay = 520) => {
    if (!voiceModeRef.current || !handsFree) return;
    if (restartTimer.current) window.clearTimeout(restartTimer.current);
    restartTimer.current = window.setTimeout(() => {
      startRecognition();
    }, delay);
  };

  const speak = (text: string) => {
    setActivity("speaking");
    if (!voiceReply || !("speechSynthesis" in window)) {
      idleTimer.current = window.setTimeout(() => {
        setActivity("idle");
        scheduleVoiceRestart();
      }, 900);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "vi-VN";
    utterance.rate = 1;
    utterance.pitch = 0.92;
    utterance.onstart = () => setActivity("speaking");
    utterance.onend = () => {
      idleTimer.current = window.setTimeout(() => {
        setActivity("idle");
        scheduleVoiceRestart();
      }, 350);
    };
    utterance.onerror = () => {
      setActivity("idle");
      scheduleVoiceRestart();
    };
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = (value = input) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const userMessage: Message = { id: createId(), role: "user", text: trimmed, at: Date.now() };
    setMessages((current) => [...current, userMessage].slice(-80));
    setInput("");
    setActivity("thinking");
    if (thinkingTimer.current) window.clearTimeout(thinkingTimer.current);
    thinkingTimer.current = window.setTimeout(() => {
      const reply: Message = { id: createId(), role: "assistant", text: createReply(trimmed), at: Date.now() + 1 };
      setMessages((current) => [...current, reply].slice(-80));
      speak(reply.text);
    }, 980);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    sendMessage();
  };

  function startRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setToast("Browser does not support speech recognition.");
      return;
    }
    if (recognitionActiveRef.current || activity === "thinking" || activity === "speaking") {
      return;
    }
    manualStopRef.current = false;
    resultHandledRef.current = false;
    const recognition = new SpeechRecognition();
    recognition.lang = "vi-VN";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onstart = () => {
      recognitionActiveRef.current = true;
      setListening(true);
      setActivity("listening");
    };
    recognition.onend = () => {
      recognitionActiveRef.current = false;
      setListening(false);
      if (manualStopRef.current) {
        setActivity("idle");
        return;
      }
      if (!resultHandledRef.current) {
        setActivity((current) => (current === "listening" ? "idle" : current));
        scheduleVoiceRestart(700);
      }
    };
    recognition.onerror = () => {
      recognitionActiveRef.current = false;
      setListening(false);
      if (!manualStopRef.current) {
        setActivity("idle");
        setToast("Voice capture blocked or unavailable.");
      }
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      resultHandledRef.current = true;
      setInput(transcript);
      if (transcript) sendMessage(transcript);
    };
    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      recognitionActiveRef.current = false;
    }
  }

  const stopVoice = () => {
    manualStopRef.current = true;
    if (restartTimer.current) window.clearTimeout(restartTimer.current);
    recognitionRef.current?.stop?.();
    setVoiceMode(false);
    setListening(false);
    setActivity("idle");
    setToast("Voice mode offline.");
  };

  const toggleVoiceMode = () => {
    if (voiceModeRef.current || listening) {
      stopVoice();
      return;
    }
    setVoiceMode(true);
    voiceModeRef.current = true;
    setToast("Voice mode armed. Nói tự nhiên, Jarvis sẽ nghe tiếp sau mỗi câu.");
    startRecognition();
  };

  const copyContext = async () => {
    const text = messages.map((message) => `${message.role === "user" ? "User" : "Jarvis"}: ${message.text}`).join("\n");
    await navigator.clipboard.writeText(text);
    setToast("Chat context copied.");
  };

  const clearChat = () => {
    window.speechSynthesis?.cancel();
    setActivity("idle");
    setMessages([
      {
        id: createId(),
        role: "assistant",
        text: "History cleared. Reactor link vẫn online.",
        at: Date.now()
      }
    ]);
  };

  const openChatGpt = () => {
    window.open("https://chatgpt.com/", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="hud-overlay" aria-label="Jarvis command orb interface">
      <header className="hud-top">
        <div className="hud-chip">
          <span>AI REACTOR</span>
          <b>{activity === "idle" ? "ONLINE" : activity.toUpperCase()}</b>
        </div>
        <div className="hud-time">
          <span>{time.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "2-digit" })}</span>
          <b>{time.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</b>
        </div>
        <div className="hud-chip right">
          <span>MODE</span>
          <b>{apiKey ? "API READY" : "LOCAL"}</b>
        </div>
      </header>

      <nav className="left-rail" aria-label="Jarvis controls">
        <button type="button" onClick={openChatGpt} title="Open ChatGPT">
          GPT
        </button>
        <button type="button" onClick={copyContext} title="Copy chat context">
          CPY
        </button>
        <button type="button" onClick={clearChat} title="Clear chat history">
          CLR
        </button>
        <button type="button" onClick={() => setSettingsOpen((value) => !value)} title="Settings">
          SET
        </button>
      </nav>

      <aside className="history-panel" aria-label="Chat history">
        <div className="panel-head">
          <span>CHAT HISTORY</span>
          <b>{messages.length}</b>
        </div>
        <div className="message-list">
          {messages.map((message) => (
            <article className={`message ${message.role}`} key={message.id}>
              <b>{message.role === "user" ? "YOU" : "JARVIS"}</b>
              <p>{message.text}</p>
            </article>
          ))}
        </div>
      </aside>

      {settingsOpen && (
        <aside className="settings-panel" aria-label="Settings">
          <div className="settings-hero">
            <span>CONTROL MATRIX</span>
            <b>{voiceMode ? "VOICE LINK ACTIVE" : "STANDBY CONFIG"}</b>
            <button type="button" onClick={() => setSettingsOpen(false)}>
              CLOSE
            </button>
          </div>
          <div className="settings-status-grid">
            <div>
              <span>INPUT</span>
              <b>{listening ? "LISTENING" : voiceMode ? "ARMED" : "MANUAL"}</b>
            </div>
            <div>
              <span>VOICE</span>
              <b>{voiceReply ? "REPLY ON" : "TEXT ONLY"}</b>
            </div>
          </div>
          <section className="settings-block">
            <div className="settings-block-head">
              <span>Voice Link</span>
              <button className={voiceMode ? "danger" : "primary"} type="button" onClick={toggleVoiceMode}>
                {voiceMode ? "DISARM" : "ARM"}
              </button>
            </div>
            <p>First click grants mic permission. After that Jarvis listens, answers, then listens again.</p>
            <label className="toggle-row">
              <span>Hands-free loop</span>
              <input checked={handsFree} type="checkbox" onChange={(event) => setHandsFree(event.target.checked)} />
            </label>
            <label className="toggle-row">
              <span>Voice reply</span>
              <input checked={voiceReply} type="checkbox" onChange={(event) => setVoiceReply(event.target.checked)} />
            </label>
          </section>
          <section className="settings-block">
            <div className="settings-block-head">
              <span>Palette</span>
            </div>
            <div className="palette-grid">
              {(Object.keys(paletteLabels) as Palette[]).map((key) => (
                <button className={palette === key ? "active" : ""} key={key} type="button" onClick={() => setPalette(key)}>
                  <i />
                  {paletteLabels[key]}
                </button>
              ))}
            </div>
          </section>
          <section className="settings-block">
            <label>
              <span>OpenAI API key placeholder</span>
              <input
                autoComplete="off"
                className="settings-input"
                placeholder="Backend connection later"
                type="password"
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
              />
            </label>
          </section>
        </aside>
      )}

      <section className="hud-bottom">
        <div className={`ai-state-readout ${activity}`}>
          <span>{activity === "idle" ? "JARVIS STANDBY" : activity === "listening" ? "VOICE INPUT LOCKED" : activity === "thinking" ? "COGNITIVE ROUTING" : "SYNTHESIZING RESPONSE"}</span>
          <div className="voice-wave" aria-hidden="true">
            {Array.from({ length: 18 }, (_, index) => (
              <i key={index} style={{ animationDelay: `${index * 42}ms` }} />
            ))}
          </div>
        </div>
        <form className="prompt-shell" onSubmit={submit}>
          <button className={voiceMode || listening ? "listening" : ""} type="button" aria-label="Voice mode" onClick={toggleVoiceMode}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3v10" />
              <path d="M8 7v5a4 4 0 0 0 8 0V7" />
              <path d="M5 12a7 7 0 0 0 14 0" />
              <path d="M12 19v3" />
            </svg>
          </button>
          <input aria-label="Command input" placeholder="Ask Jarvis..." value={input} onChange={(event) => setInput(event.target.value)} />
          <button type="submit" aria-label="Send command">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </button>
        </form>
        <p>{toast || (activity === "idle" ? "REACTOR FIELD STABLE - CHAT MEMORY ONLINE - VOICE LINK READY" : "AI CORE ACTIVE - ORBITAL TRAFFIC AMPLIFIED - RESPONSE FIELD LIVE")}</p>
      </section>
    </div>
  );
}
