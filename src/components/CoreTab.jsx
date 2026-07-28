import Panel from "./Panel.jsx";

export default function CoreTab({ data, currentTime, updateData }) {
  const recentLogs = data.logs.slice(-6).reverse();
  const threat = data.energy === "low" || data.mood === "tired" ? "Warning" : "Nominal";

  return (
    <div className="grid gap-4 xl:grid-cols-[1.3fr_0.9fr]">
      <Panel className="min-h-[520px] xl:row-span-2">
        <div className="grid h-full gap-6 lg:grid-cols-[1fr_340px]">
          <div className="flex flex-col justify-between gap-6">
            <div>
              <p className="font-mono text-sm uppercase text-greenCore">Core deck</p>
              <h2 className="mt-2 font-mono text-4xl uppercase text-cyan-50 sm:text-6xl">J-Core Console</h2>
              <p className="mt-4 max-w-2xl text-cyan-100/70">
                Operator dashboard for daily missions, prompt generation, personal context, and rapid access to AI workflows.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Metric label="AI Core" value="ONLINE" tone="green" />
              <Metric label="Current Time" value={currentTime} />
              <Metric label="Threat Level" value={threat} tone={threat === "Warning" ? "amber" : "green"} />
            </div>
          </div>
          <div className="grid place-items-center">
            <div className="core-radar relative aspect-square w-full max-w-[330px] rounded-full border border-cyan-300/30">
              <div className="absolute inset-6 rounded-full border border-greenCore/25" />
              <div className="absolute inset-14 rounded-full border border-cyan-300/20" />
              <div className="absolute inset-24 rounded-full border border-cyan-300/20" />
              <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-greenCore shadow-[0_0_28px_rgba(74,222,128,0.9)]" />
              <div className="absolute left-1/2 top-1/2 h-[46%] w-px origin-bottom animate-sweep bg-gradient-to-t from-greenCore to-transparent" />
              <div className="absolute inset-0 animate-pulseCore rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.18),transparent_58%)]" />
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="Today Summary" kicker="Operator state">
        <div className="space-y-3 font-mono text-sm">
          <Row label="Main quest" value={data.mainQuest} />
          <Row label="Active project" value={data.activeProject} />
          <Row label="Mission status" value={data.missionStatus} />
        </div>
      </Panel>

      <Panel title="Mood / Energy" kicker="Bio-signal estimate">
        <div className="grid grid-cols-2 gap-3">
          <StatusBlock label="Mood" value={data.mood} />
          <StatusBlock label="Energy" value={data.energy} />
        </div>
      </Panel>

      <Panel title="Recent System Logs" kicker="Event stream" className="xl:col-span-2">
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {recentLogs.map((log, index) => (
            <div key={`${log}-${index}`} className="rounded border border-cyan-300/10 bg-cyan-300/5 p-3 font-mono text-sm text-cyan-100/75">
              <span className="text-greenCore">&gt;</span> {log}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Metric({ label, value, tone = "cyan" }) {
  const toneClass = tone === "green" ? "text-greenCore" : tone === "amber" ? "text-amberCore" : "text-cyanCore";
  return (
    <div className="rounded border border-cyan-300/20 bg-slate-950/60 p-4">
      <p className="font-mono text-xs uppercase text-cyan-100/60">{label}</p>
      <p className={`mt-2 font-mono text-xl uppercase ${toneClass}`}>{value}</p>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="rounded border border-cyan-300/10 bg-slate-950/40 p-3">
      <p className="text-xs uppercase text-cyan-100/50">{label}</p>
      <p className="mt-1 text-cyan-50">{value || "Not assigned"}</p>
    </div>
  );
}

function StatusBlock({ label, value }) {
  return (
    <div className="rounded border border-greenCore/20 bg-greenCore/10 p-4">
      <p className="font-mono text-xs uppercase text-greenCore/75">{label}</p>
      <p className="mt-2 font-mono text-2xl uppercase text-cyan-50">{value}</p>
    </div>
  );
}

