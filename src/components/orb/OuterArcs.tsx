import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { makeArcGeometry } from "./geometry";
import { AMBER, GOLD, additiveLine, seeded } from "./materials";

export default function OuterArcs() {
  const refs = useRef<Array<THREE.LineSegments | null>>([]);
  const arcs = useMemo(() => {
    return Array.from({ length: 10 }, (_, index) => {
      const rot = new THREE.Euler(-0.88 + index * 0.18, 0.56 - index * 0.12, index * 0.58 + seeded(index * 2.2));
      return {
        geometry: makeArcGeometry(2.24 + seeded(index * 5.4) * 1.28, 0.46 + seeded(index * 3.2) * 0.34, seeded(index) * Math.PI * 2, Math.PI * (0.32 + seeded(index * 6.1) * 0.86), rot, 132),
        material: additiveLine(index % 3 ? AMBER : GOLD, 0.26 + seeded(index * 2.7) * 0.28),
        speed: (0.04 + seeded(index * 4.4) * 0.08) * (index % 2 ? -1 : 1),
        base: rot
      };
    });
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    refs.current.forEach((arc, index) => {
      if (!arc) return;
      arc.rotation.z += arcs[index].speed * 0.01;
      arc.rotation.x = arcs[index].base.x + Math.sin(t * 0.1 + index) * 0.05;
      arcs[index].material.opacity = 0.18 + Math.sin(t * (0.55 + index * 0.15)) * 0.11;
    });
  });

  return (
    <group>
      {arcs.map((arc, index) => (
        <lineSegments
          key={index}
          ref={(node) => {
            refs.current[index] = node;
          }}
          geometry={arc.geometry}
          material={arc.material}
        />
      ))}
    </group>
  );
}
