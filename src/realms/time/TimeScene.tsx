import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { AiActivity } from "../../App";
import { activityEnergy, activityPulse, activitySpeed, seededRandom, segmentGeometry, pathGeometry } from "../shared/coreMotion";

// ══════════════════════════════════════════════════════════════════
// COLOR PALETTE — GREEN MYSTIC CORE (DOCTOR STRANGE / TIME STONE)
// Exact match to reference infographic:
// #1BFF7A, #00E676, #1CFF82, #8EFF66, #A9FFA6, #FFDB4D, #0A1A0F
// ══════════════════════════════════════════════════════════════════
const COLOR_1BFF7A = "#1bff7a"; // Pure Emerald Green
const COLOR_00E676 = "#00e676"; // Neon Green
const COLOR_1CFF82 = "#1cff82"; // Bright Mint
const COLOR_8EFF66 = "#8eff66"; // Lime Green
const COLOR_A9FFA6 = "#a9ffa6"; // Pale Core Light
const COLOR_FFDB4D = "#ffdb4d"; // Mystic Ancient Gold
const COLOR_BRONZE = "#c69214"; // Ancient Bronze Gold
const COLOR_0A1A0F = "#0a1a0f"; // Deep Void Green
const COLOR_WHITE  = "#ffffff"; // White-hot Nucleus

const TAU = Math.PI * 2;

// ── Math Helpers for 3D Vector Geometry ──
function polar(radius: number, angle: number, z = 0) {
  return new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, z);
}

function circlePoints(radius: number, segments = 96, z = 0) {
  return Array.from({ length: segments + 1 }, (_, i) => polar(radius, (i / segments) * TAU, z));
}

function closePoints(points: THREE.Vector3[]) {
  return [...points, points[0].clone()];
}

function polygonPoints(sides: number, radius: number, phase = 0, z = 0) {
  return closePoints(Array.from({ length: sides }, (_, i) => polar(radius, phase + (i / sides) * TAU, z)));
}

// ══════════════════════════════════════════════════════════════════
// 1. CUSTOM TIME STONE GEM GEOMETRY
//    8-sided elongated raw emerald crystal with natural beveled facets
// ══════════════════════════════════════════════════════════════════
function createFacetedCrystalGeometry(): THREE.BufferGeometry {
  const geom = new THREE.BufferGeometry();
  const height = 1.22;
  const midRadius = 0.34;
  const capRadius = 0.16;
  const capHeight = 0.48;
  const segments = 8;

  const vertices: number[] = [];
  const uvs: number[] = [];

  const topApex = new THREE.Vector3(0, height, 0);
  const bottomApex = new THREE.Vector3(0, -height, 0);

  const topRing: THREE.Vector3[] = [];
  const midRing: THREE.Vector3[] = [];
  const botRing: THREE.Vector3[] = [];

  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * TAU;
    const rVar = 1 + (i % 2 === 0 ? 0.09 : -0.06);
    topRing.push(new THREE.Vector3(Math.cos(a) * capRadius * rVar, capHeight, Math.sin(a) * capRadius * rVar));
    midRing.push(new THREE.Vector3(Math.cos(a) * midRadius * rVar, 0, Math.sin(a) * midRadius * rVar));
    botRing.push(new THREE.Vector3(Math.cos(a) * capRadius * rVar, -capHeight, Math.sin(a) * capRadius * rVar));
  }

  function addTri(p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3) {
    vertices.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, p3.x, p3.y, p3.z);
    uvs.push(0.5, 1, 0, 0, 1, 0);
  }

  function addQuad(p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3, p4: THREE.Vector3) {
    addTri(p1, p2, p3);
    addTri(p1, p3, p4);
  }

  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    addTri(topApex, topRing[next], topRing[i]);
    addQuad(topRing[i], topRing[next], midRing[next], midRing[i]);
    addQuad(midRing[i], midRing[next], botRing[next], botRing[i]);
    addTri(bottomApex, botRing[i], botRing[next]);
  }

  geom.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geom.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geom.computeVertexNormals();
  return geom;
}

// ══════════════════════════════════════════════════════════════════
// 2. SHADERS: TIME STONE VOLUMETRIC PLASMA & ENERGY FRACTURE VEINS
// ══════════════════════════════════════════════════════════════════
const crystalShader = {
  vertexShader: `
    uniform float uTime;
    uniform float uEnergy;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewPosition;
    varying vec3 vModelPosition;

    void main() {
      vModelPosition = position;
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uEnergy;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewPosition;
    varying vec3 vModelPosition;

    float hash(vec3 p) {
      return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
    }

    float noise(vec3 p) {
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
      vec3 viewDir = normalize(vViewPosition);
      vec3 norm = normalize(vNormal);

      // Fresnel edge glow
      float fresnel = pow(1.0 - max(dot(viewDir, norm), 0.0), 2.2);

      // Internal plasma currents
      float n1 = noise(vModelPosition * 5.0 + vec3(0.0, uTime * 0.8, 0.0));
      float n2 = noise(vModelPosition * 11.0 - vec3(uTime * 0.6, 0.0, uTime * 0.4));
      float plasma = n1 * 0.65 + n2 * 0.35;

      // Temporal lightning fracture veins along facets
      float veinA = pow(abs(sin(vModelPosition.y * 15.0 + vModelPosition.x * 12.0 + uTime * 2.0)), 16.0);
      float veinB = pow(abs(sin(vModelPosition.z * 13.0 - vModelPosition.y * 10.0 - uTime * 1.6)), 14.0);
      float veins = (veinA + veinB) * (0.85 + uEnergy * 0.65);

      // Color grading
      vec3 colDeep   = vec3(0.015, 0.22, 0.08); // Deep emerald
      vec3 colNeon   = vec3(0.0, 0.95, 0.42);   // #00e676
      vec3 colMint   = vec3(0.55, 1.0, 0.65);   // #1cff82
      vec3 colGold   = vec3(1.0, 0.88, 0.35);   // #ffdb4d
      vec3 colWhite  = vec3(1.0, 1.0, 1.0);

      vec3 color = mix(colDeep, colNeon, plasma * 0.9);
      color = mix(color, colMint, fresnel * 0.85);
      color += colGold * veins * 1.6;
      color += colWhite * pow(plasma, 4.0) * 1.3;

      float alpha = clamp(0.8 + fresnel * 0.2 + veins * 0.35, 0.0, 1.0);
      gl_FragColor = vec4(color * (1.3 + uEnergy * 0.6), alpha);
    }
  `
};

