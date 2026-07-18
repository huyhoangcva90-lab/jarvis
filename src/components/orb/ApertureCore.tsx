import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { AiActivity } from "../../App";
import { AMBER, GOLD, HOT, seeded } from "./materials";

type ApertureCoreProps = {
  activity: AiActivity;
};

export default function ApertureCore({ activity }: ApertureCoreProps) {
  const refs = useRef<Array<THREE.Mesh | null>>([]);
  const rings = useMemo(() => {
    return Array.from({ length: 9 }, (_, index) => {
      const material = new THREE.MeshBasicMaterial({
        color: index < 3 ? HOT : index % 2 ? GOLD : AMBER,
        transparent: true,
        opacity: 0.18 + seeded(index * 3.4) * 0.32,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      return {
        radius: 0.34 + index * 0.075,
        tube: 0.004 + seeded(index * 2.1) * 0.007,
        material,
        rotation: [
          0.15 + seeded(index * 1.7) * 0.9,
          -0.55 + seeded(index * 2.8) * 1.1,
          seeded(index * 4.4) * Math.PI
        ] as [number, number, number],
        speed: (0.22 + seeded(index * 7.5) * 0.8) * (index % 2 ? -1 : 1)
      };
    });
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const boost = activity === "speaking" ? 1.7 : activity === "thinking" ? 1.45 : activity === "listening" ? 1.22 : 1;
    refs.current.forEach((ring, index) => {
      if (!ring) return;
      const spec = rings[index];
      ring.rotation.x = spec.rotation[0] + Math.sin(t * 0.6 + index) * 0.055;
      ring.rotation.y = spec.rotation[1] + Math.cos(t * 0.45 + index) * 0.06;
      ring.rotation.z += spec.speed * 0.012 * boost;
      ring.scale.set(1 + Math.sin(t * (1.2 + index * 0.09)) * 0.035 * boost, 0.72 + Math.cos(t * 0.7 + index) * 0.06, 1);
      spec.material.opacity = Math.min(0.78, (0.16 + seeded(index * 3.4) * 0.26) * boost);
    });
  });

  return (
    <group>
      {rings.map((ring, index) => (
        <mesh
          key={index}
          ref={(node) => {
            refs.current[index] = node;
          }}
          material={ring.material}
          rotation={ring.rotation}
        >
          <torusGeometry args={[ring.radius, ring.tube, 6, 128, Math.PI * (1.05 + seeded(index * 9.2) * 0.7)]} />
        </mesh>
      ))}
    </group>
  );
}
