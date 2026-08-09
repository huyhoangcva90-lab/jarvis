import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { AiActivity } from "../../App";
import { activityEnergy, activityPulse, activitySpeed, seededRandom, segmentGeometry } from "../shared/coreMotion";

const ICE = "#dcfbff";
const BLUE = "#22b8ff";
const DEEP = "#0757ff";
const DARK = "#020713";

const glassVertex = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glassFragment = `
  uniform float uTime;
  uniform float uEnergy;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - abs(dot(viewDir, normalize(vNormal))), 2.15);

    vec2 grid = abs(fract(vUv * 7.0) - 0.5);
    float circuit = 1.0 - smoothstep(0.012, 0.045, min(grid.x, grid.y));
    float scan = smoothstep(0.62, 1.0, sin((vUv.x + vUv.y) * 22.0 - uTime * 4.2) * 0.5 + 0.5);
    float chip = step(0.84, hash(floor(vUv * 11.0) + floor(uTime * 2.0))) * 0.28;

    vec3 ice = vec3(0.86, 0.98, 1.0);
    vec3 cyan = vec3(0.13, 0.72, 1.0);
    vec3 deep = vec3(0.03, 0.20, 0.86);
    vec3 color = mix(deep, cyan, 0.45 + circuit * 0.35);
    color = mix(color, ice, fresnel * 0.9 + scan * circuit * 0.45 + chip);

    float edge = smoothstep(0.42, 0.5, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    float alpha = 0.08 + fresnel * 0.58 + edge * 0.38 + circuit * scan * 0.22;
    alpha *= 0.72 + uEnergy * 0.36;
    gl_FragColor = vec4(color * (1.2 + uEnergy * 0.45), clamp(alpha, 0.0, 0.96));
  }
`;

const beamVertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const beamFragment = `
  uniform float uTime;
  uniform float uEnergy;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    float core = 1.0 - smoothstep(0.0, 0.48, abs(vUv.y - 0.5));
    float taper = smoothstep(0.0, 0.14, vUv.x) * (1.0 - smoothstep(0.78, 1.0, vUv.x));
    float pulse = 0.65 + 0.35 * sin(uTime * 5.8 + vUv.x * 20.0);
    gl_FragColor = vec4(uColor * (1.35 + pulse * 0.8), core * taper * (0.09 + uEnergy * 0.11));
  }
`;

type HypercubeData = {
  baseVertices: Array<[number, number, number, number]>;
  edges: Array<[number, number]>;
  positions: Float32Array;
};

function makeHypercubeData(): HypercubeData {
  const baseVertices: Array<[number, number, number, number]> = [];
  for (const x of [-1, 1]) {
    for (const y of [-1, 1]) {
      for (const z of [-1, 1]) {
        for (const w of [-1, 1]) {
          baseVertices.push([x, y, z, w]);
        }
      }
    }
  }

  const edges: Array<[number, number]> = [];
  for (let a = 0; a < baseVertices.length; a += 1) {
    for (let b = a + 1; b < baseVertices.length; b += 1) {
      let differences = 0;
      for (let axis = 0; axis < 4; axis += 1) {
        if (baseVertices[a][axis] !== baseVertices[b][axis]) differences += 1;
      }
      if (differences === 1) edges.push([a, b]);
    }
  }

  return { baseVertices, edges, positions: new Float32Array(edges.length * 6) };
}

