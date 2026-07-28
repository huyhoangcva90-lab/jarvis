import {
  AiEmotion, EmotionState, JCoreModule, ModeBlueprint, OfficeRoom, AgentProfile,
  AgentStatus, HermesPanel, RouterProvider, OpenClawNode, WebOpsCard, ModuleId,
  EnergyPalette, ModuleRealmMap
} from './tesseract';

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
  spider: {
    label: "Spider Core",
    description: "Spider-sense bật: bám link graph, quét web signal và phản xạ nhanh.",
    color: "#ff4d5f",
    rgb: "255,77,95",
    tempo: "fast"
  }
};

export const modules: JCoreModule[] = [
  {
    id: "chat",
    label: "Core",
    eyebrow: "Command channel",
    realm: "Command Orb",
    color: "#f5b73f",
    rgb: "245,183,63",
    icon: "CORE",
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
    icon: "HMS",
    summary: "Hermes dashboard layer: sessions, API, logs, cron, skills, config và usage.",
    signal: "api planned",
    metric: "port 8642 / 9119"
  },
  {
    id: "missions",
    label: "Mission",
    eyebrow: "Execution",
    realm: "Mind",
    color: "#6ea8ff",
    rgb: "110,168,255",
    icon: "MSN",
    summary: "Biến ý tưởng thành nhiệm vụ, bước làm, trạng thái và tiêu chí xong.",
    signal: "4 live",
    metric: "72% planned"
  },
  {
    id: "agents",
    label: "Fleet",
    eyebrow: "Fleet",
    realm: "Power",
    color: "#ff9f43",
    rgb: "255,159,67",
    icon: "FLT",
    summary: "Quản lý đội agent: vai trò, heartbeat, task, trạng thái và năng lực.",
    signal: "6 online",
    metric: "63% load"
  },
  {
    id: "openclaw",
    label: "Claw",
    eyebrow: "Agent gateway",
    realm: "Fleet Bridge",
    color: "#8adfff",
    rgb: "138,223,255",
    icon: "CLW",
    summary: "OpenClaw gateway/control UI: agent fleet, ws/http URL, gateway token và live events.",
    signal: "bridge planned",
    metric: "gateway json"
  },
  {
    id: "web",
    label: "Spider",
    eyebrow: "Spider Core",
    realm: "Spider-Sense",
    color: "#ff4d5f",
    rgb: "255,77,95",
    icon: "SPDR",
    summary: "Core mode lấy cảm hứng phim Người Nhện: spider-sense, browser automation, crawling, link graph và web monitor.",
    signal: "sense ready",
    metric: "18 web nodes"
  },
  {
    id: "office",
    label: "Office",
    eyebrow: "Virtual office",
    realm: "Soul",
    color: "#b56dff",
    rgb: "181,109,255",
    icon: "OFC",
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
    icon: "MEM",
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
    icon: "RTR",
    summary: "9Router/model routing: chọn model, fallback, quota, cost.",
    signal: "local",
    metric: "9Router ready"
  },
  {
    id: "logs",
    label: "Trace",
    eyebrow: "Reality check",
    realm: "Reality",
    color: "#ff6978",
    rgb: "255,105,120",
    icon: "TRC",
    summary: "Logs, traces, tool calls, approvals, lỗi và replay.",
    signal: "watching",
    metric: "2 approvals"
  },
  {
    id: "settings",
    label: "Config",
    eyebrow: "Control",
    realm: "System",
    color: "#a9b6c8",
    rgb: "169,182,200",
    icon: "CFG",
    summary: "Cấu hình Hermes, API proxy, 9Router, theme và quyền.",
    signal: "locked",
    metric: "local only"
  }
];

