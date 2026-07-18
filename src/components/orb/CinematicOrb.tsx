import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { AiActivity } from "../../App";

type CinematicOrbProps = {
  activity: AiActivity;
};

const GOLD = new THREE.Color("#ff5a0a");
const HOT_GOLD = new THREE.Color("#ff9318");
const WHITE_HOT = new THREE.Color("#fffdf2");

function mulberry32(seed: number) {
  return () => {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function activityEnergy(activity: AiActivity) {
  if (activity === "speaking") return 1.55;
  if (activity === "thinking") return 1.3;
  if (activity === "listening") return 0.88;
  return 1;
}

function activitySpeed(activity: AiActivity) {
  if (activity === "speaking") return 2.15;
  if (activity === "thinking") return 1.65;
  if (activity === "listening") return 0.48;
  return 1;
}

function CoreGlow({ activity }: CinematicOrbProps) {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const innerRing = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    if (!group.current || !shell.current || !innerRing.current) return;
    const t = clock.elapsedTime;
    const energy = activityEnergy(activity);
    const voice = activity === "speaking" ? Math.abs(Math.sin(t * 8.4)) * 0.14 : 0;
    const heartbeat = Math.pow(Math.max(0, Math.sin(t * 2.35)), 12) * 0.08;
    const scale = 1 + voice + heartbeat + Math.sin(t * 1.7) * 0.025;
    group.current.scale.setScalar(scale);
    shell.current.scale.setScalar(1 + Math.sin(t * 2.1) * 0.07 * energy);
    innerRing.current.rotation.z += delta * 0.75 * activitySpeed(activity);
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[0.19, 48, 48]} />
        <meshBasicMaterial color={WHITE_HOT} toneMapped={false} />
      </mesh>
      <mesh ref={shell}>
        <sphereGeometry args={[0.31, 40, 40]} />
        <meshBasicMaterial
          blending={THREE.AdditiveBlending}
          color={HOT_GOLD}
          depthWrite={false}
          opacity={0.72}
          toneMapped={false}
          transparent
        />
      </mesh>
      <mesh scale={1.55}>
        <sphereGeometry args={[0.38, 40, 40]} />
        <meshBasicMaterial
          blending={THREE.AdditiveBlending}
          color={GOLD}
          depthWrite={false}
          opacity={0.13}
          toneMapped={false}
          transparent
        />
      </mesh>
      <mesh ref={innerRing} rotation={[1.18, 0.32, 0.18]}>
        <torusGeometry args={[0.48, 0.018, 8, 120]} />
        <meshBasicMaterial
          blending={THREE.AdditiveBlending}
          color={WHITE_HOT}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh rotation={[0.4, 1.08, 0.55]}>
        <torusGeometry args={[0.62, 0.009, 6, 120]} />
        <meshBasicMaterial
          blending={THREE.AdditiveBlending}
          color={HOT_GOLD}
          depthWrite={false}
          opacity={0.8}
          toneMapped={false}
          transparent
        />
      </mesh>
    </group>
  );
}

