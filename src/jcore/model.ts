export type AiEmotion = "calm" | "listening" | "thinking" | "speaking" | "alert" | "creative" | "web";

export type ModuleId =
  | "chat"
  | "hermes"
  | "missions"
  | "agents"
  | "openclaw"
  | "web"
  | "office"
  | "memory"
  | "router"
  | "logs"
  | "settings";

export type AgentStatus = "idle" | "working" | "thinking" | "blocked" | "review";

export type OfficeRoomId =
  | "lobby"
  | "strategy"
  | "workshop"
  | "intel"
  | "webops"
  | "archive"
  | "monitor"
  | "launch";

export type JCoreModule = {
  id: ModuleId;
  label: string;
  eyebrow: string;
  realm: string;
  color: string;
  rgb: string;
  icon: string;
  summary: string;
  signal: string;
  metric: string;
};

export type EmotionState = {
  label: string;
  description: string;
  color: string;
  rgb: string;
  tempo: "slow" | "medium" | "fast" | "sharp";
};

export type AgentProfile = {
  id: string;
  name: string;
  character: string;
  role: string;
  room: OfficeRoomId;
  status: AgentStatus;
  color: string;
  load: number;
  task: string;
  runtime: "hermes" | "openclaw" | "codex" | "claude" | "local";
  heartbeat: string;
  tool: string;
};

export type OfficeRoom = {
  id: OfficeRoomId;
  floor: string;
  label: string;
  purpose: string;
  color: string;
  rgb: string;
};

export type HermesPanel = {
  id: string;
  label: string;
  value: string;
  detail: string;
  health: "ok" | "warn" | "bad";
};

export type RouterProvider = {
  id: string;
  name: string;
  tier: "Subscription" | "Cheap" | "Free" | "Local";
  status: "ready" | "limited" | "fallback" | "offline";
  quota: number;
  used: number;
  latency: string;
  cost: string;
  models: string;
};

export type OpenClawNode = {
  id: string;
  label: string;
  value: string;
  status: "ready" | "syncing" | "needs-token" | "offline";
};

export type WebOpsCard = {
  id: string;
  label: string;
  value: string;
  detail: string;
  status: "ready" | "watching" | "queued" | "blocked";
};

export const emotions: Record<AiEmotion, EmotionState> = {
  calm: {
    label: "Calm",
    description: "Ổn định, đang chờ lệnh.",
    color: "#f5b73f",
    rgb: "245,183,63",
    tempo: "slow"
  },
  listening: {
    label: "Listening",
    description: "Đang nghe input hoặc chờ tín hiệu.",
    color: "#6bdcff",
    rgb: "107,220,255",
    tempo: "medium"
  },
  thinking: {
    label: "Thinking",
    description: "Đang phân tích, lập kế hoạch, chọn skill.",
    color: "#a879ff",
    rgb: "168,121,255",
    tempo: "fast"
  },
  speaking: {
    label: "Speaking",
    description: "Đang phản hồi hoặc stream kết quả.",
    color: "#5df3a4",
    rgb: "93,243,164",
    tempo: "medium"
  },
  alert: {
    label: "Alert",
    description: "Có rủi ro, lỗi hoặc cần phê duyệt.",
    color: "#ff5f6d",
    rgb: "255,95,109",
    tempo: "sharp"
  },
  creative: {
    label: "Creative",
    description: "Đang thiết kế, tưởng tượng, tạo phương án.",
    color: "#ff74d4",
    rgb: "255,116,212",
    tempo: "fast"
  },
  web: {
    label: "Web",
    description: "Đang bám web, dò liên kết, bắt tín hiệu và chạy browser ops.",
    color: "#ff4d5f",
    rgb: "255,77,95",
    tempo: "fast"
  }
};