// ══════════════════════════════════════════════════════════════════
// 3. DOCTOR STRANGE ELDRITCH MAGIC MANDALA SHADER DISC
// ══════════════════════════════════════════════════════════════════
const eldritchMandalaShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uEnergy;
    uniform float uDirection;
    varying vec2 vUv;

    void main() {
      vec2 p = vUv - vec2(0.5);
      float r = length(p) * 2.0;
      float angle = atan(p.y, p.x);

      // Concentric rings
      float r1 = smoothstep(0.02, 0.0, abs(r - 0.26));
      float r2 = smoothstep(0.015, 0.0, abs(r - 0.46));
      float r3 = smoothstep(0.012, 0.0, abs(r - 0.68));
      float r4 = smoothstep(0.014, 0.0, abs(r - 0.84));
      float r5 = smoothstep(0.010, 0.0, abs(r - 0.95));

      // 8-Fold sacred rosette
      float p8 = abs(cos(angle * 8.0 + uTime * 0.7 * uDirection));
      float star8 = smoothstep(0.68, 0.98, p8 * (1.0 - abs(r - 0.36) * 4.5));

      // 16-Fold intricate chronal petals
      float p16 = abs(sin(angle * 16.0 - uTime * 1.1 * uDirection));
      float star16 = smoothstep(0.72, 0.99, p16 * (1.0 - abs(r - 0.57) * 5.5));

      // 24-Fold outer gear dial notches
      float p24 = abs(cos(angle * 24.0 + uTime * 1.4 * uDirection));
      float gear24 = smoothstep(0.76, 0.99, p24 * (1.0 - abs(r - 0.76) * 6.5));

      // 36 Outer Runes notches
      float runes = step(0.86, sin(angle * 36.0 - uTime * 0.5 * uDirection)) * r4;

      // 12 Cardinal radial laser spokes
      float spokes = step(0.982, cos(angle * 12.0)) * smoothstep(0.24, 0.28, r) * smoothstep(0.96, 0.92, r);

      // Interlocking hexagram triangle chords
      float tri1 = abs(cos(angle * 3.0 + uTime * 0.3 * uDirection));
      float triPattern = smoothstep(0.85, 0.98, tri1 * (1.0 - abs(r - 0.68) * 3.0));

      float total = r1 + r2 + r3 + r4 + r5
                  + star8 * 0.9 + star16 * 1.0 + gear24 * 0.75
                  + runes * 0.85 + spokes * 0.8 + triPattern * 0.6;

      vec3 colNeon = vec3(0.0, 0.95, 0.46);
      vec3 colLime = vec3(0.55, 1.0, 0.4);
      vec3 colGold = vec3(1.0, 0.86, 0.3);

      vec3 color = mix(colNeon, colLime, r);
      color = mix(color, colGold, runes * 0.6 + gear24 * 0.4);

      float alpha = total * 0.85 * uEnergy * smoothstep(1.0, 0.86, r);
      gl_FragColor = vec4(color * 1.9, alpha);
    }
  `
};

// ══════════════════════════════════════════════════════════════════
// 4. FLOATING SATELLITE SIGIL SHADER (8 ORBITING MAGIC NODES)
// ══════════════════════════════════════════════════════════════════
const sigilShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uIndex;
    varying vec2 vUv;

    void main() {
      vec2 p = vUv - vec2(0.5);
      float r = length(p) * 2.0;
      float angle = atan(p.y, p.x);

      float ring1 = smoothstep(0.04, 0.0, abs(r - 0.85));
      float ring2 = smoothstep(0.03, 0.0, abs(r - 0.58));
      float ring3 = smoothstep(0.025, 0.0, abs(r - 0.28));

      // Internal sacred star glyph
      float star = step(0.86, cos(angle * (4.0 + uIndex * 2.0) + uTime * 0.8));
      float cross = step(0.92, abs(cos(angle * 2.0))) * smoothstep(0.12, 0.16, r) * smoothstep(0.86, 0.82, r);

      float total = ring1 + ring2 + ring3 + star * 0.8 + cross * 0.7;

      vec3 colG = vec3(0.0, 0.95, 0.46);
      vec3 colGold = vec3(1.0, 0.86, 0.3);
      vec3 col = mix(colG, colGold, ring2 * 0.5);

      float alpha = total * 0.78 * smoothstep(1.0, 0.84, r);
      gl_FragColor = vec4(col * 1.7, alpha);
    }
  `
};

