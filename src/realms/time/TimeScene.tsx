import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AiActivity } from "../../App";
import { activityEnergy, activityPulse, activitySpeed, pathGeometry, seededRandom, segmentGeometry } from "../shared/coreMotion";

const GREEN = "#23e777";
const EMERALD = "#66ff9f";
const PALE = "#e0ffea";

function makeEyeGeometry(scale = 1, z = 0) {
  const upper: THREE.Vector3[] = [];
  const lower: THREE.Vector3[] = [];
  for (let index = 0; index <= 72; index += 1) {
    const x = -1.75 + index / 72 * 3.5;
    const normalized = x / 1.75;
    const arch = Math.pow(Math.max(0, 1 - normalized * normalized), 0.58) * 0.76;
    upper.push(new THREE.Vector3(x * scale, arch * scale, z));
    lower.push(new THREE.Vector3(x * scale, -arch * scale, z));
  }
  return pathGeometry([upper, lower]);
}

function AgamottoEye({ activity }: { activity: AiActivity }) {
  const root = useRef<THREE.Group>(null);
  const iris = useRef<THREE.Group>(null);
  const stone = useRef<THREE.Mesh>(null);
  const eyeGeometry = useMemo(() => makeEyeGeometry(), []);
  const innerEyeGeometry = useMemo(() => makeEyeGeometry(0.82, 0.12), []);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);
    if (root.current) {
      root.current.scale.set(activityPulse(activity, time), activity === "listening" ? 0.88 : 1, 1);
      root.current.rotation.y = Math.sin(time * 0.22) * 0.14;
    }
    if (iris.current) {
      iris.current.rotation.z += delta * (activity === "thinking" ? -0.62 : 0.12) * speed;
      iris.current.scale.setScalar(activity === "listening" ? 0.72 : activity === "thinking" ? 1.12 : 0.92);
    }
    if (stone.current) {
      stone.current.rotation.y += delta * 1.1 * speed;
      stone.current.rotation.x = Math.sin(time * 0.72) * 0.28;
      stone.current.scale.setScalar(0.92 + activityEnergy(activity) * 0.08 + Math.sin(time * 6.2) * 0.04);
    }
  });

  return (
    <group ref={root}>
      <lineSegments geometry={eyeGeometry}>
        <lineBasicMaterial color={PALE} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.9} toneMapped={false} transparent />
      </lineSegments>
      <lineSegments geometry={innerEyeGeometry}>
        <lineBasicMaterial color={GREEN} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.58} toneMapped={false} transparent />
      </lineSegments>
      <group ref={iris} position={[0, 0, 0.12]}>
        {Array.from({ length: 12 }, (_, index) => {
          const angle = index * Math.PI * 2 / 12;
          return (
            <mesh key={index} position={[Math.cos(angle) * 0.48, Math.sin(angle) * 0.48, 0]} rotation={[0.18, 0, angle]}>
              <boxGeometry args={[0.42, 0.075, 0.055]} />
              <meshStandardMaterial color="#082f1a" emissive={index % 3 === 0 ? PALE : GREEN} emissiveIntensity={0.88} metalness={0.76} roughness={0.22} />
            </mesh>
          );
        })}
      </group>
      <mesh ref={stone} position={[0, 0, 0.26]} scale={[0.72, 1, 0.72]}>
        <octahedronGeometry args={[0.24, 1]} />
        <meshStandardMaterial color="#0a8f45" emissive={EMERALD} emissiveIntensity={2.2} metalness={0.24} roughness={0.08} toneMapped={false} />
      </mesh>
      <pointLight color={GREEN} intensity={1.2} distance={3.6} decay={2} />
    </group>
  );
}

function ChronalMechanism({ activity }: { activity: AiActivity }) {
  const groupRef = useRef<THREE.Group>(null);
  const geometry = useMemo(() => {
    const segments: Array<[THREE.Vector3, THREE.Vector3]> = [];
    const layers = [
      { radiusX: 1.08, radiusY: 0.9, start: 0.1, arc: 1.55 },
      { radiusX: 1.4, radiusY: 1.08, start: 2.35, arc: 1.26 },
      { radiusX: 1.75, radiusY: 1.28, start: 4.2, arc: 1.42 },
      { radiusX: 2.1, radiusY: 1.48, start: 0.72, arc: 1.08 },
    ];
    layers.forEach((layer, layerIndex) => {
      const z = -0.08 - layerIndex * 0.12;
      for (let index = 0; index < 54; index += 1) {
        const a = layer.start + index / 54 * layer.arc;
        const b = layer.start + (index + 1) / 54 * layer.arc;
        segments.push([
          new THREE.Vector3(Math.cos(a) * layer.radiusX, Math.sin(a) * layer.radiusY, z),
          new THREE.Vector3(Math.cos(b) * layer.radiusX, Math.sin(b) * layer.radiusY, z),
        ]);
      }
      for (let tooth = 0; tooth < 9; tooth += 1) {
        const angle = layer.start + tooth / 8 * layer.arc;
        const inner = new THREE.Vector3(Math.cos(angle) * layer.radiusX, Math.sin(angle) * layer.radiusY, z);
        const outer = new THREE.Vector3(Math.cos(angle) * (layer.radiusX + 0.14), Math.sin(angle) * (layer.radiusY + 0.1), z);
        segments.push([inner, outer]);
      }
    });
    return segmentGeometry(segments);
  }, []);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const direction = activity === "thinking" ? -1 : 1;
    groupRef.current.rotation.z += delta * 0.09 * activitySpeed(activity) * direction;
    groupRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.17) * 0.1;
  });

  return (
    <group ref={groupRef} rotation={[0.08, -0.12, 0]}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color={GREEN} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.42} toneMapped={false} transparent />
      </lineSegments>
    </group>
  );
}

