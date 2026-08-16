import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AiActivity } from "../../App";
import { activityEnergy, activityPulse, activitySpeed, seededRandom, segmentGeometry, pathGeometry } from "../shared/coreMotion";

// ── Color Palette: Agamotto Green / Time Stone ──
const EMERALD     = "#23e777";
const MINT        = "#66ff9f";
const PALE        = "#e0ffea";
const LIME        = "#8eff66";
const GOLD_ACCENT = "#ffdb4d";
const DEEP_GREEN  = "#064d2a";
const BRONZE      = "#8c6721";
const WHITE       = "#ffffff";

const TAU = Math.PI * 2;

// ══════════════════════════════════════════════════════════════════
// 1. RAW TIME STONE CRYSTAL CORE
//    Hexagonal bipyramid with volumetric inner glow + fracture veins
// ══════════════════════════════════════════════════════════════════

const crystalVertexShader = `
  uniform float uTime;
  uniform float uEnergy;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPosition;
  varying float vFresnel;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;

    // Subtle breathing deformation
    vec3 p = position + normal * sin(position.y * 8.0 + uTime * 1.6) * 0.012 * uEnergy;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vView = normalize(-mv.xyz);
    vFresnel = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.8);
    gl_Position = projectionMatrix * mv;
  }
`;

const crystalFragmentShader = `
  uniform float uTime;
  uniform float uEnergy;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPosition;
  varying float vFresnel;

  // Pseudo-random hash
  float hash(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
  }

  // 3D noise for fracture veins
  float noise3D(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z
    );
  }

  void main() {
    // Fracture vein pattern — bright energy cracks
    float vein1 = pow(abs(sin(vPosition.x * 14.0 + vPosition.y * 9.0 + uTime * 0.8)), 12.0);
    float vein2 = pow(abs(sin(vPosition.z * 11.0 - vPosition.y * 7.0 - uTime * 1.2)), 10.0);
    float veins = vein1 + vein2;

    // Volumetric inner glow
    float inner = noise3D(vPosition * 6.0 + uTime * 0.4) * 0.6 + 0.4;
    float pulse = 0.5 + 0.5 * sin(uTime * 2.8 + vPosition.y * 3.0);

    // Core color mix
    vec3 deepGreen = vec3(0.024, 0.302, 0.165);
    vec3 emerald   = vec3(0.137, 0.905, 0.467);
    vec3 mint      = vec3(0.557, 1.0, 0.4);
    vec3 gold      = vec3(1.0, 0.858, 0.302);

    vec3 base = mix(deepGreen, emerald, inner);
    base = mix(base, mint, veins * 0.7);
    base = mix(base, gold, veins * pulse * 0.35);

    // Fresnel edge glow
    base += emerald * vFresnel * 1.8;

    float alpha = 0.82 + vFresnel * 0.18 + veins * 0.12;
    gl_FragColor = vec4(base * (1.0 + uEnergy * 0.5), alpha);
  }
`;

