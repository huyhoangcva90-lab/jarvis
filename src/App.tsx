import { useEffect, useState } from "react";
import CinematicOrb from "./components/orb/CinematicOrb";
import HudOverlay from "./components/orb/HudOverlay";

export type AiActivity = "idle" | "listening" | "thinking" | "speaking";

export default function App() {
  const [activity, setActivity] = useState<AiActivity>("idle");

  useEffect(() => {
    document.body.dataset.activity = activity;
  }, [activity]);

  return (
    <main className="jarvis-shell">
      <div className="orb-stage">
        <CinematicOrb activity={activity} />
      </div>
      <HudOverlay onActivityChange={setActivity} />
    </main>
  );
}