export const modeBlueprints: Record<ModuleId, ModeBlueprint> = {
  chat: {
    moduleId: "chat",
    codename: "JARVIS Command Core",
    inspiration: "Stark-style assistant interface, but rebuilt as original J-Core cockpit.",
    geometry: "Central orb, concentric HUD rings, 3 command lanes.",
    motion: "Calm pulse, short scan sweeps, no noisy particle storms.",
    density: "quiet",
    layout: "Orb left, command + answer surface center, context rail right.",
    layers: [
      { label: "Core", detail: "1 living orb shows state/emotion." },
      { label: "Command", detail: "Chat input is the primary action." },
      { label: "Context", detail: "Approvals, memory and agent pulse stay secondary." }
    ]
  },
  hermes: {
    moduleId: "hermes",
    codename: "Hermes Control Plane",
    inspiration: "Operator dashboard: sessions, API, cron, skills and logs.",
    geometry: "Stacked cards around one runtime status spine.",
    motion: "Only status changes pulse; panels do not drift.",
    density: "focused",
    layout: "Hero status at top, health grid below, logs/adapters later.",
    layers: [
      { label: "Runtime", detail: "Local API and dashboard endpoints." },
      { label: "Sessions", detail: "Active tasks, skills and queues." },
      { label: "Audit", detail: "Logs, approvals and cost trace." }
    ]
  },
  missions: {
    moduleId: "missions",
    codename: "Mystic Mission Mandala",
    inspiration: "Doctor Strange-style spell logic: circles, gates, timelines; no copied symbols.",
    geometry: "Mandala rings with one clear mission path from intent to done.",
    motion: "Rotating arcs only when planning; idle state almost still.",
    density: "focused",
    layout: "Plan center, risks left, next action right.",
    layers: [
      { label: "Intent", detail: "User goal and success criteria." },
      { label: "Path", detail: "Steps, blockers, decisions." },
      { label: "Gate", detail: "Approval when action leaves local scope." }
    ]
  },
  agents: {
    moduleId: "agents",
    codename: "Xandar Fleet Lattice",
    inspiration: "Nova Corps / Xandar feeling: fleet, ranks, star map and Worldmind-like coordination.",
    geometry: "Star nodes connected into squad clusters.",
    motion: "Heartbeat dots, route handoff flashes, no random walking.",
    density: "dense",
    layout: "Roster left, task board center, event stream right.",
    layers: [
      { label: "Roster", detail: "Agent role, runtime and current load." },
      { label: "Mission", detail: "Assigned task, room and owner." },
      { label: "Signal", detail: "Heartbeat, health and handoff events." }
    ]
  },
  openclaw: {
    moduleId: "openclaw",
    codename: "Xandar Gateway Bridge",
    inspiration: "Gateway/fleet command, closer to Nova/Xandar than magic or tower.",
    geometry: "Bridge spine connecting HTTP, WS, token and control UI.",
    motion: "Packets travel on bridge lines only when events are live.",
    density: "focused",
    layout: "Endpoint bridge top, node cards below, fleet roster compact.",
    layers: [
      { label: "Gateway", detail: "Control UI, HTTP and WS endpoints." },
      { label: "Token", detail: "Auth state and permission boundary." },
      { label: "Events", detail: "Live agent stream into J-Core." }
    ]
  },
  web: {
    moduleId: "web",
    codename: "Spider Core",
    inspiration: "Spider-Man film energy: spider-sense, web lattice, quick reflex; original visual language.",
    geometry: "Elastic web graph with red/cyan signal nodes.",
    motion: "Fast but brief spider-sense ping, then return to calm.",
    density: "focused",
    layout: "Web graph hero, browser ops cards, safety gate always visible.",
    layers: [
      { label: "Sense", detail: "Detect page change, quota change, broken route." },
      { label: "Swing", detail: "Move through pages, DOM and screenshots." },
      { label: "Gate", detail: "Human approval before public or paid action." }
    ]
  },
  office: {
    moduleId: "office",
    codename: "Asgard Tower Office",
    inspiration: "Asgard/Bifrost feeling: vertical realm tower, floors, guardians and chambers.",
    geometry: "Tower on the left, room stage in the center, inspector on the right.",
    motion: "Elevator/room reveal transitions, agents stay anchored to stations.",
    density: "dense",
    layout: "Tower map → selected room → agent station view.",
    layers: [
      { label: "Tower", detail: "Floors are navigation, not decoration." },
      { label: "Room", detail: "Each room has one purpose and assigned agents." },
      { label: "Station", detail: "Agents stand still at readable positions." }
    ]
  },
  memory: {
    moduleId: "memory",
    codename: "Soul Archive",
    inspiration: "Personal memory vault: warm, human, less cosmic noise.",
    geometry: "Archive cards, soft rings, timeline shelves.",
    motion: "Slow breathing and gentle reveal; no sharp flashes.",
    density: "quiet",
    layout: "Memory timeline, pinned context, recall search.",
    layers: [
      { label: "Identity", detail: "Preferences, tone and long-term context." },
      { label: "Timeline", detail: "What changed and when." },
      { label: "Recall", detail: "Searchable snippets used by agents." }
    ]
  },
  router: {
    moduleId: "router",
    codename: "Tesseract Router",
    inspiration: "Cosmic cube logic: nested cube, route folding, provider fallback.",
    geometry: "Nested cube faces map provider → model → quota → fallback.",
    motion: "Axial cube rotation only when routing changes.",
    density: "focused",
    layout: "Quota summary top, provider lanes below, fallback path visible.",
    layers: [
      { label: "Provider", detail: "OpenAI, Claude, local and cheap/free routes." },
      { label: "Quota", detail: "Used, remaining, reset window and latency." },
      { label: "Fallback", detail: "What route J-Core picks when limited." }
    ]
  },
  logs: {
    moduleId: "logs",
    codename: "Heimdall Trace",
    inspiration: "All-seeing guard pattern: watchtower, timeline and alerts.",
    geometry: "Vertical trace beam with event slices.",
    motion: "New events slide into a stable timeline.",
    density: "dense",
    layout: "Severity rail, trace list, selected event inspector.",
    layers: [
      { label: "Watch", detail: "Health, errors and external events." },
      { label: "Trace", detail: "Chronological action chain." },
      { label: "Explain", detail: "Cause, impact and next recovery step." }
    ]
  },
  settings: {
    moduleId: "settings",
    codename: "J-Core Forge",
    inspiration: "Workbench/forge: calm controls, tokens, adapters and permissions.",
    geometry: "Control panels grouped by scope.",
    motion: "Minimal, because settings must feel safe.",
    density: "quiet",
    layout: "Profile, providers, permissions, deploy targets.",
    layers: [
      { label: "Identity", detail: "Name, voice, theme and defaults." },
      { label: "Adapters", detail: "Hermes, 9Router, OpenClaw, Codex." },
      { label: "Safety", detail: "Approvals and public action gates." }
    ]
  }
};

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
    label: "Spider Nest",
    purpose: "Spider Core: browser automation, link graph, crawling, SERP, web monitors.",
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
    character: "Spider Core",
    role: "Spider-Sense / Browser Ops",
    room: "webops",
    status: "working",
    color: "#ff4d5f",
    load: 57,
    task: "Bật spider-sense, dò link graph và kiểm tra page state",
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
    label: "Spider swing",
    value: "ready",
    detail: "Mở trang, đọc DOM, kiểm tra UI flow, lấy screenshot và báo state.",
    status: "ready"
  },
  {
    id: "link-graph",
    label: "Web lattice",
    value: "18 mapped",
    detail: "Map page, source, route, API endpoint, outbound references.",
    status: "watching"
  },
  {
    id: "watch",
    label: "Spider-sense",
    value: "3 watches",
    detail: "Theo dõi quota, dashboard, docs, deploy URL và thay đổi quan trọng.",
    status: "queued"
  },
  {
    id: "approval",
    label: "Safety gate",
    value: "human gate",
    detail: "Form submit, purchase, public post, deploy/tunnel đều cần approval.",
    status: "blocked"
  }
];

