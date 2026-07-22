import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { AiActivity } from "../../App";
import { NeuralLattice } from "./NeuralLattice";

// Colors (Gold Palette)
const PLASMA = new THREE.Color("#ff8a18");
const HOT_PLASMA = new THREE.Color("#ffd15c");
const WHITE_HOT = new THREE.Color("#fff8d6");
const DEEP_AMBER = new THREE.Color("#b8490b");
const COPPER_GLOW = new THREE.Color("#d65f10");

export type LegacyOrbPalette = "gold" | "green" | "violet" | "orange";

const LEGACY_ORB_COLORS: Record<LegacyOrbPalette, [string, string, string, string, string]> = {
  gold: ["#ff8a18", "#ffd15c", "#fff8d6", "#b8490b", "#d65f10"],
  green: ["#4cff85", "#b9ffc9", "#f5fff6", "#0b4f24", "#18bd58"],
  violet: ["#b35cff", "#e8b7ff", "#fff6ff", "#2d0f58", "#7f35ff"],
  orange: ["#ff7a18", "#ffc46b", "#fff5de", "#7a2608", "#ed5f12"],
};

function applyLegacyOrbPalette(palette: LegacyOrbPalette) {
  const [plasma, hot, white, deep, copper] = LEGACY_ORB_COLORS[palette];
  PLASMA.set(plasma);
  HOT_PLASMA.set(hot);
  WHITE_HOT.set(white);
  DEEP_AMBER.set(deep);
  COPPER_GLOW.set(copper);
}

type OrbitSpec = {
  radiusX: number;
  radiusZ: number;
  seed: number;
  speed: number;
  tilt: [number, number, number];
  opacity: number;
  width: number;
  packets: number;
};

const ORBITS: OrbitSpec[] = [
  { radiusX: 0.66, radiusZ: 0.58, seed: 11, speed: 0.33, tilt: [0.28, 0.16, 0.84], opacity: 0.64, width: 1, packets: 3 },
  { radiusX: 0.88, radiusZ: 0.74, seed: 13, speed: -0.26, tilt: [1.1, 0.04, -0.38], opacity: 0.5, width: 1, packets: 2 },
  { radiusX: 1.06, radiusZ: 0.98, seed: 17, speed: 0.21, tilt: [0.08, 0.9, 0.24], opacity: 0.42, width: 1, packets: 4 },
  { radiusX: 1.28, radiusZ: 1.05, seed: 19, speed: -0.18, tilt: [1.42, 0.32, 0.52], opacity: 0.58, width: 1.3, packets: 3 },
  { radiusX: 1.42, radiusZ: 1.34, seed: 23, speed: 0.13, tilt: [0.46, 1.18, -0.2], opacity: 0.37, width: 1, packets: 2 },
  { radiusX: 1.58, radiusZ: 1.18, seed: 29, speed: -0.11, tilt: [1.28, 0.82, 1.05], opacity: 0.46, width: 1.1, packets: 3 },
  { radiusX: 1.78, radiusZ: 1.58, seed: 31, speed: 0.087, tilt: [0.2, 0.2, 1.47], opacity: 0.32, width: 1, packets: 2 },
  { radiusX: 2.03, radiusZ: 1.72, seed: 37, speed: -0.072, tilt: [1.05, 0.42, -1.12], opacity: 0.34, width: 1.2, packets: 4 },
  { radiusX: 2.24, radiusZ: 1.86, seed: 41, speed: 0.055, tilt: [0.72, 1.05, 0.42], opacity: 0.28, width: 1, packets: 3 },
  { radiusX: 2.46, radiusZ: 2.08, seed: 43, speed: -0.048, tilt: [1.38, 0.12, 0.08], opacity: 0.25, width: 1, packets: 2 }
];

