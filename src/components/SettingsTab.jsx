import Panel from "./Panel.jsx";
import { defaultData } from "../utils/storage.js";

export default function SettingsTab({ data, updateData, hardReset, addLog }) {
  const updateToolUrl = (name, value) => {
    updateData({ toolUrls: { ...data.toolUrls, [name]: value } });
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
      <Panel title="Operator Settings" kicker="Console identity">
        <div className="space-y-4">
          <label className="field-label">
            Username
            <input className="hud-input" value={data.username} onChange={(event) => updateData({ username: event.target.value })} />
          </label>
          <label className="field-label">
            AI persona name
            <input className="hud-input" value={data.aiPersonaName} onChange={(event) => updateData({ aiPersonaName: event.target.value })} />
          </label>
          <label className="field-label">
            Theme intensity
            <select
              className="hud-input"
              value={data.themeIntensity}
              onChange={(event) => {
                updateData({ themeIntensity: event.target.value });
                addLog(`Theme intensity set to ${event.target.value}.`);
              }}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>
          <div className="rounded border border-dangerCore/25 bg-dangerCore/10 p-4">
            <p className="font-mono text-sm uppercase text-dangerCore">Reset local data</p>
            <p className="mt-2 text-sm text-cyan-100/70">Restores the original operator profile, memory, sectors, tools, and logs on this browser.</p>
            <button className="hud-button danger mt-4 w-full" type="button" onClick={hardReset}>Reset All Local Data</button>
          </div>
        </div>
      </Panel>

      <Panel title="Custom Tool URLs" kicker="Launch matrix">
        <div className="grid gap-3 md:grid-cols-2">
          {Object.entries(defaultData.toolUrls).map(([name]) => (
            <label className="field-label" key={name}>
              {name}
              <input className="hud-input" value={data.toolUrls[name] || ""} onChange={(event) => updateToolUrl(name, event.target.value)} />
            </label>
          ))}
        </div>
      </Panel>
    </div>
  );
}

