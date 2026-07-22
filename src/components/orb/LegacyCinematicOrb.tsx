import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as THREE from "three";
import type { AiActivity } from "../../App";

export type LegacyEnergyPalette = "gold" | "blue" | "green" | "red" | "violet" | "orange";

type CinematicOrbProps = {
  activity: AiActivity;
  palette?: LegacyEnergyPalette;
  resetSignal?: number;
  triangularCore?: boolean;
};

type FilamentSpec = {
  radius: number;
  seed: number;
  span: number;
  speed: number;
  tilt: [number, number, number];
};

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

const PLASMA = new THREE.Color("#ff8a18");
const HOT_PLASMA = new THREE.Color("#ffd15c");
const WHITE_HOT = new THREE.Color("#fff8d6");
const DEEP_AMBER = new THREE.Color("#b8490b");
const COPPER_GLOW = new THREE.Color("#d65f10");
let BACKGROUND_CLEAR = "#020100";

const ORB_PALETTES: Record<
  LegacyEnergyPalette,
  { plasma: string; hot: string; white: string; deep: string; copper: string; clear: string }
> = {
  gold: {
    plasma: "#ff8a18",
    hot: "#ffd15c",
    white: "#fff8d6",
    deep: "#b8490b",
    copper: "#d65f10",
    clear: "#020100"
  },
  blue: {
    plasma: "#25caff",
    hot: "#8df0ff",
    white: "#f2fdff",
    deep: "#06465c",
    copper: "#0d8fc0",
    clear: "#00040a"
  },
  green: {
    plasma: "#4cff85",
    hot: "#b9ffc9",
    white: "#f5fff6",
    deep: "#0b4f24",
    copper: "#18bd58",
    clear: "#000704"
  },
  red: {
    plasma: "#ff315f",
    hot: "#ff9aac",
    white: "#fff4f6",
    deep: "#68101f",
    copper: "#d81742",
    clear: "#080002"
  },
  violet: {
    plasma: "#b35cff",
    hot: "#e8b7ff",
    white: "#fff6ff",
    deep: "#2d0f58",
    copper: "#7f35ff",
    clear: "#040008"
  },
  orange: {
    plasma: "#ff7a18",
    hot: "#ffc46b",
    white: "#fff5de",
    deep: "#7a2608",
    copper: "#ed5f12",
    clear: "#080200"
  }
};

const ORB_MODE: Record<
  LegacyEnergyPalette,
  { speed: number; bloom: number; scaffold: number; shell: number; pulse: number; packet: number }
> = {
  gold: { speed: 1, bloom: 1, scaffold: 1, shell: 1, pulse: 1, packet: 1 },
  blue: { speed: 0.92, bloom: 0.96, scaffold: 1.72, shell: 0.86, pulse: 0.92, packet: 1.08 },
  green: { speed: 0.74, bloom: 1.04, scaffold: 0.74, shell: 1.48, pulse: 0.82, packet: 0.92 },
  red: { speed: 1.44, bloom: 1.12, scaffold: 1.18, shell: 0.92, pulse: 1.42, packet: 1.55 },
  violet: { speed: 1.12, bloom: 1.2, scaffold: 1.08, shell: 1.08, pulse: 1.34, packet: 1.26 },
  orange: { speed: 1, bloom: 1, scaffold: 1, shell: 1, pulse: 1, packet: 1 }
};

function modeFor(palette: LegacyEnergyPalette = "gold") {
  return ORB_MODE[palette] ?? ORB_MODE.gold;
}

function applyOrbPalette(palette: LegacyEnergyPalette) {
  const colors = ORB_PALETTES[palette] ?? ORB_PALETTES.gold;
  PLASMA.set(colors.plasma);
  HOT_PLASMA.set(colors.hot);
  WHITE_HOT.set(colors.white);
  DEEP_AMBER.set(colors.deep);
  COPPER_GLOW.set(colors.copper);
  BACKGROUND_CLEAR = colors.clear;
}

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest(".hud-dock, .history-panel, .settings-panel, .activity-hub, .prompt-shell, button, input, textarea, select"));
}
const FILAMENTS: FilamentSpec[] = [
  { radius: 0.72, seed: 1, span: 5.2, speed: 0.21, tilt: [0.2, 0.4, 0.1] },
  { radius: 0.86, seed: 2, span: 4.6, speed: -0.17, tilt: [1.1, 0.2, 0.6] },
  { radius: 1.02, seed: 3, span: 5.5, speed: 0.12, tilt: [0.6, 1.2, 0.2] },
  { radius: 1.18, seed: 4, span: 4.3, speed: -0.1, tilt: [1.4, 0.3, 1.1] },
  { radius: 1.36, seed: 5, span: 5.7, speed: 0.075, tilt: [0.35, 0.9, 1.5] },
  { radius: 1.52, seed: 6, span: 4.9, speed: -0.065, tilt: [1.2, 1.1, 0.25] },
  { radius: 1.72, seed: 7, span: 3.8, speed: 0.052, tilt: [0.75, 0.15, 1.35] },
  { radius: 1.9, seed: 8, span: 4.2, speed: -0.044, tilt: [0.18, 1.35, 0.7] }
];
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
function makeFilamentCurve(spec: FilamentSpec) {
  const random = seededRandom(spec.seed * 991);
  const rotation = new THREE.Euler(...spec.tilt);
  const points: THREE.Vector3[] = [];
  const count = 16;
  for (let index = 0; index < count; index += 1) {
    const t = index / (count - 1);
    const angle = -spec.span * 0.5 + spec.span * t;
    const radius = spec.radius * (0.9 + Math.sin(t * Math.PI * 3 + spec.seed) * 0.09 + random() * 0.035);
    const point = new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle * 1.42 + spec.seed) * spec.radius * 0.34,
      Math.sin(angle) * radius
    );
    point.applyEuler(rotation);
    points.push(point);
  }
  return new THREE.CatmullRomCurve3(points, false, "centripetal", 0.45);
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