function RawTimeStoneCrystal({ activity }: { activity: AiActivity }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const shardsRef = useRef<THREE.Group>(null);

  // Build the faceted crystal geometry — hexagonal bipyramid (diamond-like)
  const crystalGeom = useMemo(() => {
    const geom = new THREE.OctahedronGeometry(0.32, 0);
    // Scale Y to elongate
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      pos.setY(i, pos.getY(i) * 1.42);
    }
    pos.needsUpdate = true;
    geom.computeVertexNormals();
    return geom;
  }, []);

  // Satellite crystal shards
  const shardData = useMemo(() => {
    const rng = seededRandom(77721);
    return Array.from({ length: 6 }, (_, i) => ({
      angle: (i / 6) * TAU + rng() * 0.5,
      radius: 0.52 + rng() * 0.18,
      y: (rng() - 0.5) * 0.3,
      scale: 0.04 + rng() * 0.04,
      speed: 0.15 + rng() * 0.25,
      tilt: [rng() * Math.PI, rng() * Math.PI, rng() * Math.PI] as [number, number, number],
    }));
  }, []);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);
    const energy = activityEnergy(activity);
    const pulse = activityPulse(activity, time);

    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.4 * speed;
      coreRef.current.rotation.x = Math.sin(time * 0.3) * 0.15;
      coreRef.current.scale.setScalar(pulse * (0.92 + energy * 0.1));
    }

    if (shellRef.current) {
      shellRef.current.rotation.y -= delta * 0.25 * speed;
      shellRef.current.rotation.z = Math.sin(time * 0.4) * 0.12;
      shellRef.current.scale.setScalar(pulse * (1.08 + energy * 0.08));
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
      materialRef.current.uniforms.uEnergy.value = energy;
    }

    if (glowRef.current) {
      const glowScale = 1.8 + Math.sin(time * 2.2) * 0.15 * energy;
      glowRef.current.scale.setScalar(glowScale);
    }

    if (innerRef.current) {
      innerRef.current.scale.setScalar(0.16 + Math.sin(time * 3.5) * 0.02 * energy);
    }

    if (shardsRef.current) {
      shardsRef.current.children.forEach((shard, i) => {
        const d = shardData[i];
        const angle = d.angle + time * d.speed * speed;
        shard.position.set(
          Math.cos(angle) * d.radius,
          d.y + Math.sin(time * 1.2 + i * 1.3) * 0.05,
          Math.sin(angle) * d.radius
        );
        shard.rotation.y += delta * 1.2;
        shard.rotation.x += delta * 0.6;
      });
    }
  });

  return (
    <group>
      {/* White-hot nucleus center */}
      <mesh ref={innerRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={WHITE} toneMapped={false} />
      </mesh>

      {/* Volumetric glow halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshBasicMaterial
          blending={THREE.AdditiveBlending}
          color={EMERALD}
          depthWrite={false}
          opacity={0.18}
          toneMapped={false}
          transparent
        />
      </mesh>

      {/* Main faceted crystal */}
      <mesh ref={coreRef} geometry={crystalGeom}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={crystalVertexShader}
          fragmentShader={crystalFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uEnergy: { value: 1 },
          }}
          toneMapped={false}
          transparent
        />
      </mesh>

      {/* Second layer — glass refraction shell */}
      <mesh ref={shellRef} scale={1.12}>
        <octahedronGeometry args={[0.32, 1]} />
        <meshPhysicalMaterial
          clearcoat={1}
          clearcoatRoughness={0.04}
          color="#0aad55"
          depthWrite={false}
          ior={1.55}
          metalness={0.08}
          opacity={0.22}
          roughness={0.06}
          transmission={0.72}
          transparent
        />
      </mesh>

      {/* Satellite crystal shards */}
      <group ref={shardsRef}>
        {shardData.map((d, i) => (
          <mesh key={i} rotation={d.tilt} scale={d.scale}>
            <octahedronGeometry args={[1, 0]} />
            <meshBasicMaterial
              blending={THREE.AdditiveBlending}
              color={i % 2 === 0 ? MINT : LIME}
              depthWrite={false}
              opacity={0.72}
              toneMapped={false}
              transparent
            />
          </mesh>
        ))}
      </group>

      {/* Core point light */}
      <pointLight color={EMERALD} distance={7} intensity={5.5} decay={2} />
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════
// 2. MAIN MYSTIC MANDALA — Eldritch Spell Disc (Doctor Strange)
//    Tilted in 3D with Kamar-Taj geometric patterns
// ══════════════════════════════════════════════════════════════════

const mandalaVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const mandalaFragmentShader = `
  uniform float uTime;
  uniform float uEnergy;
  uniform float uDirection;
  varying vec2 vUv;

  void main() {
    vec2 p = vUv - vec2(0.5);
    float r = length(p) * 2.0;
    float angle = atan(p.y, p.x);

    // Concentric magical glyph circles at different radii
    float ring1 = smoothstep(0.025, 0.0, abs(r - 0.30));
    float ring2 = smoothstep(0.018, 0.0, abs(r - 0.52));
    float ring3 = smoothstep(0.015, 0.0, abs(r - 0.72));
    float ring4 = smoothstep(0.012, 0.0, abs(r - 0.88));
    float ring5 = smoothstep(0.010, 0.0, abs(r - 0.96));

    // 8-fold rosette petals (inner)
    float petals8 = abs(cos(angle * 8.0 + uTime * 0.6 * uDirection));
    float pattern8 = smoothstep(0.55, 0.95, petals8 * (1.0 - abs(r - 0.42) * 4.0));

    // 16-fold outer petals
    float petals16 = abs(sin(angle * 16.0 - uTime * 0.9 * uDirection));
    float pattern16 = smoothstep(0.62, 0.98, petals16 * (1.0 - abs(r - 0.62) * 5.0));

    // 24-fold filigree
    float petals24 = abs(cos(angle * 24.0 + uTime * 1.1 * uDirection));
    float pattern24 = smoothstep(0.72, 0.99, petals24 * (1.0 - abs(r - 0.80) * 6.0));

    // Radial spoke lines (12 spokes)
    float spokes = step(0.975, cos(angle * 12.0)) * smoothstep(0.25, 0.28, r) * smoothstep(0.96, 0.92, r);

    // Ancient glyph notches on outer rings
    float notches = step(0.88, sin(angle * 36.0 + uTime * 0.4 * uDirection)) * ring4;

    // Diamond/triangle marks at cardinal directions
    float diamonds = step(0.92, cos(angle * 4.0)) * smoothstep(0.48, 0.52, r) * smoothstep(0.56, 0.52, r) * 0.8;

    float mandala = ring1 + ring2 + ring3 + ring4 + ring5
                  + pattern8 * 0.72 + pattern16 * 0.85 + pattern24 * 0.55
                  + spokes * 0.65 + notches * 0.6 + diamonds;

    vec3 colEmerald = vec3(0.137, 0.905, 0.466);
    vec3 colMint    = vec3(0.400, 1.000, 0.623);
    vec3 colGold    = vec3(1.0, 0.858, 0.302);
    vec3 color = mix(colEmerald, colMint, r);
    color = mix(color, colGold, notches * 0.5 + diamonds * 0.4);

    float alpha = mandala * 0.72 * uEnergy * smoothstep(1.0, 0.82, r);
    gl_FragColor = vec4(color * 1.6, alpha);
  }
`;

function MainMysticMandala({ activity }: { activity: AiActivity }) {
  const mat1 = useRef<THREE.ShaderMaterial>(null);
  const mat2 = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const isThinking = activity === "thinking";

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const energy = activityEnergy(activity);
    const speed = activitySpeed(activity);
    const direction = isThinking ? -1 : 1;

    if (mat1.current) {
      mat1.current.uniforms.uTime.value = time;
      mat1.current.uniforms.uEnergy.value = energy;
      mat1.current.uniforms.uDirection.value = direction;
    }
    if (mat2.current) {
      mat2.current.uniforms.uTime.value = time * 0.75;
      mat2.current.uniforms.uEnergy.value = energy * 0.85;
      mat2.current.uniforms.uDirection.value = -direction;
    }
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * 0.04 * speed * direction;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.35, 0.12, 0]}>
      {/* Inner mandala disc */}
      <mesh position={[0, 0, -0.06]} scale={[3.2, 3.2, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          ref={mat1}
          vertexShader={mandalaVertexShader}
          fragmentShader={mandalaFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uEnergy: { value: 1 },
            uDirection: { value: 1 },
          }}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outer mandala disc */}
      <mesh position={[0, 0, -0.14]} scale={[4.6, 4.6, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          ref={mat2}
          vertexShader={mandalaVertexShader}
          fragmentShader={mandalaFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uEnergy: { value: 1 },
            uDirection: { value: -1 },
          }}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════
// 3. AUXILIARY GIMBAL RINGS — Spherical Gyroscope / Armillary
//    Multi-axis counter-rotating rings with rune ticks
// ══════════════════════════════════════════════════════════════════

function AuxiliaryGimbalRings({ activity }: { activity: AiActivity }) {
  const ringA = useRef<THREE.Group>(null);
  const ringB = useRef<THREE.Group>(null);
  const ringC = useRef<THREE.Group>(null);

  const tickGeomA = useMemo(() => {
    const segs: Array<[THREE.Vector3, THREE.Vector3]> = [];
    for (let i = 0; i < 24; i++) {
      if (i % 7 === 3) continue;
      const angle = (i / 24) * TAU;
      const inner = 1.92 - (i % 3) * 0.02;
      const outer = 2.08 + (i % 4) * 0.015;
      const cos_a = Math.cos(angle);
      const sin_a = Math.sin(angle);
      segs.push([
        new THREE.Vector3(cos_a * inner, sin_a * inner, 0),
        new THREE.Vector3(cos_a * outer, sin_a * outer, 0),
      ]);
    }
    return segmentGeometry(segs);
  }, []);

  const tickGeomB = useMemo(() => {
    const segs: Array<[THREE.Vector3, THREE.Vector3]> = [];
    for (let i = 0; i < 18; i++) {
      if (i % 5 === 2) continue;
      const angle = (i / 18) * TAU;
      const inner = 2.22;
      const outer = 2.38 + (i % 3) * 0.012;
      const cos_a = Math.cos(angle);
      const sin_a = Math.sin(angle);
      segs.push([
        new THREE.Vector3(cos_a * inner, sin_a * inner, 0),
        new THREE.Vector3(cos_a * outer, sin_a * outer, 0),
      ]);
    }
    return segmentGeometry(segs);
  }, []);

  useFrame((_, delta) => {
    const speed = activitySpeed(activity);
    if (ringA.current) ringA.current.rotation.z += delta * 0.14 * speed;
    if (ringB.current) ringB.current.rotation.z -= delta * 0.11 * speed;
    if (ringC.current) ringC.current.rotation.z += delta * 0.08 * speed;
  });

  return (
    <group>
      {/* Ring A — tilted forward */}
      <group ref={ringA} rotation={[Math.PI / 3.2, 0.15, 0]}>
        <mesh>
          <torusGeometry args={[2.0, 0.022, 6, 160]} />
          <meshBasicMaterial blending={THREE.AdditiveBlending} color={PALE} depthWrite={false} opacity={0.36} toneMapped={false} transparent />
        </mesh>
        <lineSegments geometry={tickGeomA}>
          <lineBasicMaterial blending={THREE.AdditiveBlending} color={MINT} depthWrite={false} opacity={0.3} toneMapped={false} transparent />
        </lineSegments>
      </group>

      {/* Ring B — tilted backward */}
      <group ref={ringB} rotation={[-Math.PI / 3.2, -0.15, 0]}>
        <mesh>
          <torusGeometry args={[2.3, 0.018, 6, 160]} />
          <meshBasicMaterial blending={THREE.AdditiveBlending} color={EMERALD} depthWrite={false} opacity={0.3} toneMapped={false} transparent />
        </mesh>
        <lineSegments geometry={tickGeomB}>
          <lineBasicMaterial blending={THREE.AdditiveBlending} color={PALE} depthWrite={false} opacity={0.24} toneMapped={false} transparent />
        </lineSegments>
      </group>

      {/* Ring C — equatorial */}
      <group ref={ringC} rotation={[Math.PI / 2, 0.3, 0.2]}>
        <mesh>
          <torusGeometry args={[2.15, 0.015, 6, 160]} />
          <meshBasicMaterial blending={THREE.AdditiveBlending} color={MINT} depthWrite={false} opacity={0.24} toneMapped={false} transparent />
        </mesh>
      </group>
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════
// 4. FLOATING SIGIL ORBIT — 8 ancient glyph dials orbiting the core
// ══════════════════════════════════════════════════════════════════

const sigilFragmentShader = `
  uniform float uTime;
  uniform float uIndex;
  varying vec2 vUv;

  void main() {
    vec2 p = vUv - vec2(0.5);
    float r = length(p) * 2.0;
    float angle = atan(p.y, p.x);

    // Concentric ring
    float ring = smoothstep(0.03, 0.0, abs(r - 0.82));
    float ring2 = smoothstep(0.025, 0.0, abs(r - 0.55));

    // Symbol pattern based on index
    float sym = step(0.85, cos(angle * (4.0 + uIndex * 2.0) + uTime * 0.6));
    float cross = step(0.92, abs(cos(angle * 2.0))) * smoothstep(0.15, 0.18, r) * smoothstep(0.72, 0.68, r);

    float glyph = ring + ring2 + sym * 0.6 + cross * 0.5;

    vec3 color = vec3(0.137, 0.905, 0.466);
    float alpha = glyph * 0.65 * smoothstep(1.0, 0.8, r);
    gl_FragColor = vec4(color * 1.4, alpha);
  }
`;

function FloatingSigilOrbit({ activity }: { activity: AiActivity }) {
  const groupRef = useRef<THREE.Group>(null);
  const materialsRef = useRef<(THREE.ShaderMaterial | null)[]>([]);

  const sigilCount = 8;
  const sigilData = useMemo(() => {
    const rng = seededRandom(55912);
    return Array.from({ length: sigilCount }, (_, i) => ({
      angle: (i / sigilCount) * TAU + rng() * 0.3,
      radius: 1.35 + rng() * 0.25,
      y: (rng() - 0.5) * 0.6,
      speed: 0.08 + rng() * 0.06,
      selfSpin: (rng() - 0.5) * 0.8,
      scale: 0.22 + rng() * 0.1,
      tiltX: (rng() - 0.5) * 0.5,
    }));
  }, []);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);
    const energy = activityEnergy(activity);

    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const d = sigilData[i];
        const angle = d.angle + time * d.speed * speed;
        child.position.set(
          Math.cos(angle) * d.radius,
          d.y + Math.sin(time * 0.8 + i * 1.1) * 0.12,
          Math.sin(angle) * d.radius
        );
        child.rotation.y += delta * d.selfSpin * speed;
        child.rotation.x = d.tiltX;
        const sc = d.scale * (0.9 + energy * 0.12 + Math.sin(time * 2.2 + i * 0.9) * 0.04);
        child.scale.setScalar(sc);
      });
    }

    materialsRef.current.forEach((mat) => {
      if (mat) mat.uniforms.uTime.value = time;
    });
  });

  return (
    <group ref={groupRef}>
      {sigilData.map((d, i) => (
        <mesh key={i}>
          <planeGeometry args={[1, 1]} />
          <shaderMaterial
            ref={(el) => { materialsRef.current[i] = el; }}
            vertexShader={`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`}
            fragmentShader={sigilFragmentShader}
            uniforms={{
              uTime: { value: 0 },
              uIndex: { value: i },
            }}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════
// 5. OUTER RUNE MATRIX — large-radius rune band, very slow rotation
// ══════════════════════════════════════════════════════════════════

function OuterRuneMatrix({ activity }: { activity: AiActivity }) {
  const groupRef = useRef<THREE.Group>(null);

  const runeGeom = useMemo(() => {
    const segs: Array<[THREE.Vector3, THREE.Vector3]> = [];
    const r1 = 2.72;
    const r2 = 2.95;
    for (let i = 0; i < 36; i++) {
      const angle = (i / 36) * TAU;
      const cos_a = Math.cos(angle);
      const sin_a = Math.sin(angle);
      // Radial tick
      segs.push([
        new THREE.Vector3(cos_a * r1, sin_a * r1, 0),
        new THREE.Vector3(cos_a * r2, sin_a * r2, 0),
      ]);
      // Small cross-bar glyph
      if (i % 3 === 0) {
        const tangent = new THREE.Vector3(-sin_a, cos_a, 0).multiplyScalar(0.04);
        const center = new THREE.Vector3(cos_a * ((r1 + r2) / 2), sin_a * ((r1 + r2) / 2), 0);
        segs.push([center.clone().sub(tangent), center.clone().add(tangent)]);
      }
    }
    return segmentGeometry(segs);
  }, []);

  const circleGeomInner = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * TAU;
      pts.push(new THREE.Vector3(Math.cos(a) * 2.7, Math.sin(a) * 2.7, 0));
    }
    return pathGeometry([pts]);
  }, []);

  const circleGeomOuter = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * TAU;
      pts.push(new THREE.Vector3(Math.cos(a) * 2.97, Math.sin(a) * 2.97, 0));
    }
    return pathGeometry([pts]);
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      const dir = activity === "thinking" ? -1 : 1;
      groupRef.current.rotation.z -= delta * 0.025 * activitySpeed(activity) * dir;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -0.2]}>
      <lineSegments geometry={runeGeom}>
        <lineBasicMaterial blending={THREE.AdditiveBlending} color={EMERALD} depthWrite={false} opacity={0.42} toneMapped={false} transparent />
      </lineSegments>
      <lineSegments geometry={circleGeomInner}>
        <lineBasicMaterial blending={THREE.AdditiveBlending} color={PALE} depthWrite={false} opacity={0.32} toneMapped={false} transparent />
      </lineSegments>
      <lineSegments geometry={circleGeomOuter}>
        <lineBasicMaterial blending={THREE.AdditiveBlending} color={PALE} depthWrite={false} opacity={0.28} toneMapped={false} transparent />
      </lineSegments>
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════
// 6. PEDESTAL BASE DISC — horizontal ritual disc on XZ plane
//    Projecting energy beams upward to the core
// ══════════════════════════════════════════════════════════════════