function seededRandom(seed: number) {
  return () => {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function activityEnergy(activity: AiActivity) {
  if (activity === "speaking") return 1.52;
  if (activity === "thinking") return 1.28;
  if (activity === "listening") return 0.82;
  return 1;
}

function activitySpeed(activity: AiActivity) {
  if (activity === "speaking") return 1.85;
  if (activity === "thinking") return 1.42;
  if (activity === "listening") return 0.46;
  return 1;
}

const lineShader = {
  uniforms: {
    uTime: { value: 0 },
    uEnergy: { value: 1 },
    uOpacity: { value: 1 },
    uColor: { value: PLASMA }
  },
  vertexShader: `
    attribute float aPhase;
    attribute float aIntensity;
    varying float vFront;
    varying float vPhase;
    varying float vIntensity;
    void main() {
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mv;
      vFront = smoothstep(-9.4, -5.2, mv.z);
      vPhase = aPhase;
      vIntensity = aIntensity;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uEnergy;
    uniform float uOpacity;
    uniform vec3 uColor;
    varying float vFront;
    varying float vPhase;
    varying float vIntensity;
    void main() {
      float pulse = pow(0.5 + 0.5 * sin(uTime * (1.1 + vIntensity * 2.4) + vPhase), 3.0);
      float packet = smoothstep(0.89, 1.0, sin(vPhase * 8.0 - uTime * 2.6));
      float alpha = uOpacity * (0.18 + vIntensity * 0.46 + packet * 0.44) * mix(0.18, 1.0, vFront);
      alpha *= mix(0.72, 1.18, pulse) * uEnergy;
      gl_FragColor = vec4(uColor, alpha);
    }
  `
};

function makeLineShader() {
  return {
    uniforms: THREE.UniformsUtils.clone(lineShader.uniforms),
    vertexShader: lineShader.vertexShader,
    fragmentShader: lineShader.fragmentShader
  };
}

function buildAxisBeamGeometry() {
  const random = seededRandom(54421);
  const positions: number[] = [];
  const phases: number[] = [];
  const intensities: number[] = [];
  for (let index = 0; index < 12; index += 1) {
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    const direction = new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.cos(phi),
      Math.sin(phi) * Math.sin(theta)
    );
    const length = index % 4 === 0 ? 2.05 + random() * 0.38 : 1.1 + random() * 0.66;
    const offset = direction.clone().multiplyScalar((random() - 0.5) * 0.22);
    const start = direction.clone().multiplyScalar(-length).add(offset);
    const end = direction.clone().multiplyScalar(length).add(offset.multiplyScalar(0.35));
    positions.push(start.x, start.y, start.z, end.x, end.y, end.z);
    phases.push(random() * 6.28, random() * 6.28);
    intensities.push(index % 4 === 0 ? 0.92 : 0.44 + random() * 0.32, index % 4 === 0 ? 0.92 : 0.44 + random() * 0.32);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("aPhase", new THREE.Float32BufferAttribute(phases, 1));
  geometry.setAttribute("aIntensity", new THREE.Float32BufferAttribute(intensities, 1));
  return geometry;
}

function buildOrbitGeometry(spec: OrbitSpec) {
  const random = seededRandom(spec.seed * 313);
  const positions: number[] = [];
  const phases: number[] = [];
  const intensities: number[] = [];
  const segmentCount = 240;
  const gapA = random() * Math.PI * 2;
  const gapB = random() * Math.PI * 2;

  for (let index = 0; index < segmentCount; index += 1) {
    const a0 = (index / segmentCount) * Math.PI * 2;
    const a1 = ((index + 1) / segmentCount) * Math.PI * 2;
    const gapMask =
      Math.abs(Math.sin((a0 - gapA) * 1.5)) < 0.13 ||
      Math.abs(Math.sin((a0 - gapB) * 2.0)) < 0.11 ||
      (index + spec.seed) % 23 === 0;
    if (gapMask) continue;

    const ripple0 = 1 + Math.sin(a0 * 5 + spec.seed) * 0.018 + (random() - 0.5) * 0.01;
    const ripple1 = 1 + Math.sin(a1 * 5 + spec.seed) * 0.018 + (random() - 0.5) * 0.01;
    const y0 = Math.sin(a0 * 3 + spec.seed) * 0.025;
    const y1 = Math.sin(a1 * 3 + spec.seed) * 0.025;
    positions.push(Math.cos(a0) * spec.radiusX * ripple0, y0, Math.sin(a0) * spec.radiusZ * ripple0);
    positions.push(Math.cos(a1) * spec.radiusX * ripple1, y1, Math.sin(a1) * spec.radiusZ * ripple1);
    phases.push(a0 + spec.seed, a1 + spec.seed);
    intensities.push(0.55 + random() * 0.45, 0.55 + random() * 0.45);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("aPhase", new THREE.Float32BufferAttribute(phases, 1));
  geometry.setAttribute("aIntensity", new THREE.Float32BufferAttribute(intensities, 1));
  return geometry;
}

function makeMajorOrbitCurve(spec: OrbitSpec) {
  const random = seededRandom(spec.seed * 791);
  const points: THREE.Vector3[] = [];
  const count = 96;
  for (let index = 0; index < count; index += 1) {
    const angle = (index / count) * Math.PI * 2;
    const warp = 1 + Math.sin(angle * 3 + spec.seed) * 0.018 + (random() - 0.5) * 0.008;
    points.push(
      new THREE.Vector3(
        Math.cos(angle) * spec.radiusX * warp,
        Math.sin(angle * 2 + spec.seed) * 0.018,
        Math.sin(angle) * spec.radiusZ * warp
      )
    );
  }
  return new THREE.CatmullRomCurve3(points, true, "centripetal", 0.5);
}

function CoreVortex({ activity }: { activity: AiActivity }) {
  const group = useRef<THREE.Group>(null);
  const knotA = useRef<THREE.Mesh>(null);
  const knotB = useRef<THREE.Mesh>(null);
  const knotC = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const speed = activitySpeed(activity);
    const energy = activityEnergy(activity);
    if (group.current) {
      const voicePulse = activity === "speaking" ? Math.sin(t * 7.2) * 0.075 : Math.sin(t * 2.2) * 0.025;
      group.current.scale.setScalar((1 + voicePulse) * (0.98 + energy * 0.035));
      group.current.rotation.y += delta * 0.18 * speed;
    }
    if (knotA.current) knotA.current.rotation.x += delta * 0.42 * speed;
    if (knotB.current) knotB.current.rotation.y -= delta * 0.34 * speed;
    if (knotC.current) knotC.current.rotation.z += delta * 0.27 * speed;
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[0.105, 32, 32]} />
        <meshBasicMaterial color={WHITE_HOT} toneMapped={false} />
      </mesh>
      <mesh scale={1 + activityEnergy(activity) * 0.075}>
        <sphereGeometry args={[0.31, 32, 32]} />
        <meshBasicMaterial
          blending={THREE.AdditiveBlending}
          color={HOT_PLASMA}
          depthWrite={false}
          opacity={0.32}
          toneMapped={false}
          transparent
        />
      </mesh>
      <mesh scale={1.72}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshBasicMaterial
          blending={THREE.AdditiveBlending}
          color={PLASMA}
          depthWrite={false}
          opacity={0.092}
          toneMapped={false}
          transparent
        />
      </mesh>
      <mesh ref={knotA} rotation={[0.3, 0.2, 0.1]}>
        <torusKnotGeometry args={[0.34, 0.018, 180, 5, 2, 3]} />
        <meshBasicMaterial blending={THREE.AdditiveBlending} color={HOT_PLASMA} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={knotB} rotation={[1.1, 0.4, 0.8]} scale={1.18}>
        <torusKnotGeometry args={[0.34, 0.011, 180, 4, 3, 5]} />
        <meshBasicMaterial blending={THREE.AdditiveBlending} color={PLASMA} depthWrite={false} opacity={0.72} toneMapped={false} transparent />
      </mesh>
      <mesh ref={knotC} rotation={[0.2, 1.2, 0.5]} scale={1.42}>
        <torusKnotGeometry args={[0.34, 0.008, 180, 4, 2, 5]} />
        <meshBasicMaterial blending={THREE.AdditiveBlending} color={COPPER_GLOW} depthWrite={false} opacity={0.48} toneMapped={false} transparent />
      </mesh>
    </group>
  );
}

function AxisBeams({ activity }: { activity: AiActivity }) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(buildAxisBeamGeometry, []);
  const shader = useMemo(makeLineShader, []);

  useFrame(({ clock }, delta) => {
    if (material.current) {
      material.current.uniforms.uTime.value = clock.elapsedTime * 1.28;
      material.current.uniforms.uEnergy.value = activityEnergy(activity) * (activity === "speaking" ? 1.34 : 0.96);
      material.current.uniforms.uOpacity.value = activity === "listening" ? 0.26 : activity === "speaking" ? 0.48 : 0.38;
      material.current.uniforms.uColor.value.copy(HOT_PLASMA);
    }
    if (group.current) {
      group.current.rotation.y += delta * 0.035 * activitySpeed(activity);
      group.current.rotation.z -= delta * 0.018;
    }
  });

  return (
    <group ref={group}>
      <lineSegments geometry={geometry}>
        <shaderMaterial
          ref={material}
          args={[shader]}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
          transparent
        />
      </lineSegments>
    </group>
  );
}