function buildFaceCircuitGeometry() {
  const rng = seededRandom(88201);
  const segments: Array<[THREE.Vector3, THREE.Vector3]> = [];
  const faces = [
    { axis: "z", sign: 1 },
    { axis: "z", sign: -1 },
    { axis: "x", sign: 1 },
    { axis: "x", sign: -1 },
    { axis: "y", sign: 1 },
    { axis: "y", sign: -1 },
  ] as const;

  const makePoint = (axis: "x" | "y" | "z", sign: number, a: number, b: number) => {
    const depth = sign * 0.995;
    if (axis === "z") return new THREE.Vector3(a, b, depth);
    if (axis === "x") return new THREE.Vector3(depth, a, b);
    return new THREE.Vector3(a, depth, b);
  };

  faces.forEach((face, faceIndex) => {
    for (let trace = 0; trace < 20; trace += 1) {
      const lane = -0.72 + Math.floor(rng() * 7) * 0.24;
      const from = -0.88 + rng() * 0.24;
      const length = 0.32 + rng() * 0.82;
      const elbow = from + length * (0.35 + rng() * 0.35);
      const cross = lane + (rng() > 0.5 ? 1 : -1) * (0.08 + rng() * 0.18);
      const horizontal = trace % 2 === 0;
      const a = horizontal ? makePoint(face.axis, face.sign, from, lane) : makePoint(face.axis, face.sign, lane, from);
      const b = horizontal ? makePoint(face.axis, face.sign, elbow, lane) : makePoint(face.axis, face.sign, lane, elbow);
      const c = horizontal ? makePoint(face.axis, face.sign, elbow, cross) : makePoint(face.axis, face.sign, cross, elbow);
      const d = horizontal ? makePoint(face.axis, face.sign, Math.min(0.92, from + length), cross) : makePoint(face.axis, face.sign, cross, Math.min(0.92, from + length));
      segments.push([a, b], [b, c], [c, d]);
      if ((trace + faceIndex) % 4 === 0) {
        const pad = horizontal ? makePoint(face.axis, face.sign, d.x || d.z, cross + 0.055) : makePoint(face.axis, face.sign, cross + 0.055, d.y || d.z);
        segments.push([c, pad]);
      }
    }
  });

  return segmentGeometry(segments);
}

function buildPrismaticShardGeometry() {
  const rng = seededRandom(64043);
  const segments: Array<[THREE.Vector3, THREE.Vector3]> = [];
  for (let shard = 0; shard < 68; shard += 1) {
    const theta = rng() * Math.PI * 2;
    const y = (rng() - 0.5) * 2.8;
    const radius = 1.35 + rng() * 1.7;
    const start = new THREE.Vector3(Math.cos(theta) * radius, y, Math.sin(theta) * radius * 0.76);
    const end = start
      .clone()
      .add(new THREE.Vector3((rng() - 0.5) * 0.16, (rng() - 0.5) * 0.16, (rng() - 0.5) * 0.16));
    segments.push([start, end]);
  }
  return segmentGeometry(segments);
}

function CoreLight({ activity }: { activity: AiActivity }) {
  const core = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const energy = activityEnergy(activity);
    const pulse = activityPulse(activity, time, 0.8);
    if (core.current) {
      core.current.rotation.x += delta * 0.72 * activitySpeed(activity);
      core.current.rotation.y -= delta * 0.58 * activitySpeed(activity);
      core.current.scale.setScalar(0.92 + (pulse - 1) * 1.8);
    }
    if (halo.current) halo.current.scale.setScalar(1.25 + Math.sin(time * 4.8) * 0.1 * energy);
    if (light.current) light.current.intensity = 5.8 + energy * 4.8 + Math.sin(time * 7.2) * 1.3;
  });

  return (
    <group>
      <mesh ref={halo}>
        <sphereGeometry args={[0.52, 48, 48]} />
        <meshBasicMaterial
          blending={THREE.AdditiveBlending}
          color={BLUE}
          depthWrite={false}
          opacity={0.22}
          toneMapped={false}
          transparent
        />
      </mesh>
      <mesh ref={core}>
        <octahedronGeometry args={[0.26, 2]} />
        <meshBasicMaterial color={ICE} toneMapped={false} />
      </mesh>
      <pointLight ref={light} color={ICE} distance={9} intensity={8} />
    </group>
  );
}

