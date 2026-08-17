import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { AiActivity } from "../../App";
import { activityEnergy, activityPulse, activitySpeed, seededRandom, segmentGeometry, pathGeometry } from "../shared/coreMotion";

// ══════════════════════════════════════════════════════════════════
// COLOR PALETTE — GREEN MYSTIC CORE (DOCTOR STRANGE / TIME STONE)
// ══════════════════════════════════════════════════════════════════
const NEON_GREEN  = "#00e676";
const EMERALD     = "#1bff7a";
const MINT        = "#1cff82";
const LIME        = "#8eff66";
const PALE_CORE   = "#a9ffa6";
const GOLD_MYSTIC = "#ffdb4d";
const BRONZE_GOLD = "#d4a017";
const DEEP_EMERALD= "#052e16";
const DARK_VOID   = "#020f07";
const WHITE_HOT   = "#ffffff";

const TAU = Math.PI * 2;

// ── Math Helpers for 3D Procedural Vector Geometry ──
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
// 1. CUSTOM MULTI-FACETED TIME STONE GEM CRYSTAL GEOMETRY
//    Elongated hexagonal bipyramid with beveled facet edges
// ══════════════════════════════════════════════════════════════════
function createFacetedCrystalGeometry(): THREE.BufferGeometry {
  const geom = new THREE.BufferGeometry();
  const height = 1.15;
  const midRadius = 0.32;
  const capRadius = 0.14;
  const capHeight = 0.45;
  const segments = 8; // 8-sided faceted crystal

  const vertices: number[] = [];
  const uvs: number[] = [];

  // Top Apex (0, height, 0)
  // Top Cap Ring (capRadius at y = capHeight)
  // Middle Equator Ring (midRadius at y = 0)
  // Bottom Cap Ring (capRadius at y = -capHeight)
  // Bottom Apex (0, -height, 0)

  const topApex = new THREE.Vector3(0, height, 0);
  const bottomApex = new THREE.Vector3(0, -height, 0);

  const topRing: THREE.Vector3[] = [];
  const midRing: THREE.Vector3[] = [];
  const botRing: THREE.Vector3[] = [];

  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * TAU;
    // Slight organic irregularity for raw gem look
    const rVar = 1 + (i % 2 === 0 ? 0.08 : -0.06);
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
    // Top pyramid faces
    addTri(topApex, topRing[next], topRing[i]);
    // Upper facet quads
    addQuad(topRing[i], topRing[next], midRing[next], midRing[i]);
    // Lower facet quads
    addQuad(midRing[i], midRing[next], botRing[next], botRing[i]);
    // Bottom pyramid faces
    addTri(bottomApex, botRing[i], botRing[next]);
  }

  geom.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geom.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geom.computeVertexNormals();
  return geom;
}

