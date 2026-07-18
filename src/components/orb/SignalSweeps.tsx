import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { AiActivity } from "../../App";
import { AMBER, GOLD, HOT, seeded } from "./materials";

type SignalSweepsProps = {
  activity: AiActivity;
};

export default function SignalSweeps({ activity }: SignalSweepsProps) {
  const refs = useRef<Array<THREE.Mesh | null>>([]);
  const responseLevel = useRef(0);
  const sweeps = useMemo(() => {
    return Array.from({ length: 8 }, (_, index) => {
      const material = new THREE.MeshBasicMaterial({
        color: index % 4 === 0 ? HOT : index % 2 ? AMBER : GOLD,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      return {
        material,
        radius: 0.46 + index * 0.09,
        tube: index % 3 === 0 ? 0.008 : 0.005,
        phase: seeded(index * 4.7),
        speed: 0.13 + seeded(index * 3.3) * 0.22,
        rotation: [
          -0.72 + seeded(index * 2.1) * 1.44,
          -0.64 + seeded(index * 3.2) * 1.28,
          seeded(index * 5.4) * Math.PI
        ] as [number, number, number]
      };
    });
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const target = activity === "speaking" ? 1 : activity === "thinking" ? 0.74 : activity === "listening" ? 0.34 : 0;
    responseLevel.current = THREE.MathUtils.lerp(responseLevel.current, target, 0.075);
    const response = responseLevel.current;
    refs.current.forEach((mesh, index) => {
      if (!mesh) return;
      const spec = sweeps[index];
      const phase = (t * (0.34 + spec.speed * response) + spec.phase + index * 0.08) % 1;
      const expansion = 0.78 + phase * (activity === "speaking" ? 3.2 : 2.35);
      const band = Math.sin(phase * Math.PI);
      mesh.scale.set(expansion * (1 + response * 0.12), expansion * (0.58 + seeded(index) * 0.22), expansion);
      mesh.rotation.x = spec.rotation[0] + Math.sin(t * 0.42 + index) * 0.08 * response;
      mesh.rotation.y = spec.rotation[1] + Math.cos(t * 0.38 + index) * 0.07 * response;
      mesh.rotation.z += spec.speed * 0.012 * (1 + response);
      spec.material.opacity = Math.min(0.5, band * response * (0.12 + seeded(index * 7.1) * 0.22));
    });
  });

  return (
    <group>
      {sweeps.map((sweep, index) => (
        <mesh
          key={index}
          ref={(node) => {
            refs.current[index] = node;
          }}
          material={sweep.material}
          rotation={sweep.rotation}
        >
          <torusGeometry args={[sweep.radius, sweep.tube, 6, 160, Math.PI * (1.15 + seeded(index * 6.8) * 0.72)]} />
        </mesh>
      ))}
    </group>
  );
}
