import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as THREE from "three";

import type { AiActivity, EnergyPalette } from "../App";
import RealmTransition from "./RealmTransition";
import JarvisNeutralCore from "./JarvisNeutralCore";
import { MindScene } from "../realms/mind/MindScene";
import { TimeScene } from "../realms/time/TimeScene";
import { SpaceScene } from "../realms/space/SpaceScene";
import { RealityScene } from "../realms/reality/RealityScene";
import { PowerScene } from "../realms/power/PowerScene";
import { SoulScene } from "../realms/soul/SoulScene";

type JarvisCanvasProps = {
  activity: AiActivity;
  palette: EnergyPalette;
  resetSignal?: number;
  onRealmSelect?: (palette: EnergyPalette) => void;
};

const CLEAR_COLORS: Record<string, string> = {
  gold: "#020100",
  green: "#000704",
  blue: "#00040a",
  red: "#080002",
  violet: "#040008",
  orange: "#080300",
  neutral: "#020617",
};

function getClearColor(palette: string) {
  return CLEAR_COLORS[palette] || CLEAR_COLORS.neutral;
}

function CanvasPaletteBackground({ palette }: { palette: string }) {
  const { gl } = useThree();

  useEffect(() => {
    const clearColor = getClearColor(palette);
    gl.setClearColor(clearColor, 1);
  }, [gl, palette]);

  return null;
}

function CameraOrbitController({ resetSignal = 0 }: { resetSignal?: number }) {
  const { camera, gl, size } = useThree();
  const controls = useMemo(() => new OrbitControls(camera, gl.domElement), [camera, gl]);

  useEffect(() => {
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.enableRotate = false;
    controls.rotateSpeed = 0;
    controls.zoomSpeed = 0.48;
    controls.minDistance = 5.25;
    controls.maxDistance = size.width / size.height < 0.72 ? 15 : 8.6;
    controls.target.set(0, 0, 0);
    gl.domElement.classList.add("is-orbit-enabled");
    return () => {
      gl.domElement.classList.remove("is-orbit-enabled");
      controls.dispose();
    };
  }, [controls, gl.domElement, size]);

  useEffect(() => {
    const narrow = size.width / size.height < 0.72;
    const distance = narrow ? 12.9 : 7.15;
    camera.position.set(0, 0, distance);
    controls.target.set(0, 0, 0);
    controls.update();
  }, [camera, controls, resetSignal, size.height, size.width]);

  useFrame(() => controls.update());
  return null;
}

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(
    target.closest(
      ".hud-dock, .history-panel, .settings-panel, .activity-hub, .prompt-shell, button, input, textarea, select"
    )
  );
}

function SceneRig({
  activity,
  palette,
  resetSignal = 0,
  children,
}: {
  activity: AiActivity;
  palette: string;
  resetSignal?: number;
  children: React.ReactNode;
}) {
  const root = useRef<THREE.Group>(null);
  const { pointer, size } = useThree();
  const drag = useRef({
    active: false,
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    lastX: 0,
    lastY: 0,
  });

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || isInteractiveTarget(event.target)) return;
      drag.current.active = true;
      drag.current.lastX = event.clientX;
      drag.current.lastY = event.clientY;
      document.body.classList.add("is-reactor-dragging");
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!drag.current.active) return;
      const dx = event.clientX - drag.current.lastX;
      const dy = event.clientY - drag.current.lastY;
      drag.current.lastX = event.clientX;
      drag.current.lastY = event.clientY;
      drag.current.targetY += dx * 0.0065;
      drag.current.targetX += dy * 0.0048;
      drag.current.targetX = THREE.MathUtils.clamp(drag.current.targetX, -0.9, 0.9);
    };

    const stopDragging = () => {
      drag.current.active = false;
      document.body.classList.remove("is-reactor-dragging");
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("pointercancel", stopDragging);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("pointercancel", stopDragging);
      document.body.classList.remove("is-reactor-dragging");
    };
  }, []);

  useEffect(() => {
    drag.current.x = 0;
    drag.current.y = 0;
    drag.current.targetX = 0;
    drag.current.targetY = 0;
  }, [resetSignal]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const narrow = size.width / size.height < 0.72;
    if (root.current) {
      drag.current.x = THREE.MathUtils.lerp(drag.current.x, drag.current.targetX, 0.09);
      drag.current.y = THREE.MathUtils.lerp(drag.current.y, drag.current.targetY, 0.09);
      const energy = activity === "speaking" ? 1.52 : activity === "thinking" ? 1.28 : activity === "listening" ? 0.82 : 1;
      const breath =
        1 +
        Math.sin(t * (activity === "speaking" ? 5.8 : 0.88)) *
          (activity === "speaking" ? 0.026 : 0.009) *
          energy;
      root.current.scale.setScalar(breath);
      const hoverLean = narrow ? 0 : 0.08;
      root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, drag.current.x - pointer.y * hoverLean, 0.045);
      root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, drag.current.y + pointer.x * hoverLean, 0.045);
      root.current.rotation.z = Math.sin(t * 0.12) * 0.016;
    }
  });

  return <group ref={root}>{children}</group>;
}

function PostFX({ activity, palette }: { activity: AiActivity; palette: string }) {
  const bloomIntensity = useMemo(() => {
    const base = activity === "speaking" ? 2.55 : activity === "thinking" ? 2.08 : 1.84;
    // Tinh chinh bloom cho tung Realm
    if (palette === "green") return base * 1.04;
    if (palette === "blue") return base * 0.96;
    return base;
  }, [activity, palette]);

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={bloomIntensity}
        luminanceSmoothing={0.64}
        luminanceThreshold={0.22}
        mipmapBlur
      />
    </EffectComposer>
  );
}

export default function JarvisCanvas({ activity, palette, resetSignal = 0, onRealmSelect }: JarvisCanvasProps) {
  return (
    <div className="orb-webgl" aria-hidden="true">
      <Canvas
        camera={{ fov: 41, near: 0.1, far: 30, position: [0, 0, 7.15] }}
        dpr={[1, 1.45]}
        gl={{
          alpha: false,
          antialias: false,
          powerPreference: "high-performance",
          stencil: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(getClearColor(palette), 1);
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.98;
        }}
      >
        <CanvasPaletteBackground palette={palette} />
        <CameraOrbitController resetSignal={resetSignal} />
        <SceneRig activity={activity} palette={palette} resetSignal={resetSignal}>
          <RealmTransition palette={palette}>
            {(activePalette) => {
              if (activePalette === "gold") {
                return <MindScene activity={activity} />;
              }
              if (activePalette === "green") {
                return <TimeScene activity={activity} />;
              }
              if (activePalette === "blue") {
                return <SpaceScene activity={activity} />;
              }
              if (activePalette === "red") {
                return <RealityScene activity={activity} />;
              }
              if (activePalette === "violet") {
                return <PowerScene activity={activity} />;
              }
              if (activePalette === "orange") {
                return <SoulScene activity={activity} />;
              }
              return <JarvisNeutralCore onSelectRealm={onRealmSelect} />;
            }}
          </RealmTransition>
        </SceneRig>
        <PostFX activity={activity} palette={palette} />
      </Canvas>
    </div>
  );
}