function TimelineBranches({ activity }: { activity: AiActivity }) {
  const root = useRef<THREE.Group>(null);
  const geometry = useMemo(() => {
    const paths: THREE.Vector3[][] = [];
    for (let branch = 0; branch < 7; branch += 1) {
      const points: THREE.Vector3[] = [];
      const side = branch % 2 === 0 ? 1 : -1;
      for (let index = 0; index <= 36; index += 1) {
        const t = index / 36;
        points.push(new THREE.Vector3(
          side * (0.32 + t * (1.1 + branch * 0.13)),
          (branch - 3) * 0.18 + Math.sin(t * Math.PI * 1.6 + branch) * 0.28,
          -0.28 - t * 0.7 + Math.sin(t * Math.PI) * 0.2,
        ));
      }
      paths.push(points);
    }
    return pathGeometry(paths);
  }, []);

  useFrame(({ clock }) => {
    if (!root.current) return;
    root.current.scale.x = 0.88 + activityEnergy(activity) * 0.18;
    root.current.position.z = Math.sin(clock.elapsedTime * 0.4) * 0.08;
  });

  return (
    <group ref={root}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color={EMERALD} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.38} toneMapped={false} transparent />
      </lineSegments>
    </group>
  );
}

function TemporalEchoes({ activity }: { activity: AiActivity }) {
  const root = useRef<THREE.Group>(null);
  const echoGeometry = useMemo(() => makeEyeGeometry(1.06), []);
  useFrame(({ clock }) => {
    if (!root.current) return;
    const time = clock.elapsedTime;
    root.current.children.forEach((child, index) => {
      child.position.x = Math.sin(time * 0.52 + index * 1.7) * (0.12 + index * 0.07);
      child.position.y = Math.cos(time * 0.38 + index) * 0.05;
      child.position.z = -0.38 - index * 0.3;
      child.scale.setScalar(1 + index * 0.15 + (activity === "thinking" ? Math.sin(time * 2 + index) * 0.08 : 0));
    });
  });
  return (
    <group ref={root}>
      {[0, 1, 2].map((index) => (
        <lineSegments geometry={echoGeometry} key={index}>
          <lineBasicMaterial color={index === 0 ? GREEN : EMERALD} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.14 - index * 0.025} toneMapped={false} transparent />
        </lineSegments>
      ))}
    </group>
  );
}

function EldritchGlyphField({ activity }: { activity: AiActivity }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const glyphs = useMemo(() => {
    const random = seededRandom(731);
    return Array.from({ length: 84 }, (_, index) => {
      const t = index / 84;
      const angle = t * Math.PI * 5.2;
      return {
        angle,
        radius: 1.48 + t * 1.25,
        y: (t - 0.5) * 3.3 + (random() - 0.5) * 0.18,
        z: -0.6 + Math.sin(angle * 0.45) * 0.52,
        phase: random() * Math.PI * 2,
      };
    });
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);
    glyphs.forEach((glyph, index) => {
      const angle = glyph.angle + time * 0.055 * speed;
      dummy.position.set(Math.cos(angle) * glyph.radius, glyph.y, glyph.z + Math.sin(time + glyph.phase) * 0.08);
      dummy.rotation.set(0, -angle, angle * 0.3);
      const flicker = 0.75 + Math.sin(time * 4.4 + glyph.phase) * 0.22;
      dummy.scale.set(0.065 * flicker, 0.018, 0.018);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(index, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, glyphs.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={PALE} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.62} toneMapped={false} transparent />
    </instancedMesh>
  );
}

function EldritchSparks({ activity }: { activity: AiActivity }) {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const random = seededRandom(905);
    const values = new Float32Array(360 * 3);
    for (let index = 0; index < 360; index += 1) {
      const angle = random() * Math.PI * 2;
      const radius = 1.1 + random() * 2.2;
      values[index * 3] = Math.cos(angle) * radius;
      values[index * 3 + 1] = Math.sin(angle) * radius * 0.62;
      values[index * 3 + 2] = (random() - 0.5) * 2.4;
    }
    return values;
  }, []);
  useFrame((_, delta) => {
    if (pointsRef.current) pointsRef.current.rotation.z -= delta * 0.04 * activitySpeed(activity);
  });
  return (
    <points ref={pointsRef}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial color={EMERALD} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.45} size={0.025} sizeAttenuation toneMapped={false} transparent />
    </points>
  );
}

export interface TimeSceneProps { activity?: AiActivity }

export function TimeScene({ activity = "idle" }: TimeSceneProps) {
  return (
    <group name="agamotto-temporal-oracle" scale={0.94}>
      <TemporalEchoes activity={activity} />
      <TimelineBranches activity={activity} />
      <ChronalMechanism activity={activity} />
      <EldritchGlyphField activity={activity} />
      <EldritchSparks activity={activity} />
      <AgamottoEye activity={activity} />
    </group>
  );
}
