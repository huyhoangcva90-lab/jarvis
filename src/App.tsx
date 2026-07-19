import { useEffect, useState } from "react";
import CinematicOrb from "./components/orb/CinematicOrb";
import HudOverlay from "./components/orb/HudOverlay";

export type AiActivity = "idle" | "listening" | "thinking" | "speaking";
export type EnergyPalette = "gold" | "blue" | "green" | "red";

export default function App() {
  const [activity, setActivity] = useState<AiActivity>("idle");
  const [hudVisible, setHudVisible] = useState(true);
  const [resetViewSignal, setResetViewSignal] = useState(0);
  const [energyPalette, setEnergyPalette] = useState<EnergyPalette>("gold");

  useEffect(() => {
    document.body.dataset.activity = activity;
  }, [activity]);

  useEffect(() => {
    const toggleHud = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "h") setHudVisible((visible) => !visible);
      if (event.key === "Escape") setHudVisible(false);
      if (event.key === "1") setActivity("idle");
      if (event.key === "2") setActivity("listening");
      if (event.key === "3") setActivity("thinking");
      if (event.key === "4") setActivity("speaking");
      if (event.key.toLowerCase() === "r") setResetViewSignal((signal) => signal + 1);
    };
    window.addEventListener("keydown", toggleHud);
    return () => window.removeEventListener("keydown", toggleHud);
  }, []);

  return (
    <main className="jarvis-shell">
      <div className="orb-stage">
        <CinematicOrb activity={activity} palette={energyPalette} resetSignal={resetViewSignal} />
      </div>
      <div className={`hud-layer ${hudVisible ? "is-visible" : ""}`}>
        <HudOverlay
          onActivityChange={setActivity}
          onPaletteChange={setEnergyPalette}
          onResetView={() => setResetViewSignal((signal) => signal + 1)}
        />
      </div>
    </main>
  );
}
