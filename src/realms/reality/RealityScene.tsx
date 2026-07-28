import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FinancialCitadel } from "./FinancialCitadel";

interface RealitySceneProps {
  activity?: "idle" | "listening" | "thinking" | "speaking";
}

function seeded(index: number, salt: number) {
  return Math.abs(Math.sin(index * 91.733 + salt * 37.19) * 43758.5453) % 1;
}

function CosmicEmbers({ activity }: RealitySceneProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 360;
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = 4.8 + seeded(i, 1) * 9;
      const theta = seeded(i, 2) * Math.PI * 2;
      const y = (seeded(i, 3) - 0.5) * 10;
      data[i * 3] = Math.cos(theta) * radius;
      data[i * 3 + 1] = y;
      data[i * 3 + 2] = Math.sin(theta) * radius - 3;
    }
    return data;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const multiplier = activity === "thinking" ? 2.1 : activity === "speaking" ? 1.6 : 1;
    pointsRef.current.rotation.y = clock.elapsedTime * 0.018 * multiplier;
    pointsRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.08) * 0.025;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ff3b18"
        size={0.045}
        transparent
        opacity={0.58}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function YggdrasilConstellation() {
  const geometry = useMemo(() => {
    const branches = [
      [[0, -2.5, -3.4], [0, 3.8, -3.4]],
      [[0, 2.2, -3.4], [-2.5, 4.5, -3.7]],
      [[0, 2.2, -3.4], [2.5, 4.5, -3.7]],
      [[0, 1.2, -3.4], [-3.4, 2.7, -4]],
      [[0, 1.2, -3.4], [3.4, 2.7, -4]],
      [[0, -2.2, -3.4], [-2.6, -4.1, -3.8]],
      [[0, -2.2, -3.4], [2.6, -4.1, -3.8]],
    ];
    const points = branches.flatMap((branch) => branch.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#ff6a1a" transparent opacity={0.19} blending={THREE.AdditiveBlending} />
    </lineSegments>
  );
}

export const RealityScene: React.FC<RealitySceneProps> = ({ activity = "idle" }) => {
  const celestialRef = useRef<THREE.Group>(null);
  const stormRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    const speed = activity === "thinking" ? 2.4 : activity === "speaking" ? 1.8 : activity === "listening" ? 0.55 : 1;
    if (celestialRef.current) {
      celestialRef.current.rotation.z += delta * 0.018 * speed;
      celestialRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.12) * 0.08;
    }
    if (stormRef.current) {
      const pulse = activity === "speaking" ? 1.18 + Math.sin(clock.elapsedTime * 6) * 0.12 : 1;
      stormRef.current.scale.setScalar(pulse);
      stormRef.current.rotation.y -= delta * 0.08 * speed;
    }
  });

  return (
    <group name="reality-asgardian-olympus">
      <ambientLight intensity={0.13} color="#9f1239" />
      <directionalLight position={[4, 8, 5]} intensity={0.82} color="#ffd4a3" />
      <pointLight position={[0, 2.2, 1.8]} intensity={2.8} color="#ff2400" distance={13} decay={2} />

      {/* Layer 01: distant cosmos and the World Tree constellation. */}
      <CosmicEmbers activity={activity} />
      <YggdrasilConstellation />

      {/* Layer 02: celestial armillary / nine-realm rune cage. */}
      <group ref={celestialRef} position={[0, 0.35, -1.1]}>
        {[3.6, 4.25, 5.05].map((radius, index) => (
          <mesh key={radius} rotation={[index * 0.72, index * 0.48, index * 0.31]}>
            <torusGeometry args={[radius, index === 0 ? 0.035 : 0.018, 8, 96]} />
            <meshBasicMaterial
              color={index === 1 ? "#fbbf24" : "#ef2b2d"}
              transparent
              opacity={0.3 - index * 0.055}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[5.45, 5.52, 48]} />
          <meshBasicMaterial color="#ff421d" transparent opacity={0.16} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Layer 03–05: Olympus colonnade, Asgardian spires and divine reactor. */}
      <FinancialCitadel activity={activity} />

      {/* Layer 06: foreground storm seal and Bifrost landing glyph. */}
      <group ref={stormRef} position={[0, -2.55, 0.35]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <ringGeometry args={[2.25, 2.31, 12]} />
          <meshBasicMaterial color="#ff351e" transparent opacity={0.42} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 12]}>
          <ringGeometry args={[2.72, 2.77, 6]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
      </group>

      <fog attach="fog" args={["#090001", 7.5, 24]} />
    </group>
  );
};
