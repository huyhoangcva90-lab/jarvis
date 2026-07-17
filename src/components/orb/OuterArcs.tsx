import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { makeArcGeometry } from "./geometry";
import { AMBER, GOLD, additiveLine, seeded } from "./materials";

export default function OuterArcs() {
  const refs = useRef<Array<THREE.LineSegments | null>>([]);
  const arcs = useMemo(() => {
    return Array.from({ length: 4 }, (_, index) => {
      const rot = new THREE.Euler(-0.55 + index * 0.36, 0.35 - index * 0.22, index * 0.55);
      return {
        geometry: makeArcGeometry(3.12 + index * 0.22, 0.42 + seeded(index * 3.2) * 0.3, seeded(index) * Math.PI * 2, Math.PI * (0.38 + seeded(index * 6.1) * 0.34), rot, 120),
        material: additiveLine(index % 2 ? AMBER : GOLD, 0.22 + seeded(index * 2.7) * 0.2),
        speed: (0.028 + seeded(index * 4.4) * 0.052) * (index % 2 ? -1 : 1),
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
      arcs[index].material.opacity = 0.18 + Math.sin(t * (0.55 + index * 0.15)) * 0.06;
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