function PlanetaryOrbit({ activity, index, spec }: { activity: AiActivity; index: number; spec: OrbitSpec }) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => buildOrbitGeometry(spec), [spec]);
  const shader = useMemo(makeLineShader, []);

  useFrame(({ clock }, delta) => {
    const speed = activitySpeed(activity);
    if (group.current) {
      group.current.rotation.y += delta * spec.speed * speed;
      group.current.rotation.z += delta * spec.speed * 0.28 * speed;
      const livingScale = 1 + Math.sin(clock.elapsedTime * 0.8 + spec.seed) * 0.004 * activityEnergy(activity);
      group.current.scale.setScalar(livingScale);
    }
    if (material.current) {
      material.current.uniforms.uTime.value = clock.elapsedTime + index * 0.71;
      material.current.uniforms.uEnergy.value = activityEnergy(activity);
      material.current.uniforms.uOpacity.value = spec.opacity;
      material.current.uniforms.uColor.value.copy(index < 3 ? HOT_PLASMA : index > 6 ? COPPER_GLOW : PLASMA);
    }
  });

  return (
    <group ref={group} rotation={spec.tilt}>
      <lineSegments geometry={geometry}>
        <shaderMaterial
          ref={material}
          args={[shader]}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
          transparent
        />
      </lineSegments>
    </group>
  );
}

