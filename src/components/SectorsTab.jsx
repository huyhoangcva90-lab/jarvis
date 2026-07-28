import { useState } from "react";
import Panel from "./Panel.jsx";

const statuses = ["Stable", "Warning", "Critical"];

export default function SectorsTab({ data, updateData, addLog }) {
  const [editing, setEditing] = useState(null);

  const updateSector = (index, patch) => {
    const sectors = data.sectors.map((sector, sectorIndex) => (
      sectorIndex === index ? { ...sector, ...patch } : sector
    ));
    updateData({ sectors });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {data.sectors.map((sector, index) => (
        <Panel
          key={sector.name}
          title={sector.name}
          kicker="Life sector"
          action={
            <button
              className="hud-mini-button"
              type="button"
              onClick={() => {
                setEditing(editing === index ? null : index);
                addLog(`${sector.name} edit channel ${editing === index ? "closed" : "opened"}.`);
              }}
            >
              Edit
            </button>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <StatusPill status={sector.status} />
              <span className="font-mono text-2xl text-cyan-50">{sector.progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-cyanCore to-greenCore" style={{ width: `${sector.progress}%` }} />
            </div>
            <p className="min-h-12 text-sm leading-6 text-cyan-100/70">{sector.notes}</p>
            {editing === index && (
              <div className="space-y-3 border-t border-cyan-300/10 pt-4">
                <label className="field-label">
                  Status
                  <select className="hud-input" value={sector.status} onChange={(event) => updateSector(index, { status: event.target.value })}>
                    {statuses.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </label>
                <label className="field-label">
                  Progress
                  <input
                    className="accent-cyanCore"
                    type="range"
                    min="0"
                    max="100"
                    value={sector.progress}
                    onChange={(event) => updateSector(index, { progress: Number(event.target.value) })}
                  />
                </label>
                <label className="field-label">
                  Notes
                  <textarea className="hud-input min-h-24" value={sector.notes} onChange={(event) => updateSector(index, { notes: event.target.value })} />
                </label>
              </div>
            )}
          </div>
        </Panel>
      ))}
    </div>
  );
}

function StatusPill({ status }) {
  const tone = status === "Critical" ? "border-dangerCore/50 text-dangerCore bg-dangerCore/10" : status === "Warning" ? "border-amberCore/50 text-amberCore bg-amberCore/10" : "border-greenCore/50 text-greenCore bg-greenCore/10";
  return <span className={`rounded border px-3 py-1 font-mono text-xs uppercase ${tone}`}>{status}</span>;
}
