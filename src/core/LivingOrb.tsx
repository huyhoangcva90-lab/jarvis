import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AiActivity } from "../types/orb";

type LivingOrbProps = {
  activity: AiActivity;
  color: string;
  accent: string;
  children: React.ReactNode;
};

function activityRate(activity: AiActivity) {
  if (activity === "speaking") return 2.1;
  if (activity === "thinking") return 1.55;
  if (activity === "listening") return 0.62;
  return 1;
}

export function LivingOrb({ activity, color, accent, children }: LivingOrbProps) {
  const root = useRef<THREE.Group>(null);
  const pulse = useRef<THREE.Group>(null);
  const rings = useRef<THREE.Mesh[]>([]);
  const bornAt = useRef<number | null>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    if (bornAt.current === null) bornAt.current = t;
    const age = t - bornAt.current;
    const entrance = THREE.MathUtils.smoothstep(age, 0, 1.35);
    const speed = activityRate(activity);
    const voice = activity === "speaking" ? Math.sin(t * 8.4) * 0.045 : 0;
    const thought = activity === "thinking" ? -0.025 + Math.pow(0.5 + 0.5 * Math.sin(t * 3.2), 8) * 0.065 : 0;
    const breath = 1 + Math.sin(t * 0.92) * 0.012 + voice + thought;

    if (root.current) {
      root.current.scale.setScalar(Math.max(0.001, entrance * breath));
      root.current.rotation.y += delta * 0.022 * speed;
    }
    if (pulse.current) pulse.current.rotation.y -= delta * 0.11 * speed;

    rings.current.forEach((ring, index) => {
      const phase = (t * (activity === "speaking" ? 0.82 : 0.22) + index / 3) % 1;
      const listenClamp = activity === "listening" ? 0.72 + Math.sin(t * 2.1 + index) * 0.05 : 1;
      ring.scale.setScalar((0.72 + phase * 1.58) * listenClamp);
      const material = ring.material as THREE.MeshBasicMaterial;
      material.opacity = activity === "speaking"
        ? Math.pow(1 - phase, 2.2) * 0.38
        : activity === "thinking"
          ? Math.pow(0.5 + 0.5 * Math.sin(t * 2.5 + index * 1.7), 6) * 0.12
          : activity === "listening"
            ? 0.08 + Math.sin(t * 2 + index) * 0.025
            : 0.025;
    });
  });

  return (
    <group ref={root}>
      {children}
      <group ref={pulse}>
        {[0, 1, 2].map((index) => (
          <mesh
            key={index}
            ref={(node) => { if (node) rings.current[index] = node; }}
            rotation={[index === 1 ? Math.PI / 2 : Math.PI / 3, index === 2 ? Math.PI / 2 : 0, index * 0.7]}
          >
            <torusGeometry args={[2.15, 0.008, 4, 128]} />
            <meshBasicMaterial
              blending={THREE.AdditiveBlending}
              color={index === 1 ? accent : color}
              depthWrite={false}
              opacity={0.04}
              toneMapped={false}
              transparent
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