function RadialSpikes({ activity }: CinematicOrbProps) {
  const material = useRef<THREE.LineBasicMaterial>(null);
  const geometry = useMemo(() => {
    const positions: number[] = [];
    const directions = [
      [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1],
      [1, 1, 0.22], [-1, 1, -0.22], [1, -1, -0.18], [-1, -1, 0.18],
      [1, 0.24, 1], [-1, -0.24, 1], [1, -0.22, -1], [-1, 0.22, -1],
      [0.2, 1, 1], [-0.2, -1, 1], [-0.24, 1, -1], [0.24, -1, -1],
      [1, 0.38, -0.62], [-1, -0.38, 0.62], [0.6, -0.32, 1], [-0.6, 0.32, -1]
    ];
    directions.forEach((values, index) => {
      const direction = new THREE.Vector3(values[0], values[1], values[2]).normalize();
      const start = direction.clone().multiplyScalar(index % 4 === 0 ? 0.18 : 0.42);
      const length = index % 6 === 0 ? 4.7 : 2.35 + (index % 5) * 0.27;
      const end = direction.clone().multiplyScalar(length);
      positions.push(start.x, start.y, start.z, end.x, end.y, end.z);
    });
    const result = new THREE.BufferGeometry();
    result.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return result;
  }, []);

  useFrame(({ clock }) => {
    if (!material.current) return;
    const t = clock.elapsedTime;
    material.current.opacity = (0.22 + Math.abs(Math.sin(t * 2.7 + Math.sin(t * 0.7))) * 0.38) * activityEnergy(activity);
  });

  return (
    <lineSegments geometry={geometry} rotation={[0.13, -0.21, 0.07]}>
      <lineBasicMaterial
        ref={material}
        blending={THREE.AdditiveBlending}
        color={HOT_GOLD}
        depthWrite={false}
        toneMapped={false}
        transparent
      />
    </lineSegments>
  );
}

type OrbitDescriptor = {
  radius: number;
  start: number;
  span: number;
  rotation: [number, number, number];
  speed: number;
  direction: number;
  opacity: number;
};

const ORBIT_PLANES: Array<[number, number, number]> = [
  [1.3, 0.08, 0.02],
  [1.08, 0.46, 0.52],
  [0.38, 1.18, 0.22],
  [0.82, -0.66, 1.06],
  [-0.52, 0.94, -0.44],
  [1.46, 0.18, 1.54]
];

const ORBITS: OrbitDescriptor[] = Array.from({ length: 12 }, (_, index) => {
  const random = mulberry32(1500 + index * 31);
  return {
    radius: 0.92 + index * 0.125 + (index % 3) * 0.035,
    start: (index * Math.PI) / 6 + random() * 0.18,
    span: Math.PI * (index < 4 ? 1.88 : 1.42 + (index % 3) * 0.18),
    rotation: ORBIT_PLANES[index % ORBIT_PLANES.length],
    speed: 0.065 + (index % 6) * 0.022,
    direction: index % 2 === 0 ? 1 : -1,
    opacity: 0.28 + (index % 4) * 0.1
  };
});

function OrbitPath({ descriptor, activity, index }: { descriptor: OrbitDescriptor; activity: AiActivity; index: number }) {
  const group = useRef<THREE.Group>(null);
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 84;
    for (let step = 0; step <= segments; step += 1) {
      const angle = descriptor.start + descriptor.span * (step / segments);
      const wobble = Math.sin(angle * (3 + (index % 4))) * (0.018 + (index % 3) * 0.008);
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * (descriptor.radius + wobble),
          Math.sin(angle) * (descriptor.radius * (0.74 + (index % 5) * 0.045) + wobble),
          Math.sin(angle * 2.2 + index) * 0.12
        )
      );
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [descriptor, index]);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const speed = activitySpeed(activity);
    group.current.rotation.z += delta * descriptor.speed * descriptor.direction * speed;
    group.current.rotation.y += delta * descriptor.speed * 0.22 * -descriptor.direction * speed;
    group.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 1.2 + index) * 0.006 * activityEnergy(activity));
  });

  return (
    <group ref={group} rotation={descriptor.rotation}>
      <line geometry={geometry}>
        <lineBasicMaterial
          blending={THREE.AdditiveBlending}
          color={index % 4 === 0 ? HOT_GOLD : GOLD}
          depthWrite={false}
          opacity={descriptor.opacity}
          toneMapped={false}
          transparent
        />
      </line>
    </group>
  );
}

function OrbitRings({ activity }: CinematicOrbProps) {
  return (
    <group>
      {ORBITS.map((descriptor, index) => (
        <OrbitPath activity={activity} descriptor={descriptor} index={index} key={index} />
      ))}
    </group>
  );
}

