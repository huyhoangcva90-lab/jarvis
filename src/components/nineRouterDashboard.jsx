import { useState } from "react";
import Panel from "./Panel.jsx";
import { soundManager } from "../utils/soundManager.js";

const COMBOS = [
  {
    id: "balanced",
    name: "Balanced Core",
    desc: "Tối ưu hóa giữa chi phí và chất lượng cho các tác vụ hàng ngày.",
    primary: "Claude 3.5 Sonnet",
    fallback: "GPT-4o mini",
    cost: "Medium",
    efficiency: "92%"
  },
  {
    id: "code",
    name: "Code Master",
    desc: "Cấu hình ưu tiên sửa lỗi, tối ưu thuật toán và giải quyết logic lập trình.",
    primary: "Claude 3.5 Sonnet",
    fallback: "DeepSeek Coder v2",
    cost: "High",
    efficiency: "97%"
  },
  {
    id: "economy",
    name: "Economy Saver",
    desc: "Sử dụng mô hình nhỏ, phản hồi nhanh và cực kỳ tiết kiệm ngân sách.",
    primary: "GPT-4o mini",
    fallback: "Gemini 1.5 Flash",
    cost: "Low",
    efficiency: "78%"
  },
  {
    id: "research",
    name: "Research Deep-Dive",
    desc: "Chế độ suy luận sâu chuỗi suy nghĩ dài cho các vấn đề phức tạp.",
    primary: "o1 Pro",
    fallback: "Claude 3.5 Sonnet",
    cost: "Max",
    efficiency: "99%"
  }
];

const PROVIDERS = [
  { name: "OpenAI Gateway", latency: "32ms", status: "stable", color: "text-greenCore border-greenCore/20 bg-greenCore/10" },
  { name: "Anthropic API", latency: "54ms", status: "stable", color: "text-greenCore border-greenCore/20 bg-greenCore/10" },
  { name: "Gemini Vertex", latency: "18ms", status: "stable", color: "text-greenCore border-greenCore/20 bg-greenCore/10" },
  { name: "DeepSeek Cloud", latency: "162ms", status: "warning", color: "text-warningCore border-warningCore/20 bg-warningCore/10" },
  { name: "Local Ollama Llama3", latency: "—", status: "offline", color: "text-redCore border-redCore/20 bg-redCore/10" }
];

export default function NineRouterDashboard() {
  const [selectedCombo, setSelectedCombo] = useState("balanced");
  const [calcText, setCalcText] = useState("");

  const activeCombo = COMBOS.find((c) => c.id === selectedCombo) || COMBOS[0];

  const handleSelectCombo = (id) => {
    soundManager.play("click");
    setSelectedCombo(id);
  };

  const estTokens = Math.ceil(calcText.length / 4);
  const estCost = (estTokens * (selectedCombo === "research" ? 0.00003 : selectedCombo === "code" || selectedCombo === "balanced" ? 0.000015 : 0.000002)).toFixed(6);

  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      {/* Cột trái: Bộ chuyển Router Combo */}
      <Panel title="9Router combo matrix" kicker="Space Stone Gateway">
        <p className="mb-4 font-mono text-xs uppercase text-cyan-100/60">
          Chọn cấu hình định tuyến thông minh của bạn. 9Router sẽ tự động chia luồng yêu cầu đến model tối ưu nhất.
        </p>

        <div className="grid gap-3 md:grid-cols-2">
          {COMBOS.map((combo) => {
            const isSelected = selectedCombo === combo.id;
            return (
              <button
                key={combo.id}
                type="button"
                onClick={() => handleSelectCombo(combo.id)}
                className={`flex flex-col rounded border p-4 text-left font-mono transition-all duration-200 ${
                  isSelected
                    ? "border-cyanCore bg-cyanCore/15 shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                    : "border-cyan-300/20 bg-slate-950/40 hover:border-cyanCore/50 hover:bg-cyanCore/5"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold uppercase tracking-wider ${isSelected ? "text-cyanCore" : "text-cyan-100/90"}`}>
                    {combo.name}
                  </span>
                  {isSelected && (
                    <span className="h-2 w-2 rounded-full bg-cyanCore shadow-[0_0_8px_#22d3ee] animate-pulse" />
                  )}
                </div>
                <p className="mt-2 text-xs text-cyan-100/60 leading-relaxed min-h-[40px]">{combo.desc}</p>
                <div className="mt-4 border-t border-cyan-300/10 pt-3 flex justify-between text-[10px] text-cyan-100/50">
                  <div>
                    <span>Primary: </span>
                    <span className="text-cyan-100/80">{combo.primary}</span>
                  </div>
                  <div>
                    <span>Efficiency: </span>
                    <span className="text-cyanCore">{combo.efficiency}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Thông tin chi tiết cấu hình đang chọn */}
        <div className="mt-4 rounded border border-cyan-300/20 bg-slate-950/60 p-4 font-mono">
          <h3 className="text-xs font-bold uppercase text-cyanCore mb-3">Active Routing Strategy Specs</h3>
          <div className="grid gap-2 text-xs md:grid-cols-3">
            <div>
              <span className="text-cyan-100/40">PRIMARY MODEL:</span>
              <p className="mt-1 text-cyan-100">{activeCombo.primary}</p>
            </div>
            <div>
              <span className="text-cyan-100/40">FALLBACK BACKUP:</span>
              <p className="mt-1 text-cyan-100">{activeCombo.fallback}</p>
            </div>
            <div>
              <span className="text-cyan-100/40">COST WEIGHT:</span>
              <p className="mt-1 text-cyan-100 font-bold uppercase">{activeCombo.cost}</p>
            </div>
          </div>
        </div>
      </Panel>

      {/* Cột phải: Provider Latencies & Token calculator */}
      <div className="space-y-4">
        {/* Latency Health map */}
        <Panel title="API Gateway latency map" kicker="Provider status">
          <div className="space-y-2 font-mono text-xs">
            {PROVIDERS.map((prov, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between border rounded px-3 py-2 ${prov.color}`}
              >
                <span>{prov.name}</span>
                <div className="flex items-center gap-3">
                  <span className="font-bold">{prov.latency}</span>
                  <span className="text-[10px] uppercase opacity-75">{prov.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Token Calculator */}
        <Panel title="Token expense calculator" kicker="Usage estimation">
          <div className="space-y-3 font-mono">
            <textarea
              className="hud-input text-xs h-20 w-full"
              placeholder="Nhập đoạn chat nháp hoặc tài liệu để kiểm tra token..."
              value={calcText}
              onChange={(e) => setCalcText(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2 text-xs border-t border-cyan-300/10 pt-3">
              <div>
                <span className="text-cyan-100/40">EST. TOKENS:</span>
                <p className="mt-1 font-bold text-cyan-100">{estTokens} tkn</p>
              </div>
              <div>
                <span className="text-cyan-100/40">EST. COST:</span>
                <p className="mt-1 font-bold text-greenCore">${estCost}</p>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
