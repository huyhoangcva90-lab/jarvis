import React, { useState, useMemo } from "react";
import { buildObsidianGraph } from "../../utils/obsidianParser";
import Icon from "./Icon";

interface ObsidianMindmapProps {
  notes: { path: string; content: string }[];
  onSelectNote?: (path: string) => void;
}

export default function ObsidianMindmap({ notes, onSelectNote }: ObsidianMindmapProps) {
  const graph = useMemo(() => buildObsidianGraph(notes), [notes]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(() => graph.nodes[0]?.id || null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTopic, setActiveTopic] = useState("all");
  const [zoom, setZoom] = useState(1);

  const filteredNodes = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return graph.nodes.filter(
      (n) => (activeTopic === "all" || n.topic === activeTopic)
        && (!term || n.title.toLowerCase().includes(term) || n.folder.toLowerCase().includes(term) || n.tags.some((t) => t.toLowerCase().includes(term)))
    );
  }, [activeTopic, graph.nodes, searchTerm]);

  const visibleNodeIds = useMemo(() => new Set(filteredNodes.map((node) => node.id)), [filteredNodes]);

  const selectedNode = useMemo(
    () => graph.nodes.find((n) => n.id === selectedNodeId) || graph.nodes[0] || null,
    [graph.nodes, selectedNodeId]
  );

  return (
    <div className="obsidian-mindmap-container">
      <header className="obsidian-mindmap-toolbar">
        <div className="mindmap-title">
          <Icon name="document" />
          <span>OBSIDIAN VAULT MINDMAP</span>
          <small>{graph.nodes.length} Notes · {graph.edges.length} Links</small>
        </div>
        <div className="mindmap-controls">
          <input
            type="text"
            placeholder="Tìm ghi chú / #tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="button" onClick={() => setZoom((z) => Math.min(1.8, z + 0.15))} title="Phóng to">
            +
          </button>
          <button type="button" onClick={() => setZoom((z) => Math.max(0.5, z - 0.15))} title="Thu nhỏ">
            -
          </button>
          <button type="button" onClick={() => setZoom(1)} title="Đặt lại zoom">
            1:1
          </button>
        </div>
      </header>

      <nav className="obsidian-topic-lane" aria-label="Chủ đề trong Obsidian vault">
        <button type="button" className={activeTopic === "all" ? "active" : ""} onClick={() => setActiveTopic("all")}><b>Tất cả</b><small>{graph.nodes.length}</small></button>
        {graph.topics.map((topic) => (
          <button type="button" key={topic.id} className={activeTopic === topic.id ? "active" : ""} onClick={() => setActiveTopic(topic.id)}>
            <b>{topic.label}</b><small>{topic.count}</small>
          </button>
        ))}
      </nav>

      <div className="obsidian-mindmap-body">
        <div className="mindmap-canvas-wrapper">
          <svg
            className="mindmap-svg"
            viewBox="-400 -300 800 600"
            style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
          >
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(var(--accent-rgb), 0.4)" />
              </marker>
            </defs>

            {/* Edges */}
            <g className="mindmap-edges">
              {graph.edges.map((edge, idx) => {
                if (!visibleNodeIds.has(edge.source) || !visibleNodeIds.has(edge.target)) return null;
                const sourceNode = graph.nodes.find((n) => n.id === edge.source);
                const targetNode = graph.nodes.find((n) => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;
                const isHighlighted =
                  selectedNode && (selectedNode.id === sourceNode.id || selectedNode.id === targetNode.id);
                return (
                  <line
                    key={`${edge.source}-${edge.target}-${idx}`}
                    x1={sourceNode.x || 0}
                    y1={sourceNode.y || 0}
                    x2={targetNode.x || 0}
                    y2={targetNode.y || 0}
                    className={`mindmap-edge ${isHighlighted ? "highlighted" : ""}`}
                    markerEnd="url(#arrow)"
                  />
                );
              })}
            </g>

            {/* Nodes */}
            <g className="mindmap-nodes">
              {filteredNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const nodeRadius = isSelected ? 24 : 18;
                return (
                  <g
                    key={node.id}
                    className={`mindmap-node-group ${isSelected ? "selected" : ""}`}
                    transform={`translate(${node.x || 0}, ${node.y || 0})`}
                    role="button"
                    tabIndex={0}
                    aria-label={`Mở ghi chú ${node.title}`}
                    onClick={() => {
                      setSelectedNodeId(node.id);
                      if (onSelectNote) onSelectNote(node.path);
                    }}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter" && event.key !== " ") return;
                      event.preventDefault();
                      setSelectedNodeId(node.id);
                      if (onSelectNote) onSelectNote(node.path);
                    }}
                  >
                    <circle r={nodeRadius} className="mindmap-node-circle" />
                    <text y={nodeRadius + 14} className="mindmap-node-label">
                      {node.title}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Selected Note Inspector Panel */}
        {selectedNode && (
          <aside className="mindmap-inspector">
            <header>
              <small>NOTE INSPECTOR</small>
              <h4>{selectedNode.title}</h4>
              <span className="node-path">{selectedNode.path}</span>
            </header>
            <div className="inspector-content">
              <p className="summary-text">{selectedNode.summary}</p>

              <div className="note-context-grid">
                <span><small>TOPIC</small><b>{selectedNode.topic}</b></span>
                <span><small>FOLDER</small><b>{selectedNode.folder}</b></span>
                <span><small>LINKS</small><b>{selectedNode.linkIds.length}</b></span>
                <span><small>BACKLINKS</small><b>{selectedNode.backlinks.length}</b></span>
              </div>

              {selectedNode.tags.length > 0 && (
                <div className="tags-section">
                  <span>TAGS:</span>
                  <div className="tag-badges">
                    {selectedNode.tags.map((tag) => (
                      <span key={tag} className="tag-badge">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedNode.links.length > 0 && (
                <div className="links-section">
                  <span>OUTGOING LINKS ({selectedNode.links.length}):</span>
                  <ul>
                    {selectedNode.links.map((link, index) => (
                      <li key={`${link}-${index}`} onClick={() => setSelectedNodeId(selectedNode.linkIds[index] || selectedNode.id)}>
                        <Icon name="external" />
                        <span>{link}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedNode.backlinks.length > 0 && (
                <div className="links-section backlinks-section">
                  <span>BACKLINKS ({selectedNode.backlinks.length}):</span>
                  <ul>{selectedNode.backlinks.map((sourceId) => {
                    const source = graph.nodes.find((node) => node.id === sourceId);
                    return source ? <li key={sourceId} onClick={() => setSelectedNodeId(sourceId)}><Icon name="external" /><span>{source.title}</span></li> : null;
                  })}</ul>
                </div>
              )}
            </div>
            {onSelectNote && (
              <button
                type="button"
                className="view-full-note-btn"
                onClick={() => onSelectNote(selectedNode.path)}
              >
                Mở đọc tài liệu
              </button>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
