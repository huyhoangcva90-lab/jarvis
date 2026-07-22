export const STORAGE_KEY = "j-core-console:data:v1";

export const defaultToolUrls = {
  ChatGPT: "https://chatgpt.com/",
  Notion: "https://www.notion.so/",
  "Google Drive": "https://drive.google.com/",
  GitHub: "https://github.com/",
  n8n: "https://n8n.io/",
  "YouTube Studio": "https://studio.youtube.com/",
  Gmail: "https://mail.google.com/",
  Calendar: "https://calendar.google.com/"
};

export const defaultData = {
  username: "Huy",
  aiPersonaName: "J-Core",
  mood: "calm",
  energy: "medium",
  mainQuest: "Build my personal AI console",
  sideQuests: ["", "", ""],
  activeProject: "Personal AI assistant app",
  missionStatus: "Not started",
  themeIntensity: "Medium",
  memory: {
    whoIAm: "I am Huy, building a personal AI operating system for focus, planning, and creative execution.",
    currentProjects: "Personal AI assistant app",
    longTermGoals: "Design a calm, powerful workflow that helps me think clearly and finish important missions.",
    aiRules: "Be direct, useful, warm, and practical. Help me turn vague thoughts into next actions.",
    remember: "Prefer clean systems, daily momentum, and tools that reduce friction."
  },
  sectors: [
    { name: "Work Sector", status: "Stable", progress: 68, notes: "Primary focus orbit is stable." },
    { name: "Money Sector", status: "Warning", progress: 42, notes: "Review income systems and expenses." },
    { name: "Learning Sector", status: "Stable", progress: 61, notes: "Keep one active study track." },
    { name: "Health Sector", status: "Stable", progress: 55, notes: "Protect sleep and movement windows." },
    { name: "Content Sector", status: "Warning", progress: 36, notes: "Prepare one reusable content pipeline." },
    { name: "System Sector", status: "Stable", progress: 73, notes: "Console build in progress." }
  ],
  toolUrls: defaultToolUrls,
  logs: [
    "J-Core kernel initialized.",
    "Operator profile loaded.",
    "Mission control standing by."
  ]
};

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData;
    return mergeData(defaultData, JSON.parse(raw));
  } catch {
    return defaultData;
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetData() {
  localStorage.removeItem(STORAGE_KEY);
}

function mergeData(base, saved) {
  return {
    ...base,
    ...saved,
    memory: { ...base.memory, ...(saved.memory || {}) },
    toolUrls: { ...base.toolUrls, ...(saved.toolUrls || {}) },
    sectors: Array.isArray(saved.sectors) ? saved.sectors : base.sectors,
    sideQuests: Array.isArray(saved.sideQuests) ? saved.sideQuests.slice(0, 3) : base.sideQuests,
    logs: Array.isArray(saved.logs) ? saved.logs.slice(-16) : base.logs
  };
}