// ══════════════════════════════════════════════════════════════════
// 2. SHADERS: VOLUMETRIC TIME STONE INNER ENERGY & FRACTURE VEINS
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

      // Strong Fresnel edge highlight (crystal refraction brilliance)
      float fresnel = pow(1.0 - max(dot(viewDir, norm), 0.0), 2.2);

      // Internal energy plasma currents
      float n1 = noise(vModelPosition * 5.5 + vec3(0.0, uTime * 0.9, 0.0));
      float n2 = noise(vModelPosition * 12.0 - vec3(uTime * 0.7, 0.0, uTime * 0.5));
      float plasma = n1 * 0.65 + n2 * 0.35;

      // Temporal lightning fracture veins along the crystal body
      float veinA = pow(abs(sin(vModelPosition.y * 16.0 + vModelPosition.x * 12.0 + uTime * 2.2)), 16.0);
      float veinB = pow(abs(sin(vModelPosition.z * 14.0 - vModelPosition.y * 10.0 - uTime * 1.8)), 14.0);
      float veins = (veinA + veinB) * (0.8 + uEnergy * 0.6);

      // Color grading: Deep emerald base -> Neon mint -> Lime gold veins -> White hot core
      vec3 colDeep   = vec3(0.015, 0.22, 0.08); // #043814
      vec3 colNeon   = vec3(0.0, 0.95, 0.42);   // #00f26c
      vec3 colMint   = vec3(0.55, 1.0, 0.65);   // #8cffa6
      vec3 colGold   = vec3(1.0, 0.88, 0.35);   // #ffe059
      vec3 colWhite  = vec3(1.0, 1.0, 1.0);

      vec3 color = mix(colDeep, colNeon, plasma * 0.9);
      color = mix(color, colMint, fresnel * 0.8);
      color += colGold * veins * 1.5;
      color += colWhite * pow(plasma, 4.0) * 1.2;

      float alpha = clamp(0.78 + fresnel * 0.22 + veins * 0.35, 0.0, 1.0);
      gl_FragColor = vec4(color * (1.2 + uEnergy * 0.6), alpha);
    }
  `
};

// ══════════════════════════════════════════════════════════════════
// 3. DOCTOR STRANGE PROCEDURAL ELDRITCH MAGIC MANDALA SHADER
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

      // Concentric spell ring boundaries
      float r1 = smoothstep(0.02, 0.0, abs(r - 0.26));
      float r2 = smoothstep(0.015, 0.0, abs(r - 0.46));
      float r3 = smoothstep(0.012, 0.0, abs(r - 0.68));
      float r4 = smoothstep(0.014, 0.0, abs(r - 0.84));
      float r5 = smoothstep(0.010, 0.0, abs(r - 0.95));

      // 8-Fold sacred rosette symmetry
      float p8 = abs(cos(angle * 8.0 + uTime * 0.7 * uDirection));
      float star8 = smoothstep(0.68, 0.98, p8 * (1.0 - abs(r - 0.36) * 4.5));

      // 16-Fold intricate chronal petals
      float p16 = abs(sin(angle * 16.0 - uTime * 1.1 * uDirection));
      float star16 = smoothstep(0.72, 0.99, p16 * (1.0 - abs(r - 0.57) * 5.5));

      // 24-Fold outer gear teeth / chronal dial ticks
      float p24 = abs(cos(angle * 24.0 + uTime * 1.4 * uDirection));
      float gear24 = smoothstep(0.76, 0.99, p24 * (1.0 - abs(r - 0.76) * 6.5));

      // 36 Outer Runes notches
      float runes = step(0.86, sin(angle * 36.0 - uTime * 0.5 * uDirection)) * r4;

      // 12 Cardinal radial laser spokes
      float spokes = step(0.982, cos(angle * 12.0)) * smoothstep(0.24, 0.28, r) * smoothstep(0.96, 0.92, r);

      // Interlocking triangles / hexagram pattern
      float tri1 = abs(cos(angle * 3.0 + uTime * 0.3 * uDirection));
      float triPattern = smoothstep(0.85, 0.98, tri1 * (1.0 - abs(r - 0.68) * 3.0));

      float total = r1 + r2 + r3 + r4 + r5
                  + star8 * 0.9 + star16 * 1.0 + gear24 * 0.75
                  + runes * 0.85 + spokes * 0.8 + triPattern * 0.6;

      // Color mapping: Neon Green (#00e676) -> Bright Lime (#8eff66) -> Gold Mystic (#ffdb4d)
      vec3 colNeon = vec3(0.0, 0.95, 0.46);
      vec3 colLime = vec3(0.55, 1.0, 0.4);
      vec3 colGold = vec3(1.0, 0.86, 0.3);

      vec3 color = mix(colNeon, colLime, r);
      color = mix(color, colGold, runes * 0.6 + gear24 * 0.4);

      float alpha = total * 0.82 * uEnergy * smoothstep(1.0, 0.86, r);
      gl_FragColor = vec4(color * 1.8, alpha);
    }
  `
};