// ══════════════════════════════════════════════════════════════════
// 5. HORIZONTAL PEDESTAL BASE RITUAL DISC (FLOOR MANDALA)
// ══════════════════════════════════════════════════════════════════
const pedestalShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uEnergy;
    varying vec2 vUv;

    void main() {
      vec2 p = vUv - vec2(0.5);
      float r = length(p) * 2.0;
      float angle = atan(p.y, p.x);

      float r1 = smoothstep(0.02, 0.0, abs(r - 0.35));
      float r2 = smoothstep(0.015, 0.0, abs(r - 0.62));
      float r3 = smoothstep(0.012, 0.0, abs(r - 0.82));
      float r4 = smoothstep(0.010, 0.0, abs(r - 0.96));

      // Hexagram on the floor
      float hex = step(0.92, cos(angle * 6.0 + uTime * 0.25)) * smoothstep(0.3, 0.35, r) * smoothstep(0.94, 0.88, r);

      // Radar scan line sweeping
      float sweep = smoothstep(0.94, 1.0, cos(angle - uTime * 1.2)) * smoothstep(0.2, 0.25, r);

      // Stepped concentric ripple wave
      float wave = smoothstep(0.03, 0.0, abs(fract(r * 4.0 - uTime * 0.4) - 0.5));

      float total = r1 + r2 + r3 + r4 + hex * 0.7 + sweep * 0.5 + wave * 0.25;

      vec3 colG = vec3(0.0, 0.95, 0.46);
      vec3 colMint = vec3(0.6, 1.0, 0.7);
      vec3 col = mix(colG, colMint, sweep * 0.6);

      float alpha = total * 0.68 * uEnergy * smoothstep(1.0, 0.85, r);
      gl_FragColor = vec4(col * 1.5, alpha);
    }
  `
};

// ══════════════════════════════════════════════════════════════════
// 6. TIME DISTORTION SHOCKWAVE DISC SHADER
// ══════════════════════════════════════════════════════════════════
const shockwaveShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uEnergy;
    uniform float uReversing;
    varying vec2 vUv;

    void main() {
      vec2 p = vUv - vec2(0.5);
      float dist = length(p) * 2.0;

      float cycle1 = fract(uTime * 0.5);
      float cycle2 = fract(uTime * 0.5 + 0.5);
      float lw1 = uReversing > 0.5 ? (1.0 - cycle1) : cycle1;
      float lw2 = uReversing > 0.5 ? (1.0 - cycle2) : cycle2;

      float width = 0.055;
      float ring1 = smoothstep(lw1 - width, lw1, dist) - smoothstep(lw1, lw1 + width, dist);
      float ring2 = smoothstep(lw2 - width, lw2, dist) - smoothstep(lw2, lw2 + width, dist);
      float fade = 1.0 - dist;

      vec3 colMint = vec3(0.3, 1.0, 0.55);
      vec3 colGold = vec3(1.0, 0.9, 0.4);
      vec3 col = mix(colMint, colGold, ring1);

      float alpha = (ring1 + ring2 * 0.6) * fade * 0.7 * uEnergy;
      gl_FragColor = vec4(col * 2.2, alpha);
    }
  `
};

