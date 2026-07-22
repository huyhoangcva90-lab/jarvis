import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type SpaceActivity = "idle" | "listening" | "thinking" | "speaking";

const CUBE_NODES: [number, number, number][] = [
  [-1.75, -1.05, -0.42], [-1.45, 1.2, 0.18], [1.55, -1.08, 0.32], [1.72, 0.92, -0.3],
  [-0.82, -1.72, 0.12], [0.74, 1.66, -0.16], [2.18, 0.12, 0.1], [-2.12, 0.18, -0.08],
];

function activitySpeed(activity: SpaceActivity) {
  if (activity === "speaking") return 1.9;
  if (activity === "thinking") return 1.45;
  if (activity === "listening") return 0.62;
  return 1;
}

function connectorGeometry(inner = 0.72, outer = 1.28) {
  const points: THREE.Vector3[] = [];
  for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) {
    points.push(new THREE.Vector3(x * inner, y * inner, z * inner), new THREE.Vector3(x * outer, y * outer, z * outer));
  }
  return new THREE.BufferGeometry().setFromPoints(points);
}

export function HypercubeSystem({ activity = "idle" }: { activity?: SpaceActivity }) {
  const root = useRef<THREE.Group>(null);
  const outer = useRef<THREE.LineSegments>(null);
  const inner = useRef<THREE.LineSegments>(null);
  const formation = useRef<THREE.Group>(null);
  const outerGeometry = useMemo(() => {
    const source = new THREE.BoxGeometry(2.56, 2.56, 2.56);
    const geometry = new THREE.EdgesGeometry(source);
    source.dispose();
    return geometry;
  }, []);
  const innerGeometry = useMemo(() => {
    const source = new THREE.BoxGeometry(1.44, 1.44, 1.44);
    const geometry = new THREE.EdgesGeometry(source);
    source.dispose();
    return geometry;
  }, []);
  const nodeGeometry = useMemo(() => {
    const source = new THREE.BoxGeometry(0.28, 0.28, 0.28);
    const geometry = new THREE.EdgesGeometry(source);
    source.dispose();
    return geometry;
  }, []);
  const bridges = useMemo(() => connectorGeometry(), []);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const speed = activitySpeed(activity);
    if (root.current) {
      root.current.rotation.x += delta * 0.11 * speed;
      root.current.rotation.y += delta * 0.18 * speed;
    }
    if (outer.current) outer.current.rotation.z += delta * 0.07 * speed;
    if (inner.current) {
      inner.current.rotation.x -= delta * 0.2 * speed;
      inner.current.rotation.y -= delta * 0.14 * speed;
      const pulse = 0.9 + Math.sin(t * 1.8 * speed) * 0.1;
      inner.current.scale.setScalar(pulse);
    }
    if (formation.current) {
      formation.current.children.forEach((child, index) => {
        const wave = (Math.sin(t * (1.2 + speed * 0.25) - index * 0.62) + 1) * 0.5;
        child.scale.setScalar(0.42 + wave * 0.58);
        child.rotation.x += delta * (0.18 + index * 0.018);
        child.rotation.y -= delta * (0.23 + index * 0.014);
      });
    }
  });

  return (
    <group ref={root} scale={0.86}>
      <lineSegments ref={outer} geometry={outerGeometry} rotation={[0.18, 0.32, 0.12]}>
        <lineBasicMaterial blending={THREE.AdditiveBlending} color="#35d8ff" depthWrite={false} opacity={0.82} toneMapped={false} transparent />
      </lineSegments>
      <lineSegments ref={inner} geometry={innerGeometry} rotation={[-0.34, 0.26, -0.18]}>
        <lineBasicMaterial blending={THREE.AdditiveBlending} color="#56ffb1" depthWrite={false} opacity={0.9} toneMapped={false} transparent />
      </lineSegments>
      <lineSegments geometry={bridges}>
        <lineBasicMaterial blending={THREE.AdditiveBlending} color="#d9ffff" depthWrite={false} opacity={0.52} toneMapped={false} transparent />
      </lineSegments>

      <mesh>
        <icosahedronGeometry args={[0.44, 1]} />
        <meshBasicMaterial blending={THREE.AdditiveBlending} color="#49f5d0" depthWrite={false} opacity={0.16} toneMapped={false} transparent wireframe />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.105, 20, 20]} />
        <meshBasicMaterial color="#f1ffff" toneMapped={false} />
      </mesh>

      <group ref={formation}>
        {CUBE_NODES.map((position, index) => (
          <lineSegments geometry={nodeGeometry} key={index} position={position}>
            <lineBasicMaterial blending={THREE.AdditiveBlending} color={index % 2 ? "#56ffb1" : "#35d8ff"} depthWrite={false} opacity={0.72} toneMapped={false} transparent />
          </lineSegments>
        ))}
      </group>
    </group>
  );
}