function HolographicTriangles({ activity }: CinematicOrbProps) {
  const group = useRef<THREE.Group>(null);
  const geometry = useMemo(() => {
    const random = mulberry32(8137);
    const positions: number[] = [];
    const addEdge = (a: THREE.Vector3, b: THREE.Vector3) => {
      positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    };

    for (let index = 0; index < 42; index += 1) {
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      const center = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
      ).multiplyScalar(1.05 + random() * 0.92);
      const normal = center.clone().normalize();
      const tangent = new THREE.Vector3(0, 1, 0).cross(normal);
      if (tangent.lengthSq() < 0.01) tangent.set(1, 0, 0);
      tangent.normalize();
      const bitangent = normal.clone().cross(tangent).normalize();
      const size = 0.12 + random() * 0.28;
      const a = center.clone().addScaledVector(tangent, size);
      const b = center.clone().addScaledVector(tangent, -size * 0.72).addScaledVector(bitangent, size * 0.76);
      const c = center.clone().addScaledVector(tangent, -size * 0.72).addScaledVector(bitangent, -size * 0.76);
      addEdge(a, b);
      addEdge(b, c);
      addEdge(c, a);
    }

    const result = new THREE.BufferGeometry();
    result.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return result;
  }, []);

  const polyhedron = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.18, 1), 8), []);
  const innerPolyhedron = useMemo(() => new THREE.EdgesGeometry(new THREE.TetrahedronGeometry(0.72, 1), 5), []);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const speed = activitySpeed(activity);
    group.current.rotation.y += delta * 0.075 * speed;
    group.current.rotation.x = Math.sin(clock.elapsedTime * 0.24) * 0.18;
    group.current.rotation.z -= delta * 0.026 * speed;
  });

  return (
    <group ref={group}>
      <lineSegments geometry={polyhedron}>
        <lineBasicMaterial
          blending={THREE.AdditiveBlending}
          color={HOT_GOLD}
          depthWrite={false}
          opacity={0.5}
          toneMapped={false}
          transparent
        />
      </lineSegments>
      <lineSegments geometry={innerPolyhedron} rotation={[0.4, 0.22, 0.7]}>
        <lineBasicMaterial
          blending={THREE.AdditiveBlending}
          color={WHITE_HOT}
          depthWrite={false}
          opacity={0.72}
          toneMapped={false}
          transparent
        />
      </lineSegments>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial
          blending={THREE.AdditiveBlending}
          color={GOLD}
          depthWrite={false}
          opacity={0.36}
          toneMapped={false}
          transparent
        />
      </lineSegments>
    </group>
  );
}

function InnerGrid({ activity }: CinematicOrbProps) {
  const geometry = useMemo(() => {
    const random = mulberry32(9842);
    const positions: number[] = [];
    const colors: number[] = [];
    const phases: number[] = [];
    for (let index = 0; index < 230; index += 1) {
      const radius = 0.58 + random() * 1.52;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      const a = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
      ).multiplyScalar(radius);
      const chord = index % 5 === 0;
      const offset = chord
        ? new THREE.Vector3().randomDirection().multiplyScalar(0.8 + random() * 1.1)
        : new THREE.Vector3().randomDirection().multiplyScalar(0.12 + random() * 0.44);
      const b = a.clone().add(offset).clampLength(0.28, 2.2);
      positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
      const depthA = THREE.MathUtils.clamp((a.z + 2.2) / 4.4, 0.12, 1);
      const depthB = THREE.MathUtils.clamp((b.z + 2.2) / 4.4, 0.12, 1);
      const colorA = GOLD.clone().multiplyScalar(0.25 + depthA * 0.9);
      const colorB = HOT_GOLD.clone().multiplyScalar(0.2 + depthB * 0.95);
      colors.push(colorA.r, colorA.g, colorA.b, colorB.r, colorB.g, colorB.b);
      phases.push(random() * Math.PI * 2, random() * Math.PI * 2);
    }
    const result = new THREE.BufferGeometry();
    result.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    result.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    result.userData.base = new Float32Array(positions);
    result.userData.phases = new Float32Array(phases);
    return result;
  }, []);
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    const attribute = geometry.getAttribute("position") as THREE.BufferAttribute;
    const base = geometry.userData.base as Float32Array;
    const phases = geometry.userData.phases as Float32Array;
    const amplitude = activity === "thinking" ? 0.046 : activity === "speaking" ? 0.032 : 0.018;
    for (let vertex = 0; vertex < attribute.count; vertex += 1) {
      const offset = vertex * 3;
      const pulse = Math.sin(t * (0.55 + (vertex % 7) * 0.05) + phases[vertex]) * amplitude;
      attribute.setXYZ(
        vertex,
        base[offset] * (1 + pulse),
        base[offset + 1] * (1 - pulse * 0.7),
        base[offset + 2] + pulse * 0.45
      );
    }
    attribute.needsUpdate = true;
    group.current.rotation.y += delta * 0.035 * activitySpeed(activity);
    group.current.rotation.x -= delta * 0.012;
  });

  return (
    <group ref={group}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.48}
          toneMapped={false}
          transparent
          vertexColors
        />
      </lineSegments>
    </group>
  );
}