function TesseractGlassCore({ activity }: { activity: AiActivity }) {
  const group = useRef<THREE.Group>(null);
  const glass = useRef<THREE.ShaderMaterial>(null);
  const circuits = useRef<THREE.LineSegments>(null);
  const frame = useRef<THREE.Group>(null);

  const cubeGeometry = useMemo(() => new THREE.BoxGeometry(1.88, 1.88, 1.88, 10, 10, 10), []);
  const circuitGeometry = useMemo(buildFaceCircuitGeometry, []);
  const edgeGeometries = useMemo(() => {
    return [1.94, 1.48, 1.08, 0.62].map((size) => {
      const box = new THREE.BoxGeometry(size, size, size);
      const edges = new THREE.EdgesGeometry(box);
      box.dispose();
      return edges;
    });
  }, []);

  useEffect(() => {
    return () => {
      cubeGeometry.dispose();
      circuitGeometry.dispose();
      edgeGeometries.forEach((geometry) => geometry.dispose());
    };
  }, [circuitGeometry, cubeGeometry, edgeGeometries]);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const energy = activityEnergy(activity);
    const speed = activitySpeed(activity);
    if (group.current) {
      group.current.rotation.y += delta * 0.13 * speed;
      group.current.rotation.x = 0.62 + Math.sin(time * 0.21) * 0.08;
      group.current.rotation.z = 0.78 + Math.cos(time * 0.18) * 0.045;
      group.current.scale.setScalar(1.0 + Math.sin(time * 1.8) * 0.012 * energy);
    }
    if (glass.current) {
      glass.current.uniforms.uTime.value = time;
      glass.current.uniforms.uEnergy.value = energy;
    }
    if (circuits.current) {
      circuits.current.rotation.y -= delta * 0.06 * speed;
      circuits.current.rotation.x += delta * 0.025 * speed;
    }
    if (frame.current) {
      frame.current.rotation.y -= delta * 0.08 * speed;
      frame.current.rotation.z += delta * 0.03 * speed;
    }
  });

  return (
    <group ref={group}>
      <mesh geometry={cubeGeometry}>
        <meshPhysicalMaterial
          clearcoat={1}
          clearcoatRoughness={0.035}
          color="#9be8ff"
          depthWrite={false}
          envMapIntensity={1.6}
          ior={1.58}
          metalness={0.08}
          opacity={0.34}
          reflectivity={1}
          roughness={0.045}
          transmission={0.78}
          transparent
        />
      </mesh>
      <mesh geometry={cubeGeometry} scale={1.006}>
        <shaderMaterial
          ref={glass}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fragmentShader={glassFragment}
          transparent
          uniforms={{ uTime: { value: 0 }, uEnergy: { value: 1 } }}
          vertexShader={glassVertex}
        />
      </mesh>
      <lineSegments ref={circuits} geometry={circuitGeometry}>
        <lineBasicMaterial
          blending={THREE.AdditiveBlending}
          color={ICE}
          depthWrite={false}
          opacity={0.58}
          toneMapped={false}
          transparent
        />
      </lineSegments>
      <group ref={frame}>
        {edgeGeometries.map((geometry, index) => (
          <lineSegments key={index} geometry={geometry} rotation={[index * 0.17, index * 0.21, index * 0.13]}>
            <lineBasicMaterial
              blending={THREE.AdditiveBlending}
              color={index < 2 ? ICE : BLUE}
              depthWrite={false}
              opacity={0.72 - index * 0.09}
              toneMapped={false}
              transparent
            />
          </lineSegments>
        ))}
      </group>
      <CoreLight activity={activity} />
    </group>
  );
}

