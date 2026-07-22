import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AiActivity } from "../types/orb";

type RealmVariant = "tesseract" | "mystic" | "asgard" | "alien" | "arc";

type RealmAtmosphereProps = {
  activity: AiActivity;
  primary: string;
  secondary: string;
  hot: string;
  variant: RealmVariant;
};

const TAU = Math.PI * 2;
const VARIANT_SEED: Record<RealmVariant, number> = {
  tesseract: 101,
  mystic: 211,
  asgard: 307,
  alien: 401,
  arc: 503,
};

const ORBIT_ROTATIONS: Array<[number, number, number]> = [
  [0.15, 0.22, 0.08],
  [0.92, 0.18, -0.38],
  [0.28, 1.05, 0.48],
  [1.34, 0.42, 0.72],
  [0.62, 1.28, -0.18],
  [1.12, 0.78, 1.18],
  [0.18, 0.34, 1.42],
];

function seededRandom(seed: number) {
  return () => {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function activitySpeed(activity: AiActivity) {
  if (activity === "speaking") return 2.05;
  if (activity === "thinking") return 1.5;
  if (activity === "listening") return 0.58;
  return 1;
}

function activityEnergy(activity: AiActivity) {
  if (activity === "speaking") return 1.55;
  if (activity === "thinking") return 1.28;
  if (activity === "listening") return 0.86;
  return 1;
}

function buildBrokenOrbit(radius: number, index: number, seed: number) {
  const random = seededRandom(seed + index * 37);
  const positions: number[] = [];
  const segments = 150;
  const squash = 0.72 + random() * 0.26;
  const gapA = random() * TAU;
  const gapB = random() * TAU;
  for (let step = 0; step < segments; step += 1) {
    const a = (step / segments) * TAU;
    const b = ((step + 1) / segments) * TAU;
    const gap = Math.abs(Math.sin((a - gapA) * 1.7)) < 0.12 || Math.abs(Math.sin((a - gapB) * 2.2)) < 0.1 || (step + seed) % 29 === 0;
    if (gap) continue;
    const rippleA = 1 + Math.sin(a * (3 + index % 4) + seed) * 0.018;
    const rippleB = 1 + Math.sin(b * (3 + index % 4) + seed) * 0.018;
    positions.push(Math.cos(a) * radius * rippleA, Math.sin(a * 2 + index) * 0.025, Math.sin(a) * radius * squash * rippleA);
    positions.push(Math.cos(b) * radius * rippleB, Math.sin(b * 2 + index) * 0.025, Math.sin(b) * radius * squash * rippleB);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return geometry;
}

function buildSpokes(seed: number) {
  const random = seededRandom(seed * 17);
  const positions: number[] = [];
  for (let index = 0; index < 54; index += 1) {
    const theta = random() * TAU;
    const phi = Math.acos(2 * random() - 1);
    const direction = new THREE.Vector3(Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta));
    const start = direction.clone().multiplyScalar(0.22 + random() * 0.38);
    const end = direction.multiplyScalar(index % 9 === 0 ? 2.75 + random() * 0.35 : 1.15 + random() * 1.08);
    positions.push(start.x, start.y, start.z, end.x, end.y, end.z);
  }
  return new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
}

function buildFilaments(seed: number) {
  const random = seededRandom(seed * 29);
  const positions: number[] = [];
  for (let filament = 0; filament < 10; filament += 1) {
    const rotation = new THREE.Euler(random() * 1.5, random() * 1.4, random() * 1.5);
    const points: THREE.Vector3[] = [];
    for (let step = 0; step < 36; step += 1) {
      const progress = step / 35;
      const angle = progress * (4.4 + random() * 1.1) + filament * 0.63;
      const radius = 0.38 + progress * (1.52 + random() * 0.45);
      points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(progress * Math.PI * 3 + filament) * 0.24, Math.sin(angle) * radius).applyEuler(rotation));
    }
    for (let step = 0; step < points.length - 1; step += 1) positions.push(points[step].x, points[step].y, points[step].z, points[step + 1].x, points[step + 1].y, points[step + 1].z);
  }
  return new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
}

function buildDust(seed: number) {
  const random = seededRandom(seed * 43);
  const positions = new Float32Array(520 * 3);
  for (let index = 0; index < 520; index += 1) {
    const theta = random() * TAU;
    const phi = Math.acos(2 * random() - 1);
    const clustered = index % 5 === 0;
    const radius = clustered ? 1.1 + random() * 1.2 : 1.8 + random() * 2.0;
    positions[index * 3] = Math.sin(phi) * Math.cos(theta) * radius;
    positions[index * 3 + 1] = Math.cos(phi) * radius * (0.72 + random() * 0.25);
    positions[index * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius;
  }
  return new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(positions, 3));
}

function fragmentGeometry(variant: RealmVariant) {
  if (variant === "tesseract" || variant === "arc") return new THREE.BoxGeometry(0.11, 0.11, 0.11);
  if (variant === "alien") return new THREE.TetrahedronGeometry(0.12, 0);
  return new THREE.OctahedronGeometry(0.1, 0);
}