export const modules: JCoreModule[] = [
  {
    id: "chat",
    label: "Chat",
    eyebrow: "Core channel",
    realm: "Command Orb",
    color: "#f5b73f",
    rgb: "245,183,63",
    icon: "◌",
    summary: "Nói chuyện với Hermes/J-Core như buồng lái chính.",
    signal: "ready",
    metric: "1 active session"
  },
  {
    id: "hermes",
    label: "Hermes",
    eyebrow: "Agent runtime",
    realm: "Core Brain",
    color: "#ffd277",
    rgb: "255,210,119",
    icon: "H",
    summary: "Hermes dashboard layer: sessions, API, logs, cron, skills, config và usage.",
    signal: "api planned",
    metric: "port 8642 / 9119"
  },
  {
    id: "missions",
    label: "Missions",
    eyebrow: "Execution",
    realm: "Mind",
    color: "#6ea8ff",
    rgb: "110,168,255",
    icon: "◇",
    summary: "Biến ý tưởng thành nhiệm vụ, bước làm, trạng thái và tiêu chí xong.",
    signal: "4 live",
    metric: "72% planned"
  },
  {
    id: "agents",
    label: "Agents",
    eyebrow: "Fleet",
    realm: "Power",
    color: "#ff9f43",
    rgb: "255,159,67",
    icon: "⬡",
    summary: "Quản lý đội agent: vai trò, heartbeat, task, trạng thái và năng lực.",
    signal: "6 online",
    metric: "63% load"
  },
  {
    id: "openclaw",
    label: "OpenClaw",
    eyebrow: "Agent gateway",
    realm: "Fleet Bridge",
    color: "#8adfff",
    rgb: "138,223,255",
    icon: "OC",
    summary: "OpenClaw gateway/control UI: agent fleet, ws/http URL, gateway token và live events.",
    signal: "bridge planned",
    metric: "gateway json"
  },
  {
    id: "web",
    label: "Web Ops",
    eyebrow: "Spider mode",
    realm: "Web-Slinger",
    color: "#ff4d5f",
    rgb: "255,77,95",
    icon: "WEB",
    summary: "Dạng lấy cảm hứng Người Nhện: web research, browser automation, crawling, link graph và signal watch.",
    signal: "crawler ready",
    metric: "18 links mapped"
  },
  {
    id: "office",
    label: "Purple Office",
    eyebrow: "Virtual office",
    realm: "Soul",
    color: "#b56dff",
    rgb: "181,109,255",
    icon: "⌂",
    summary: "Avengers Agent Office: một module tím để hình ảnh hoá đội agent.",
    signal: "visual",
    metric: "3 rooms active"
  },
  {
    id: "memory",
    label: "Memory",
    eyebrow: "Recall",
    realm: "Time",
    color: "#5df3a4",
    rgb: "93,243,164",
    icon: "∞",
    summary: "Trí nhớ dài hạn, context pack, note, knowledge vault.",
    signal: "synced",
    metric: "128 memories"
  },
  {
    id: "router",
    label: "Router",
    eyebrow: "Models",
    realm: "Space",
    color: "#69e8ff",
    rgb: "105,232,255",
    icon: "⇄",
    summary: "9Router/model routing: chọn model, fallback, quota, cost.",
    signal: "local",
    metric: "9Router ready"
  },
  {
    id: "logs",
    label: "Logs",
    eyebrow: "Reality check",
    realm: "Reality",
    color: "#ff6978",
    rgb: "255,105,120",
    icon: "≋",
    summary: "Logs, traces, tool calls, approvals, lỗi và replay.",
    signal: "watching",
    metric: "2 approvals"
  },
  {
    id: "settings",
    label: "Settings",
    eyebrow: "Control",
    realm: "System",
    color: "#a9b6c8",
    rgb: "169,182,200",
    icon: "⚙",
    summary: "Cấu hình Hermes, API proxy, 9Router, theme và quyền.",
    signal: "locked",
    metric: "local only"
  }
];

