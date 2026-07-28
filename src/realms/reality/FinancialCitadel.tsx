import React, { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FinancialCitadelProps {
  activity: "idle" | "listening" | "thinking" | "speaking";
}

const COLUMN_COUNT = 14;
const SPIRE_COUNT = 9;
const BRIDGE_PLATE_COUNT = 11;

export const FinancialCitadel: React.FC<FinancialCitadelProps> = ({ activity }) => {
  const citadelRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Group>(null);
  const crownRef = useRef<THREE.Group>(null);
  const columnsRef = useRef<THREE.InstancedMesh>(null);
  const capitalsRef = useRef<THREE.InstancedMesh>(null);
  const spiresRef = useRef<THREE.InstancedMesh>(null);
  const platesRef = useRef<THREE.InstancedMesh>(null);

  const columnTransforms = useMemo(() => {
    return Array.from({ length: COLUMN_COUNT }, (_, index) => {
      const angle = (index / COLUMN_COUNT) * Math.PI * 2;
      const radius = index % 2 === 0 ? 3.55 : 3.34;
      const height = 1.55 + (index % 4) * 0.18;
      return { angle, radius, height };
    });
  }, []);

  useLayoutEffect(() => {
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    const position = new THREE.Vector3();

    columnTransforms.forEach(({ angle, radius, height }, index) => {
      position.set(Math.cos(angle) * radius, -1.45 + height * 0.5, Math.sin(angle) * radius);
      quaternion.setFromEuler(new THREE.Euler(0, -angle, 0));
      scale.set(1, height, 1);
      matrix.compose(position, quaternion, scale);
      columnsRef.current?.setMatrixAt(index, matrix);

      position.y = -1.45 + height + 0.09;
      scale.set(1, 1, 1);
      matrix.compose(position, quaternion, scale);
      capitalsRef.current?.setMatrixAt(index, matrix);
    });

    for (let index = 0; index < SPIRE_COUNT; index += 1) {
      const angle = (index / SPIRE_COUNT) * Math.PI * 2 + Math.PI / 9;
      const radius = 1.7 + (index % 2) * 0.28;
      const height = 1.2 + (index % 3) * 0.38;
      position.set(Math.cos(angle) * radius, 0.25 + height * 0.5, Math.sin(angle) * radius - 0.18);
      quaternion.setFromEuler(new THREE.Euler(0, -angle, 0));
      scale.set(0.72, height, 0.72);
      matrix.compose(position, quaternion, scale);
      spiresRef.current?.setMatrixAt(index, matrix);
    }

    for (let index = 0; index < BRIDGE_PLATE_COUNT; index += 1) {
      position.set(0, -1.34, 1.75 + index * 0.34);
      quaternion.identity();
      scale.set(1 - index * 0.025, 1, 1);
      matrix.compose(position, quaternion, scale);
      platesRef.current?.setMatrixAt(index, matrix);
    }

    [columnsRef, capitalsRef, spiresRef, platesRef].forEach((ref) => {
      if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
    });
  }, [columnTransforms]);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const speed = activity === "thinking" ? 2.5 : activity === "speaking" ? 1.9 : activity === "listening" ? 0.55 : 1;
    const energy = activity === "speaking" ? 1.36 : activity === "thinking" ? 1.18 : 1;

    if (citadelRef.current) {
      citadelRef.current.position.y = Math.sin(time * 0.48) * 0.045;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.28 * speed;
      coreRef.current.rotation.z = Math.sin(time * 0.37) * 0.18;
      coreRef.current.scale.setScalar(energy + Math.sin(time * 3.2) * 0.025);
    }
    if (crownRef.current) {
      crownRef.current.rotation.y -= delta * 0.055 * speed;
      crownRef.current.rotation.x = Math.sin(time * 0.2) * 0.06;
    }
  });

  return (
    <group ref={citadelRef} name="asgardian-olympus-citadel" position={[0, -0.18, 0]}>
      {/* Greek layer: marble-red colonnade and angular capitals. */}
      <instancedMesh ref={columnsRef} args={[undefined, undefined, COLUMN_COUNT]}>
        <cylinderGeometry args={[0.14, 0.19, 1, 10]} />
        <meshStandardMaterial color="#220608" metalness={0.58} roughness={0.3} emissive="#9f1239" emissiveIntensity={0.22} />
      </instancedMesh>
      <instancedMesh ref={capitalsRef} args={[undefined, undefined, COLUMN_COUNT]}>
        <boxGeometry args={[0.52, 0.16, 0.42]} />
        <meshStandardMaterial color="#8b3923" metalness={0.75} roughness={0.24} emissive="#ef2b2d" emissiveIntensity={0.24} />
      </instancedMesh>

      {/* Asgard layer: crown spires combine palace silhouettes with myth-tech. */}
      <instancedMesh ref={spiresRef} args={[undefined, undefined, SPIRE_COUNT]}>
        <coneGeometry args={[0.38, 1, 5]} />
        <meshStandardMaterial color="#250405" metalness={0.9} roughness={0.16} emissive="#ff2d1a" emissiveIntensity={0.42} />
      </instancedMesh>
      <mesh position={[0, -0.78, -0.15]}>
        <cylinderGeometry args={[2.65, 3.05, 1.05, 12]} />
        <meshStandardMaterial color="#0d0102" metalness={0.82} roughness={0.25} emissive="#5f0711" emissiveIntensity={0.32} />
      </mesh>
      <mesh position={[0, -0.2, -0.15]} rotation={[0, Math.PI / 12, 0]}>
        <cylinderGeometry args={[1.32, 2.18, 0.34, 12]} />
        <meshStandardMaterial color="#3d0909" metalness={0.86} roughness={0.2} emissive="#dc2626" emissiveIntensity={0.34} />
      </mesh>

      {/* Olympus pediment: the triangular divine council crown. */}
      <mesh position={[0, 0.4, 0.18]} rotation={[Math.PI / 2, 0, Math.PI / 6]} scale={[1.75, 1.75, 0.28]}>
        <coneGeometry args={[1, 0.28, 3]} />
        <meshStandardMaterial color="#6b2818" metalness={0.72} roughness={0.25} emissive="#f97316" emissiveIntensity={0.36} />
      </mesh>

      {/* Bifrost layer: luminous stepped causeway from viewer to temple. */}
      <instancedMesh ref={platesRef} args={[undefined, undefined, BRIDGE_PLATE_COUNT]}>
        <boxGeometry args={[1.48, 0.055, 0.22]} />
        <meshBasicMaterial color="#ff3c17" transparent opacity={0.48} />
      </instancedMesh>
      <mesh position={[0, -1.4, 3.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.72, 4.2]} />
        <meshBasicMaterial color="#5a0a0a" transparent opacity={0.2} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {/* Divine reactor: Mjolnir lightning core inside an armillary crown. */}
      <group ref={coreRef} position={[0, 1.08, 0.05]}>
        <mesh>
          <icosahedronGeometry args={[0.42, 1]} />
          <meshStandardMaterial color="#fff0c2" emissive="#ff2100" emissiveIntensity={3.2} roughness={0.18} metalness={0.62} />
        </mesh>
        {[0.82, 1.12, 1.42].map((radius, index) => (
          <mesh key={radius} rotation={[index * 0.84, index * 0.58, index * 0.42]}>
            <torusGeometry args={[radius, index === 0 ? 0.04 : 0.025, 8, 64]} />
            <meshBasicMaterial color={index === 1 ? "#fbbf24" : "#ff3018"} transparent opacity={0.72 - index * 0.16} />
          </mesh>
        ))}
      </group>

      {/* Nine-realm rune crown above the palace. */}
      <group ref={crownRef} position={[0, 1.15, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.08, 0.018, 6, 72]} />
          <meshBasicMaterial color="#ffb020" transparent opacity={0.34} />
        </mesh>
        {Array.from({ length: 9 }, (_, index) => {
          const angle = (index / 9) * Math.PI * 2;
          return (
            <mesh key={index} position={[Math.cos(angle) * 2.08, 0, Math.sin(angle) * 2.08]} rotation={[0, -angle, Math.PI / 4]}>
              <octahedronGeometry args={[0.115, 0]} />
              <meshBasicMaterial color="#ff4b1f" transparent opacity={0.78} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};