export const STONE_IDS = {
  POWER: "power",
  SPACE: "space",
  MIND: "mind",
  TIME: "time",
  REALITY: "reality",
  SOUL: "soul",
} as const;

export const STONE_STATES = {
  DORMANT: "dormant",
  READING: "reading",
  WORKING: "working",
  EXTERNAL_CALL: "external_call",
  COMPLETED: "completed",
  WARNING: "warning",
  ERROR: "error",
  APPROVAL: "approval",
} as const;

export const STONE_COLORS = {
  [STONE_IDS.POWER]: {
    primary: "#a855f7",
    glow: "rgba(168,85,247,0.55)",
    bg: "rgba(168,85,247,0.12)",
    border: "rgba(168,85,247,0.35)",
    label: "Power Stone",
  },
  [STONE_IDS.SPACE]: {
    primary: "#3b82f6",
    glow: "rgba(59,130,246,0.55)",
    bg: "rgba(59,130,246,0.12)",
    border: "rgba(59,130,246,0.35)",
    label: "Space Stone",
  },
  [STONE_IDS.MIND]: {
    primary: "#eab308",
    glow: "rgba(234,179,8,0.55)",
    bg: "rgba(234,179,8,0.12)",
    border: "rgba(234,179,8,0.35)",
    label: "Mind Stone",
  },
  [STONE_IDS.TIME]: {
    primary: "#22c55e",
    glow: "rgba(34,197,94,0.55)",
    bg: "rgba(34,197,94,0.12)",
    border: "rgba(34,197,94,0.35)",
    label: "Time Stone",
  },
  [STONE_IDS.REALITY]: {
    primary: "#ef4444",
    glow: "rgba(239,68,68,0.55)",
    bg: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.35)",
    label: "Reality Stone",
  },
  [STONE_IDS.SOUL]: {
    primary: "#f97316",
    glow: "rgba(249,115,22,0.55)",
    bg: "rgba(249,115,22,0.12)",
    border: "rgba(249,115,22,0.35)",
    label: "Soul Stone",
  },
};

