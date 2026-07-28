/**
 * Jarvis Infinity System — Mission Schema
 *
 * Mọi yêu cầu có nhiều bước tạo thành một Mission.
 * Mission được theo dõi bởi Hermes Orchestrator.
 */

// ─── Mission Status ──────────────────────────────────────────
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
};

// ─── Mission Priority ────────────────────────────────────────
export const MISSION_PRIORITY = {
  LOW: "low",
  NORMAL: "normal",
  HIGH: "high",
  CRITICAL: "critical",
};

// ─── Mission Source ──────────────────────────────────────────
export const MISSION_SOURCE = {
  WEB: "web",
  TELEGRAM: "telegram",
  VOICE: "voice",
  SYSTEM: "system",
};

// ─── Status display mapping ──────────────────────────────────
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

// ─── Create Mission factory ──────────────────────────────────
let missionCounter = 0;

export function createMission({
  title,
  description = "",
  source = MISSION_SOURCE.WEB,
  domains = [],
  priority = MISSION_PRIORITY.NORMAL,
  steps = [],
  requiresApproval = false,
}) {
  missionCounter += 1;
  const now = new Date().toISOString();
  return {
    id: `mission-${Date.now()}-${missionCounter}`,
    title,
    description,
    requestedBy: "operator",
    source,
    domains,
    assignedSystems: [],
    assignedAgents: [],
    status: MISSION_STATUS.INBOX,
    priority,
    steps,
    progress: 0,
    requiresApproval,
    result: null,
    error: null,
    createdAt: now,
    updatedAt: now,
    completedAt: null,
  };
}

// ─── Update Mission helper ───────────────────────────────────
export function updateMission(mission, patch) {
  return {
    ...mission,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
}

// ─── Complete / Fail helpers ─────────────────────────────────
export function completeMission(mission, result = null) {
  const now = new Date().toISOString();
  return {
    ...mission,
    status: MISSION_STATUS.COMPLETED,
    progress: 100,
    result,
    updatedAt: now,
    completedAt: now,
  };
}

export function failMission(mission, error = null) {
  return {
    ...mission,
    status: MISSION_STATUS.FAILED,
    error,
    updatedAt: new Date().toISOString(),
  };
}
