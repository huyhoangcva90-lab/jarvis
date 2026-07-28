import { FormEvent, type ChangeEvent, type PointerEvent as ReactPointerEvent, type ReactNode, type WheelEvent as ReactWheelEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AiActivity, EnergyPalette } from "../../App";
import { gatewayFetch, getGatewayReply } from "../../utils/gatewayClient.js";
import { useStoneState } from "../../utils/stoneState.jsx";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  at: number;
};

type Palette = EnergyPalette;
type IconName = "hub" | "chat" | "settings" | "reset" | "external" | "copy" | "trash" | "close" | "minimize" | "maximize" | "mic" | "attach" | "screen" | "send" | "terminal" | "agents" | "router" | "media" | "document";

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
  blue: "Stark Tech",
  green: "Agamotto Time",
  red: "Reality Legacy",
  violet: "Power Lattice",
  orange: "Cosmic Soul"
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
    send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
    terminal: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="m7 9 3 3-3 3M13 15h4" /></>,
    agents: <><circle cx="12" cy="8" r="3" /><path d="M6 20v-2a6 6 0 0 1 12 0v2M5 9H3v6h2M19 9h2v6h-2" /></>,
    router: <><circle cx="5" cy="6" r="2" /><circle cx="19" cy="6" r="2" /><circle cx="12" cy="18" r="2" /><path d="m7 7 4 9M17 7l-4 9M7 6h10" /></>,
    media: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m10 9 5 3-5 3Z" /></>,
    document: <><path d="M6 3h8l4 4v14H6Z" /><path d="M14 3v5h5M9 12h6M9 16h6" /></>
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

type OsWindowProps = {
  title: string;
  code: string;
  children: ReactNode;
  drag: ReturnType<typeof usePanelDrag>;
  minimized: boolean;
  active: boolean;
  className?: string;
  onActivate: () => void;
  onClose: () => void;
  onToggleMinimize: () => void;
};

function OsWindow({
  title,
  code,
  children,
  drag,
  minimized,
  active,
  className = "",
  onActivate,
  onClose,
  onToggleMinimize,
}: OsWindowProps) {
  if (minimized) return null;

  return (
    <aside
      ref={drag.panelRef}
      className={`os-window draggable-panel ${minimized ? "is-minimized" : ""} ${active ? "is-active" : ""} ${className}`}
      style={{ transform: `translate3d(${drag.offset.x}px, ${drag.offset.y}px, 0)` }}
      aria-label={title}
      onPointerDown={onActivate}
    >
      <div
        className="os-window-head panel-drag-handle"
        {...drag.dragHandleProps}
        onDoubleClick={drag.resetPosition}
        onWheel={(event) => {
          if (window.innerWidth <= 760 || event.deltaY < 24) return;
          event.preventDefault();
          event.stopPropagation();
          onToggleMinimize();
        }}
      >
        <div className="os-window-title">
          <span>{code}</span>
          <b>{title}</b>
        </div>
        <div className="panel-actions">
          <button type="button" aria-label={`Thu nhỏ ${title}`} onClick={onToggleMinimize}>
            <Icon name="minimize" />
          </button>
          <button type="button" aria-label={`Đóng ${title}`} onClick={onClose}><Icon name="close" /></button>
        </div>
      </div>
      <div className="os-window-body">{children}</div>
    </aside>
  );
}

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const intelDocuments = [
  {
    id: "gateway",
    code: "DOC-01",
    title: "Gateway Protocol",
    summary: "Luồng kết nối an toàn của J-Core.",
    sections: [
      ["ROUTE", "Mọi yêu cầu AI đi qua HTTPS Gateway; trình duyệt không gọi trực tiếp upstream."],
      ["AUTH", "Gateway token được gửi bằng header và không hiển thị trong log giao diện."],
      ["HEALTH", "Dùng Terminal với lệnh scan để kiểm tra Gateway, Hermes, OpenClaw và 9Router."],
    ],
  },
  {
    id: "shortcuts",
    code: "DOC-02",
    title: "Operator Shortcuts",
    summary: "Bản đồ điều khiển nhanh cửa sổ.",
    sections: [
      ["ALT + 1…7", "Mở System, Chat, Terminal, Agents, Router, Gateway và Intel Library."],
      ["DRAG", "Kéo thanh tiêu đề để di chuyển; nhấp đúp thanh tiêu đề để trả về vị trí gốc."],
      ["MOBILE", "Trên màn hình nhỏ, cửa sổ tự khóa vào vùng an toàn để tránh thao tác nhầm."],
    ],
  },
  {
    id: "defense",
    code: "DOC-03",
    title: "Defense Rules",
    summary: "Quy tắc vận hành hacker có trách nhiệm.",
    sections: [
      ["SCOPE", "Chỉ kiểm thử hệ thống, tài khoản và dữ liệu mà operator được phép truy cập."],
      ["SECRETS", "Không dán token, mật khẩu hoặc khóa riêng tư vào video, chat hay tài liệu công khai."],
      ["TERMINAL", "Terminal trong J-Core là môi trường allowlist, không thực thi shell thật trên máy chủ."],
    ],
  },
  {
    id: "mission",
    code: "DOC-04",
    title: "Mission Playbook",
    summary: "Quy trình xử lý một tín hiệu mới.",
    sections: [
      ["01 / OBSERVE", "Thu thập trạng thái và ghi nhận dấu hiệu mà không làm thay đổi hệ thống."],
      ["02 / VERIFY", "Đối chiếu nguồn, kiểm tra health và xác nhận phạm vi được phép."],
      ["03 / ACT", "Thực hiện thay đổi nhỏ, có thể hoàn tác và kiểm tra lại sau mỗi bước."],
    ],
  },
] as const;

