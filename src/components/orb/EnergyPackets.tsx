import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { AiActivity } from "../../App";
import { ellipsePoint } from "./geometry";
import { GOLD, HOT, additiveLine, seeded } from "./materials";

type Packet = {
  mesh: THREE.Mesh | null;
  trail: THREE.LineSegments | null;
  radius: number;
  tilt: number;
  rotation: THREE.Euler;
  speed: number;
  phase: number;
  size: number;
};

type EnergyPacketsProps = {
  activity: AiActivity;
};

export default function EnergyPackets({ activity }: EnergyPacketsProps) {
  const packets = useRef<Packet[]>([]);
  const specs = useMemo(() => {
    return Array.from({ length: 11 }, (_, index) => ({
      radius: 1.18 + seeded(index * 3.17) * 2.45,
      tilt: 0.28 + seeded(index * 4.27) * 0.55,
      rotation: new THREE.Euler(-0.85 + seeded(index) * 1.7, -0.6 + seeded(index * 2) * 1.2, seeded(index * 3) * Math.PI),
      speed: (0.42 + seeded(index * 5) * 0.9) * (index % 3 === 0 ? -1 : 1),
      phase: seeded(index * 6.2) * Math.PI * 2,
      size: 0.036 + seeded(index * 7.2) * 0.045
    }));
  }, []);

  const packetMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: HOT,
        transparent: true,
        opacity: 0.92,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      }),
    []
  );
  const trailMaterial = useMemo(() => additiveLine(GOLD, 0.32), []);

  const trailGeometries = useMemo(() => {
    return specs.map(() => new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(18), 3)));
  }, [specs]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const speedBoost = activity === "speaking" ? 2.35 : activity === "thinking" ? 2.05 : activity === "listening" ? 1.35 : 1;
    packetMaterial.opacity = activity === "idle" ? 0.72 : 0.96;
    trailMaterial.opacity = activity === "idle" ? 0.26 : activity === "thinking" ? 0.54 : 0.42;
    specs.forEach((spec, index) => {
      const packet = packets.current[index];
      if (!packet?.mesh || !packet.trail) return;
      const angle = spec.phase + t * spec.speed * speedBoost;
      const position = ellipsePoint(spec.radius, spec.tilt, angle, spec.rotation);
      const pulse = 1 + Math.sin(t * 5.8 + index) * 0.22;
      packet.mesh.position.copy(position);
      packet.mesh.scale.setScalar(spec.size * pulse * (activity === "speaking" ? 1.45 : activity === "thinking" ? 1.25 : 1));

      const positions = packet.trail.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 3; i += 1) {
        const a = angle - (i + 1) * 0.055 * Math.sign(spec.speed);
        const b = angle - i * 0.055 * Math.sign(spec.speed);
        const p1 = ellipsePoint(spec.radius, spec.tilt, a, spec.rotation);
        const p2 = ellipsePoint(spec.radius, spec.tilt, b, spec.rotation);
        positions.set([p1.x, p1.y, p1.z, p2.x, p2.y, p2.z], i * 6);
      }
      packet.trail.geometry.attributes.position.needsUpdate = true;
    });
  });

  return (
    <group>
      {specs.map((spec, index) => (
        <group key={index}>
          <lineSegments
            ref={(node) => {
              packets.current[index] = { ...spec, mesh: packets.current[index]?.mesh ?? null, trail: node };
            }}
            geometry={trailGeometries[index]}
            material={trailMaterial}
          />
          <mesh
            ref={(node) => {
              packets.current[index] = { ...spec, mesh: node, trail: packets.current[index]?.trail ?? null };
            }}
            material={packetMaterial}
          >
            <sphereGeometry args={[1, 16, 16]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
