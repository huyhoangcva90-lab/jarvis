import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { AiActivity } from "../../App";
import { makeBrokenRingGeometry } from "./geometry";
import { GOLD, additiveLine, seeded } from "./materials";

type InnerGridProps = {
  activity: AiActivity;
};

export default function InnerGrid({ activity }: InnerGridProps) {
  const group = useRef<THREE.Group>(null);
  const refs = useRef<Array<THREE.LineSegments | null>>([]);
  const responseLevel = useRef(0);
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
    const target = activity === "speaking" ? 1 : activity === "thinking" ? 0.72 : activity === "listening" ? 0.38 : 0;
    responseLevel.current = THREE.MathUtils.lerp(responseLevel.current, target, 0.07);
    const response = responseLevel.current;
    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.07) * 0.08 + response * Math.sin(t * 0.8) * 0.035;
      const scale = 1 + response * 0.05 + Math.sin(t * 4.4) * response * 0.018;
      group.current.scale.setScalar(scale);
    }
    refs.current.forEach((ring, index) => {
      if (!ring) return;
      const cadence = 1 + response * (0.8 + (index % 3) * 0.18);
      ring.rotation.z += rings[index].speed * 0.007 * cadence;
      ring.rotation.x = rings[index].rotation.x + Math.sin(t * 0.55 + index) * 0.025 * response;
      ring.rotation.y = rings[index].rotation.y + Math.cos(t * 0.45 + index) * 0.03 * response;
      rings[index].material.opacity = 0.06 + seeded(index * 4.8) * 0.1 + Math.sin(t * 0.6 + index) * 0.02 + response * 0.08;
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
