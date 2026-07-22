import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type SpaceActivity = "idle" | "listening" | "thinking" | "speaking";

const CORNERS = [-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => [x, y, z] as const)));

function speedFor(activity: SpaceActivity) {
  return activity === "speaking" ? 2.2 : activity === "thinking" ? 1.55 : activity === "listening" ? 0.58 : 1;
}

function makeEdges(size: number) {
  const source = new THREE.BoxGeometry(size, size, size);
  const result = new THREE.EdgesGeometry(source);
  source.dispose();
  return result;
}

function makeBridges() {
  const points: THREE.Vector3[] = [];
  CORNERS.forEach(([x, y, z]) => {
    points.push(new THREE.Vector3(x * 0.66, y * 0.66, z * 0.66));
    points.push(new THREE.Vector3(x * 1.22, y * 1.22, z * 1.22));
  });
  return new THREE.BufferGeometry().setFromPoints(points);
}

export function HypercubeSystem({ activity = "idle" }: { activity?: SpaceActivity }) {
  const root = useRef<THREE.Group>(null);
  const cubes = useRef<THREE.LineSegments[]>([]);
  const bridges = useRef<THREE.LineSegments>(null);
  const fragments = useRef<THREE.InstancedMesh>(null);
  const nucleus = useRef<THREE.Mesh>(null);
  const edgeGeometries = useMemo(() => [2.76, 2.2, 1.54, 0.82].map(makeEdges), []);
  const bridgeGeometry = useMemo(makeBridges, []);
  const fragmentGeometry = useMemo(() => new THREE.BoxGeometry(0.13, 0.13, 0.13), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => () => {
    edgeGeometries.forEach((geometry) => geometry.dispose());
    bridgeGeometry.dispose();
    fragmentGeometry.dispose();
  }, [bridgeGeometry, edgeGeometries, fragmentGeometry]);

  useEffect(() => {
    if (!fragments.current) return;
    for (let index = 0; index < 24; index += 1) {
      const face = index % 6;
      const lane = (index % 4) - 1.5;
      const u = lane * 0.48;
      const v = (((index * 3) % 5) - 2) * 0.37;
      const p: [number, number, number] = face < 2 ? [face ? 1.48 : -1.48, u, v]
        : face < 4 ? [u, face === 3 ? 1.48 : -1.48, v]
          : [u, v, face === 5 ? 1.48 : -1.48];
      dummy.position.set(...p);
      dummy.rotation.set(index * 0.17, index * 0.31, index * 0.11);
      dummy.scale.setScalar(index % 5 === 0 ? 1.4 : 0.75);
      dummy.updateMatrix();
      fragments.current.setMatrixAt(index, dummy.matrix);
    }
    fragments.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const speed = speedFor(activity);
    if (root.current) {
      root.current.rotation.x += delta * 0.07 * speed;
      root.current.rotation.y += delta * 0.11 * speed;
      root.current.rotation.z = Math.sin(t * 0.23) * 0.08;
    }
    cubes.current.forEach((cube, index) => {
      const direction = index % 2 ? -1 : 1;
      cube.rotation.x += delta * (0.055 + index * 0.025) * speed * direction;
      cube.rotation.y += delta * (0.09 + index * 0.032) * speed * direction;
      const dataPulse = activity === "speaking" ? Math.sin(t * 7.8 - index) * 0.04 : Math.sin(t * 1.6 + index) * 0.012;
      cube.scale.setScalar(1 + dataPulse);
    });
    if (bridges.current) {
      const material = bridges.current.material as THREE.LineBasicMaterial;
      material.opacity = activity === "thinking" ? 0.34 + Math.pow(0.5 + 0.5 * Math.sin(t * 5), 5) * 0.5 : 0.34;
    }
    if (fragments.current) fragments.current.rotation.y -= delta * 0.15 * speed;
    if (nucleus.current) {
      const beat = activity === "speaking" ? Math.sin(t * 9) * 0.13 : Math.sin(t * 1.7) * 0.04;
      nucleus.current.scale.setScalar(1 + beat);
    }
  });

  return (
    <group ref={root} scale={0.91} rotation={[0.2, 0.34, 0.08]}>
      {edgeGeometries.map((geometry, index) => (
        <lineSegments
          geometry={geometry}
          key={index}
          ref={(node) => { if (node) cubes.current[index] = node; }}
          rotation={[index * 0.21, -index * 0.16, index * 0.12]}
        >
          <lineBasicMaterial
            blending={THREE.AdditiveBlending}
            color={index % 2 ? "#77f7ff" : "#28baff"}
            depthWrite={false}
            opacity={0.92 - index * 0.13}
            toneMapped={false}
            transparent
          />
        </lineSegments>
      ))}
      <lineSegments ref={bridges} geometry={bridgeGeometry}>
        <lineBasicMaterial blending={THREE.AdditiveBlending} color="#eaffff" depthWrite={false} opacity={0.38} toneMapped={false} transparent />
      </lineSegments>
      <instancedMesh ref={fragments} args={[fragmentGeometry, undefined, 24]}>
        <meshBasicMaterial blending={THREE.AdditiveBlending} color="#38d8ff" depthWrite={false} opacity={0.62} toneMapped={false} transparent wireframe />
      </instancedMesh>
      <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <octahedronGeometry args={[0.47, 0]} />
        <meshBasicMaterial blending={THREE.AdditiveBlending} color="#6bf5ff" depthWrite={false} opacity={0.14} toneMapped={false} transparent wireframe />
      </mesh>
      <mesh ref={nucleus}>
        <boxGeometry args={[0.17, 0.17, 0.17]} />
        <meshBasicMaterial color="#f4ffff" toneMapped={false} />
      </mesh>
    </group>
  );
}
