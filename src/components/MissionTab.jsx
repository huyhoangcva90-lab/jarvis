import { useState, useEffect } from "react";
import Panel from "./Panel.jsx";
import { loadMissions, saveMissions, addMission, removeMission, patchMission, completeMissionById } from "../utils/missionEngine.js";
import { useStoneState } from "../utils/stoneState.js";
import { STONE_META } from "../types/stones.js";
import { MISSION_PRIORITY, MISSION_STATUS } from "../types/mission.js";
import { soundManager } from "../utils/soundManager.js";
import ApprovalDrawer from "./ApprovalDrawer.jsx";

export default function MissionTab({ data, updateData, addLog }) {
  const [missions, setMissions] = useState(() => loadMissions());
  const { setStoneStatus } = useStoneState();

  // Form states
  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState("space");
  const [priority, setPriority] = useState(MISSION_PRIORITY.NORMAL);
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [rawSteps, setRawSteps] = useState("Kiểm tra hệ thống, Phân tích dữ liệu, Biên dịch mã nguồn, Triển khai sản phẩm");

  // Simulator states
  const [activeSim, setActiveSim] = useState(null); // mission object being simulated
  const [simStepIdx, setSimStepIdx] = useState(0);
  const [simProgress, setSimProgress] = useState(0);
  const [simIntervalId, setSimIntervalId] = useState(null);
  const [showApproval, setShowApproval] = useState(false);

  // Sync data with storage on initial load if empty
  useEffect(() => {
    if (missions.length === 0) {
      const defaultMissions = [
        {
          id: "mission-default-1",
          title: "Optimize 9Router Latency",
          description: "Auto-routing performance audit across OpenAI and Anthropic.",
          status: MISSION_STATUS.INBOX,
          priority: MISSION_PRIORITY.HIGH,
          domains: ["space"],
          steps: ["Gửi truy vấn test", "Đo thời gian phản hồi", "Chuyển cấu hình định tuyến", "Lưu bộ nhớ đệm"],
          progress: 0,
          requiresApproval: false,
          createdAt: new Date().toISOString()
        },
        {
          id: "mission-default-2",
          title: "Deploy OpenClaw Forge Agent",
          description: "Initialize and audit Code Architect workforce node.",
          status: MISSION_STATUS.INBOX,
          priority: MISSION_PRIORITY.CRITICAL,
          domains: ["power"],
          steps: ["Tạo môi trường sandbox", "Tải package code", "Chạy thử nghiệm JUnit", "Duyệt phát hành code"],
          progress: 0,
          requiresApproval: true,
          createdAt: new Date().toISOString()
        }
      ];
      saveMissions(defaultMissions);
      setMissions(defaultMissions);
    }
  }, []);

  // Cleanup simulation interval on unmount
  useEffect(() => {
    return () => {
      if (simIntervalId) clearInterval(simIntervalId);
    };
  }, [simIntervalId]);

  const handleCreateMission = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    soundManager.play("click");
    const steps = rawSteps.split(",").map((s) => s.trim()).filter(Boolean);
    const newMissionData = {
      title,
      description: `Nhiệm vụ quản lý ${STONE_META[domain].label}`,
      domains: [domain],
      priority,
      steps: steps.length > 0 ? steps : ["Thực thi nhiệm vụ"],
      requiresApproval
    };

    const result = addMission(missions, newMissionData);
    setMissions(result.missions);
    setTitle("");
    setRequiresApproval(false);
    addLog(`Đã tạo nhiệm vụ mới: ${title}`);
  };

  const handleDeleteMission = (id) => {
    soundManager.play("warning");
    const updated = removeMission(missions, id);
    setMissions(updated);
    if (activeSim?.id === id) {
      stopSimulation(null);
    }
  };

  // Trình giả lập chạy nhiệm vụ
  const startSimulation = (mission) => {
    soundManager.play("click");
    if (simIntervalId) {
      clearInterval(simIntervalId);
    }

    setActiveSim(mission);
    setSimStepIdx(0);
    setSimProgress(0);
    addLog(`Bắt đầu chạy mô phỏng nhiệm vụ: ${mission.title}`);

    // Đặt trạng thái stone tương ứng sang WORKING
    mission.domains.forEach((d) => setStoneStatus(d, "working"));

    const interval = setInterval(() => {
      setSimStepIdx((currIdx) => {
        const nextIdx = currIdx + 1;
        const totalSteps = mission.steps.length;

        if (currIdx >= totalSteps) {
          // Hoàn thành nhiệm vụ
          clearInterval(interval);
          finishSimulation(mission);
          return currIdx;
        }

        // Kiểm tra xem bước tiếp theo có yêu cầu Phê duyệt không (chỉ mô phỏng bước cuối cùng hoặc bước được chọn)
        // Trong trường hợp này, nếu có requiresApproval, dừng lại ở bước cuối trước khi hoàn thành
        if (mission.requiresApproval && nextIdx === totalSteps - 1) {
          clearInterval(interval);
          // Đặt trạng thái stone tương ứng sang APPROVAL
          mission.domains.forEach((d) => setStoneStatus(d, "approval"));
          setShowApproval(true);
          addLog(`Nhiệm vụ tạm dừng: Chờ operator phê duyệt bước '${mission.steps[nextIdx]}'`);
          return nextIdx;
        }

        // Tăng tiến độ
        const prog = Math.round((nextIdx / totalSteps) * 100);
        setSimProgress(prog);
        addLog(`Nhiệm vụ [${mission.title}]: Đang thực hiện '${mission.steps[nextIdx]}'`);
        soundManager.play("beep");
        
        // Cập nhật list local storage
        updateMissionProgress(mission.id, MISSION_STATUS.WORKING, prog);

        return nextIdx;
      });
    }, 2500);

    setSimIntervalId(interval);
  };

  const updateMissionProgress = (id, status, progress) => {
    const updated = patchMission(missions, id, { status, progress });
    setMissions(updated);
  };

  const finishSimulation = (mission) => {
    const updated = completeMissionById(missions, mission.id, "Mô phỏng hoàn thành thành công.");
    setMissions(updated);
    setActiveSim(null);
    setSimIntervalId(null);
    addLog(`Nhiệm vụ hoàn thành xuất sắc: ${mission.title}`);
    soundManager.play("success");

    // Đổi lại trạng thái stone sang COMPLETED rồi DORMANT sau vài giây
    mission.domains.forEach((d) => {
      setStoneStatus(d, "completed");
      setTimeout(() => setStoneStatus(d, "dormant"), 5000);
    });
  };

  const stopSimulation = (mission) => {
    if (simIntervalId) clearInterval(simIntervalId);
    setSimIntervalId(null);
    setActiveSim(null);
    setShowApproval(false);
    if (mission) {
      updateMissionProgress(mission.id, MISSION_STATUS.CANCELLED, 0);
      mission.domains.forEach((d) => setStoneStatus(d, "dormant"));
      addLog(`Mô phỏng nhiệm vụ bị hủy bỏ: ${mission.title}`);
    }
  };

  const handleApproveAction = () => {
    setShowApproval(false);
    addLog("Quyền được cấp bởi Operator. Tiếp tục thực hiện nhiệm vụ...");
    
    // Đặt lại trạng thái stone sang WORKING
    activeSim.domains.forEach((d) => setStoneStatus(d, "working"));

    // Tiếp tục chạy mô phỏng bước cuối cùng
    const totalSteps = activeSim.steps.length;
    const nextIdx = simStepIdx;

    setSimProgress(100);
    setTimeout(() => {
      finishSimulation(activeSim);
    }, 2000);
  };

  const handleDenyAction = () => {
    setShowApproval(false);
    addLog("Quyền bị Operator TỪ CHỐI. Huỷ bỏ nhiệm vụ.");
    
    // Đặt trạng thái stone sang ERROR
    activeSim.domains.forEach((d) => {
      setStoneStatus(d, "error", { error: "Operator denied authorization" });
      setTimeout(() => setStoneStatus(d, "dormant"), 4000);
    });

    const updated = patchMission(missions, activeSim.id, { status: MISSION_STATUS.FAILED, progress: 0 });
    setMissions(updated);
    setActiveSim(null);
    setSimIntervalId(null);
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
      {/* Cột trái: Quản lý và danh sách Nhiệm vụ */}
      <div className="space-y-4">
        {/* Biểu mẫu tạo mới */}
        <Panel title="Mission Creator Matrix" kicker="New parameter entry">
          <form onSubmit={handleCreateMission} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="field-label">
                Tên nhiệm vụ
                <input
                  className="hud-input"
                  placeholder="Ví dụ: Kiểm tra bảo mật Cloud..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>

              <label className="field-label">
                Realm Gate / Domain
                <select
                  className="hud-input"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                >
                  {Object.entries(STONE_META).map(([id, meta]) => (
                    <option key={id} value={id}>
                      {meta.icon} {meta.label} ({meta.domain})
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="field-label">
                Độ ưu tiên
                <select
                  className="hud-input"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value={MISSION_PRIORITY.LOW}>LOW</option>
                  <option value={MISSION_PRIORITY.NORMAL}>NORMAL</option>
                  <option value={MISSION_PRIORITY.HIGH}>HIGH</option>
                  <option value={MISSION_PRIORITY.CRITICAL}>CRITICAL</option>
                </select>
              </label>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-3 cursor-pointer select-none font-mono text-xs uppercase text-cyan-100/80">
                  <input
                    type="checkbox"
                    checked={requiresApproval}
                    onChange={(e) => setRequiresApproval(e.target.checked)}
                    className="h-4 w-4 rounded border-cyan-300/20 bg-slate-950 text-cyanCore focus:ring-0"
                  />
                  Yêu cầu phê duyệt bảo mật
                </label>
              </div>
            </div>

            <label className="field-label">
              Các bước thực thi (Cách nhau bằng dấu phẩy)
              <input
                className="hud-input"
                value={rawSteps}
                onChange={(e) => setRawSteps(e.target.value)}
              />
            </label>

            <button type="submit" className="hud-button primary w-full text-xs uppercase">
              Create Mission & Deploy to Core
            </button>
          </form>
        </Panel>

        {/* Danh sách nhiệm vụ */}
        <Panel title="Active Mission Database" kicker="All registered tasks">
          <div className="space-y-3">
            {missions.length === 0 ? (
              <p className="font-mono text-xs text-cyan-100/40 text-center py-6">
                Chưa có nhiệm vụ nào được đăng ký trong database.
              </p>
            ) : (
              missions.map((mission) => {
                const isActive = activeSim?.id === mission.id;
                return (
                  <div
                    key={mission.id}
                    className={`border rounded p-4 font-mono transition-all duration-200 ${
                      isActive
                        ? "border-cyanCore bg-cyanCore/10"
                        : "border-cyan-300/10 bg-slate-950/40"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 border-b border-cyan-300/10 pb-2">
                      <div>
                        <h4 className="text-sm font-bold text-cyan-50">{mission.title}</h4>
                        <p className="mt-1 text-[10px] text-cyan-100/50">
                          Domain: <span className="text-cyanCore">{mission.domains.map(d => STONE_META[d].label).join(", ")}</span> | Priority: <span className="text-amberCore uppercase">{mission.priority}</span>
                        </p>
                      </div>

                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => startSimulation(mission)}
                          disabled={!!activeSim && !isActive}
                          className={`hud-button text-[10px] py-1 px-2.5 uppercase ${
                            isActive
                              ? "primary"
                              : "border-cyan-300/20 hover:border-cyanCore/50"
                          } ${!!activeSim && !isActive ? "opacity-35 cursor-not-allowed" : ""}`}
                        >
                          {isActive ? "Running..." : "Simulate"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMission(mission.id)}
                          className="hud-button danger text-[10px] py-1 px-2 uppercase"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] text-cyan-100/50 mb-1">
                        <span className="uppercase">Mission Progress Status</span>
                        <span>{mission.progress || 0}%</span>
                      </div>
                      <div className="h-1 w-full bg-slate-900 rounded overflow-hidden">
                        <div
                          className="h-full bg-cyanCore transition-all duration-300"
                          style={{ width: `${mission.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Panel>
      </div>

      {/* Cột phải: Control Panel Giả Lập & Timer */}
      <div className="space-y-4">
        {/* Simulator Control Card */}
        <Panel title="Mission Simulator Panel" kicker="Running simulation specs">
          {activeSim ? (
            <div className="space-y-4 font-mono text-xs text-cyan-100">
              <div className="flex items-center justify-between border-b border-cyan-300/10 pb-2">
                <span className="font-bold text-cyanCore uppercase">{activeSim.title}</span>
                <span className="text-amberCore animate-pulse uppercase">Active</span>
              </div>

              <div>
                <span className="text-[10px] text-cyan-100/40 uppercase">Steps List:</span>
                <ul className="mt-2 space-y-1.5 pl-2">
                  {activeSim.steps.map((step, idx) => {
                    const isPassed = idx < simStepIdx;
                    const isCurrent = idx === simStepIdx;
                    return (
                      <li
                        key={idx}
                        className={`flex items-center gap-2 ${
                          isCurrent
                            ? "text-cyanCore font-bold"
                            : isPassed
                            ? "text-greenCore opacity-70"
                            : "opacity-40"
                        }`}
                      >
                        <span>{isPassed ? "✓" : isCurrent ? "▶" : "○"}</span>
                        <span>{step}</span>
                        {isCurrent && showApproval && (
                          <span className="text-[9px] uppercase border border-dangerCore/40 bg-dangerCore/10 px-1 py-0.5 text-dangerCore animate-pulse rounded">
                            Approve Required
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="pt-3 border-t border-cyan-300/10 flex justify-between">
                <button
                  type="button"
                  onClick={() => stopSimulation(activeSim)}
                  className="hud-button danger text-[10px] w-full py-2 uppercase"
                >
                  Cancel Simulation
                </button>
              </div>
            </div>
          ) : (
            <div className="font-mono text-xs text-cyan-100/40 text-center py-10">
              Chưa có mô phỏng nhiệm vụ nào đang chạy. Nhấp nút "Simulate" trên bất kỳ nhiệm vụ nào để bắt đầu.
            </div>
          )}
        </Panel>

        {/* Focus timer panel (Giữ lại cấu trúc HUD cũ) */}
        <Panel title="Focus Control" kicker="Pomodoro Timer">
          <div className="rounded border border-cyan-300/20 bg-slate-950/60 p-4 text-center">
            <p className="font-mono text-xs uppercase text-cyan-100/60">Focus timer</p>
            <p className="mt-2 font-mono text-5xl text-cyan-50">25:00</p>
            <p className="mt-2 text-sm text-cyan-100/60">Timer module reserved for next upgrade.</p>
          </div>
        </Panel>
      </div>

      {/* Approval dialog overlay */}
      <ApprovalDrawer
        isOpen={showApproval}
        domain={activeSim ? activeSim.domains.map(d => STONE_META[d].label).join(", ") : ""}
        title={activeSim ? activeSim.title : ""}
        description={activeSim ? `Hệ thống yêu cầu xác nhận của Operator để chạy bước bảo mật: '${activeSim.steps[simStepIdx]}'` : ""}
        onApprove={handleApproveAction}
        onDeny={handleDenyAction}
      />
    </div>
  );
}
