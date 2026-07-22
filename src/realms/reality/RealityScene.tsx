import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AiActivity } from "../../types/orb";
import { LivingOrb } from "../../core/LivingOrb";
import { RealmAtmosphere } from "../../core/RealmAtmosphere";

const TAU = Math.PI * 2;

function speedFor(activity: AiActivity) {
  return activity === "speaking" ? 2.05 : activity === "thinking" ? 1.48 : activity === "listening" ? 0.6 : 1;
}

function makeWorldTree() {
  const points: THREE.Vector3[] = [];
  const add = (a: [number, number, number], b: [number, number, number]) => points.push(new THREE.Vector3(...a), new THREE.Vector3(...b));
  add([0, -1.15, 0], [0, 1.12, 0]);
  add([0, 0.42, 0], [-0.62, 0.96, 0.08]);
  add([0, 0.42, 0], [0.62, 0.96, -0.08]);
  add([0, 0.05, 0], [-0.86, 0.52, -0.06]);
  add([0, 0.05, 0], [0.86, 0.52, 0.06]);
  add([0, -0.86, 0], [-0.58, -1.35, 0.08]);
  add([0, -0.86, 0], [0.58, -1.35, -0.08]);
  return new THREE.BufferGeometry().setFromPoints(points);
}

export function RealityScene({ activity = "idle" }: { activity?: AiActivity }) {
  const root = useRef<THREE.Group>(null);
  const crowns = useRef<THREE.Group>(null);
  const realmRing = useRef<THREE.Group>(null);
  const runes = useRef<THREE.InstancedMesh>(null);
  const core = useRef<THREE.Mesh>(null);
  const runeGeometry = useMemo(() => new THREE.TetrahedronGeometry(0.105, 0), []);
  const treeGeometry = useMemo(makeWorldTree, []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (runes.current) {
      for (let index = 0; index < 32; index += 1) {
        const angle = (index / 32) * TAU;
        const radius = index % 2 ? 2.08 : 1.87;
        dummy.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, Math.sin(index * 1.7) * 0.1);
        dummy.rotation.set(angle * 0.2, angle * 0.15, angle + Math.PI / 4);
        dummy.scale.set(index % 4 === 0 ? 1.45 : 0.72, index % 3 === 0 ? 0.45 : 0.82, 0.42);
        dummy.updateMatrix();
        runes.current.setMatrixAt(index, dummy.matrix);
      }
      runes.current.instanceMatrix.needsUpdate = true;
    }
    return () => { runeGeometry.dispose(); treeGeometry.dispose(); };
  }, [dummy, runeGeometry, treeGeometry]);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const speed = speedFor(activity);
    if (root.current) {
      root.current.rotation.y += delta * 0.055 * speed;
      root.current.rotation.x = 0.12 + Math.sin(t * 0.19) * 0.045;
    }
    if (crowns.current) crowns.current.rotation.z -= delta * 0.105 * speed;
    if (realmRing.current) realmRing.current.rotation.z += delta * 0.048 * speed;
    if (runes.current) runes.current.rotation.z -= delta * 0.032 * speed;
    if (core.current) {
      const thunder = activity === "speaking" ? Math.sin(t * 8.6) * 0.14 : Math.pow(0.5 + 0.5 * Math.sin(t * 1.35), 6) * 0.06;
      core.current.scale.setScalar(1 + thunder);
    }
  });

  return (
    <LivingOrb activity={activity} color="#ff314e" accent="#ffd36b">
      <RealmAtmosphere activity={activity} primary="#ff314e" secondary="#ffb62f" hot="#fff0b0" variant="asgard" />
      <group ref={root} scale={0.92}>
        <group ref={realmRing}>
          {[1.76, 2.12, 2.48].map((radius, index) => (
            <mesh key={radius} rotation={[index * 0.76, index * 0.48, index * 0.41]}>
              <torusGeometry args={[radius, index === 1 ? 0.025 : 0.012, 5, 144]} />
              <meshBasicMaterial blending={THREE.AdditiveBlending} color={index === 1 ? "#ffd15b" : "#f7354d"} depthWrite={false} opacity={0.58 - index * 0.09} toneMapped={false} transparent />
            </mesh>
          ))}
        </group>
        <instancedMesh ref={runes} args={[runeGeometry, undefined, 32]}>
          <meshBasicMaterial blending={THREE.AdditiveBlending} color="#ffcb58" depthWrite={false} opacity={0.72} toneMapped={false} transparent />
        </instancedMesh>

        <group ref={crowns}>
          {Array.from({ length: 12 }, (_, index) => {
            const angle = (index / 12) * TAU;
            return (
              <mesh key={index} position={[Math.cos(angle) * 1.37, Math.sin(angle) * 1.37, Math.sin(index * 0.9) * 0.16]} rotation={[0, angle * 0.15, angle - Math.PI / 2]}>
                <coneGeometry args={[index % 3 === 0 ? 0.2 : 0.12, index % 3 === 0 ? 0.68 : 0.44, 3]} />
                <meshBasicMaterial blending={THREE.AdditiveBlending} color={index % 3 === 0 ? "#ffe295" : "#ff4356"} depthWrite={false} opacity={0.7} toneMapped={false} transparent wireframe />
              </mesh>
            );
          })}
        </group>

        <lineSegments geometry={treeGeometry} position={[0, 0, 0.22]} scale={0.72}>
          <lineBasicMaterial blending={THREE.AdditiveBlending} color="#ffe4a0" depthWrite={false} opacity={0.76} toneMapped={false} transparent />
        </lineSegments>
        <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.05, 0.025, 5, 96]} /><meshBasicMaterial color="#ffcf65" opacity={0.62} transparent toneMapped={false} /></mesh>
        <mesh rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[1.18, 0.012, 5, 96]} /><meshBasicMaterial color="#ff4253" opacity={0.48} transparent toneMapped={false} /></mesh>
        <mesh ref={core}>
          <octahedronGeometry args={[0.3, 0]} />
          <meshBasicMaterial color="#fff4d5" toneMapped={false} />
        </mesh>
        <pointLight color="#ff3c39" distance={7} intensity={2.2} />
      </group>
    </LivingOrb>
  );
}
