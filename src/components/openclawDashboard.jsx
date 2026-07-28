import { useState } from "react";
import Panel from "./Panel.jsx";
import { soundManager } from "../utils/soundManager.js";
import { gatewayFetch, getGatewayReply } from "../utils/gatewayClient.js";
import { useStoneState } from "../utils/stoneState.jsx";

const QUICK_MISSIONS = [
  "Kiểm tra trạng thái toàn bộ dịch vụ và báo cáo lỗi.",
  "Tổng hợp các nhiệm vụ đang chờ xử lý.",
  "Kiểm tra độ trễ của các model qua 9Router.",
];

export default function OpenclawDashboard({ data, addLog }) {
  const { connections } = useStoneState();
  const [mission, setMission] = useState(QUICK_MISSIONS[0]);
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const dispatchMission = async () => {
    const task = mission.trim();
    if (!task || isSending) return;

    setIsSending(true);
    setResult("");
    setError("");
    soundManager.play("click");
    addLog?.(`OpenClaw mission dispatched: "${task.slice(0, 48)}"`);

    try {
      const response = await gatewayFetch(data, "/api/openclaw/task", {
        method: "POST",
        timeoutMs: 60000,
        body: JSON.stringify({
          task,
          prompt: task,
          operator: data?.username || "Operator",
        }),
      });
      if (response.source === "mock") {
        throw new Error(response.message || "OpenClaw task endpoint chưa được cấu hình.");
      }
      const output = getGatewayReply(response);
      setResult(output || JSON.stringify(response.raw ?? response, null, 2));
      addLog?.("OpenClaw mission accepted by gateway.");
      soundManager.play("success");
    } catch (requestError) {
      setError(requestError?.message || "Không thể gửi nhiệm vụ tới OpenClaw.");
      addLog?.(`OpenClaw mission failed: ${requestError?.message || "unknown error"}`);
      soundManager.play("warning");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <Panel title="OpenClaw mission dispatch" kicker="Live gateway control">
        <div className="space-y-4 font-mono">
          <div className={`rounded border p-3 text-xs ${
            connections.openclaw
              ? "border-greenCore/30 bg-greenCore/10 text-greenCore"
              : "border-redCore/30 bg-redCore/10 text-redCore"
          }`}>
            OpenClaw upstream: {connections.openclaw ? "ONLINE" : "OFFLINE"}
          </div>

          <label className="field-label">
            Mission
            <textarea
              className="hud-input min-h-32 w-full text-xs"
              value={mission}
              onChange={(event) => setMission(event.target.value)}
              placeholder="Nhập nhiệm vụ cần OpenClaw thực hiện..."
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {QUICK_MISSIONS.map((item) => (
              <button
                key={item}
                type="button"
                className="hud-button text-[10px]"
                onClick={() => setMission(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="hud-button primary w-full text-xs uppercase"
            disabled={isSending || !mission.trim()}
            onClick={dispatchMission}
          >
            {isSending ? "Đang gửi nhiệm vụ..." : "Gửi qua gateway"}
          </button>
        </div>
      </Panel>

      <Panel title="OpenClaw response" kicker="Upstream result">
        <div className="terminal-window min-h-[320px] max-h-[460px] overflow-auto whitespace-pre-wrap rounded border border-cyanCore/15 bg-black/70 p-4 font-mono text-xs text-cyanCore/90">
          {error ? (
            <span className="text-redCore">ERROR: {error}</span>
          ) : result ? (
            result
          ) : (
            <span className="text-cyan-100/40">
              Kết quả thật từ OpenClaw sẽ xuất hiện tại đây. Không còn chạy mô phỏng agent ở trình duyệt.
            </span>
          )}
        </div>
      </Panel>
    </div>
  );
}
