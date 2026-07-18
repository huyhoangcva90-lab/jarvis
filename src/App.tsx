import { useEffect, useState } from "react";
import CinematicOrb from "./components/orb/CinematicOrb";
import HudOverlay from "./components/orb/HudOverlay";

export type AiActivity = "idle" | "listening" | "thinking" | "speaking";

export default function App() {
  const [activity, setActivity] = useState<AiActivity>("idle");
  const [hudVisible, setHudVisible] = useState(true);

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
    };
    window.addEventListener("keydown", toggleHud);
    return () => window.removeEventListener("keydown", toggleHud);
  }, []);

  return (
    <main className="jarvis-shell">
      <div className="orb-stage">
        <CinematicOrb activity={activity} />
      </div>
      <div className={`hud-layer ${hudVisible ? "is-visible" : ""}`}>
        <HudOverlay onActivityChange={setActivity} />
      </div>
    </main>
  );
}