function buildCoreSpokeGeometry() {
  const random = seededRandom(60879);
  const positions: number[] = [];
  const phases: number[] = [];
  const intensities: number[] = [];
  for (let index = 0; index < 42; index += 1) {
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    const direction = new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.cos(phi),
      Math.sin(phi) * Math.sin(theta)
    );
    const inner = 0.24 + random() * 0.32;
    const outer = 1.04 + random() * (index % 5 === 0 ? 1.34 : 0.82);
    const start = direction.clone().multiplyScalar(inner);
    const end = direction.clone().multiplyScalar(outer);
    positions.push(start.x, start.y, start.z, end.x, end.y, end.z);
    phases.push(random() * 6.28, random() * 6.28);
    intensities.push(0.35 + random() * 0.65, 0.35 + random() * 0.65);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("aPhase", new THREE.Float32BufferAttribute(phases, 1));
  geometry.setAttribute("aIntensity", new THREE.Float32BufferAttribute(intensities, 1));
  return geometry;
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

function buildOuterHaloGeometry() {
  const random = seededRandom(77931);
  const positions: number[] = [];
  const phases: number[] = [];
  const intensities: number[] = [];
  const clusters = Array.from({ length: 11 }, () => ({
    theta: random() * Math.PI * 2,
    phi: Math.acos(2 * random() - 1),
    spread: 0.18 + random() * 0.34
  }));
  const worldUp = new THREE.Vector3(0, 1, 0);
  const worldSide = new THREE.Vector3(1, 0, 0);

  for (let trace = 0; trace < 560; trace += 1) {
    const cluster = clusters[trace % clusters.length];
    const theta = cluster.theta + (random() - 0.5) * cluster.spread * 2.2;
    const phi = cluster.phi + (random() - 0.5) * cluster.spread * 1.6;
    const radius = 1.82 + random() * 0.54;
    const normal = new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.cos(phi),
      Math.sin(phi) * Math.sin(theta)
    ).normalize();
    const reference = Math.abs(normal.y) > 0.82 ? worldSide : worldUp;
    const tangentA = new THREE.Vector3().crossVectors(normal, reference).normalize();
    const tangentB = new THREE.Vector3().crossVectors(normal, tangentA).normalize();
    const steps = 1 + Math.floor(random() * 3);
    let current = normal.clone().multiplyScalar(radius);
    const phase = random() * 6.28;
    const intensity = trace % 7 === 0 ? 0.95 : 0.32 + random() * 0.48;

    for (let step = 0; step < steps; step += 1) {
      const turn = step % 2 === 0 ? tangentA : tangentB;
      const length = 0.012 + random() * 0.052;
      const next = normal
        .clone()
        .addScaledVector(turn, length)
        .normalize()
        .multiplyScalar(radius + (random() - 0.5) * 0.04);
      positions.push(current.x, current.y, current.z, next.x, next.y, next.z);
      phases.push(phase + step * 0.27, phase + step * 0.27 + 0.12);
      intensities.push(intensity, intensity);
      current = next;
    }
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

function CoreVortex({ activity, triangularCore = false }: CinematicOrbProps) {
  const group = useRef<THREE.Group>(null);
  const knotA = useRef<THREE.Mesh>(null);
  const knotB = useRef<THREE.Mesh>(null);
  const knotC = useRef<THREE.Mesh>(null);
  const outerShell = useRef<THREE.LineSegments>(null);
  const innerShell = useRef<THREE.LineSegments>(null);
  const outerGeometry = useMemo(() => {
    const source = new THREE.IcosahedronGeometry(0.68, 2);
    const wireframe = new THREE.WireframeGeometry(source);
    source.dispose();
    return wireframe;
  }, []);
  const innerGeometry = useMemo(() => {
    const source = new THREE.IcosahedronGeometry(0.49, 1);
    const wireframe = new THREE.WireframeGeometry(source);
    source.dispose();
    return wireframe;
  }, []);

  useEffect(() => () => {
    outerGeometry.dispose();
    innerGeometry.dispose();
  }, [innerGeometry, outerGeometry]);

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
    if (outerShell.current) {
      outerShell.current.rotation.x += delta * 0.19 * speed;
      outerShell.current.rotation.y += delta * 0.27 * speed;
      outerShell.current.rotation.z -= delta * 0.08 * speed;
    }
    if (innerShell.current) {
      innerShell.current.rotation.x -= delta * 0.15 * speed;
      innerShell.current.rotation.y -= delta * 0.21 * speed;
      innerShell.current.rotation.z += delta * 0.12 * speed;
    }
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
      {triangularCore ? (
        <>
          <lineSegments ref={outerShell} geometry={outerGeometry} rotation={[0.24, 0.34, 0.08]}>
            <lineBasicMaterial blending={THREE.AdditiveBlending} color={HOT_PLASMA} depthWrite={false} opacity={0.8} toneMapped={false} transparent />
          </lineSegments>
          <lineSegments ref={innerShell} geometry={innerGeometry} rotation={[0.82, 0.18, 0.56]}>
            <lineBasicMaterial blending={THREE.AdditiveBlending} color={COPPER_GLOW} depthWrite={false} opacity={0.5} toneMapped={false} transparent />
          </lineSegments>
        </>
      ) : (
        <>
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
        </>
      )}
    </group>
  );
}

function AxisBeams({ activity }: CinematicOrbProps) {
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

function CoreSpokes({ activity }: CinematicOrbProps) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(buildCoreSpokeGeometry, []);
  const shader = useMemo(makeLineShader, []);

  useFrame(({ clock }, delta) => {
    const energy = activityEnergy(activity);
    if (material.current) {
      material.current.uniforms.uTime.value = clock.elapsedTime;
      material.current.uniforms.uEnergy.value = energy * (activity === "speaking" ? 1.22 : 1);
      material.current.uniforms.uOpacity.value = activity === "speaking" ? 0.82 : 0.7;
      material.current.uniforms.uColor.value.copy(WHITE_HOT);
    }
    if (group.current) {
      group.current.rotation.y += delta * 0.055 * activitySpeed(activity);
      group.current.rotation.x = Math.sin(clock.elapsedTime * 0.18) * 0.05;
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

function OuterHaloFragments({ activity }: CinematicOrbProps) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(buildOuterHaloGeometry, []);
  const shader = useMemo(makeLineShader, []);

  useFrame(({ clock }, delta) => {
    if (material.current) {
      material.current.uniforms.uTime.value = clock.elapsedTime * 0.82;
      material.current.uniforms.uEnergy.value = activityEnergy(activity);
      material.current.uniforms.uOpacity.value = 0.5;
      material.current.uniforms.uColor.value.copy(COPPER_GLOW);
    }
    if (group.current) {
      group.current.rotation.y += delta * 0.024 * activitySpeed(activity);
      group.current.rotation.x = Math.sin(clock.elapsedTime * 0.16) * 0.045;
      group.current.rotation.z -= delta * 0.012;
    }
  });

  return (
    <group ref={group} rotation={[0.12, -0.22, 0.08]}>
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

function PlanetaryOrbit({ activity, index, spec }: CinematicOrbProps & { index: number; spec: OrbitSpec }) {
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

function MajorOrbitBand({ activity, index, spec }: CinematicOrbProps & { index: number; spec: OrbitSpec }) {
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

function PlanetaryPackets({ activity }: CinematicOrbProps) {
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

function PlanetaryOrbitField({ activity }: CinematicOrbProps) {
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

function AccretionBelt({ activity }: CinematicOrbProps) {
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

function buildCircuitGeometry() {
  const random = seededRandom(73191);
  const positions: number[] = [];
  const phases: number[] = [];
  const intensities: number[] = [];
  const worldUp = new THREE.Vector3(0, 1, 0);
  const worldSide = new THREE.Vector3(1, 0, 0);

  for (let trace = 0; trace < 920; trace += 1) {
    const radius = 1.5 + random() * 0.62;
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    let current = new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.cos(phi),
      Math.sin(phi) * Math.sin(theta)
    ).multiplyScalar(radius);
    const steps = 2 + Math.floor(random() * 5);
    const phase = random() * Math.PI * 2;
    const intensity = 0.16 + random() * 0.84;

    for (let step = 0; step < steps; step += 1) {
      const normal = current.clone().normalize();
      const reference = Math.abs(normal.y) > 0.86 ? worldSide : worldUp;
      const tangentA = new THREE.Vector3().crossVectors(normal, reference).normalize();
      const tangentB = new THREE.Vector3().crossVectors(normal, tangentA).normalize();
      const tangent = step % 2 === 0 ? tangentA : tangentB;
      if ((trace + step) % 3 === 0) tangent.multiplyScalar(-1);
      const length = 0.025 + Math.floor(random() * 5) * 0.026;
      const nextDirection = normal.clone().addScaledVector(tangent, length / radius).normalize();
      const nextRadius = radius + (random() - 0.5) * 0.026;
      const next = nextDirection.multiplyScalar(nextRadius);
      positions.push(current.x, current.y, current.z, next.x, next.y, next.z);
      phases.push(phase, phase + step * 0.23);
      intensities.push(intensity, intensity);
      current = next;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("aPhase", new THREE.Float32BufferAttribute(phases, 1));
  geometry.setAttribute("aIntensity", new THREE.Float32BufferAttribute(intensities, 1));
  return geometry;
}

function CircuitShell({ activity }: CinematicOrbProps) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(buildCircuitGeometry, []);
  const shader = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uEnergy: { value: 1 },
        uColor: { value: DEEP_AMBER }
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
          vFront = smoothstep(-9.4, -5.0, mv.z);
          vPhase = aPhase;
          vIntensity = aIntensity;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uEnergy;
        uniform vec3 uColor;
        varying float vFront;
        varying float vPhase;
        varying float vIntensity;
        void main() {
          float flicker = 0.48 + 0.52 * pow(0.5 + 0.5 * sin(uTime * (1.2 + vIntensity * 2.8) + vPhase), 4.0);
          float alpha = (0.008 + vIntensity * 0.085) * mix(0.08, 0.46, vFront) * mix(0.7, flicker, 0.5) * uEnergy;
          gl_FragColor = vec4(uColor, alpha);
        }
      `
    }),
    []
  );

  useFrame(({ clock }, delta) => {
    if (material.current) {
      material.current.uniforms.uTime.value = clock.elapsedTime;
      material.current.uniforms.uEnergy.value = activityEnergy(activity);
      material.current.uniforms.uColor.value.copy(DEEP_AMBER);
    }
    if (group.current) {
      group.current.rotation.y += delta * 0.018 * activitySpeed(activity);
      group.current.rotation.z -= delta * 0.009;
    }
  });

  return (
    <group ref={group} rotation={[0.08, 0.16, -0.04]}>
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

function DataFragments({ activity }: CinematicOrbProps) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const points = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const random = seededRandom(18473);
    const count = 2600;
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const sizes = new Float32Array(count);
    const kinds = new Float32Array(count);
    const clusters = Array.from({ length: 9 }, () => ({ theta: random() * Math.PI * 2, phi: Math.acos(2 * random() - 1) }));

    for (let index = 0; index < count; index += 1) {
      const clustered = index < 1900;
      const cluster = clusters[index % clusters.length];
      const theta = clustered ? cluster.theta + (random() - 0.5) * 0.72 : random() * Math.PI * 2;
      const phi = clustered ? cluster.phi + (random() - 0.5) * 0.54 : Math.acos(2 * random() - 1);
      const shellPoint = index < 2180;
      const radius = shellPoint ? 1.56 + random() * 0.64 : 0.38 + Math.pow(random(), 0.46) * 1.55;
      positions[index * 3] = Math.sin(phi) * Math.cos(theta) * radius;
      positions[index * 3 + 1] = Math.cos(phi) * radius;
      positions[index * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius;
      phases[index] = random() * Math.PI * 2;
      sizes[index] = 1 + random() * (index % 23 === 0 ? 5.8 : 2.7);
      kinds[index] = random() > 0.62 ? 1 : 0;
    }

    const result = new THREE.BufferGeometry();
    result.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    result.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    result.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    result.setAttribute("aKind", new THREE.BufferAttribute(kinds, 1));
    return result;
  }, []);

  const shader = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uEnergy: { value: 1 },
        uColor: { value: COPPER_GLOW }
      },
      vertexShader: `
        attribute float aPhase;
        attribute float aSize;
        attribute float aKind;
        uniform float uTime;
        uniform float uEnergy;
        varying float vAlpha;
        varying float vKind;
        void main() {
          vec3 p = position;
          float angle = uTime * (0.012 + mod(aPhase, 1.0) * 0.009);
          float c = cos(angle);
          float s = sin(angle);
          p.xz = mat2(c, -s, s, c) * p.xz;
          p *= 1.0 + sin(uTime * 0.52 + aPhase) * 0.006 * uEnergy;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = aSize * (15.0 / max(1.0, -mv.z)) * (0.86 + uEnergy * 0.16);
          float front = smoothstep(-9.4, -5.0, mv.z);
          float pulse = 0.2 + 0.8 * pow(0.5 + 0.5 * sin(uTime * (0.7 + fract(aPhase) * 2.6) + aPhase), 5.0);
          vAlpha = mix(0.04, 0.34, front) * pulse;
          vKind = aKind;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        varying float vKind;
        void main() {
          vec2 centered = abs(gl_PointCoord - 0.5);
          float roundMask = smoothstep(0.5, 0.08, length(gl_PointCoord - 0.5));
          float squareMask = 1.0 - smoothstep(0.34, 0.5, max(centered.x, centered.y));
          float mask = mix(roundMask, squareMask, vKind);
          gl_FragColor = vec4(uColor, mask * vAlpha * 0.44);
        }
      `
    }),
    []
  );

  useFrame(({ clock }, delta) => {
    if (material.current) {
      material.current.uniforms.uTime.value = clock.elapsedTime;
      material.current.uniforms.uEnergy.value = activityEnergy(activity);
      material.current.uniforms.uColor.value.copy(activity === "speaking" ? PLASMA : COPPER_GLOW);
    }
    if (points.current) {
      points.current.rotation.x += delta * 0.006;
      points.current.rotation.z -= delta * 0.004 * activitySpeed(activity);
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

function EnergyFilament({ activity, spec, index }: CinematicOrbProps & { spec: FilamentSpec; index: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const geometry = useMemo(
    () => new THREE.TubeGeometry(makeFilamentCurve(spec), 128, 0.006 + (index % 3) * 0.003, 4, false),
    [index, spec]
  );

  useFrame(({ clock }, delta) => {
    if (!mesh.current) return;
    const speed = activitySpeed(activity);
    mesh.current.rotation.z += delta * spec.speed * speed;
    mesh.current.rotation.y -= delta * spec.speed * 0.32 * speed;
    const material = mesh.current.material as THREE.MeshBasicMaterial;
    material.color.copy(index % 3 === 0 ? HOT_PLASMA : index % 3 === 1 ? PLASMA : COPPER_GLOW);
    material.opacity = (0.28 + (index % 4) * 0.12) * (0.82 + Math.sin(clock.elapsedTime * 1.3 + index) * 0.18);
  });

  return (
    <mesh ref={mesh} geometry={geometry}>
      <meshBasicMaterial
        blending={THREE.AdditiveBlending}
        color={HOT_PLASMA}
        depthWrite={false}
        toneMapped={false}
        transparent
      />
    </mesh>
  );
}

function EnergyFilaments({ activity }: CinematicOrbProps) {
  return (
    <group>
      {FILAMENTS.map((spec, index) => (
        <EnergyFilament activity={activity} index={index} key={spec.seed} spec={spec} />
      ))}
    </group>
  );
}

function FluxPackets({ activity }: CinematicOrbProps) {
  const points = useRef<THREE.Points>(null);
  const curves = useMemo(() => FILAMENTS.map(makeFilamentCurve), []);
  const packetData = useMemo(
    () => Array.from({ length: 88 }, (_, index) => ({
      curve: index % curves.length,
      phase: ((index * 37) % 88) / 88,
      speed: 0.045 + (index % 7) * 0.011
    })),
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
      attribute.setXYZ(index, point.x, point.y, point.z);
    });
    attribute.needsUpdate = true;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        blending={THREE.AdditiveBlending}
        color={WHITE_HOT}
        depthWrite={false}
        opacity={0.94}
        size={0.052}
        sizeAttenuation
        toneMapped={false}
        transparent
      />
    </points>
  );
}

function FresnelVolume({ activity }: CinematicOrbProps) {
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

function buildTechScaffoldGeometry() {
  const random = seededRandom(442019);
  const positions: number[] = [];
  const phases: number[] = [];
  const intensities: number[] = [];

  const pushLine = (a: THREE.Vector3, b: THREE.Vector3, phase = random() * Math.PI * 2, intensity = 0.3 + random() * 0.7) => {
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    phases.push(phase, phase + 0.13);
    intensities.push(intensity, intensity);
  };

  const zLevels = [-0.42, 0.0, 0.36];
  zLevels.forEach((z, layer) => {
    const w = 2.58 + layer * 0.18;
    const h = 1.82 + layer * 0.12;
    const corner = 0.46 + layer * 0.06;
    const depth = z + (layer - 1) * 0.08;
    const points = [
      [new THREE.Vector3(-w, h, depth), new THREE.Vector3(-w + corner, h, depth)],
      [new THREE.Vector3(-w, h, depth), new THREE.Vector3(-w, h - corner, depth)],
      [new THREE.Vector3(w, h, depth), new THREE.Vector3(w - corner, h, depth)],
      [new THREE.Vector3(w, h, depth), new THREE.Vector3(w, h - corner, depth)],
      [new THREE.Vector3(-w, -h, depth), new THREE.Vector3(-w + corner, -h, depth)],
      [new THREE.Vector3(-w, -h, depth), new THREE.Vector3(-w, -h + corner, depth)],
      [new THREE.Vector3(w, -h, depth), new THREE.Vector3(w - corner, -h, depth)],
      [new THREE.Vector3(w, -h, depth), new THREE.Vector3(w, -h + corner, depth)]
    ];
    points.forEach(([a, b], index) => pushLine(a, b, layer + index * 0.31, 0.42 + layer * 0.13));

    for (let index = 0; index < 28; index += 1) {
      const side = index % 4;
      const t = (index % 7) / 6;
      const tick = 0.03 + random() * 0.055;
      if (side === 0) pushLine(new THREE.Vector3(-w + t * w * 2, h, depth), new THREE.Vector3(-w + t * w * 2, h - tick, depth), index, 0.28);
      if (side === 1) pushLine(new THREE.Vector3(w, h - t * h * 2, depth), new THREE.Vector3(w - tick, h - t * h * 2, depth), index, 0.28);
      if (side === 2) pushLine(new THREE.Vector3(w - t * w * 2, -h, depth), new THREE.Vector3(w - t * w * 2, -h + tick, depth), index, 0.28);
      if (side === 3) pushLine(new THREE.Vector3(-w, -h + t * h * 2, depth), new THREE.Vector3(-w + tick, -h + t * h * 2, depth), index, 0.28);
    }
  });

  for (let trace = 0; trace < 120; trace += 1) {
    const lane = trace % 8;
    const side = lane % 2 === 0 ? -1 : 1;
    const x = side * (2.0 + random() * 0.72);
    const y = -1.45 + random() * 2.9;
    const z = (random() - 0.5) * 0.84;
    const stepA = new THREE.Vector3(x, y, z);
    const stepB = new THREE.Vector3(x + side * (0.08 + random() * 0.22), y, z);
    const stepC = new THREE.Vector3(stepB.x, y + (random() - 0.5) * 0.28, z + (random() - 0.5) * 0.08);
    pushLine(stepA, stepB, trace * 0.19, 0.22 + random() * 0.32);
    pushLine(stepB, stepC, trace * 0.23, 0.16 + random() * 0.26);
  }

  for (let spoke = 0; spoke < 26; spoke += 1) {
    const angle = (spoke / 26) * Math.PI * 2;
    const inner = 1.2 + random() * 0.36;
    const outer = 2.05 + random() * 0.58;
    const z = (random() - 0.5) * 0.32;
    pushLine(
      new THREE.Vector3(Math.cos(angle) * inner, Math.sin(angle) * inner * 0.78, z),
      new THREE.Vector3(Math.cos(angle) * outer, Math.sin(angle) * outer * 0.78, z + (random() - 0.5) * 0.2),
      spoke * 0.41,
      spoke % 5 === 0 ? 0.78 : 0.28
    );
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("aPhase", new THREE.Float32BufferAttribute(phases, 1));
  geometry.setAttribute("aIntensity", new THREE.Float32BufferAttribute(intensities, 1));
  return geometry;
}

function buildModeSignatureGeometry(palette: LegacyEnergyPalette) {
  const seedMap: Record<LegacyEnergyPalette, number> = {
    gold: 99281,
    blue: 60319,
    green: 84011,
    red: 19441,
    violet: 71077,
    orange: 99281
  };
  const random = seededRandom(seedMap[palette]);
  const positions: number[] = [];
  const phases: number[] = [];
  const intensities: number[] = [];

  const pushLine = (a: THREE.Vector3, b: THREE.Vector3, phase = random() * Math.PI * 2, intensity = 0.4 + random() * 0.55) => {
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    phases.push(phase, phase + 0.2);
    intensities.push(intensity, intensity);
  };
  const pushArc = (
    rx: number,
    rz: number,
    tilt: THREE.Euler,
    start: number,
    end: number,
    segments: number,
    yWarp = 0.04,
    intensity = 0.54
  ) => {
    const previous = new THREE.Vector3();
    for (let index = 0; index <= segments; index += 1) {
      const t = index / segments;
      const angle = start + (end - start) * t;
      const radiusPulse = 1 + Math.sin(angle * 4.0 + rx) * 0.018;
      const point = new THREE.Vector3(
        Math.cos(angle) * rx * radiusPulse,
        Math.sin(angle * 2.0 + rz) * yWarp,
        Math.sin(angle) * rz * radiusPulse
      );
      point.applyEuler(tilt);
      if (index > 0 && random() > 0.13) pushLine(previous, point, angle, intensity + random() * 0.28);
      previous.copy(point);
    }
  };

  if (palette === "blue") {
    for (let layer = 0; layer < 4; layer += 1) {
      const z = -0.34 + layer * 0.22;
      const w = 1.48 + layer * 0.24;
      const h = 1.04 + layer * 0.16;
      for (let step = 0; step < 14; step += 1) {
        const y = -h + (step / 13) * h * 2;
        const x = -w + (step % 5) * 0.055;
        pushLine(new THREE.Vector3(x, y, z), new THREE.Vector3(x + 0.22 + random() * 0.36, y, z), step, 0.34 + layer * 0.1);
        pushLine(new THREE.Vector3(w, -y, z), new THREE.Vector3(w - 0.22 - random() * 0.36, -y, z), step + 0.4, 0.28 + layer * 0.09);
      }
      pushArc(1.26 + layer * 0.24, 1.02 + layer * 0.2, new THREE.Euler(0.62, 0.18 * layer, 0.48), 0.15, 5.4, 70, 0.018, 0.38);
    }
  } else if (palette === "green") {
    for (let branch = 0; branch < 90; branch += 1) {
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      const root = new THREE.Vector3(Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta));
      const radius = 0.68 + random() * 1.28;
      const start = root.clone().multiplyScalar(radius);
      const twist = new THREE.Vector3(root.z, -root.x, root.y).normalize().multiplyScalar(0.03 + random() * 0.14);
      const mid = start.clone().add(twist);
      const end = root.clone().multiplyScalar(radius + 0.08 + random() * 0.32).add(twist.multiplyScalar(0.7));
      pushLine(start, mid, branch * 0.2, 0.22 + random() * 0.46);
      pushLine(mid, end, branch * 0.26, 0.18 + random() * 0.42);
    }
    for (let arc = 0; arc < 8; arc += 1) {
      pushArc(0.78 + arc * 0.18, 0.62 + arc * 0.16, new THREE.Euler(0.24 + arc * 0.19, 0.7, arc * 0.4), 0.3, 4.8, 54, 0.09, 0.34);
    }
  } else if (palette === "red") {
    for (let beam = 0; beam < 18; beam += 1) {
      const angle = (beam / 18) * Math.PI * 2 + random() * 0.12;
      const tilt = (random() - 0.5) * 0.5;
      const a = new THREE.Vector3(Math.cos(angle) * -0.38, Math.sin(angle + tilt) * -0.28, -0.08 + random() * 0.18);
      const b = new THREE.Vector3(Math.cos(angle) * (1.9 + random() * 0.6), Math.sin(angle + tilt) * (1.18 + random() * 0.4), (random() - 0.5) * 0.45);
      pushLine(a, b, beam * 0.47, beam % 3 === 0 ? 0.95 : 0.46);
    }
    for (let arc = 0; arc < 6; arc += 1) {
      pushArc(1.05 + arc * 0.22, 0.82 + arc * 0.16, new THREE.Euler(0.9, arc * 0.28, 0.18 + arc * 0.62), 0.2, 1.8 + random() * 2.0, 52, 0.025, 0.58);
    }
  } else if (palette === "violet") {
    for (let helix = 0; helix < 4; helix += 1) {
      const tilt = new THREE.Euler(0.84, helix * 0.44, helix * 0.68);
      const previous = new THREE.Vector3();
      for (let step = 0; step < 128; step += 1) {
        const t = step / 127;
        const angle = t * Math.PI * 4 + helix * Math.PI * 0.5;
        const radius = 0.58 + t * 1.45;
        const point = new THREE.Vector3(Math.cos(angle) * radius, (t - 0.5) * 1.18, Math.sin(angle) * radius * 0.76);
        point.applyEuler(tilt);
        if (step > 0 && step % 7 !== 0) pushLine(previous, point, angle, 0.38 + t * 0.44);
        previous.copy(point);
      }
    }
    for (let arc = 0; arc < 7; arc += 1) {
      pushArc(0.62 + arc * 0.22, 0.58 + arc * 0.2, new THREE.Euler(0.28 + arc * 0.16, 1.1, arc * 0.31), 0, Math.PI * 2, 76, 0.035, 0.42);
    }
  } else {
    for (let arc = 0; arc < 13; arc += 1) {
      pushArc(0.72 + arc * 0.13, 0.58 + arc * 0.11, new THREE.Euler(0.42 + arc * 0.12, 0.22, arc * 0.35), 0.12, 5.84, 54, 0.045, 0.36);
    }
    for (let node = 0; node < 70; node += 1) {
      const angle = random() * Math.PI * 2;
      const inner = 0.32 + random() * 0.5;
      const outer = 1.1 + random() * 1.15;
      pushLine(
        new THREE.Vector3(Math.cos(angle) * inner, Math.sin(angle * 1.8) * inner * 0.45, Math.sin(angle) * inner),
        new THREE.Vector3(Math.cos(angle) * outer, Math.sin(angle * 1.8) * outer * 0.45, Math.sin(angle) * outer),
        node,
        node % 6 === 0 ? 0.85 : 0.3
      );
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("aPhase", new THREE.Float32BufferAttribute(phases, 1));
  geometry.setAttribute("aIntensity", new THREE.Float32BufferAttribute(intensities, 1));
  return geometry;
}

function makeModeConduitCurves(palette: LegacyEnergyPalette) {
  const random = seededRandom((palette === "blue" ? 2 : palette === "green" ? 3 : palette === "red" ? 4 : palette === "violet" ? 5 : 1) * 55123);
  return Array.from({ length: 14 }, (_, index) => {
    const theta = (index / 14) * Math.PI * 2 + random() * 0.32;
    const tilt = new THREE.Euler(random() * 1.4, random() * 1.1, random() * 1.2);
    const points = Array.from({ length: 6 }, (_, pointIndex) => {
      const t = pointIndex / 5;
      const radius = 0.28 + t * (1.76 + random() * 0.38);
      const curl = theta + Math.sin(t * Math.PI * 2 + index) * (palette === "green" ? 0.52 : 0.28);
      const point = new THREE.Vector3(
        Math.cos(curl) * radius,
        Math.sin(t * Math.PI * 1.5 + index) * (palette === "violet" ? 0.46 : 0.26),
        Math.sin(curl) * radius * (0.74 + random() * 0.22)
      );
      return point.applyEuler(tilt);
    });
    return new THREE.CatmullRomCurve3(points, false, "centripetal", 0.44);
  });
}

function ModeSignature({ activity, palette = "gold" }: CinematicOrbProps) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => buildModeSignatureGeometry(palette), [palette]);
  const shader = useMemo(makeLineShader, []);

  useFrame(({ clock }, delta) => {
    const mode = modeFor(palette);
    if (material.current) {
      material.current.uniforms.uTime.value = clock.elapsedTime * (palette === "red" ? 1.55 : 0.95);
      material.current.uniforms.uEnergy.value = activityEnergy(activity) * mode.pulse;
      material.current.uniforms.uOpacity.value =
        (palette === "blue" ? 0.36 : palette === "green" ? 0.3 : palette === "red" ? 0.42 : palette === "violet" ? 0.46 : 0.28) *
        (activity === "speaking" ? 1.25 : 1);
      material.current.uniforms.uColor.value.copy(palette === "gold" || activity === "speaking" ? HOT_PLASMA : PLASMA);
    }
    if (group.current) {
      group.current.rotation.y += delta * 0.026 * mode.speed * activitySpeed(activity);
      group.current.rotation.x = Math.sin(clock.elapsedTime * 0.19) * (palette === "green" ? 0.12 : 0.05);
      group.current.rotation.z += delta * (palette === "red" ? -0.044 : 0.013) * mode.speed;
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

function ModeConduits({ activity, palette = "gold" }: CinematicOrbProps) {
  const points = useRef<THREE.Points>(null);
  const curves = useMemo(() => makeModeConduitCurves(palette), [palette]);
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
    const mode = modeFor(palette);
    const speed = activitySpeed(activity) * mode.packet;
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
        opacity={palette === "red" || activity === "speaking" ? 0.98 : 0.76}
        size={palette === "blue" ? 0.036 : 0.046}
        sizeAttenuation
        toneMapped={false}
        transparent
      />
    </points>
  );
}

function buildPaletteArchitectureGeometry(palette: LegacyEnergyPalette) {
  const random = seededRandom((palette === "blue" ? 321 : palette === "green" ? 654 : palette === "violet" ? 987 : palette === "gold" ? 123 : 432) * 7919);
  const positions: number[] = [];
  const phases: number[] = [];
  const intensities: number[] = [];

  const pushLine = (a: THREE.Vector3, b: THREE.Vector3, phase = random() * Math.PI * 2, intensity = 0.42 + random() * 0.48) => {
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    phases.push(phase, phase + 0.16);
    intensities.push(intensity, intensity);
  };

  const pushBrokenRing = (radius: number, tilt: THREE.Euler, startOffset: number, breaks: number, zScale = 0.72) => {
    const segments = 118;
    let previous: THREE.Vector3 | null = null;
    for (let index = 0; index <= segments; index += 1) {
      const t = index / segments;
      const angle = startOffset + t * Math.PI * 2;
      const gap = Math.sin(angle * breaks + radius) > 0.72 || Math.sin(angle * (breaks + 2.0) - radius) < -0.86;
      const point = new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle * 2.0 + radius) * 0.022,
        Math.sin(angle) * radius * zScale
      );
      point.applyEuler(tilt);
      if (!gap && previous) pushLine(previous, point, angle, 0.36 + radius * 0.18);
      previous = gap ? null : point;
    }
  };
  if (palette === "blue") {
    const layers = [-0.46, -0.18, 0.16, 0.42];
    layers.forEach((z, layer) => {
      const w = 1.18 + layer * 0.26;
      const h = 0.82 + layer * 0.18;
      const corners = [
        new THREE.Vector3(-w, -h, z),
        new THREE.Vector3(w, -h, z),
        new THREE.Vector3(w, h, z),
        new THREE.Vector3(-w, h, z)
      ];
      corners.forEach((corner, index) => pushLine(corner, corners[(index + 1) % corners.length], layer + index * 0.4, 0.54));
      for (let bus = 0; bus < 16; bus += 1) {
        const y = -h + (bus / 15) * h * 2;
        const left = new THREE.Vector3(-w, y, z + (random() - 0.5) * 0.04);
        const right = new THREE.Vector3(w, y + (random() - 0.5) * 0.05, z);
        if (bus % 3 !== 0) pushLine(left, right, bus * 0.27, 0.26 + layer * 0.1);
      }
    });
    for (let spoke = 0; spoke < 18; spoke += 1) {
      const angle = (spoke / 18) * Math.PI * 2;
      const inner = new THREE.Vector3(Math.cos(angle) * 0.44, Math.sin(angle) * 0.32, -0.18);
      const outer = new THREE.Vector3(Math.cos(angle) * 2.15, Math.sin(angle) * 1.48, 0.24);
      if (spoke % 4 !== 0) pushLine(inner, outer, spoke * 0.36, 0.34);
    }
  } else if (palette === "green") {
    for (let vine = 0; vine < 120; vine += 1) {
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      const normal = new THREE.Vector3(Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta)).normalize();
      const tangent = new THREE.Vector3(normal.z, -normal.x, normal.y).normalize();
      let current = normal.clone().multiplyScalar(0.55 + random() * 1.28);
      const steps = 2 + Math.floor(random() * 4);
      for (let step = 0; step < steps; step += 1) {
        const curl = tangent.clone().multiplyScalar((0.08 + random() * 0.18) * (step % 2 === 0 ? 1 : -1));
        const next = current.clone().add(curl).addScaledVector(normal, 0.06 + random() * 0.16);
        if (random() > 0.2) pushLine(current, next, vine * 0.19 + step, 0.24 + random() * 0.52);
        current = next;
      }
    }
    for (let ring = 0; ring < 7; ring += 1) {
      pushBrokenRing(0.55 + ring * 0.21, new THREE.Euler(0.22 + ring * 0.13, 0.75, ring * 0.44), ring * 0.5, 5 + ring, 0.54);
    }
  } else if (palette === "violet") {
    for (let diamond = 0; diamond < 5; diamond += 1) {
      const scale = 0.48 + diamond * 0.32;
      const tilt = new THREE.Euler(0.86, diamond * 0.32, 0.62 + diamond * 0.22);
      const vertices = [
        new THREE.Vector3(0, scale, 0),
        new THREE.Vector3(scale * 1.28, 0, scale * 0.28),
        new THREE.Vector3(0, -scale, 0),
        new THREE.Vector3(-scale * 1.28, 0, -scale * 0.28)
      ].map((point) => point.applyEuler(tilt));
      vertices.forEach((point, index) => pushLine(point, vertices[(index + 1) % vertices.length], diamond + index, 0.58));
    }
    for (let helix = 0; helix < 6; helix += 1) {
      let previous: THREE.Vector3 | null = null;
      const tilt = new THREE.Euler(0.38 + helix * 0.14, 0.9, helix * 0.52);
      for (let step = 0; step < 96; step += 1) {
        const t = step / 95;
        const angle = t * Math.PI * 5 + helix * 0.75;
        const radius = 0.28 + t * 1.7;
        const point = new THREE.Vector3(Math.cos(angle) * radius, (t - 0.5) * 1.7, Math.sin(angle) * radius * 0.48).applyEuler(tilt);
        if (previous && step % 8 !== 0) pushLine(previous, point, angle, 0.36 + t * 0.42);
        previous = point;
      }
    }
  } else {
    for (let ring = 0; ring < 12; ring += 1) {
      pushBrokenRing(0.42 + ring * 0.14, new THREE.Euler(0.26 + ring * 0.07, ring * 0.09, ring * 0.28), ring * 0.38, 7, 0.78);
    }
    const triads = [
      [0, 2.09, 4.18],
      [0.72, 2.82, 4.91],
      [1.36, 3.45, 5.55]
    ];
    triads.forEach((triad, triIndex) => {
      const radius = 0.58 + triIndex * 0.38;
      const points = triad.map((angle) => new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle * 1.4) * 0.18, Math.sin(angle) * radius * 0.72));
      points.forEach((point, index) => pushLine(point, points[(index + 1) % points.length], triIndex + index * 0.24, 0.62));
    });
    for (let ray = 0; ray < 28; ray += 1) {
      const angle = (ray / 28) * Math.PI * 2;
      const inner = 0.34 + random() * 0.24;
      const outer = 1.26 + random() * 0.56;
      if (ray % 5 !== 0) {
        pushLine(
          new THREE.Vector3(Math.cos(angle) * inner, Math.sin(angle * 2.0) * 0.08, Math.sin(angle) * inner * 0.7),
          new THREE.Vector3(Math.cos(angle) * outer, Math.sin(angle * 2.0) * 0.18, Math.sin(angle) * outer * 0.7),
          ray,
          0.42
        );
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("aPhase", new THREE.Float32BufferAttribute(phases, 1));
  geometry.setAttribute("aIntensity", new THREE.Float32BufferAttribute(intensities, 1));
  return geometry;
}

function PaletteArchitecture({ activity, palette = "gold" }: CinematicOrbProps) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => buildPaletteArchitectureGeometry(palette), [palette]);
  const shader = useMemo(makeLineShader, []);

  useFrame(({ clock }, delta) => {
    const mode = modeFor(palette);
    if (material.current) {
      material.current.uniforms.uTime.value = clock.elapsedTime * (palette === "blue" ? 0.7 : palette === "green" ? 0.5 : palette === "violet" ? 1.18 : 0.86);
      material.current.uniforms.uEnergy.value = activityEnergy(activity) * (palette === "red" ? 1 : mode.pulse);
      material.current.uniforms.uOpacity.value =
        (palette === "blue" ? 0.42 : palette === "green" ? 0.34 : palette === "violet" ? 0.5 : 0.38) *
        (activity === "speaking" ? 1.22 : 1);
      material.current.uniforms.uColor.value.copy(palette === "gold" ? HOT_PLASMA : PLASMA);
    }
    if (group.current) {
      group.current.rotation.y += delta * (palette === "blue" ? 0.018 : palette === "green" ? -0.011 : palette === "violet" ? 0.052 : 0.026) * activitySpeed(activity);
      group.current.rotation.z += delta * (palette === "violet" ? -0.032 : 0.009) * mode.speed;
      group.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * (palette === "green" ? 0.74 : 0.42)) * 0.012 * activityEnergy(activity));
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

function TechScaffold({ activity, palette = "gold" }: CinematicOrbProps) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(buildTechScaffoldGeometry, []);
  const shader = useMemo(makeLineShader, []);

  useFrame(({ clock }, delta) => {
    const energy = activityEnergy(activity);
    const mode = modeFor(palette);
    if (material.current) {
      material.current.uniforms.uTime.value = clock.elapsedTime * 0.72;
      material.current.uniforms.uEnergy.value = (activity === "speaking" ? energy * 1.22 : energy * 0.9) * mode.scaffold;
      material.current.uniforms.uOpacity.value = (activity === "listening" ? 0.16 : activity === "speaking" ? 0.28 : 0.2) * mode.scaffold;
      material.current.uniforms.uColor.value.copy(palette === "blue" ? PLASMA : HOT_PLASMA);
    }
    if (group.current) {
      group.current.rotation.y += delta * 0.012 * activitySpeed(activity) * mode.speed;
      group.current.rotation.z = Math.sin(clock.elapsedTime * 0.18) * 0.018;
    }
  });

  return (
    <group ref={group} rotation={[0.02, 0.08, 0]}>
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

function CameraOrbitController({ resetSignal = 0 }: Pick<CinematicOrbProps, "resetSignal">) {
  const { camera, gl, size } = useThree();
  const controls = useMemo(() => new OrbitControls(camera, gl.domElement), [camera, gl]);

  useEffect(() => {
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.enableRotate = false;
    controls.rotateSpeed = 0;
    controls.zoomSpeed = 0.48;
    controls.minDistance = 5.25;
    controls.maxDistance = size.width / size.height < 0.72 ? 15 : 8.6;
    controls.target.set(0, 0, 0);
    gl.domElement.classList.add("is-orbit-enabled");
    return () => {
      gl.domElement.classList.remove("is-orbit-enabled");
      controls.dispose();
    };
  }, [controls, gl.domElement, size]);

  useEffect(() => {
    const narrow = size.width / size.height < 0.72;
    const distance = narrow ? 12.9 : 7.15;
    camera.position.set(0, 0, distance);
    controls.target.set(0, 0, 0);
    controls.update();
  }, [camera, controls, resetSignal, size.height, size.width]);

  useFrame(() => controls.update());
  return null;
}

function CanvasPaletteBackground({ palette = "gold" }: Pick<CinematicOrbProps, "palette">) {
  const { gl } = useThree();

  useEffect(() => {
    applyOrbPalette(palette);
    gl.setClearColor(BACKGROUND_CLEAR, 1);
  }, [gl, palette]);

  return null;
}

function ResponsePulseRings({ activity }: CinematicOrbProps) {
  const group = useRef<THREE.Group>(null);
  const meshes = useRef<THREE.Mesh[]>([]);
  const rings = useMemo(
    () => [
      { rotation: [Math.PI * 0.5, 0, 0.1], radius: 0.34, speed: 0.72 },
      { rotation: [0.55, 0.18, 1.12], radius: 0.43, speed: 0.62 },
      { rotation: [1.18, -0.35, 0.42], radius: 0.52, speed: 0.58 },
      { rotation: [0.2, 0.82, 1.62], radius: 0.62, speed: 0.48 },
      { rotation: [1.34, 0.32, -0.74], radius: 0.73, speed: 0.42 },
      { rotation: [0.72, -0.9, 0.08], radius: 0.86, speed: 0.36 }
    ],
    []
  );

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const active = activity === "speaking";
    const thinking = activity === "thinking";
    const level = active ? 1 : thinking ? 0.46 : 0.18;

    if (group.current) {
      const voiceScale = active ? 1 + Math.sin(t * 9.6) * 0.07 : 1 + Math.sin(t * 2.1) * 0.012;
      group.current.scale.setScalar(voiceScale);
      group.current.rotation.y += delta * (active ? 0.38 : 0.1);
      group.current.rotation.x = Math.sin(t * 0.32) * 0.06;
    }

    meshes.current.forEach((mesh, index) => {
      const material = mesh.material as THREE.MeshBasicMaterial;
      const progress = (t * rings[index].speed + index * 0.17) % 1;
      const responseBurst = active ? Math.pow(1 - progress, 1.8) : 0;
      const idleFlicker = Math.pow(0.5 + 0.5 * Math.sin(t * (1.5 + index * 0.21) + index), 4);
      mesh.scale.setScalar(1 + (active ? progress * 1.45 : thinking ? idleFlicker * 0.12 : 0));
      mesh.rotation.z += delta * (active ? 0.42 + index * 0.04 : 0.08);
      material.color.copy(index % 2 === 0 ? WHITE_HOT : HOT_PLASMA);
      material.opacity = (0.045 + level * 0.16 + responseBurst * 0.62) * (0.78 + idleFlicker * 0.22);
    });
  });

  return (
    <group ref={group}>
      {rings.map((ring, index) => (
        <mesh
          key={`${ring.radius}-${index}`}
          ref={(node) => {
            if (node) meshes.current[index] = node;
          }}
          rotation={ring.rotation as [number, number, number]}
        >
          <torusGeometry args={[ring.radius, 0.004 + index * 0.0008, 4, 180]} />
          <meshBasicMaterial
            blending={THREE.AdditiveBlending}
            color={HOT_PLASMA}
            depthWrite={false}
            opacity={0.08}
            toneMapped={false}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

function SceneRig({ activity, palette = "gold", resetSignal = 0, triangularCore = false }: CinematicOrbProps) {
  const root = useRef<THREE.Group>(null);
  const { pointer, size } = useThree();
  const drag = useRef({
    active: false,
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    lastX: 0,
    lastY: 0
  });

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || isInteractiveTarget(event.target)) return;
      drag.current.active = true;
      drag.current.lastX = event.clientX;
      drag.current.lastY = event.clientY;
      document.body.classList.add("is-reactor-dragging");
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!drag.current.active) return;
      const dx = event.clientX - drag.current.lastX;
      const dy = event.clientY - drag.current.lastY;
      drag.current.lastX = event.clientX;
      drag.current.lastY = event.clientY;
      drag.current.targetY += dx * 0.0065;
      drag.current.targetX += dy * 0.0048;
      drag.current.targetX = THREE.MathUtils.clamp(drag.current.targetX, -0.9, 0.9);
    };

    const stopDragging = () => {
      drag.current.active = false;
      document.body.classList.remove("is-reactor-dragging");
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("pointercancel", stopDragging);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("pointercancel", stopDragging);
      document.body.classList.remove("is-reactor-dragging");
    };
  }, []);

  useEffect(() => {
    drag.current.x = 0;
    drag.current.y = 0;
    drag.current.targetX = 0;
    drag.current.targetY = 0;
  }, [resetSignal]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const narrow = size.width / size.height < 0.72;
    if (root.current) {
      drag.current.x = THREE.MathUtils.lerp(drag.current.x, drag.current.targetX, 0.09);
      drag.current.y = THREE.MathUtils.lerp(drag.current.y, drag.current.targetY, 0.09);
      const breath =
        1 +
        Math.sin(t * (activity === "speaking" ? 5.8 : 0.88)) *
          (activity === "speaking" ? 0.026 : 0.009) *
          activityEnergy(activity);
      root.current.scale.setScalar(breath);
      const hoverLean = narrow ? 0 : 0.08;
      root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, drag.current.x - pointer.y * hoverLean, 0.045);
      root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, drag.current.y + pointer.x * hoverLean, 0.045);
      root.current.rotation.z = Math.sin(t * 0.12) * 0.016;
    }
  });

  return (
    <group ref={root}>
      {palette === "red" && (
        <>
          <TechScaffold activity={activity} palette={palette} />
          <FresnelVolume activity={activity} />
          <OuterHaloFragments activity={activity} />
          <CircuitShell activity={activity} />
          <DataFragments activity={activity} />
          <ModeSignature activity={activity} palette={palette} />
          <PlanetaryOrbitField activity={activity} />
          <ModeConduits activity={activity} palette={palette} />
          <EnergyFilaments activity={activity} />
          <AccretionBelt activity={activity} />
          <FluxPackets activity={activity} />
          <AxisBeams activity={activity} />
          <CoreSpokes activity={activity} />
          <ResponsePulseRings activity={activity} />
          <CoreVortex activity={activity} triangularCore={triangularCore} />
        </>
      )}

      {palette === "gold" && (
        <>
          <FresnelVolume activity={activity} />
          <OuterHaloFragments activity={activity} />
          <group scale={[1.05, 0.92, 1.05]}>
            <PaletteArchitecture activity={activity} palette={palette} />
            <PlanetaryOrbitField activity={activity} />
            <AccretionBelt activity={activity} />
          </group>
          <ModeConduits activity={activity} palette={palette} />
          <AxisBeams activity={activity} />
          <CoreSpokes activity={activity} />
          <ResponsePulseRings activity={activity} />
          <CoreVortex activity={activity} triangularCore={triangularCore} />
        </>
      )}

      {palette === "blue" && (
        <>
          <group scale={[1.14, 0.78, 0.92]} rotation={[0.08, -0.18, 0.02]}>
            <TechScaffold activity={activity} palette={palette} />
            <PaletteArchitecture activity={activity} palette={palette} />
            <CircuitShell activity={activity} />
          </group>
          <DataFragments activity={activity} />
          <ModeSignature activity={activity} palette={palette} />
          <ModeConduits activity={activity} palette={palette} />
          <FluxPackets activity={activity} />
          <CoreSpokes activity={activity} />
          <CoreVortex activity={activity} />
        </>
      )}

      {palette === "green" && (
        <>
          <FresnelVolume activity={activity} />
          <group scale={[0.9, 1.16, 1.06]} rotation={[0.14, 0.22, -0.16]}>
            <PaletteArchitecture activity={activity} palette={palette} />
            <EnergyFilaments activity={activity} />
            <ModeSignature activity={activity} palette={palette} />
          </group>
          <DataFragments activity={activity} />
          <ModeConduits activity={activity} palette={palette} />
          <FluxPackets activity={activity} />
          <CoreSpokes activity={activity} />
          <CoreVortex activity={activity} />
        </>
      )}

      {palette === "violet" && (
        <>
          <group scale={[0.86, 1.22, 0.88]} rotation={[0.08, -0.14, 0.24]}>
            <PaletteArchitecture activity={activity} palette={palette} />
            <ModeSignature activity={activity} palette={palette} />
            <ModeConduits activity={activity} palette={palette} />
          </group>
          <DataFragments activity={activity} />
          <ResponsePulseRings activity={activity} />
          <FluxPackets activity={activity} />
          <CoreSpokes activity={activity} />
          <CoreVortex activity={activity} />
        </>
      )}
    </group>
  );
}

function PostFX({ activity, palette = "gold" }: CinematicOrbProps) {
  const mode = modeFor(palette);
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={(activity === "speaking" ? 2.55 : activity === "thinking" ? 2.08 : 1.84) * mode.bloom}
        luminanceSmoothing={0.64}
        luminanceThreshold={0.22}
        mipmapBlur
      />
    </EffectComposer>
  );
}

export default function LegacyCinematicOrb({ activity, palette = "gold", resetSignal = 0 }: CinematicOrbProps) {
  applyOrbPalette(palette);
  const architecturePalette = palette === "orange" ? "gold" : palette;

  return (
    <div className="orb-webgl" aria-hidden="true">
      <Canvas
        camera={{ fov: 41, near: 0.1, far: 30, position: [0, 0, 7.15] }}
        dpr={[1, 1.45]}
        gl={{
          alpha: false,
          antialias: false,
          powerPreference: "high-performance",
          stencil: false
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(BACKGROUND_CLEAR, 1);
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.98;
        }}
      >
        <CanvasPaletteBackground palette={palette} />
        <CameraOrbitController resetSignal={resetSignal} />
        <SceneRig activity={activity} key={palette} palette={architecturePalette} resetSignal={resetSignal} triangularCore={palette === "gold"} />
        <PostFX activity={activity} palette={architecturePalette} />
      </Canvas>
    </div>
  );
}
