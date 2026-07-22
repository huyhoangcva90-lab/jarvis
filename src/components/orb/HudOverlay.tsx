import { FormEvent, type ChangeEvent, type CSSProperties, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import type { AiActivity, EnergyPalette } from "../../App";
import HudWindow, { type HudWindowPosition } from "./HudWindow";

type Attachment = {
  id: string;
  name: string;
  type: string;
  size: number;
  previewUrl?: string;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  at: number;
  speaker?: AgentId;
  attachments?: Attachment[];
};

type Palette = EnergyPalette;
type AgentId = "j-core" | "hermes" | "openclaw" | "9router";
type IconName = "hub" | "chat" | "settings" | "reset" | "orbit" | "external" | "trash" | "close" | "minimize" | "restore" | "attach" | "file" | "mic" | "screen" | "send" | "focus" | "reveal";
type WindowId = "hub" | "settings";
type WindowLayout = {
  open: boolean;
  minimized: boolean;
  position: HudWindowPosition;
};
type WindowLayouts = Record<WindowId, WindowLayout>;

const DEFAULT_WINDOW_POSITIONS: Record<WindowId, HudWindowPosition> = {
  hub: { x: 0, y: 0 },
  settings: { x: 0, y: 0 },
};

const STORAGE_KEY = "jarvis.commandOrb.v4";
const WAKE_WORDS = /\b(jarvis|j core|jcore|jay core|tro ly)\b/;
const REQUEST_INTENTS =
  /\b(giup|hoi|tu van|phan tich|lam sao|nen|co nen|hay|cho t|cho tao|cho minh|debug|sua|mo|tim|nhac|ghi nho|ke hoach|y kien|danh gia)\b/;
const BACKCHANNELS = new Set([
  "uh",
  "uh huh",
  "um",
  "uhm",
  "hmm",
  "hm",
  "ok",
  "okay",
  "oke",
  "u",
  "um dung",
  "thoi",
  "khong sao",
  "duoc roi",
  "de xem"
]);

const paletteLabels: Record<Palette, string> = {
  gold: "Gold Core",
  blue: "Stark Tech",
  green: "Agamotto Time",
  red: "Transfer",
  violet: "Neon Violet",
  orange: "Cosmic Soul",
  neutral: "Infinity Orbit"
};

const agentLabels: Record<AgentId, string> = {
  "j-core": "J-CORE",
  hermes: "HERMES",
  openclaw: "OPENCLAW",
  "9router": "9ROUTER",
};

const activityLabels: Record<AiActivity, string> = {
  idle: "Sẵn sàng",
  listening: "Đang lắng nghe",
  thinking: "Đang xử lý",
  speaking: "Đang phản hồi"
};

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    hub: <><path d="M4 4h7v7H4ZM13 4h7v4h-7ZM13 10h7v10h-7ZM4 13h7v7H4Z" /><path d="M7.5 11v2M11 7.5h2M11 16.5h2" /></>,
    chat: <><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" /><path d="M8 9h8M8 13h5" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9.6v-.09A1.7 1.7 0 0 0 8.5 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3V9.6h.09A1.7 1.7 0 0 0 4.6 8.5a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.09A1.7 1.7 0 0 0 15.5 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.16.37.37.72.6 1 .3.3.69.44 1.1.4h.1v4h-.1A1.7 1.7 0 0 0 19.4 15Z" /></>,
    reset: <><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v6h6" /><path d="M12 8v4l3 2" /></>,
    orbit: <><circle cx="12" cy="12" r="2.4" /><ellipse cx="12" cy="12" rx="9" ry="4.2" transform="rotate(-28 12 12)" /><circle cx="19.2" cy="8.2" r="1" /></>,
    external: <><path d="M14 3h7v7M10 14 21 3" /><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" /></>,
    trash: <><path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6" /></>,
    close: <><path d="m8 8 8 8M16 8l-8 8" /><path d="M9 4H5a1 1 0 0 0-1 1v4M15 4h4a1 1 0 0 1 1 1v4M20 15v4a1 1 0 0 1-1 1h-4M9 20H5a1 1 0 0 1-1-1v-4" /></>,
    minimize: <><path d="M5 18h14" /><path d="M12 5v9M8.5 10.5 12 14l3.5-3.5" /></>,
    restore: <><rect x="5" y="7" width="12" height="12" rx="1" /><path d="M8 7V4h11v11h-2" /></>,
    attach: <path d="m20.5 11.5-8.7 8.7a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7L9 17.4a2 2 0 0 1-2.8-2.8l8.6-8.6" />,
    file: <><path d="M6 2h8l4 4v16H6Z" /><path d="M14 2v5h5M9 13h6M9 17h4" /></>,
    mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8" /></>,
    screen: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /><path d="m14 8 3 3-3 3M17 11H9" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
    focus: <><circle cx="12" cy="12" r="3" /><path d="M3 9V4a1 1 0 0 1 1-1h5M15 3h5a1 1 0 0 1 1 1v5M21 15v5a1 1 0 0 1-1 1h-5M9 21H4a1 1 0 0 1-1-1v-5" /></>,
    reveal: <><path d="m9 18 6-6-6-6" /><path d="M3 4v16" /></>
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function createInitialWindows(stored?: Partial<WindowLayouts>): WindowLayouts {
  return {
    hub: { open: typeof window !== "undefined" && window.innerWidth > 980, minimized: false, position: stored?.hub?.position ?? DEFAULT_WINDOW_POSITIONS.hub },
    settings: { open: false, minimized: false, position: stored?.settings?.position ?? DEFAULT_WINDOW_POSITIONS.settings },
  };
}

function createReply(input: string, agent: AgentId) {
  const text = input.toLowerCase();
  if (agent === "hermes") {
    return "Hermes đã nhận lệnh. T sẽ chuyển yêu cầu thành hành động rõ ràng và ưu tiên bước tiếp theo có thể thực hiện ngay.";
  }
  if (agent === "openclaw") {
    return "OpenClaw online. T đang phân rã nhiệm vụ thành các agent chuyên trách và kiểm tra thứ tự triển khai an toàn.";
  }
  if (agent === "9router") {
    return "9Router đã nhận truy vấn. T đang chọn tuyến mô hình phù hợp nhất theo độ khó, tốc độ và ngữ cảnh hiện tại.";
  }
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
  return "Đã nhận lệnh. J-CORE đang phân tích ngữ cảnh và điều phối hệ thống phù hợp cho yêu cầu này.";
}

function normalizeIntentText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9?\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function shouldAnswerVoice(transcript: string) {
  const raw = transcript.trim();
  const normalized = normalizeIntentText(raw);
  const words = normalized ? normalized.split(" ") : [];

  if (!normalized) return false;
  if (WAKE_WORDS.test(normalized)) return true;
  if (REQUEST_INTENTS.test(normalized)) return true;
  if (raw.includes("?") && words.length >= 4) return true;
  if (BACKCHANNELS.has(normalized)) return false;
  if (words.length <= 3) return false;
  if (/^(troi oi|haiz|haz|met nhi|chan nhi|thoi ke|sao cung duoc|biet the nao|khong biet nua)\b/.test(normalized)) return false;
  if (/\b(sao minh|sao toi|sao t|tai sao minh|tai sao toi)\b.*\b(the|vay|nhi|ha)\b/.test(normalized)) return false;

  return words.length >= 9 && /\b(can|muon|phai|nen|lam|xem|kiem|tim|sua|hoc|viet)\b/.test(normalized);
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as { messages?: Message[]; palette?: Palette; activeAgent?: AgentId; voiceReply?: boolean; handsFree?: boolean; advisorMode?: boolean; orbOnly?: boolean; windows?: Partial<WindowLayouts> };
  } catch {
    return null;
  }
}

