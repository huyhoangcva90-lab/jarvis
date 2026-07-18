import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { AiActivity } from "../../App";
import { AMBER, GOLD, HOT, seeded } from "./materials";

type HologramFragmentsProps = {
  activity: AiActivity;
};

function sphericalPoint(radius: number, angle: number, y: number) {
  const ring = Math.sqrt(Math.max(0, 1 - y * y));
  return new THREE.Vector3(Math.cos(angle) * radius * ring, y * radius * 0.76, Math.sin(angle) * radius * ring * 0.72);
}

function makeClusterGeometry(seedBase: number, count: number) {
  const vertices: number[] = [];
  for (let i = 0; i < count; i += 1) {
    const cluster = Math.floor(seeded(seedBase + i * 0.31) * 5);
    const clusterAngle = [-0.55, 0.18, 1.18, 2.56, 4.9][cluster];
    const angle = clusterAngle + (seeded(seedBase + i * 4.7) - 0.5) * (cluster === 1 ? 1.1 : 0.62);
    const y = -0.62 + seeded(seedBase + i * 2.3) * 1.24;
    const radius = 2.05 + seeded(seedBase + i * 5.9) * 1.02;
    const start = sphericalPoint(radius, angle, y);
    const stepA = angle + (seeded(seedBase + i * 6.2) - 0.5) * 0.18;
    const mid = sphericalPoint(radius + (seeded(seedBase + i * 7.1) - 0.5) * 0.18, stepA, y + (seeded(seedBase + i * 8.4) - 0.5) * 0.08);
    const end = mid
      .clone()
      .add(new THREE.Vector3((seeded(seedBase + i * 9.2) - 0.5) * 0.26, (seeded(seedBase + i * 10.1) - 0.5) * 0.2, (seeded(seedBase + i * 11.6) - 0.5) * 0.18));

    vertices.push(start.x, start.y, start.z, mid.x, mid.y, mid.z);
    if (seeded(seedBase + i * 12.2) > 0.36) {
      vertices.push(mid.x, mid.y, mid.z, end.x, end.y, end.z);
    }
    if (seeded(seedBase + i * 13.3) > 0.72) {
      const branch = end.clone().add(new THREE.Vector3((seeded(seedBase + i * 14.4) - 0.5) * 0.34, 0, (seeded(seedBase + i * 15.5) - 0.5) * 0.3));
      vertices.push(end.x, end.y, end.z, branch.x, branch.y, branch.z);
    }
  }
  return new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
}

export default function HologramFragments({ activity }: HologramFragmentsProps) {
  const group = useRef<THREE.Group>(null);
  const layers = useMemo(() => {
    return Array.from({ length: 4 }, (_, index) => ({
      geometry: makeClusterGeometry(30 + index * 50, 58 + index * 16),
      material: new THREE.LineBasicMaterial({
        color: index === 2 ? HOT : index % 2 ? AMBER : GOLD,
        transparent: true,
        opacity: 0.18 + seeded(index * 6.7) * 0.2,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      }),
      rotation: [seeded(index) * 0.4, seeded(index * 2) * 0.5, seeded(index * 3) * Math.PI] as [number, number, number],
      speed: (0.025 + seeded(index * 4.1) * 0.08) * (index % 2 ? -1 : 1)
    }));
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const boost = activity === "idle" ? 1 : activity === "listening" ? 1.22 : activity === "thinking" ? 1.55 : 1.72;
    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.08) * 0.08;
      group.current.rotation.z = Math.sin(t * 0.06) * 0.035;
    }
    layers.forEach((layer, index) => {
      layer.material.opacity = Math.min(0.54, (0.12 + seeded(index * 6.7) * 0.18) * boost * (0.75 + Math.sin(t * (0.6 + index * 0.11)) * 0.25));
    });
  });

  return (
    <group ref={group}>
      {layers.map((layer, index) => (
        <lineSegments key={index} geometry={layer.geometry} material={layer.material} rotation={layer.rotation} />
      ))}
    </group>
  );
}
