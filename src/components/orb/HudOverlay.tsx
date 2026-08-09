import { FormEvent, type ChangeEvent, type PointerEvent as ReactPointerEvent, type ReactNode, type WheelEvent as ReactWheelEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AiActivity, EnergyPalette } from "../../App";
import { gatewayBinaryFetch, gatewayFetch, getGatewayConfig, getGatewayReply } from "../../utils/gatewayClient.js";
import { useStoneState } from "../../utils/stoneState.jsx";
import { ORB_UI_STORAGE_KEY } from "../../utils/orbPreferences";
import { DEFAULT_NINEROUTER_MODEL, NINEROUTER_MODELS, getNineRouterModel } from "../../utils/nineRouterModels.js";
import {
  clearGatewayToken,
  isGatewayTokenRemembered,
  saveGatewayToken,
} from "../../utils/storage.js";
import DynamicHub from "./DynamicHub";
import ServiceDashboard from "./ServiceDashboard";
import AppConfigEditor from "./AppConfigEditor";
import ObsidianVaultPanel from "./ObsidianVaultPanel";
import UbuntuWorkspace from "./UbuntuWorkspace";
import OpenclawDashboard from "../openclawDashboard.jsx";
import NineRouterDashboard from "../nineRouterDashboard.jsx";
import SpiderPersonalHub from "./SpiderPersonalHub";
import {
  DEFAULT_HERMES_PROFILE_ID,
  HERMES_PROFILES,
  HermesProfileId,
  loadStoredHermesProfileId,
  mergeHermesProfiles,
  saveStoredHermesProfileId,
  type HermesProfile,
} from "../../utils/hermesProfiles";
import {
  HUB_TEMPLATES,
  createHubArtifact,
  hubDemoItems,
  hubTemplate,
  recoverHubArtifact,
  resolveHubArtifact,
  type HubArtifact,
  type HubKind,
} from "../../utils/hubRuntime";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  at: number;
};

type Palette = EnergyPalette;
type VoiceStyle = "female" | "male";
type ServiceKey = "hermes" | "claude";
type DashboardId = "workspace" | "terminal" | "agents" | "router" | "hermes" | "claude" | "intel";

const DASHBOARD_META: Record<DashboardId, { eyebrow: string; title: string }> = {
  workspace: { eyebrow: "JARVIS://HUB-RUNTIME", title: "Không gian hoạch định" },
  terminal: { eyebrow: "LOCAL://UBUNTU", title: "Ubuntu local" },
  agents: { eyebrow: "PWR://OPENCLAW", title: "OpenClaw & tác nhân" },
  router: { eyebrow: "SPC://9ROUTER", title: "9Router Control" },
  hermes: { eyebrow: "AI://HERMES", title: "Hermes Core" },
  claude: { eyebrow: "AI://CLAUDE", title: "Claude Bridge" },
  intel: { eyebrow: "NET://KNOWLEDGE", title: "Thư viện & Ubuntu Files" },
};
type ServicePanelState = {
  state: "idle" | "loading" | "ready" | "error";
  overview: any;
  error: string;
  prompt: string;
  reply: string;
  sending: boolean;
};
type IconName = "hub" | "chat" | "settings" | "reset" | "external" | "copy" | "trash" | "close" | "minimize" | "maximize" | "mic" | "attach" | "screen" | "send" | "terminal" | "agents" | "router" | "hermes" | "claude" | "media" | "document";

const EMPTY_SERVICE_PANEL: ServicePanelState = {
  state: "idle",
  overview: null,
  error: "",
  prompt: "",
  reply: "",
  sending: false,
};

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

const QUICK_COMMANDS = [
  { label: "Tình trạng", prompt: "Kiểm tra tình trạng hệ thống và báo ngắn gọn." },
  { label: "Lên kế hoạch", prompt: "Lập kế hoạch hành động cho mục tiêu hiện tại của tôi." },
  { label: "Phân tích", prompt: "Phân tích vấn đề tôi đang gặp và đề xuất bước tiếp theo." },
  { label: "Viết code", prompt: "Hỗ trợ tôi xử lý một tác vụ lập trình." },
];

const paletteLabels: Record<Palette, string> = {
  gold: "Gold Core",
  blue: "Spatial Tesseract",
  green: "Agamotto Oracle",
  red: "Aether Reality",
  violet: "Quantum Singularity",
  orange: "Stark / Jarvis",
  spider: "Spider 2099"
};

const HERMES_PROFILE_PALETTES: Record<HermesProfileId, EnergyPalette> = {
  jarvis: "orange",
  "ev-personal": "spider",
  "cadence-content": "violet",
  "code-architect": "blue",
  "security-auditor": "red",
};

const activityLabels: Record<AiActivity, string> = {
  idle: "Sẵn sàng",
  listening: "Đang lắng nghe",
  thinking: "Đang xử lý",
  speaking: "Đang phản hồi"
};

const VOICE_STYLE_LABELS: Record<VoiceStyle, string> = {
  female: "Nữ chuẩn",
  male: "Nam trầm",
};

function selectVietnameseVoice(style: VoiceStyle) {
  const voices = window.speechSynthesis?.getVoices?.() ?? [];
  const vietnamese = voices.filter((voice) => /^vi(?:-|_)/i.test(voice.lang));
  if (!vietnamese.length) return null;
  const preferred = style === "female"
    ? /hoai\s*my|hoài\s*my|female|woman|linh|mai|an\b/i
    : /nam\s*minh|male|man|duy|long/i;
  return [...vietnamese].sort((left, right) => {
    const score = (voice: SpeechSynthesisVoice) =>
      (voice.lang.toLowerCase() === "vi-vn" ? 6 : 0) +
      (preferred.test(voice.name) ? 8 : 0) +
      (voice.localService ? 2 : 0) +
      (/natural|neural/i.test(voice.name) ? 2 : 0);
    return score(right) - score(left);
  })[0] ?? null;
}

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
    hermes: <><path d="M12 3 5 7v5c0 4.7 2.8 7.5 7 9 4.2-1.5 7-4.3 7-9V7Z" /><path d="M9 9h6M9 13h6M12 9v7" /></>,
    claude: <><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" /><circle cx="12" cy="12" r="4" /></>,
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
      ["TERMINAL", "Terminal mặc định dùng allowlist; Private Ubuntu shell chỉ bật khi Gateway cho phép."],
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
    const raw = localStorage.getItem(ORB_UI_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as {
      messages?: Message[];
      palette?: Palette;
      voiceReply?: boolean;
      voiceStyle?: VoiceStyle;
      handsFree?: boolean;
      advisorMode?: boolean;
      hubArtifacts?: HubArtifact[];
      activeHubId?: string | null;
    };
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
  coreMinimized: boolean;
  onCoreMinimizedChange: (minimized: boolean) => void;
};

