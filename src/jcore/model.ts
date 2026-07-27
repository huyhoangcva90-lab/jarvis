export type AiEmotion = "calm" | "listening" | "thinking" | "speaking" | "alert" | "creative";

export type ModuleId =
  | "chat"
  | "missions"
  | "agents"
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
};

export type OfficeRoom = {
  id: OfficeRoomId;
  floor: string;
  label: string;
  purpose: string;
  color: string;
  rgb: string;
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
    task: "Thiết kế shell và module registry"
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
    task: "Chốt tiêu chí hoàn thành"
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
    task: "Kiểm chứng nguồn và rủi ro"
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
    task: "Giữ timeline nâng cấp"
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
    task: "Chờ dữ liệu test thật"
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
    task: "Chuẩn bị tunnel/Ubuntu flow"
  }
];

export const statusCopy: Record<AgentStatus, string> = {
  idle: "Idle",
  working: "Working",
  thinking: "Thinking",
  blocked: "Blocked",
  review: "Review"
};
