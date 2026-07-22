import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AiActivity } from "../../types/orb";
import { LivingOrb } from "../../core/LivingOrb";

const TAU = Math.PI * 2;

function circuitGeometry() {
  const points: THREE.Vector3[] = [];
  for (let index = 0; index < 18; index += 1) {
    const angle = (index / 18) * TAU;
    const a = new THREE.Vector3(Math.cos(angle) * 1.3, Math.sin(angle) * 1.3, 0);
    const b = new THREE.Vector3(Math.cos(angle) * (1.62 + (index % 3) * 0.16), Math.sin(angle) * (1.62 + (index % 3) * 0.16), 0);
    const c = b.clone().add(new THREE.Vector3(-Math.sin(angle), Math.cos(angle), 0).multiplyScalar(index % 2 ? 0.24 : -0.24));
    points.push(a, b, b, c);
  }
  return new THREE.BufferGeometry().setFromPoints(points);
}

export function ArcCoreScene({ activity }: { activity: AiActivity }) {
  const root = useRef<THREE.Group>(null);
  const aperture = useRef<THREE.Group>(null);
  const armor = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const circuits = useMemo(circuitGeometry, []);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const speed = activity === "speaking" ? 2.2 : activity === "thinking" ? 1.6 : activity === "listening" ? 0.57 : 1;
    if (root.current) root.current.rotation.y += delta * 0.036 * speed;
    if (aperture.current) {
      aperture.current.rotation.z += delta * 0.22 * speed;
      aperture.current.scale.setScalar(activity === "thinking" ? 0.84 + Math.sin(t * 4.2) * 0.035 : 1);
    }
    if (armor.current) armor.current.rotation.z -= delta * 0.075 * speed;
    if (core.current) {
      const output = activity === "speaking" ? Math.sin(t * 9) * 0.14 : Math.sin(t * 1.5) * 0.045;
      core.current.scale.setScalar(1 + output);
    }
  });

  return (
    <LivingOrb activity={activity} color="#ff861c" accent="#d8fbff">
      <group ref={root} scale={0.94} rotation={[0.12, 0.18, 0]}>
        <group ref={armor}>
          {[1.38, 1.74, 2.18].map((radius, index) => (
            <mesh key={radius} rotation={[index === 1 ? Math.PI / 2 : Math.PI / 3, index * 0.42, index * 0.25]}>
              <torusGeometry args={[radius, index === 1 ? 0.035 : 0.015, 6, index === 2 ? 12 : 96]} />
              <meshBasicMaterial blending={THREE.AdditiveBlending} color={index === 1 ? "#bdf5ff" : "#ff7a16"} depthWrite={false} opacity={0.58 - index * 0.09} toneMapped={false} transparent />
            </mesh>
          ))}
        </group>
        <lineSegments geometry={circuits} position={[0, 0, 0.12]}>
          <lineBasicMaterial blending={THREE.AdditiveBlending} color="#ff9a32" depthWrite={false} opacity={0.78} toneMapped={false} transparent />
        </lineSegments>
        <group ref={aperture} position={[0, 0, 0.2]}>
          {Array.from({ length: 12 }, (_, index) => {
            const angle = (index / 12) * TAU;
            return (
              <mesh key={index} position={[Math.cos(angle) * 0.78, Math.sin(angle) * 0.78, 0]} rotation={[0, 0, angle - Math.PI / 2]}>
                <boxGeometry args={[0.32, index % 3 === 0 ? 0.58 : 0.45, 0.055]} />
                <meshBasicMaterial blending={THREE.AdditiveBlending} color={index % 3 === 0 ? "#e6fcff" : "#ff9a39"} depthWrite={false} opacity={0.72} toneMapped={false} transparent wireframe />
              </mesh>
            );
          })}
        </group>
        {[0.48, 0.6, 1.08].map((radius, index) => (
          <mesh key={radius} position={[0, 0, 0.24 - index * 0.04]}>
            <ringGeometry args={[radius, radius + (index === 2 ? 0.035 : 0.025), index === 2 ? 12 : 64]} />
            <meshBasicMaterial blending={THREE.AdditiveBlending} color={index === 1 ? "#dffcff" : "#ff8a1e"} depthWrite={false} opacity={0.74} side={THREE.DoubleSide} toneMapped={false} transparent />
          </mesh>
        ))}
        <mesh ref={core} position={[0, 0, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.29, 0.29, 0.12, 12]} />
          <meshBasicMaterial color="#f1ffff" toneMapped={false} />
        </mesh>
        <pointLight color="#ff861c" distance={6} intensity={2.4} />
      </group>
    </LivingOrb>
  );
}
