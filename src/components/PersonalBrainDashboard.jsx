import Panel from "./Panel.jsx";

const AGENT_SIGNALS = [
  { name: "Forge", job: "Code repair", state: "working", load: 74 },
  { name: "Router", job: "Model choice", state: "reading", load: 48 },
  { name: "Hermes", job: "Notion sync", state: "standby", load: 22 },
  { name: "Ledger", job: "Finance scan", state: "warning", load: 61 },
  { name: "Memory", job: "Context index", state: "working", load: 69 },
];

export default function PersonalBrainDashboard({ data }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <Panel title="Personal Brain Observer" kicker="Orange agent awareness">
        <div className="brain-map">
          <div className="brain-core">
            <span>{data.aiPersonaName || "J-Core"}</span>
            <b>{data.mood || "calm"} / {data.energy || "medium"}</b>
          </div>
          {AGENT_SIGNALS.map((agent, index) => (
            <div
              className={`brain-agent ${agent.state}`}
              key={agent.name}
              style={{ "--i": index, "--angle": `${index * 72}deg`, "--angle-neg": `${index * -72}deg` }}
            >
              <span>{agent.name}</span>
              <small>{agent.job}</small>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Agent Activity Feed" kicker="Local observer">
        <div className="space-y-3 font-mono text-xs">
          {AGENT_SIGNALS.map((agent) => (
            <div className="rounded border border-orange-300/20 bg-orange-400/5 p-3" key={agent.name}>
              <div className="mb-2 flex items-center justify-between">
                <span className="uppercase text-orange-100">{agent.name}</span>
                <span className={`uppercase ${agent.state === "warning" ? "text-redCore" : "text-amberCore"}`}>{agent.state}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded bg-slate-950">
                <div className="h-full bg-orange-400" style={{ width: `${agent.load}%` }} />
              </div>
              <p className="mt-2 text-cyan-100/55">{agent.job}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