const pedestalFragmentShader = `
  uniform float uTime;
  uniform float uEnergy;
  varying vec2 vUv;

  void main() {
    vec2 p = vUv - vec2(0.5);
    float r = length(p) * 2.0;
    float angle = atan(p.y, p.x);

    // Concentric circles
    float ring1 = smoothstep(0.02, 0.0, abs(r - 0.4));
    float ring2 = smoothstep(0.015, 0.0, abs(r - 0.65));
    float ring3 = smoothstep(0.012, 0.0, abs(r - 0.85));
    float ring4 = smoothstep(0.010, 0.0, abs(r - 0.95));

    // 6-fold hex pattern
    float hex = step(0.93, cos(angle * 6.0 + uTime * 0.3));
    float hexPattern = hex * smoothstep(0.3, 0.35, r) * smoothstep(0.9, 0.85, r);

    // Spinning scan line
    float scan = smoothstep(0.95, 1.0, cos(angle - uTime * 1.5)) * smoothstep(0.2, 0.25, r);

    float pattern = ring1 + ring2 + ring3 + ring4 + hexPattern * 0.6 + scan * 0.45;

    vec3 colG = vec3(0.137, 0.905, 0.466);
    vec3 colP = vec3(0.878, 1.0, 0.918);
    vec3 color = mix(colG, colP, scan * 0.5 + hexPattern * 0.3);

    float alpha = pattern * 0.5 * uEnergy * smoothstep(1.0, 0.88, r);
    gl_FragColor = vec4(color * 1.3, alpha);
  }
`;

