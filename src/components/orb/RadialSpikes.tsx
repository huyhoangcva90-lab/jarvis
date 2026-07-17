import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { GOLD, HOT, seeded } from "./materials";

export default function RadialSpikes() {
  const group = useRef<THREE.Group>(null);
  const spikes = useMemo(() => {
    return Array.from({ length: 68 }, (_, index) => {
      const a = seeded(index * 2.7) * Math.PI * 2;
      const z = (seeded(index * 4.11) - 0.5) * 1.15;
      const start = 0.28 + seeded(index * 8.9) * 0.5;
      const end = 1.8 + seeded(index * 3.21) * 2.15;
      const tilt = 0.5 + seeded(index * 6.4) * 0.55;
      const x1 = Math.cos(a) * start;
      const y1 = Math.sin(a) * start * tilt;
      const x2 = Math.cos(a + (seeded(index) - 0.5) * 0.18) * end;
      const y2 = Math.sin(a) * end * tilt;
      const geometry = new THREE.BufferGeometry().setAttribute(
        "position",
        new THREE.Float32BufferAttribute([x1, y1, z * 0.2, x2, y2, z], 3)
      );
      const material = new THREE.LineBasicMaterial({
        color: index % 9 === 0 ? HOT : GOLD,
        transparent: true,
        opacity: 0.18 + seeded(index * 1.4) * 0.36,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      return { geometry, material, seed: seeded(index * 5.55), speed: 1.4 + seeded(index * 7.1) * 3.8 };
    });
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (group.current) {
      group.current.rotation.z = Math.sin(t * 0.16) * 0.08;
    }
    spikes.forEach((spike) => {
      spike.material.opacity = (0.1 + spike.seed * 0.38) * (0.55 + Math.sin(t * spike.speed + spike.seed * 22) * 0.45);
    });
  });

  return (
    <group ref={group}>
      {spikes.map((spike, index) => (
        <lineSegments key={index} geometry={spike.geometry} material={spike.material} />
      ))}
    </group>
  );
}