type HudOverlayProps = {
  palette: EnergyPalette;
  onActivityChange: (activity: AiActivity) => void;
  onPaletteChange: (palette: EnergyPalette) => void;
  onResetView: () => void;
};

export default function HudOverlay({ palette, onActivityChange, onPaletteChange, onResetView }: HudOverlayProps) {
  const initial = useMemo(() => (typeof window === "undefined" ? null : loadState()), []);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(
    () => initial?.messages?.length ? initial.messages : [{ id: createId(), role: "assistant", speaker: "j-core", text: "Kết nối đã sẵn sàng. Chọn hệ AI bên dưới để bắt đầu hội thoại.", at: Date.now() }]
  );
  const [activeAgent, setActiveAgent] = useState<AgentId>(initial?.activeAgent ?? "j-core");
  const [voiceReply, setVoiceReply] = useState(initial?.voiceReply ?? true);
  const [handsFree, setHandsFree] = useState(initial?.handsFree ?? false);
  const [advisorMode, setAdvisorMode] = useState(initial?.advisorMode ?? true);
  const [voiceMode, setVoiceMode] = useState(false);
  const [chatVisible, setChatVisible] = useState(() => typeof window !== "undefined" && window.innerWidth > 760);
  const [windows, setWindows] = useState<WindowLayouts>(() => createInitialWindows(initial?.windows));
  const [activeWindow, setActiveWindow] = useState<WindowId>("hub");
  const [orbOnly, setOrbOnly] = useState(initial?.orbOnly ?? false);
  const [pendingAttachment, setPendingAttachment] = useState<Attachment | null>(null);
  const [listening, setListening] = useState(false);
  const [activity, setActivity] = useState<AiActivity>("idle");
  const [toast, setToast] = useState("");
  const recognitionRef = useRef<any>(null);
  const voiceModeRef = useRef(false);
  const recognitionActiveRef = useRef(false);
  const microphonePermissionRef = useRef(false);
  const activityRef = useRef<AiActivity>("idle");
  const manualStopRef = useRef(false);
  const resultHandledRef = useRef(false);
  const speechRunRef = useRef(0);
  const thinkingTimer = useRef<number | null>(null);
  const idleTimer = useRef<number | null>(null);
  const restartTimer = useRef<number | null>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const objectUrlsRef = useRef(new Set<string>());

  useEffect(() => {
    document.body.dataset.palette = palette;
    const persistedMessages = messages.map((message) => ({
      ...message,
      attachments: message.attachments?.map(({ previewUrl: _previewUrl, ...attachment }) => attachment),
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages: persistedMessages, palette, activeAgent, voiceReply, handsFree, advisorMode, orbOnly, windows }));
  }, [activeAgent, advisorMode, handsFree, messages, orbOnly, palette, voiceReply, windows]);

  useEffect(() => onActivityChange(activity), [activity, onActivityChange]);
  useEffect(() => { activityRef.current = activity; }, [activity]);
  useEffect(() => { voiceModeRef.current = voiceMode; }, [voiceMode]);
  useEffect(() => {
    messageListRef.current?.scrollTo({ top: messageListRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    document.body.classList.toggle("is-orb-only-mode", orbOnly);
    return () => document.body.classList.remove("is-orb-only-mode");
  }, [orbOnly]);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);
  useEffect(() => () => {
    if (thinkingTimer.current) window.clearTimeout(thinkingTimer.current);
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    if (restartTimer.current) window.clearTimeout(restartTimer.current);
    speechRunRef.current += 1;
    recognitionRef.current?.abort?.();
    window.speechSynthesis?.cancel();
    objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrlsRef.current.clear();
  }, []);

  const scheduleVoiceRestart = (delay = 520) => {
    if (!voiceModeRef.current || !handsFree) return;
    if (restartTimer.current) window.clearTimeout(restartTimer.current);
    restartTimer.current = window.setTimeout(() => { void startRecognition(); }, advisorMode ? Math.max(delay, 1700) : delay);
  };

  const speak = (text: string) => {
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    const speechRun = ++speechRunRef.current;
    setActivity("speaking");
    const startedAt = Date.now();
    const minimumSpeakingMs = Math.min(5600, Math.max(2400, text.length * 42));
    const finishSpeaking = () => {
      if (speechRun !== speechRunRef.current) return;
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

  const sendMessage = (value = input, source: "text" | "voice" = "text") => {
    const trimmed = value.trim();
    const attachment = source === "text" ? pendingAttachment : null;
    if (!trimmed && !attachment) return;
    if (source === "voice" && advisorMode && !shouldAnswerVoice(trimmed)) {
      setInput("");
      setActivity("idle");
      setToast("Đã nghe, chưa cần phản hồi.");
      scheduleVoiceRestart(1500);
      return;
    }
    const messageText = trimmed || `Đã đính kèm ${attachment?.name ?? "tệp"}.`;
    setMessages((current) => [...current, {
      id: createId(),
      role: "user" as const,
      text: messageText,
      at: Date.now(),
      attachments: attachment ? [attachment] : undefined,
    }].slice(-80));
    setInput("");
    if (attachment) setPendingAttachment(null);
    setActivity("thinking");
    if (thinkingTimer.current) window.clearTimeout(thinkingTimer.current);
    thinkingTimer.current = window.setTimeout(() => {
      const reply = { id: createId(), role: "assistant" as const, speaker: activeAgent, text: createReply(trimmed || `tệp ${attachment?.name ?? "đính kèm"}`, activeAgent), at: Date.now() + 1 };
      setMessages((current) => [...current, reply].slice(-80));
      speak(reply.text);
    }, 980);
  };

  const submit = (event: FormEvent) => { event.preventDefault(); sendMessage(); };

  const chooseAttachment = () => attachmentInputRef.current?.click();

  const removePendingAttachment = () => {
    if (pendingAttachment?.previewUrl) {
      URL.revokeObjectURL(pendingAttachment.previewUrl);
      objectUrlsRef.current.delete(pendingAttachment.previewUrl);
    }
    setPendingAttachment(null);
    if (attachmentInputRef.current) attachmentInputRef.current.value = "";
  };

  const handleAttachmentChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      setToast("Tệp vượt quá giới hạn 15 MB.");
      event.target.value = "";
      return;
    }
    if (pendingAttachment?.previewUrl) {
      URL.revokeObjectURL(pendingAttachment.previewUrl);
      objectUrlsRef.current.delete(pendingAttachment.previewUrl);
    }
    const previewUrl = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;
    if (previewUrl) objectUrlsRef.current.add(previewUrl);
    setPendingAttachment({ id: createId(), name: file.name, type: file.type || "application/octet-stream", size: file.size, previewUrl });
    setToast(file.type.startsWith("image/") ? "Đã ghim hình ảnh." : "Đã ghim tệp.");
  };

  const captureSharedScreen = async () => {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      setToast("Trình duyệt này chưa hỗ trợ chia sẻ màn hình.");
      return;
    }

    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      const video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      video.srcObject = stream;
      await new Promise<void>((resolve) => {
        if (video.readyState >= 1) resolve();
        else video.onloadedmetadata = () => resolve();
      });
      await video.play();

      const scale = Math.min(1, 1600 / Math.max(1, video.videoWidth));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
      canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
      canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png", 0.92));
      if (!blob) throw new Error("screen-capture-empty");

      if (pendingAttachment?.previewUrl) {
        URL.revokeObjectURL(pendingAttachment.previewUrl);
        objectUrlsRef.current.delete(pendingAttachment.previewUrl);
      }
      const previewUrl = URL.createObjectURL(blob);
      objectUrlsRef.current.add(previewUrl);
      setPendingAttachment({
        id: createId(),
        name: `screen-${new Date().toISOString().replace(/[:.]/g, "-")}.png`,
        type: "image/png",
        size: blob.size,
        previewUrl,
      });
      setToast("Đã chụp màn hình chia sẻ và ghim vào chat.");
    } catch (error) {
      const name = error instanceof DOMException ? error.name : "";
      setToast(name === "AbortError" || name === "NotAllowedError" ? "Đã hủy chia sẻ màn hình." : "Không thể chụp màn hình chia sẻ.");
    } finally {
      stream?.getTracks().forEach((track) => track.stop());
    }
  };

  async function startRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { setToast("Trình duyệt này chưa hỗ trợ Google Web Speech. Hãy mở bằng Chrome hoặc Edge."); return; }
    if (recognitionActiveRef.current || activityRef.current === "thinking" || activityRef.current === "speaking") return;
    if (!microphonePermissionRef.current && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
        microphonePermissionRef.current = true;
      } catch (error) {
        const name = error instanceof DOMException ? error.name : "";
        voiceModeRef.current = false;
        setVoiceMode(false);
        setToast(name === "NotFoundError" ? "Không tìm thấy microphone khả dụng." : "Microphone đang bị chặn. Hãy cấp quyền cho trang rồi bật Voice lại.");
        return;
      }
    }
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
    recognition.onerror = (event: { error?: string }) => {
      recognitionActiveRef.current = false;
      setListening(false);
      setActivity("idle");
      if (event.error === "aborted") return;
      if (event.error === "no-speech") {
        setToast("Chưa nghe rõ giọng nói. Hãy thử lại gần microphone hơn.");
        scheduleVoiceRestart(900);
        return;
      }
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        voiceModeRef.current = false;
        setVoiceMode(false);
        setToast("Microphone đang bị chặn. Hãy cấp quyền rồi bật Voice lại.");
        return;
      }
      if (event.error === "audio-capture") {
        setToast("Không tìm thấy microphone khả dụng.");
        return;
      }
      setToast(event.error === "network" ? "Nhận giọng nói mất kết nối mạng." : "Nhận giọng nói tạm thời gặp lỗi.");
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      resultHandledRef.current = true;
      setInput(transcript);
      if (transcript) sendMessage(transcript, "voice");
    };
    recognitionRef.current = recognition;
    try { recognition.start(); } catch {
      recognitionActiveRef.current = false;
      voiceModeRef.current = false;
      setVoiceMode(false);
      setListening(false);
      setActivity("idle");
      setToast("Không thể khởi động microphone. Hãy thử bật Voice lại.");
    }
  }

  const stopVoice = () => {
    manualStopRef.current = true;
    speechRunRef.current += 1;
    if (restartTimer.current) window.clearTimeout(restartTimer.current);
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    recognitionRef.current?.stop?.();
    window.speechSynthesis?.cancel();
    setVoiceMode(false);
    setListening(false);
    setActivity("idle");
  };

  const toggleVoiceMode = async () => {
    if (voiceModeRef.current || listening) { stopVoice(); return; }
    setVoiceMode(true);
    voiceModeRef.current = true;
    setToast(handsFree ? "Voice đã bật và sẽ tự nghe tiếp sau mỗi câu." : "Voice đã bật cho một lượt nghe.");
    await startRecognition();
  };

  const clearChat = () => {
    speechRunRef.current += 1;
    window.speechSynthesis?.cancel();
    setActivity("idle");
    objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrlsRef.current.clear();
    setPendingAttachment(null);
    setMessages([{ id: createId(), role: "assistant", speaker: activeAgent, text: "Lịch sử đã được xóa. Kết nối vẫn hoạt động.", at: Date.now() }]);
  };

  const localNow = useMemo(() => new Date(), [activity, messages.length, palette]);
  const moduleStatus = useMemo(
    () => [
      { label: "WEATHER", value: "LOCAL READY", detail: "Module san, chua noi API" },
      {
        label: "CALENDAR",
        value: localNow.toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" }),
        detail: "Nhac viec thu cong qua chat"
      },
      { label: "VOICE", value: voiceMode ? "OPEN CHANNEL" : "STANDBY", detail: advisorMode ? "Co van, loc cau vu vo" : "Phan hoi moi cau nghe duoc" },
      { label: "MODE", value: paletteLabels[palette].toUpperCase(), detail: "Orb doi mau va cau truc" },
      { label: "MEMORY", value: `${messages.length} LOGS`, detail: "Luu cuc bo trong trinh duyet" }
    ],
    [advisorMode, localNow, messages.length, palette, voiceMode]
  );

  const closeWindow = (id: WindowId) => {
    setWindows((current) => ({ ...current, [id]: { ...current[id], open: false, minimized: false } }));
  };

  const minimizeWindow = (id: WindowId) => {
    setWindows((current) => ({ ...current, [id]: { ...current[id], open: true, minimized: true } }));
    setActiveWindow(id);
  };

  const restoreWindow = (id: WindowId) => {
    setWindows((current) => ({ ...current, [id]: { ...current[id], open: true, minimized: false } }));
    setActiveWindow(id);
  };

  const moveWindow = (id: WindowId, position: HudWindowPosition) => {
    setWindows((current) => ({ ...current, [id]: { ...current[id], position } }));
  };

  const hubOpen = windows.hub.open;
  const settingsOpen = windows.settings.open;
  const windowIds = Object.keys(windows) as WindowId[];

  return (
    <div className={`hud-overlay${orbOnly ? " is-orb-only" : ""}`} aria-label="J-Core AI interface">
      <nav className="hud-edge-rail" aria-label={orbOnly ? "Khôi phục giao diện" : "Các hub đang ẩn"}>
        {orbOnly ? (
          <button className="edge-tab orb-restore-tab" type="button" onClick={() => setOrbOnly(false)}>
            <Icon name="reveal" /><span>KHÔI PHỤC HUD</span>
          </button>
        ) : windowIds.map((id, index) => (
          <button
            className={`edge-tab${windows[id].open && !windows[id].minimized ? " is-active" : ""}${windows[id].minimized ? " is-stowed" : ""}`}
            key={id}
            type="button"
            aria-pressed={windows[id].open && !windows[id].minimized}
            style={{ "--tab-index": index } as CSSProperties}
            onClick={() => windows[id].open && !windows[id].minimized ? closeWindow(id) : restoreWindow(id)}
          >
            <Icon name={id === "hub" ? "hub" : "settings"} />
            <span>{id === "hub" ? "OPERATOR HUB" : "SYSTEM HUB"}</span>
          </button>
        ))}
      </nav>

      {!orbOnly && <nav className="hud-dock" aria-label="Điều khiển giao diện">
        <button type="button" aria-label="Ẩn toàn bộ HUD, chỉ hiện quả cầu" onClick={() => setOrbOnly(true)}><Icon name="focus" /></button>
        <button className={chatVisible ? "active" : ""} type="button" aria-label="Bật tắt chat bên phải" onClick={() => setChatVisible((current) => !current)}><Icon name="chat" /></button>
        <button className={palette === "neutral" ? "active" : ""} type="button" aria-label="Mở hệ hành tinh Infinity" onClick={() => onPaletteChange("neutral")}><Icon name="orbit" /></button>
        <button type="button" aria-label="Reset góc nhìn" onClick={onResetView}><Icon name="reset" /></button>
      </nav>}

      {!orbOnly && hubOpen && !windows.hub.minimized && (
        <HudWindow
          active={activeWindow === "hub"}
          ariaLabel="Activity hub"
          className="activity-hub"
          minimized={windows.hub.minimized}
          position={windows.hub.position}
          titleBarClassName="hub-title"
          onActivate={() => setActiveWindow("hub")}
          onPositionChange={(position) => moveWindow("hub", position)}
          titleBar={<>
            <div className="hub-title-copy">
            <span>OPERATOR HUB</span>
            <b>{activity === "speaking" ? "RESPONDING" : activity === "thinking" ? "ANALYZING" : activity === "listening" ? "LISTENING" : "STANDBY"}</b>
            </div>
            <div className="window-actions">
              <button className="window-control is-minimize" type="button" aria-label="Thu nhỏ hub vào thanh ẩn" onClick={() => minimizeWindow("hub")}><Icon name="minimize" /></button>
              <button className="window-control is-close" type="button" aria-label="Đóng hub" onClick={() => closeWindow("hub")}><Icon name="close" /></button>
            </div>
          </>}
        >
          <div className="hub-orbit-map" aria-hidden="true">
            <i />
            <i />
            <i />
            <b />
          </div>
          <div className="hub-modules">
            {moduleStatus.map((item) => (
              <section className="hub-module" key={item.label}>
                <span>{item.label}</span>
                <b>{item.value}</b>
                <p>{item.detail}</p>
              </section>
            ))}
          </div>
        </HudWindow>
      )}

      {!orbOnly && settingsOpen && !windows.settings.minimized && (
        <HudWindow
          active={activeWindow === "settings"}
          ariaLabel="Cài đặt"
          className="settings-panel"
          minimized={windows.settings.minimized}
          position={windows.settings.position}
          titleBarClassName="settings-hero"
          onActivate={() => setActiveWindow("settings")}
          onPositionChange={(position) => moveWindow("settings", position)}
          titleBar={<>
            <div><span>HỆ THỐNG</span><b>{voiceMode ? "VOICE ACTIVE" : "LOCAL MODE"}</b></div>
            <div className="window-actions">
              <button className="window-control is-minimize" type="button" aria-label="Thu nhỏ hệ thống vào thanh ẩn" onClick={() => minimizeWindow("settings")}><Icon name="minimize" /></button>
              <button className="window-control is-close" type="button" aria-label="Đóng cài đặt" onClick={() => closeWindow("settings")}><Icon name="close" /></button>
            </div>
          </>}
        >
          <div className="hud-window-content settings-window-content">
            <section className="settings-block">
              <div className="settings-block-head"><span>Voice link</span><button className={voiceMode ? "danger" : "primary"} type="button" onClick={toggleVoiceMode}>{voiceMode ? "Tắt" : "Bật"}</button></div>
              <label className="toggle-row"><span>Chế độ cố vấn</span><input checked={advisorMode} type="checkbox" onChange={(event) => setAdvisorMode(event.target.checked)} /></label>
              <label className="toggle-row"><span>Tự nghe tiếp</span><input checked={handsFree} type="checkbox" onChange={(event) => setHandsFree(event.target.checked)} /></label>
              <label className="toggle-row"><span>Đọc phản hồi</span><input checked={voiceReply} type="checkbox" onChange={(event) => setVoiceReply(event.target.checked)} /></label>
            </section>
            <section className="settings-block">
              <div className="settings-block-head"><span>Màu năng lượng</span></div>
              <div className="palette-grid">
                {(Object.keys(paletteLabels) as Palette[]).map((key) => <button className={palette === key ? "active" : ""} key={key} type="button" onClick={() => onPaletteChange(key)}><i />{paletteLabels[key]}</button>)}
              </div>
            </section>
            <section className="settings-actions">
              <button type="button" onClick={() => window.open("https://chatgpt.com/", "_blank", "noopener,noreferrer")}><Icon name="external" /><span>Mở ChatGPT Web</span></button>
              <button className="danger-text" type="button" onClick={clearChat}><Icon name="trash" /><span>Xóa bộ nhớ chat</span></button>
            </section>
          </div>
        </HudWindow>
      )}

      {!orbOnly && chatVisible && <aside className="chat-side-panel" aria-label="Chat bên phải">
        <header className="chat-side-head">
          <div><i className={`status-dot ${activity}`} /><span>ĐỐI THOẠI</span></div>
          <div><b>{agentLabels[activeAgent]}</b><button type="button" aria-label="Ẩn chat bên phải" onClick={() => setChatVisible(false)}><Icon name="close" /></button></div>
        </header>
        <div className="chat-transcript" ref={messageListRef} role="log" aria-label="Hội thoại hiện tại" aria-live="polite">
          {messages.slice(-12).map((message) => (
            <article className={`chat-turn ${message.role}`} key={message.id}>
              <b>{message.role === "user" ? "YOU" : agentLabels[message.speaker ?? "j-core"]}</b>
              <span>{message.text}</span>
              {message.attachments?.map((attachment) => (
                <span className="message-attachment" key={attachment.id}>
                  {attachment.previewUrl && attachment.type.startsWith("image/")
                    ? <img src={attachment.previewUrl} alt={attachment.name} />
                    : <span className="attachment-file-icon"><Icon name="file" /></span>}
                  <span><strong>{attachment.name}</strong><small>{formatFileSize(attachment.size)}</small></span>
                </span>
              ))}
            </article>
          ))}
        </div>
      </aside>}

      {!orbOnly && <section className="hud-bottom">
        <div className={`ai-state-readout ${activity}`}>
          <i className={`status-dot ${activity}`} />
          <span>{activityLabels[activity]}</span>
          <div className="voice-wave" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} style={{ animationDelay: `${index * 48}ms` }} />)}</div>
        </div>
        {pendingAttachment && (
          <div className="attachment-tray" aria-live="polite">
            {pendingAttachment.previewUrl && pendingAttachment.type.startsWith("image/")
              ? <img src={pendingAttachment.previewUrl} alt={`Xem trước ${pendingAttachment.name}`} />
              : <span className="attachment-file-icon"><Icon name="file" /></span>}
            <span><strong>{pendingAttachment.name}</strong><small>{formatFileSize(pendingAttachment.size)} · tối đa 15 MB</small></span>
            <button type="button" aria-label="Gỡ tệp đính kèm" onClick={removePendingAttachment}><Icon name="close" /></button>
          </div>
        )}
        <div className="agent-selector" role="group" aria-label="Chọn hệ AI để nói chuyện">
          <span>NÓI VỚI</span>
          {(Object.keys(agentLabels) as AgentId[]).map((agent) => (
            <button
              className={activeAgent === agent ? "active" : ""}
              key={agent}
              type="button"
              aria-pressed={activeAgent === agent}
              onClick={() => {
                setActiveAgent(agent);
                setToast(`Đã chuyển kênh sang ${agentLabels[agent]}.`);
              }}
            >
              {agentLabels[agent]}
            </button>
          ))}
        </div>
        <form className="prompt-shell" onSubmit={submit}>
          <button className={voiceMode || listening ? "listening" : ""} type="button" aria-label="Bật chế độ giọng nói" onClick={toggleVoiceMode}><Icon name="mic" /></button>
          <div className="prompt-hidden-actions" aria-label="Công cụ chat">
            <button type="button" aria-label="Ghim một tệp hoặc hình ảnh" onClick={chooseAttachment}><Icon name="attach" /></button>
            <button type="button" aria-label="Chia sẻ và chụp màn hình" onClick={captureSharedScreen}><Icon name="screen" /></button>
          </div>
          <input
            ref={attachmentInputRef}
            className="attachment-input"
            id="jcore-attachment"
            type="file"
            accept="image/*,.pdf,.txt,.md,.csv,.json,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
            aria-label="Chọn một tệp hoặc hình ảnh"
            onChange={handleAttachmentChange}
          />
          <label className="sr-only" htmlFor="jcore-command">Nhập tin nhắn</label>
          <input id="jcore-command" placeholder={`Nói với ${agentLabels[activeAgent]}...`} value={input} onChange={(event) => setInput(event.target.value)} />
          <button type="submit" aria-label="Gửi tin nhắn" disabled={!input.trim() && !pendingAttachment}><Icon name="send" /></button>
        </form>
        <p aria-live="polite">{toast}</p>
      </section>}
    </div>
  );
}
