/**
 * Jarvis Six Realms — Gate Definitions
 *
 * Moi Realm Gate dai dien cho mot domain trong he thong Jarvis.
 * Ten bien cu van duoc giu tam thoi de tranh refactor lan rong.
 */

// ─── Realm IDs ───────────────────────────────────────────────
export const STONE_IDS = {
  POWER: "power",
  SPACE: "space",
  MIND: "mind",
  TIME: "time",
  REALITY: "reality",
  SOUL: "soul",
};

// ─── Realm States ────────────────────────────────────────────
export const STONE_STATES = {
  DORMANT: "dormant",
  READING: "reading",
  WORKING: "working",
  EXTERNAL_CALL: "external_call",
  COMPLETED: "completed",
  WARNING: "warning",
  ERROR: "error",
  APPROVAL: "approval",
};

// ─── Realm Color Tokens (CSS custom property names map to Tailwind) ──
export const STONE_COLORS = {
  [STONE_IDS.POWER]: {
    primary: "#a855f7",   // Purple-500
    glow: "rgba(168,85,247,0.55)",
    bg: "rgba(168,85,247,0.12)",
    border: "rgba(168,85,247,0.35)",
    label: "Power Realm",
  },
  [STONE_IDS.SPACE]: {
    primary: "#3b82f6",   // Blue-500
    glow: "rgba(59,130,246,0.55)",
    bg: "rgba(59,130,246,0.12)",
    border: "rgba(59,130,246,0.35)",
    label: "Space Realm",
  },
  [STONE_IDS.MIND]: {
    primary: "#eab308",   // Yellow-500
    glow: "rgba(234,179,8,0.55)",
    bg: "rgba(234,179,8,0.12)",
    border: "rgba(234,179,8,0.35)",
    label: "Mind Realm",
  },
  [STONE_IDS.TIME]: {
    primary: "#22c55e",   // Green-500
    glow: "rgba(34,197,94,0.55)",
    bg: "rgba(34,197,94,0.12)",
    border: "rgba(34,197,94,0.35)",
    label: "Time Realm",
  },
  [STONE_IDS.REALITY]: {
    primary: "#ef4444",   // Red-500
    glow: "rgba(239,68,68,0.55)",
    bg: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.35)",
    label: "Reality Realm",
  },
  [STONE_IDS.SOUL]: {
    primary: "#f97316",   // Orange-500
    glow: "rgba(249,115,22,0.55)",
    bg: "rgba(249,115,22,0.12)",
    border: "rgba(249,115,22,0.35)",
    label: "Soul Realm",
  },
};

// ─── Realm Metadata (Domain, Description, Position in orbit) ──
export const STONE_META = {
  [STONE_IDS.MIND]: {
    label: "Mind Realm",
    domain: "Knowledge & Dev",
    subtitle: "Knowledge Core · Claude Code",
    icon: "MN",
    orbitAngle: 270,       // Top center
    systemType: "external",
  },
  [STONE_IDS.SPACE]: {
    label: "Space Realm",
    domain: "Model Infrastructure",
    subtitle: "9Router · Multi-Model Gateway",
    icon: "SP",
    orbitAngle: 330,       // Top-left
    systemType: "external",
  },
  [STONE_IDS.TIME]: {
    label: "Time Realm",
    domain: "Personal OS",
    subtitle: "Schedule · Habits · Calendar",
    icon: "TM",
    orbitAngle: 210,       // Top-right
    systemType: "native",
  },
  [STONE_IDS.POWER]: {
    label: "Power Realm",
    domain: "AI Company",
    subtitle: "OpenClaw · AI Workforce",
    icon: "PW",
    orbitAngle: 30,        // Bottom-left
    systemType: "external",
  },
  [STONE_IDS.REALITY]: {
    label: "Reality Realm",
    domain: "Finance System",
    subtitle: "Income · Expenses · Budget",
    icon: "RL",
    orbitAngle: 150,       // Bottom-right
    systemType: "native",
  },
  [STONE_IDS.SOUL]: {
    label: "Soul Realm",
    domain: "Personal Identity",
    subtitle: "Mood · Energy · Memory",
    icon: "SL",
    orbitAngle: 90,        // Bottom center
    systemType: "native",
  },
};

// ─── State → Visual Mapping ──────────────────────────────────
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

// ─── All realm IDs as ordered array (for iteration) ──────────
export const ALL_STONES = [
  STONE_IDS.MIND,
  STONE_IDS.SPACE,
  STONE_IDS.TIME,
  STONE_IDS.POWER,
  STONE_IDS.REALITY,
  STONE_IDS.SOUL,
];
