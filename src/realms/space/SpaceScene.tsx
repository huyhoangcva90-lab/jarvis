import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AiActivity } from "../../App";
import { activityEnergy, activityPulse, activitySpeed, seededRandom, segmentGeometry } from "../shared/coreMotion";

const BLUE = "#22b8ff";
const ICE = "#dcfbff";
const DEEP = "#0757ff";

const volumeVertexShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  void main() {
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const volumeFragmentShader = `
  uniform float uTime;
  uniform float uEnergy;
  varying vec3 vPosition;
  varying vec3 vNormal;
  void main() {
    vec3 p = vPosition * 2.25;
    float cells = abs(sin(p.x * 5.0 + uTime) * sin(p.y * 4.0 - uTime * 0.7) * sin(p.z * 5.5 + uTime * 0.4));
    float slice = smoothstep(0.86, 1.0, cells);
    float edge = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 2.0);
    float alpha = (slice * 0.22 + edge * 0.12) * uEnergy;
    vec3 color = mix(vec3(0.02, 0.16, 0.82), vec3(0.42, 0.94, 1.0), slice + edge);
    gl_FragColor = vec4(color * (0.75 + uEnergy * 0.35), alpha);
  }
`;

function TesseractKernel({ activity }: { activity: AiActivity }) {
  const lineRef = useRef<THREE.LineSegments>(null);
  const volumeRef = useRef<THREE.ShaderMaterial>(null);
  const seedRef = useRef<THREE.Mesh>(null);

  const { geometry, vertices, edges } = useMemo(() => {
    const source: Array<[number, number, number, number]> = [];
    for (let index = 0; index < 16; index += 1) {
      source.push([
        index & 1 ? 1 : -1,
        index & 2 ? 1 : -1,
        index & 4 ? 1 : -1,
        index & 8 ? 1 : -1,
      ]);
    }
    const connections: Array<[number, number]> = [];
    for (let index = 0; index < source.length; index += 1) {
      for (let dimension = 0; dimension < 4; dimension += 1) {
        const neighbor = index ^ (1 << dimension);
        if (index < neighbor) connections.push([index, neighbor]);
      }
    }
    const positions = new Float32Array(connections.length * 6);
    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geometry: buffer, vertices: source, edges: connections };
  }, []);
  const projected = useMemo(() => new Float32Array(16 * 3), []);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);
    const positions = geometry.attributes.position as THREE.BufferAttribute;
    const array = positions.array as Float32Array;
    const a = time * 0.31 * speed;
    const b = time * 0.21 * speed;
    const c = time * 0.17 * speed;
    const ca = Math.cos(a), sa = Math.sin(a);
    const cb = Math.cos(b), sb = Math.sin(b);
    const cc = Math.cos(c), sc = Math.sin(c);

    vertices.forEach(([sourceX, sourceY, sourceZ, sourceW], index) => {
      let x = sourceX * ca - sourceW * sa;
      let w = sourceX * sa + sourceW * ca;
      let y = sourceY * cb - w * sb;
      w = sourceY * sb + w * cb;
      let z = sourceZ * cc - w * sc;
      w = sourceZ * sc + w * cc;
      const projection = 1.75 / (2.65 - w * 0.38);
      projected[index * 3] = x * projection;
      projected[index * 3 + 1] = y * projection;
      projected[index * 3 + 2] = z * projection;
    });

    edges.forEach(([from, to], index) => {
      const offset = index * 6;
      array[offset] = projected[from * 3];
      array[offset + 1] = projected[from * 3 + 1];
      array[offset + 2] = projected[from * 3 + 2];
      array[offset + 3] = projected[to * 3];
      array[offset + 4] = projected[to * 3 + 1];
      array[offset + 5] = projected[to * 3 + 2];
    });
    positions.needsUpdate = true;

    if (lineRef.current) {
      lineRef.current.rotation.y += delta * 0.08 * speed;
      lineRef.current.rotation.x = Math.sin(time * 0.23) * 0.18;
      lineRef.current.scale.setScalar(activityPulse(activity, time));
    }
    if (seedRef.current) {
      seedRef.current.rotation.x += delta * 1.1 * speed;
      seedRef.current.rotation.y -= delta * 1.35 * speed;
      seedRef.current.scale.setScalar(0.82 + activityEnergy(activity) * 0.16 + Math.sin(time * 7.0) * 0.04);
    }
    if (volumeRef.current) {
      volumeRef.current.uniforms.uTime.value = time;
      volumeRef.current.uniforms.uEnergy.value = activityEnergy(activity);
    }
  });

  return (
    <group rotation={[0.22, -0.34, 0.08]}>
      <lineSegments ref={lineRef} geometry={geometry}>
        <lineBasicMaterial color={ICE} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.92} toneMapped={false} transparent />
      </lineSegments>
      <lineSegments geometry={geometry} scale={1.14}>
        <lineBasicMaterial color={DEEP} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.28} toneMapped={false} transparent />
      </lineSegments>
      <mesh scale={0.92}>
        <boxGeometry args={[1.45, 1.45, 1.45, 5, 5, 5]} />
        <shaderMaterial
          ref={volumeRef}
          vertexShader={volumeVertexShader}
          fragmentShader={volumeFragmentShader}
          uniforms={{ uTime: { value: 0 }, uEnergy: { value: 1 } }}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>
      <mesh ref={seedRef}>
        <octahedronGeometry args={[0.12, 0]} />
        <meshBasicMaterial color={ICE} toneMapped={false} />
      </mesh>
    </group>
  );
}