function PedestalBaseDisc({ activity }: { activity: AiActivity }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.elapsedTime;
      matRef.current.uniforms.uEnergy.value = activityEnergy(activity);
    }
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.03 * activitySpeed(activity);
    }
  });

  return (
    <group ref={groupRef} rotation={[Math.PI / 2, 0, 0]} position={[0, -1.8, 0]}>
      <mesh scale={[4.5, 4.5, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`}
          fragmentShader={pedestalFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uEnergy: { value: 1 },
          }}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════
// 7. TIMELINE RIBBON STREAMS — energy tubes flowing outward
// ══════════════════════════════════════════════════════════════════

function TimelineRibbonStreams({ activity }: { activity: AiActivity }) {
  const streamGroup = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const particleCount = 48;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const curves = useMemo(() => {
    const list: THREE.CatmullRomCurve3[] = [];
    const rng = seededRandom(452);
    for (let b = 0; b < 6; b++) {
      const side = b % 2 === 0 ? 1 : -1;
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 5; i++) {
        const t = i / 5;
        points.push(new THREE.Vector3(
          side * (0.35 + t * 2.0 + rng() * 0.2),
          (b - 2.5) * 0.42 + Math.sin(t * Math.PI * 1.5 + b) * 0.35,
          -0.25 - t * 0.7 + Math.cos(t * Math.PI) * 0.25
        ));
      }
      list.push(new THREE.CatmullRomCurve3(points));
    }
    return list;
  }, []);

  const tubeGeometries = useMemo(() =>
    curves.map((curve) => new THREE.TubeGeometry(curve, 36, 0.016, 6, false)),
    [curves]
  );

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);

    if (streamGroup.current) {
      streamGroup.current.position.z = Math.sin(time * 0.35) * 0.04;
    }

    if (particlesRef.current) {
      curves.forEach((curve, cIdx) => {
        for (let p = 0; p < 8; p++) {
          const index = cIdx * 8 + p;
          const progress = (time * 0.22 * speed + p / 8 + cIdx * 0.15) % 1.0;
          const pt = curve.getPoint(progress);
          dummy.position.copy(pt);
          dummy.scale.setScalar(0.035 + Math.sin(progress * Math.PI) * 0.018);
          dummy.updateMatrix();
          particlesRef.current?.setMatrixAt(index, dummy.matrix);
        }
      });
      particlesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={streamGroup}>
      {tubeGeometries.map((geom, idx) => (
        <mesh key={idx} geometry={geom}>
          <meshBasicMaterial
            color={MINT}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            opacity={0.38}
            transparent
            toneMapped={false}
          />
        </mesh>
      ))}
      <instancedMesh ref={particlesRef} args={[undefined, undefined, particleCount]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color={PALE} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════
// 8. TIME DISTORTION SHOCKWAVES — expanding/contracting pulses
// ══════════════════════════════════════════════════════════════════

const shockwaveFragmentShader = `
  uniform float uTime;
  uniform float uEnergy;
  uniform float uReversing;
  varying vec2 vUv;

  void main() {
    vec2 p = vUv - vec2(0.5);
    float dist = length(p) * 2.0;

    // Two offset wave cycles
    float cycle1 = fract(uTime * 0.45);
    float cycle2 = fract(uTime * 0.45 + 0.5);
    float lw1 = uReversing > 0.5 ? (1.0 - cycle1) : cycle1;
    float lw2 = uReversing > 0.5 ? (1.0 - cycle2) : cycle2;

    float width = 0.065;
    float ring1 = smoothstep(lw1 - width, lw1, dist) - smoothstep(lw1, lw1 + width, dist);
    float ring2 = smoothstep(lw2 - width, lw2, dist) - smoothstep(lw2, lw2 + width, dist);
    float fade = (1.0 - dist);

    vec3 mint = vec3(0.4, 1.0, 0.62);
    vec3 pale = vec3(0.878, 1.0, 0.918);
    vec3 col = mix(mint, pale, max(ring1, ring2));

    float alpha = (ring1 + ring2 * 0.7) * fade * 0.55 * uEnergy;
    gl_FragColor = vec4(col * 1.8, alpha);
  }
`;

function TimeDistortionShockwaves({ activity }: { activity: AiActivity }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const isReversing = activity === "thinking";

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.elapsedTime;
      matRef.current.uniforms.uEnergy.value = activityEnergy(activity);
      matRef.current.uniforms.uReversing.value = isReversing ? 1.0 : 0.0;
    }
  });

  return (
    <mesh position={[0, 0, -0.06]} scale={[4.8, 4.8, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`}
        fragmentShader={shockwaveFragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uEnergy: { value: 1 },
          uReversing: { value: 0 },
        }}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        transparent
      />
    </mesh>
  );
}

