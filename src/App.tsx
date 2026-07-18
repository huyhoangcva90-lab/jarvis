import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import ApertureCore from "./components/orb/ApertureCore";
import CoreGlow from "./components/orb/CoreGlow";
import EnergyPackets from "./components/orb/EnergyPackets";
import HologramFragments from "./components/orb/HologramFragments";
import HudOverlay from "./components/orb/HudOverlay";
import InnerGrid from "./components/orb/InnerGrid";
import OrbitRings from "./components/orb/OrbitRings";
import OuterArcs from "./components/orb/OuterArcs";
import ParticleShell from "./components/orb/ParticleShell";
import PostFX from "./components/orb/PostFX";
import RadialSpikes from "./components/orb/RadialSpikes";
import SceneRig from "./components/orb/SceneRig";

export type AiActivity = "idle" | "listening" | "thinking" | "speaking";

export default function App() {
  const [activity, setActivity] = useState<AiActivity>("idle");

  useEffect(() => {
    document.body.dataset.activity = activity;
  }, [activity]);

  return (
    <main className="jarvis-shell">
      <div className="orb-stage">
        <Canvas
          dpr={[0.85, 1.25]}
          camera={{ position: [0, 0, 8.4], fov: 42, near: 0.1, far: 120 }}
          gl={{ antialias: false, alpha: false, powerPreference: "high-performance", stencil: false }}
        >
          <color attach="background" args={["#030303"]} />
          <fog attach="fog" args={["#030303", 8, 18]} />
          <Suspense fallback={null}>
            <SceneRig>
              <ParticleShell activity={activity} />
              <HologramFragments activity={activity} />
              <InnerGrid />
              <OrbitRings />
              <OuterArcs />
              <RadialSpikes activity={activity} />
              <EnergyPackets activity={activity} />
              <ApertureCore activity={activity} />
              <CoreGlow activity={activity} />
            </SceneRig>
            <PostFX activity={activity} />
          </Suspense>
        </Canvas>
      </div>
      <HudOverlay onActivityChange={setActivity} />
    </main>
  );
}
