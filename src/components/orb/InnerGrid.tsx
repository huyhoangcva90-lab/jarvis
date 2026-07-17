import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { makeBrokenRingGeometry } from "./geometry";
import { GOLD, additiveLine, seeded } from "./materials";

export default function InnerGrid() {
  const group = useRef<THREE.Group>(null);
  const refs = useRef<Array<THREE.LineSegments | null>>([]);
  const rings = useMemo(() => {
    return Array.from({ length: 11 }, (_, index) => ({
      geometry: makeBrokenRingGeometry(0.75 + index * 0.15, 42 + index * 5, 0.34 + seeded(index * 2) * 0.24),
      material: additiveLine(GOLD, 0.08 + seeded(index * 4.8) * 0.12),
      rotation: new THREE.Euler(
        (seeded(index * 1.2) - 0.5) * 1.25,
        (seeded(index * 2.2) - 0.5) * 1.6,
        seeded(index * 3.7) * Math.PI
      ),
      speed: (0.04 + seeded(index * 9.1) * 0.16) * (index % 2 ? -1 : 1)
    }));
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.07) * 0.08;
    }
    refs.current.forEach((ring, index) => {
      if (!ring) return;
      ring.rotation.z += rings[index].speed * 0.007;
      rings[index].material.opacity = 0.06 + seeded(index * 4.8) * 0.1 + Math.sin(t * 0.6 + index) * 0.02;
    });
  });

  return (
    <group ref={group}>
      {rings.map((ring, index) => (
        <lineSegments
          key={index}
          ref={(node) => {
            refs.current[index] = node;
          }}
          geometry={ring.geometry}
          material={ring.material}
          rotation={[ring.rotation.x, ring.rotation.y, ring.rotation.z + performance.now() * 0]}
        />
      ))}
    </group>
  );
}