function ParticleShell({ activity }: CinematicOrbProps) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => {
    const random = mulberry32(42069);
    const count = 1900;
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const sizes = new Float32Array(count);
    const speeds = new Float32Array(count);
    for (let index = 0; index < count; index += 1) {
      const shellBias = index < 1450;
      const radius = shellBias ? 1.85 + (random() - 0.5) * 0.46 : Math.pow(random(), 0.38) * 1.9;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      positions[index * 3] = Math.sin(phi) * Math.cos(theta) * radius;
      positions[index * 3 + 1] = Math.cos(phi) * radius;
      positions[index * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius;
      phases[index] = random() * Math.PI * 2;
      sizes[index] = 1.2 + random() * (index % 17 === 0 ? 5.4 : 2.5);
      speeds[index] = 0.35 + random() * 1.35;
    }
    const result = new THREE.BufferGeometry();
    result.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    result.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    result.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    result.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    return result;
  }, []);

  const shader = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uEnergy: { value: 1 }
      },
      vertexShader: `
        attribute float aPhase;
        attribute float aSize;
        attribute float aSpeed;
        uniform float uTime;
        uniform float uEnergy;
        varying float vGlow;
        void main() {
          vec3 p = position;
          float angle = uTime * (0.018 + aSpeed * 0.014);
          float c = cos(angle);
          float s = sin(angle);
          p.xz = mat2(c, -s, s, c) * p.xz;
          p *= 1.0 + sin(uTime * aSpeed + aPhase) * 0.018 * uEnergy;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = aSize * (15.0 / max(1.0, -mv.z)) * (0.8 + uEnergy * 0.3);
          vGlow = 0.32 + 0.68 * pow(0.5 + 0.5 * sin(uTime * aSpeed * 2.0 + aPhase), 3.0);
        }
      `,
      fragmentShader: `
        varying float vGlow;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float alpha = smoothstep(0.5, 0.02, d) * vGlow;
          vec3 color = mix(vec3(1.0, 0.22, 0.012), vec3(1.0, 0.56, 0.055), vGlow);
          gl_FragColor = vec4(color, alpha);
        }
      `
    }),
    []
  );

  useFrame(({ clock }) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = clock.elapsedTime;
    material.current.uniforms.uEnergy.value = activityEnergy(activity);
  });

  return (
    <points geometry={geometry} rotation={[0.08, 0.18, -0.04]}>
      <shaderMaterial
        ref={material}
        args={[shader]}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
        transparent
      />
    </points>
  );
}

