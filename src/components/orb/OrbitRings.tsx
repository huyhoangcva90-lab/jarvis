import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { makeBrokenRingGeometry } from "./geometry";
import { GOLD, HOT, additiveLine, seeded } from "./materials";

type RingObject = {
  geometry: THREE.BufferGeometry;
  material: THREE.LineBasicMaterial;
  rotation: [number, number, number];
  speed: number;
};

export default function OrbitRings() {
  const refs = useRef<Array<THREE.LineSegments | null>>([]);
  const rings = useMemo<RingObject[]>(() => {
    const count = 18;
    return Array.from({ length: count }, (_, index) => {
      const radius = 0.62 + index * 0.115 + seeded(index * 9) * 0.2;
      const geometry = makeBrokenRingGeometry(radius, 70 + index * 6, 0.5 + seeded(index * 8.2) * 0.24);
      const material = additiveLine(index % 5 === 0 ? HOT : GOLD, 0.15 + seeded(index * 3.1) * 0.22);
      return {
        geometry,
        material,
        rotation: [
          -0.9 + seeded(index * 4.1) * 1.8,
          -0.85 + seeded(index * 5.2) * 1.7,
          seeded(index * 6.3) * Math.PI
        ],
        speed: (0.12 + seeded(index * 7.4) * 0.46) * (index % 2 ? -1 : 1)
      };
    });
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    refs.current.forEach((ring, index) => {
      if (!ring) return;
      const spec = rings[index];
      ring.rotation.z += spec.speed * 0.012;
      ring.rotation.x = spec.rotation[0] + Math.sin(t * 0.19 + index) * 0.035;
      ring.rotation.y = spec.rotation[1] + Math.cos(t * 0.15 + index) * 0.04;
      spec.material.opacity = 0.12 + seeded(index * 1.8) * 0.2 + Math.sin(t * (0.7 + index * 0.03) + index) * 0.04;
    });
  });

  return (
    <group>
      {rings.map((ring, index) => (
        <lineSegments
          key={index}
          ref={(node) => {
            refs.current[index] = node;
          }}
          geometry={ring.geometry}
          material={ring.material}
          rotation={ring.rotation}
        />
      ))}
    </group>
  );
}