function MajorOrbitBand({ activity, index, spec }: { activity: AiActivity; index: number; spec: OrbitSpec }) {
  const mesh = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => new THREE.TubeGeometry(makeMajorOrbitCurve(spec), 220, spec.width * 0.011, 5, true), [spec]);

  useFrame(({ clock }, delta) => {
    if (!mesh.current) return;
    const speed = activitySpeed(activity);
    mesh.current.rotation.y += delta * spec.speed * 0.72 * speed;
    mesh.current.rotation.z += delta * spec.speed * 0.18 * speed;
    const material = mesh.current.material as THREE.MeshBasicMaterial;
    material.color.copy(index % 2 === 0 ? HOT_PLASMA : PLASMA);
    material.opacity =
      (0.32 + spec.opacity * 0.58) *
      (0.82 + Math.sin(clock.elapsedTime * (0.95 + index * 0.14) + spec.seed) * 0.18) *
      activityEnergy(activity);
  });

  return (
    <group rotation={spec.tilt}>
      <mesh ref={mesh} geometry={geometry}>
        <meshBasicMaterial
          blending={THREE.AdditiveBlending}
          color={HOT_PLASMA}
          depthWrite={false}
          opacity={0.74}
          toneMapped={false}
          transparent
        />
      </mesh>
    </group>
  );
}

function PlanetaryPackets({ activity }: { activity: AiActivity }) {
  const points = useRef<THREE.Points>(null);
  const packetData = useMemo(() => {
    const data: Array<{ orbit: number; phase: number; speed: number; size: number; offset: number }> = [];
    ORBITS.forEach((orbit, orbitIndex) => {
      for (let index = 0; index < orbit.packets; index += 1) {
        data.push({
          orbit: orbitIndex,
          phase: ((index + 1) / (orbit.packets + 1) + orbit.seed * 0.013) % 1,
          speed: Math.abs(orbit.speed) * (0.72 + index * 0.16),
          size: 0.045 + ((index + orbitIndex) % 3) * 0.018,
          offset: (index - orbit.packets * 0.5) * 0.012
        });
      }
    });
    return data;
  }, []);
  const geometry = useMemo(() => {
    const result = new THREE.BufferGeometry();
    result.setAttribute("position", new THREE.BufferAttribute(new Float32Array(packetData.length * 3), 3));
    result.setAttribute("aSize", new THREE.BufferAttribute(new Float32Array(packetData.map((packet) => packet.size)), 1));
    return result;
  }, [packetData]);
  const matrices = useMemo(() => ORBITS.map((orbit) => new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(...orbit.tilt))), []);
  const point = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    if (!points.current) return;
    const attribute = geometry.getAttribute("position") as THREE.BufferAttribute;
    const speed = activitySpeed(activity);
    packetData.forEach((packet, index) => {
      const orbit = ORBITS[packet.orbit];
      const progress = (packet.phase + clock.elapsedTime * packet.speed * speed) % 1;
      const angle = progress * Math.PI * 2;
      point.set(Math.cos(angle) * orbit.radiusX, Math.sin(angle * 3 + orbit.seed) * 0.025 + packet.offset, Math.sin(angle) * orbit.radiusZ);
      point.applyMatrix4(matrices[packet.orbit]);
      attribute.setXYZ(index, point.x, point.y, point.z);
    });
    attribute.needsUpdate = true;
  });

  const shader = useMemo(
    () => ({
      uniforms: {
        uColor: { value: HOT_PLASMA }
      },
      vertexShader: `
        attribute float aSize;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = aSize * (64.0 / max(1.0, -mv.z));
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        void main() {
          float core = smoothstep(0.46, 0.02, length(gl_PointCoord - 0.5));
          float haze = smoothstep(0.5, 0.02, length(gl_PointCoord - 0.5)) * 0.35;
          gl_FragColor = vec4(uColor, core + haze);
        }
      `
    }),
    []
  );

  return (
    <points ref={points} geometry={geometry}>
      <shaderMaterial
        args={[shader]}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
        transparent
      />
    </points>
  );
}

