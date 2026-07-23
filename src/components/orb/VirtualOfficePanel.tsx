import type { CSSProperties } from "react";

export type OfficeAgentId = "iron" | "captain" | "thor" | "hulk" | "widow" | "hawkeye";

type OfficeAgent = {
  id: OfficeAgentId;
  name: string;
  room: string;
  role: string;
  task: string;
  gear: string;
  color: string;
  rgb: string;
  load: number;
};

const OFFICE_AGENTS: OfficeAgent[] = [
  { id: "iron", name: "IRON", room: "Arc Lab", role: "ORCHESTRATOR", task: "ARCHITECTING", gear: "Repulsor + arc console", color: "#ff5a38", rgb: "255,90,56", load: 82 },
  { id: "captain", name: "CAP", room: "War Room", role: "STRATEGY", task: "PLANNING", gear: "Shield + mission map", color: "#4db6ff", rgb: "77,182,255", load: 64 },
  { id: "thor", name: "THOR", room: "Bifrost Ops", role: "INFRA", task: "DEPLOYING", gear: "Hammer + cloud gate", color: "#8ee8ff", rgb: "142,232,255", load: 71 },
  { id: "hulk", name: "HULK", room: "Gamma Lab", role: "COMPUTE", task: "PROCESSING", gear: "Gamma rack + test rig", color: "#79ec69", rgb: "121,236,105", load: 88 },
  { id: "widow", name: "WIDOW", room: "Intel Room", role: "INTELLIGENCE", task: "RESEARCHING", gear: "Batons + threat screens", color: "#ff4d77", rgb: "255,77,119", load: 58 },
  { id: "hawkeye", name: "HAWK", room: "QA Range", role: "PRECISION QA", task: "TESTING", gear: "Bow + bug targets", color: "#c68cff", rgb: "198,140,255", load: 43 },
];

function ChibiAgent({ agent, index, selected, onSelect }: { agent: OfficeAgent; index: number; selected: boolean; onSelect: () => void }) {
  return (
    <button
      className={`av-agent av-agent-${agent.id} av-agent-pos-${index + 1} ${selected ? "is-selected" : ""}`}
      style={{ "--agent-color": agent.color, "--agent-rgb": agent.rgb } as CSSProperties}
      type="button"
      aria-label={`${agent.name}, ${agent.role}, ${agent.room}`}
      onClick={onSelect}
    >
      <span className="av-agent-label"><b>{agent.name}</b><small>{agent.task}</small></span>
      <span className="av-chibi" aria-hidden="true">
        <i className="av-chibi-shadow" />
        <i className="av-chibi-cape" />
        <i className="av-chibi-head"><b /></i>
        <i className="av-chibi-hair" />
        <i className="av-chibi-body" />
        <i className="av-chibi-arm av-left" />
        <i className="av-chibi-arm av-right" />
        <i className="av-chibi-leg av-left" />
        <i className="av-chibi-leg av-right" />
        <i className={`av-gear av-gear-${index + 1}`} />
      </span>
      <span className="av-desk-tag"><b>{agent.room}</b><small>{agent.gear}</small></span>
    </button>
  );
}

export default function VirtualOfficePanel({ selectedId, onSelect }: { selectedId: OfficeAgentId; onSelect: (id: OfficeAgentId) => void }) {
  const selected = OFFICE_AGENTS.find((agent) => agent.id === selectedId) ?? OFFICE_AGENTS[0];

  return (
    <div className="virtual-office-module av-office-module">
      <div className="office-status-strip av-office-status">
        <div><i /><span>PURPLE MODULE</span><b>AVENGERS OFFICE</b></div>
        <p>Mini Tower mo room, Common Room giu team dung co dinh trong he thong chat.</p>
      </div>

      <div className="av-office-grid">
        <aside className="av-tower-picker" aria-label="Avengers Tower rooms">
          <div className="av-tower-head">A</div>
          <div className="av-tower-levels">
            {OFFICE_AGENTS.map((agent, index) => (
              <button
                key={agent.id}
                className={selected.id === agent.id ? "is-selected" : ""}
                style={{ "--agent-color": agent.color, "--agent-rgb": agent.rgb } as CSSProperties}
                type="button"
                onClick={() => onSelect(agent.id)}
              >
                <span>L{86 - index * 8}</span>
                <b>{agent.room}</b>
              </button>
            ))}
          </div>
          <b className="av-tower-base">COMMON</b>
        </aside>

        <div className="office-scene av-common-room" role="list" aria-label="Avengers AI common office">
          <div className="office-back-wall av-room-wall" aria-hidden="true">
            <span className="office-brand">AVENGERS // AGENT COMMON ROOM</span>
            <div className="office-city"><i /><i /><i /><i /><i /></div>
            <div className="office-mission-board"><b>MISSION MAP</b><i /><i /><i /></div>
          </div>
          <div className="office-floor-grid" aria-hidden="true" />
          <div className="av-common-table" aria-hidden="true"><i /><b>AI</b><span /></div>
          <div className="av-server-rack" aria-hidden="true"><i /><i /><i /></div>
          <div className="av-target-wall" aria-hidden="true"><i /><b /></div>
          {OFFICE_AGENTS.map((agent, index) => (
            <ChibiAgent key={agent.id} agent={agent} index={index} selected={selected.id === agent.id} onSelect={() => onSelect(agent.id)} />
          ))}
        </div>
      </div>

      <div className="office-agent-console av-agent-console" style={{ "--agent-color": selected.color, "--agent-rgb": selected.rgb } as CSSProperties}>
        <div className={`office-portrait office-portrait-${selected.id}`}><i /><b>{selected.name.slice(0, 2)}</b></div>
        <div><span>SELECTED ROOM</span><b>{selected.room} // {selected.role}</b><small>{selected.task} - {selected.gear}</small></div>
        <div className="office-load"><i style={{ width: `${selected.load}%` }} /></div>
        <span className="office-agent-state">SMALL PURPLE MODULE <b>●</b></span>
      </div>
    </div>
  );
}
