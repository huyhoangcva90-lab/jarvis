import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { AiActivity } from "../../App";

type CinematicOrbProps = {
  activity: AiActivity;
};

type FilamentSpec = {
  radius: number;
  seed: number;
  span: number;
  speed: number;
  tilt: [number, number, number];
};

const PLASMA = new THREE.Color("#ff7a18");
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

function CoreVortex({ activity }: CinematicOrbProps) {
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
        <sphereGeometry args={[0.19, 24, 24]} />
        <meshBasicMaterial color={PLASMA} toneMapped={false} />
      </mesh>
      <mesh scale={1 + activityEnergy(activity) * 0.035}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshBasicMaterial
          blending={THREE.AdditiveBlending}
          color={PLASMA}
          depthWrite={false}
          opacity={0.2}
          toneMapped={false}
          transparent
        />
      </mesh>
      <mesh ref={knotA} rotation={[0.3, 0.2, 0.1]}>
        <torusKnotGeometry args={[0.34, 0.018, 180, 5, 2, 3]} />
        <meshBasicMaterial blending={THREE.AdditiveBlending} color={PLASMA} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={knotB} rotation={[1.1, 0.4, 0.8]} scale={1.18}>
        <torusKnotGeometry args={[0.34, 0.011, 180, 4, 3, 5]} />
        <meshBasicMaterial blending={THREE.AdditiveBlending} color={PLASMA} depthWrite={false} opacity={0.72} toneMapped={false} transparent />
      </mesh>
      <mesh ref={knotC} rotation={[0.2, 1.2, 0.5]} scale={1.42}>
        <torusKnotGeometry args={[0.34, 0.008, 180, 4, 2, 5]} />
        <meshBasicMaterial blending={THREE.AdditiveBlending} color={PLASMA} depthWrite={false} opacity={0.48} toneMapped={false} transparent />
      </mesh>
    </group>
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
          float alpha = (0.09 + vIntensity * 0.62) * mix(0.24, 1.0, vFront) * mix(0.72, flicker, 0.46) * uEnergy;
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
    }
    if (group.current) {
      group.current.rotation.y += delta * 0.028 * activitySpeed(activity);
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
        uColor: { value: PLASMA }
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
          vAlpha = mix(0.14, 0.92, front) * pulse;
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
          gl_FragColor = vec4(uColor, mask * vAlpha);
        }
      `
    }),
    []
  );

  useFrame(({ clock }, delta) => {
    if (material.current) {
      material.current.uniforms.uTime.value = clock.elapsedTime;
      material.current.uniforms.uEnergy.value = activityEnergy(activity);
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
    material.opacity = (0.28 + (index % 4) * 0.12) * (0.82 + Math.sin(clock.elapsedTime * 1.3 + index) * 0.18);
  });

  return (
    <mesh ref={mesh} geometry={geometry}>
      <meshBasicMaterial
        blending={THREE.AdditiveBlending}
        color={PLASMA}
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
        color={PLASMA}
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
        uColor: { value: PLASMA }
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
          gl_FragColor = vec4(uColor, fresnel * 0.018 * uEnergy);
        }
      `
    }),
    []
  );
  useFrame(() => {
    if (material.current) material.current.uniforms.uEnergy.value = activityEnergy(activity);
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

function SceneRig({ activity }: CinematicOrbProps) {
  const root = useRef<THREE.Group>(null);
  const { camera, size } = useThree();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const narrow = size.width / size.height < 0.72;
    const distance = narrow ? 12.9 : 7.15;
    if (root.current) {
      const breath = 1 + Math.sin(t * 0.88) * 0.009 * activityEnergy(activity);
      root.current.scale.setScalar(breath);
      root.current.rotation.z = Math.sin(t * 0.12) * 0.016;
    }
    camera.position.set(
      Math.sin(t * 0.11) * (narrow ? 0.035 : 0.09),
      Math.cos(t * 0.09) * (narrow ? 0.03 : 0.07),
      distance + Math.sin(t * 0.14) * 0.1
    );
    camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={root}>
      <FresnelVolume activity={activity} />
      <CircuitShell activity={activity} />
      <DataFragments activity={activity} />
      <EnergyFilaments activity={activity} />
      <FluxPackets activity={activity} />
      <CoreVortex activity={activity} />
    </group>
  );
}

function PostFX({ activity }: CinematicOrbProps) {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={activity === "speaking" ? 2.05 : activity === "thinking" ? 1.88 : 1.72}
        luminanceSmoothing={0.56}
        luminanceThreshold={0.27}
        mipmapBlur
      />
    </EffectComposer>
  );
}

export default function CinematicOrb({ activity }: CinematicOrbProps) {
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
          gl.setClearColor("#010100", 1);
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.92;
        }}
      >
        <SceneRig activity={activity} />
        <PostFX activity={activity} />
      </Canvas>
    </div>
  );
}
