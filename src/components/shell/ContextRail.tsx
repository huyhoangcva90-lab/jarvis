import { useTesseract } from '../../tesseract/useTesseract';
import { agents, emotions, statusCopy } from '../../tesseract/constants';

export default function ContextRail() {
  const { emotion } = useTesseract();
  return (
    <aside className="context-rail">
      <section>
        <span className="panel-kicker">Agent pulse</span>
        <div className="agent-stack">
          {agents.map((agent) => (
            <article key={agent.id} style={{ "--agent": agent.color } as React.CSSProperties}>
              <div>
                <b>{agent.character}</b>
                <span>{agent.role}</span>
              </div>
              <em>{statusCopy[agent.status]}</em>
              <i style={{ width: `${agent.load}%` }} />
            </article>
          ))}
        </div>
      </section>

      <section>
        <span className="panel-kicker">Approvals</span>
        <div className="approval-card">
          <b>2 waiting</b>
          <p>Deploy, file write, terminal, public tunnel sẽ cần human gate.</p>
        </div>
      </section>

      <section>
        <span className="panel-kicker">Hermes / 9Router</span>
        <div className="health-list">
          <p>
            <i className="ok" /> Hermes API: planned
          </p>
          <p>
            <i className="ok" /> 9Router: local provider
          </p>
          <p>
            <i className={emotion === "alert" ? "bad" : "ok"} /> UI state: {emotions[emotion].label}
          </p>
        </div>
      </section>
    </aside>
  );
}