// ══════════════════════════════════════════════════════════════════
// 9. MYSTIC EMBER SPARKS — 380+ floating magic dust particles
// ══════════════════════════════════════════════════════════════════

function MysticEmberSparks({ activity }: { activity: AiActivity }) {
  const count = 380;
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => new Float32Array(count * 3), []);

  const params = useMemo(() => {
    const rng = seededRandom(44221);
    return Array.from({ length: count }, () => ({
      radius: 0.6 + rng() * 3.2,
      angle: rng() * TAU,
      y: (rng() - 0.5) * 3.8,
      speed: (0.06 + rng() * 0.38) * (rng() > 0.5 ? 1 : -1),
      wobble: rng() * TAU,
      helical: rng() > 0.7,
    }));
  }, []);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);
    const energy = activityEnergy(activity);
    for (let i = 0; i < count; i++) {
      const param = params[i];
      const angle = param.angle + time * param.speed * speed;
      const radius = param.radius + Math.sin(time * 0.6 + param.wobble) * 0.06 * energy;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = param.helical ? Math.sin(angle * 2.5) * 0.5 : param.y + Math.sin(time * 0.4 + param.wobble) * 0.08;
      positions[i * 3 + 2] = Math.sin(angle) * radius * 0.7;
    }
    if (points.current) {
      points.current.rotation.y = time * 0.012;
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
        color={MINT}
        depthWrite={false}
        opacity={0.44}
        size={0.025}
        sizeAttenuation
        toneMapped={false}
        transparent
      />
    </points>
  );
}

