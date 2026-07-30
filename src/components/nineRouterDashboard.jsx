import { useState } from "react";
import Panel from "./Panel.jsx";
import { soundManager } from "../utils/soundManager.js";
import { gatewayFetch, getGatewayReply } from "../utils/gatewayClient.js";
import { useStoneState } from "../utils/stoneState.jsx";

const ROUTING_MODES = [
  { id: "balanced", name: "Balanced", description: "Cân bằng tốc độ, chất lượng và chi phí." },
  { id: "code", name: "Code", description: "Ưu tiên model phù hợp với lập trình." },
  { id: "economy", name: "Economy", description: "Ưu tiên model nhanh và tiết kiệm." },
  { id: "research", name: "Research", description: "Ưu tiên suy luận sâu cho bài toán phức tạp." },
];

export default function NineRouterDashboard({ data, addLog }) {
  const { connections } = useStoneState();
  const [mode, setMode] = useState("balanced");
  const [prompt, setPrompt] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const sendPrompt = async () => {
    const message = prompt.trim();
    if (!message || isSending) return;

    setIsSending(true);
    setResult("");
    setError("");
    soundManager.play("click");
    addLog?.(`9Router request sent in ${mode} mode.`);

    try {
      const response = await gatewayFetch(data, "/api/9router/chat", {
        method: "POST",
        timeoutMs: 60000,
        body: JSON.stringify({
          model: "Code",
          message,
          messages: [{ role: "user", content: message }],
          routingMode: mode,
        }),
      });
      if (response.source === "mock") {
        throw new Error(getGatewayReply(response) || "9Router chat endpoint chưa được cấu hình.");
      }
      setResult(getGatewayReply(response) || JSON.stringify(response.raw ?? response, null, 2));
      addLog?.("9Router response received.");
      soundManager.play("success");
    } catch (requestError) {
      setError(requestError?.message || "Không thể gửi yêu cầu tới 9Router.");
      addLog?.(`9Router request failed: ${requestError?.message || "unknown error"}`);
      soundManager.play("warning");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <Panel title="9Router live console" kicker="Multi-model gateway">
        <div className="space-y-4 font-mono">
          <div className={`rounded border p-3 text-xs ${
            connections.nineRouter
              ? "border-greenCore/30 bg-greenCore/10 text-greenCore"
              : "border-redCore/30 bg-redCore/10 text-redCore"
          }`}>
            9Router upstream: {connections.nineRouter ? "ONLINE" : "OFFLINE"}
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {ROUTING_MODES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setMode(item.id);
                  soundManager.play("click");
                }}
                className={`rounded border p-3 text-left text-xs ${
                  mode === item.id
                    ? "border-cyanCore bg-cyanCore/15 text-cyanCore"
                    : "border-cyan-300/20 bg-slate-950/40 text-cyan-100/60"
                }`}
              >
                <strong className="block uppercase">{item.name}</strong>
                <span className="mt-1 block text-[10px] opacity-70">{item.description}</span>
              </button>
            ))}
          </div>

          <textarea
            className="hud-input min-h-28 w-full text-xs"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Nhập prompt để kiểm tra định tuyến model thật..."
          />
          <button
            type="button"
            className="hud-button primary w-full text-xs uppercase"
            disabled={isSending || !prompt.trim()}
            onClick={sendPrompt}
          >
            {isSending ? "Đang định tuyến..." : "Gửi qua 9Router"}
          </button>
        </div>
      </Panel>

      <Panel title="Model response" kicker={`Routing mode: ${mode}`}>
        <div className="terminal-window min-h-[360px] max-h-[500px] overflow-auto whitespace-pre-wrap rounded border border-cyanCore/15 bg-black/70 p-4 font-mono text-xs text-cyanCore/90">
          {error ? (
            <span className="text-redCore">ERROR: {error}</span>
          ) : result ? (
            result
          ) : (
            <span className="text-cyan-100/40">Phản hồi thật từ 9Router sẽ xuất hiện tại đây.</span>
          )}
        </div>
      </Panel>
    </div>
  );
}
