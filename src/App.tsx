import { useEffect, useMemo, useState } from "react";
import CinematicOrb from "./components/orb/CinematicOrb";
import HudOverlay from "./components/orb/HudOverlay";
import BootScreen from "./components/BootScreen.jsx";
import AuthScreen from "./components/AuthScreen.jsx";
import { StoneStateProvider } from "./utils/stoneState.jsx";
import { loadData, saveData } from "./utils/storage.js";
import { soundManager } from "./utils/soundManager.js";
import { loadStoredEnergyPalette, type EnergyPalette } from "./utils/orbPreferences";

export type AiActivity = "idle" | "listening" | "thinking" | "speaking";
export type { EnergyPalette } from "./utils/orbPreferences";

export default function App() {
  const [booting, setBooting] = useState(true);
  const [data, setData] = useState(() => loadData());
  const [now, setNow] = useState(() => new Date());
  const [authenticated, setAuthenticated] = useState(!data.auth?.pinEnabled);
  const [activity, setActivity] = useState<AiActivity>("idle");
  const [energyPalette, setEnergyPalette] = useState<EnergyPalette>(loadStoredEnergyPalette);
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
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable);
      if (isTyping) return;

      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "h") {
        event.preventDefault();
        setHudVisible((visible) => !visible);
      }
      if (event.key === "Escape") setEnergyPalette("gold");
      if (event.key === "1") setActivity("idle");
      if (event.key === "2") setActivity("listening");
      if (event.key === "3") setActivity("thinking");
      if (event.key === "4") setActivity("speaking");
      if (event.key.toLowerCase() === "r") setResetViewSignal((signal) => signal + 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const currentTime = useMemo(
    () =>
      new Intl.DateTimeFormat("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        weekday: "short",
        hour12: false,
      }).format(now),
    [now],
  );

  const intensityClass =
    (
      {
        Low: "theme-low",
        Medium: "theme-medium",
        High: "theme-high",
      } as Record<string, string>
    )[data.themeIntensity] || "theme-medium";

  const updateData = (patch: any) => {
    setData((current: any) => ({ ...current, ...patch }));
  };

  if (!authenticated) {
    return <AuthScreen data={data} onUnlock={() => setAuthenticated(true)} />;
  }

  return (
    <StoneStateProvider data={data}>
      <main className={`jarvis-shell min-h-dvh overflow-hidden bg-void text-cyan-50 ${intensityClass}`}>
        <div className="orb-stage fixed inset-0 z-0">
          <CinematicOrb activity={activity} palette={energyPalette} resetSignal={resetViewSignal} />
        </div>

        {booting && <BootScreen />}

        <div className="pointer-events-none fixed inset-0 z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.13),transparent_28%),radial-gradient(circle_at_86%_20%,rgba(74,222,128,0.11),transparent_26%),linear-gradient(rgba(34,211,238,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.035)_1px,transparent_1px)] bg-[size:auto,auto,48px_48px,48px_48px]" />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-cyan-300/10 to-transparent" />
          <div className="absolute h-28 w-full animate-scan bg-gradient-to-b from-transparent via-cyan-300/10 to-transparent" />
        </div>

        {hudVisible && (
          <HudOverlay
            currentTime={currentTime}
            data={data}
            palette={energyPalette}
            updateData={updateData}
            onActivityChange={setActivity}
            onPaletteChange={setEnergyPalette}
            onResetView={() => setResetViewSignal((signal) => signal + 1)}
          />
        )}
      </main>
    </StoneStateProvider>
  );
}
