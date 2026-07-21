/**
 * Jarvis Six Realms — Mission Engine
 *
 * Quản lý danh sách Mission trong localStorage.
 * Hermes Orchestrator sử dụng engine này để tạo, cập nhật và theo dõi Mission.
 */
import { createMission, updateMission, completeMission, failMission, MISSION_STATUS } from "../types/mission.js";

const MISSIONS_KEY = "jarvis:missions:v1";

// ─── Persistence ─────────────────────────────────────────────
export function loadMissions() {
  try {
    const raw = localStorage.getItem(MISSIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveMissions(missions) {
  localStorage.setItem(MISSIONS_KEY, JSON.stringify(missions));
}

// ─── CRUD Operations ─────────────────────────────────────────
export function addMission(missions, missionData) {
  const mission = createMission(missionData);
  const updated = [mission, ...missions];
  saveMissions(updated);
  return { missions: updated, created: mission };
}

export function patchMission(missions, missionId, patch) {
  const updated = missions.map((m) =>
    m.id === missionId ? updateMission(m, patch) : m
  );
  saveMissions(updated);
  return updated;
}

export function completeMissionById(missions, missionId, result) {
  const updated = missions.map((m) =>
    m.id === missionId ? completeMission(m, result) : m
  );
  saveMissions(updated);
  return updated;
}

export function failMissionById(missions, missionId, error) {
  const updated = missions.map((m) =>
    m.id === missionId ? failMission(m, error) : m
  );
  saveMissions(updated);
  return updated;
}

export function cancelMission(missions, missionId) {
  return patchMission(missions, missionId, { status: MISSION_STATUS.CANCELLED });
}

export function removeMission(missions, missionId) {
  const updated = missions.filter((m) => m.id !== missionId);
  saveMissions(updated);
  return updated;
}

// ─── Queries ─────────────────────────────────────────────────
export function getActiveMissions(missions) {
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

export function getCompletedMissions(missions) {
  return missions.filter((m) => m.status === MISSION_STATUS.COMPLETED);
}

export function getMissionsByDomain(missions, domain) {
  return missions.filter((m) => m.domains.includes(domain));
}

export function getMissionStats(missions) {
  const stats = { total: missions.length };
  for (const key of Object.values(MISSION_STATUS)) {
    stats[key] = missions.filter((m) => m.status === key).length;
  }
  return stats;
}