function HypercubeProjection({ activity }: { activity: AiActivity }) {
  const lineRef = useRef<THREE.LineSegments>(null);
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const data = useMemo(makeHypercubeData, []);
  const nodeGeometry = useMemo(() => new THREE.SphereGeometry(1, 10, 10), []);
  const geometry = useMemo(() => {
    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.BufferAttribute(data.positions, 3));
    return buffer;
  }, [data.positions]);

  useEffect(
    () => () => {
      geometry.dispose();
      nodeGeometry.dispose();
    },
    [geometry, nodeGeometry]
  );

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);
    const energy = activityEnergy(activity);
    const projected: THREE.Vector3[] = [];

    const angleXw = time * 0.24 * speed;
    const angleYz = time * 0.18 * speed;
    const angleZw = time * 0.15 * speed;
    const cxw = Math.cos(angleXw);
    const sxw = Math.sin(angleXw);
    const cyz = Math.cos(angleYz);
    const syz = Math.sin(angleYz);
    const czw = Math.cos(angleZw);
    const szw = Math.sin(angleZw);

    data.baseVertices.forEach(([x0, y0, z0, w0]) => {
      let x = x0;
      let y = y0;
      let z = z0;
      let w = w0;

      const nx = x * cxw - w * sxw;
      const nw = x * sxw + w * cxw;
      x = nx;
      w = nw;

      const ny = y * cyz - z * syz;
      const nz = y * syz + z * cyz;
      y = ny;
      z = nz;

      const nz2 = z * czw - w * szw;
      const nw2 = z * szw + w * czw;
      z = nz2;
      w = nw2;

      const perspective = 2.35 / (2.95 - w);
      projected.push(new THREE.Vector3(x * perspective, y * perspective, z * perspective).multiplyScalar(0.98));
    });

    data.edges.forEach(([a, b], edgeIndex) => {
      const offset = edgeIndex * 6;
      const pa = projected[a];
      const pb = projected[b];
      data.positions[offset] = pa.x;
      data.positions[offset + 1] = pa.y;
      data.positions[offset + 2] = pa.z;
      data.positions[offset + 3] = pb.x;
      data.positions[offset + 4] = pb.y;
      data.positions[offset + 5] = pb.z;
    });
    geometry.attributes.position.needsUpdate = true;

    if (lineRef.current) lineRef.current.scale.setScalar(1.04 + Math.sin(time * 2.8) * 0.018 * energy);
    if (nodesRef.current) {
      projected.forEach((point, index) => {
        dummy.position.copy(point);
        dummy.scale.setScalar(0.04 + (index % 3) * 0.006 + Math.sin(time * 4.4 + index) * 0.006 * energy);
        dummy.updateMatrix();
        nodesRef.current?.setMatrixAt(index, dummy.matrix);
      });
      nodesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group rotation={[0.56, 0.28, 0.1]} scale={1.18}>
      <lineSegments ref={lineRef} geometry={geometry}>
        <lineBasicMaterial
          blending={THREE.AdditiveBlending}
          color={BLUE}
          depthWrite={false}
          opacity={0.68}
          toneMapped={false}
          transparent
        />
      </lineSegments>
      <instancedMesh ref={nodesRef} args={[nodeGeometry, undefined, 16]}>
        <meshBasicMaterial blending={THREE.AdditiveBlending} color={ICE} depthWrite={false} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

function SpaceBeams({ activity }: { activity: AiActivity }) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => new THREE.PlaneGeometry(5.8, 0.26), []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);
    if (group.current) {
      group.current.rotation.z += delta * 0.08 * speed;
      group.current.scale.setScalar(1 + Math.sin(time * 3.6) * 0.025 * activityEnergy(activity));
    }
    if (material.current) {
      material.current.uniforms.uTime.value = time;
      material.current.uniforms.uEnergy.value = activityEnergy(activity);
    }
  });

  const rotations: [number, number, number][] = [
    [0, 0, 0],
    [0, 0, Math.PI / 2],
    [0.55, Math.PI / 2, 0],
    [-0.55, Math.PI / 2, 0],
    [0, 0, Math.PI / 4],
    [0, 0, -Math.PI / 4],
  ];

  return (
    <group ref={group}>
      {rotations.map((rotation, index) => (
        <mesh key={index} geometry={geometry} rotation={rotation}>
          <shaderMaterial
            ref={index === 0 ? material : undefined}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            fragmentShader={beamFragment}
            transparent
            uniforms={{ uTime: { value: 0 }, uEnergy: { value: 1 }, uColor: { value: new THREE.Color(index < 2 ? ICE : BLUE) } }}
            vertexShader={beamVertex}
          />
        </mesh>
      ))}
    </group>
  );
}

function ParticleHalo({ activity }: { activity: AiActivity }) {
  const count = 520;
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => new Float32Array(count * 3), []);
  const params = useMemo(() => {
    const rng = seededRandom(37111);
    return Array.from({ length: count }, () => ({
      radius: 1.7 + rng() * 2.6,
      angle: rng() * Math.PI * 2,
      y: (rng() - 0.5) * 3.6,
      speed: (0.08 + rng() * 0.44) * (rng() > 0.5 ? 1 : -1),
      wobble: rng() * Math.PI * 2,
      band: rng() > 0.76,
    }));
  }, []);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);
    const energy = activityEnergy(activity);
    for (let i = 0; i < count; i += 1) {
      const param = params[i];
      const angle = param.angle + time * param.speed * speed;
      const radius = param.radius + Math.sin(time * 0.8 + param.wobble) * 0.08 * energy;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = param.band ? Math.sin(angle * 3.0) * 0.34 : param.y;
      positions[i * 3 + 2] = Math.sin(angle) * radius * 0.62;
    }
    if (points.current) {
      points.current.rotation.x = 0.36;
      points.current.rotation.y = time * 0.018;
      points.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        blending={THREE.AdditiveBlending}
        color={ICE}
        depthWrite={false}
        opacity={0.52}
        size={0.028}
        sizeAttenuation
        toneMapped={false}
        transparent
      />
    </points>
  );
}