const ARC_SETTINGS = [
  { radius: 2.08, span: 1.22, start: 0.1, rotation: [0.42, 0.18, 0.16] as [number, number, number], speed: 0.08 },
  { radius: 2.28, span: 1.65, start: 2.2, rotation: [1.16, 0.48, 0.8] as [number, number, number], speed: -0.055 },
  { radius: 2.42, span: 0.92, start: 4.15, rotation: [0.2, 1.22, 0.35] as [number, number, number], speed: 0.04 },
  { radius: 2.18, span: 1.44, start: 5.08, rotation: [1.34, 0.12, 1.5] as [number, number, number], speed: -0.07 }
];

function OuterArc({ setting, activity, index }: { setting: (typeof ARC_SETTINGS)[number]; activity: AiActivity; index: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let step = 0; step <= 96; step += 1) {
      const angle = setting.start + setting.span * (step / 96);
      const jitter = Math.sin(angle * 17 + index) * 0.018;
      points.push(new THREE.Vector3(Math.cos(angle) * (setting.radius + jitter), Math.sin(angle) * (setting.radius + jitter), Math.sin(angle * 3) * 0.08));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 96, 0.014 + index * 0.002, 4, false);
  }, [index, setting]);

  useFrame(({ clock }, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.z += delta * setting.speed * activitySpeed(activity);
    mesh.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 0.8 + index) * 0.012);
  });

  return (
    <mesh ref={mesh} geometry={geometry} rotation={setting.rotation}>
      <meshBasicMaterial
        blending={THREE.AdditiveBlending}
        color={index === 0 ? HOT_GOLD : GOLD}
        depthWrite={false}
        opacity={0.62 - index * 0.07}
        toneMapped={false}
        transparent
      />
    </mesh>
  );
}

function OuterArcs({ activity }: CinematicOrbProps) {
  return (
    <group>
      {ARC_SETTINGS.map((setting, index) => (
        <OuterArc activity={activity} index={index} key={index} setting={setting} />
      ))}
    </group>
  );
}

function EnergyPackets({ activity }: CinematicOrbProps) {
  const points = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const count = 72;
    const positions = new Float32Array(count * 3);
    const data = Array.from({ length: count }, (_, index) => ({
      orbit: index % 9,
      phase: (index / count) * Math.PI * 2 + (index % 5) * 0.41,
      speed: 0.42 + (index % 7) * 0.08
    }));
    const result = new THREE.BufferGeometry();
    result.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    result.userData.packets = data;
    return result;
  }, []);

  useFrame(({ clock }) => {
    if (!points.current) return;
    const t = clock.elapsedTime;
    const attribute = geometry.getAttribute("position") as THREE.BufferAttribute;
    const packets = geometry.userData.packets as Array<{ orbit: number; phase: number; speed: number }>;
    const speedBoost = activitySpeed(activity);
    packets.forEach((packet, index) => {
      const angle = packet.phase + t * packet.speed * speedBoost;
      const radius = 0.82 + packet.orbit * 0.16;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * (0.58 + packet.orbit * 0.025);
      const z = Math.sin(angle * (1.6 + packet.orbit * 0.04) + packet.orbit) * (0.42 + packet.orbit * 0.09);
      attribute.setXYZ(index, x, y, z);
    });
    attribute.needsUpdate = true;
    points.current.rotation.y = t * 0.035;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        blending={THREE.AdditiveBlending}
        color={HOT_GOLD}
        depthWrite={false}
        opacity={0.95}
        size={0.052}
        sizeAttenuation
        toneMapped={false}
        transparent
      />
    </points>
  );
}

