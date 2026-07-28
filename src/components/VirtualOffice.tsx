import type { Agent } from "../App";

type Props = { agents: Agent[]; selectedId: string; onSelect: (id: string) => void };

const activity = ["ARCHITECTING", "PLANNING", "DEPLOYING", "STANDBY", "RESEARCHING", "TESTING"];

function ChibiAgent({ agent, index, selected }: { agent: Agent; index: number; selected: boolean }) {
  return (
    <span className={`chibi-agent chibi-${agent.id} ${selected ? "is-selected" : ""}`} aria-hidden="true">
      <i className="chibi-shadow" />
      <i className="chibi-cape" />
      <i className="chibi-head"><b /></i>
      <i className="chibi-hair" />
      <i className="chibi-body" />
      <i className="chibi-arm left" />
      <i className="chibi-arm right" />
      <i className="chibi-leg left" />
      <i className="chibi-leg right" />
      <i className={`hero-gear gear-${index + 1}`} />
    </span>
  );
}

export default function VirtualOffice({ agents, selectedId, onSelect }: Props) {
  const selected = agents.find((agent) => agent.id === selectedId) ?? agents[0];

  return (
    <div className="virtual-office">
      <header className="office-header">
        <div>
          <span>POWER REALM / PURPLE OFFICE</span>
          <h2>AI AGENT VIRTUAL OFFICE</h2>
          <p>Avengers Tower ben trai, bam tung tang de mo room. Common Room giu ca team dung dung vi tri.</p>
        </div>
        <div className="office-live"><i/><span>COMMON ROOM</span><b>06 ONLINE</b></div>
      </header>

      <div className="office-layout">
        <aside className="office-tower-nav" aria-label="Avengers Tower rooms">
          <div className="mini-tower-cap"><span>A</span></div>
          <div className="mini-tower-body">
            {agents.map((agent) => (
              <button
                key={agent.id}
                className={`tower-room-button ${agent.id === selectedId ? "is-selected" : ""}`}
                style={{ "--room": agent.color, "--room-rgb": agent.rgb } as React.CSSProperties}
                onClick={() => onSelect(agent.id)}
              >
                <span>{agent.floor.split(" ")[0]}</span>
                <b>{agent.room}</b>
              </button>
            ))}
          </div>
          <div className="mini-tower-base">COMMON ROOM</div>
        </aside>

        <section className="office-room office-common-room" aria-label="Avengers AI common office">
          <div className="office-wall-grid" aria-hidden="true" />
          <div className="office-window" aria-hidden="true"><i/><i/><i/><i/></div>
          <div className="office-board" aria-hidden="true"><span>MISSION MAP</span><i/><i/><i/></div>
          <div className="common-table" aria-hidden="true"><span /><i /></div>
          <div className="server-bay" aria-hidden="true"><i/><i/><i/></div>
          <div className="target-wall" aria-hidden="true"><i/><b/></div>

          {agents.map((agent, index) => (
            <button
              key={agent.id}
              className={`hero-station hero-station-${index + 1} ${agent.id === selectedId ? "is-selected" : ""}`}
              style={{ "--pixel": agent.color, "--pixel-rgb": agent.rgb } as React.CSSProperties}
              onClick={() => onSelect(agent.id)}
              aria-label={`${agent.codename}: ${agent.station}`}
            >
              <span className="agent-bubble">
                <b>{agent.codename}</b>
                <small>{activity[index]}</small>
              </span>
              <ChibiAgent agent={agent} index={index} selected={agent.id === selectedId} />
              <span className="desk-label"><b>{agent.room}</b><small>{agent.equipment}</small></span>
              {index === 0 || index === 4 ? <span className="sub-agent"><i/><b>SUB</b></span> : null}
              <span className="task-pulse"><i/><b>{agent.load}%</b></span>
            </button>
          ))}

          <div className="office-floor-lines" aria-hidden="true" />
        </section>

        <aside className="room-inspector">
          <span>SELECTED ROOM</span>
          <h3>{selected.room}</h3>
          <p>{selected.station}</p>
          <div><b>{selected.codename}</b><small>{selected.equipment}</small></div>
        </aside>
      </div>

      <footer className="office-console">
        <div><span>ACTIVE SESSION</span><b>avengers-tower/common-room</b></div>
        <div><span>REFERENCE</span><b>LEGO / CHIBI / PRINT STYLE</b></div>
        <div><span>ATTENTION</span><b className="needs-review">ROOM LAYOUT FIXED</b></div>
        <a href="https://www.youtube.com/watch?v=62Rfe1w9NBc" target="_blank" rel="noreferrer">VIDEO REFERENCE <b>GO</b></a>
      </footer>
    </div>
  );
}