export const officeRooms: OfficeRoom[] = [
  {
    id: "launch",
    floor: "L90",
    label: "Launch Bay",
    purpose: "Deploy, publish, tunnel, external actions.",
    color: "#ff9f43",
    rgb: "255,159,67"
  },
  {
    id: "monitor",
    floor: "L82",
    label: "Monitoring",
    purpose: "Logs, traces, cost, failures, health.",
    color: "#ff6978",
    rgb: "255,105,120"
  },
  {
    id: "archive",
    floor: "L74",
    label: "Memory Archive",
    purpose: "Memory, notes, context packs, knowledge.",
    color: "#5df3a4",
    rgb: "93,243,164"
  },
  {
    id: "intel",
    floor: "L66",
    label: "Intel Room",
    purpose: "Research, browser, source checking.",
    color: "#ff6f9c",
    rgb: "255,111,156"
  },
  {
    id: "webops",
    floor: "L62",
    label: "Web Ops Nest",
    purpose: "Browser automation, link graph, crawling, SERP, web monitors.",
    color: "#ff4d5f",
    rgb: "255,77,95"
  },
  {
    id: "workshop",
    floor: "L58",
    label: "Workshop",
    purpose: "Coding, building, debugging, tool execution.",
    color: "#ff6048",
    rgb: "255,96,72"
  },
  {
    id: "strategy",
    floor: "L50",
    label: "Strategy Room",
    purpose: "Mission planning, sequencing, risk control.",
    color: "#6ea8ff",
    rgb: "110,168,255"
  },
  {
    id: "lobby",
    floor: "L42",
    label: "Shared Hall",
    purpose: "All agents visible at assigned stations.",
    color: "#b56dff",
    rgb: "181,109,255"
  }
];

export const agents: AgentProfile[] = [
  {
    id: "stark",
    name: "Stark",
    character: "Iron Man",
    role: "Architect / Builder",
    room: "workshop",
    status: "working",
    color: "#ff6048",
    load: 82,
    task: "Thiết kế shell và module registry",
    runtime: "codex",
    heartbeat: "8s ago",
    tool: "apply_patch"
  },
  {
    id: "rogers",
    name: "Rogers",
    character: "Captain",
    role: "Mission Lead",
    room: "strategy",
    status: "thinking",
    color: "#6ea8ff",
    load: 61,
    task: "Chốt tiêu chí hoàn thành",
    runtime: "hermes",
    heartbeat: "12s ago",
    tool: "mission planner"
  },
  {
    id: "romanoff",
    name: "Romanoff",
    character: "Black Widow",
    role: "Intel / Research",
    room: "intel",
    status: "review",
    color: "#ff6f9c",
    load: 48,
    task: "Kiểm chứng nguồn và rủi ro",
    runtime: "openclaw",
    heartbeat: "21s ago",
    tool: "browser/research"
  },
  {
    id: "parker",
    name: "Parker",
    character: "Spider Agent",
    role: "Web / Browser Ops",
    room: "webops",
    status: "working",
    color: "#ff4d5f",
    load: 57,
    task: "Dò link graph, kiểm tra page state và web signal",
    runtime: "openclaw",
    heartbeat: "5s ago",
    tool: "browser/web"
  },
  {
    id: "strange",
    name: "Strange",
    character: "Doctor Strange",
    role: "Timeline / Strategy",
    room: "archive",
    status: "idle",
    color: "#b56dff",
    load: 35,
    task: "Giữ timeline nâng cấp",
    runtime: "hermes",
    heartbeat: "idle",
    tool: "cron/timeline"
  },
  {
    id: "banner",
    name: "Banner",
    character: "Hulk",
    role: "Debug / Heavy Compute",
    room: "monitor",
    status: "blocked",
    color: "#70e06e",
    load: 29,
    task: "Chờ dữ liệu test thật",
    runtime: "local",
    heartbeat: "blocked",
    tool: "test runner"
  },
  {
    id: "thor",
    name: "Odinson",
    character: "Thor",
    role: "Automation / Deploy",
    room: "launch",
    status: "idle",
    color: "#8adfff",
    load: 42,
    task: "Chuẩn bị tunnel/Ubuntu flow",
    runtime: "openclaw",
    heartbeat: "16s ago",
    tool: "gateway/deploy"
  }
];