// ══════════════════════════════════════════════════════════════════
// 4. FLOATING SATELLITE SIGILS (8 ORBITING MAGIC SEALS)
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

      // Star glyph
      float star = step(0.86, cos(angle * (4.0 + uIndex * 2.0) + uTime * 0.8));
      float cross = step(0.92, abs(cos(angle * 2.0))) * smoothstep(0.12, 0.16, r) * smoothstep(0.86, 0.82, r);

      float total = ring1 + ring2 + ring3 + star * 0.8 + cross * 0.7;

      vec3 colG = vec3(0.0, 0.95, 0.46);
      vec3 colGold = vec3(1.0, 0.86, 0.3);
      vec3 col = mix(colG, colGold, ring2 * 0.5);

      float alpha = total * 0.75 * smoothstep(1.0, 0.84, r);
      gl_FragColor = vec4(col * 1.6, alpha);
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

      // Stepped concentric wave
      float wave = smoothstep(0.03, 0.0, abs(fract(r * 4.0 - uTime * 0.4) - 0.5));

      float total = r1 + r2 + r3 + r4 + hex * 0.7 + sweep * 0.5 + wave * 0.25;

      vec3 colG = vec3(0.0, 0.95, 0.46);
      vec3 colMint = vec3(0.6, 1.0, 0.7);
      vec3 col = mix(colG, colMint, sweep * 0.6);

      float alpha = total * 0.65 * uEnergy * smoothstep(1.0, 0.85, r);
      gl_FragColor = vec4(col * 1.4, alpha);
    }
  `
};

// ══════════════════════════════════════════════════════════════════
// 6. TIME DISTORTION SHOCKWAVES
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

      float alpha = (ring1 + ring2 * 0.6) * fade * 0.65 * uEnergy;
      gl_FragColor = vec4(col * 2.0, alpha);
    }
  `
};

