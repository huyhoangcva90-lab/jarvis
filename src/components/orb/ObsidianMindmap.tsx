import React, { useMemo, useState, type CSSProperties } from "react";
import { buildObsidianGraph } from "../../utils/obsidianParser";

interface ObsidianMindmapProps {
  notes: { path: string; content: string }[];
  onSelectNote?: (path: string) => void;
}

const TOPIC_COLORS = ["#62e6ff", "#8b93ff", "#3fdc9a", "#f0a24a", "#e779ff", "#ff6e87"];

function shortLabel(value: string) {
  return value.length > 22 ? `${value.slice(0, 20)}…` : value;
}

export default function ObsidianMindmap({ notes, onSelectNote }: ObsidianMindmapProps) {
  const graph = useMemo(() => buildObsidianGraph(notes), [notes]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [zoom, setZoom] = useState(1);

  const topicColors = useMemo(
    () => new Map(graph.topics.map((topic, index) => [topic.id, TOPIC_COLORS[index % TOPIC_COLORS.length]])),
    [graph.topics],
  );
  const filteredNodes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return graph.nodes;
    return graph.nodes.filter(
      (node) =>
        node.title.toLowerCase().includes(term) ||
        node.folder.toLowerCase().includes(term) ||
        node.tags.some((tag) => tag.toLowerCase().includes(term)),
    );
  }, [graph.nodes, searchTerm]);
  const visibleNodeIds = useMemo(() => new Set(filteredNodes.map((node) => node.id)), [filteredNodes]);
  const linkedNodeIds = useMemo(
    () => new Set(graph.edges.flatMap((edge) => [edge.source, edge.target])),
    [graph.edges],
  );

  return (
    <div className="obsidian-mindmap-container">
      <div className="mindmap-canvas-wrapper">
        <svg
          className="mindmap-svg"
          viewBox="-420 -300 840 600"
          style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
          aria-label="Mạng tri thức JARVIS"
        >
          <defs>
            <radialGradient id="jarvis-core-fill">
              <stop offset="0%" stopColor="rgba(255,255,255,.96)" />
              <stop offset="34%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="rgba(var(--accent-rgb),.06)" />
            </radialGradient>
            <filter id="jarvis-node-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <pattern id="jarvis-grid-dots" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r=".7" fill="rgba(var(--accent-rgb),.18)" />
            </pattern>
          </defs>

          <rect x="-420" y="-300" width="840" height="600" fill="url(#jarvis-grid-dots)" />

          <g className="mindmap-core" aria-hidden="true">
            <circle r="92" className="mindmap-core-orbit outer" />
            <circle r="61" className="mindmap-core-orbit" />
            <circle r="34" className="mindmap-core-disc" />
            <circle r="8" className="mindmap-core-pulse" />
            <text y="54">JARVIS</text>
            <text y="68" className="mindmap-core-subtitle">SECOND BRAIN</text>
          </g>

          <g className="mindmap-edges">
            {filteredNodes.map((node) =>
              linkedNodeIds.has(node.id) ? null : (
                <line
                  key={`core-${node.id}`}
                  x1="0"
                  y1="0"
                  x2={node.x || 0}
                  y2={node.y || 0}
                  className="mindmap-core-link"
                />
              ),
            )}
            {graph.edges.map((edge) => {
              if (!visibleNodeIds.has(edge.source) || !visibleNodeIds.has(edge.target)) return null;
              const sourceNode = graph.nodes.find((node) => node.id === edge.source);
              const targetNode = graph.nodes.find((node) => node.id === edge.target);
              if (!sourceNode || !targetNode) return null;
              const highlighted = selectedNodeId === sourceNode.id || selectedNodeId === targetNode.id;
              return (
                <line
                  key={`${edge.source}-${edge.target}`}
                  x1={sourceNode.x || 0}
                  y1={sourceNode.y || 0}
                  x2={targetNode.x || 0}
                  y2={targetNode.y || 0}
                  className={`mindmap-edge ${highlighted ? "highlighted" : ""}`}
                />
              );
            })}
          </g>

          <g className="mindmap-nodes">
            {filteredNodes.map((node) => {
              const selected = selectedNodeId === node.id;
              const color = topicColors.get(node.topic) || TOPIC_COLORS[0];
              return (
                <g
                  key={node.id}
                  className={`mindmap-node-group ${selected ? "selected" : ""}`}
                  style={{ "--node-color": color } as CSSProperties}
                  transform={`translate(${node.x || 0}, ${node.y || 0})`}
                  role="button"
                  tabIndex={0}
                  aria-label={`Mở ghi chú ${node.title}`}
                  onClick={() => {
                    setSelectedNodeId(node.id);
                    onSelectNote?.(node.path);
                  }}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter" && event.key !== " ") return;
                    event.preventDefault();
                    setSelectedNodeId(node.id);
                    onSelectNote?.(node.path);
                  }}
                >
                  <circle r={selected ? 10 : 6} className="mindmap-node-halo" />
                  <circle r={selected ? 5 : 3.5} className="mindmap-node-circle" />
                  <text y={selected ? 22 : 17} className="mindmap-node-label">{shortLabel(node.title)}</text>
                </g>
              );
            })}
          </g>
        </svg>

        <div className="mindmap-controls" aria-label="Điều khiển đồ thị">
          <input
            type="search"
            placeholder="Tìm trong não…"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <button type="button" onClick={() => setZoom((value) => Math.max(.65, value - .12))} aria-label="Thu nhỏ">−</button>
          <button type="button" onClick={() => setZoom(1)} aria-label="Đặt lại tỷ lệ">1:1</button>
          <button type="button" onClick={() => setZoom((value) => Math.min(1.65, value + .12))} aria-label="Phóng to">+</button>
        </div>

        <div className="mindmap-topic-legend" aria-label="Nhóm tri thức">
          {graph.topics.slice(0, 6).map((topic, index) => (
            <span key={topic.id} style={{ "--topic-color": TOPIC_COLORS[index % TOPIC_COLORS.length] } as CSSProperties}>
              <i />{topic.label}<b>{topic.count}</b>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
