import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AiActivity } from "../../types/orb";
import { LivingOrb } from "../../core/LivingOrb";
import { RealmAtmosphere } from "../../core/RealmAtmosphere";

const TAU = Math.PI * 2;

function rate(activity: AiActivity) {
  return activity === "speaking" ? 2 : activity === "thinking" ? 1.5 : activity === "listening" ? 0.55 : 1;
}

function RuneBand({ radius, count, rotation, color, reverse = false }: {
  radius: number;
  count: number;
  rotation: [number, number, number];
  color: string;
  reverse?: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const instances = useRef<THREE.InstancedMesh>(null);
  const geometry = useMemo(() => new THREE.TetrahedronGeometry(0.072, 0), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!instances.current) return;
    for (let index = 0; index < count; index += 1) {
      const angle = (index / count) * TAU;
      const broken = index % 7 === 0;
      dummy.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, Math.sin(index * 2.17) * 0.035);
      dummy.rotation.set(angle * 0.31, angle * 0.47, angle + Math.PI / 4);
      dummy.scale.set(broken ? 0.38 : index % 3 === 0 ? 1.22 : 0.72, index % 2 ? 0.42 : 0.78, 0.34);
      dummy.updateMatrix();
      instances.current.setMatrixAt(index, dummy.matrix);
    }
    instances.current.instanceMatrix.needsUpdate = true;
    return () => geometry.dispose();
  }, [count, dummy, geometry, radius]);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.z += delta * (reverse ? -0.055 : 0.04);
  });

  return (
    <group ref={group} rotation={rotation}>
      <mesh>
        <torusGeometry args={[radius, 0.011, 5, 160]} />
        <meshBasicMaterial blending={THREE.AdditiveBlending} color={color} depthWrite={false} opacity={0.48} toneMapped={false} transparent />
      </mesh>
      <instancedMesh ref={instances} args={[geometry, undefined, count]}>
        <meshBasicMaterial blending={THREE.AdditiveBlending} color={color} depthWrite={false} opacity={0.78} toneMapped={false} transparent />
      </instancedMesh>
    </group>
  );
}

function makeEye() {
  const points: THREE.Vector3[] = [];
  for (let index = 0; index < 64; index += 1) {
    const a = (index / 63) * Math.PI;
    const next = ((index + 1) / 63) * Math.PI;
    for (const sign of [-1, 1]) {
      points.push(new THREE.Vector3(Math.cos(a) * 0.94, Math.sin(a) * 0.34 * sign, 0));
      points.push(new THREE.Vector3(Math.cos(next) * 0.94, Math.sin(next) * 0.34 * sign, 0));
    }
  }
  return new THREE.BufferGeometry().setFromPoints(points);
}

function makeMandala() {
  const points: THREE.Vector3[] = [];
  for (let index = 0; index < 8; index += 1) {
    const a = (index / 8) * TAU;
    const b = a + TAU / 16;
    const c = a + TAU / 8;
    const inner = new THREE.Vector3(Math.cos(a) * 0.68, Math.sin(a) * 0.68, 0);
    const tip = new THREE.Vector3(Math.cos(b) * (index % 2 ? 1.22 : 1.44), Math.sin(b) * (index % 2 ? 1.22 : 1.44), 0);
    const end = new THREE.Vector3(Math.cos(c) * 0.68, Math.sin(c) * 0.68, 0);
    points.push(inner, tip, tip, end, end, inner);
  }
  return new THREE.BufferGeometry().setFromPoints(points);
}

