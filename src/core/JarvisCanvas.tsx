import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as THREE from "three";

import type { AiActivity, EnergyPalette } from "../App";
import RealmTransition from "./RealmTransition";
import { useReducedMotion } from "../utils/useReducedMotion";
import { MindScene } from "../realms/mind/MindScene";
import { SpaceScene } from "../realms/space/SpaceScene";
import { RealityScene } from "../realms/reality/RealityScene";
import { TimeScene } from "../realms/time/TimeScene";
import { SpiderScene } from "../realms/spider/SpiderScene";
import { PowerScene } from "../realms/power/PowerScene";
import { SoulScene } from "../realms/soul/SoulScene";

type JarvisCanvasProps = {
  activity: AiActivity;
  palette: EnergyPalette;
  resetSignal?: number;
};

const CLEAR_COLORS: Record<string, string> = {
  gold: "#020100",
  green: "#000704",
  blue: "#00040a",
  red: "#080002",
  violet: "#02000a",
  orange: "#080300",
  spider: "#000408",
};

const EXPOSURE: Record<string, number> = {
  blue: 0.9,
  green: 0.94,
  red: 0.88,
  violet: 0.86,
  orange: 0.92,
  spider: 0.78,
};


function getClearColor(palette: string) {
  return CLEAR_COLORS[palette] || CLEAR_COLORS.gold;
}

function isPointInOrbInteractionZone(event: { clientX: number; clientY: number }, element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const radius = Math.min(rect.width, rect.height) * 0.38;
  if (radius <= 0) return false;
  const normalizedX = (event.clientX - (rect.left + rect.width / 2)) / radius;
  const normalizedY = (event.clientY - (rect.top + rect.height / 2)) / (radius * 0.94);
  return normalizedX * normalizedX + normalizedY * normalizedY <= 1;
}

function CanvasPaletteBackground({ palette }: { palette: string }) {
  const { gl } = useThree();

  useEffect(() => {
    const clearColor = getClearColor(palette);
    gl.setClearColor(clearColor, 1);
    gl.toneMappingExposure = EXPOSURE[palette] ?? 0.94;
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
    controls.enableZoom = false;
    controls.enableRotate = false;
    controls.rotateSpeed = 0;
    controls.zoomSpeed = 0.48;
    controls.minDistance = 5.25;
    controls.maxDistance = size.width / size.height < 0.72 ? 15 : 8.6;
    controls.target.set(0, 0, 0);
    gl.domElement.classList.add("is-orbit-enabled");
    const updateInteractionZone = (event: PointerEvent | WheelEvent) => {
      const enabled =
        !document.body.classList.contains("hud-dragging") &&
        isPointInOrbInteractionZone(event, gl.domElement);
      controls.enableZoom = enabled;
      gl.domElement.classList.toggle("orb-hit-active", enabled);
    };
    const disableInteractionZone = () => {
      controls.enableZoom = false;
      gl.domElement.classList.remove("orb-hit-active");
    };
    gl.domElement.addEventListener("pointermove", updateInteractionZone, { passive: true });
    gl.domElement.addEventListener("pointerleave", disableInteractionZone);
    gl.domElement.addEventListener("wheel", updateInteractionZone, { capture: true, passive: true });
    return () => {
      gl.domElement.classList.remove("is-orbit-enabled");
      gl.domElement.classList.remove("orb-hit-active");
      gl.domElement.removeEventListener("pointermove", updateInteractionZone);
      gl.domElement.removeEventListener("pointerleave", disableInteractionZone);
      gl.domElement.removeEventListener("wheel", updateInteractionZone, true);
      controls.dispose();
    };
  }, [controls, gl.domElement, size]);

  useEffect(() => {
    const narrow = size.width / size.height < 0.72;
    const distance = narrow ? 10.8 : 6.1;
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
      ".hud-dock, .history-panel, .chat-side-panel, .settings-panel, .activity-hub, .prompt-shell, .draggable-panel, .os-taskbar, .os-minimized-dock, button, input, textarea, select"
    )
  );
}