// ══════════════════════════════════════════════════════════════════
// COMPONENT 1: AGAMOTTO GOLDEN PRONG CLASP & CHASSIS
// (4 prominent golden diamond brackets holding the Time Stone gem)
// ══════════════════════════════════════════════════════════════════
function AgamottoGoldenChassis({ activity }: { activity: AiActivity }) {
  const chassisRef = useRef<THREE.Group>(null);

  // 4 Golden Corner Diamond Brackets (at 0°, 90°, 180°, 270°)
  const bracketGeom = useMemo(() => {
    const geom = new THREE.OctahedronGeometry(0.12, 0);
    // Flatten Z and elongate along X
    geom.scale(1.8, 1.0, 0.6);
    return geom;
  }, []);

  // Inner Eye Ring
  const ringGeom = useMemo(() => new THREE.TorusGeometry(0.56, 0.024, 8, 48), []);

  useFrame(({ clock }) => {
    if (chassisRef.current) {
      chassisRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.6) * 0.05;
    }
  });

  return (
    <group ref={chassisRef}>
      {/* 4 Golden Corner Prongs */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => {
        const dist = 0.56;
        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist;
        return (
          <mesh
            key={i}
            position={[x, y, 0]}
            rotation={[0, 0, angle + Math.PI / 2]}
            geometry={bracketGeom}
          >
            <meshStandardMaterial
              color={COLOR_FFDB4D}
              emissive={COLOR_BRONZE}
              emissiveIntensity={0.6}
              metalness={0.92}
              roughness={0.18}
            />
          </mesh>
        );
      })}

      {/* Golden Inner Beveled Ring */}
      <mesh geometry={ringGeom}>
        <meshStandardMaterial
          color={COLOR_FFDB4D}
          emissive={COLOR_BRONZE}
          emissiveIntensity={0.4}
          metalness={0.88}
          roughness={0.22}
        />
      </mesh>
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════
// COMPONENT 2: LAYER 1 — LÕI TIME STONE & SATELLITE SHARDS
// (Xoay chậm trục dọc Y theo nhịp thở AI)
// ══════════════════════════════════════════════════════════════════
function FacetedTimeStoneGem({ activity }: { activity: AiActivity }) {
  const gemGroupRef = useRef<THREE.Group>(null);
  const coreMeshRef = useRef<THREE.Mesh>(null);
  const wireMeshRef = useRef<THREE.LineSegments>(null);
  const shaderMatRef = useRef<THREE.ShaderMaterial>(null);
  const whiteNucleusRef = useRef<THREE.Mesh>(null);
  const shardsGroupRef = useRef<THREE.Group>(null);

  const crystalGeom = useMemo(() => createFacetedCrystalGeometry(), []);
  const edgeGeom = useMemo(() => new THREE.EdgesGeometry(crystalGeom), [crystalGeom]);

  const shardData = useMemo(() => {
    const rng = seededRandom(99312);
    return Array.from({ length: 6 }, (_, i) => ({
      angle: (i / 6) * TAU,
      radius: 0.62 + (i % 2) * 0.15,
      y: (rng() - 0.5) * 0.55,
      scale: 0.058 + rng() * 0.035,
      speed: 0.22 + (i % 3) * 0.08,
      tilt: [rng() * Math.PI, rng() * Math.PI, rng() * Math.PI] as [number, number, number],
    }));
  }, []);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const speed = activitySpeed(activity);
    const energy = activityEnergy(activity);
    const pulse = activityPulse(activity, t, 0.5);

    // Layer 1: Xoay chậm trục dọc (Y)
    if (gemGroupRef.current) {
      gemGroupRef.current.rotation.y += delta * 0.25 * speed;
      gemGroupRef.current.rotation.x = Math.sin(t * 0.3) * 0.06;
      gemGroupRef.current.scale.setScalar(pulse * (0.96 + energy * 0.08));
    }

    if (shaderMatRef.current) {
      shaderMatRef.current.uniforms.uTime.value = t;
      shaderMatRef.current.uniforms.uEnergy.value = energy;
    }

    if (whiteNucleusRef.current) {
      const nScale = 0.13 + Math.sin(t * 5.0) * 0.02 * energy;
      whiteNucleusRef.current.scale.setScalar(nScale);
    }

    if (shardsGroupRef.current) {
      shardsGroupRef.current.children.forEach((shard, i) => {
        const d = shardData[i];
        const angle = d.angle + t * d.speed * speed;
        shard.position.set(
          Math.cos(angle) * d.radius,
          d.y + Math.sin(t * 1.4 + i * 1.2) * 0.08,
          Math.sin(angle) * d.radius
        );
        shard.rotation.y += delta * 1.6;
        shard.rotation.x += delta * 0.8;
      });
    }
  });

  return (
    <group ref={gemGroupRef}>
      {/* 1. White-hot nucleus point */}
      <mesh ref={whiteNucleusRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={COLOR_WHITE} toneMapped={false} />
      </mesh>

      {/* 2. Intense Volumetric Faceted Gem Crystal */}
      <mesh ref={coreMeshRef} geometry={crystalGeom}>
        <shaderMaterial
          ref={shaderMatRef}
          vertexShader={crystalShader.vertexShader}
          fragmentShader={crystalShader.fragmentShader}
          uniforms={{ uTime: { value: 0 }, uEnergy: { value: 1 } }}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3. Glowing Emerald Crystal Facet Wireframe Edges */}
      <lineSegments ref={wireMeshRef} geometry={edgeGeom}>
        <lineBasicMaterial
          blending={THREE.AdditiveBlending}
          color={COLOR_8EFF66}
          depthWrite={false}
          opacity={0.92}
          toneMapped={false}
          transparent
        />
      </lineSegments>

      {/* 4. Outer Refraction Glass Shell */}
      <mesh geometry={crystalGeom} scale={1.035}>
        <meshPhysicalMaterial
          clearcoat={1}
          clearcoatRoughness={0.02}
          color={COLOR_1BFF7A}
          depthWrite={false}
          envMapIntensity={2.4}
          ior={1.68}
          metalness={0.1}
          opacity={0.32}
          roughness={0.04}
          transmission={0.85}
          transparent
        />
      </mesh>

      {/* 5. Golden Agamotto Clasp Frame */}
      <AgamottoGoldenChassis activity={activity} />

      {/* 6. Orbiting Satellite Gem Shards */}
      <group ref={shardsGroupRef}>
        {shardData.map((d, i) => (
          <mesh key={i} rotation={d.tilt} scale={d.scale} geometry={crystalGeom}>
            <meshStandardMaterial
              color={i % 2 === 0 ? COLOR_00E676 : COLOR_FFDB4D}
              emissive={COLOR_1BFF7A}
              emissiveIntensity={2.8}
              roughness={0.1}
              metalness={0.2}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      {/* Core Omnidirectional Light */}
      <pointLight color={COLOR_1BFF7A} distance={9.5} intensity={7.0} decay={2} />
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════
// COMPONENT 3: LAYER 2 — VÒNG PHÉP CHÍNH (MAIN ELDRITCH DISC)
// (Nghiêng 3D, Xoay trung bình trục ngang X/Z theo chiều kim đồng hồ)
// ══════════════════════════════════════════════════════════════════
function create3DSpellRuneGeometry() {
  const segs: Array<[THREE.Vector3, THREE.Vector3]> = [];
  const r1 = 2.45;
  const r2 = 2.78;

  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * TAU;
    const center = polar((r1 + r2) / 2, a, 0);
    const tangent = new THREE.Vector3(-Math.sin(a), Math.cos(a), 0);
    const radial = new THREE.Vector3(Math.cos(a), Math.sin(a), 0);

    const w = 0.048;
    const h = 0.055;

    segs.push([polar(r1, a, 0), polar(r1 + 0.03, a, 0)]);
    segs.push([polar(r2 - 0.03, a, 0), polar(r2, a, 0)]);

    const glyphType = i % 5;
    if (glyphType === 0) {
      segs.push([center.clone().add(radial.clone().multiplyScalar(h)), center.clone().add(tangent.clone().multiplyScalar(w))]);
      segs.push([center.clone().add(tangent.clone().multiplyScalar(w)), center.clone().add(radial.clone().multiplyScalar(-h))]);
      segs.push([center.clone().add(radial.clone().multiplyScalar(h)), center.clone().add(radial.clone().multiplyScalar(-h))]);
    } else if (glyphType === 1) {
      segs.push([center.clone().add(tangent.clone().multiplyScalar(-w)).add(radial.clone().multiplyScalar(h)), center.clone().add(tangent.clone().multiplyScalar(w)).add(radial.clone().multiplyScalar(-h))]);
      segs.push([center.clone().add(tangent.clone().multiplyScalar(-w)).add(radial.clone().multiplyScalar(-h)), center.clone().add(tangent.clone().multiplyScalar(w)).add(radial.clone().multiplyScalar(h))]);
    } else if (glyphType === 2) {
      segs.push([center.clone().add(radial.clone().multiplyScalar(-h)), center.clone().add(radial.clone().multiplyScalar(h))]);
      segs.push([center.clone().add(tangent.clone().multiplyScalar(-w)).add(radial.clone().multiplyScalar(h)), center.clone()]);
      segs.push([center.clone().add(tangent.clone().multiplyScalar(w)).add(radial.clone().multiplyScalar(h)), center.clone()]);
    } else {
      segs.push([center.clone().add(radial.clone().multiplyScalar(h)), center.clone().add(tangent.clone().multiplyScalar(w))]);
      segs.push([center.clone().add(tangent.clone().multiplyScalar(w)), center.clone().add(radial.clone().multiplyScalar(-h))]);
      segs.push([center.clone().add(radial.clone().multiplyScalar(-h)), center.clone().add(tangent.clone().multiplyScalar(-w))]);
      segs.push([center.clone().add(tangent.clone().multiplyScalar(-w)), center.clone().add(radial.clone().multiplyScalar(h))]);
    }
  }

  return segmentGeometry(segs);
}

function createSacredGeometryStarPaths() {
  const paths: THREE.Vector3[][] = [];
  for (let t = 0; t < 4; t++) {
    const phase = (t / 4) * (TAU / 3);
    paths.push(polygonPoints(3, 2.35, phase, 0));
  }
  paths.push(circlePoints(1.22, 64));
  paths.push(circlePoints(1.85, 96));
  paths.push(circlePoints(2.42, 128));
  paths.push(circlePoints(2.82, 128));
  return pathGeometry(paths);
}

function MainEldritchSpellDisc({ activity }: { activity: AiActivity }) {
  const mainDiscRef = useRef<THREE.Group>(null);
  const runeLineRef = useRef<THREE.LineSegments>(null);
  const starLineRef = useRef<THREE.LineSegments>(null);
  const shaderMatRef = useRef<THREE.ShaderMaterial>(null);

  const runeGeom = useMemo(() => create3DSpellRuneGeometry(), []);
  const starGeom = useMemo(() => createSacredGeometryStarPaths(), []);

  const isThinking = activity === "thinking";

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const speed = activitySpeed(activity);
    const energy = activityEnergy(activity);
    const dir = isThinking ? -1 : 1;

    // Layer 2: Xoay trung bình quanh mặt phẳng nghiêng
    if (mainDiscRef.current) {
      mainDiscRef.current.rotation.z += delta * 0.075 * speed * dir;
    }

    if (shaderMatRef.current) {
      shaderMatRef.current.uniforms.uTime.value = t;
      shaderMatRef.current.uniforms.uEnergy.value = energy;
      shaderMatRef.current.uniforms.uDirection.value = dir;
    }

    if (runeLineRef.current) {
      runeLineRef.current.rotation.z -= delta * 0.025 * speed * dir;
    }
  });

  return (
    <group ref={mainDiscRef} rotation={[0.46, -0.25, 0]} scale={1.06}>
      {/* High-Res Eldritch Mandala Shader */}
      <mesh position={[0, 0, -0.02]} scale={[6.4, 6.4, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          ref={shaderMatRef}
          vertexShader={eldritchMandalaShader.vertexShader}
          fragmentShader={eldritchMandalaShader.fragmentShader}
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

      {/* 3D Glowing Runes Ring */}
      <lineSegments ref={runeLineRef} geometry={runeGeom}>
        <lineBasicMaterial
          blending={THREE.AdditiveBlending}
          color={COLOR_1BFF7A}
          depthWrite={false}
          opacity={0.92}
          toneMapped={false}
          transparent
        />
      </lineSegments>

      {/* Sacred 12-Point Star Mandala */}
      <lineSegments ref={starLineRef} geometry={starGeom}>
        <lineBasicMaterial
          blending={THREE.AdditiveBlending}
          color={COLOR_FFDB4D}
          depthWrite={false}
          opacity={0.78}
          toneMapped={false}
          transparent
        />
      </lineSegments>

      {/* Beveled Torus Golden Borders */}
      <mesh position={[0, 0, 0.01]}>
        <torusGeometry args={[2.42, 0.018, 6, 160]} />
        <meshBasicMaterial blending={THREE.AdditiveBlending} color={COLOR_8EFF66} depthWrite={false} opacity={0.7} toneMapped={false} transparent />
      </mesh>
      <mesh position={[0, 0, -0.01]}>
        <torusGeometry args={[2.82, 0.02, 6, 160]} />
        <meshBasicMaterial blending={THREE.AdditiveBlending} color={COLOR_1BFF7A} depthWrite={false} opacity={0.6} toneMapped={false} transparent />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <torusGeometry args={[1.22, 0.014, 6, 96]} />
        <meshBasicMaterial blending={THREE.AdditiveBlending} color={COLOR_FFDB4D} depthWrite={false} opacity={0.75} toneMapped={false} transparent />
      </mesh>
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════
// COMPONENT 4: LAYER 3 — VÒNG PHÉP PHỤ (AUXILIARY GIMBAL RINGS)
// (Xoay nhanh trục chéo Z/X, cấu trúc con quay hồi chuyển 3D)
// ══════════════════════════════════════════════════════════════════
function AuxiliaryGimbalRings({ activity }: { activity: AiActivity }) {
  const gyroARef = useRef<THREE.Group>(null);
  const gyroBRef = useRef<THREE.Group>(null);

  const tickGeom = useMemo(() => {
    const segs: Array<[THREE.Vector3, THREE.Vector3]> = [];
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * TAU;
      segs.push([polar(2.98, a, 0), polar(3.16, a, 0)]);
    }
    return segmentGeometry(segs);
  }, []);

  useFrame((_, delta) => {
    const speed = activitySpeed(activity);
    const dir = activity === "thinking" ? -1 : 1;
    // Layer 3: Xoay nhanh trục chéo
    if (gyroARef.current) gyroARef.current.rotation.z += delta * 0.18 * speed * dir;
    if (gyroBRef.current) gyroBRef.current.rotation.z -= delta * 0.14 * speed * dir;
  });

  return (
    <group>
      {/* Gimbal Ring A (Tilted +55° on X) */}
      <group ref={gyroARef} rotation={[Math.PI / 3.1, 0.2, 0]}>
        <mesh>
          <torusGeometry args={[3.08, 0.024, 6, 180]} />
          <meshBasicMaterial blending={THREE.AdditiveBlending} color={COLOR_A9FFA6} depthWrite={false} opacity={0.46} toneMapped={false} transparent />
        </mesh>
        <lineSegments geometry={tickGeom}>
          <lineBasicMaterial blending={THREE.AdditiveBlending} color={COLOR_1BFF7A} depthWrite={false} opacity={0.4} toneMapped={false} transparent />
        </lineSegments>
      </group>

      {/* Gimbal Ring B (Tilted -55° on X) */}
      <group ref={gyroBRef} rotation={[-Math.PI / 3.1, -0.2, 0]}>
        <mesh>
          <torusGeometry args={[3.22, 0.02, 6, 180]} />
          <meshBasicMaterial blending={THREE.AdditiveBlending} color={COLOR_8EFF66} depthWrite={false} opacity={0.42} toneMapped={false} transparent />
        </mesh>
        <lineSegments geometry={tickGeom}>
          <lineBasicMaterial blending={THREE.AdditiveBlending} color={COLOR_FFDB4D} depthWrite={false} opacity={0.32} toneMapped={false} transparent />
        </lineSegments>
      </group>
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════
// COMPONENT 5: LAYER 4 — CÁC SIGIL NỔI (FLOATING SATELLITE SIGILS)
// (Bay quanh và xoay đa trục, 8 ấn chú phụ có tia laser kết nối)
// ══════════════════════════════════════════════════════════════════
function FloatingSigilOrbits({ activity }: { activity: AiActivity }) {
  const groupRef = useRef<THREE.Group>(null);
  const connectorsRef = useRef<THREE.LineSegments>(null);
  const materialsRef = useRef<(THREE.ShaderMaterial | null)[]>([]);

  const sigilCount = 8;
  const sigilData = useMemo(() => {
    const rng = seededRandom(11409);
    return Array.from({ length: sigilCount }, (_, i) => ({
      baseAngle: (i / sigilCount) * TAU,
      radius: 1.88 + (i % 2) * 0.32,
      yOffset: (rng() - 0.5) * 0.48,
      speed: 0.13 + (i % 3) * 0.04,
      spinSpeed: (i % 2 === 0 ? 1 : -1) * (0.65 + rng() * 0.4),
      scale: 0.36,
    }));
  }, []);

  const connectorPositions = useMemo(() => new Float32Array(sigilCount * 6), []);
  const connectorGeom = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(connectorPositions, 3));
    return geom;
  }, [connectorPositions]);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const speed = activitySpeed(activity);
    const energy = activityEnergy(activity);

    // Layer 4: Bay quanh và xoay đa trục
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const d = sigilData[i];
        const angle = d.baseAngle + t * d.speed * speed;
        const x = Math.cos(angle) * d.radius;
        const y = d.yOffset + Math.sin(t * 1.8 + i * 0.8) * 0.1;
        const z = Math.sin(angle) * d.radius * 0.65;

        child.position.set(x, y, z);
        child.rotation.z += delta * d.spinSpeed * speed;
        const sc = d.scale * (0.92 + Math.sin(t * 3.0 + i) * 0.05 * energy);
        child.scale.setScalar(sc);

        // Update connector lines
        connectorPositions[i * 6] = 0;
        connectorPositions[i * 6 + 1] = 0;
        connectorPositions[i * 6 + 2] = 0;
        connectorPositions[i * 6 + 3] = x;
        connectorPositions[i * 6 + 4] = y;
        connectorPositions[i * 6 + 5] = z;
      });
      connectorGeom.attributes.position.needsUpdate = true;
    }

    materialsRef.current.forEach((mat) => {
      if (mat) mat.uniforms.uTime.value = t;
    });
  });

  return (
    <group>
      <group ref={groupRef}>
        {sigilData.map((_, i) => (
          <group key={i}>
            <mesh>
              <planeGeometry args={[1, 1]} />
              <shaderMaterial
                ref={(el) => { materialsRef.current[i] = el; }}
                vertexShader={sigilShader.vertexShader}
                fragmentShader={sigilShader.fragmentShader}
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
            <mesh scale={0.065}>
              <sphereGeometry args={[1, 12, 12]} />
              <meshBasicMaterial color={COLOR_A9FFA6} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>

      <lineSegments ref={connectorsRef} geometry={connectorGeom}>
        <lineBasicMaterial
          blending={THREE.AdditiveBlending}
          color={COLOR_1CFF82}
          depthWrite={false}
          opacity={0.3}
          toneMapped={false}
          transparent
        />
      </lineSegments>
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════
// COMPONENT 6: LAYER 5 — VÒNG NGOÀI RUNES (OUTER RUNE MATRIX)
// (Xoay rất chậm trục dọc Y ngược chiều lõi)
// ══════════════════════════════════════════════════════════════════
function OuterRuneMatrix({ activity }: { activity: AiActivity }) {
  const groupRef = useRef<THREE.Group>(null);

  const outerGeom = useMemo(() => {
    const segs: Array<[THREE.Vector3, THREE.Vector3]> = [];
    const r1 = 3.42;
    const r2 = 3.68;
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * TAU;
      segs.push([polar(r1, a, 0), polar(r2, a, 0)]);
      if (i % 4 === 0) {
        const tangent = new THREE.Vector3(-Math.sin(a), Math.cos(a), 0).multiplyScalar(0.06);
        const center = polar((r1 + r2) / 2, a, 0);
        segs.push([center.clone().sub(tangent), center.clone().add(tangent)]);
      }
    }
    return segmentGeometry(segs);
  }, []);

  const circleGeom = useMemo(() => {
    const paths = [circlePoints(3.4, 128), circlePoints(3.7, 128)];
    return pathGeometry(paths);
  }, []);

  useFrame((_, delta) => {
    // Layer 5: Xoay rất chậm ngược chiều lõi
    if (groupRef.current) {
      const dir = activity === "thinking" ? 1 : -1;
      groupRef.current.rotation.y -= delta * 0.02 * activitySpeed(activity) * dir;
    }
  });

  return (
    <group ref={groupRef} rotation={[0, 0, 0]}>
      <lineSegments geometry={outerGeom}>
        <lineBasicMaterial blending={THREE.AdditiveBlending} color={COLOR_1BFF7A} depthWrite={false} opacity={0.48} toneMapped={false} transparent />
      </lineSegments>
      <lineSegments geometry={circleGeom}>
        <lineBasicMaterial blending={THREE.AdditiveBlending} color={COLOR_FFDB4D} depthWrite={false} opacity={0.36} toneMapped={false} transparent />
      </lineSegments>
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════
// COMPONENT 7: MẶT SÀN MA THUẬT & CỘT ÁNH SÁNG THẲNG ĐỨNG (PEDESTAL)
// ══════════════════════════════════════════════════════════════════
function BasePedestalRitualMandala({ activity }: { activity: AiActivity }) {
  const pedestalRef = useRef<THREE.Group>(null);
  const shaderMatRef = useRef<THREE.ShaderMaterial>(null);
  const lightBeamsRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const speed = activitySpeed(activity);
    const energy = activityEnergy(activity);

    if (shaderMatRef.current) {
      shaderMatRef.current.uniforms.uTime.value = t;
      shaderMatRef.current.uniforms.uEnergy.value = energy;
    }

    if (pedestalRef.current) {
      pedestalRef.current.rotation.y += delta * 0.045 * speed;
    }

    if (lightBeamsRef.current) {
      lightBeamsRef.current.rotation.y -= delta * 0.08 * speed;
    }
  });

  return (
    <group position={[0, -2.15, 0]}>
      {/* 1. Large Ground Ritual Disc (XZ Plane) */}
      <group ref={pedestalRef} rotation={[Math.PI / 2, 0, 0]}>
        <mesh scale={[6.0, 6.0, 1]}>
          <planeGeometry args={[1, 1]} />
          <shaderMaterial
            ref={shaderMatRef}
            vertexShader={pedestalShader.vertexShader}
            fragmentShader={pedestalShader.fragmentShader}
            uniforms={{ uTime: { value: 0 }, uEnergy: { value: 1 } }}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* 2. Floating Tiered Stepped Altar Rings */}
      {[0.22, 0.45, 0.72].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.3 - idx * 0.45, 0.018, 6, 96]} />
          <meshBasicMaterial
            blending={THREE.AdditiveBlending}
            color={idx === 0 ? COLOR_FFDB4D : COLOR_1BFF7A}
            depthWrite={false}
            opacity={0.5 - idx * 0.08}
            toneMapped={false}
            transparent
          />
        </mesh>
      ))}

      {/* 3. Vertical Light Beam Pillar Ascending to Core */}
      <group ref={lightBeamsRef}>
        <mesh position={[0, 1.08, 0]}>
          <cylinderGeometry args={[0.08, 0.48, 2.15, 16, 1, true]} />
          <meshBasicMaterial
            blending={THREE.AdditiveBlending}
            color={COLOR_1BFF7A}
            depthWrite={false}
            opacity={0.14}
            side={THREE.DoubleSide}
            toneMapped={false}
            transparent
          />
        </mesh>
      </group>
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════
// COMPONENT 8: TIMELINE ENERGY SPLINES & FLYING PHOTON BEADS
// ══════════════════════════════════════════════════════════════════
function TimelineEnergyStreams({ activity }: { activity: AiActivity }) {
  const groupRef = useRef<THREE.Group>(null);
  const packetsRef = useRef<THREE.InstancedMesh>(null);
  const packetCount = 56;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const curves = useMemo(() => {
    const list: THREE.CatmullRomCurve3[] = [];
    const rng = seededRandom(88192);
    for (let b = 0; b < 7; b++) {
      const theta = (b / 7) * TAU;
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 6; i++) {
        const t = i / 6;
        const r = 0.35 + t * (2.45 + rng() * 0.4);
        const a = theta + Math.sin(t * Math.PI * 1.5) * 0.65;
        pts.push(new THREE.Vector3(
          Math.cos(a) * r,
          (t - 0.5) * 2.2 + Math.sin(t * TAU) * 0.3,
          Math.sin(a) * r * (0.8 + (b % 2) * 0.2)
        ));
      }
      list.push(new THREE.CatmullRomCurve3(pts));
    }
    return list;
  }, []);

  const tubeGeoms = useMemo(() => {
    return curves.map((c) => new THREE.TubeGeometry(c, 36, 0.016, 6, false));
  }, [curves]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const speed = activitySpeed(activity);

    if (packetsRef.current) {
      curves.forEach((curve, cIdx) => {
        for (let p = 0; p < 8; p++) {
          const idx = cIdx * 8 + p;
          const progress = (t * 0.25 * speed + p / 8 + cIdx * 0.12) % 1.0;
          const pt = curve.getPoint(progress);
          dummy.position.copy(pt);
          dummy.scale.setScalar(0.04 + Math.sin(progress * Math.PI) * 0.02);
          dummy.updateMatrix();
          packetsRef.current?.setMatrixAt(idx, dummy.matrix);
        }
      });
      packetsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {tubeGeoms.map((geom, idx) => (
        <mesh key={idx} geometry={geom}>
          <meshBasicMaterial
            blending={THREE.AdditiveBlending}
            color={idx % 2 === 0 ? COLOR_8EFF66 : COLOR_FFDB4D}
            depthWrite={false}
            opacity={0.36}
            toneMapped={false}
            transparent
          />
        </mesh>
      ))}

      <instancedMesh ref={packetsRef} args={[undefined, undefined, packetCount]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color={COLOR_WHITE} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════
// COMPONENT 9: ATMOSPHERIC MYSTIC EMBERS & SPARKS (460 PARTICLES)
// ══════════════════════════════════════════════════════════════════
function MysticEmberSparks({ activity }: { activity: AiActivity }) {
  const count = 460;
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => new Float32Array(count * 3), []);

  const params = useMemo(() => {
    const rng = seededRandom(20261);
    return Array.from({ length: count }, () => ({
      radius: 0.5 + rng() * 3.5,
      angle: rng() * TAU,
      y: (rng() - 0.5) * 4.4,
      speed: (0.05 + rng() * 0.35) * (rng() > 0.45 ? 1 : -1),
      wobble: rng() * TAU,
      helical: rng() > 0.65,
    }));
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const speed = activitySpeed(activity);
    const energy = activityEnergy(activity);

    for (let i = 0; i < count; i++) {
      const p = params[i];
      const angle = p.angle + t * p.speed * speed;
      const r = p.radius + Math.sin(t * 0.7 + p.wobble) * 0.08 * energy;
      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = p.helical ? Math.sin(angle * 3.0) * 0.6 + p.y * 0.5 : p.y + Math.sin(t * 0.5 + p.wobble) * 0.1;
      positions[i * 3 + 2] = Math.sin(angle) * r * 0.75;
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.015;
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        blending={THREE.AdditiveBlending}
        color={COLOR_8EFF66}
        depthWrite={false}
        opacity={0.56}
        size={0.03}
        sizeAttenuation
        toneMapped={false}
        transparent
      />
    </points>
  );
}

// ══════════════════════════════════════════════════════════════════
// COMPONENT 10: TEMPORAL DISTORTION SHOCKWAVE DISC
// ══════════════════════════════════════════════════════════════════
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
    <mesh position={[0, 0, -0.05]} scale={[5.4, 5.4, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={shockwaveShader.vertexShader}
        fragmentShader={shockwaveShader.fragmentShader}
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
// MAIN SCENE ROOT: GREEN MYSTIC CORE (TIME STONE)
// ══════════════════════════════════════════════════════════════════
export interface TimeSceneProps {
  activity?: AiActivity;
}

export function TimeScene({ activity = "idle" }: TimeSceneProps) {
  return (
    <group name="green-mystic-core-doctor-strange-scene" scale={1.22}>
      {/* Ambient & Directional Lighting */}
      <ambientLight intensity={0.45} color={COLOR_0A1A0F} />
      <directionalLight position={[4, 5, 4]} intensity={2.0} color={COLOR_8EFF66} />
      <pointLight position={[-3, 2, 3]} color={COLOR_1BFF7A} intensity={2.4} distance={12} />
      <pointLight position={[3, -2, -2]} color={COLOR_FFDB4D} intensity={1.8} distance={10} />

      {/* Deep Temporal Distortion Shockwaves */}
      <TimeDistortionShockwaves activity={activity} />

      {/* Base Ritual Floor Mandala & Vertical Light Pillar */}
      <BasePedestalRitualMandala activity={activity} />

      {/* Layer 5: Vòng ngoài Runes (Xoay rất chậm trục dọc Y ngược chiều) */}
      <OuterRuneMatrix activity={activity} />

      {/* Layer 3: Vòng phép phụ (Auxiliary Gimbal Gyroscope Rings, Xoay nhanh trục chéo) */}
      <AuxiliaryGimbalRings activity={activity} />

      {/* Layer 2: Vòng phép chính (Main Tilted Eldritch Mandala Disc, Xoay trung bình) */}
      <MainEldritchSpellDisc activity={activity} />

      {/* Timeline Energy Ribbon Splines & Flying Photons */}
      <TimelineEnergyStreams activity={activity} />

      {/* Layer 4: Các Sigil nổi (8 Floating Satellite Sigils, Bay quanh và xoay đa trục) */}
      <FloatingSigilOrbits activity={activity} />

      {/* Layer 1: Lõi Time Stone & Agamotto Golden Prongs (Xoay chậm trục dọc Y) */}
      <FacetedTimeStoneGem activity={activity} />

      {/* Atmospheric Sparkling Mystic Embers */}
      <MysticEmberSparks activity={activity} />
    </group>
  );
}
