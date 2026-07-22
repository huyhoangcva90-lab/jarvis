import Panel from "./Panel.jsx";

export default function MissionTab({ data, updateData, addLog }) {
  const updateSideQuest = (index, value) => {
    const next = [...data.sideQuests];
    next[index] = value;
    updateData({ sideQuests: next });
  };

  const setStatus = (missionStatus) => {
    updateData({ missionStatus });
    addLog(`Mission status changed: ${missionStatus}.`);
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
      <Panel title="Mission Parameters" kicker="Daily operation">
        <div className="space-y-4">
          <label className="field-label">
            Main Quest
            <input className="hud-input" value={data.mainQuest} onChange={(event) => updateData({ mainQuest: event.target.value })} />
          </label>
          <div className="grid gap-3 md:grid-cols-3">
            {data.sideQuests.map((quest, index) => (
              <label className="field-label" key={index}>
                Side Quest {index + 1}
                <input className="hud-input" value={quest} onChange={(event) => updateSideQuest(index, event.target.value)} />
              </label>
            ))}
          </div>
          <label className="field-label">
            Active Project
            <input className="hud-input" value={data.activeProject} onChange={(event) => updateData({ activeProject: event.target.value })} />
          </label>
        </div>
      </Panel>

      <Panel title="Mission Control" kicker="Execution">
        <div className="rounded border border-cyan-300/20 bg-slate-950/60 p-4 text-center">
          <p className="font-mono text-xs uppercase text-cyan-100/60">Focus timer</p>
          <p className="mt-2 font-mono text-5xl text-cyan-50">25:00</p>
          <p className="mt-2 text-sm text-cyan-100/60">Timer module reserved for next upgrade.</p>
        </div>
        <div className="mt-4 rounded border border-greenCore/20 bg-greenCore/10 p-4">
          <p className="font-mono text-xs uppercase text-greenCore/75">Mission status</p>
          <p className="mt-2 font-mono text-2xl uppercase text-cyan-50">{data.missionStatus}</p>
        </div>
        <div className="mt-4 grid gap-2">
          <button className="hud-button primary" type="button" onClick={() => setStatus("In progress")}>Start Mission</button>
          <button className="hud-button" type="button" onClick={() => setStatus("Completed")}>Complete Mission</button>
          <button className="hud-button danger" type="button" onClick={() => setStatus("Not started")}>Reset Mission</button>
        </div>
      </Panel>
    </div>
  );
}