function RealmFresnel({ activity, color }: { activity: AiActivity; color: string }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const shader = useMemo(() => ({
    uniforms: { uColor: { value: new THREE.Color(color) }, uEnergy: { value: 1 } },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vView = normalize(cameraPosition - world.xyz);
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uEnergy;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        float edge = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 3.7);
        gl_FragColor = vec4(uColor, edge * 0.095 * uEnergy);
      }
    `,
  }), [color]);

  useFrame(() => {
    if (material.current) material.current.uniforms.uEnergy.value = activityEnergy(activity);
  });

  return (
    <mesh scale={1.04}>
      <sphereGeometry args={[2.5, 32, 32]} />
      <shaderMaterial ref={material} args={[shader]} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.BackSide} toneMapped={false} transparent />
    </mesh>
  );
}

export function RealmAtmosphere({ activity, primary, secondary, hot, variant }: RealmAtmosphereProps) {
  const seed = VARIANT_SEED[variant];
  const root = useRef<THREE.Group>(null);
  const orbitGroup = useRef<THREE.Group>(null);
  const orbitRefs = useRef<THREE.LineSegments[]>([]);
  const dust = useRef<THREE.Points>(null);
  const fragments = useRef<THREE.InstancedMesh>(null);
  const packetPoints = useRef<THREE.Points>(null);
  const spokesMaterial = useRef<THREE.LineBasicMaterial>(null);
  const filamentMaterial = useRef<THREE.LineBasicMaterial>(null);
  const pulseRings = useRef<THREE.Mesh[]>([]);
  const orbitGeometries = useMemo(() => [1.12, 1.38, 1.65, 1.92, 2.18, 2.45, 2.74].map((radius, index) => buildBrokenOrbit(radius, index, seed)), [seed]);
  const spokeGeometry = useMemo(() => buildSpokes(seed), [seed]);
  const filamentGeometry = useMemo(() => buildFilaments(seed), [seed]);
  const dustGeometry = useMemo(() => buildDust(seed), [seed]);
  const shardGeometry = useMemo(() => fragmentGeometry(variant), [variant]);
  const packetGeometry = useMemo(() => new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(new Float32Array(72 * 3), 3)), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const packetPoint = useMemo(() => new THREE.Vector3(), []);
  const orbitEulers = useMemo(() => ORBIT_ROTATIONS.map((rotation) => new THREE.Euler(...rotation)), []);

  useEffect(() => {
    if (fragments.current) {
      for (let index = 0; index < 64; index += 1) {
        const angle = (index / 64) * TAU + Math.sin(index * 1.73) * 0.18;
        const radius = 1.72 + ((index * 17) % 19) / 19 * 1.18;
        const lift = Math.sin(index * 2.07) * (0.72 + (index % 5) * 0.1);
        dummy.position.set(Math.cos(angle) * radius, lift, Math.sin(angle) * radius * 0.82);
        dummy.rotation.set(angle * 0.37, index * 0.41, angle);
        const base = index % 11 === 0 ? 1.8 : index % 4 === 0 ? 1.18 : 0.62;
        const shape: [number, number, number] = variant === "tesseract" ? [base, base, base]
          : variant === "arc" ? [base * 1.8, base * 0.35, base * 0.35]
            : variant === "mystic" ? [base * 0.42, base * 1.35, base * 0.5]
              : [base, base * 0.65, base * 0.46];
        dummy.scale.set(...shape);
        dummy.updateMatrix();
        fragments.current.setMatrixAt(index, dummy.matrix);
      }
      fragments.current.instanceMatrix.needsUpdate = true;
    }
    return () => {
      orbitGeometries.forEach((geometry) => geometry.dispose());
      spokeGeometry.dispose();
      filamentGeometry.dispose();
      dustGeometry.dispose();
      shardGeometry.dispose();
      packetGeometry.dispose();
    };
  }, [dummy, dustGeometry, filamentGeometry, orbitGeometries, packetGeometry, shardGeometry, spokeGeometry, variant]);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const speed = activitySpeed(activity);
    const energy = activityEnergy(activity);
    if (root.current) {
      root.current.rotation.y += delta * 0.026 * speed;
      root.current.rotation.z = Math.sin(t * 0.1) * 0.028;
    }
    if (orbitGroup.current) orbitGroup.current.rotation.y -= delta * 0.035 * speed;
    orbitRefs.current.forEach((orbit, index) => {
      orbit.rotation.z += delta * (index % 2 ? -1 : 1) * (0.018 + index * 0.006) * speed;
      const material = orbit.material as THREE.LineBasicMaterial;
      material.opacity = (0.18 + (index % 3) * 0.07) * energy + (activity === "speaking" ? Math.pow(0.5 + 0.5 * Math.sin(t * 6.5 - index), 6) * 0.32 : 0);
    });
    if (dust.current) {
      dust.current.rotation.y += delta * 0.055 * speed;
      dust.current.rotation.x = Math.sin(t * 0.17) * 0.12;
      const material = dust.current.material as THREE.PointsMaterial;
      material.opacity = 0.34 * energy + (activity === "thinking" ? Math.pow(0.5 + 0.5 * Math.sin(t * 4), 5) * 0.2 : 0);
    }
    if (fragments.current) {
      fragments.current.rotation.y -= delta * 0.09 * speed;
      fragments.current.rotation.x = Math.sin(t * 0.14) * 0.12;
      const material = fragments.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.38 + energy * 0.18;
    }
    if (spokesMaterial.current) spokesMaterial.current.opacity = 0.1 + energy * 0.1 + (activity === "speaking" ? Math.pow(0.5 + 0.5 * Math.sin(t * 8.2), 8) * 0.4 : 0);
    if (filamentMaterial.current) filamentMaterial.current.opacity = 0.14 + energy * 0.12 + (activity === "thinking" ? Math.pow(0.5 + 0.5 * Math.sin(t * 3.5), 7) * 0.28 : 0);

    const packetAttribute = packetGeometry.getAttribute("position") as THREE.BufferAttribute;
    for (let index = 0; index < 72; index += 1) {
      const orbitIndex = index % 7;
      const progress = (t * (0.035 + (index % 6) * 0.009) * speed + index * 0.137) % 1;
      const angle = progress * TAU;
      const radius = 1.08 + orbitIndex * 0.27;
      packetPoint.set(Math.cos(angle) * radius, Math.sin(angle * 2 + orbitIndex) * 0.035, Math.sin(angle) * radius * (0.74 + orbitIndex * 0.025));
      packetPoint.applyEuler(orbitEulers[orbitIndex]);
      packetAttribute.setXYZ(index, packetPoint.x, packetPoint.y, packetPoint.z);
    }
    packetAttribute.needsUpdate = true;
    if (packetPoints.current) {
      const material = packetPoints.current.material as THREE.PointsMaterial;
      material.opacity = 0.62 + (activity === "speaking" ? 0.3 : 0);
    }

    pulseRings.current.forEach((ring, index) => {
      const phase = (t * (activity === "speaking" ? 0.72 : 0.16) + index * 0.23) % 1;
      ring.scale.setScalar(0.68 + phase * 1.35);
      const material = ring.material as THREE.MeshBasicMaterial;
      material.opacity = activity === "speaking" ? Math.pow(1 - phase, 2.4) * 0.34 : activity === "thinking" ? Math.pow(0.5 + 0.5 * Math.sin(t * 2.2 + index), 7) * 0.08 : 0.018;
    });
  });

  return (
    <group ref={root}>
      <RealmFresnel activity={activity} color={primary} />
      <lineSegments geometry={spokeGeometry}>
        <lineBasicMaterial ref={spokesMaterial} blending={THREE.AdditiveBlending} color={hot} depthWrite={false} opacity={0.18} toneMapped={false} transparent />
      </lineSegments>
      <lineSegments geometry={filamentGeometry}>
        <lineBasicMaterial ref={filamentMaterial} blending={THREE.AdditiveBlending} color={secondary} depthWrite={false} opacity={0.22} toneMapped={false} transparent />
      </lineSegments>
      <group ref={orbitGroup}>
        {orbitGeometries.map((geometry, index) => (
          <lineSegments key={index} geometry={geometry} ref={(node) => { if (node) orbitRefs.current[index] = node; }} rotation={ORBIT_ROTATIONS[index]}>
            <lineBasicMaterial blending={THREE.AdditiveBlending} color={index % 3 === 0 ? hot : index % 2 ? secondary : primary} depthWrite={false} opacity={0.22} toneMapped={false} transparent />
          </lineSegments>
        ))}
      </group>
      <points ref={dust} geometry={dustGeometry}>
        <pointsMaterial blending={THREE.AdditiveBlending} color={primary} depthWrite={false} opacity={0.4} size={0.025} sizeAttenuation toneMapped={false} transparent />
      </points>
      <points ref={packetPoints} geometry={packetGeometry}>
        <pointsMaterial blending={THREE.AdditiveBlending} color={hot} depthWrite={false} opacity={0.68} size={0.064} sizeAttenuation toneMapped={false} transparent />
      </points>
      <instancedMesh ref={fragments} args={[shardGeometry, undefined, 64]}>
        <meshBasicMaterial blending={THREE.AdditiveBlending} color={secondary} depthWrite={false} opacity={0.52} toneMapped={false} transparent wireframe={variant !== "asgard"} />
      </instancedMesh>
      {Array.from({ length: 4 }, (_, index) => (
        <mesh key={index} ref={(node) => { if (node) pulseRings.current[index] = node; }} rotation={[index % 2 ? Math.PI / 2 : Math.PI / 3, index * 0.44, index * 0.71]}>
          <torusGeometry args={[1.72 + index * 0.16, 0.006 + index * 0.001, 4, 128]} />
          <meshBasicMaterial blending={THREE.AdditiveBlending} color={index % 2 ? hot : primary} depthWrite={false} opacity={0.04} toneMapped={false} transparent />
        </mesh>
      ))}
    </group>
  );
}