export const STONE_META = {
  [STONE_IDS.MIND]: {
    label: "Mind Stone",
    domain: "Knowledge & Dev",
    subtitle: "Knowledge Core · Claude Code",
    icon: "🧠",
    orbitAngle: 270,
    systemType: "external",
  },
  [STONE_IDS.SPACE]: {
    label: "Space Stone",
    domain: "Model Infrastructure",
    subtitle: "9Router · Multi-Model Gateway",
    icon: "🌌",
    orbitAngle: 330,
    systemType: "external",
  },
  [STONE_IDS.TIME]: {
    label: "Time Stone",
    domain: "Personal OS",
    subtitle: "Schedule · Habits · Calendar",
    icon: "⏳",
    orbitAngle: 210,
    systemType: "native",
  },
  [STONE_IDS.POWER]: {
    label: "Power Stone",
    domain: "AI Company",
    subtitle: "OpenClaw · AI Workforce",
    icon: "⚡",
    orbitAngle: 30,
    systemType: "external",
  },
  [STONE_IDS.REALITY]: {
    label: "Reality Stone",
    domain: "Finance System",
    subtitle: "Income · Expenses · Budget",
    icon: "💎",
    orbitAngle: 150,
    systemType: "native",
  },
  [STONE_IDS.SOUL]: {
    label: "Soul Stone",
    domain: "Personal Identity",
    subtitle: "Mood · Energy · Memory",
    icon: "🔥",
    orbitAngle: 90,
    systemType: "native",
  },
};

export const STATE_VISUALS = {
  [STONE_STATES.DORMANT]: {
    animation: "none",
    opacity: 0.35,
    pulseSpeed: null,
    label: "Dormant",
  },
  [STONE_STATES.READING]: {
    animation: "stonePulse",
    opacity: 0.7,
    pulseSpeed: "2s",
    label: "Reading",
  },
  [STONE_STATES.WORKING]: {
    animation: "stoneWorking",
    opacity: 1,
    pulseSpeed: "1.2s",
    label: "Working",
  },
  [STONE_STATES.EXTERNAL_CALL]: {
    animation: "stoneExternal",
    opacity: 1,
    pulseSpeed: "0.8s",
    label: "Calling",
  },
  [STONE_STATES.COMPLETED]: {
    animation: "stoneCompleted",
    opacity: 1,
    pulseSpeed: "3s",
    label: "Done",
  },
  [STONE_STATES.WARNING]: {
    animation: "stoneWarning",
    opacity: 0.9,
    pulseSpeed: "1.5s",
    label: "Warning",
  },
  [STONE_STATES.ERROR]: {
    animation: "stoneError",
    opacity: 1,
    pulseSpeed: "0.5s",
    label: "Error",
  },
  [STONE_STATES.APPROVAL]: {
    animation: "stoneApproval",
    opacity: 1,
    pulseSpeed: "0.7s",
    label: "Approve?",
  },
};

export const ALL_STONES = [
  STONE_IDS.MIND,
  STONE_IDS.SPACE,
  STONE_IDS.TIME,
  STONE_IDS.POWER,
  STONE_IDS.REALITY,
  STONE_IDS.SOUL,
];

export const MISSION_STATUS = {
  INBOX: "inbox",
  PLANNING: "planning",
  QUEUED: "queued",
  WORKING: "working",
  WAITING_APPROVAL: "waiting_approval",
  WAITING_EXTERNAL: "waiting_external",
  REVIEW: "review",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELLED: "cancelled",
} as const;

export const MISSION_PRIORITY = {
  LOW: "low",
  NORMAL: "normal",
  HIGH: "high",
  CRITICAL: "critical",
} as const;

export const MISSION_SOURCE = {
  WEB: "web",
  TELEGRAM: "telegram",
  VOICE: "voice",
  SYSTEM: "system",
} as const;

export const STATUS_DISPLAY = {
  [MISSION_STATUS.INBOX]: { label: "Inbox", color: "cyan" },
  [MISSION_STATUS.PLANNING]: { label: "Planning", color: "blue" },
  [MISSION_STATUS.QUEUED]: { label: "Queued", color: "slate" },
  [MISSION_STATUS.WORKING]: { label: "Working", color: "amber" },
  [MISSION_STATUS.WAITING_APPROVAL]: { label: "Approval", color: "orange" },
  [MISSION_STATUS.WAITING_EXTERNAL]: { label: "Waiting", color: "purple" },
  [MISSION_STATUS.REVIEW]: { label: "Review", color: "indigo" },
  [MISSION_STATUS.COMPLETED]: { label: "Done", color: "green" },
  [MISSION_STATUS.FAILED]: { label: "Failed", color: "red" },
  [MISSION_STATUS.CANCELLED]: { label: "Cancelled", color: "gray" },
};

export const MODULE_REALM_MAP: ModuleRealmMap = {
  chat: "gold",
  hermes: "gold",
  missions: "blue",
  agents: "violet",
  openclaw: "blue",
  web: "red",
  office: "violet",
  memory: "green",
  router: "blue",
  logs: "red",
  settings: "gold",
};