export default function HudOverlay({ currentTime, data, palette, updateData, onActivityChange, onPaletteChange, onResetView, coreMinimized, onCoreMinimizedChange }: HudOverlayProps) {
  const sameOriginSession = getGatewayConfig(data).sameOrigin;
  const initial = useMemo(() => (typeof window === "undefined" ? null : loadState()), []);
  const { connections } = useStoneState() as {
    connections: {
      gateway: boolean;
      hermes: boolean;
      openclaw: boolean;
      nineRouter: boolean;
      claude: boolean;
      latencyMs?: number | null;
      requestId?: string | null;
      services?: Record<string, {
        online?: boolean;
        latencyMs?: number;
        status?: number;
        configured?: boolean;
        circuit?: { state?: string };
      }>;
      error?: string | null;
    };
  };
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(
    () => initial?.messages?.length ? initial.messages : [{ id: createId(), role: "assistant", text: "Giao diện J-Core đã sẵn sàng. Đang kiểm tra kết nối Gateway và Hermes.", at: Date.now() }]
  );

  const [voiceReply, setVoiceReply] = useState(initial?.voiceReply ?? true);
  const [voiceStyle, setVoiceStyle] = useState<VoiceStyle>(initial?.voiceStyle ?? "female");
  const [handsFree, setHandsFree] = useState(initial?.handsFree ?? false);
  const [advisorMode, setAdvisorMode] = useState(initial?.advisorMode ?? true);
  const [voiceMode, setVoiceMode] = useState(false);
  const [voiceCapabilities, setVoiceCapabilities] = useState({ stt: false, tts: false });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(() => typeof window !== "undefined" && window.innerWidth > 760);
  const [hubOpen, setHubOpen] = useState(() => typeof window !== "undefined" && window.innerWidth > 980);
  const [historyMinimized, setHistoryMinimized] = useState(false);
  const [hubMinimized, setHubMinimized] = useState(false);
  const [settingsMinimized, setSettingsMinimized] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [agentsOpen, setAgentsOpen] = useState(false);
  const [routerOpen, setRouterOpen] = useState(false);
  const [hermesOpen, setHermesOpen] = useState(false);
  const [claudeOpen, setClaudeOpen] = useState(false);
  const [intelOpen, setIntelOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [terminalMinimized, setTerminalMinimized] = useState(false);
  const [agentsMinimized, setAgentsMinimized] = useState(false);
  const [routerMinimized, setRouterMinimized] = useState(false);
  const [hermesMinimized, setHermesMinimized] = useState(false);
  const [claudeMinimized, setClaudeMinimized] = useState(false);
  const [intelMinimized, setIntelMinimized] = useState(false);
  const [workspaceMinimized, setWorkspaceMinimized] = useState(false);
  const [focusedDashboard, setFocusedDashboard] = useState<DashboardId | null>(null);
  const [hubArtifacts, setHubArtifacts] = useState<HubArtifact[]>(() =>
    (initial?.hubArtifacts ?? []).map((artifact) =>
      artifact.status === "loading"
        ? recoverHubArtifact(artifact, "Phiên xử lý trước đã bị gián đoạn.")
        : artifact
    )
  );
  const [activeHubId, setActiveHubId] = useState<string | null>(() => initial?.activeHubId ?? initial?.hubArtifacts?.[0]?.id ?? null);
  const [activeWindow, setActiveWindow] = useState("chat");
  const [intelMode, setIntelMode] = useState<"youtube" | "docs" | "files" | "obsidian">("youtube");
  const [selectedIntelDocument, setSelectedIntelDocument] = useState("gateway");
  const [youtubeDraft, setYoutubeDraft] = useState("https://www.youtube.com/watch?v=ciNHn38EyRc");
  const [youtubeVideoId, setYoutubeVideoId] = useState("ciNHn38EyRc");
  const [youtubeError, setYoutubeError] = useState("");
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalMode, setTerminalMode] = useState<"local" | "pty">("local");
  const [terminalConnecting, setTerminalConnecting] = useState(false);
  const [terminalLines, setTerminalLines] = useState([
    "J-CORE LOCAL CONSOLE // không API",
    "Phiên này điều khiển giao diện local; file Ubuntu mở bằng quyền thư mục của trình duyệt.",
    "Gõ 'files' để kết nối Ubuntu, hoặc 'help' để xem lệnh.",
  ]);

  const [pendingAttachment, setPendingAttachment] = useState<File | null>(null);
  const [listening, setListening] = useState(false);
  const [activity, setActivity] = useState<AiActivity>("idle");
  const [toast, setToast] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [gatewayTest, setGatewayTest] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [gatewayTestMessage, setGatewayTestMessage] = useState("");
  const [gatewayHealth, setGatewayHealth] = useState<any>(null);
  const [gatewayDraft, setGatewayDraft] = useState(data.endpoints?.gateway || "");
  const [gatewayTokenDraft, setGatewayTokenDraft] = useState(data.endpoints?.gatewayToken || "");
  const [rememberGatewayToken, setRememberGatewayToken] = useState(() => isGatewayTokenRemembered());
  const [showGatewayToken, setShowGatewayToken] = useState(false);
  const [routerDashboardUrl, setRouterDashboardUrl] = useState("");
  const [routerDashboardState, setRouterDashboardState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [routerDashboardError, setRouterDashboardError] = useState("");
  const [routerModels, setRouterModels] = useState<Array<{ id?: string }>>([]);
  const [selectedHermesProfileId, setSelectedHermesProfileId] = useState<HermesProfileId>(() => {
    const configured = data?.ai?.hermesProfile;
    return configured ? configured as HermesProfileId : loadStoredHermesProfileId();
  });
  const [hermesProfiles, setHermesProfiles] = useState<HermesProfile[]>(HERMES_PROFILES);
  const [servicePanels, setServicePanels] = useState<Record<ServiceKey, ServicePanelState>>({
    hermes: { ...EMPTY_SERVICE_PANEL },
    claude: { ...EMPTY_SERVICE_PANEL },
  });
  const nineRouterModel = getNineRouterModel(data);
  const routerModelOptions = useMemo(() => {
    const discovered = routerModels
      .map((model) => String(model.id || "").trim())
      .filter(Boolean)
      .map((id) => ({ id, label: id, detail: "Model từ 9Router" }));
    const seen = new Set<string>();
    return [...discovered, ...NINEROUTER_MODELS].filter((model) => {
      if (seen.has(model.id)) return false;
      seen.add(model.id);
      return true;
    });
  }, [routerModels]);
  const recognitionRef = useRef<any>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const terminalSocketRef = useRef<WebSocket | null>(null);
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
  const hermesDrag = usePanelDrag();
  const claudeDrag = usePanelDrag();
  const intelDrag = usePanelDrag();
  const workspaceDrag = usePanelDrag();

  const minimizeFromWheel = useCallback((event: ReactWheelEvent<HTMLElement>, minimize: () => void) => {
    if (window.innerWidth <= 760 || event.deltaY < 24) return;
    event.preventDefault();
    event.stopPropagation();
    minimize();
  }, []);

  useEffect(() => {
    localStorage.setItem(ORB_UI_STORAGE_KEY, JSON.stringify({
      messages,
      palette,
      voiceReply,
      voiceStyle,
      handsFree,
      advisorMode,
      hubArtifacts,
      activeHubId,
    }));
  }, [activeHubId, advisorMode, handsFree, hubArtifacts, messages, palette, voiceReply, voiceStyle]);

  useEffect(() => onActivityChange(activity), [activity, onActivityChange]);
  useEffect(() => {
    if (palette !== "spider" || selectedHermesProfileId === "ev-personal") return;
    setSelectedHermesProfileId("ev-personal");
    saveStoredHermesProfileId("ev-personal");
    updateData({ ai: { ...(data.ai || {}), hermesProfile: "ev-personal" } });
  }, [palette]);
  useEffect(() => {
    setGatewayDraft(data.endpoints?.gateway || "");
    setGatewayTokenDraft(data.endpoints?.gatewayToken || "");
  }, [data.endpoints?.gateway, data.endpoints?.gatewayToken]);
  useEffect(() => {
    let active = true;
    gatewayFetch(data, "/api/hermes/voice/capabilities", { method: "GET", timeoutMs: 5000 })
      .then((payload: any) => {
        if (active) setVoiceCapabilities({ stt: Boolean(payload?.stt?.configured), tts: Boolean(payload?.tts?.configured) });
      })
      .catch(() => { if (active) setVoiceCapabilities({ stt: false, tts: false }); });
    return () => { active = false; };
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
    voiceAudioRef.current?.pause();
    terminalSocketRef.current?.close(1000, "j-core-unmounted");
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
    if (!voiceReply) {
      finishSpeaking();
      return;
    }
    const speakWithBrowser = () => {
      if (!("speechSynthesis" in window)) { finishSpeaking(); return; }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "vi-VN";
      utterance.voice = selectVietnameseVoice(voiceStyle);
      utterance.rate = voiceStyle === "female" ? 0.98 : 0.9;
      utterance.pitch = voiceStyle === "female" ? 1.02 : 0.78;
      utterance.onend = finishSpeaking;
      utterance.onerror = finishSpeaking;
      window.speechSynthesis.speak(utterance);
    };
    if (!voiceCapabilities.tts) { speakWithBrowser(); return; }
    void gatewayBinaryFetch(data, "/api/hermes/voice/synthesize", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text, voice: voiceStyle === "female" ? "female" : "male" }),
      timeoutMs: 60000,
    }).then((response: Response) => response.blob()).then((blob: Blob) => {
      const audio = new Audio(URL.createObjectURL(blob));
      voiceAudioRef.current = audio;
      audio.onended = () => { URL.revokeObjectURL(audio.src); finishSpeaking(); };
      audio.onerror = () => { URL.revokeObjectURL(audio.src); speakWithBrowser(); };
      return audio.play();
    }).catch(speakWithBrowser);
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
    const spawnedHub = createHubArtifact(messageText);
    const userMessage = { id: createId(), role: "user" as const, text: messageText, at: Date.now() };
    const requestMessages = [...messages, userMessage].slice(-30);
    setMessages((current) => [...current, userMessage].slice(-80));
    setInput("");
    setPendingAttachment(null);
    setHistoryOpen(true);
    setActivity("thinking");
    setIsSending(true);
    if (spawnedHub) {
      setHubArtifacts((current) => [...current, spawnedHub].slice(-8));
      setActiveHubId(spawnedHub.id);
      setWorkspaceOpen(true);
      setWorkspaceMinimized(false);
      setActiveWindow("workspace");
    }

    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;

    try {
      const targetUrl = "/api/hermes/chat";

      const response: any = await gatewayFetch(
        data,
        targetUrl,
        {
          method: "POST",
          timeoutMs: 60000,
          signal: controller.signal,
          body: JSON.stringify({
            profile: selectedHermesProfileId,
            message: messageText,
            messages: requestMessages.map((message) => ({ role: message.role, content: message.text })),
            operator: data?.username || "Operator",
            attachment: pendingAttachment ? { name: pendingAttachment.name, type: pendingAttachment.type, size: pendingAttachment.size } : null,
            clientCapabilities: {
              responseMode: "jarvis-hub",
              hubKinds: HUB_TEMPLATES.map((template) => template.kind),
              structuredArtifacts: true,
            },
          }),
        }
      );
      const replyText = getGatewayReply(response);
      if (response.source === "mock") {
        throw new Error(replyText || "Chưa có AI upstream nào được cấu hình trên gateway.");
      }
      if (!replyText) throw new Error("AI upstream phản hồi nhưng không có nội dung.");
      const reply = { id: createId(), role: "assistant" as const, text: replyText, at: Date.now() };
      setMessages((current) => [...current, reply].slice(-80));
      if (spawnedHub) {
        setHubArtifacts((current) =>
          current.map((artifact) =>
            artifact.id === spawnedHub.id ? resolveHubArtifact(artifact, replyText, response) : artifact
          )
        );
      }
      speak(reply.text);
    } catch (error) {
      if (controller.signal.aborted) return;
      const message = error instanceof Error ? error.message : "Không thể kết nối AI upstream.";
      const traceId = (error as any)?.requestId || (error as any)?.details?.requestId;
      const reply = {
        id: createId(),
        role: "assistant" as const,
        text: `AI link đang lỗi: ${message}${traceId ? ` · Trace ${traceId}` : ""}`,
        at: Date.now(),
      };
      setMessages((current) => [...current, reply].slice(-80));
      if (spawnedHub) {
        setHubArtifacts((current) =>
          current.map((artifact) =>
            artifact.id === spawnedHub.id ? recoverHubArtifact(artifact, message) : artifact
          )
        );
      }
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

  async function startLocalVoiceCapture() {
    if (!navigator.mediaDevices?.getUserMedia || !("MediaRecorder" in window)) return false;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    microphonePermissionRef.current = true;
    const preferredMime = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus"].find((type) => MediaRecorder.isTypeSupported(type));
    const recorder = new MediaRecorder(stream, preferredMime ? { mimeType: preferredMime } : undefined);
    const chunks: BlobPart[] = [];
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;
    audioContext.createMediaStreamSource(stream).connect(analyser);
    const samples = new Uint8Array(analyser.fftSize);
    let discarded = false;
    let heardVoice = false;
    let lastVoiceAt = Date.now();
    const startedAt = Date.now();
    const monitor = window.setInterval(() => {
      analyser.getByteTimeDomainData(samples);
      let energy = 0;
      for (const sample of samples) energy += Math.abs(sample - 128);
      const level = energy / samples.length;
      if (level > 4.2) { heardVoice = true; lastVoiceAt = Date.now(); }
      const elapsed = Date.now() - startedAt;
      if (recorder.state === "recording" && (elapsed > 20000 || (heardVoice && elapsed > 1400 && Date.now() - lastVoiceAt > 950))) recorder.stop();
    }, 100);
    const cleanup = () => {
      window.clearInterval(monitor);
      stream.getTracks().forEach((track) => track.stop());
      void audioContext.close();
      recognitionActiveRef.current = false;
      setListening(false);
    };
    recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
    recorder.onstart = () => { recognitionActiveRef.current = true; setListening(true); setActivity("listening"); };
    recorder.onerror = () => { cleanup(); setActivity("idle"); setToast("Không thể ghi âm giọng nói local."); };
    recorder.onstop = async () => {
      cleanup();
      if (discarded || !chunks.length) { setActivity("idle"); return; }
      setActivity("thinking");
      try {
        const audio = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
        const response = await gatewayBinaryFetch(data, "/api/hermes/voice/transcribe", {
          method: "POST",
          headers: { "content-type": audio.type },
          body: audio,
          timeoutMs: 60000,
        });
        const payload: any = await response.json();
        const transcript = String(payload.transcript || "").trim();
        resultHandledRef.current = Boolean(transcript);
        setInput(transcript);
        if (transcript) await sendMessage(transcript, "voice");
        else { setActivity("idle"); setToast("Hermes STT chưa nhận được nội dung tiếng Việt."); scheduleVoiceRestart(900); }
      } catch (error) {
        setActivity("idle");
        setToast(error instanceof Error ? error.message : "Hermes STT không phản hồi.");
      }
    };
    recognitionRef.current = {
      stop: () => { if (recorder.state === "recording") recorder.stop(); },
      abort: () => { discarded = true; if (recorder.state === "recording") recorder.stop(); },
    };
    recorder.start(250);
    return true;
  }

  async function startRecognition() {
    if (voiceCapabilities.stt) {
      try { return await startLocalVoiceCapture(); }
      catch { setToast("Không mở được microphone cho Hermes STT."); setActivity("idle"); return false; }
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { setToast("Trình duyệt này chưa hỗ trợ nhận giọng nói. Hãy dùng Chrome hoặc Edge."); return; }
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
    setToast("Chế độ giọng nói đã bật. J-Core sẽ tiếp tục nghe sau mỗi câu.");
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
    setGatewayTestMessage("Đang kiểm tra Gateway và các dịch vụ nội bộ...");
    setGatewayHealth(null);
    const normalizedToken = gatewayTokenDraft.trim().replace(/^Bearer\s+/i, "");
    const endpoints = {
      ...data.endpoints,
      gateway: gatewayDraft.trim(),
      gatewayToken: normalizedToken,
    };
    updateData({ endpoints });
    saveGatewayToken(normalizedToken, rememberGatewayToken);
    try {
      const health = await gatewayFetch({ ...data, endpoints }, "/health", { method: "GET", timeoutMs: 7000 });
      setGatewayTest("success");
      setGatewayHealth(health);
      setGatewayTestMessage("Gateway đã xác thực. Trạng thái dịch vụ được cập nhật bên dưới.");
      setToast("Gateway đã kết nối.");
    } catch (error: any) {
      setGatewayTest("error");
      const message = error?.status === 401
        ? "Jarvis token bị Gateway từ chối. Kiểm tra token đang chạy trên Ubuntu."
        : error?.message || "Không thể kết nối Gateway.";
      setGatewayTestMessage(message);
      setToast(message);
    }
  };

  const clearSavedGatewayToken = () => {
    clearGatewayToken();
    setGatewayTokenDraft("");
    setRememberGatewayToken(false);
    setGatewayTest("idle");
    setGatewayTestMessage("");
    updateData({
      endpoints: {
        ...data.endpoints,
        gateway: gatewayDraft.trim(),
        gatewayToken: "",
      },
    });
    setToast("Đã xóa Jarvis token khỏi trình duyệt.");
  };

  const connectNineRouterDashboard = async (openInNewTab = false) => {
    if (routerDashboardState === "loading") return;
    const dashboardTab = openInNewTab ? window.open("", "_blank") : null;
    const normalizedToken = gatewayTokenDraft.trim().replace(/^Bearer\s+/i, "");
    const endpoints = {
      ...data.endpoints,
      gateway: gatewayDraft.trim(),
      gatewayToken: normalizedToken,
    };
    updateData({ endpoints });
    saveGatewayToken(normalizedToken, rememberGatewayToken);
    setRouterDashboardState("loading");
    setRouterDashboardError("");
    try {
      const [session, models]: [any, any] = await Promise.all([
        gatewayFetch({ ...data, endpoints }, "/api/session/9router", {
          method: "POST",
          credentials: "include",
          timeoutMs: 7000,
        }),
        gatewayFetch({ ...data, endpoints }, "/api/9router/models", {
          method: "GET",
          timeoutMs: 7000,
        }).catch(() => ({ models: [] })),
      ]);
      const dashboardUrl = String(session.dashboardUrl || `${getGatewayConfig({ ...data, endpoints }).gateway}/dashboard`);
      setRouterModels(Array.isArray(models.models) ? models.models : []);
      setRouterDashboardUrl(dashboardUrl);
      setRouterDashboardState("ready");
      if (dashboardTab) {
        dashboardTab.opener = null;
        dashboardTab.location.href = dashboardUrl;
      }
    } catch (error: any) {
      dashboardTab?.close();
      const message = error?.status === 401
        ? "Jarvis token không hợp lệ nên chưa mở được 9Router."
        : error?.message || "Không thể tạo phiên điều khiển 9Router.";
      setRouterDashboardError(message);
      setRouterDashboardState("error");
    }
  };

  const updateServicePanel = (service: ServiceKey, patch: Partial<ServicePanelState>) => {
    setServicePanels((current) => ({
      ...current,
      [service]: { ...current[service], ...patch },
    }));
  };

  const refreshServicePanel = async (service: ServiceKey) => {
    updateServicePanel(service, { state: "loading", error: "" });
    try {
      const [overview, profilePayload]: any[] = await Promise.all([
        gatewayFetch(
          data,
          service === "hermes" ? "/api/hermes/capabilities" : "/api/claude/capabilities",
          { method: "GET", timeoutMs: 7000 },
        ),
        service === "hermes"
          ? gatewayFetch(data, "/api/hermes/profiles", { method: "GET", timeoutMs: 7000 }).catch(() => null)
          : Promise.resolve(null),
      ]);
      if (profilePayload?.profiles) setHermesProfiles(mergeHermesProfiles(profilePayload.profiles));
      updateServicePanel(service, { state: "ready", overview, error: "" });
    } catch (error: any) {
      updateServicePanel(service, {
        state: "error",
        error: error?.message || `Không thể đọc trạng thái ${service}.`,
      });
    }
  };

  const openServicePanel = (service: ServiceKey) => {
    setActiveWindow(service);
    setFocusedDashboard(service);
    if (service === "hermes") {
      setHermesOpen(true);
      setHermesMinimized(false);
    } else {
      setClaudeOpen(true);
      setClaudeMinimized(false);
    }
    if (servicePanels[service].state === "idle" || servicePanels[service].state === "error") {
      void refreshServicePanel(service);
    }
  };

  const testServicePanel = async (service: ServiceKey) => {
    const prompt = servicePanels[service].prompt.trim();
    if (!prompt || servicePanels[service].sending) return;
    updateServicePanel(service, { sending: true, reply: "" });
    try {
      const result: any = await gatewayFetch(data, `/api/${service}/chat`, {
        method: "POST",
        timeoutMs: 60000,
        body: JSON.stringify({
          message: prompt,
          messages: [{ role: "user", content: prompt }],
          operator: data?.username || "Operator",
          ...(service === "hermes" ? { profile: selectedHermesProfileId } : {}),
        }),
      });
      updateServicePanel(service, {
        sending: false,
        reply: getGatewayReply(result) || `${service} đã phản hồi nhưng không có nội dung văn bản.`,
      });
    } catch (error: any) {
      updateServicePanel(service, {
        sending: false,
        reply: error?.message || `Không thể gửi test tới ${service}.`,
      });
    }
  };

  const logoutProjectSession = async () => {
    try { await fetch("/api/auth/logout", { method: "POST", credentials: "include" }); } finally { window.location.reload(); }
  };

  const runServiceDiagnostic = async (service: ServiceKey, action: string) => {
    if (servicePanels[service].sending) return;
    updateServicePanel(service, { sending: true, reply: "" });
    try {
      const result: any = await gatewayFetch(data, "/api/system/dashboard-command", {
        method: "POST",
        timeoutMs: 35000,
        body: JSON.stringify({ service, action }),
      });
      updateServicePanel(service, {
        sending: false,
        reply: result.output || JSON.stringify(result, null, 2),
      });
    } catch (error: any) {
      updateServicePanel(service, {
        sending: false,
        reply: error?.message || `Khong the chay ${service} ${action}.`,
      });
    }
  };

  const selectNineRouterModel = (model: string) => {
    updateData({ endpoints: { ...data.endpoints, nineRouterModel: model } });
    setToast(`9Router model: ${model}`);
  };

  const selectHermesProfile = (profileId: HermesProfileId) => {
    setSelectedHermesProfileId(profileId);
    saveStoredHermesProfileId(profileId);
    updateData({ ai: { ...(data.ai || {}), hermesProfile: profileId } });
    const profilePalette = hermesProfiles.find((profile) => profile.id === profileId)?.palette;
    onPaletteChange(profilePalette || HERMES_PROFILE_PALETTES[profileId] || HERMES_PROFILE_PALETTES.jarvis);
    setToast(`Hermes profile: ${profileId}`);
  };

  const moduleStatus = useMemo(() => {
    const findService = (key: string) => {
      const target = key.toLowerCase().replace(/[^a-z0-9]/g, "");
      const matchKey = Object.keys(connections.services || {}).find(
        (k) => k.toLowerCase().replace(/[^a-z0-9]/g, "") === target
      );
      return matchKey ? connections.services?.[matchKey] : null;
    };

    const serviceDetail = (key: string, fallback: string) => {
      const service = findService(key);
      if (!service) return fallback;
      const latency = Number.isFinite(service.latencyMs) ? `${service.latencyMs}ms` : null;
      const circuit = service.circuit?.state && service.circuit.state !== "closed"
        ? `circuit ${service.circuit.state}`
        : null;
      const httpStatus = service.status ? `HTTP ${service.status}` : null;
      return [latency, circuit, httpStatus, fallback].filter(Boolean).join(" · ");
    };

    const isServiceReady = (key: string, stateFlag: boolean) => {
      const service = findService(key);
      if (service) return !!service.online && service.configured !== false;
      return stateFlag;
    };

    const gatewayDetail = [
      Number.isFinite(connections.latencyMs) ? `${connections.latencyMs}ms` : null,
      connections.requestId ? `req: ${connections.requestId.slice(0, 8)}` : null,
      sameOriginSession ? "PHIÊN DỰ ÁN TỰ ĐỘNG" : "LOCAL PREVIEW",
    ].filter(Boolean).join(" · ");

    const coreServices = [
      { label: "CỔNG KẾT NỐI", value: connections.gateway ? "TRỰC TUYẾN" : "NGẮT KẾT NỐI", detail: gatewayDetail, tone: connections.gateway ? "online" : "offline" },
      { label: "HERMES", value: isServiceReady("hermes", connections.hermes) ? "AI SẴN SÀNG" : "NGẮT KẾT NỐI", detail: serviceDetail("hermes", "Bộ điều phối hội thoại"), tone: isServiceReady("hermes", connections.hermes) ? "online" : "offline" },
      { label: "OPENCLAW", value: isServiceReady("openclaw", connections.openclaw) ? "TRỰC TUYẾN" : "NGẮT KẾT NỐI", detail: serviceDetail("openclaw", "Đội tác nhân chuyên môn"), tone: isServiceReady("openclaw", connections.openclaw) ? "online" : "offline" },
      { label: "9ROUTER", value: isServiceReady("nineRouter", connections.nineRouter) ? "TRỰC TUYẾN" : "NGẮT KẾT NỐI", detail: serviceDetail("nineRouter", `Mô hình ${nineRouterModel}`), tone: isServiceReady("nineRouter", connections.nineRouter) ? "online" : "offline" },
      { label: "CLAUDE", value: isServiceReady("claude", connections.claude) ? "AI SẴN SÀNG" : "NGẮT KẾT NỐI", detail: serviceDetail("claude", "Cầu nối suy luận"), tone: isServiceReady("claude", connections.claude) ? "online" : "offline" },
    ];

    const knownKeys = new Set(["hermes", "openclaw", "ninerouter", "claude"]);
    const extraServices = Object.entries(connections.services || {})
      .filter(([k]) => !knownKeys.has(k.toLowerCase().replace(/[^a-z0-9]/g, "")))
      .map(([name, service]: [string, any]) => ({
        label: name.toUpperCase().replace(/_/g, " "),
        value: service.online && service.configured !== false ? "TRỰC TUYẾN" : "NGẮT KẾT NỐI",
        detail: [
          Number.isFinite(service.latencyMs) ? `${service.latencyMs}ms` : null,
          service.configured === false ? "Chưa cấu hình" : "Gateway service",
          service.status ? `HTTP ${service.status}` : null
        ].filter(Boolean).join(" · "),
        tone: service.online && service.configured !== false ? "online" : "offline"
      }));

    return [
      ...coreServices,
      ...extraServices,
      { label: "GIỌNG NÓI", value: voiceMode ? "ĐANG NGHE" : "SẴN SÀNG", detail: `${VOICE_STYLE_LABELS[voiceStyle]} · ${advisorMode ? "lọc câu vu vơ" : "phản hồi mọi câu"}`, tone: "online" },
      { label: "CHẾ ĐỘ LÕI", value: paletteLabels[palette].toUpperCase(), detail: "Màu và cấu trúc 3D độc lập", tone: "online" },
      { label: "BỘ NHỚ", value: `${messages.length} BẢN GHI`, detail: "Lưu cục bộ trong trình duyệt", tone: "online" }
    ];
  }, [advisorMode, connections, messages.length, nineRouterModel, palette, sameOriginSession, voiceMode, voiceStyle]);

  const pushTerminal = (lines: string | string[]) => {
    const nextLines = Array.isArray(lines) ? lines : [lines];
    setTerminalLines((current) => [...current, ...nextLines].slice(-80));
  };

  const openOsWindow = useCallback((windowId: string) => {
    setActiveWindow(windowId);
    if (windowId in DASHBOARD_META) setFocusedDashboard(windowId as DashboardId);
    if (windowId === "core") onCoreMinimizedChange(false);
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
    if (windowId === "hermes") {
      setHermesOpen(true);
      setHermesMinimized(false);
    }
    if (windowId === "claude") {
      setClaudeOpen(true);
      setClaudeMinimized(false);
    }
    if (windowId === "intel") {
      setIntelOpen(true);
      setIntelMinimized(false);
    }
    if (windowId === "workspace") {
      setWorkspaceOpen(true);
      setWorkspaceMinimized(false);
    }
  }, [onCoreMinimizedChange]);

  const exitDashboard = useCallback(() => {
    setFocusedDashboard(null);
  }, []);

  const createTemplateHub = useCallback((kind: HubKind) => {
    const template = hubTemplate(kind);
    const artifact = createHubArtifact(`${template.label} Hub`, kind);
    if (!artifact) return;
    const readyArtifact = resolveHubArtifact(
      artifact,
      `${template.description}. Mẫu giao diện đã được nạp và đang chờ Jarvis truyền dữ liệu vào.`,
      { results: hubDemoItems(kind) },
    );
    setHubArtifacts((current) => [...current, readyArtifact].slice(-8));
    setActiveHubId(readyArtifact.id);
  }, []);

  const removeHubArtifact = useCallback((id: string) => {
    setHubArtifacts((current) => {
      const remaining = current.filter((artifact) => artifact.id !== id);
      setActiveHubId((activeId) => activeId === id ? remaining[remaining.length - 1]?.id ?? null : activeId);
      return remaining;
    });
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

  const connectPrivateTerminal = async () => {
    const currentSocket = terminalSocketRef.current;
    if (currentSocket && currentSocket.readyState <= WebSocket.OPEN) {
      currentSocket.close(1000, "operator-disconnect");
      return;
    }
    if (terminalConnecting) return;
    setTerminalConnecting(true);
    try {
      const session: any = await gatewayFetch(data, "/api/system/terminal/session", { method: "POST", timeoutMs: 10000 });
      const { gateway } = getGatewayConfig(data);
      const gatewayUrl = new URL(gateway);
      gatewayUrl.protocol = gatewayUrl.protocol === "https:" ? "wss:" : "ws:";
      gatewayUrl.pathname = String(session.websocketPath || "/ws/terminal");
      gatewayUrl.search = new URLSearchParams({ ticket: String(session.ticket || "") }).toString();
      const socket = new WebSocket(gatewayUrl.toString());
      terminalSocketRef.current = socket;
      socket.onopen = () => {
        setTerminalMode("pty");
        setTerminalConnecting(false);
        pushTerminal("PRIVATE UBUNTU PTY // connected with one-time ticket // audited session");
      };
      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(String(event.data));
          if (payload.type === "output") {
            const text = String(payload.data || "").replace(/\u001b\[[0-?]*[ -/]*[@-~]/g, "");
            pushTerminal(text.split(/\r?\n/).filter(Boolean));
          }
          if (payload.type === "ready") pushTerminal(`session ${payload.sessionId} ready · expires ${payload.expiresInSeconds}s`);
          if (payload.type === "error") pushTerminal(`PTY ERROR: ${payload.message || "unknown error"}`);
          if (payload.type === "exit") pushTerminal(`[PTY EXIT ${payload.code ?? "?"}]`);
        } catch {
          pushTerminal(String(event.data));
        }
      };
      socket.onerror = () => {
        setTerminalConnecting(false);
        pushTerminal("PTY CONNECTION FAILED // kiểm tra private mode và tunnel WebSocket.");
      };
      socket.onclose = (event) => {
        terminalSocketRef.current = null;
        setTerminalMode("local");
        setTerminalConnecting(false);
        pushTerminal(`PTY DISCONNECTED${event.reason ? ` // ${event.reason}` : ""}`);
      };
    } catch (error) {
      setTerminalConnecting(false);
      pushTerminal(`PTY UNAVAILABLE: ${error instanceof Error ? error.message : "unknown error"}`);
    }
  };

  const runTerminal = async (event: FormEvent) => {
    event.preventDefault();
    const raw = terminalInput.trim();
    if (!raw) return;
    const [command, ...args] = raw.toLowerCase().split(/\s+/);
    if (terminalMode === "pty" && terminalSocketRef.current?.readyState === WebSocket.OPEN) {
      terminalSocketRef.current.send(JSON.stringify({ type: "input", data: `${raw}\n` }));
      setTerminalInput("");
      return;
    }
    pushTerminal(`operator@j-core:~$ ${raw}`);
    setTerminalInput("");

    if (command === "clear") {
      setTerminalLines([]);
      return;
    }
    if (command === "help") {
      pushTerminal(["help     danh sách lệnh local", "files    mở Ubuntu Files trực tiếp", "status   trạng thái phiên", "open     mở dashboard", "whoami   tài khoản hiện tại", "date     thời gian local", "clear    xóa màn hình"]);
      return;
    }
    if (command === "files") {
      setIntelMode("files");
      openOsWindow("intel");
      pushTerminal("Ubuntu Files opened // browser permission required once per mounted folder.");
      return;
    }
    if (command === "status" || command === "scan") {
      pushTerminal([
        "session   AUTHENTICATED LOCAL",
        "files     DIRECT ACCESS / NO API",
        `hermes    ${connections.hermes ? "READY" : "OFFLINE"}`,
        `openclaw  ${connections.openclaw ? "ONLINE" : "OFFLINE"}`,
        `9router   ${connections.nineRouter ? "ONLINE" : "OFFLINE"}`,
        `claude    ${connections.claude ? "READY" : "OFFLINE"}`,
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
      if (["system", "chat", "agents", "router", "hermes", "claude", "settings", "terminal", "intel", "workspace"].includes(target)) {
        openOsWindow(target);
        pushTerminal(`Window '${target}' opened.`);
      } else {
        pushTerminal("Unknown app. Use: system, chat, agents, router, hermes, claude, settings, intel.");
      }
      return;
    }
    pushTerminal("Lệnh shell hệ thống không được chạy từ website. Dùng 'files' để sửa dữ liệu Ubuntu local, hoặc mở Ubuntu Terminal của máy nếu cần thực thi lệnh.");
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
        "6": "hermes",
        "7": "claude",
        "8": "settings",
        "9": "intel",
        "0": "workspace",
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
    coreMinimized ? { id: "core", label: "Lõi AI 3D", code: "CORE", icon: "hub" } : null,
    hubOpen && hubMinimized ? { id: "system", label: "System Monitor", code: "SYS", icon: "hub" } : null,
    historyOpen && historyMinimized ? { id: "chat", label: "Neural Chat", code: "CHAT", icon: "chat" } : null,
    terminalOpen && terminalMinimized ? { id: "terminal", label: "Ubuntu Terminal", code: "TERM", icon: "terminal" } : null,
    agentsOpen && agentsMinimized ? { id: "agents", label: "Agent Matrix", code: "AGNT", icon: "agents" } : null,
    routerOpen && routerMinimized ? { id: "router", label: "Router Matrix", code: "ROUT", icon: "router" } : null,
    hermesOpen && hermesMinimized ? { id: "hermes", label: "Hermes Core", code: "HRMS", icon: "hermes" } : null,
    claudeOpen && claudeMinimized ? { id: "claude", label: "Claude Bridge", code: "CLDE", icon: "claude" } : null,
    intelOpen && intelMinimized ? { id: "intel", label: "Intel Library", code: "INTL", icon: "media" } : null,
    workspaceOpen && workspaceMinimized ? { id: "workspace", label: "Universal Workspace", code: "HUB", icon: "hub" } : null,
    settingsOpen && settingsMinimized ? { id: "settings", label: "Gateway Settings", code: "GATE", icon: "settings" } : null,
  ] as Array<{ id: string; label: string; code: string; icon: IconName } | null>)
    .filter((item): item is { id: string; label: string; code: string; icon: IconName } => Boolean(item));

  if (palette === "spider") {
    return (
      <SpiderPersonalHub
        currentTime={currentTime}
        username={data?.username || "Operator"}
        connections={connections}
        messages={messages}
        isSending={isSending}
        onAskEv={(prompt) => void sendMessage(prompt)}
        onExit={() => onPaletteChange("gold")}
        onResetView={onResetView}
      />
    );
  }

  return (
    <div
      className={`hud-overlay ${focusedDashboard ? "is-dashboard-focus" : ""}`}
      data-focus-dashboard={focusedDashboard || undefined}
      aria-label="J-Core AI interface"
    >
      {focusedDashboard && (
        <header className="dashboard-focus-header">
          <button type="button" className="dashboard-back" onClick={exitDashboard} aria-label="Quay lại J-Core Hub">
            <span aria-hidden="true">←</span><b>J-CORE HUB</b>
          </button>
          <div className="dashboard-focus-title">
            <span>{DASHBOARD_META[focusedDashboard].eyebrow}</span>
            <h1>{DASHBOARD_META[focusedDashboard].title}</h1>
          </div>
          <div className="dashboard-local-session"><i /><span>LOCAL SESSION</span><time>{currentTime}</time></div>
        </header>
      )}
      <div className={`system-signal ${activity}`} aria-hidden="true"><i /><i /><i /></div>
      <nav className="os-taskbar" aria-label="J-Core OS taskbar">
        <button className={`os-start ${coreMinimized ? "" : "active"}`} type="button" aria-label={coreMinimized ? "Khôi phục Lõi AI 3D" : "Thu nhỏ Lõi AI 3D"} aria-pressed={!coreMinimized} onClick={() => onCoreMinimizedChange(!coreMinimized)}>
          <span>J</span><b>J-CORE OS</b>
        </button>
        <div className="os-app-strip">
          <button className={hubOpen ? "active" : ""} type="button" aria-label="Mở giám sát hệ thống" onClick={toggleHub}><Icon name="hub" /><span>Hệ thống</span></button>
          <button className={historyOpen ? "active" : ""} type="button" aria-label="Mở trò chuyện" onClick={toggleHistory}><Icon name="chat" /><span>Trò chuyện</span></button>
          <button className={terminalOpen ? "active" : ""} type="button" aria-label="Mở Terminal" onClick={() => openOsWindow("terminal")}><Icon name="terminal" /><span>Terminal</span></button>
          <button className={agentsOpen ? "active" : ""} type="button" aria-label="Mở ma trận tác nhân" onClick={() => openOsWindow("agents")}><Icon name="agents" /><span>Tác nhân</span></button>
          <button
            className={routerOpen ? "active" : ""}
            type="button"
            aria-label="Mở bảng điều khiển 9Router"
            onClick={() => {
              openOsWindow("router");
              void connectNineRouterDashboard();
            }}
          >
            <Icon name="router" /><span>9Router</span>
          </button>
          <button
            className={hermesOpen ? "active" : ""}
            type="button"
            aria-label="Mở bảng điều khiển Hermes"
            onClick={() => openServicePanel("hermes")}
          >
            <Icon name="hermes" /><span>Hermes</span>
          </button>
          <button
            className={claudeOpen ? "active" : ""}
            type="button"
            aria-label="Mở bảng điều khiển Claude"
            onClick={() => openServicePanel("claude")}
          >
            <Icon name="claude" /><span>Claude</span>
          </button>
          <button className={intelOpen ? "active" : ""} type="button" aria-label="Mở thư viện tình báo" onClick={() => openOsWindow("intel")}><Icon name="media" /><span>Thư viện</span></button>
          <button className={workspaceOpen ? "active" : ""} type="button" aria-label="Mở không gian làm việc" onClick={() => openOsWindow("workspace")}><Icon name="hub" /><span>Không gian</span></button>
          <button className={settingsOpen ? "active" : ""} type="button" aria-label="Mở cài đặt J-Core" onClick={toggleSettings}><Icon name="settings" /><span>Cài đặt</span></button>
        </div>
        <div className="os-tray">
          <button type="button" aria-label="Reset góc nhìn lõi" onClick={onResetView}><Icon name="reset" /></button>
          <span className="online">LOCAL SESSION</span>
          <time>{currentTime}</time>
        </div>
      </nav>

      {minimizedWindows.length > 0 && (
        <nav className="os-minimized-dock" aria-label="Cửa sổ đang thu nhỏ">
              <span>ĐÃ ẨN</span>
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
              <span>TRUNG TÂM ĐIỀU HÀNH</span>
              <b>{activity === "speaking" ? "ĐANG PHẢN HỒI" : activity === "thinking" ? "ĐANG PHÂN TÍCH" : activity === "listening" ? "ĐANG LẮNG NGHE" : "SẴN SÀNG"}</b>
            </div>
            <div className="panel-actions hub-actions">
              <button type="button" aria-label="Thu nhỏ trung tâm điều hành" onClick={() => setHubMinimized(true)}><Icon name="minimize" /></button>
              <button type="button" aria-label="Đóng trung tâm điều hành" onClick={() => setHubOpen(false)}><Icon name="close" /></button>
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
            <div><span>CỔNG KẾT NỐI</span><b>{connections.gateway ? "GATEWAY TRỰC TUYẾN" : "GATEWAY NGOẠI TUYẾN"}</b></div>
            <div className="panel-actions settings-window-actions">
              <button type="button" aria-label="Thu nhỏ cài đặt" onClick={() => setSettingsMinimized(true)}><Icon name="minimize" /></button>
              <button type="button" aria-label="Đóng cài đặt" onClick={() => setSettingsOpen(false)}><Icon name="close" /></button>
            </div>
          </div>
          <section className={`settings-block gateway-settings ${sameOriginSession ? "is-same-origin" : ""}`}>
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
            <div className="gateway-session-card">
              <i />
              <div><b>LOCAL PROJECT SESSION</b><span>J-Core tự kết nối dịch vụ trong dự án sau đăng nhập. Không có URL, API key hay token cần nhập.</span></div>
              {sameOriginSession && <button type="button" onClick={() => void logoutProjectSession()}>Đăng xuất</button>}
            </div>
            <label className="gateway-field">
              <span>Gateway URL</span>
              <input
                type="url"
                name="jcore-gateway-url"
                value={gatewayDraft}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                data-1p-ignore="true"
                data-lpignore="true"
                onChange={(event) => {
                  setGatewayDraft(event.target.value);
                  setGatewayTest("idle");
                }}
              />
            </label>
            <label className="gateway-field">
              <span>Jarvis device token</span>
              <div className="gateway-token-control">
                <input
                  type={showGatewayToken ? "text" : "password"}
                  value={gatewayTokenDraft}
                  placeholder="Chỉ nhập chuỗi token, không cần Bearer"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  data-1p-ignore="true"
                  data-lpignore="true"
                  onChange={(event) => {
                    setGatewayTokenDraft(event.target.value);
                    setGatewayTest("idle");
                    setGatewayTestMessage("");
                  }}
                />
                <button type="button" onClick={() => setShowGatewayToken((visible) => !visible)}>
                  {showGatewayToken ? "Ẩn" : "Hiện"}
                </button>
              </div>
            </label>
            <label className="toggle-row gateway-remember-row">
              <span>
                Nhớ token trên thiết bị
                <small>{rememberGatewayToken ? "Lưu lâu dài trong trình duyệt này" : "Chỉ giữ đến khi đóng tab"}</small>
              </span>
              <input
                checked={rememberGatewayToken}
                type="checkbox"
                onChange={(event) => {
                  const remember = event.target.checked;
                  setRememberGatewayToken(remember);
                  saveGatewayToken(gatewayTokenDraft, remember);
                }}
              />
            </label>
            <p className={`gateway-test-status ${gatewayTest}`} role={gatewayTest === "error" ? "alert" : "status"}>
              {gatewayTestMessage || (connections.gateway ? "Health check đang hoạt động." : "Gateway chưa kết nối.")}
            </p>
            {gatewayHealth?.services && (
              <div className="gateway-service-grid" aria-label="Trạng thái dịch vụ nội bộ">
                {Object.entries(gatewayHealth.services).map(([name, service]: [string, any]) => (
                  <div className={service.online ? "online" : "offline"} key={name}>
                    <span>{name}</span>
                    <b>{service.online ? "ONLINE" : "OFFLINE"}</b>
                    <small>{Number.isFinite(service.latencyMs) ? `${service.latencyMs}ms` : "Không phản hồi"}</small>
                  </div>
                ))}
              </div>
            )}
            <button className="gateway-clear-token" type="button" onClick={clearSavedGatewayToken}>
              Xóa token khỏi trình duyệt
            </button>
          </section>
          <section className="settings-block model-settings">
            <div className="settings-block-head">
              <span>9Router model</span>
              <b className="active-model-readout">{nineRouterModel}</b>
            </div>
            <div className="model-grid" role="group" aria-label="Chọn model 9Router">
              {routerModelOptions.map((model) => (
                <button
                  className={nineRouterModel === model.id ? "active" : ""}
                  type="button"
                  aria-pressed={nineRouterModel === model.id}
                  key={model.id}
                  onClick={() => selectNineRouterModel(model.id)}
                >
                  <b>{model.label}</b>
                  <small>{model.detail}</small>
                </button>
              ))}
            </div>
            <p>Model được gửi trực tiếp tới 9Router cho mọi cửa sổ chat. Mặc định: {DEFAULT_NINEROUTER_MODEL}.</p>
          </section>
          <section className="settings-block">
            <div className="settings-block-head"><span>Kênh giọng nói tiếng Việt</span><button className={voiceMode ? "danger" : "primary"} type="button" onClick={toggleVoiceMode}>{voiceMode ? "Tắt" : "Bật"}</button></div>
            <div className="voice-pipeline-status">
              <span><i className={voiceCapabilities.stt ? "online" : "fallback"} />STT: {voiceCapabilities.stt ? "HERMES LOCAL" : "BROWSER"}</span>
              <span><i className={voiceCapabilities.tts ? "online" : "fallback"} />TTS: {voiceCapabilities.tts ? "HERMES LOCAL" : "BROWSER"}</span>
            </div>
            <div className="voice-style-grid" role="group" aria-label="Chọn chất giọng tiếng Việt">
              {(Object.keys(VOICE_STYLE_LABELS) as VoiceStyle[]).map((style) => (
                <button
                  className={voiceStyle === style ? "active" : ""}
                  type="button"
                  aria-pressed={voiceStyle === style}
                  key={style}
                  onClick={() => {
                    setVoiceStyle(style);
                    setToast(`Đã chọn giọng ${VOICE_STYLE_LABELS[style].toLowerCase()}.`);
                  }}
                >
                  <b>{VOICE_STYLE_LABELS[style]}</b>
                  <small>{style === "female" ? "Rõ, tự nhiên, tốc độ chuẩn" : "Thấp, chậm và chắc"}</small>
                </button>
              ))}
            </div>
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

      {workspaceOpen && (
        <OsWindow
          title="Không gian làm việc đa năng"
          code="JARVIS://HUB-RUNTIME"
          drag={workspaceDrag}
          minimized={workspaceMinimized}
          active={activeWindow === "workspace"}
          className="workspace-os-window"
          onActivate={() => setActiveWindow("workspace")}
          onClose={() => { setWorkspaceOpen(false); setFocusedDashboard(null); }}
          onToggleMinimize={() => setWorkspaceMinimized(true)}
        >
          <DynamicHub
            artifacts={hubArtifacts}
            activeId={activeHubId}
            onSelect={setActiveHubId}
            onCreateDemo={createTemplateHub}
            onRemove={removeHubArtifact}
          />
        </OsWindow>
      )}

      {terminalOpen && (
        <OsWindow
          title="Ubuntu Terminal"
          code={terminalMode === "pty" ? "PTY://UBUNTU-PRIVATE" : "LOCAL://BROWSER"}
          drag={terminalDrag}
          minimized={terminalMinimized}
          active={activeWindow === "terminal"}
          className="terminal-os-window"
          onActivate={() => setActiveWindow("terminal")}
          onClose={() => { setTerminalOpen(false); setFocusedDashboard(null); }}
          onToggleMinimize={() => setTerminalMinimized(true)}
        >
          <div className="terminal-mode-toggle">
            <span>
              {terminalMode === "pty" ? "Private Ubuntu PTY" : "Local browser console"}
              <small>{terminalMode === "pty" ? "Phiên riêng có thời hạn · input/output được audit theo byte" : "Ubuntu Files dùng quyền thư mục trực tiếp · PTY là chế độ nâng cao tùy chọn"}</small>
            </span>
            <div className="terminal-mode-actions">
              <button type="button" onClick={() => { setIntelMode("files"); openOsWindow("intel"); }}>UBUNTU FILES</button>
              <button className={terminalMode === "pty" ? "danger" : ""} type="button" disabled={terminalConnecting} onClick={() => void connectPrivateTerminal()}>
                {terminalConnecting ? "ĐANG NỐI" : terminalMode === "pty" ? "NGẮT PTY" : "MỞ PRIVATE PTY"}
              </button>
            </div>
          </div>
          <div className="os-terminal-stream" aria-live="polite">
            {terminalLines.map((line, index) => <p key={`${index}-${line}`}>{line}</p>)}
          </div>
          <form className="os-terminal-input" onSubmit={(event) => void runTerminal(event)}>
            <span>{terminalMode === "pty" ? "ubuntu@j-core:~$" : "operator@j-core:~$"}</span>
            <input
              value={terminalInput}
              onChange={(event) => setTerminalInput(event.target.value)}
              aria-label="Lệnh Ubuntu"
              autoComplete="off"
              spellCheck={false}
            />
            <button type="submit" aria-label="Chạy lệnh local" disabled={!terminalInput.trim()}>
              RUN
            </button>
          </form>
        </OsWindow>
      )}

      {agentsOpen && (
        <OsWindow
          title="Agent Matrix & OpenClaw Console"
          code="PWR://OPENCLAW"
          drag={agentsDrag}
          minimized={agentsMinimized}
          active={activeWindow === "agents"}
          className="agents-os-window"
          onActivate={() => setActiveWindow("agents")}
          onClose={() => { setAgentsOpen(false); setFocusedDashboard(null); }}
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
          <div className="mt-3">
            <OpenclawDashboard data={data} addLog={(msg: string) => setToast(msg)} />
            <AppConfigEditor data={data} service="openclaw" />
          </div>
        </OsWindow>
      )}

      {routerOpen && (
        <OsWindow
          title="9Router Config & Provider Control"
          code="SPC://9ROUTER-ADMIN"
          drag={routerDrag}
          minimized={routerMinimized}
          active={activeWindow === "router"}
          className="router-os-window"
          onActivate={() => setActiveWindow("router")}
          onClose={() => { setRouterOpen(false); setFocusedDashboard(null); }}
          onToggleMinimize={() => setRouterMinimized(true)}
        >
          <div className="native-router-shell">
            <header className="native-router-toolbar">
              <div>
                <i className={connections.nineRouter ? "online" : "offline"} />
                <span>
                  <b>{connections.nineRouter ? "9ROUTER ONLINE" : "9ROUTER OFFLINE"}</b>
                  <small>{routerModels.length ? `${routerModels.length} models · ${nineRouterModel}` : `Model ${nineRouterModel}`}</small>
                </span>
              </div>
              <nav aria-label="Điều khiển 9Router">
                <button
                  type="button"
                  disabled={routerDashboardState === "loading"}
                  onClick={() => void connectNineRouterDashboard()}
                >
                  {routerDashboardState === "loading" ? "Đang tải" : "Mở cấu hình native"}
                </button>
                <button
                  className="primary"
                  type="button"
                  disabled={!routerDashboardUrl}
                  onClick={() => void connectNineRouterDashboard(true)}
                >
                  <Icon name="external" /> Mở toàn màn hình
                </button>
              </nav>
            </header>

            <div className="p-3 border-b border-cyan-300/15">
              <NineRouterDashboard data={data} addLog={(msg: string) => setToast(msg)} />
              <AppConfigEditor data={data} service="9router" />
            </div>

            {routerDashboardState === "ready" && routerDashboardUrl ? (
              <iframe
                className="native-router-frame"
                src={routerDashboardUrl}
                title="9Router native dashboard"
                referrerPolicy="no-referrer"
                onLoad={() => setRouterDashboardState("ready")}
              />
            ) : (
              <div className={`native-router-state ${routerDashboardState}`} role={routerDashboardState === "error" ? "alert" : "status"}>
                <Icon name="router" />
                <b>
                  {routerDashboardState === "loading"
                    ? "Đang tạo phiên điều khiển an toàn"
                    : routerDashboardState === "error"
                    ? "Không mở được dashboard 9Router"
                    : "Dashboard 9Router chưa được kết nối"}
                </b>
                <p>{routerDashboardError || "Jarvis token sẽ mở một phiên tạm thời; port 20128 vẫn chỉ chạy nội bộ trên Ubuntu."}</p>
                <button type="button" onClick={() => void connectNineRouterDashboard()}>
                  Thử kết nối phiên iframe native
                </button>
              </div>
            )}
          </div>
        </OsWindow>
      )}

      {hermesOpen && (
        <OsWindow
          title="Hermes Core"
          code="AI://HERMES"
          drag={hermesDrag}
          minimized={hermesMinimized}
          active={activeWindow === "hermes"}
          className="service-os-window hermes-os-window"
          onActivate={() => setActiveWindow("hermes")}
          onClose={() => { setHermesOpen(false); setFocusedDashboard(null); }}
          onToggleMinimize={() => setHermesMinimized(true)}
        >
          <ServiceDashboard
            data={data}
            label="HERMES"
            description="Reasoning orchestrator · capability and direct-chat diagnostics"
            online={connections.hermes}
            state={servicePanels.hermes.state}
            health={connections.services?.hermes}
            overview={servicePanels.hermes.overview}
            error={servicePanels.hermes.error}
            prompt={servicePanels.hermes.prompt}
            reply={servicePanels.hermes.reply}
            sending={servicePanels.hermes.sending}
            selectedProfileId={selectedHermesProfileId}
            profiles={hermesProfiles}
            onSelectProfile={(profileId) => {
              selectHermesProfile(profileId);
              setToast(`Đã chuyển sang Hermes profile: ${profileId}`);
            }}
            onPromptChange={(prompt) => updateServicePanel("hermes", { prompt })}
            onRefresh={() => void refreshServicePanel("hermes")}
            onSubmit={() => void testServicePanel("hermes")}
            diagnostics={["status", "doctor", "sessions", "cron", "profiles", "config"]}
            onRunDiagnostic={(action) => void runServiceDiagnostic("hermes", action)}
          />
        </OsWindow>
      )}

      {claudeOpen && (
        <OsWindow
          title="Claude Bridge"
          code="AI://CLAUDE"
          drag={claudeDrag}
          minimized={claudeMinimized}
          active={activeWindow === "claude"}
          className="service-os-window claude-os-window"
          onActivate={() => setActiveWindow("claude")}
          onClose={() => { setClaudeOpen(false); setFocusedDashboard(null); }}
          onToggleMinimize={() => setClaudeMinimized(true)}
        >
          <ServiceDashboard
            data={data}
            label="CLAUDE"
            description="Local Claude Code bridge · health and direct-chat diagnostics"
            online={connections.claude}
            state={servicePanels.claude.state}
            health={connections.services?.claude}
            overview={servicePanels.claude.overview}
            error={servicePanels.claude.error}
            prompt={servicePanels.claude.prompt}
            reply={servicePanels.claude.reply}
            sending={servicePanels.claude.sending}
            onPromptChange={(prompt) => updateServicePanel("claude", { prompt })}
            onRefresh={() => void refreshServicePanel("claude")}
            onSubmit={() => void testServicePanel("claude")}
            diagnostics={["version", "status", "doctor", "auth"]}
            onRunDiagnostic={(action) => void runServiceDiagnostic("claude", action)}
          />
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
          onClose={() => { setIntelOpen(false); setFocusedDashboard(null); }}
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
                <button
                  type="button"
                  role="tab"
                  aria-label="Ubuntu Files"
                  aria-selected={intelMode === "files"}
                  className={intelMode === "files" ? "active" : ""}
                  onClick={() => setIntelMode("files")}
                >
                  <Icon name="terminal" /><span>Ubuntu Files</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-label="Obsidian Vault"
                  aria-selected={intelMode === "obsidian"}
                  className={intelMode === "obsidian" ? "active" : ""}
                  onClick={() => setIntelMode("obsidian")}
                >
                  <Icon name="document" /><span>Obsidian</span>
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
            ) : intelMode === "docs" ? (
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
            ) : intelMode === "files" ? (
              <UbuntuWorkspace />
            ) : (
              <ObsidianVaultPanel data={data} />
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
        <div className="quick-command-strip" aria-label="Lệnh gợi ý">
          <span>QUICK://</span>
          {QUICK_COMMANDS.map((command) => (
            <button type="button" key={command.label} onClick={() => setInput(command.prompt)}>
              {command.label}
            </button>
          ))}
        </div>
        <form className="prompt-shell prompt-shell-with-tools" autoComplete="off" onSubmit={submit}>
          <button className={voiceMode || listening ? "listening" : ""} type="button" aria-label="Bật chế độ giọng nói" onClick={toggleVoiceMode}><Icon name="mic" /></button>
          <div className="legacy-chat-tools" aria-label="Công cụ chat">
            <button type="button" aria-label="Ghim một tệp hoặc hình ảnh" onClick={chooseAttachment}><Icon name="attach" /></button>
            <button type="button" aria-label="Chia sẻ và chụp màn hình" onClick={captureSharedScreen}><Icon name="screen" /></button>
          </div>
          <input ref={attachmentInputRef} className="attachment-input" type="file" accept="image/*,.pdf,.txt,.md,.csv,.json,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip" aria-label="Chọn tệp đính kèm" onChange={handleAttachmentChange} />
          <label className="sr-only" htmlFor="jcore-command">Nhập tin nhắn</label>
          <input
            id="jcore-command"
            name="jcore-command"
            placeholder="Nói hoặc nhập lệnh..."
            value={input}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="sentences"
            spellCheck={false}
            aria-autocomplete="none"
            data-1p-ignore="true"
            data-lpignore="true"
            onChange={(event) => setInput(event.target.value)}
          />
          <button type="submit" aria-label="Gửi tin nhắn" disabled={isSending || (!input.trim() && !pendingAttachment)}><Icon name="send" /></button>
        </form>
        <p aria-live="polite">{toast}</p>
      </section>
    </div>
  );
}
