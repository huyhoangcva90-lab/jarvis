import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AiActivity } from "../../types/orb";
import { LivingOrb } from "../../core/LivingOrb";
import { RealmAtmosphere } from "../../core/RealmAtmosphere";

const TAU = Math.PI * 2;

export function AlienScene({ activity }: { activity: AiActivity }) {
  const root = useRef<THREE.Group>(null);
  const shells = useRef<THREE.LineSegments[]>([]);
  const satellites = useRef<THREE.Group>(null);
  const nodes = useRef<THREE.InstancedMesh>(null);
  const core = useRef<THREE.Mesh>(null);
  const shellGeometries = useMemo(() => [1.04, 1.44, 1.9].map((radius, index) => {
    const source = new THREE.IcosahedronGeometry(radius, index === 2 ? 2 : 1);
    const geometry = new THREE.WireframeGeometry(source);
    source.dispose();
    return geometry;
  }), []);
  const nodeGeometry = useMemo(() => new THREE.OctahedronGeometry(0.09, 0), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (nodes.current) {
      for (let index = 0; index < 40; index += 1) {
        const theta = index * 2.399963;
        const y = 1 - (index / 39) * 2;
        const radius = Math.sqrt(Math.max(0, 1 - y * y));
        dummy.position.set(Math.cos(theta) * radius * 2.18, y * 2.18, Math.sin(theta) * radius * 2.18);
        dummy.rotation.set(theta, y * 2, theta * 0.4);
        dummy.scale.setScalar(index % 6 === 0 ? 1.45 : 0.62);
        dummy.updateMatrix();
        nodes.current.setMatrixAt(index, dummy.matrix);
      }
      nodes.current.instanceMatrix.needsUpdate = true;
    }
    return () => { shellGeometries.forEach((geometry) => geometry.dispose()); nodeGeometry.dispose(); };
  }, [dummy, nodeGeometry, shellGeometries]);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const speed = activity === "speaking" ? 2.15 : activity === "thinking" ? 1.58 : activity === "listening" ? 0.52 : 1;
    if (root.current) root.current.rotation.y += delta * 0.045 * speed;
    shells.current.forEach((shell, index) => {
      const direction = index % 2 ? -1 : 1;
      shell.rotation.x += delta * (0.035 + index * 0.025) * speed * direction;
      shell.rotation.y += delta * (0.052 + index * 0.018) * speed * direction;
      shell.scale.setScalar(1 + (activity === "speaking" ? Math.sin(t * 7.5 - index) * 0.035 : Math.sin(t + index) * 0.008));
    });
    if (satellites.current) {
      satellites.current.rotation.z -= delta * 0.12 * speed;
      satellites.current.rotation.x = Math.sin(t * 0.2) * 0.18;
    }
    if (nodes.current) nodes.current.rotation.y += delta * 0.07 * speed;
    if (core.current) core.current.rotation.y -= delta * 0.38 * speed;
  });

  return (
    <LivingOrb activity={activity} color="#ac4dff" accent="#69e6ff">
      <RealmAtmosphere activity={activity} primary="#ac4dff" secondary="#5de7ff" hot="#f3ddff" variant="alien" />
      <group ref={root} scale={0.95} rotation={[0.08, 0.2, 0.04]}>
        {shellGeometries.map((geometry, index) => (
          <lineSegments key={index} geometry={geometry} ref={(node) => { if (node) shells.current[index] = node; }} rotation={[index * 0.38, index * -0.25, index * 0.16]}>
            <lineBasicMaterial blending={THREE.AdditiveBlending} color={index === 1 ? "#5ee7ff" : index === 2 ? "#7138d8" : "#e2a5ff"} depthWrite={false} opacity={0.75 - index * 0.16} toneMapped={false} transparent />
          </lineSegments>
        ))}
        <instancedMesh ref={nodes} args={[nodeGeometry, undefined, 40]}>
          <meshBasicMaterial blending={THREE.AdditiveBlending} color="#a752ff" depthWrite={false} opacity={0.64} toneMapped={false} transparent wireframe />
        </instancedMesh>
        <group ref={satellites}>
          {Array.from({ length: 9 }, (_, index) => {
            const angle = (index / 9) * TAU;
            return (
              <group key={index} position={[Math.cos(angle) * 2.52, Math.sin(angle) * 2.52, Math.sin(index * 1.4) * 0.32]} rotation={[angle * 0.2, angle * 0.32, angle]}>
                <mesh><tetrahedronGeometry args={[0.17, 0]} /><meshBasicMaterial color={index % 3 === 0 ? "#85ecff" : "#bd61ff"} toneMapped={false} wireframe /></mesh>
                <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.25, 0.012, 4, 28]} /><meshBasicMaterial color="#8d48e8" opacity={0.55} transparent toneMapped={false} /></mesh>
              </group>
            );
          })}
        </group>
        <mesh ref={core}>
          <dodecahedronGeometry args={[0.34, 0]} />
          <meshBasicMaterial blending={THREE.AdditiveBlending} color="#f6e5ff" depthWrite={false} toneMapped={false} wireframe />
        </mesh>
        <mesh><sphereGeometry args={[0.105, 20, 20]} /><meshBasicMaterial color="#ffffff" toneMapped={false} /></mesh>
      </group>
    </LivingOrb>
  );
}
