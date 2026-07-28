import { useEffect, useMemo, useState } from "react";
import CinematicOrb from "./components/orb/CinematicOrb";
import HudOverlay from "./components/orb/HudOverlay";
import BootScreen from "./components/BootScreen.jsx";
import HermesChat from "./components/HermesChat.jsx";
import MissionControlDeck from "./components/MissionControlDeck.jsx";
import AuthScreen from "./components/AuthScreen.jsx";
import TopBar from "./components/TopBar.jsx";
import Panel from "./components/Panel.jsx";
import { StoneStateProvider } from "./utils/stoneState.jsx";
import { defaultData, loadData, resetData, saveData } from "./utils/storage.js";
import { soundManager } from "./utils/soundManager.js";

// Import Realm dashboards
import NineRouterDashboard from "./components/nineRouterDashboard.jsx";
import OpenclawDashboard from "./components/openclawDashboard.jsx";
import CoreTab from "./components/CoreTab.jsx";
import MemoryTab from "./components/MemoryTab.jsx";
import TerminalTab from "./components/TerminalTab.jsx";

export type AiActivity = "idle" | "listening" | "thinking" | "speaking";
export type EnergyPalette = "gold" | "blue" | "green" | "red" | "violet" | "orange";

export default function App() {
  const [booting, setBooting] = useState(true);
  const [data, setData] = useState(() => loadData());
  const [now, setNow] = useState(() => new Date());
  const [toast, setToast] = useState("");

  const [activeDeck, setActiveDeck] = useState(data.activeDeck || "command");
  const [chatOpen, setChatOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(!data.auth?.pinEnabled);
  const [activity, setActivity] = useState<AiActivity>("idle");
  const [energyPalette, setEnergyPalette] = useState<EnergyPalette>("gold");
  const [resetViewSignal, setResetViewSignal] = useState(0);
  const [hudVisible, setHudVisible] = useState(true);

  useEffect(() => {
    const bootTimer = window.setTimeout(() => setBooting(false), 2000);
    const clockTimer = window.setInterval(() => setNow(new Date()), 1000);
    return () => {
      window.clearTimeout(bootTimer);
      window.clearInterval(clockTimer);
    };
  }, []);

  useEffect(() => {
    soundManager.setEnabled(data.soundEnabled !== false);
  }, [data.soundEnabled]);

  useEffect(() => {
    saveData(data);
  }, [data]);

  useEffect(() => {
    document.body.dataset.activity = activity;
  }, [activity]);

  useEffect(() => {
    const blockClipboard = (event: ClipboardEvent) => event.preventDefault();
    const blockContextMenu = (event: MouseEvent) => event.preventDefault();
    document.addEventListener("copy", blockClipboard);
    document.addEventListener("cut", blockClipboard);
    document.addEventListener("contextmenu", blockContextMenu);
    return () => {
      document.removeEventListener("copy", blockClipboard);
      document.removeEventListener("cut", blockClipboard);
      document.removeEventListener("contextmenu", blockContextMenu);
    };
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "h") setHudVisible((visible) => !visible);
      if (event.key === "Escape") {
        setEnergyPalette("gold");
        setChatOpen(false);
      }
      if (event.key === "1") setActivity("idle");
      if (event.key === "2") setActivity("listening");
      if (event.key === "3") setActivity("thinking");
      if (event.key === "4") setActivity("speaking");
      if (event.key.toLowerCase() === "r") setResetViewSignal((signal) => signal + 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const currentTime = useMemo(() => {
    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      weekday: "short",
    }).format(now);
  }, [now]);

  const intensityClass = {
    Low: "theme-low",
    Medium: "theme-medium",
    High: "theme-high",
  }[data.themeIntensity] || "theme-medium";

  const addLog = (message: string) => {
    const stamp = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(new Date());
    setData((current) => ({
      ...current,
      logs: [...(current.logs || []), `[${stamp}] ${message}`].slice(-16),
    }));
  };

  const updateData = (patch: any) => {
    setData((current) => ({ ...current, ...patch }));
  };

  const copyText = async (_text: string, _message: string) => {
    setToast("Copy đã bị khóa trên hệ thống này.");
    addLog("Clipboard export blocked by system policy.");
    soundManager.play("warning");
  };

  const hardReset = () => {
    const confirmed = window.confirm("Reset all J-Core local data on this browser?");
    if (!confirmed) return;
    resetData();
    setData(defaultData);
    setToast("Local data reset.");
    soundManager.play("warning");
  };

  const switchDeck = (deck: string) => {
    soundManager.play("beep");
    setActiveDeck(deck);
    updateData({ activeDeck: deck });
  };

  const handleStoneClick = (stoneId: string) => {
    soundManager.play("beep");
    const stoneToPaletteMap: Record<string, EnergyPalette> = {
      mind: "gold",
      space: "blue",
      time: "green",
      reality: "red",
      power: "violet",
      soul: "orange",
    };
    const palette = stoneToPaletteMap[stoneId];
    if (palette) {
      setEnergyPalette(palette);
    }
  };

  if (!authenticated) {
    return <AuthScreen data={data} onUnlock={() => setAuthenticated(true)} />;
  }

  return (
    <StoneStateProvider>
      <main className={`jarvis-shell min-h-dvh overflow-hidden bg-void text-cyan-50 ${intensityClass}`}>
        {/* WebGL 3D Canvas Background */}
        <div className="orb-stage fixed inset-0 z-0">
          <CinematicOrb
            activity={activity}
            palette={energyPalette}
            resetSignal={resetViewSignal}
          />
        </div>

        {booting && <BootScreen />}

        {/* Scan lines & theme grid overlays */}
        <div className="fixed inset-0 pointer-events-none z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.13),transparent_28%),radial-gradient(circle_at_86%_20%,rgba(74,222,128,0.11),transparent_26%),linear-gradient(rgba(34,211,238,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.035)_1px,transparent_1px)] bg-[size:auto,auto,48px_48px,48px_48px]" />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-cyan-300/10 to-transparent" />
          <div className="absolute h-28 w-full animate-scan bg-gradient-to-b from-transparent via-cyan-300/10 to-transparent" />
        </div>

        {/* Main UI Overlay */}
        <div className={`legacy-console-overlay relative z-20 flex h-dvh flex-col transition-opacity duration-300 ${hudVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <TopBar data={data} currentTime={currentTime} />

          {/* Deck tab switcher */}
          <div className="flex gap-2 border-b border-cyan-300/20 bg-slate-900/50 p-2">
            <button
              className={`deck-tab px-4 py-2 font-mono text-sm uppercase ${activeDeck === "command" ? "bg-cyan-300/20 text-cyan-100" : "text-cyan-100/60 hover:bg-cyan-300/10"}`}
              onClick={() => switchDeck("command")}
            >
              COMMAND CHAMBER
            </button>
            <button
              className={`deck-tab px-4 py-2 font-mono text-sm uppercase ${activeDeck === "mission-control" ? "bg-cyan-300/20 text-cyan-100" : "text-cyan-100/60 hover:bg-cyan-300/10"}`}
              onClick={() => switchDeck("mission-control")}
            >
              MISSION CONTROL
            </button>
          </div>

          <main className="min-w-0 flex-1 overflow-auto p-4 lg:p-6">
            {activeDeck === "command" ? (
                /* Active Realm View */
                <div className="active-realm-container flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4 bg-slate-950/80 p-3 rounded border border-cyan-300/20 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          soundManager.play("beep");
                          setEnergyPalette("gold");
                        }}
                        className="hud-button primary px-4 py-2 font-mono text-xs uppercase"
                      >
                        ← Quay về Chamber
                      </button>
                      <h2 className="font-mono text-lg text-cyan-100 uppercase tracking-wider">
                        Realm:{" "}
                        <span className="text-amberCore">
                          {energyPalette === "gold" && "Mind Realm"}
                          {energyPalette === "blue" && "Space Realm"}
                          {energyPalette === "green" && "Time Realm"}
                          {energyPalette === "red" && "Reality Realm"}
                          {energyPalette === "violet" && "Power Realm"}
                          {energyPalette === "orange" && "Soul Realm"}
                        </span>
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-greenCore animate-pulse" />
                      <span className="font-mono text-xs text-cyan-100/60">INTEGRATED DIAGNOSTICS</span>
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-auto">
                    {/* Left & Middle Column (Main Realm Dashboard) */}
                    <div className="lg:col-span-2 overflow-auto bg-slate-950/40 p-4 rounded border border-cyan-300/10 backdrop-blur-sm">
                      {energyPalette === "gold" && (
                        <div className="space-y-4">
                          <p className="font-mono text-sm text-cyan-100/60">🧠 MIND REALUM - KNOWLEDGE CORE & DEV INTERFACE</p>
                          <MemoryTab data={data} updateData={updateData} copyText={copyText} />
                        </div>
                      )}
                      {energyPalette === "blue" && (
                        <div className="space-y-4">
                          <p className="font-mono text-sm text-cyan-100/60">🌌 SPACE REALM - 9ROUTER MULTI-MODEL GATEWAY</p>
                          <NineRouterDashboard data={data} updateData={updateData} addLog={addLog} />
                        </div>
                      )}
                      {energyPalette === "green" && (
                        <div className="space-y-4">
                          <p className="font-mono text-sm text-cyan-100/60">⏳ TIME REALM - PERSONAL SCHEDULE & OS ENGINE</p>
                          <TerminalTab data={data} addLog={addLog} updateData={updateData} />
                        </div>
                      )}
                      {energyPalette === "red" && (
                        <div className="space-y-4">
                          <p className="font-mono text-sm text-cyan-100/60">💎 REALITY REALM - FINANCIAL Citadel & LEDGER</p>
                          <Panel title="Finance Status" kicker="Obsidian Vault Ledger">
                            <div className="p-4 bg-slate-950/60 rounded border border-cyan-300/15 font-mono text-sm text-cyan-100/80">
                              <p className="text-greenCore mb-2">ACCOUNT OK - BALANCE POSITIVE</p>
                              <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="border border-cyan-300/10 bg-slate-950/40 p-3 rounded">
                                  <p className="text-xs text-cyan-100/40">Total Assets</p>
                                  <p className="text-xl text-cyanCore font-bold">$124,500.00</p>
                                </div>
                                <div className="border border-cyan-300/10 bg-slate-950/40 p-3 rounded">
                                  <p className="text-xs text-cyan-100/40">Monthly Savings Rate</p>
                                  <p className="text-xl text-greenCore font-bold">42%</p>
                                </div>
                              </div>
                            </div>
                          </Panel>
                        </div>
                      )}
                      {energyPalette === "violet" && (
                        <div className="space-y-4">
                          <p className="font-mono text-sm text-cyan-100/60">⚡ POWER REALM - OPENCLAW TACTICAL WORKFORCE</p>
                          <OpenclawDashboard data={data} updateData={updateData} addLog={addLog} />
                        </div>
                      )}
                      {energyPalette === "orange" && (
                        <div className="space-y-4">
                          <p className="font-mono text-sm text-cyan-100/60">🔥 SOUL REALM - PERSONAL IDENTITY & INTEGRITY</p>
                          <CoreTab data={data} updateData={updateData} />
                        </div>
                      )}
                    </div>

                    {/* Right Column (Side Controls & System Stats) */}
                    <div className="space-y-6 overflow-auto">
                      <Panel title="Local Orchestrator" kicker="Hermes Controller">
                        <div className="space-y-3 font-mono text-xs text-cyan-100/70">
                          <div className="flex justify-between items-center bg-cyan-300/5 p-2 rounded">
                            <span>Status:</span>
                            <span className="text-greenCore">ACTIVE</span>
                          </div>
                          <div className="flex justify-between items-center bg-cyan-300/5 p-2 rounded">
                            <span>API Bridge:</span>
                            <span>{data.endpoints?.hermes || "http://localhost:8080"}</span>
                          </div>
                          <button
                            onClick={() => setChatOpen(true)}
                            className="hud-button primary w-full py-2 text-xs"
                          >
                            💬 Open Chat Console
                          </button>
                        </div>
                      </Panel>

                      <Panel title="Activity Monitor" kicker="Neural Feedback">
                        <div className="grid grid-cols-2 gap-2">
                          {(["idle", "listening", "thinking", "speaking"] as const).map((act) => (
                            <button
                              key={act}
                              onClick={() => {
                                soundManager.play("beep");
                                setActivity(act);
                              }}
                              className={`hud-button text-xs py-2 uppercase ${activity === act ? "primary" : "border-cyan-300/20 text-cyan-100/60"}`}
                            >
                              {act}
                            </button>
                          ))}
                        </div>
                      </Panel>
                    </div>
                  </div>
                </div>
            ) : (
              /* Administrative Deck View */
              <MissionControlDeck
                data={data}
                updateData={updateData}
                addLog={addLog}
                copyText={copyText}
                hardReset={hardReset}
                currentTime={currentTime}
                onLock={() => setAuthenticated(false)}
              />
            )}
          </main>

          {/* Quick status toast */}
          {toast && (
            <div className="toast-notify fixed bottom-6 right-6 z-50 rounded border border-cyan-300/30 bg-slate-950/90 px-4 py-3 font-mono text-xs uppercase text-cyanCore shadow-lg shadow-cyan-950/50 backdrop-blur-xl">
              ⚡ {toast}
            </div>
          )}

        </div>

        {hudVisible && (
          <HudOverlay
            palette={energyPalette}
            onActivityChange={setActivity}
            onPaletteChange={setEnergyPalette}
            onResetView={() => setResetViewSignal((signal) => signal + 1)}
          />
        )}

        {/* Slide-out Hermes Chat Drawer */}
        {chatOpen && (
          <HermesChat
            data={data}
            addLog={addLog}
            onClose={() => {
              soundManager.play("beep");
              setChatOpen(false);
            }}
          />
        )}
      </main>
    </StoneStateProvider>
  );
}
