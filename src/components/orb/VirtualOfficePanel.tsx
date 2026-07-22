import type { CSSProperties } from "react";

export type OfficeAgentId = "iron" | "captain" | "thor" | "hulk" | "widow" | "hawkeye";

type OfficeAgent = {
  id: OfficeAgentId;
  name: string;
  role: string;
  task: string;
  color: string;
  rgb: string;
  load: number;
};

const OFFICE_AGENTS: OfficeAgent[] = [
  { id: "iron", name: "IRON", role: "ORCHESTRATOR", task: "ARCHITECTING", color: "#ff5a38", rgb: "255,90,56", load: 82 },
  { id: "captain", name: "CAP", role: "STRATEGY", task: "PLANNING", color: "#4db6ff", rgb: "77,182,255", load: 64 },
  { id: "thor", name: "THOR", role: "INFRA", task: "DEPLOYING", color: "#8ee8ff", rgb: "142,232,255", load: 71 },
  { id: "hulk", name: "HULK", role: "COMPUTE", task: "PROCESSING", color: "#79ec69", rgb: "121,236,105", load: 88 },
  { id: "widow", name: "WIDOW", role: "INTELLIGENCE", task: "RESEARCHING", color: "#ff4d77", rgb: "255,77,119", load: 58 },
  { id: "hawkeye", name: "HAWK", role: "PRECISION QA", task: "TESTING", color: "#c68cff", rgb: "198,140,255", load: 43 },
];

function ChibiAgent({ agent, index, selected, onSelect }: { agent: OfficeAgent; index: number; selected: boolean; onSelect: () => void }) {
  return (
    <button
      className={`office-agent office-agent-${agent.id} office-route-${index + 1} ${selected ? "is-selected" : ""}`}
      style={{ "--agent-color": agent.color, "--agent-rgb": agent.rgb, "--route-delay": `${index * -2.7}s` } as CSSProperties}
      type="button"
      aria-label={`${agent.name}, ${agent.role}, ${agent.task}`}
      onClick={onSelect}
    >
      <span className="office-agent-shadow" />
      <span className="chibi-character" aria-hidden="true">
        <i className="chibi-cape" />
        <i className="chibi-backpack" />
        <i className="chibi-head"><b /><em /></i>
        <i className="chibi-hair" />
        <i className="chibi-body"><b /></i>
        <i className="chibi-arm chibi-arm-left" />
        <i className="chibi-arm chibi-arm-right" />
        <i className="chibi-leg chibi-leg-left" />
        <i className="chibi-leg chibi-leg-right" />
        <i className="chibi-gear" />
      </span>
      <span className="office-agent-label"><b>{agent.name}</b><small>{agent.task}</small></span>
    </button>
  );
}

export default function VirtualOfficePanel({ selectedId, onSelect }: { selectedId: OfficeAgentId; onSelect: (id: OfficeAgentId) => void }) {
  const selected = OFFICE_AGENTS.find((agent) => agent.id === selectedId) ?? OFFICE_AGENTS[0];

  return (
    <div className="virtual-office-module">
      <div className="office-status-strip">
        <div><i /><span>LIVE FLOOR</span><b>06 AGENTS</b></div>
        <p>Agent tự di chuyển giữa workstation, phòng họp và lõi điều phối.</p>
      </div>

      <div className="office-scene" role="list" aria-label="Văn phòng AI với các agent đang di chuyển">
        <div className="office-back-wall" aria-hidden="true">
          <span className="office-brand">J // AGENT OPERATIONS</span>
          <div className="office-city"><i /><i /><i /><i /><i /></div>
          <div className="office-mission-board"><b>ACTIVE MISSIONS</b><i /><i /><i /></div>
        </div>
        <div className="office-floor-grid" aria-hidden="true" />
        <div className="office-reactor-table" aria-hidden="true"><i /><b>AI</b><span /></div>
        {Array.from({ length: 6 }, (_, index) => (
          <div className={`office-desk office-desk-${index + 1}`} key={index} aria-hidden="true">
            <i className="desk-screen"><b>{String(index + 1).padStart(2, "0")}</b></i>
            <i className="desk-surface" />
            <i className="desk-chair" />
          </div>
        ))}
        {OFFICE_AGENTS.map((agent, index) => (
          <ChibiAgent key={agent.id} agent={agent} index={index} selected={selected.id === agent.id} onSelect={() => onSelect(agent.id)} />
        ))}
        <div className="office-route-light route-light-a" aria-hidden="true" />
        <div className="office-route-light route-light-b" aria-hidden="true" />
      </div>

      <div className="office-agent-console" style={{ "--agent-color": selected.color, "--agent-rgb": selected.rgb } as CSSProperties}>
        <div className={`office-portrait office-portrait-${selected.id}`}><i /><b>{selected.name.slice(0, 2)}</b></div>
        <div><span>SELECTED AGENT</span><b>{selected.name} // {selected.role}</b><small>{selected.task} · LOAD {selected.load}%</small></div>
        <div className="office-load"><i style={{ width: `${selected.load}%` }} /></div>
        <span className="office-agent-state">AGENT LINKED <b>●</b></span>
      </div>
    </div>
  );
}
