import { useState, useMemo } from "react";
import Icon from "./Icon";

type MatrixNode = {
  id: string;
  label: string;
  category: "core" | "brain" | "agent" | "loop" | "plugin" | "channel";
  categoryLabel: string;
  status: "active" | "online" | "synced" | "standby";
  icon: string;
  color: string;
  x: number;
  y: number;
  description: string;
  metrics: string;
  connections: string[];
};

const INITIAL_NODES: MatrixNode[] = [
  {
    id: "core",
    label: "JARVIS Core OS",
    category: "core",
    categoryLabel: "Master Control",
    status: "active",
    icon: "🌟",
    color: "#00e5ff",
    x: 400,
    y: 240,
    description: "Lõi điều phối trung tâm J-Core, WebGL 3D Energy Orb và Gateway bảo mật cùng-origin.",
    metrics: "Uptime: 99.9% // Gateway Port 8787 // Latency: 4ms",
    connections: ["brain", "ninerouter", "hermes", "openclaw", "watchdog", "compiler", "briefing", "mcp", "bots"],
  },
  {
    id: "brain",
    label: "Second Brain Vault",
    category: "brain",
    categoryLabel: "Knowledge Base",
    status: "synced",
    icon: "🧠",
    color: "#ffd700",
    x: 180,
    y: 110,
    description: "Kho lưu trữ Markdown Vault, tự động biên dịch Wiki Graph và đồng bộ Git Cloud Remote.",
    metrics: "Vault: /brains/Brain Default/ // Git Commit: OK // Auto-Sync: 60m",
    connections: ["core", "compiler"],
  },
  {
    id: "ninerouter",
    label: "9Router AI Matrix",
    category: "agent",
    categoryLabel: "Model Router",
    status: "online",
    icon: "🔀",
    color: "#35d8ff",
    x: 620,
    y: 110,
    description: "Bộ định tuyến và cân bằng tải đa mô hình (Claude 3.7, GPT-4o, Gemini 2.0, DeepSeek R1, Ollama).",
    metrics: "Port: 20128 // Fallback Circuit: Active // 5 Upstreams",
    connections: ["core", "hermes", "openclaw"],
  },
  {
    id: "hermes",
    label: "Hermes Agent Core",
    category: "agent",
    categoryLabel: "Specialist Agents",
    status: "online",
    icon: "🪽",
    color: "#ff8c18",
    x: 680,
    y: 270,
    description: "Ma trận tác nhân chuyên gia (EV Advisor, Security Auditor, Code Architect, Content Strategist).",
    metrics: "Port: 8642 // Profile: Jarvis Default // Multiplex: Ready",
    connections: ["core", "ninerouter"],
  },
  {
    id: "openclaw",
    label: "OpenClaw Engine",
    category: "agent",
    categoryLabel: "Tool Executor",
    status: "online",
    icon: "🦅",
    color: "#d500f9",
    x: 620,
    y: 400,
    description: "Bộ thực thi công cụ tự động, quản trị tiến trình nền và phân tích tài liệu chuyên sâu.",
    metrics: "Port: 18789 // Gateway: Online // Tasks Engine: Ready",
    connections: ["core", "ninerouter", "mcp"],
  },
  {
    id: "watchdog",
    label: "Watchdog Loop",
    category: "loop",
    categoryLabel: "Autonomous Loop",
    status: "active",
    icon: "🛡️",
    color: "#00e676",
    x: 140,
    y: 250,
    description: "Vòng lặp tự động giám sát sức khỏe dịch vụ, phát hiện lỗi kết nối và khôi phục tiến trình.",
    metrics: "Interval: 30 phút // Trạng thái: Đang chạy nền",
    connections: ["core"],
  },
  {
    id: "compiler",
    label: "Compiler Loop",
    category: "loop",
    categoryLabel: "Autonomous Loop",
    status: "active",
    icon: "🧬",
    color: "#00e676",
    x: 180,
    y: 390,
    description: "Vòng lặp tự động trích xuất Facts, tổng hợp Living Profile và commit tri thức vào Git Vault.",
    metrics: "Interval: 60 phút // Trạng thái: Đang chạy nền",
    connections: ["core", "brain"],
  },
  {
    id: "briefing",
    label: "Briefing Loop",
    category: "loop",
    categoryLabel: "Autonomous Loop",
    status: "active",
    icon: "📋",
    color: "#00e676",
    x: 310,
    y: 450,
    description: "Vòng lặp tự động tổng hợp báo cáo điều hành, tin tức thế giới và nhắc nhở nhiệm vụ quan trọng.",
    metrics: "Interval: 120 phút // Trạng thái: Đang chạy nền",
    connections: ["core"],
  },
  {
    id: "mcp",
    label: "10 MCP Connectors",
    category: "plugin",
    categoryLabel: "Plugins Hub",
    status: "online",
    icon: "🔌",
    color: "#ff2a4b",
    x: 480,
    y: 450,
    description: "Kho công cụ kết nối ngoại vi: Pancake POS, Google Sheets, Meta Ads, Zalo Image, ChatGPT DALL-E...",
    metrics: "Total Plugins: 10 // Active: 10 // UVX Runtime: OK",
    connections: ["core", "openclaw"],
  },
  {
    id: "bots",
    label: "Telegram & Zalo Bots",
    category: "channel",
    categoryLabel: "Remote Channels",
    status: "online",
    icon: "📱",
    color: "#38f47b",
    x: 400,
    y: 60,
    description: "Kênh điều khiển từ xa qua Telegram Bot và Zalo Chatbot kết nối trực tiếp với máy trạm.",
    metrics: "Channels: 2 // Webhook: Ready // Voice STT: Whisper",
    connections: ["core"],
  },
];