function DimensionalSlices({ activity }: { activity: AiActivity }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const slices = useMemo(() => [
    [-0.86, 0.15, 0.08, 0.1, 0.36],
    [-0.36, -0.2, 0.18, -0.12, -0.18],
    [0.18, 0.22, -0.12, 0.2, 0.14],
    [0.62, -0.12, 0.12, -0.16, -0.32],
    [1.02, 0.08, -0.08, 0.12, 0.22],
  ], []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);
    slices.forEach(([x, y, z, rx, ry], index) => {
      dummy.position.set(x + Math.sin(time * 0.7 + index) * 0.08, y, z - index * 0.06);
      dummy.rotation.set(rx, ry + time * 0.08 * speed, index * 0.14);
      dummy.scale.set(0.025, 1.25 + index * 0.08, 1.65 - index * 0.1);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(index, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, slices.length]} rotation={[0.1, -0.2, 0.06]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={BLUE} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.12} transparent wireframe />
    </instancedMesh>
  );
}

function PortalArchitecture({ activity }: { activity: AiActivity }) {
  const root = useRef<THREE.Group>(null);
  const geometry = useMemo(() => {
    const segments: Array<[THREE.Vector3, THREE.Vector3]> = [];
    const rectangles = [
      { center: [-2.15, 0.42, -0.5], width: 0.95, height: 1.62 },
      { center: [2.02, -0.34, -0.18], width: 0.72, height: 1.22 },
      { center: [0.52, 1.66, -0.9], width: 1.3, height: 0.46 },
    ];
    rectangles.forEach(({ center, width, height }) => {
      const [cx, cy, cz] = center;
      const corners = [
        new THREE.Vector3(cx - width, cy - height, cz),
        new THREE.Vector3(cx + width, cy - height, cz),
        new THREE.Vector3(cx + width, cy + height, cz),
        new THREE.Vector3(cx - width, cy + height, cz),
      ];
      for (let index = 0; index < 4; index += 1) segments.push([corners[index], corners[(index + 1) % 4]]);
      segments.push([corners[0], new THREE.Vector3(cx - width * 0.54, cy - height * 0.54, cz + 0.42)]);
      segments.push([corners[2], new THREE.Vector3(cx + width * 0.54, cy + height * 0.54, cz + 0.42)]);
    });
    return segmentGeometry(segments);
  }, []);

  useFrame(({ clock }) => {
    if (!root.current) return;
    root.current.rotation.y = Math.sin(clock.elapsedTime * 0.22) * 0.12;
    root.current.scale.setScalar(0.97 + activityEnergy(activity) * 0.035);
  });

  return (
    <group ref={root}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color={BLUE} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.52} toneMapped={false} transparent />
      </lineSegments>
    </group>
  );
}

function SpatialWave({ activity }: { activity: AiActivity }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.elapsedTime;
    materialRef.current.uniforms.uEnergy.value = activityEnergy(activity);
  });
  return (
    <mesh position={[0, 0, -1.25]} rotation={[0.08, -0.18, 0]} scale={[4.8, 3.2, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={`varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`}
        fragmentShader={`
          uniform float uTime; uniform float uEnergy; varying vec2 vUv;
          void main(){
            vec2 p=(vUv-.5)*2.0; float d=max(abs(p.x),abs(p.y));
            float phase=fract(uTime*.12); float wave=1.0-smoothstep(.018,.07,abs(d-phase));
            float grid=(1.0-smoothstep(.0,.025,abs(fract((p.x+p.y+uTime*.05)*8.0)-.5)))*.16;
            float edge=smoothstep(.82,1.0,d)*(1.0-smoothstep(1.0,1.08,d));
            float alpha=(wave*.34+grid+edge*.18)*uEnergy;
            gl_FragColor=vec4(vec3(.04,.48,1.0)+vec3(.36,.44,.28)*wave,alpha);
          }
        `}
        uniforms={{ uTime: { value: 0 }, uEnergy: { value: 1 } }}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        transparent
      />
    </mesh>
  );
}

function RiftFragments({ activity }: { activity: AiActivity }) {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const random = seededRandom(404);
    const data = new Float32Array(420 * 3);
    for (let index = 0; index < 420; index += 1) {
      const side = random() > 0.5 ? 1 : -1;
      data[index * 3] = side * (1.3 + random() * 2.4);
      data[index * 3 + 1] = (random() - 0.5) * 4.4;
      data[index * 3 + 2] = (random() - 0.5) * 2.8 - 0.3;
    }
    return data;
  }, []);
  useFrame(({ clock }, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.018 * activitySpeed(activity);
    pointsRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.13) * 0.05;
  });
  return (
    <points ref={pointsRef}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial color={ICE} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.46} size={0.025} sizeAttenuation toneMapped={false} transparent />
    </points>
  );
}

export function SpaceScene({ activity = "idle" }: { activity?: AiActivity }) {
  return (
    <group name="space-dimensional-intelligence" scale={0.92}>
      <SpatialWave activity={activity} />
      <PortalArchitecture activity={activity} />
      <DimensionalSlices activity={activity} />
      <RiftFragments activity={activity} />
      <TesseractKernel activity={activity} />
    </group>
  );
}
