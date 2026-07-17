import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import CoreGlow from "./components/orb/CoreGlow";
import EnergyPackets from "./components/orb/EnergyPackets";
import HudOverlay from "./components/orb/HudOverlay";
import InnerGrid from "./components/orb/InnerGrid";
import OrbitRings from "./components/orb/OrbitRings";
import OuterArcs from "./components/orb/OuterArcs";
import ParticleShell from "./components/orb/ParticleShell";
import PostFX from "./components/orb/PostFX";
import RadialSpikes from "./components/orb/RadialSpikes";
import SceneRig from "./components/orb/SceneRig";

export default function App() {
  return (
    <main className="jarvis-shell">
      <div className="orb-stage">
        <Canvas
          dpr={[1, 1.75]}
          camera={{ position: [0, 0, 8.4], fov: 42, near: 0.1, far: 120 }}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        >
          <color attach="background" args={["#030303"]} />
          <fog attach="fog" args={["#030303", 8, 18]} />
          <Suspense fallback={null}>
            <SceneRig>
              <ParticleShell />
              <InnerGrid />
              <OrbitRings />
              <OuterArcs />
              <RadialSpikes />
              <EnergyPackets />
              <CoreGlow />
            </SceneRig>
            <PostFX />
          </Suspense>
        </Canvas>
      </div>
      <HudOverlay />
    </main>
  );
}
