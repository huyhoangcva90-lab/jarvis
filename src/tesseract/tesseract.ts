export type AiEmotion = "calm" | "listening" | "thinking" | "speaking" | "alert" | "creative" | "spider";

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

export type ModeBlueprint = {
  moduleId: ModuleId;
  codename: string;
  inspiration: string;
  geometry: string;
  motion: string;
  density: "quiet" | "focused" | "dense";
  layout: string;
  layers: Array<{
    label: string;
    detail: string;
  }>;
};

export type AiActivity = "idle" | "listening" | "thinking" | "speaking";
export type EnergyPalette = "gold" | "blue" | "green" | "red" | "violet" | "orange";

export type StoneId = "power" | "space" | "mind" | "time" | "reality" | "soul";

export type StoneState = "dormant" | "reading" | "working" | "external_call" | "completed" | "warning" | "error" | "approval";

export type StoneColor = {
  primary: string;
  glow: string;
  bg: string;
  border: string;
  label: string;
};

export type StoneMeta = {
  label: string;
  domain: string;
  subtitle: string;
  icon: string;
  orbitAngle: number;
  systemType: "external" | "native";
};

export type StateVisual = {
  animation: string;
  opacity: number;
  pulseSpeed: string | null;
  label: string;
};

export type MissionStatus = "inbox" | "planning" | "queued" | "working" | "waiting_approval" | "waiting_external" | "review" | "completed" | "failed" | "cancelled";

export type MissionPriority = "low" | "normal" | "high" | "critical";

export type MissionSource = "web" | "telegram" | "voice" | "system";

export type Mission = {
  id: string;
  title: string;
  description: string;
  requestedBy: string;
  source: MissionSource;
  domains: string[];
  assignedSystems: string[];
  assignedAgents: string[];
  status: MissionStatus;
  priority: MissionPriority;
  steps: any[];
  progress: number;
  requiresApproval: boolean;
  result: any;
  error: any;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};

export type ModuleRealmMap = Record<ModuleId, EnergyPalette>;

export type Agent = AgentProfile;