function OrbitalNodes({ activity }: CinematicOrbProps) {
  const points = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const result = new THREE.BufferGeometry();
    result.setAttribute("position", new THREE.BufferAttribute(new Float32Array(10 * 3), 3));
    return result;
  }, []);

  useFrame(({ clock }) => {
    if (!points.current) return;
    const t = clock.elapsedTime * activitySpeed(activity);
    const attribute = geometry.getAttribute("position") as THREE.BufferAttribute;
    for (let index = 0; index < 10; index += 1) {
      const direction = index % 3 === 0 ? -1 : 1;
      const angle = t * (0.18 + index * 0.018) * direction + index * 0.71;
      const radius = 1.02 + index * 0.135;
      attribute.setXYZ(
        index,
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * (0.48 + (index % 4) * 0.11),
        Math.sin(angle * (1.35 + (index % 3) * 0.22) + index) * (0.28 + index * 0.055)
      );
    }
    attribute.needsUpdate = true;
    points.current.rotation.set(Math.sin(t * 0.025) * 0.14, t * 0.018, Math.cos(t * 0.02) * 0.08);
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        blending={THREE.AdditiveBlending}
        color={HOT_GOLD}
        depthWrite={false}
        opacity={1}
        size={0.105}
        sizeAttenuation
        toneMapped={false}
        transparent
      />
    </points>
  );
}

function RadarSweeps({ activity }: CinematicOrbProps) {
  const rings = [useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null)];
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    rings.forEach((ring, index) => {
      if (!ring.current) return;
      const phase = (t * (activity === "listening" ? 0.72 : 0.24) + index / rings.length) % 1;
      ring.current.scale.setScalar(0.4 + phase * 4.4);
      const material = ring.current.material as THREE.MeshBasicMaterial;
      material.opacity = activity === "listening" ? (1 - phase) * 0.46 : (1 - phase) * 0.07;
    });
  });
  return (
    <group rotation={[1.16, 0.22, 0.18]}>
      {rings.map((ring, index) => (
        <mesh ref={ring} key={index}>
          <torusGeometry args={[0.54, 0.006, 4, 96]} />
          <meshBasicMaterial
            blending={THREE.AdditiveBlending}
            color={HOT_GOLD}
            depthWrite={false}
            toneMapped={false}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

function SceneRig({ activity }: CinematicOrbProps) {
  const group = useRef<THREE.Group>(null);
  const { camera, size } = useThree();
  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const narrowViewport = size.width / size.height < 0.72;
    const cameraDistance = narrowViewport ? 13.2 : 7.25;
    if (group.current) {
      const energy = activityEnergy(activity);
      const breath = 1 + Math.sin(t * 1.25) * 0.012 * energy;
      group.current.scale.setScalar(breath);
      group.current.rotation.y += delta * 0.018;
      group.current.rotation.z = Math.sin(t * 0.23) * 0.018;
    }
    camera.position.x = Math.sin(t * 0.16) * (narrowViewport ? 0.05 : 0.11);
    camera.position.y = Math.cos(t * 0.13) * (narrowViewport ? 0.04 : 0.08);
    camera.position.z = cameraDistance + Math.sin(t * 0.21) * 0.12;
    camera.lookAt(0, 0, 0);
  });
  return (
    <group ref={group}>
      <ParticleShell activity={activity} />
      <OrbitRings activity={activity} />
      <EnergyPackets activity={activity} />
      <OrbitalNodes activity={activity} />
      <CoreGlow activity={activity} />
    </group>
  );
}

function PostFX({ activity }: CinematicOrbProps) {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={activity === "speaking" ? 2.2 : activity === "thinking" ? 2 : 1.8}
        luminanceSmoothing={0.65}
        luminanceThreshold={0.35}
        mipmapBlur
      />
    </EffectComposer>
  );
}

export default function CinematicOrb({ activity }: CinematicOrbProps) {
  return (
    <div className="orb-webgl" aria-hidden="true">
      <Canvas
        camera={{ fov: 42, near: 0.1, far: 30, position: [0, 0, 7.25] }}
        dpr={[1, 1.6]}
        gl={{
          alpha: false,
          antialias: false,
          powerPreference: "high-performance",
          stencil: false
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor("#000000", 1);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.08;
          scene.fog = new THREE.FogExp2("#000000", 0.055);
        }}
      >
        <SceneRig activity={activity} />
        <PostFX activity={activity} />
      </Canvas>
    </div>
  );
}
