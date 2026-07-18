import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { AiActivity } from "../../App";
import { AMBER, GOLD, HOT } from "./materials";

type CoreGlowProps = {
  activity: AiActivity;
};

export default function CoreGlow({ activity }: CoreGlowProps) {
  const hotCore = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);

  const materials = useMemo(
    () => ({
      hot: new THREE.MeshBasicMaterial({
        color: HOT,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      }),
      amber: new THREE.MeshBasicMaterial({
        color: GOLD,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      }),
      shell: new THREE.MeshBasicMaterial({
        color: AMBER,
        transparent: true,
        opacity: 0.028,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    }),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const activityBoost = activity === "speaking" ? 1.9 : activity === "thinking" ? 1.45 : activity === "listening" ? 1.25 : 1;
    const pulseRate = activity === "speaking" ? 7.8 : activity === "thinking" ? 5.2 : activity === "listening" ? 2.4 : 3.1;
    const pulse = 1 + Math.sin(t * pulseRate) * 0.07 * activityBoost + Math.sin(t * 13.4) * 0.018 * activityBoost;
    if (hotCore.current) {
      hotCore.current.scale.setScalar(0.34 * pulse * (activity === "speaking" ? 1.22 : activity === "thinking" ? 1.12 : 1));
      materials.hot.opacity = Math.min(1, 0.94 + Math.sin(t * 5.7) * 0.05 + (activityBoost - 1) * 0.1);
    }
    if (halo.current) {
      const wide = activity === "listening" ? 1.18 : activity === "speaking" ? 1.28 : activity === "thinking" ? 1.12 : 1;
      halo.current.scale.set((0.82 + Math.sin(t * 1.7) * 0.075) * wide, 0.44 + Math.cos(t * 1.5) * 0.035, 0.82 * wide);
      halo.current.rotation.z = t * (activity === "thinking" ? 0.58 : 0.28);
      materials.amber.opacity = 0.16 + Math.sin(t * 2.4) * 0.04 + (activityBoost - 1) * 0.07;
    }
    if (shell.current) {
      const shellPulse = activity === "idle" ? 1 : 1 + Math.sin(t * 2.2) * 0.06;
      shell.current.scale.set((0.98 + Math.sin(t * 0.9) * 0.05) * shellPulse, 0.54 + Math.cos(t * 0.8) * 0.03, 0.98 * shellPulse);
      shell.current.rotation.z = -t * (activity === "thinking" ? 0.28 : 0.12);
      materials.shell.opacity = 0.008 + Math.sin(t * 1.8) * 0.006 + (activityBoost - 1) * 0.014;
    }
    if (light.current) {
      light.current.intensity = 82 + Math.sin(t * 4.2) * 18 + activityBoost * 26;
    }
  });

  return (
    <group>
      <pointLight ref={light} color="#ffb83d" intensity={85} distance={11} decay={2} />
      <mesh ref={shell} material={materials.shell}>
        <sphereGeometry args={[1, 64, 64]} />
      </mesh>
      <mesh ref={halo} rotation={[0.4, 0.2, 0.18]} material={materials.amber}>
        <sphereGeometry args={[1, 64, 24]} />
      </mesh>
      <mesh ref={hotCore} material={materials.hot}>
        <sphereGeometry args={[1, 40, 40]} />
      </mesh>
    </group>
  );
}