function extractYouTubeId(value: string) {
  const candidate = value.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(candidate)) return candidate;
  try {
    const parsed = new URL(candidate);
    const hostname = parsed.hostname.replace(/^www\./, "");
    let id = "";
    if (hostname === "youtu.be") id = parsed.pathname.split("/").filter(Boolean)[0] || "";
    if (hostname.endsWith("youtube.com") || hostname.endsWith("youtube-nocookie.com")) {
      id = parsed.searchParams.get("v") || parsed.pathname.match(/\/(?:embed|shorts)\/([a-zA-Z0-9_-]{11})/)?.[1] || "";
    }
    return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
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
    return JSON.parse(raw) as { messages?: Message[]; palette?: Palette; voiceReply?: boolean; handsFree?: boolean; advisorMode?: boolean };
  } catch {
    return null;
  }
}

type HudOverlayProps = {
  currentTime: string;
  data: any;
  palette: EnergyPalette;
  updateData: (patch: any) => void;
  onActivityChange: (activity: AiActivity) => void;
  onPaletteChange: (palette: EnergyPalette) => void;
  onResetView: () => void;
};

export default function HudOverlay({ currentTime, data, palette, updateData, onActivityChange, onPaletteChange, onResetView }: HudOverlayProps) {
  const initial = useMemo(() => (typeof window === "undefined" ? null : loadState()), []);
  const { connections } = useStoneState() as {
    connections: {
      gateway: boolean;
      hermes: boolean;
      openclaw: boolean;
      nineRouter: boolean;
      claude: boolean;
      error?: string | null;
    };
  };
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(
    () => initial?.messages?.length ? initial.messages : [{ id: createId(), role: "assistant", text: "Giao diện J-Core đã sẵn sàng. Đang kiểm tra kết nối Gateway và Hermes.", at: Date.now() }]
  );

  const [voiceReply, setVoiceReply] = useState(initial?.voiceReply ?? true);
  const [handsFree, setHandsFree] = useState(initial?.handsFree ?? false);
  const [advisorMode, setAdvisorMode] = useState(initial?.advisorMode ?? true);
  const [voiceMode, setVoiceMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(() => typeof window !== "undefined" && window.innerWidth > 760);
  const [hubOpen, setHubOpen] = useState(() => typeof window !== "undefined" && window.innerWidth > 980);
  const [historyMinimized, setHistoryMinimized] = useState(false);
  const [hubMinimized, setHubMinimized] = useState(false);
  const [settingsMinimized, setSettingsMinimized] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [agentsOpen, setAgentsOpen] = useState(false);
  const [routerOpen, setRouterOpen] = useState(false);
  const [intelOpen, setIntelOpen] = useState(false);
  const [terminalMinimized, setTerminalMinimized] = useState(false);
  const [agentsMinimized, setAgentsMinimized] = useState(false);
  const [routerMinimized, setRouterMinimized] = useState(false);
  const [intelMinimized, setIntelMinimized] = useState(false);
  const [activeWindow, setActiveWindow] = useState("chat");
  const [intelMode, setIntelMode] = useState<"youtube" | "docs">("youtube");
  const [selectedIntelDocument, setSelectedIntelDocument] = useState("gateway");
  const [youtubeDraft, setYoutubeDraft] = useState("https://www.youtube.com/watch?v=ciNHn38EyRc");
  const [youtubeVideoId, setYoutubeVideoId] = useState("ciNHn38EyRc");
  const [youtubeError, setYoutubeError] = useState("");
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLines, setTerminalLines] = useState([
    "J-CORE KERNEL 0.2 // operator shell",
    "Restricted command environment ready.",
    "Type 'help' to list commands.",
  ]);
  const [pendingAttachment, setPendingAttachment] = useState<File | null>(null);
  const [listening, setListening] = useState(false);
  const [activity, setActivity] = useState<AiActivity>("idle");
  const [toast, setToast] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [gatewayTest, setGatewayTest] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [gatewayDraft, setGatewayDraft] = useState(data.endpoints?.gateway || "");
  const [gatewayTokenDraft, setGatewayTokenDraft] = useState(data.endpoints?.gatewayToken || "");
  const recognitionRef = useRef<any>(null);
  const voiceModeRef = useRef(false);
  const recognitionActiveRef = useRef(false);
  const microphonePermissionRef = useRef(false);
  const activityRef = useRef<AiActivity>("idle");
  const manualStopRef = useRef(false);
  const resultHandledRef = useRef(false);
  const requestControllerRef = useRef<AbortController | null>(null);
  const idleTimer = useRef<number | null>(null);
  const restartTimer = useRef<number | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const hubDrag = usePanelDrag();
  const historyDrag = usePanelDrag();
  const settingsDrag = usePanelDrag();
  const terminalDrag = usePanelDrag();
  const agentsDrag = usePanelDrag();
  const routerDrag = usePanelDrag();
  const intelDrag = usePanelDrag();

  const minimizeFromWheel = useCallback((event: ReactWheelEvent<HTMLElement>, minimize: () => void) => {
    if (window.innerWidth <= 760 || event.deltaY < 24) return;
    event.preventDefault();
    event.stopPropagation();
    minimize();
  }, []);

  useEffect(() => {
    document.body.dataset.palette = palette;
    onPaletteChange(palette);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, palette, voiceReply, handsFree, advisorMode }));
  }, [advisorMode, handsFree, messages, onPaletteChange, palette, voiceReply]);

  useEffect(() => onActivityChange(activity), [activity, onActivityChange]);
  useEffect(() => {
    setGatewayDraft(data.endpoints?.gateway || "");
    setGatewayTokenDraft(data.endpoints?.gatewayToken || "");
  }, [data.endpoints?.gateway, data.endpoints?.gatewayToken]);
  useEffect(() => { activityRef.current = activity; }, [activity]);
  useEffect(() => { voiceModeRef.current = voiceMode; }, [voiceMode]);
  useEffect(() => { messageEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);
  useEffect(() => () => {
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    if (restartTimer.current) window.clearTimeout(restartTimer.current);
    requestControllerRef.current?.abort();
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

  const sendMessage = async (value = input, source: "text" | "voice" = "text") => {
    const trimmed = value.trim();
    if ((!trimmed && !pendingAttachment) || isSending) return;
    if (source === "voice" && advisorMode && !shouldAnswerVoice(trimmed)) {
      setInput("");
      setActivity("idle");
      setToast("Đã nghe, chưa cần phản hồi.");
      scheduleVoiceRestart(1500);
      return;
    }
    const messageText = trimmed || `Đã ghim ${pendingAttachment?.name ?? "tệp"}.`;
    const userMessage = { id: createId(), role: "user" as const, text: messageText, at: Date.now() };
    const requestMessages = [...messages, userMessage].slice(-30);
    setMessages((current) => [...current, userMessage].slice(-80));
    setInput("");
    setPendingAttachment(null);
    setHistoryOpen(true);
    setActivity("thinking");
    setIsSending(true);

    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;

    try {
      const response: any = await gatewayFetch(data, "/api/ai/chat", {
        method: "POST",
        timeoutMs: 60000,
        signal: controller.signal,
        body: JSON.stringify({
          message: messageText,
          messages: requestMessages.map((message) => ({ role: message.role, content: message.text })),
          operator: data?.username || "Operator",
          attachment: pendingAttachment ? { name: pendingAttachment.name, type: pendingAttachment.type, size: pendingAttachment.size } : null,
        }),
      });
      const replyText = getGatewayReply(response);
      if (response.source === "mock") {
        throw new Error(replyText || "Chưa có AI upstream nào được cấu hình trên gateway.");
      }
      if (!replyText) throw new Error("AI upstream phản hồi nhưng không có nội dung.");
      const reply = { id: createId(), role: "assistant" as const, text: replyText, at: Date.now() };
      setMessages((current) => [...current, reply].slice(-80));
      speak(reply.text);
    } catch (error) {
      if (controller.signal.aborted) return;
      const message = error instanceof Error ? error.message : "Không thể kết nối AI upstream.";
      const reply = {
        id: createId(),
        role: "assistant" as const,
        text: `AI link đang lỗi: ${message}`,
        at: Date.now(),
      };
      setMessages((current) => [...current, reply].slice(-80));
      setActivity("idle");
      setToast("Không thể nhận phản hồi từ AI upstream.");
      scheduleVoiceRestart(1800);
    } finally {
      if (requestControllerRef.current === controller) requestControllerRef.current = null;
      setIsSending(false);
    }
  };

  const submit = (event: FormEvent) => { event.preventDefault(); void sendMessage(); };

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
    setMessages([{ id: createId(), role: "assistant", text: "Lịch sử đã được xóa. J-Core đang kiểm tra lại kết nối gateway.", at: Date.now() }]);
  };

  const testGateway = async () => {
    setGatewayTest("testing");
    const endpoints = {
      ...data.endpoints,
      gateway: gatewayDraft.trim(),
      gatewayToken: gatewayTokenDraft.trim(),
    };
    updateData({ endpoints });
    try {
      await gatewayFetch({ ...data, endpoints }, "/health", { method: "GET", timeoutMs: 7000 });
      setGatewayTest("success");
      setToast("Gateway đã kết nối.");
    } catch {
      setGatewayTest("error");
      setToast("Gateway hoặc token không hợp lệ.");
    }
  };

  const moduleStatus = useMemo(
    () => [
      { label: "GATEWAY", value: connections.gateway ? "ONLINE" : "OFFLINE", detail: data.endpoints?.gateway || "Chưa cấu hình", tone: connections.gateway ? "online" : "offline" },
      { label: "HERMES", value: connections.hermes ? "AI READY" : "OFFLINE", detail: "Chat orchestrator qua gateway", tone: connections.hermes ? "online" : "offline" },
      { label: "OPENCLAW", value: connections.openclaw ? "ONLINE" : "OFFLINE", detail: "Agent workforce upstream", tone: connections.openclaw ? "online" : "offline" },
      { label: "9ROUTER", value: connections.nineRouter ? "ONLINE" : "OFFLINE", detail: "Multi-model routing upstream", tone: connections.nineRouter ? "online" : "offline" },
      { label: "CLAUDE", value: connections.claude ? "AI READY" : "OFFLINE", detail: "Optional local Claude bridge", tone: connections.claude ? "online" : "offline" },
      { label: "VOICE", value: voiceMode ? "OPEN CHANNEL" : "STANDBY", detail: advisorMode ? "Co van, loc cau vu vo" : "Phan hoi moi cau nghe duoc" },
      { label: "MODE", value: paletteLabels[palette].toUpperCase(), detail: "Orb doi mau va cau truc" },
      { label: "MEMORY", value: `${messages.length} LOGS`, detail: "Luu cuc bo trong trinh duyet" }
    ],
    [advisorMode, connections.claude, connections.gateway, connections.hermes, connections.nineRouter, connections.openclaw, data.endpoints?.gateway, messages.length, palette, voiceMode]
  );

  const pushTerminal = (lines: string | string[]) => {
    const nextLines = Array.isArray(lines) ? lines : [lines];
    setTerminalLines((current) => [...current, ...nextLines].slice(-80));
  };

  const openOsWindow = useCallback((windowId: string) => {
    setActiveWindow(windowId);
    if (windowId === "system") {
      setHubOpen(true);
      setHubMinimized(false);
    }
    if (windowId === "chat") {
      setHistoryOpen(true);
      setHistoryMinimized(false);
    }
    if (windowId === "settings") {
      setSettingsOpen(true);
      setSettingsMinimized(false);
    }
    if (windowId === "terminal") {
      setTerminalOpen(true);
      setTerminalMinimized(false);
    }
    if (windowId === "agents") {
      setAgentsOpen(true);
      setAgentsMinimized(false);
    }
    if (windowId === "router") {
      setRouterOpen(true);
      setRouterMinimized(false);
    }
    if (windowId === "intel") {
      setIntelOpen(true);
      setIntelMinimized(false);
    }
  }, []);

  const activeIntelDocument = useMemo(
    () => intelDocuments.find((document) => document.id === selectedIntelDocument) || intelDocuments[0],
    [selectedIntelDocument]
  );

  const loadYouTubeVideo = (event: FormEvent) => {
    event.preventDefault();
    const videoId = extractYouTubeId(youtubeDraft);
    if (!videoId) {
      setYoutubeError("URL không hợp lệ. Hãy dán link YouTube, Shorts hoặc video ID gồm 11 ký tự.");
      return;
    }
    setYoutubeVideoId(videoId);
    setYoutubeError("");
  };

  const runTerminal = async (event: FormEvent) => {
    event.preventDefault();
    const raw = terminalInput.trim();
    if (!raw) return;
    const [command, ...args] = raw.toLowerCase().split(/\s+/);
    pushTerminal(`operator@j-core:~$ ${raw}`);
    setTerminalInput("");

    if (command === "clear") {
      setTerminalLines([]);
      return;
    }
    if (command === "help") {
      pushTerminal([
        "help              danh sách lệnh",
        "status            trạng thái gateway/upstream",
        "scan              quét health qua gateway",
        "open <app>        system|chat|agents|router|settings|intel",
        "whoami            thông tin operator",
        "date              thời gian hệ thống",
        "clear             xóa terminal",
      ]);
      return;
    }
    if (command === "status") {
      pushTerminal([
        `gateway   ${connections.gateway ? "ONLINE" : "OFFLINE"}`,
        `hermes    ${connections.hermes ? "READY" : "OFFLINE"}`,
        `openclaw  ${connections.openclaw ? "ONLINE" : "OFFLINE"}`,
        `9router   ${connections.nineRouter ? "ONLINE" : "OFFLINE"}`,
      ]);
      return;
    }
    if (command === "whoami") {
      pushTerminal(`${data.username || "Operator"} // authenticated local operator`);
      return;
    }
    if (command === "date") {
      pushTerminal(new Date().toLocaleString("vi-VN"));
      return;
    }
    if (command === "open") {
      const app = args[0] || "";
      const target = app === "gateway" ? "settings" : app;
      if (["system", "chat", "agents", "router", "settings", "terminal", "intel"].includes(target)) {
        openOsWindow(target);
        pushTerminal(`Window '${target}' opened.`);
      } else {
        pushTerminal("Unknown app. Use: system, chat, agents, router, settings, intel.");
      }
      return;
    }
    if (command === "scan") {
      pushTerminal("Scanning gateway...");
      try {
        const health: any = await gatewayFetch(data, "/health", { method: "GET", timeoutMs: 7000 });
        const rows = Object.entries(health.services || {}).map(([name, service]: [string, any]) =>
          `${name.padEnd(10)} ${service.online && service.configured !== false ? "READY" : "NOT READY"}  ${service.latencyMs ?? "-"}ms`
        );
        pushTerminal(rows.length ? rows : "Gateway returned no service data.");
      } catch (error) {
        pushTerminal(`SCAN FAILED: ${error instanceof Error ? error.message : "unknown error"}`);
      }
      return;
    }
    pushTerminal(`Command not found: ${command}. Type 'help'.`);
  };

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (!event.altKey) return;
      const shortcuts: Record<string, string> = {
        "1": "system",
        "2": "chat",
        "3": "terminal",
        "4": "agents",
        "5": "router",
        "6": "settings",
        "7": "intel",
      };
      const target = shortcuts[event.key];
      if (!target) return;
      event.preventDefault();
      openOsWindow(target);
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [openOsWindow]);

  const toggleHistory = () => {
    if (!historyOpen || historyMinimized) {
      setHistoryOpen(true);
      setHistoryMinimized(false);
    } else {
      setHistoryOpen(false);
    }
    setActiveWindow("chat");
  };

  const toggleSettings = () => {
    if (!settingsOpen || settingsMinimized) {
      setSettingsOpen(true);
      setSettingsMinimized(false);
    } else {
      setSettingsOpen(false);
    }
    setActiveWindow("settings");
  };

  const toggleHub = () => {
    if (!hubOpen || hubMinimized) {
      setHubOpen(true);
      setHubMinimized(false);
    } else {
      setHubOpen(false);
    }
    setActiveWindow("system");
  };

  const minimizedWindows = ([
    hubOpen && hubMinimized ? { id: "system", label: "System Monitor", code: "SYS", icon: "hub" } : null,
    historyOpen && historyMinimized ? { id: "chat", label: "Neural Chat", code: "CHAT", icon: "chat" } : null,
    terminalOpen && terminalMinimized ? { id: "terminal", label: "Restricted Terminal", code: "TERM", icon: "terminal" } : null,
    agentsOpen && agentsMinimized ? { id: "agents", label: "Agent Matrix", code: "AGNT", icon: "agents" } : null,
    routerOpen && routerMinimized ? { id: "router", label: "Router Matrix", code: "ROUT", icon: "router" } : null,
    intelOpen && intelMinimized ? { id: "intel", label: "Intel Library", code: "INTL", icon: "media" } : null,
    settingsOpen && settingsMinimized ? { id: "settings", label: "Gateway Settings", code: "GATE", icon: "settings" } : null,
  ] as Array<{ id: string; label: string; code: string; icon: IconName } | null>)
    .filter((item): item is { id: string; label: string; code: string; icon: IconName } => Boolean(item));

  return (
    <div className="hud-overlay" aria-label="J-Core AI interface">
      <nav className="os-taskbar" aria-label="J-Core OS taskbar">
        <button className="os-start" type="button" aria-label="Mở System Core" onClick={() => openOsWindow("system")}>
          <span>J</span><b>J-CORE OS</b>
        </button>
        <div className="os-app-strip">
          <button className={hubOpen ? "active" : ""} type="button" aria-label="Mở System Monitor" onClick={toggleHub}><Icon name="hub" /><span>System</span></button>
          <button className={historyOpen ? "active" : ""} type="button" aria-label="Mở Neural Chat" onClick={toggleHistory}><Icon name="chat" /><span>Chat</span></button>
          <button className={terminalOpen ? "active" : ""} type="button" aria-label="Mở Terminal" onClick={() => openOsWindow("terminal")}><Icon name="terminal" /><span>Terminal</span></button>
          <button className={agentsOpen ? "active" : ""} type="button" aria-label="Mở Agent Matrix" onClick={() => openOsWindow("agents")}><Icon name="agents" /><span>Agents</span></button>
          <button className={routerOpen ? "active" : ""} type="button" aria-label="Mở Router Matrix" onClick={() => openOsWindow("router")}><Icon name="router" /><span>Router</span></button>
          <button className={intelOpen ? "active" : ""} type="button" aria-label="Mở Intel Library" onClick={() => openOsWindow("intel")}><Icon name="media" /><span>Intel</span></button>
          <button className={settingsOpen ? "active" : ""} type="button" aria-label="Mở Gateway Settings" onClick={toggleSettings}><Icon name="settings" /><span>Gateway</span></button>
        </div>
        <div className="os-tray">
          <button type="button" aria-label="Reset góc nhìn lõi" onClick={onResetView}><Icon name="reset" /></button>
          <span className={connections.gateway ? "online" : "offline"}>{connections.gateway ? "LINK" : "NO LINK"}</span>
          <time>{currentTime}</time>
        </div>
      </nav>

      {minimizedWindows.length > 0 && (
        <nav className="os-minimized-dock" aria-label="Cửa sổ đang thu nhỏ">
          <span>HIDDEN</span>
          {minimizedWindows.map((windowItem) => (
            <button
              type="button"
              key={windowItem.id}
              aria-label={`Khôi phục ${windowItem.label}`}
              title={`Khôi phục ${windowItem.label}`}
              onClick={() => openOsWindow(windowItem.id)}
            >
              <Icon name={windowItem.icon} />
              <b>{windowItem.code}</b>
            </button>
          ))}
        </nav>
      )}

      {hubOpen && !hubMinimized && (
        <aside ref={hubDrag.panelRef} className={`activity-hub draggable-panel ${hubMinimized ? "is-minimized" : ""} ${activeWindow === "system" ? "is-active" : ""}`} style={{ transform: `translate3d(${hubDrag.offset.x}px, ${hubDrag.offset.y}px, 0)` }} aria-label="Activity hub" onPointerDown={() => setActiveWindow("system")}>
          <div className="hub-title panel-drag-handle" {...hubDrag.dragHandleProps} onDoubleClick={hubDrag.resetPosition} onWheel={(event) => minimizeFromWheel(event, () => setHubMinimized(true))}>
            <div className="hub-title-copy">
              <span>OPERATOR HUB</span>
              <b>{activity === "speaking" ? "RESPONDING" : activity === "thinking" ? "ANALYZING" : activity === "listening" ? "LISTENING" : "STANDBY"}</b>
            </div>
            <div className="panel-actions hub-actions">
              <button type="button" aria-label="Minimize hub" onClick={() => setHubMinimized(true)}><Icon name="minimize" /></button>
              <button type="button" aria-label="Close hub" onClick={() => setHubOpen(false)}><Icon name="close" /></button>
            </div>
          </div>
          <div className="hub-orbit-map" aria-hidden="true">
            <i />
            <i />
            <i />
            <b />
          </div>
          <div className="hub-modules">
            {moduleStatus.map((item) => (
              <section className={`hub-module ${item.tone || ""}`} key={item.label}>
                <span>{item.label}</span>
                <b>{item.value}</b>
                <p>{item.detail}</p>
              </section>
            ))}
          </div>
        </aside>
      )}

      {historyOpen && !historyMinimized && (
        <aside ref={historyDrag.panelRef} className={`history-panel draggable-panel ${historyMinimized ? "is-minimized" : ""} ${activeWindow === "chat" ? "is-active" : ""}`} style={{ transform: `translate3d(${historyDrag.offset.x}px, ${historyDrag.offset.y}px, 0)` }} aria-label="Lịch sử chat" onPointerDown={() => setActiveWindow("chat")}>
          <div className="panel-head panel-drag-handle" {...historyDrag.dragHandleProps} onDoubleClick={historyDrag.resetPosition} onWheel={(event) => minimizeFromWheel(event, () => setHistoryMinimized(true))}>
            <div><i className={`status-dot ${activity}`} /><span>ĐỐI THOẠI</span></div>
            <div className="panel-actions">
              <button type="button" aria-label="Copy lịch sử" onClick={copyContext}><Icon name="copy" /></button>
              <button type="button" aria-label="Xóa lịch sử" onClick={clearChat}><Icon name="trash" /></button>
              <button type="button" aria-label="Thu nhỏ chat" onClick={() => setHistoryMinimized(true)}><Icon name="minimize" /></button>
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

      {settingsOpen && !settingsMinimized && (
        <aside ref={settingsDrag.panelRef} className={`settings-panel draggable-panel ${settingsMinimized ? "is-minimized" : ""} ${activeWindow === "settings" ? "is-active" : ""}`} style={{ transform: `translate3d(${settingsDrag.offset.x}px, ${settingsDrag.offset.y}px, 0)` }} aria-label="Cài đặt" onPointerDown={() => setActiveWindow("settings")}>
          <div className="settings-hero panel-drag-handle" {...settingsDrag.dragHandleProps} onDoubleClick={settingsDrag.resetPosition} onWheel={(event) => minimizeFromWheel(event, () => setSettingsMinimized(true))}>
            <div><span>HỆ THỐNG</span><b>{connections.gateway ? "GATEWAY ONLINE" : "GATEWAY OFFLINE"}</b></div>
            <div className="panel-actions settings-window-actions">
              <button type="button" aria-label="Thu nhỏ cài đặt" onClick={() => setSettingsMinimized(true)}><Icon name="minimize" /></button>
              <button type="button" aria-label="Đóng cài đặt" onClick={() => setSettingsOpen(false)}><Icon name="close" /></button>
            </div>
          </div>
          <section className="settings-block gateway-settings">
            <div className="settings-block-head">
              <span>Gateway Ubuntu</span>
              <button
                className={gatewayTest === "error" ? "danger" : "primary"}
                type="button"
                disabled={gatewayTest === "testing"}
                onClick={() => void testGateway()}
              >
                {gatewayTest === "testing" ? "Đang thử" : "Kiểm tra"}
              </button>
            </div>
            <label className="gateway-field">
              <span>Gateway URL</span>
              <input
                type="url"
                value={gatewayDraft}
                onChange={(event) => {
                  setGatewayDraft(event.target.value);
                  setGatewayTest("idle");
                }}
              />
            </label>
            <label className="gateway-field">
              <span>Device token</span>
              <input
                type="password"
                value={gatewayTokenDraft}
                placeholder="Nhập token gateway"
                onChange={(event) => {
                  setGatewayTokenDraft(event.target.value);
                  setGatewayTest("idle");
                }}
              />
            </label>
            <p className={`gateway-test-status ${gatewayTest}`}>
              {gatewayTest === "success"
                ? "Kết nối thành công."
                : gatewayTest === "error"
                ? "Không thể xác thực gateway."
                : connections.gateway
                ? "Health check đang hoạt động."
                : "Gateway chưa kết nối."}
            </p>
          </section>
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
            <button type="button" onClick={copyContext}><Icon name="copy" /><span>Copy ngữ cảnh</span></button>
            <button className="danger-text" type="button" onClick={clearChat}><Icon name="trash" /><span>Xóa lịch sử</span></button>
          </section>
        </aside>
      )}

      {terminalOpen && (
        <OsWindow
          title="Restricted Terminal"
          code="SYS://TERMINAL"
          drag={terminalDrag}
          minimized={terminalMinimized}
          active={activeWindow === "terminal"}
          className="terminal-os-window"
          onActivate={() => setActiveWindow("terminal")}
          onClose={() => setTerminalOpen(false)}
          onToggleMinimize={() => setTerminalMinimized(true)}
        >
          <div className="os-terminal-stream" aria-live="polite">
            {terminalLines.map((line, index) => <p key={`${index}-${line}`}>{line}</p>)}
          </div>
          <form className="os-terminal-input" onSubmit={(event) => void runTerminal(event)}>
            <span>operator@j-core:~$</span>
            <input
              value={terminalInput}
              onChange={(event) => setTerminalInput(event.target.value)}
              aria-label="Terminal command"
              autoComplete="off"
              spellCheck={false}
            />
            <button type="submit" aria-label="Chạy lệnh Terminal">RUN</button>
          </form>
        </OsWindow>
      )}

      {agentsOpen && (
        <OsWindow
          title="Agent Matrix"
          code="PWR://OPENCLAW"
          drag={agentsDrag}
          minimized={agentsMinimized}
          active={activeWindow === "agents"}
          className="agents-os-window"
          onActivate={() => setActiveWindow("agents")}
          onClose={() => setAgentsOpen(false)}
          onToggleMinimize={() => setAgentsMinimized(true)}
        >
          <div className="os-status-banner">
            <i className={connections.openclaw ? "online" : "offline"} />
            <div><span>WORKFORCE LINK</span><b>{connections.openclaw ? "OPERATIONAL" : "NOT READY"}</b></div>
          </div>
          <div className="os-data-grid">
            {[
              ["FRIDAY", "Orchestration", connections.hermes],
              ["OPENCLAW", "Agent runtime", connections.openclaw],
              ["HERMES", "Reasoning core", connections.hermes],
              ["CLAUDE", "Code/reasoning bridge", connections.claude],
              ["GATEWAY", "Secure transport", connections.gateway],
            ].map(([name, role, online]) => (
              <article className={online ? "online" : "offline"} key={String(name)}>
                <span>{String(role)}</span>
                <b>{String(name)}</b>
                <small>{online ? "READY" : "OFFLINE"}</small>
              </article>
            ))}
          </div>
          <p className="os-window-note">Mission dispatch dùng endpoint `/api/openclaw/task` qua gateway được bảo vệ.</p>
        </OsWindow>
      )}

      {routerOpen && (
        <OsWindow
          title="Router Matrix"
          code="SPC://9ROUTER"
          drag={routerDrag}
          minimized={routerMinimized}
          active={activeWindow === "router"}
          className="router-os-window"
          onActivate={() => setActiveWindow("router")}
          onClose={() => setRouterOpen(false)}
          onToggleMinimize={() => setRouterMinimized(true)}
        >
          <div className="router-flow" aria-label="Luồng định tuyến">
            <div><span>01</span><b>BROWSER</b><small>J-Core OS</small></div>
            <i>→</i>
            <div className={connections.gateway ? "online" : "offline"}><span>02</span><b>GATEWAY</b><small>HTTPS + token</small></div>
            <i>→</i>
            <div className={connections.nineRouter ? "online" : "offline"}><span>03</span><b>9ROUTER</b><small>Model routing</small></div>
          </div>
          <div className="router-diagnostics">
            <p><span>Transport</span><b>{connections.gateway ? "ENCRYPTED / READY" : "DISCONNECTED"}</b></p>
            <p><span>Routing core</span><b>{connections.nineRouter ? "AVAILABLE" : "NOT CONFIGURED"}</b></p>
            <p><span>Policy</span><b>GATEWAY ONLY</b></p>
          </div>
        </OsWindow>
      )}

      {intelOpen && (
        <OsWindow
          title="Intel Library"
          code="NET://KNOWLEDGE"
          drag={intelDrag}
          minimized={intelMinimized}
          active={activeWindow === "intel"}
          className="intel-os-window"
          onActivate={() => setActiveWindow("intel")}
          onClose={() => setIntelOpen(false)}
          onToggleMinimize={() => setIntelMinimized(true)}
        >
          <div className="intel-shell">
            <header className="intel-toolbar">
              <div className="intel-tabs" role="tablist" aria-label="Nguồn dữ liệu Intel">
                <button
                  type="button"
                  role="tab"
                  aria-label="YouTube"
                  aria-selected={intelMode === "youtube"}
                  className={intelMode === "youtube" ? "active" : ""}
                  onClick={() => setIntelMode("youtube")}
                >
                  <Icon name="media" /><span>YouTube</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-label="Tài liệu"
                  aria-selected={intelMode === "docs"}
                  className={intelMode === "docs" ? "active" : ""}
                  onClick={() => setIntelMode("docs")}
                >
                  <Icon name="document" /><span>Tài liệu</span>
                </button>
              </div>
              <div className="intel-secure-status"><i /><span>ISOLATED VIEWER</span></div>
            </header>

            {intelMode === "youtube" ? (
              <section className="intel-youtube" role="tabpanel" aria-label="YouTube viewer">
                <form className="intel-address-bar" onSubmit={loadYouTubeVideo}>
                  <label htmlFor="intel-youtube-url">YouTube URL / video ID</label>
                  <div>
                    <span>HTTPS://</span>
                    <input
                      id="intel-youtube-url"
                      value={youtubeDraft}
                      onChange={(event) => {
                        setYoutubeDraft(event.target.value);
                        if (youtubeError) setYoutubeError("");
                      }}
                      inputMode="url"
                      autoComplete="off"
                      spellCheck={false}
                    />
                    <button type="submit">LOAD</button>
                  </div>
                  {youtubeError && <p role="alert">{youtubeError}</p>}
                </form>

                <div className="intel-video-frame">
                  <div className="intel-frame-label"><span>LIVE MEDIA FEED</span><b>ID::{youtubeVideoId}</b></div>
                  <iframe
                    key={youtubeVideoId}
                    src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?rel=0`}
                    title="J-Core YouTube viewer"
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>

                <div className="intel-video-queries" aria-label="Tìm nhanh trên YouTube">
                  <span>SEARCH CHANNELS</span>
                  {[
                    ["Ethical hacking", "ethical+hacking+fundamentals"],
                    ["Network defense", "network+defense+fundamentals"],
                    ["AI security", "AI+security+fundamentals"],
                  ].map(([label, query]) => (
                    <button
                      type="button"
                      key={label}
                      onClick={() => window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank", "noopener,noreferrer")}
                    >
                      <Icon name="external" /><span>{label}</span>
                    </button>
                  ))}
                </div>
              </section>
            ) : (
              <section className="intel-docs" role="tabpanel" aria-label="Tài liệu nội bộ">
                <nav className="intel-doc-index" aria-label="Chỉ mục tài liệu">
                  <span>LOCAL ARCHIVE / {intelDocuments.length} FILES</span>
                  {intelDocuments.map((document) => (
                    <button
                      type="button"
                      key={document.id}
                      className={selectedIntelDocument === document.id ? "active" : ""}
                      aria-pressed={selectedIntelDocument === document.id}
                      onClick={() => setSelectedIntelDocument(document.id)}
                    >
                      <small>{document.code}</small>
                      <b>{document.title}</b>
                      <span>{document.summary}</span>
                    </button>
                  ))}
                </nav>
                <article className="intel-doc-viewer">
                  <header>
                    <span>{activeIntelDocument.code} / INTERNAL</span>
                    <h2>{activeIntelDocument.title}</h2>
                    <p>{activeIntelDocument.summary}</p>
                  </header>
                  <div>
                    {activeIntelDocument.sections.map(([label, content]) => (
                      <section key={label}>
                        <b>{label}</b>
                        <p>{content}</p>
                      </section>
                    ))}
                  </div>
                  <footer>J-CORE KNOWLEDGE NODE // READ-ONLY // LOCAL CACHE</footer>
                </article>
              </section>
            )}
          </div>
        </OsWindow>
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
          <button type="submit" aria-label="Gửi tin nhắn" disabled={isSending || (!input.trim() && !pendingAttachment)}><Icon name="send" /></button>
        </form>
        <p aria-live="polite">{toast}</p>
      </section>
    </div>
  );
}
