import { useEffect, useState } from "react";
import CinematicOrb from "./components/orb/CinematicOrb";
import HudOverlay from "./components/orb/HudOverlay";

export type AiActivity = "idle" | "listening" | "thinking" | "speaking";
export type EnergyPalette = "gold" | "blue" | "green" | "red" | "violet" | "orange";

export default function App() {
  const [activity, setActivity] = useState<AiActivity>("idle");
  const [resetViewSignal, setResetViewSignal] = useState(0);
  const [hudVisible, setHudVisible] = useState(true);

  useEffect(() => {
    document.body.dataset.activity = activity;
    document.body.dataset.palette = "gold";
    document.body.dataset.hudTheme = "gold";
  }, [activity]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "h") setHudVisible((visible) => !visible);
      if (event.key.toLowerCase() === "r" || event.key === "Escape") {
        setResetViewSignal((signal) => signal + 1);
        setActivity("idle");
      }
      if (event.key === "1") setActivity("idle");
      if (event.key === "2") setActivity("listening");
      if (event.key === "3") setActivity("thinking");
      if (event.key === "4") setActivity("speaking");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main className="jarvis-shell minimal-gold-shell" aria-label="J-Core Gold Orb Chat HUD">
      <div className="orb-stage">
        <CinematicOrb activity={activity} palette="gold" resetSignal={resetViewSignal} />
      </div>

      <div className="gold-orb-atmosphere" aria-hidden="true" />

      {hudVisible && (
        <HudOverlay
          palette="gold"
          onActivityChange={setActivity}
          onPaletteChange={() => undefined}
          onResetView={() => setResetViewSignal((signal) => signal + 1)}
        />
      )}
    </main>
  );
}