function PlanetaryOrbitField({ activity }: { activity: AiActivity }) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const voicePulse = activity === "speaking" ? Math.sin(clock.elapsedTime * 6.8) * 0.018 : 0;
    group.current.scale.setScalar(1 + voicePulse);
  });

  return (
    <group ref={group}>
      {[ORBITS[1], ORBITS[3], ORBITS[5], ORBITS[7]].map((spec, index) => (
        <MajorOrbitBand activity={activity} index={index} key={`major-${spec.seed}`} spec={spec} />
      ))}
      {ORBITS.map((spec, index) => (
        <PlanetaryOrbit activity={activity} index={index} key={spec.seed} spec={spec} />
      ))}
      <PlanetaryPackets activity={activity} />
    </group>
  );
}

function AccretionBelt({ activity }: { activity: AiActivity }) {
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => {
    const random = seededRandom(91822);
    const count = 760;
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const sizes = new Float32Array(count);
    for (let index = 0; index < count; index += 1) {
      const angle = random() * Math.PI * 2;
      const radius = 0.52 + Math.pow(random(), 1.8) * 0.92;
      positions[index * 3] = Math.cos(angle) * radius;
      positions[index * 3 + 1] = (random() - 0.5) * 0.055;
      positions[index * 3 + 2] = Math.sin(angle) * radius * (0.78 + random() * 0.18);
      phases[index] = angle + random() * 3;
      sizes[index] = 1.2 + random() * 3.8;
    }
    const result = new THREE.BufferGeometry();
    result.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    result.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    result.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    return result;
  }, []);

  const shader = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uEnergy: { value: 1 },
        uColor: { value: HOT_PLASMA }
      },
      vertexShader: `
        attribute float aPhase;
        attribute float aSize;
        uniform float uTime;
        uniform float uEnergy;
        varying float vAlpha;
        void main() {
          vec3 p = position;
          float spin = uTime * (0.18 + fract(aPhase) * 0.08) * uEnergy;
          float c = cos(spin);
          float s = sin(spin);
          p.xz = mat2(c, -s, s, c) * p.xz;
          p.y += sin(uTime * 1.7 + aPhase * 2.0) * 0.014 * uEnergy;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = aSize * (22.0 / max(1.0, -mv.z));
          vAlpha = (0.38 + 0.62 * pow(0.5 + 0.5 * sin(uTime * 2.0 + aPhase * 7.0), 4.0)) * uEnergy;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          float mask = smoothstep(0.5, 0.05, length(gl_PointCoord - 0.5));
          gl_FragColor = vec4(uColor, mask * vAlpha * 0.78);
        }
      `
    }),
    []
  );

  useFrame(({ clock }, delta) => {
    if (material.current) {
      material.current.uniforms.uTime.value = clock.elapsedTime;
      material.current.uniforms.uEnergy.value = activityEnergy(activity);
      material.current.uniforms.uColor.value.copy(HOT_PLASMA);
    }
    if (points.current) {
      points.current.rotation.x = 0.58 + Math.sin(clock.elapsedTime * 0.12) * 0.035;
      points.current.rotation.y += delta * 0.08 * activitySpeed(activity);
      points.current.rotation.z = -0.18;
    }
  });

  return (
    <points ref={points} geometry={geometry}>
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

function makeModeConduitCurves() {
  const random = seededRandom(55123);
  return Array.from({ length: 14 }, (_, index) => {
    const theta = (index / 14) * Math.PI * 2 + random() * 0.32;
    const tilt = new THREE.Euler(random() * 1.4, random() * 1.1, random() * 1.2);
    const points = Array.from({ length: 6 }, (_, pointIndex) => {
      const t = pointIndex / 5;
      const radius = 0.28 + t * (1.76 + random() * 0.38);
      const curl = theta + Math.sin(t * Math.PI * 2 + index) * 0.28;
      const point = new THREE.Vector3(
        Math.cos(curl) * radius,
        Math.sin(t * Math.PI * 1.5 + index) * 0.26,
        Math.sin(curl) * radius * (0.74 + random() * 0.22)
      );
      return point.applyEuler(tilt);
    });
    return new THREE.CatmullRomCurve3(points, false, "centripetal", 0.44);
  });
}

function ModeConduits({ activity }: { activity: AiActivity }) {
  const points = useRef<THREE.Points>(null);
  const curves = useMemo(() => makeModeConduitCurves(), []);
  const packetData = useMemo(
    () => Array.from({ length: 56 }, (_, index) => ({ curve: index % curves.length, phase: ((index * 19) % 56) / 56, speed: 0.08 + (index % 6) * 0.012 })),
    [curves.length]
  );
  const geometry = useMemo(() => {
    const result = new THREE.BufferGeometry();
    result.setAttribute("position", new THREE.BufferAttribute(new Float32Array(packetData.length * 3), 3));
    return result;
  }, [packetData.length]);
  const point = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    if (!points.current) return;
    const attribute = geometry.getAttribute("position") as THREE.BufferAttribute;
    const speed = activitySpeed(activity);
    packetData.forEach((packet, index) => {
      const progress = (packet.phase + clock.elapsedTime * packet.speed * speed) % 1;
      curves[packet.curve].getPointAt(progress, point);
      const surge = activity === "speaking" ? 1 + Math.sin(clock.elapsedTime * 7 + index) * 0.025 : 1;
      attribute.setXYZ(index, point.x * surge, point.y * surge, point.z * surge);
    });
    attribute.needsUpdate = true;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        blending={THREE.AdditiveBlending}
        color={WHITE_HOT}
        depthWrite={false}
        opacity={0.76}
        size={0.046}
        sizeAttenuation
        toneMapped={false}
        transparent
      />
    </points>
  );
}