// ══════════════════════════════════════════════════════════════════
// COMPONENT 1: RAW TIME STONE CRYSTAL CORE & SATELLITE SHARDS
// ══════════════════════════════════════════════════════════════════
function FacetedTimeStoneGem({ activity }: { activity: AiActivity }) {
  const gemRef = useRef<THREE.Group>(null);
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
      radius: 0.58 + (i % 2) * 0.14,
      y: (rng() - 0.5) * 0.5,
      scale: 0.055 + rng() * 0.035,
      speed: 0.22 + (i % 3) * 0.08,
      tilt: [rng() * Math.PI, rng() * Math.PI, rng() * Math.PI] as [number, number, number],
    }));
  }, []);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const speed = activitySpeed(activity);
    const energy = activityEnergy(activity);
    const pulse = activityPulse(activity, t, 0.5);

    if (gemRef.current) {
      gemRef.current.rotation.y += delta * 0.35 * speed;
      gemRef.current.rotation.x = Math.sin(t * 0.4) * 0.08;
      gemRef.current.scale.setScalar(pulse * (0.95 + energy * 0.08));
    }

    if (shaderMatRef.current) {
      shaderMatRef.current.uniforms.uTime.value = t;
      shaderMatRef.current.uniforms.uEnergy.value = energy;
    }

    if (whiteNucleusRef.current) {
      const nScale = 0.12 + Math.sin(t * 6.0) * 0.02 * energy;
      whiteNucleusRef.current.scale.setScalar(nScale);
    }

    if (shardsGroupRef.current) {
      shardsGroupRef.current.children.forEach((shard, i) => {
        const d = shardData[i];
        const angle = d.angle + t * d.speed * speed;
        shard.position.set(
          Math.cos(angle) * d.radius,
          d.y + Math.sin(t * 1.5 + i * 1.2) * 0.08,
          Math.sin(angle) * d.radius
        );
        shard.rotation.y += delta * 1.8;
        shard.rotation.x += delta * 0.9;
      });
    }
  });

  return (
    <group ref={gemRef}>
      {/* 1. White-hot pure nucleus light point */}
      <mesh ref={whiteNucleusRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={WHITE_HOT} toneMapped={false} />
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

      {/* 3. Glowing Emerald Crystal Facet Edges */}
      <lineSegments ref={wireMeshRef} geometry={edgeGeom}>
        <lineBasicMaterial
          blending={THREE.AdditiveBlending}
          color={LIME}
          depthWrite={false}
          opacity={0.88}
          toneMapped={false}
          transparent
        />
      </lineSegments>

      {/* 4. Outer Refraction Glass Gem Shell */}
      <mesh geometry={crystalGeom} scale={1.03}>
        <meshPhysicalMaterial
          clearcoat={1}
          clearcoatRoughness={0.02}
          color={EMERALD}
          depthWrite={false}
          envMapIntensity={2.2}
          ior={1.68}
          metalness={0.1}
          opacity={0.3}
          roughness={0.04}
          transmission={0.85}
          transparent
        />
      </mesh>

      {/* 5. 6 Orbiting Satellite Gem Shards */}
      <group ref={shardsGroupRef}>
        {shardData.map((d, i) => (
          <mesh key={i} rotation={d.tilt} scale={d.scale} geometry={crystalGeom}>
            <meshStandardMaterial
              color={i % 2 === 0 ? NEON_GREEN : GOLD_MYSTIC}
              emissive={EMERALD}
              emissiveIntensity={2.5}
              roughness={0.1}
              metalness={0.2}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      {/* Core Point Light */}
      <pointLight color={EMERALD} distance={9} intensity={6.5} decay={2} />
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════
// COMPONENT 2: 3D VECTOR GEOMETRIC RUNES & MANDALA ARCS
// ══════════════════════════════════════════════════════════════════
function create3DSpellRuneGeometry() {
  const segs: Array<[THREE.Vector3, THREE.Vector3]> = [];
  const r1 = 2.45;
  const r2 = 2.78;

  // 36 Non-Latin Eldritch Runes arranged radially
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * TAU;
    const center = polar((r1 + r2) / 2, a, 0);
    const tangent = new THREE.Vector3(-Math.sin(a), Math.cos(a), 0);
    const radial = new THREE.Vector3(Math.cos(a), Math.sin(a), 0);

    const w = 0.048;
    const h = 0.055;

    // Outer and inner border tick
    segs.push([polar(r1, a, 0), polar(r1 + 0.03, a, 0)]);
    segs.push([polar(r2 - 0.03, a, 0), polar(r2, a, 0)]);

    // Runic glyph strokes
    const glyphType = i % 5;
    if (glyphType === 0) {
      // Chevron rune (ᚦ)
      segs.push([
        center.clone().add(radial.clone().multiplyScalar(h)),
        center.clone().add(tangent.clone().multiplyScalar(w)),
      ]);
      segs.push([
        center.clone().add(tangent.clone().multiplyScalar(w)),
        center.clone().add(radial.clone().multiplyScalar(-h)),
      ]);
      segs.push([
        center.clone().add(radial.clone().multiplyScalar(h)),
        center.clone().add(radial.clone().multiplyScalar(-h)),
      ]);
    } else if (glyphType === 1) {
      // Cross rune (ᛟ)
      segs.push([
        center.clone().add(tangent.clone().multiplyScalar(-w)).add(radial.clone().multiplyScalar(h)),
        center.clone().add(tangent.clone().multiplyScalar(w)).add(radial.clone().multiplyScalar(-h)),
      ]);
      segs.push([
        center.clone().add(tangent.clone().multiplyScalar(-w)).add(radial.clone().multiplyScalar(-h)),
        center.clone().add(tangent.clone().multiplyScalar(w)).add(radial.clone().multiplyScalar(h)),
      ]);
    } else if (glyphType === 2) {
      // Algiz trident rune (ᛉ)
      segs.push([
        center.clone().add(radial.clone().multiplyScalar(-h)),
        center.clone().add(radial.clone().multiplyScalar(h)),
      ]);
      segs.push([
        center.clone().add(tangent.clone().multiplyScalar(-w)).add(radial.clone().multiplyScalar(h)),
        center.clone(),
      ]);
      segs.push([
        center.clone().add(tangent.clone().multiplyScalar(w)).add(radial.clone().multiplyScalar(h)),
        center.clone(),
      ]);
    } else {
      // Diamond node rune (ᛋ)
      segs.push([
        center.clone().add(radial.clone().multiplyScalar(h)),
        center.clone().add(tangent.clone().multiplyScalar(w)),
      ]);
      segs.push([
        center.clone().add(tangent.clone().multiplyScalar(w)),
        center.clone().add(radial.clone().multiplyScalar(-h)),
      ]);
      segs.push([
        center.clone().add(radial.clone().multiplyScalar(-h)),
        center.clone().add(tangent.clone().multiplyScalar(-w)),
      ]);
      segs.push([
        center.clone().add(tangent.clone().multiplyScalar(-w)),
        center.clone().add(radial.clone().multiplyScalar(h)),
      ]);
    }
  }

  return segmentGeometry(segs);
}

function createSacredGeometryStarPaths() {
  const paths: THREE.Vector3[][] = [];
  // 12-point star formed by 4 overlapping triangles
  for (let t = 0; t < 4; t++) {
    const phase = (t / 4) * (TAU / 3);
    paths.push(polygonPoints(3, 2.35, phase, 0));
  }
  // Concentric structural circles
  paths.push(circlePoints(1.22, 64));
  paths.push(circlePoints(1.85, 96));
  paths.push(circlePoints(2.42, 128));
  paths.push(circlePoints(2.82, 128));

  return pathGeometry(paths);
}

// ══════════════════════════════════════════════════════════════════
// COMPONENT 3: MAIN TILTED 3D ELDRITCH MANDALA DISC
// ══════════════════════════════════════════════════════════════════
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

    if (mainDiscRef.current) {
      mainDiscRef.current.rotation.z += delta * 0.065 * speed * dir;
    }

    if (shaderMatRef.current) {
      shaderMatRef.current.uniforms.uTime.value = t;
      shaderMatRef.current.uniforms.uEnergy.value = energy;
      shaderMatRef.current.uniforms.uDirection.value = dir;
    }

    if (runeLineRef.current) {
      runeLineRef.current.rotation.z -= delta * 0.02 * speed * dir;
    }
  });

  return (
    <group ref={mainDiscRef} rotation={[0.46, -0.25, 0]} scale={1.05}>
      {/* 1. High-Res Additive Eldritch Energy Mandala Shader Disc */}
      <mesh position={[0, 0, -0.02]} scale={[6.2, 6.2, 1]}>
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

      {/* 2. Crisp 3D Glowing Runes Ring */}
      <lineSegments ref={runeLineRef} geometry={runeGeom}>
        <lineBasicMaterial
          blending={THREE.AdditiveBlending}
          color={EMERALD}
          depthWrite={false}
          opacity={0.88}
          toneMapped={false}
          transparent
        />
      </lineSegments>

      {/* 3. Sacred Geometry 12-Point Star Mandala */}
      <lineSegments ref={starLineRef} geometry={starGeom}>
        <lineBasicMaterial
          blending={THREE.AdditiveBlending}
          color={GOLD_MYSTIC}
          depthWrite={false}
          opacity={0.72}
          toneMapped={false}
          transparent
        />
      </lineSegments>

      {/* 4. 3D Beveled Torus Accent Rings */}
      <mesh position={[0, 0, 0.01]}>
        <torusGeometry args={[2.42, 0.016, 6, 160]} />
        <meshBasicMaterial blending={THREE.AdditiveBlending} color={LIME} depthWrite={false} opacity={0.65} toneMapped={false} transparent />
      </mesh>
      <mesh position={[0, 0, -0.01]}>
        <torusGeometry args={[2.82, 0.018, 6, 160]} />
        <meshBasicMaterial blending={THREE.AdditiveBlending} color={EMERALD} depthWrite={false} opacity={0.55} toneMapped={false} transparent />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <torusGeometry args={[1.22, 0.012, 6, 96]} />
        <meshBasicMaterial blending={THREE.AdditiveBlending} color={GOLD_MYSTIC} depthWrite={false} opacity={0.7} toneMapped={false} transparent />
      </mesh>
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════
// COMPONENT 4: AUXILIARY GIMBAL RINGS (SPHERICAL 3D GYROSCOPE)
// ══════════════════════════════════════════════════════════════════
function AuxiliaryGimbalRings({ activity }: { activity: AiActivity }) {
  const gyroARef = useRef<THREE.Group>(null);
  const gyroBRef = useRef<THREE.Group>(null);

  const tickGeom = useMemo(() => {
    const segs: Array<[THREE.Vector3, THREE.Vector3]> = [];
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * TAU;
      segs.push([polar(2.95, a, 0), polar(3.12, a, 0)]);
    }
    return segmentGeometry(segs);
  }, []);

  useFrame((_, delta) => {
    const speed = activitySpeed(activity);
    const dir = activity === "thinking" ? -1 : 1;
    if (gyroARef.current) gyroARef.current.rotation.z += delta * 0.16 * speed * dir;
    if (gyroBRef.current) gyroBRef.current.rotation.z -= delta * 0.12 * speed * dir;
  });

  return (
    <group>
      {/* Gimbal Ring A (Tilted +55° on X) */}
      <group ref={gyroARef} rotation={[Math.PI / 3.1, 0.18, 0]}>
        <mesh>
          <torusGeometry args={[3.05, 0.022, 6, 180]} />
          <meshBasicMaterial blending={THREE.AdditiveBlending} color={PALE_CORE} depthWrite={false} opacity={0.42} toneMapped={false} transparent />
        </mesh>
        <lineSegments geometry={tickGeom}>
          <lineBasicMaterial blending={THREE.AdditiveBlending} color={EMERALD} depthWrite={false} opacity={0.35} toneMapped={false} transparent />
        </lineSegments>
      </group>

      {/* Gimbal Ring B (Tilted -55° on X) */}
      <group ref={gyroBRef} rotation={[-Math.PI / 3.1, -0.18, 0]}>
        <mesh>
          <torusGeometry args={[3.18, 0.018, 6, 180]} />
          <meshBasicMaterial blending={THREE.AdditiveBlending} color={LIME} depthWrite={false} opacity={0.38} toneMapped={false} transparent />
        </mesh>
        <lineSegments geometry={tickGeom}>
          <lineBasicMaterial blending={THREE.AdditiveBlending} color={GOLD_MYSTIC} depthWrite={false} opacity={0.28} toneMapped={false} transparent />
        </lineSegments>
      </group>
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════
// COMPONENT 5: FLOATING SATELLITE SIGIL DIALS (8 SIGIL NODES)
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
      radius: 1.82 + (i % 2) * 0.28,
      yOffset: (rng() - 0.5) * 0.45,
      speed: 0.12 + (i % 3) * 0.04,
      spinSpeed: (i % 2 === 0 ? 1 : -1) * (0.6 + rng() * 0.4),
      scale: 0.34,
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

        // Update connector lines to center
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
      {/* 8 Floating Glowing Sigil Dials */}
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
            {/* Center glowing node sphere */}
            <mesh scale={0.06}>
              <sphereGeometry args={[1, 12, 12]} />
              <meshBasicMaterial color={PALE_CORE} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Dynamic Laser Connector Streams */}
      <lineSegments ref={connectorsRef} geometry={connectorGeom}>
        <lineBasicMaterial
          blending={THREE.AdditiveBlending}
          color={MINT}
          depthWrite={false}
          opacity={0.25}
          toneMapped={false}
          transparent
        />
      </lineSegments>
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════
// COMPONENT 6: BASE PEDESTAL RITUAL MANDALA & VERTICAL LIGHT BEAMS
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
      pedestalRef.current.rotation.y += delta * 0.04 * speed;
    }

    if (lightBeamsRef.current) {
      lightBeamsRef.current.rotation.y -= delta * 0.08 * speed;
    }
  });

  return (
    <group position={[0, -2.1, 0]}>
      {/* 1. Large Ground Ritual Disc (XZ Plane) */}
      <group ref={pedestalRef} rotation={[Math.PI / 2, 0, 0]}>
        <mesh scale={[5.8, 5.8, 1]}>
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
      {[0.2, 0.42, 0.68].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.2 - idx * 0.45, 0.016, 6, 96]} />
          <meshBasicMaterial
            blending={THREE.AdditiveBlending}
            color={idx === 0 ? GOLD_MYSTIC : EMERALD}
            depthWrite={false}
            opacity={0.45 - idx * 0.08}
            toneMapped={false}
            transparent
          />
        </mesh>
      ))}

      {/* 3. Vertical Light Beam Pillar Ascending to Core */}
      <group ref={lightBeamsRef}>
        <mesh position={[0, 1.05, 0]}>
          <cylinderGeometry args={[0.08, 0.45, 2.1, 16, 1, true]} />
          <meshBasicMaterial
            blending={THREE.AdditiveBlending}
            color={EMERALD}
            depthWrite={false}
            opacity={0.12}
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
// COMPONENT 7: TIMELINE ENERGY SPLINES & TIME PACKETS
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
        const r = 0.35 + t * (2.4 + rng() * 0.4);
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
          dummy.scale.setScalar(0.038 + Math.sin(progress * Math.PI) * 0.018);
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
            color={idx % 2 === 0 ? LIME : GOLD_MYSTIC}
            depthWrite={false}
            opacity={0.34}
            toneMapped={false}
            transparent
          />
        </mesh>
      ))}

      {/* Streaming Energy Photons */}
      <instancedMesh ref={packetsRef} args={[undefined, undefined, packetCount]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color={WHITE_HOT} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════
// COMPONENT 8: ATMOSPHERIC MYSTIC EMBERS & SPARKS (420 PARTICLES)
// ══════════════════════════════════════════════════════════════════
function MysticEmberSparks({ activity }: { activity: AiActivity }) {
  const count = 420;
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => new Float32Array(count * 3), []);

  const params = useMemo(() => {
    const rng = seededRandom(20261);
    return Array.from({ length: count }, () => ({
      radius: 0.5 + rng() * 3.4,
      angle: rng() * TAU,
      y: (rng() - 0.5) * 4.2,
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
        color={LIME}
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

// ══════════════════════════════════════════════════════════════════
// COMPONENT 9: TEMPORAL DISTORTION SHOCKWAVE DISC
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
    <mesh position={[0, 0, -0.05]} scale={[5.2, 5.2, 1]}>
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
    <group name="green-mystic-core-doctor-strange-scene" scale={1.18}>
      {/* 1. Atmospheric Ambient & Mystic Point Lighting */}
      <ambientLight intensity={0.45} color={DEEP_EMERALD} />
      <directionalLight position={[4, 5, 4]} intensity={1.8} color={LIME} />
      <pointLight position={[-3, 2, 3]} color={EMERALD} intensity={2.2} distance={12} />
      <pointLight position={[3, -2, -2]} color={GOLD_MYSTIC} intensity={1.5} distance={10} />

      {/* 2. Temporal Distortion Shockwaves (Deep background layer) */}
      <TimeDistortionShockwaves activity={activity} />

      {/* 3. Base Pedestal Ritual Floor Mandala & Vertical Light Pillar */}
      <BasePedestalRitualMandala activity={activity} />

      {/* 4. Main 3D Tilted Eldritch Spell Disc (Doctor Strange Mandala) */}
      <MainEldritchSpellDisc activity={activity} />

      {/* 5. Auxiliary Gimbal Gyroscope Rings (Multi-axis 3D sorcery) */}
      <AuxiliaryGimbalRings activity={activity} />

      {/* 6. Timeline Energy Ribbon Streams & Photons */}
      <TimelineEnergyStreams activity={activity} />

      {/* 7. 8 Floating Satellite Sigil Dials & Laser Connectors */}
      <FloatingSigilOrbits activity={activity} />

      {/* 8. Central Raw Time Stone Crystal Core & Satellite Shards */}
      <FacetedTimeStoneGem activity={activity} />

      {/* 9. Atmospheric Floating Mystic Embers & Sparks */}
      <MysticEmberSparks activity={activity} />
    </group>
  );
}
