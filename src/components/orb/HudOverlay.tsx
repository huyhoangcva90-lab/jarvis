import { FormEvent, type ChangeEvent, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import type { AiActivity, EnergyPalette } from "../../types/orb";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  at: number;
};

type Palette = EnergyPalette;
type IconName = "hub" | "chat" | "settings" | "reset" | "external" | "copy" | "trash" | "close" | "minimize" | "maximize" | "mic" | "attach" | "screen" | "send";
type PanelId = "hub" | "history" | "settings";
type ModuleId = "quota" | "schedule" | "finance" | "agents" | "knowledge" | "memory";

const MODULES: Array<{
  id: ModuleId;
  label: string;
  realm: string;
  color: string;
  rgb: string;
  status: string;
  description: string;
  features: string[];
}> = [
  { id: "quota", label: "Quota", realm: "9Router / Space", color: "#33d7ff", rgb: "51, 215, 255", status: "ROUTER READY", description: "Theo dõi hạn mức provider và đường định tuyến model.", features: ["Provider combos", "Quota windows", "Fallback routes", "Cost estimate"] },
  { id: "schedule", label: "Schedule", realm: "Notion / Time", color: "#6eff9a", rgb: "110, 255, 154", status: "LOCAL READY", description: "Nhịp ngày, lịch, thói quen và hàng đợi nhắc việc.", features: ["Notion tasks", "Calendar slots", "Habit cycles", "Reminder queue"] },
  { id: "finance", label: "Finance", realm: "Ledger / Reality", color: "#ff466c", rgb: "255, 70, 108", status: "VAULT STANDBY", description: "Theo dõi dòng tiền, ngân sách và cảnh báo tài chính.", features: ["Cash flow", "Budget gates", "Saving shield", "Debt locks"] },
  { id: "agents", label: "Agents", realm: "OpenClaw / Power", color: "#b35cff", rgb: "179, 92, 255", status: "WORKFORCE READY", description: "Điều phối đội agent, phòng ban và nhiệm vụ đang chạy.", features: ["Virtual office", "Agent roster", "Mission dispatch", "Tool heartbeat"] },
  { id: "knowledge", label: "Knowledge", realm: "Claude / Mind", color: "#ffd760", rgb: "255, 215, 96", status: "CORE ONLINE", description: "Ngữ cảnh dự án, kho tri thức và luồng debug cục bộ.", features: ["Claude Code local", "Repository memory", "Prompt context", "Debug trace"] },
  { id: "memory", label: "Memory", realm: "Personal / Soul", color: "#ff9a3d", rgb: "255, 154, 61", status: "SYNC LOCAL", description: "Hồ sơ cá nhân, tâm trạng, năng lượng và trí nhớ dài hạn.", features: ["Agent awareness", "Mood channel", "Energy signal", "Long memory"] }
];

const DEFAULT_ENABLED_MODULES: ModuleId[] = ["quota", "schedule", "agents", "memory"];
const PANEL_LABELS: Record<PanelId, string> = { hub: "OPERATOR HUB", history: "CHAT HISTORY", settings: "SYSTEM SETTINGS" };

const STORAGE_KEY = "jarvis.commandOrb.v2";
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
  blue: "Tesseract AI",
  green: "Agamotto Time",
  red: "Asgard Divine",
  violet: "Alien Lattice",
  orange: "Arc Intelligence"
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
    external: <><path d="M14 3h7v7M10 14 21 3" /><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" /></>,
    copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>,
    trash: <><path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    minimize: <path d="M6 12h12" />,
    maximize: <><path d="M8 4H4v4M16 4h4v4M20 16v4h-4M8 20H4v-4" /></>,
    mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8" /></>,
    attach: <path d="m20.5 11.5-8.7 8.7a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7L9 17.4a2 2 0 0 1-2.8-2.8l8.6-8.6" />,
    screen: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /><path d="m14 8 3 3-3 3M17 11H9" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

type PanelOffset = { x: number; y: number };