// ══════════════════════════════════════════════════════════════════
// 10. BRONZE MECHANICAL GEARS — extruded chronal gear layers
// ══════════════════════════════════════════════════════════════════

function createGearGeometry(radius: number, teeth: number, depth: number) {
  const shape = new THREE.Shape();
  const toothDepth = radius * 0.14;
  const toothWidth = TAU / teeth;

  for (let i = 0; i < teeth; i++) {
    const angle = i * toothWidth;
    const a1 = angle;
    const a2 = angle + toothWidth * 0.28;
    const a3 = angle + toothWidth * 0.52;
    const a4 = angle + toothWidth * 0.78;

    const rInner = radius;
    const rOuter = radius + toothDepth;

    if (i === 0) {
      shape.moveTo(Math.cos(a1) * rInner, Math.sin(a1) * rInner);
    } else {
      shape.lineTo(Math.cos(a1) * rInner, Math.sin(a1) * rInner);
    }
    shape.lineTo(Math.cos(a2) * rOuter, Math.sin(a2) * rOuter);
    shape.lineTo(Math.cos(a3) * rOuter, Math.sin(a3) * rOuter);
    shape.lineTo(Math.cos(a4) * rInner, Math.sin(a4) * rInner);
  }

  const holePath = new THREE.Path();
  const holeRadius = radius * 0.65;
  for (let i = 0; i <= 32; i++) {
    const a = (i / 32) * TAU;
    if (i === 0) holePath.moveTo(Math.cos(a) * holeRadius, Math.sin(a) * holeRadius);
    else holePath.lineTo(Math.cos(a) * holeRadius, Math.sin(a) * holeRadius);
  }
  shape.holes.push(holePath);

  return new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.015,
    bevelThickness: 0.015,
  });
}

