import { useState } from "react";
import Panel from "./Panel.jsx";
import { defaultData } from "../utils/storage.js";
import { soundManager } from "../utils/soundManager.js";
import { gatewayFetch } from "../utils/gatewayClient.js";
import { NINEROUTER_MODELS, getNineRouterModel } from "../utils/nineRouterModels.js";

export default function SettingsTab({ data, updateData, hardReset, addLog }) {
  const [gatewayTest, setGatewayTest] = useState({ status: "idle", health: null, message: "" });

  const updateToolUrl = (name, value) => {
    updateData({ toolUrls: { ...data.toolUrls, [name]: value } });
  };

  const updateEndpoint = (key, value) => {
    updateData({ endpoints: { ...data.endpoints, [key]: value } });
  };

  const updateAuth = (key, value) => {
    updateData({ auth: { ...data.auth, [key]: value } });
  };

  const handleToggleSound = (event) => {
    const enabled = event.target.checked;
    updateData({ soundEnabled: enabled });
    soundManager.setEnabled(enabled);
    if (enabled) soundManager.play("success");
    addLog(`Sound FX ${enabled ? "enabled" : "disabled"}.`);
  };

  const testGateway = async () => {
    setGatewayTest({ status: "testing", health: null, message: "Dang kiem tra gateway..." });
    try {
      const health = await gatewayFetch(data, "/health", { method: "GET", timeoutMs: 7000 });
      setGatewayTest({ status: "success", health, message: "Gateway da ket noi." });
      addLog("Gateway connection test passed.");
      soundManager.play("success");
    } catch (error) {
      setGatewayTest({ status: "error", health: null, message: error?.message || "Khong the ket noi gateway." });
      addLog(`Gateway connection test failed: ${error?.message || "unknown error"}`);
      soundManager.play("warning");
    }
  };

  return (
    <div className="grid gap-4 xl:grid-cols-2">
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
                <label className="flex cursor-pointer select-none items-center gap-3 font-mono text-xs uppercase text-cyan-100/85">
                  <input
                    type="checkbox"
                    checked={data.soundEnabled !== false}
                    onChange={handleToggleSound}
                    className="h-4 w-4 rounded border-cyan-300/20 bg-slate-950 text-cyanCore focus:ring-0"
                  />
                  Enable Sound FX
                </label>
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Security Settings" kicker="Dashboard login">
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-center pt-6">
                <label className="flex cursor-pointer select-none items-center gap-3 font-mono text-xs uppercase text-cyan-100/85">
                  <input
                    type="checkbox"
                    checked={data.auth?.loginEnabled !== false}
                    onChange={(event) => {
                      updateAuth("loginEnabled", event.target.checked);
                      soundManager.play("click");
                      addLog(`Dashboard login ${event.target.checked ? "enabled" : "disabled"}.`);
                    }}
                    className="h-4 w-4 rounded border-cyan-300/20 bg-slate-950 text-cyanCore focus:ring-0"
                  />
                  Bat dang nhap khi mo dashboard
                </label>
              </div>
              <label className="field-label">
                Tai khoan dang nhap
                <input
                  className="hud-input font-mono text-sm"
                  value={data.auth?.username || "admin"}
                  onChange={(event) => updateAuth("username", event.target.value.trim() || "admin")}
                />
              </label>
            </div>
            <label className="field-label">
              Mat khau tam thoi
              <input
                className="hud-input font-mono text-sm"
                type="password"
                value={data.auth?.password || "123456"}
                onChange={(event) => updateAuth("password", event.target.value)}
              />
            </label>
          </div>
        </Panel>

        <Panel title="Danger Zone" kicker="Data reset">
          <div className="rounded border border-dangerCore/25 bg-dangerCore/10 p-4 font-mono">
            <p className="text-xs font-bold uppercase text-dangerCore">Reset local data</p>
            <p className="mt-2 text-xs leading-relaxed text-cyan-100/70">Restores the original operator profile, memory, sectors, tools, and logs on this browser.</p>
            <button className="hud-button danger mt-4 w-full text-xs uppercase" type="button" onClick={hardReset}>Reset All Local Data</button>
          </div>
        </Panel>
      </div>

      <div className="space-y-4">
        <Panel title="External Adapter Endpoints" kicker="Service routing URLs">
          <div className="space-y-3 font-mono">
            <label className="field-label">
              J-Core Gateway URL
              <input className="hud-input text-xs" value={data.endpoints?.gateway || ""} onChange={(event) => updateEndpoint("gateway", event.target.value)} />
            </label>
            <label className="field-label">
              Gateway device token
              <input className="hud-input text-xs" type="password" value={data.endpoints?.gatewayToken || ""} onChange={(event) => updateEndpoint("gatewayToken", event.target.value)} />
            </label>
            <label className="field-label">
              9Router model
              <select
                className="hud-input text-xs"
                value={getNineRouterModel(data)}
                onChange={(event) => {
                  updateEndpoint("nineRouterModel", event.target.value);
                  addLog(`9Router model set to ${event.target.value}.`);
                }}
              >
                {NINEROUTER_MODELS.map((model) => (
                  <option key={model.id} value={model.id}>{model.label}</option>
                ))}
              </select>
            </label>
            <p className="text-[11px] leading-relaxed text-cyan-100/50">
              Hermes, OpenClaw, 9Router va Claude duoc dinh tuyen tai Ubuntu. Trinh duyet chi ket noi toi gateway nay.
            </p>
            <button
              type="button"
              className="hud-button primary w-full text-xs uppercase"
              disabled={gatewayTest.status === "testing"}
              onClick={testGateway}
            >
              {gatewayTest.status === "testing" ? "Dang kiem tra..." : "Kiem tra gateway"}
            </button>
            {gatewayTest.status !== "idle" && (
              <div className={`rounded border p-3 text-xs ${
                gatewayTest.status === "success"
                  ? "border-greenCore/30 bg-greenCore/10 text-greenCore"
                  : gatewayTest.status === "error"
                    ? "border-redCore/30 bg-redCore/10 text-redCore"
                    : "border-cyanCore/20 bg-cyanCore/5 text-cyanCore"
              }`}>
                <p>{gatewayTest.message}</p>
                {gatewayTest.health?.services && (
                  <div className="mt-2 grid grid-cols-3 gap-2 text-[10px] uppercase">
                    {Object.entries(gatewayTest.health.services).map(([name, service]) => (
                      <span key={name}>
                        {name}: {service.online ? "online" : "offline"}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </Panel>

        <Panel title="Custom Tool URLs" kicker="Launch matrix">
          <div className="grid gap-3 font-mono text-xs md:grid-cols-2">
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