export const statusCopy: Record<AgentStatus, string> = {
  idle: "Idle",
  working: "Working",
  thinking: "Thinking",
  blocked: "Blocked",
  review: "Review"
};

export const hermesPanels: HermesPanel[] = [
  {
    id: "api",
    label: "API Server",
    value: "localhost:8642",
    detail: "Sessions API, chat/stream, fork, messages. Cần API_SERVER_KEY.",
    health: "warn"
  },
  {
    id: "dashboard",
    label: "Dashboard",
    value: "localhost:9119",
    detail: "Status, config, env, sessions, logs, analytics, cron, skills.",
    health: "warn"
  },
  {
    id: "sessions",
    label: "Sessions",
    value: "20 recent",
    detail: "Source: CLI, Telegram, API, cron, J-Core. Có token/tool metadata.",
    health: "ok"
  },
  {
    id: "skills",
    label: "Skills",
    value: "toggleable",
    detail: "Skill catalog + toolsets, sau này map vào J-Core Skill Hub.",
    health: "ok"
  },
  {
    id: "cron",
    label: "Cron Jobs",
    value: "scheduled",
    detail: "Night crew, daily review, Telegram/Discord/local delivery.",
    health: "ok"
  },
  {
    id: "logs",
    label: "Logs",
    value: "live tail",
    detail: "agent/errors/gateway logs, filter by level/component.",
    health: "ok"
  }
];

export const routerProviders: RouterProvider[] = [
  {
    id: "subscription",
    name: "Claude / Codex / Gemini",
    tier: "Subscription",
    status: "ready",
    quota: 100,
    used: 68,
    latency: "1.4s",
    cost: "included",
    models: "coding, reasoning"
  },
  {
    id: "cheap",
    name: "GLM / MiniMax / Kimi",
    tier: "Cheap",
    status: "fallback",
    quota: 100,
    used: 24,
    latency: "1.9s",
    cost: "low",
    models: "draft, summarize"
  },
  {
    id: "free",
    name: "Qwen / iFlow / Kiro",
    tier: "Free",
    status: "ready",
    quota: 100,
    used: 12,
    latency: "2.8s",
    cost: "free",
    models: "light tasks"
  },
  {
    id: "local",
    name: "Ollama / local",
    tier: "Local",
    status: "limited",
    quota: 100,
    used: 41,
    latency: "local",
    cost: "hardware",
    models: "private/offline"
  }
];

export const openClawNodes: OpenClawNode[] = [
  {
    id: "dashboard-json",
    label: "dashboard --json",
    value: "url/httpUrl/wsUrl/port",
    status: "ready"
  },
  {
    id: "gateway-token",
    label: "Gateway token",
    value: "SecretRef / redacted",
    status: "needs-token"
  },
  {
    id: "events",
    label: "Live events",
    value: "WebSocket planned",
    status: "syncing"
  },
  {
    id: "fleet",
    label: "Agent fleet",
    value: "roles + heartbeat",
    status: "ready"
  }
];

export const webOpsCards: WebOpsCard[] = [
  {
    id: "browser",
    label: "Browser agent",
    value: "ready",
    detail: "Mở trang, đọc DOM, kiểm tra UI flow, lấy screenshot và báo state.",
    status: "ready"
  },
  {
    id: "link-graph",
    label: "Link graph",
    value: "18 mapped",
    detail: "Map page, source, route, API endpoint, outbound references.",
    status: "watching"
  },
  {
    id: "watch",
    label: "Web monitor",
    value: "3 watches",
    detail: "Theo dõi quota, dashboard, docs, deploy URL và thay đổi quan trọng.",
    status: "queued"
  },
  {
    id: "approval",
    label: "Safety web",
    value: "human gate",
    detail: "Form submit, purchase, public post, deploy/tunnel đều cần approval.",
    status: "blocked"
  }
];
