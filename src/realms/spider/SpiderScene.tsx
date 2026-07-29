import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import type { AiActivity } from "../../App";
import { OrbEnergyField } from "../shared/OrbEnergyField";

const CYAN = new THREE.Color("#62efff");
const ICE = new THREE.Color("#d9fbff");
const WEB_RADIUS = 2.48;
const SPOKES = 8;
const RINGS = 6;
const WEB_PLANES = [
  new THREE.Euler(0, 0, 0),
  new THREE.Euler(Math.PI / 2, 0, Math.PI / 8),
  new THREE.Euler(0, Math.PI / 2, -Math.PI / 8),
];

function buildWebGeometry() {
  const positions: number[] = [];
  const colors: number[] = [];
  const addSegment = (a: THREE.Vector3, b: THREE.Vector3, color: THREE.Color) => {
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    colors.push(color.r, color.g, color.b, color.r, color.g, color.b);
  };

  WEB_PLANES.forEach((rotation, planeIndex) => {
    for (let spoke = 0; spoke < SPOKES; spoke += 1) {
      const angle = (spoke / SPOKES) * Math.PI * 2 + planeIndex * 0.12;
      const start = new THREE.Vector3(Math.cos(angle) * 0.42, Math.sin(angle) * 0.42, 0).applyEuler(rotation);
      const end = new THREE.Vector3(Math.cos(angle) * WEB_RADIUS, Math.sin(angle) * WEB_RADIUS, 0).applyEuler(rotation);
      addSegment(start, end, spoke % 4 === 0 ? ICE : CYAN);
    }

    for (let ring = 1; ring <= RINGS; ring += 1) {
      const radius = 0.46 + (ring / RINGS) * (WEB_RADIUS - 0.46);
      for (let spoke = 0; spoke < SPOKES; spoke += 1) {
        const angleA = (spoke / SPOKES) * Math.PI * 2 + planeIndex * 0.12 + ring * 0.035;
        const angleB = ((spoke + 1) / SPOKES) * Math.PI * 2 + planeIndex * 0.12 + ring * 0.035;
        const warpA = Math.sin(spoke * 2.1 + ring * 0.9) * 0.035;
        const warpB = Math.sin((spoke + 1) * 2.1 + ring * 0.9) * 0.035;
        const a = new THREE.Vector3(Math.cos(angleA) * radius, Math.sin(angleA) * radius, warpA).applyEuler(rotation);
        const b = new THREE.Vector3(Math.cos(angleB) * radius, Math.sin(angleB) * radius, warpB).applyEuler(rotation);
        addSegment(a, b, ring === RINGS ? ICE : CYAN);
      }
    }
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  return geometry;
}

function SpiderWeb({ activity }: { activity: AiActivity }) {
  const webRef = useRef<THREE.LineSegments>(null);
  const geometry = useMemo(buildWebGeometry, []);

  useFrame(({ clock }, delta) => {
    if (!webRef.current) return;
    const speed = activity === "thinking" ? 0.13 : activity === "speaking" ? 0.1 : 0.045;
    webRef.current.rotation.y += delta * speed;
    webRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.19) * 0.12;
  });

  return (
    <lineSegments ref={webRef} geometry={geometry}>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={activity === "listening" ? 0.5 : 0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </lineSegments>
  );
}

function SpiderLegs({ activity }: { activity: AiActivity }) {
  const groupRef = useRef<THREE.Group>(null);
  const geometries = useMemo(
    () =>
      Array.from({ length: SPOKES }, (_, index) => {
        const angle = (index / SPOKES) * Math.PI * 2;
        const direction = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0);
        const side = index % 2 === 0 ? 1 : -1;
        const curve = new THREE.CatmullRomCurve3([
          direction.clone().multiplyScalar(0.34).setZ(side * 0.06),
          direction.clone().multiplyScalar(0.82).add(new THREE.Vector3(0, 0, side * 0.24)),
          direction.clone().multiplyScalar(1.42).add(new THREE.Vector3(0, 0, side * 0.4)),
          direction.clone().multiplyScalar(2.08).add(new THREE.Vector3(0, 0, side * 0.1)),
        ]);
        return new THREE.TubeGeometry(curve, 28, index % 2 === 0 ? 0.022 : 0.015, 5, false);
      }),
    [],
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const pulse = activity === "speaking" ? 1 + Math.sin(clock.elapsedTime * 6.5) * 0.035 : 1;
    groupRef.current.scale.setScalar(pulse);
    groupRef.current.rotation.z = -clock.elapsedTime * (activity === "thinking" ? 0.075 : 0.028);
  });

  return (
    <group ref={groupRef}>
      {geometries.map((geometry, index) => (
        <mesh key={index} geometry={geometry}>
          <meshBasicMaterial
            color={index % 3 === 0 ? "#ff315f" : "#8ff7ff"}
            transparent
            opacity={index % 3 === 0 ? 0.78 : 0.62}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function SignalPackets({ activity }: { activity: AiActivity }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = 32;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const stateSpeed = activity === "thinking" ? 1.75 : activity === "speaking" ? 2.2 : activity === "listening" ? 0.68 : 1;
    for (let index = 0; index < count; index += 1) {
      const spoke = index % SPOKES;
      const phase = (clock.elapsedTime * 0.19 * stateSpeed + index * 0.137) % 1;
      const angle = (spoke / SPOKES) * Math.PI * 2 + Math.floor(index / SPOKES) * Math.PI / 12;
      const radius = 0.48 + phase * (WEB_RADIUS - 0.48);
      const plane = Math.floor(index / 11) % WEB_PLANES.length;
      dummy.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, Math.sin(phase * Math.PI) * 0.045);
      dummy.position.applyEuler(WEB_PLANES[plane]);
      dummy.scale.setScalar(index % 7 === 0 ? 1.55 : 0.72 + Math.sin(phase * Math.PI) * 0.45);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(index, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.038, 7, 7]} />
      <meshBasicMaterial color="#bdf9ff" toneMapped={false} />
    </instancedMesh>
  );
}

function SpiderCore({ activity }: { activity: AiActivity }) {
  const coreRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!coreRef.current) return;
    const pulseRate = activity === "speaking" ? 5.4 : activity === "thinking" ? 2.7 : 1.2;
    const pulseSize = activity === "speaking" ? 0.09 : 0.035;
    coreRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * pulseRate) * pulseSize);
    coreRef.current.rotation.y = clock.elapsedTime * 0.28;
  });

  return (
    <group ref={coreRef}>
      <mesh>
        <icosahedronGeometry args={[0.48, 3]} />
        <meshPhysicalMaterial
          color="#02070a"
          emissive="#0b7788"
          emissiveIntensity={1.8}
          roughness={0.22}
          metalness={0.76}
          clearcoat={1}
          clearcoatRoughness={0.18}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.57, 2]} />
        <meshBasicMaterial color="#9cfaff" wireframe transparent opacity={0.72} toneMapped={false} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[0.7, 0.018, 6, 64]} />
        <meshBasicMaterial color="#ff315f" transparent opacity={0.78} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function SpiderScene({ activity = "idle" }: { activity?: AiActivity }) {
  return (
    <group name="spider-neural-orb">
      <ambientLight intensity={0.08} color="#2de3ff" />
      <pointLight position={[0, 0, 2.1]} color="#63efff" intensity={1.5} distance={7} decay={2} />
      <OrbEnergyField activity={activity} color="#127c91" hotColor="#c8fbff" radius={2.3} particleCount={320} opacity={0.32} />
      <SpiderWeb activity={activity} />
      <SpiderLegs activity={activity} />
      <SignalPackets activity={activity} />
      <SpiderCore activity={activity} />
      <fog attach="fog" args={["#000408", 7, 19]} />
    </group>
  );
}