function ExtrudedChronalGears({ activity }: { activity: AiActivity }) {
  const gear1Ref = useRef<THREE.Mesh>(null);
  const gear2Ref = useRef<THREE.Mesh>(null);
  const gear3Ref = useRef<THREE.Mesh>(null);

  const gear1Geom = useMemo(() => createGearGeometry(0.85, 10, 0.06), []);
  const gear2Geom = useMemo(() => createGearGeometry(1.28, 16, 0.06), []);
  const gear3Geom = useMemo(() => createGearGeometry(1.72, 22, 0.06), []);

  useFrame((_, delta) => {
    const speed = activitySpeed(activity);
    const dir = activity === "thinking" ? -1 : 1;
    if (gear1Ref.current) gear1Ref.current.rotation.z += delta * 0.3 * speed * dir;
    if (gear2Ref.current) gear2Ref.current.rotation.z -= delta * 0.19 * speed * dir;
    if (gear3Ref.current) gear3Ref.current.rotation.z += delta * 0.12 * speed * dir;
  });

  return (
    <group position={[0, 0, -0.32]}>
      <mesh ref={gear1Ref} geometry={gear1Geom}>
        <meshStandardMaterial color={BRONZE} metalness={0.82} roughness={0.28} emissive={MINT} emissiveIntensity={0.22} />
      </mesh>
      <mesh ref={gear2Ref} geometry={gear2Geom} position={[0, 0, -0.05]}>
        <meshStandardMaterial color={BRONZE} metalness={0.85} roughness={0.25} emissive={EMERALD} emissiveIntensity={0.18} />
      </mesh>
      <mesh ref={gear3Ref} geometry={gear3Geom} position={[0, 0, -0.1]}>
        <meshStandardMaterial color={BRONZE} metalness={0.88} roughness={0.22} emissive={MINT} emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════
// 11. ANCIENT GEOMETRY — intersecting sacred polygons
// ══════════════════════════════════════════════════════════════════

function AncientGeometryLayer({ activity }: { activity: AiActivity }) {
  const groupRef = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    const paths: THREE.Vector3[][] = [];

    // Triangle up
    const tri = (r: number, phase: number, z: number, sides: number) => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= sides; i++) {
        const a = phase + (i / sides) * TAU;
        pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, z));
      }
      return pts;
    };

    paths.push(tri(3.2, Math.PI / 2, -0.08, 3));
    paths.push(tri(3.2, -Math.PI / 2, -0.08, 3));
    paths.push(tri(3.05, Math.PI / 4, -0.07, 4));
    paths.push(tri(3.3, Math.PI / 8, -0.06, 8));

    // Circle
    const circle: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * TAU;
      circle.push(new THREE.Vector3(Math.cos(a) * 3.15, Math.sin(a) * 3.15, -0.09));
    }
    paths.push(circle);

    return pathGeometry(paths);
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z -= delta * 0.02 * activitySpeed(activity);
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial blending={THREE.AdditiveBlending} color={PALE} depthWrite={false} opacity={0.2} toneMapped={false} transparent />
      </lineSegments>
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════
// MAIN TIME SCENE — assembly
// ══════════════════════════════════════════════════════════════════