function FresnelVolume({ activity }: { activity: AiActivity }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const shader = useMemo(
    () => ({
      uniforms: {
        uEnergy: { value: 1 },
        uColor: { value: DEEP_AMBER }
      },
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
        uniform float uEnergy;
        uniform vec3 uColor;
        varying vec3 vNormal;
        varying vec3 vView;
        void main() {
          float fresnel = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 4.5);
          gl_FragColor = vec4(uColor, fresnel * 0.0022 * uEnergy);
        }
      `
    }),
    []
  );
  useFrame(() => {
    if (material.current) {
      material.current.uniforms.uEnergy.value = activityEnergy(activity);
      material.current.uniforms.uColor.value.copy(DEEP_AMBER);
    }
  });
  return (
    <mesh scale={[1.04, 1.04, 1.04]}>
      <sphereGeometry args={[2.18, 48, 48]} />
      <shaderMaterial
        ref={material}
        args={[shader]}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.BackSide}
        toneMapped={false}
        transparent
      />
    </mesh>
  );
}

export function MindScene({ activity, palette = "gold" }: { activity: AiActivity; palette?: LegacyOrbPalette }) {
  applyLegacyOrbPalette(palette);
  return (
    <group>
      <FresnelVolume activity={activity} />
      <group scale={palette === "violet" ? 0.46 : 1}>
        <NeuralLattice activity={activity} palette={palette} />
      </group>
      <ModeConduits activity={activity} />
      <CoreVortex activity={activity} />
      <AccretionBelt activity={activity} />
      <AxisBeams activity={activity} />
      <PlanetaryOrbitField activity={activity} />
    </group>
  );
}