export function MysticTimeCore({ activity }: { activity: AiActivity }) {
  const root = useRef<THREE.Group>(null);
  const mandala = useRef<THREE.LineSegments>(null);
  const aperture = useRef<THREE.Group>(null);
  const nodes = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const eyeGeometry = useMemo(makeEye, []);
  const mandalaGeometry = useMemo(makeMandala, []);

  useEffect(() => () => {
    eyeGeometry.dispose();
    mandalaGeometry.dispose();
  }, [eyeGeometry, mandalaGeometry]);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const speed = rate(activity);
    if (root.current) {
      root.current.rotation.y += delta * 0.035 * speed;
      root.current.rotation.x = 0.16 + Math.sin(t * 0.17) * 0.05;
    }
    if (mandala.current) mandala.current.rotation.z -= delta * 0.13 * speed;
    if (aperture.current) {
      aperture.current.rotation.z += delta * 0.21 * speed;
      const iris = activity === "thinking" ? 0.83 + Math.sin(t * 4) * 0.05 : activity === "speaking" ? 1.08 + Math.sin(t * 7) * 0.06 : 1;
      aperture.current.scale.setScalar(iris);
    }
    if (nodes.current) nodes.current.rotation.z += delta * 0.075 * speed;
    if (core.current) {
      const pulse = activity === "speaking" ? Math.sin(t * 8.5) * 0.15 : Math.sin(t * 1.4) * 0.045;
      core.current.scale.setScalar(1 + pulse);
    }
  });

  return (
    <LivingOrb activity={activity} color="#48ff91" accent="#eafff1">
      <RealmAtmosphere activity={activity} primary="#35f487" secondary="#8dffb6" hot="#f2fff5" variant="mystic" />
      <group ref={root} scale={0.9}>
        <RuneBand radius={2.42} count={36} rotation={[Math.PI / 3, 0.18, 0.1]} color="#32dd7b" />
        <RuneBand radius={2.12} count={28} rotation={[-Math.PI / 3, -0.22, -0.08]} color="#82ffaf" reverse />
        <RuneBand radius={1.82} count={24} rotation={[Math.PI / 2, 0.12, Math.PI / 2]} color="#25b96a" />

        <group ref={nodes}>
          {Array.from({ length: 8 }, (_, index) => {
            const angle = (index / 8) * TAU;
            return (
              <group key={index} position={[Math.cos(angle) * 1.58, Math.sin(angle) * 1.58, Math.sin(index) * 0.15]} rotation={[angle * 0.22, angle * 0.18, angle]}>
                <mesh><torusGeometry args={[0.18, 0.018, 5, 32]} /><meshBasicMaterial color="#79ffac" toneMapped={false} /></mesh>
                <mesh rotation={[Math.PI / 4, 0, 0]}><octahedronGeometry args={[0.075, 0]} /><meshBasicMaterial color="#effff4" toneMapped={false} /></mesh>
              </group>
            );
          })}
        </group>

        <lineSegments ref={mandala} geometry={mandalaGeometry} position={[0, 0, 0.08]}>
          <lineBasicMaterial blending={THREE.AdditiveBlending} color="#c9ffda" depthWrite={false} opacity={0.9} toneMapped={false} transparent />
        </lineSegments>
        <lineSegments geometry={eyeGeometry} position={[0, 0, 0.18]}>
          <lineBasicMaterial blending={THREE.AdditiveBlending} color="#f2fff6" depthWrite={false} opacity={0.95} toneMapped={false} transparent />
        </lineSegments>

        <group ref={aperture} position={[0, 0, 0.23]}>
          {Array.from({ length: 8 }, (_, index) => (
            <mesh key={index} rotation={[0, 0, (index / 8) * TAU]} position={[0.31, 0, 0]}>
              <coneGeometry args={[0.17, 0.48, 3]} />
              <meshBasicMaterial blending={THREE.AdditiveBlending} color={index % 2 ? "#7dffad" : "#eafff1"} depthWrite={false} opacity={0.68} toneMapped={false} transparent wireframe />
            </mesh>
          ))}
        </group>
        <mesh ref={core} position={[0, 0, 0.28]}>
          <sphereGeometry args={[0.105, 24, 24]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.08, 0.014, 5, 96]} /><meshBasicMaterial color="#39e87d" opacity={0.42} transparent toneMapped={false} /></mesh>
        <mesh rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[1.34, 0.012, 5, 96]} /><meshBasicMaterial color="#72ffa5" opacity={0.34} transparent toneMapped={false} /></mesh>
      </group>
    </LivingOrb>
  );
}