export interface TimeSceneProps {
  activity?: AiActivity;
}

export function TimeScene({ activity = "idle" }: TimeSceneProps) {
  return (
    <group name="green-mystic-core-time-stone-scene" scale={1.15}>
      {/* Ambient & directional lighting */}
      <ambientLight intensity={0.4} color={DEEP_GREEN} />
      <directionalLight position={[3, 4, 4]} intensity={1.5} color={MINT} />
      <pointLight position={[-2, 2, 3]} color={EMERALD} intensity={1.8} distance={10} />

      {/* Layer 8: Time distortion shockwaves (furthest back) */}
      <TimeDistortionShockwaves activity={activity} />

      {/* Layer 7: Ancient sacred geometry */}
      <AncientGeometryLayer activity={activity} />

      {/* Layer 6: Outer Rune Matrix */}
      <OuterRuneMatrix activity={activity} />

      {/* Layer 5: Bronze chronal gears */}
      <ExtrudedChronalGears activity={activity} />

      {/* Layer 4: Main Mystic Mandala disc */}
      <MainMysticMandala activity={activity} />

      {/* Layer 3: Auxiliary gimbal rings */}
      <AuxiliaryGimbalRings activity={activity} />

      {/* Layer 2: Timeline ribbon streams */}
      <TimelineRibbonStreams activity={activity} />

      {/* Layer 1: Floating sigil orbit */}
      <FloatingSigilOrbit activity={activity} />

      {/* Layer 0: Pedestal base disc (horizontal) */}
      <PedestalBaseDisc activity={activity} />

      {/* Core: Raw Time Stone Crystal */}
      <RawTimeStoneCrystal activity={activity} />

      {/* Atmospheric ember sparks */}
      <MysticEmberSparks activity={activity} />
    </group>
  );
}
