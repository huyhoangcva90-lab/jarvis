import type { Agent } from "../App";

type Props = { agents: Agent[]; selectedId: string; onSelect: (id: string) => void };

const activity = ["ARCHITECTING", "PLANNING", "DEPLOYING", "STANDBY", "RESEARCHING", "TESTING"];

export default function VirtualOffice({ agents, selectedId, onSelect }: Props) {
  return (
    <div className="virtual-office">
      <header className="office-header">
        <div><span>POWER REALM / LIVE WORKSPACE</span><h2>AI AGENT VIRTUAL OFFICE</h2><p>Quan sát agent và sub-agent làm việc theo thời gian thực</p></div>
        <div className="office-live"><i/><span>LIVE FLOOR</span><b>06 ONLINE</b></div>
      </header>

      <div className="office-room" role="list" aria-label="Các bàn làm việc của AI agent">
        <div className="office-wall-grid" aria-hidden="true" />
        <div className="office-window" aria-hidden="true"><i/><i/><i/><i/></div>
        <div className="office-board" aria-hidden="true"><span>SPRINT // 07</span><i/><i/><i/></div>
        {agents.map((agent, index) => (
          <button
            key={agent.id}
            role="listitem"
            className={`pixel-station station-${index + 1} ${agent.id === selectedId ? "is-selected" : ""}`}
            style={{ "--pixel": agent.color, "--pixel-rgb": agent.rgb } as React.CSSProperties}
            onClick={() => onSelect(agent.id)}
            aria-label={`${agent.codename}: ${activity[index]}`}
          >
            <span className="agent-bubble"><b>{agent.codename}</b><small>{activity[index]}</small></span>
            <span className="pixel-desk"><i className="pixel-screen"/><i className="pixel-keyboard"/></span>
            <span className="pixel-agent"><i className="pixel-head"/><i className="pixel-body"/><i className="pixel-leg left"/><i className="pixel-leg right"/></span>
            {index === 0 || index === 4 ? <span className="sub-agent"><i/><b>SUB</b></span> : null}
            <span className="task-pulse"><i/><b>{agent.load}%</b></span>
          </button>
        ))}
        <div className="office-floor-lines" aria-hidden="true" />
      </div>

      <footer className="office-console">
        <div><span>ACTIVE SESSION</span><b>avengers-tower/main</b></div>
        <div><span>AGENT EVENTS</span><b>128 / MIN</b></div>
        <div><span>ATTENTION</span><b className="needs-review">01 NEEDS REVIEW</b></div>
        <a href="https://www.youtube.com/watch?v=62Rfe1w9NBc" target="_blank" rel="noreferrer">VIDEO REFERENCE <b>↗</b></a>
      </footer>
    </div>
  );
}