function ShardField({ activity }: { activity: AiActivity }) {
  const lines = useRef<THREE.LineSegments>(null);
  const geometry = useMemo(buildPrismaticShardGeometry, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(({ clock }, delta) => {
    if (lines.current) {
      lines.current.rotation.y += delta * 0.025 * activitySpeed(activity);
      lines.current.rotation.z = Math.sin(clock.elapsedTime * 0.22) * 0.08;
    }
  });

  return (
    <lineSegments ref={lines} geometry={geometry}>
      <lineBasicMaterial
        blending={THREE.AdditiveBlending}
        color={BLUE}
        depthWrite={false}
        opacity={0.42}
        toneMapped={false}
        transparent
      />
    </lineSegments>
  );
}

function TesseractRings({ activity }: { activity: AiActivity }) {
  const rings = useRef<THREE.Group>(null);
  useFrame(({ clock }, delta) => {
    if (!rings.current) return;
    rings.current.rotation.y += delta * 0.16 * activitySpeed(activity);
    rings.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 2.2) * 0.018 * activityEnergy(activity));
  });

  return (
    <group ref={rings}>
      {[
        { radius: 2.3, tube: 0.007, rotation: [Math.PI / 2, 0, 0] },
        { radius: 2.08, tube: 0.005, rotation: [1.12, 0.2, 0.46] },
        { radius: 1.72, tube: 0.004, rotation: [0.42, 1.05, -0.18] },
      ].map((ring, index) => (
        <mesh key={index} rotation={ring.rotation as [number, number, number]}>
          <torusGeometry args={[ring.radius, ring.tube, 6, 160]} />
          <meshBasicMaterial
            blending={THREE.AdditiveBlending}
            color={index === 0 ? ICE : BLUE}
            depthWrite={false}
            opacity={0.18 + index * 0.08}
            toneMapped={false}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

function BackgroundStarfield() {
  const count = 700;
  const positions = useMemo(() => {
    const rng = seededRandom(2048);
    const data = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const theta = rng() * Math.PI * 2;
      const phi = Math.acos(2 * rng() - 1);
      const radius = 5 + rng() * 7.5;
      data[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      data[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      data[index * 3 + 2] = radius * Math.cos(phi);
    }
    return data;
  }, []);
  const points = useRef<THREE.Points>(null);

  useFrame(({ clock }) => {
    if (points.current) points.current.rotation.y = clock.elapsedTime * 0.004;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        blending={THREE.AdditiveBlending}
        color="#ffffff"
        depthWrite={false}
        opacity={0.38}
        size={0.018}
        sizeAttenuation
        toneMapped={false}
        transparent
      />
    </points>
  );
}

function HoverZoomRig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const { gl } = useThree();
  const hovered = useRef(false);
  const currentScale = useRef(1);

  useEffect(() => {
    const canvas = gl.domElement;
    const onEnter = () => {
      hovered.current = true;
    };
    const onLeave = () => {
      hovered.current = false;
    };
    canvas.addEventListener("pointerenter", onEnter);
    canvas.addEventListener("pointerleave", onLeave);
    return () => {
      canvas.removeEventListener("pointerenter", onEnter);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [gl.domElement]);

  useFrame(() => {
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, hovered.current ? 1.1 : 1, 0.06);
    if (group.current) group.current.scale.setScalar(currentScale.current);
  });

  return <group ref={group}>{children}</group>;
}

export function SpaceScene({ activity = "idle" }: { activity?: AiActivity }) {
  return (
    <group name="blue-space-tesseract-ai-core" scale={0.96}>
      <color attach="background" args={[DARK]} />
      <ambientLight color={DEEP} intensity={0.42} />
      <directionalLight color={ICE} intensity={1.45} position={[3, 4, 5]} />
      <pointLight color={BLUE} distance={11} intensity={2.4} position={[-2.4, 1.2, 2.2]} />

      <HoverZoomRig>
        <BackgroundStarfield />
        <ParticleHalo activity={activity} />
        <ShardField activity={activity} />
        <TesseractRings activity={activity} />
        <SpaceBeams activity={activity} />
        <HypercubeProjection activity={activity} />
        <TesseractGlassCore activity={activity} />
      </HoverZoomRig>
    </group>
  );
}