export default function MatrixNetworkDiagram() {
  const [nodes] = useState<MatrixNode[]>(INITIAL_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("core");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [pulseSignal, setPulseSignal] = useState(0);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) || nodes[0],
    [nodes, selectedNodeId]
  );

  const filteredNodes = useMemo(() => {
    if (filterCategory === "all") return nodes;
    return nodes.filter((n) => n.category === filterCategory);
  }, [nodes, filterCategory]);

  const links = useMemo(() => {
    const list: Array<{ from: MatrixNode; to: MatrixNode; key: string }> = [];
    nodes.forEach((fromNode) => {
      fromNode.connections.forEach((targetId) => {
        const toNode = nodes.find((n) => n.id === targetId);
        if (toNode) {
          const key = [fromNode.id, toNode.id].sort().join("-");
          if (!list.some((l) => l.key === key)) {
            list.push({ from: fromNode, to: toNode, key });
          }
        }
      });
    });
    return list;
  }, [nodes]);

  return (
    <section className="matrix-diagram-shell" aria-label="Không gian ma trận kết nối nodes">
      {/* Top Filter Bar */}
      <header className="matrix-diagram-toolbar">
        <div className="matrix-filter-buttons">
          {[
            ["all", "TẤT CẢ NODES (10)"],
            ["core", "LÕI TRUNG TÂM"],
            ["agent", "MA TRẬN AI"],
            ["loop", "VÒNG LẶP LOOPS"],
            ["brain", "SECOND BRAIN"],
            ["plugin", "MCP PLUGINS"],
            ["channel", "KÊNH BOT"],
          ].map(([cat, label]) => (
            <button
              key={cat}
              type="button"
              className={filterCategory === cat ? "active" : ""}
              onClick={() => setFilterCategory(cat)}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="matrix-pulse-btn"
          onClick={() => setPulseSignal((s) => s + 1)}
        >
          ⚡ PHÁT TÍN HIỆU XUNG MẠNG
        </button>
      </header>

      <div className="matrix-diagram-body">
        {/* SVG Interactive Canvas */}
        <div className="matrix-canvas-wrapper">
          <svg viewBox="0 0 800 520" className="matrix-svg-canvas">
            <defs>
              <linearGradient id="coreGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#35d8ff" stopOpacity="0.2" />
              </linearGradient>
              <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Connection Lines */}
            {links.map((link) => {
              const isHighlighted =
                selectedNodeId === link.from.id || selectedNodeId === link.to.id;
              return (
                <g key={link.key}>
                  <line
                    x1={link.from.x}
                    y1={link.from.y}
                    x2={link.to.x}
                    y2={link.to.y}
                    className={`matrix-link-line ${isHighlighted ? "highlighted" : ""}`}
                    stroke={isHighlighted ? "var(--hot, #00e5ff)" : "rgba(0, 229, 255, 0.2)"}
                    strokeWidth={isHighlighted ? 2.5 : 1.2}
                    strokeDasharray={isHighlighted ? "none" : "4,4"}
                  />
                  {/* Pulsing signal dot */}
                  <circle
                    r={isHighlighted ? 3 : 2}
                    fill={isHighlighted ? "#fff" : "var(--hot, #00e5ff)"}
                    className="matrix-pulse-particle"
                  >
                    <animateMotion
                      path={`M${link.from.x},${link.from.y} L${link.to.x},${link.to.y}`}
                      dur={isHighlighted ? "2.5s" : "4.5s"}
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              );
            })}

            {/* Nodes */}
            {filteredNodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isCore = node.id === "core";
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className={`matrix-node-group ${isSelected ? "selected" : ""}`}
                  onClick={() => setSelectedNodeId(node.id)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Outer glow ring */}
                  <circle
                    r={isCore ? 38 : 28}
                    fill={isSelected ? `${node.color}22` : "rgba(2, 10, 18, 0.85)"}
                    stroke={isSelected ? node.color : `${node.color}66`}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    filter={isSelected ? "url(#glowEffect)" : undefined}
                    className={isSelected ? "node-active-pulse" : ""}
                  />
                  {/* Inner icon */}
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={isCore ? "20" : "15"}
                  >
                    {node.icon}
                  </text>
                  {/* Label */}
                  <text
                    y={isCore ? 50 : 40}
                    textAnchor="middle"
                    fill={isSelected ? "#fff" : "rgba(255,255,255,0.75)"}
                    fontSize={isCore ? "11" : "10"}
                    fontWeight={isSelected ? "800" : "600"}
                    fontFamily="monospace"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Node Inspector Panel */}
        <aside className="matrix-node-inspector">
          <div className="inspector-header">
            <span className="inspector-badge" style={{ borderColor: selectedNode.color, color: selectedNode.color }}>
              {selectedNode.categoryLabel.toUpperCase()}
            </span>
            <span className="inspector-status-dot" />
            <small>{selectedNode.status.toUpperCase()}</small>
          </div>

          <div className="inspector-title">
            <span style={{ fontSize: "24px" }}>{selectedNode.icon}</span>
            <div>
              <h3>{selectedNode.label}</h3>
              <code>ID: {selectedNode.id}</code>
            </div>
          </div>

          <p className="inspector-desc">{selectedNode.description}</p>

          <div className="inspector-metrics-box">
            <b>THÔNG SỐ VẬN HÀNH:</b>
            <p>{selectedNode.metrics}</p>
          </div>

          <div className="inspector-connections">
            <b>LIÊN KẾT TRỰC TIẾP ({selectedNode.connections.length}):</b>
            <div className="connections-pills">
              {selectedNode.connections.map((targetId) => {
                const targetNode = nodes.find((n) => n.id === targetId);
                return (
                  <button
                    key={targetId}
                    type="button"
                    className="connection-pill-btn"
                    onClick={() => setSelectedNodeId(targetId)}
                  >
                    <span>{targetNode?.icon || "•"}</span>
                    <b>{targetNode?.label || targetId}</b>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
