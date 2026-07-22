import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HypercubeSystem } from "./HypercubeSystem";
import { LivingOrb } from "../../core/LivingOrb";
import { RealmAtmosphere } from "../../core/RealmAtmosphere";

type SpaceActivity = "idle" | "listening" | "thinking" | "speaking";

export function SpaceScene({ activity = "idle" }: { activity?: SpaceActivity }) {
  const starField = useRef<THREE.Points>(null);
  const stars = useMemo(() => {
    const positions = new Float32Array(180 * 3);
    for (let index = 0; index < 180; index += 1) {
      const angle = index * 2.39996;
      const radius = 2.1 + ((index * 43) % 100) / 100 * 2.4;
      positions[index * 3] = Math.cos(angle) * radius;
      positions[index * 3 + 1] = Math.sin(index * 1.37) * 2.4;
      positions[index * 3 + 2] = Math.sin(angle) * radius - 0.8;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  useFrame((_, delta) => {
    if (starField.current) starField.current.rotation.y -= delta * (activity === "thinking" ? 0.08 : 0.025);
  });

  return (
    <LivingOrb activity={activity} color="#27c7ff" accent="#a7ffff">
      <RealmAtmosphere activity={activity} primary="#27c7ff" secondary="#4effd2" hot="#efffff" variant="tesseract" />
      <HypercubeSystem activity={activity} />
      <points ref={starField} geometry={stars}>
        <pointsMaterial blending={THREE.AdditiveBlending} color="#38d9ff" depthWrite={false} opacity={0.34} size={0.022} sizeAttenuation toneMapped={false} transparent />
      </points>
    </LivingOrb>
  );
}
