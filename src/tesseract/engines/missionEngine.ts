/**
 * Jarvis Infinity System — Mission Engine
 *
 * Quản lý danh sách Mission trong localStorage.
 * Hermes Orchestrator sử dụng engine này để tạo, cập nhật và theo dõi Mission.
 */
import { Mission } from '../tesseract';
import { MISSION_STATUS, MISSION_SOURCE, MISSION_PRIORITY } from '../constants';

const MISSIONS_KEY = "jarvis:missions:v1";

let missionCounter = 0;

// ─── Mission Factory Functions ───────────────────────────────

export function createMission({
  title,
  description = "",
  source = MISSION_SOURCE.WEB,
  domains = [],
  priority = MISSION_PRIORITY.NORMAL,
  steps = [],
  requiresApproval = false,
}: Partial<Mission> & { title: string }): Mission {
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
  } as Mission;
}

export function updateMission(mission: Mission, patch: Partial<Mission>): Mission {
  return {
    ...mission,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
}

export function completeMission(mission: Mission, result: any = null): Mission {
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

export function failMission(mission: Mission, error: any = null): Mission {
  return {
    ...mission,
    status: MISSION_STATUS.FAILED,
    error,
    updatedAt: new Date().toISOString(),
  };
}

// ─── Persistence ─────────────────────────────────────────────

export function loadMissions(): Mission[] {
  try {
    const raw = localStorage.getItem(MISSIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Mission[];
  } catch {
    return [];
  }
}

export function saveMissions(missions: Mission[]): void {
  localStorage.setItem(MISSIONS_KEY, JSON.stringify(missions));
}

// ─── CRUD Operations ─────────────────────────────────────────

export function addMission(missions: Mission[], missionData: Partial<Mission> & { title: string }): { missions: Mission[], created: Mission } {
  const mission = createMission(missionData);
  const updated = [mission, ...missions];
  saveMissions(updated);
  return { missions: updated, created: mission };
}

export function patchMission(missions: Mission[], missionId: string, patch: Partial<Mission>): Mission[] {
  const updated = missions.map((m) =>
    m.id === missionId ? updateMission(m, patch) : m
  );
  saveMissions(updated);
  return updated;
}

export function completeMissionById(missions: Mission[], missionId: string, result: any): Mission[] {
  const updated = missions.map((m) =>
    m.id === missionId ? completeMission(m, result) : m
  );
  saveMissions(updated);
  return updated;
}

export function failMissionById(missions: Mission[], missionId: string, error: any): Mission[] {
  const updated = missions.map((m) =>
    m.id === missionId ? failMission(m, error) : m
  );
  saveMissions(updated);
  return updated;
}

export function cancelMission(missions: Mission[], missionId: string): Mission[] {
  return patchMission(missions, missionId, { status: MISSION_STATUS.CANCELLED });
}

export function removeMission(missions: Mission[], missionId: string): Mission[] {
  const updated = missions.filter((m) => m.id !== missionId);
  saveMissions(updated);
  return updated;
}

// ─── Queries ─────────────────────────────────────────────────

export function getActiveMissions(missions: Mission[]): Mission[] {
  const activeStatuses = [
    MISSION_STATUS.INBOX,
    MISSION_STATUS.PLANNING,
    MISSION_STATUS.QUEUED,
    MISSION_STATUS.WORKING,
    MISSION_STATUS.WAITING_APPROVAL,
    MISSION_STATUS.WAITING_EXTERNAL,
    MISSION_STATUS.REVIEW,
  ];
  return missions.filter((m) => activeStatuses.includes(m.status));
}

export function getCompletedMissions(missions: Mission[]): Mission[] {
  return missions.filter((m) => m.status === MISSION_STATUS.COMPLETED);
}

export function getMissionsByDomain(missions: Mission[], domain: string): Mission[] {
  return missions.filter((m) => m.domains.includes(domain));
}

export function getMissionStats(missions: Mission[]): Record<string, number> {
  const stats: Record<string, number> = { total: missions.length };
  for (const key of Object.values(MISSION_STATUS)) {
    stats[key] = missions.filter((m) => m.status === key).length;
  }
  return stats;
}
