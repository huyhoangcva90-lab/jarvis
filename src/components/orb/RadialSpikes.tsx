import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { AiActivity } from "../../App";
import { GOLD, HOT, seeded } from "./materials";

type RadialSpikesProps = {
  activity: AiActivity;
};

export default function RadialSpikes({ activity }: RadialSpikesProps) {
  const group = useRef<THREE.Group>(null);
  const { spikes, beams } = useMemo(() => {
    const minor = Array.from({ length: 54 }, (_, index) => {
      const a = seeded(index * 2.7) * Math.PI * 2;
      const z = (seeded(index * 4.11) - 0.5) * 1.15;
      const start = 0.38 + seeded(index * 8.9) * 0.72;
      const end = 1.0 + seeded(index * 3.21) * (index % 9 === 0 ? 2.9 : 1.25);
      const tilt = 0.5 + seeded(index * 6.4) * 0.55;
      const x1 = Math.cos(a) * start;
      const y1 = Math.sin(a) * start * tilt;
      const kink = (seeded(index * 11.2) - 0.5) * (index % 6 === 0 ? 0.5 : 0.2);
      const x2 = Math.cos(a + kink) * end;
      const y2 = Math.sin(a + kink * 0.45) * end * tilt;
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
      return { geometry, material, seed: seeded(index * 5.55), speed: 1.4 + seeded(index * 7.1) * 3.8, long: index % 11 === 0 };
    });
    const major = Array.from({ length: 15 }, (_, index) => {
      const angle = (index / 15) * Math.PI * 2 + seeded(index * 8.8) * 0.44;
      const yTilt = index === 0 ? 0 : -0.72 + seeded(index * 3.3) * 1.44;
      const zTilt = -0.36 + seeded(index * 7.7) * 0.72;
      const direction = new THREE.Vector3(Math.cos(angle), Math.sin(angle) * (0.48 + Math.abs(yTilt) * 0.4), zTilt).normalize();
      const length = index % 5 === 0 ? 7.4 : 5.1 + seeded(index * 2.5) * 1.8;
      const midpoint = direction.clone().multiplyScalar((seeded(index * 5.9) - 0.5) * 0.34);
      const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
      const material = new THREE.MeshBasicMaterial({
        color: index % 4 === 0 ? HOT : GOLD,
        transparent: true,
        opacity: 0.38 + seeded(index * 4.4) * 0.24,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      return { length, midpoint, quaternion, material, seed: seeded(index * 9.1), speed: 1.6 + seeded(index * 6.1) * 3.6, radius: index % 5 === 0 ? 0.014 : 0.008 };
    });
    return { spikes: minor, beams: major };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const boost = activity === "speaking" ? 2.3 : activity === "thinking" ? 1.9 : activity === "listening" ? 1.45 : 0.62;
    if (group.current) {
      group.current.rotation.z = Math.sin(t * 0.16) * 0.08 + t * (activity === "thinking" ? 0.035 : 0.006);
    }
    spikes.forEach((spike) => {
      const flare = spike.long && activity !== "idle" ? 0.24 : 0;
      spike.material.opacity = Math.min(0.88, ((0.05 + spike.seed * 0.24) * boost + flare) * (0.45 + Math.sin(t * spike.speed * Math.max(1, boost) + spike.seed * 22) * 0.55));
    });
    beams.forEach((beam) => {
      beam.material.opacity = Math.min(0.92, (0.22 + beam.seed * 0.24) * boost * (0.7 + Math.sin(t * beam.speed + beam.seed * 18) * 0.3));
    });
  });

  return (
    <group ref={group}>
      {spikes.map((spike, index) => (
        <lineSegments key={index} geometry={spike.geometry} material={spike.material} />
      ))}
      {beams.map((beam, index) => (
        <mesh key={`beam-${index}`} material={beam.material} position={beam.midpoint} quaternion={beam.quaternion}>
          <cylinderGeometry args={[beam.radius, beam.radius * 0.45, beam.length, 8, 1, true]} />
        </mesh>
      ))}
    </group>
  );
}
