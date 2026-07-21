import Panel from "./Panel.jsx";
import { defaultData } from "../utils/storage.js";
import { soundManager } from "../utils/soundManager.js";

export default function SettingsTab({ data, updateData, hardReset, addLog }) {
  const updateToolUrl = (name, value) => {
    updateData({ toolUrls: { ...data.toolUrls, [name]: value } });
  };

  const updateEndpoint = (key, value) => {
    updateData({ endpoints: { ...data.endpoints, [key]: value } });
  };

  const updateAuth = (key, value) => {
    updateData({ auth: { ...data.auth, [key]: value } });
  };

  const handleToggleSound = (e) => {
    const val = e.target.checked;
    updateData({ soundEnabled: val });
    soundManager.setEnabled(val);
    if (val) soundManager.play("success");
    addLog(`Sound FX ${val ? "enabled" : "disabled"}.`);
  };

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {/* Cột 1: Operator Settings & Security */}
      <div className="space-y-4">
        <Panel title="Operator Settings" kicker="Console identity">
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="field-label">
                Username
                <input className="hud-input font-mono text-sm" value={data.username} onChange={(event) => updateData({ username: event.target.value })} />
              </label>
              <label className="field-label">
                AI persona name
                <input className="hud-input font-mono text-sm" value={data.aiPersonaName} onChange={(event) => updateData({ aiPersonaName: event.target.value })} />
              </label>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="field-label">
                Theme intensity
                <select
                  className="hud-input font-mono text-sm"
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
              <div className="flex items-center pt-6">
                <label className="flex items-center gap-3 cursor-pointer select-none font-mono text-xs uppercase text-cyan-100/85">
                  <input
                    type="checkbox"
                    checked={data.soundEnabled !== false}
                    onChange={handleToggleSound}
                    className="h-4 w-4 rounded border-cyan-300/20 bg-slate-950 text-cyanCore focus:ring-0"
                  />
                  Enable Sound FX (Bật Âm Thanh)
                </label>
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Security Settings" kicker="Console Lock Protocol">
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-center pt-6">
                <label className="flex items-center gap-3 cursor-pointer select-none font-mono text-xs uppercase text-cyan-100/85">
                  <input
                    type="checkbox"
                    checked={!!data.auth?.pinEnabled}
                    onChange={(e) => {
                      updateAuth("pinEnabled", e.target.checked);
                      soundManager.play("click");
                      addLog(`PIN lock authentication ${e.target.checked ? "enabled" : "disabled"}.`);
                    }}
                    className="h-4 w-4 rounded border-cyan-300/20 bg-slate-950 text-cyanCore focus:ring-0"
                  />
                  Bật khoá mã PIN khi mở
                </label>
              </div>
              <label className="field-label">
                Mã PIN bảo mật (4 số)
                <input
                  maxLength={4}
                  className="hud-input font-mono text-sm"
                  value={data.auth?.pinCode || "1234"}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    updateAuth("pinCode", val);
                  }}
                />
              </label>
            </div>
          </div>
        </Panel>

        <Panel title="Danger Zone" kicker="Data reset">
          <div className="rounded border border-dangerCore/25 bg-dangerCore/10 p-4 font-mono">
            <p className="text-xs uppercase text-dangerCore font-bold">Reset local data</p>
            <p className="mt-2 text-xs text-cyan-100/70 leading-relaxed">Restores the original operator profile, memory, sectors, tools, and logs on this browser.</p>
            <button className="hud-button danger mt-4 w-full text-xs uppercase" type="button" onClick={hardReset}>Reset All Local Data</button>
          </div>
        </Panel>
      </div>

      {/* Cột 2: Endpoints & Tool Matrix */}
      <div className="space-y-4">
        <Panel title="External Adapter Endpoints" kicker="Service routing URLs">
          <div className="space-y-3 font-mono">
            <label className="field-label">
              Hermes Orchestrator Core URL
              <input className="hud-input text-xs" value={data.endpoints?.hermes || ""} onChange={(e) => updateEndpoint("hermes", e.target.value)} />
            </label>
            <label className="field-label">
              OpenClaw AI Gateway URL
              <input className="hud-input text-xs" value={data.endpoints?.openclaw || ""} onChange={(e) => updateEndpoint("openclaw", e.target.value)} />
            </label>
            <label className="field-label">
              9Router Gateway Core URL
              <input className="hud-input text-xs" value={data.endpoints?.nineRouter || ""} onChange={(e) => updateEndpoint("nineRouter", e.target.value)} />
            </label>
          </div>
        </Panel>

        <Panel title="Custom Tool URLs" kicker="Launch matrix">
          <div className="grid gap-3 md:grid-cols-2 font-mono text-xs">
            {Object.entries(defaultData.toolUrls).map(([name]) => (
              <label className="field-label" key={name}>
                {name}
                <input className="hud-input text-xs" value={data.toolUrls[name] || ""} onChange={(event) => updateToolUrl(name, event.target.value)} />
              </label>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