function SceneRig({
  resetSignal = 0,
  children,
}: {
  resetSignal?: number;
  children: React.ReactNode;
}) {
  const root = useRef<THREE.Group>(null);
  const { pointer, size, gl } = useThree();
  const hovered = useRef(false);
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
      if (
        event.button !== 0 ||
        event.target !== gl.domElement ||
        isInteractiveTarget(event.target) ||
        document.body.classList.contains("hud-dragging") ||
        !isPointInOrbInteractionZone(event, gl.domElement)
      ) return;
      hovered.current = true;
      drag.current.active = true;
      drag.current.lastX = event.clientX;
      drag.current.lastY = event.clientY;
      document.body.classList.add("is-reactor-dragging");
    };

    const handlePointerMove = (event: PointerEvent) => {
      hovered.current =
        event.target === gl.domElement &&
        !document.body.classList.contains("hud-dragging") &&
        isPointInOrbInteractionZone(event, gl.domElement);
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
  }, [gl.domElement]);

  useEffect(() => {
    drag.current.x = 0;
    drag.current.y = 0;
    drag.current.targetX = 0;
    drag.current.targetY = 0;
  }, [resetSignal]);

  useFrame(({ clock }) => {
    const narrow = size.width / size.height < 0.72;
    if (root.current) {
      drag.current.x = THREE.MathUtils.lerp(drag.current.x, drag.current.targetX, 0.09);
      drag.current.y = THREE.MathUtils.lerp(drag.current.y, drag.current.targetY, 0.09);
      const hoverLean = narrow || !hovered.current || document.body.classList.contains("hud-dragging") ? 0 : 0.08;
      root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, drag.current.x - pointer.y * hoverLean, 0.045);
      root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, drag.current.y + pointer.x * hoverLean, 0.045);
      root.current.rotation.z = 0;
    }
  });

  return <group ref={root}>{children}</group>;
}

function PostFX({ activity, palette }: { activity: AiActivity; palette: string }) {
  const profile = useMemo(() => {
    const activityBoost = activity === "speaking" ? 1.25 : activity === "thinking" ? 1.12 : 1;
    const profiles: Record<string, { intensity: number; threshold: number; smoothing: number }> = {
      blue: { intensity: 1.32, threshold: 0.28, smoothing: 0.52 },
      green: { intensity: 1.35, threshold: 0.26, smoothing: 0.55 },
      red: { intensity: 1.28, threshold: 0.32, smoothing: 0.48 },
      violet: { intensity: 1.42, threshold: 0.25, smoothing: 0.5 },
      orange: { intensity: 1.3, threshold: 0.35, smoothing: 0.45 },
      spider: { intensity: 1.25, threshold: 0.28, smoothing: 0.4 },
    };
    const selected = profiles[palette] ?? profiles.blue;
    return { ...selected, intensity: selected.intensity * activityBoost };
  }, [activity, palette]);

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={profile.intensity}
        luminanceSmoothing={profile.smoothing}
        luminanceThreshold={profile.threshold}
        mipmapBlur
      />
    </EffectComposer>
  );
}

export default function JarvisCanvas({ activity, palette, resetSignal = 0 }: JarvisCanvasProps) {
  const reducedMotion = useReducedMotion();
  return (
    <div className="orb-webgl" aria-hidden="true">
      <Canvas
        camera={{ fov: 41, near: 0.1, far: 30, position: [0, 0, 6.1] }}
        dpr={reducedMotion ? 1 : [1, 1.45]}
        frameloop={reducedMotion ? "demand" : "always"}
      >
        <CanvasPaletteBackground palette={palette} />
        <CameraOrbitController resetSignal={resetSignal} />
        <SceneRig resetSignal={resetSignal}>
          <RealmTransition palette={palette}>
            {(activePalette) => {
              if (activePalette === "gold") {
                return <MindScene activity={activity} palette="gold" />;
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
              if (activePalette === "spider") {
                return <SpiderScene activity={activity} />;
              }
              return <MindScene activity={activity} palette="gold" />;
            }}
          </RealmTransition>
        </SceneRig>
        <PostFX activity={activity} palette={palette} />
      </Canvas>
    </div>
  );
}