function usePanelDrag() {
  const panelRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState<PanelOffset>({ x: 0, y: 0 });
  const dragState = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    base: PanelOffset;
    rect: DOMRect;
  } | null>(null);

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0 || window.innerWidth <= 760 || (event.target as HTMLElement).closest("button")) return;
    const panel = panelRef.current;
    if (!panel) return;
    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      base: offset,
      rect: panel.getBoundingClientRect()
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    document.body.classList.add("hud-dragging");
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const margin = 8;
    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    const boundedX = Math.min(window.innerWidth - margin - drag.rect.right, Math.max(margin - drag.rect.left, deltaX));
    const boundedY = Math.min(window.innerHeight - margin - drag.rect.bottom, Math.max(margin - drag.rect.top, deltaY));
    setOffset({ x: drag.base.x + boundedX, y: drag.base.y + boundedY });
  };

  const stopDragging = (event: ReactPointerEvent<HTMLElement>) => {
    if (dragState.current?.pointerId !== event.pointerId) return;
    dragState.current = null;
    document.body.classList.remove("hud-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return {
    panelRef,
    offset,
    resetPosition: () => setOffset({ x: 0, y: 0 }),
    dragHandleProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp: stopDragging,
      onPointerCancel: stopDragging
    }
  };
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
    return JSON.parse(raw) as {
      messages?: Message[];
      palette?: Palette;
      voiceReply?: boolean;
      handsFree?: boolean;
      advisorMode?: boolean;
      panels?: Partial<Record<PanelId, { open: boolean; minimized: boolean }>>;
      enabledModules?: ModuleId[];
      activeModule?: ModuleId;
    };
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
    () => initial?.messages?.length ? initial.messages : [{ id: createId(), role: "assistant", text: "Kết nối đã sẵn sàng. Bạn có thể chat hoặc nói trực tiếp với t.", at: Date.now() }]
  );

  const [voiceReply, setVoiceReply] = useState(initial?.voiceReply ?? true);
  const [handsFree, setHandsFree] = useState(initial?.handsFree ?? false);
  const [advisorMode, setAdvisorMode] = useState(initial?.advisorMode ?? true);
  const [voiceMode, setVoiceMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(initial?.panels?.settings?.open ?? false);
  const [historyOpen, setHistoryOpen] = useState(() => initial?.panels?.history?.open ?? (typeof window !== "undefined" && window.innerWidth > 760));
  const [hubOpen, setHubOpen] = useState(() => initial?.panels?.hub?.open ?? (typeof window !== "undefined" && window.innerWidth > 980));
  const [historyMinimized, setHistoryMinimized] = useState(initial?.panels?.history?.minimized ?? false);
  const [hubMinimized, setHubMinimized] = useState(initial?.panels?.hub?.minimized ?? false);
  const [settingsMinimized, setSettingsMinimized] = useState(initial?.panels?.settings?.minimized ?? false);
  const [enabledModules, setEnabledModules] = useState<ModuleId[]>(() => initial?.enabledModules?.filter((id) => MODULES.some((module) => module.id === id)) ?? DEFAULT_ENABLED_MODULES);
  const [activeModule, setActiveModule] = useState<ModuleId>(initial?.activeModule ?? "quota");
  const [pendingAttachment, setPendingAttachment] = useState<File | null>(null);
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
  const thinkingTimer = useRef<number | null>(null);
  const idleTimer = useRef<number | null>(null);
  const restartTimer = useRef<number | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const hubDrag = usePanelDrag();
  const historyDrag = usePanelDrag();
  const settingsDrag = usePanelDrag();

  useEffect(() => {
    document.body.dataset.palette = palette;
    onPaletteChange(palette);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      messages,
      palette,
      voiceReply,
      handsFree,
      advisorMode,
      enabledModules,
      activeModule,
      panels: {
        hub: { open: hubOpen, minimized: hubMinimized },
        history: { open: historyOpen, minimized: historyMinimized },
        settings: { open: settingsOpen, minimized: settingsMinimized }
      }
    }));
  }, [activeModule, advisorMode, enabledModules, handsFree, historyMinimized, historyOpen, hubMinimized, hubOpen, messages, onPaletteChange, palette, settingsMinimized, settingsOpen, voiceReply]);

  useEffect(() => onActivityChange(activity), [activity, onActivityChange]);
  useEffect(() => { activityRef.current = activity; }, [activity]);
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
    restartTimer.current = window.setTimeout(() => { void startRecognition(); }, advisorMode ? Math.max(delay, 1700) : delay);
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

  const sendMessage = (value = input, source: "text" | "voice" = "text") => {
    const trimmed = value.trim();
    if (!trimmed && !pendingAttachment) return;
    if (source === "voice" && advisorMode && !shouldAnswerVoice(trimmed)) {
      setInput("");
      setActivity("idle");
      setToast("Đã nghe, chưa cần phản hồi.");
      scheduleVoiceRestart(1500);
      return;
    }
    const messageText = trimmed || `Đã ghim ${pendingAttachment?.name ?? "tệp"}.`;
    setMessages((current) => [...current, { id: createId(), role: "user" as const, text: messageText, at: Date.now() }].slice(-80));
    setInput("");
    setPendingAttachment(null);
    setHistoryOpen(true);
    setActivity("thinking");
    if (thinkingTimer.current) window.clearTimeout(thinkingTimer.current);
    thinkingTimer.current = window.setTimeout(() => {
      const reply = { id: createId(), role: "assistant" as const, text: createReply(messageText), at: Date.now() + 1 };
      setMessages((current) => [...current, reply].slice(-80));
      speak(reply.text);
    }, 980);
  };

  const submit = (event: FormEvent) => { event.preventDefault(); sendMessage(); };

  const chooseAttachment = () => attachmentInputRef.current?.click();

  const handleAttachmentChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      setToast("Tệp vượt quá giới hạn 15 MB.");
      event.target.value = "";
      return;
    }
    setPendingAttachment(file);
    setToast(`Đã ghim ${file.name}.`);
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
      video.srcObject = stream;
      video.muted = true;
      video.playsInline = true;
      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => resolve();
      });
      await video.play();
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d")?.drawImage(video, 0, 0);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("capture-failed");
      setPendingAttachment(new File([blob], `screen-${Date.now()}.png`, { type: "image/png" }));
      setToast("Đã chụp màn hình và ghim vào chat.");
    } catch (error) {
      const name = error instanceof DOMException ? error.name : "";
      setToast(name === "NotAllowedError" || name === "AbortError" ? "Đã hủy chia sẻ màn hình." : "Không thể chụp màn hình.");
    } finally {
      stream?.getTracks().forEach((track) => track.stop());
    }
  };

  async function startRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { setToast("Hãy mở bằng Chrome hoặc Edge để dùng Google Web Speech."); return; }
    if (recognitionActiveRef.current || activityRef.current === "thinking" || activityRef.current === "speaking") return;
    if (!microphonePermissionRef.current && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
        microphonePermissionRef.current = true;
      } catch {
        voiceModeRef.current = false;
        setVoiceMode(false);
        setToast("Microphone đang bị chặn. Hãy cấp quyền cho trang rồi bật Voice lại.");
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
    recognition.onerror = () => { recognitionActiveRef.current = false; setListening(false); setActivity("idle"); setToast("Không thể truy cập microphone."); };
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      resultHandledRef.current = true;
      setInput(transcript);
      if (transcript) sendMessage(transcript, "voice");
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

  const toggleVoiceMode = async () => {
    if (voiceModeRef.current || listening) { stopVoice(); return; }
    setVoiceMode(true);
    voiceModeRef.current = true;
    setToast("Voice mode đã bật. T sẽ tự nghe lại sau mỗi câu.");
    await startRecognition();
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

  const visibleModules = MODULES.filter((module) => enabledModules.includes(module.id));
  const selectedModule = visibleModules.find((module) => module.id === activeModule) ?? visibleModules[0];

  const minimizePanel = (id: PanelId) => {
    if (id === "hub") setHubMinimized(true);
    if (id === "history") setHistoryMinimized(true);
    if (id === "settings") setSettingsMinimized(true);
  };

  const restorePanel = (id: PanelId) => {
    if (id === "hub") { setHubOpen(true); setHubMinimized(false); }
    if (id === "history") { setHistoryOpen(true); setHistoryMinimized(false); }
    if (id === "settings") { setSettingsOpen(true); setSettingsMinimized(false); }
  };

  const closePanel = (id: PanelId) => {
    if (id === "hub") { setHubOpen(false); setHubMinimized(false); }
    if (id === "history") { setHistoryOpen(false); setHistoryMinimized(false); }
    if (id === "settings") { setSettingsOpen(false); setSettingsMinimized(false); }
  };

  const minimizedPanels: PanelId[] = [
    ...(hubOpen && hubMinimized ? ["hub" as const] : []),
    ...(historyOpen && historyMinimized ? ["history" as const] : []),
    ...(settingsOpen && settingsMinimized ? ["settings" as const] : [])
  ];

  const toggleModule = (id: ModuleId) => {
    setEnabledModules((current) => current.includes(id) ? current.filter((moduleId) => moduleId !== id) : [...current, id]);
  };

  const toggleHistory = () => {
    if (historyMinimized) { restorePanel("history"); return; }
    setHistoryOpen((current) => !current);
  };

  const toggleSettings = () => {
    if (settingsMinimized) { restorePanel("settings"); return; }
    setSettingsOpen((current) => !current);
  };

  const toggleHub = () => {
    if (hubMinimized) { restorePanel("hub"); return; }
    setHubOpen((current) => !current);
  };

  return (
    <div className="hud-overlay" aria-label="J-Core AI interface">
      <nav className="hud-edge-rail" aria-label="Cửa sổ đang thu nhỏ">
        {minimizedPanels.map((id, index) => (
          <button
            className="edge-tab"
            key={id}
            type="button"
            style={{ "--tab-index": index } as CSSProperties}
            onClick={() => restorePanel(id)}
          >
            <span>{PANEL_LABELS[id]}</span>
            <Icon name={id === "history" ? "chat" : id === "settings" ? "settings" : "hub"} />
          </button>
        ))}
      </nav>

      <nav className="hud-dock" aria-label="Điều khiển giao diện">
        <button className={hubOpen ? "active" : ""} type="button" aria-label="Mo activity hub" onClick={toggleHub}><Icon name="hub" /></button>
        <button className={historyOpen ? "active" : ""} type="button" aria-label="Mở lịch sử chat" onClick={toggleHistory}><Icon name="chat" /></button>
        <button className={settingsOpen ? "active" : ""} type="button" aria-label="Mở cài đặt" onClick={toggleSettings}><Icon name="settings" /></button>
        <button type="button" aria-label="Reset góc nhìn" onClick={onResetView}><Icon name="reset" /></button>
      </nav>

      {hubOpen && !hubMinimized && (
        <aside ref={hubDrag.panelRef} className="activity-hub draggable-panel" style={{ transform: `translate3d(${hubDrag.offset.x}px, ${hubDrag.offset.y}px, 0)` }} aria-label="Activity hub">
          <div className="hub-title panel-drag-handle" {...hubDrag.dragHandleProps} onDoubleClick={hubDrag.resetPosition}>
            <div className="hub-title-copy">
              <span>OPERATOR HUB</span>
              <b>{activity === "speaking" ? "RESPONDING" : activity === "thinking" ? "ANALYZING" : activity === "listening" ? "LISTENING" : "STANDBY"}</b>
            </div>
            <div className="panel-actions hub-actions">
              <button type="button" aria-label="Thu nhỏ Operator Hub vào thanh trái" onClick={() => minimizePanel("hub")}><Icon name="minimize" /></button>
              <button type="button" aria-label="Đóng Operator Hub" onClick={() => closePanel("hub")}><Icon name="close" /></button>
            </div>
          </div>
          <div className="hub-orbit-map" aria-hidden="true">
            <i />
            <i />
            <i />
            <b />
          </div>
          <div className="hub-module-workspace">
            {visibleModules.length > 0 ? (
              <>
                <div className="hub-module-tabs" role="tablist" aria-label="Module đang bật">
                  {visibleModules.map((module) => (
                    <button
                      aria-selected={selectedModule?.id === module.id}
                      className={selectedModule?.id === module.id ? "active" : ""}
                      key={module.id}
                      role="tab"
                      style={{ "--module-color": module.color, "--module-rgb": module.rgb } as CSSProperties}
                      type="button"
                      onClick={() => setActiveModule(module.id)}
                    >
                      <i />{module.label}
                    </button>
                  ))}
                </div>
                {selectedModule && (
                  <section className="hub-module-detail" style={{ "--module-color": selectedModule.color, "--module-rgb": selectedModule.rgb } as CSSProperties}>
                    <span>{selectedModule.realm}</span>
                    <b>{selectedModule.status}</b>
                    <p>{selectedModule.description}</p>
                    <div className="hub-module-features">
                      {selectedModule.features.map((feature) => <small key={feature}><i />{feature}</small>)}
                    </div>
                  </section>
                )}
              </>
            ) : (
              <div className="hub-module-empty"><b>CHƯA BẬT MODULE</b><p>Mở Settings để chọn module hiển thị tại Operator Hub.</p></div>
            )}
          </div>
        </aside>
      )}

      {historyOpen && !historyMinimized && (
        <aside ref={historyDrag.panelRef} className="history-panel draggable-panel" style={{ transform: `translate3d(${historyDrag.offset.x}px, ${historyDrag.offset.y}px, 0)` }} aria-label="Lịch sử chat">
          <div className="panel-head panel-drag-handle" {...historyDrag.dragHandleProps} onDoubleClick={historyDrag.resetPosition}>
            <div><i className={`status-dot ${activity}`} /><span>ĐỐI THOẠI</span></div>
            <div className="panel-actions">
              <button type="button" aria-label="Copy lịch sử" onClick={copyContext}><Icon name="copy" /></button>
              <button type="button" aria-label="Xóa lịch sử" onClick={clearChat}><Icon name="trash" /></button>
              <button type="button" aria-label="Thu nhỏ chat vào thanh trái" onClick={() => minimizePanel("history")}><Icon name="minimize" /></button>
              <button type="button" aria-label="Đóng lịch sử" onClick={() => closePanel("history")}><Icon name="close" /></button>
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

      {settingsOpen && !settingsMinimized && (
        <aside ref={settingsDrag.panelRef} className="settings-panel draggable-panel" style={{ transform: `translate3d(${settingsDrag.offset.x}px, ${settingsDrag.offset.y}px, 0)` }} aria-label="Cài đặt">
          <div className="settings-hero panel-drag-handle" {...settingsDrag.dragHandleProps} onDoubleClick={settingsDrag.resetPosition}>
            <div><span>HỆ THỐNG</span><b>{voiceMode ? "VOICE ACTIVE" : "LOCAL MODE"}</b></div>
            <div className="panel-actions settings-window-actions">
              <button type="button" aria-label="Thu nhỏ cài đặt vào thanh trái" onClick={() => minimizePanel("settings")}><Icon name="minimize" /></button>
              <button type="button" aria-label="Đóng cài đặt" onClick={() => closePanel("settings")}><Icon name="close" /></button>
            </div>
          </div>
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
          <section className="settings-block module-settings">
            <div className="settings-block-head"><span>Module trong Operator Hub</span><small>{enabledModules.length}/{MODULES.length} bật</small></div>
            <div className="module-toggle-list">
              {MODULES.map((module) => {
                const enabled = enabledModules.includes(module.id);
                return (
                  <button
                    aria-pressed={enabled}
                    className={enabled ? "enabled" : ""}
                    key={module.id}
                    style={{ "--module-color": module.color, "--module-rgb": module.rgb } as CSSProperties}
                    type="button"
                    onClick={() => toggleModule(module.id)}
                  >
                    <i /><span><b>{module.label}</b><small>{module.realm}</small></span><em>{enabled ? "ON" : "OFF"}</em>
                  </button>
                );
              })}
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
        {pendingAttachment && <div className="legacy-attachment-tray"><span>{pendingAttachment.name}</span><button type="button" aria-label="Gỡ tệp đính kèm" onClick={() => setPendingAttachment(null)}><Icon name="close" /></button></div>}
        <form className="prompt-shell prompt-shell-with-tools" onSubmit={submit}>
          <button className={voiceMode || listening ? "listening" : ""} type="button" aria-label="Bật chế độ giọng nói" onClick={toggleVoiceMode}><Icon name="mic" /></button>
          <div className="legacy-chat-tools" aria-label="Công cụ chat">
            <button type="button" aria-label="Ghim một tệp hoặc hình ảnh" onClick={chooseAttachment}><Icon name="attach" /></button>
            <button type="button" aria-label="Chia sẻ và chụp màn hình" onClick={captureSharedScreen}><Icon name="screen" /></button>
          </div>
          <input ref={attachmentInputRef} className="attachment-input" type="file" accept="image/*,.pdf,.txt,.md,.csv,.json,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip" aria-label="Chọn tệp đính kèm" onChange={handleAttachmentChange} />
          <label className="sr-only" htmlFor="jcore-command">Nhập tin nhắn</label>
          <input id="jcore-command" placeholder="Nói hoặc nhập lệnh..." value={input} onChange={(event) => setInput(event.target.value)} />
          <button type="submit" aria-label="Gửi tin nhắn" disabled={!input.trim() && !pendingAttachment}><Icon name="send" /></button>
        </form>
        <p aria-live="polite">{toast}</p>
      </section>
    </div>
  );
}
