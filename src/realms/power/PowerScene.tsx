import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AiActivity } from "../../App";
import { activityEnergy, activityPulse, activitySpeed, seededRandom } from "../shared/coreMotion";

// --- Xandarian Power Core Palette ---
const VIOLET_DEEP = "#7000cc";
const VIOLET = "#8b3dff";
const ORCHID = "#df80ff";
const ICE = "#eef1ff";

// --- Reusable 3D Simplex Noise GLSL ---
const simplexNoise3D = `
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`;

// =====================================================================
// GLSL SHADERS
// =====================================================================

// --- Crystal Core: Faceted Plasma Diamond ---
const crystalVertexShader = `
  uniform float uTime;
  uniform float uEnergy;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;

  ${simplexNoise3D}

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;

    // Subtle crystalline surface ripple
    float noise1 = snoise(position * 1.8 + vec3(0.0, uTime * 0.35, uTime * 0.25));
    float noise2 = snoise(position * 3.8 - vec3(uTime * 0.25, 0.0, uTime * 0.4));
    float displacement = (noise1 * 0.04 + noise2 * 0.02) * (0.5 + uEnergy * 0.5);

    vec3 newPos = position + normal * displacement;
    vWorldPosition = (modelMatrix * vec4(newPos, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
`;

const crystalFragmentShader = `
  uniform float uTime;
  uniform float uEnergy;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;

  ${simplexNoise3D}

  void main() {
    // Internal flowing plasma currents — multiple octaves
    float plasma1 = snoise(vPosition * 2.5 + vec3(uTime * 0.5, uTime * 0.35, -uTime * 0.25));
    float plasma2 = snoise(vPosition * 5.0 - vec3(uTime * 0.4, -uTime * 0.6, uTime * 0.15));
    float plasma3 = snoise(vPosition * 8.0 + vec3(-uTime * 0.3, uTime * 0.2, uTime * 0.45));
    float plasma = (plasma1 * 0.5 + plasma2 * 0.3 + plasma3 * 0.2) * 0.5 + 0.5;

    // Sharp crystalline facet edge highlighting
    float edgeFactor = pow(abs(dot(vNormal, vec3(0.577, 0.577, 0.577))), 0.8);

    // Energy veins branching through crystal lattice
    float vein = pow(abs(sin(vPosition.y * 18.0 + sin(vPosition.x * 16.0 + uTime * 2.8))), 12.0);
    float vein2 = pow(abs(sin(vPosition.x * 14.0 + sin(vPosition.z * 12.0 - uTime * 1.8))), 10.0);

    // Fresnel edge illumination — hot white rim
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.2);

    // Intense center glow based on Y proximity to equator
    float centerGlow = exp(-abs(vPosition.y) * 1.8) * 0.5;

    // Color mixing
    vec3 colDeep   = vec3(0.35, 0.0, 0.65);  // deep purple interior
    vec3 colViolet = vec3(0.545, 0.239, 1.0); // #8b3dff
    vec3 colOrchid = vec3(0.875, 0.502, 1.0); // #df80ff
    vec3 colIce    = vec3(0.933, 0.945, 1.0); // #eef1ff

    vec3 baseColor = mix(colDeep, colViolet, plasma * 0.75 + 0.25);
    baseColor = mix(baseColor, colOrchid, fresnel * 0.65 + (vein + vein2) * 0.45 + centerGlow);
    baseColor = mix(baseColor, colIce, fresnel * fresnel * 0.7 + (vein + vein2) * 0.25 + centerGlow * 0.6);

    // Edge facet shimmer
    baseColor += colOrchid * edgeFactor * 0.15;

    float alpha = (0.35 + fresnel * 0.65 + (vein + vein2) * 0.3 + plasma * 0.1 + centerGlow * 0.4) * uEnergy;
    gl_FragColor = vec4(baseColor * (1.4 + uEnergy * 0.8), alpha);
  }
`;

// --- Equatorial Data Band: Wide ring with scrolling runic inscriptions ---
const dataBandVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const dataBandFragmentShader = `
  uniform float uTime;
  uniform float uEnergy;
  uniform float uScrollSpeed;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  float hash(float n) { return fract(sin(n) * 43758.5453); }

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - abs(dot(viewDir, normalize(vNormal))), 1.6);

    // Scrolling runic text blocks along the band
    float scroll = uTime * uScrollSpeed;
    float bandCoord = vUv.x * 60.0 + scroll;

    // Runic glyph blocks — varying density
    float glyphCell = floor(bandCoord);
    float glyphFrac = fract(bandCoord);
    float glyphOn = step(0.65, hash(glyphCell * 1.731 + floor(vUv.y * 4.0) * 0.317));

    // Glyph internal pattern — vertical bars within each cell
    float bars = step(0.7, sin(glyphFrac * 12.566));
    float glyph = glyphOn * (0.5 + bars * 0.4);

    // Scan line pulse sweeping around the ring
    float scanPulse = smoothstep(0.92, 1.0, sin(bandCoord * 0.15 + uTime * 3.0) * 0.5 + 0.5) * 0.6;

    // Edge glow of the band (top and bottom edges)
    float edgeDist = abs(vUv.y - 0.5) * 2.0;
    float edgeGlow = smoothstep(1.0, 0.6, edgeDist) * 0.3;
    float edgeLine = smoothstep(0.02, 0.0, abs(edgeDist - 0.92)) * 0.8;

    vec3 colViolet = vec3(0.545, 0.239, 1.0);
    vec3 colOrchid = vec3(0.875, 0.502, 1.0);
    vec3 colIce    = vec3(0.933, 0.945, 1.0);

    vec3 color = mix(colViolet, colOrchid, glyph * 0.6 + fresnel * 0.4);
    color = mix(color, colIce, scanPulse + edgeLine + fresnel * fresnel * 0.4);

    float alpha = (glyph * 0.4 + fresnel * 0.35 + scanPulse * 0.3 + edgeGlow + edgeLine + 0.05) * uEnergy;
    gl_FragColor = vec4(color * (1.8 + uEnergy * 0.4), alpha);
  }
`;

// --- Base Platform: Concentric ripple disc ---
const baseVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const baseFragmentShader = `
  uniform float uTime;
  uniform float uEnergy;
  varying vec2 vUv;

  void main() {
    vec2 center = vUv - vec2(0.5);
    float dist = length(center);
    float angle = atan(center.y, center.x);

    // Multiple concentric energy ripples at different speeds
    float ripple1 = smoothstep(0.012, 0.0, abs(fract(dist * 10.0 - uTime * 0.35) - 0.5) - 0.47);
    float ripple2 = smoothstep(0.015, 0.0, abs(fract(dist * 6.5 + uTime * 0.2) - 0.5) - 0.46);
    float ripple3 = smoothstep(0.01,  0.0, abs(fract(dist * 14.0 - uTime * 0.5) - 0.5) - 0.48);

    // Radial energy spokes
    float radial = smoothstep(0.015, 0.0, abs(fract(angle / 6.2832 * 32.0) - 0.5) - 0.47);

    // Strong central glow
    float glow = exp(-dist * 5.0) * 0.7;
    float outerFade = smoothstep(0.5, 0.25, dist);

    // Fixed concentric ring lines (structural rings)
    float ring1 = smoothstep(0.008, 0.0, abs(dist - 0.15)) * 0.5;
    float ring2 = smoothstep(0.008, 0.0, abs(dist - 0.28)) * 0.4;
    float ring3 = smoothstep(0.006, 0.0, abs(dist - 0.38)) * 0.35;
    float ring4 = smoothstep(0.005, 0.0, abs(dist - 0.46)) * 0.3;

    vec3 colDeep   = vec3(0.35, 0.0, 0.65);
    vec3 colViolet = vec3(0.545, 0.239, 1.0);
    vec3 colOrchid = vec3(0.875, 0.502, 1.0);

    vec3 color = mix(colDeep, colViolet, ripple1 + ripple2 + ring1 + ring2);
    color = mix(color, colOrchid, glow * 0.6 + radial * 0.25 + ring3 + ring4 + ripple3);

    float alpha = (ripple1 * 0.4 + ripple2 * 0.25 + ripple3 * 0.2
                 + radial * 0.15 * outerFade + glow * 0.5
                 + ring1 + ring2 + ring3 + ring4) * uEnergy;
    gl_FragColor = vec4(color * 2.2, alpha);
  }
`;

// --- Vertical Energy Column shader ---
const columnFragmentShader = `
  uniform float uTime;
  uniform float uEnergy;
  varying vec2 vUv;

  void main() {
    float centerDist = abs(vUv.x - 0.5) * 2.0;

    // Layered beam intensity
    float outerBeam = smoothstep(1.0, 0.0, centerDist) * 0.4;
    float midBeam = smoothstep(0.5, 0.0, centerDist) * 0.5;
    float coreBeam = smoothstep(0.15, 0.0, centerDist) * 0.9;

    // Energy waves traveling along the column
    float wave = smoothstep(0.85, 1.0, sin(vUv.y * 40.0 - uTime * 8.0) * 0.5 + 0.5) * 0.35;
    float wave2 = smoothstep(0.9, 1.0, sin(vUv.y * 25.0 + uTime * 5.0) * 0.5 + 0.5) * 0.2;

    // Fade toward the far tip
    float tipFade = smoothstep(1.0, 0.15, vUv.y);
    // Stronger at base (near crystal)
    float baseBright = smoothstep(0.3, 0.0, vUv.y) * 0.3;

    vec3 colOrchid = vec3(0.875, 0.502, 1.0);
    vec3 colIce    = vec3(0.933, 0.945, 1.0);

    vec3 color = mix(colOrchid, colIce, coreBeam + wave + baseBright);

    float alpha = (outerBeam + midBeam + coreBeam + wave + wave2 + baseBright) * tipFade * uEnergy;
    gl_FragColor = vec4(color * 2.5, alpha);
  }
`;

// =====================================================================
// COMPONENTS
// =====================================================================

// 1. Xandarian Crystal Core — Tall narrow double-pyramid with plasma interior
function XandarianCrystalCore({ activity }: { activity: AiActivity }) {
  const coreRef = useRef<THREE.Group>(null);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);
    const energy = activityEnergy(activity);

    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.15 * speed;
      coreRef.current.scale.setScalar(activityPulse(activity, time, 1.2));
    }

    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = time;
      shaderRef.current.uniforms.uEnergy.value = energy;
    }
  });

  return (
    <group ref={coreRef}>
      {/* Outer Crystal Shell — very tall narrow octahedron (1:3 ratio like reference) */}
      <mesh scale={[0.55, 1.8, 0.55]}>
        <octahedronGeometry args={[1, 4]} />
        <shaderMaterial
          ref={shaderRef}
          vertexShader={crystalVertexShader}
          fragmentShader={crystalFragmentShader}
          uniforms={{ uTime: { value: 0 }, uEnergy: { value: 1 } }}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>

      {/* Inner faceted core — secondary smaller crystal for depth layering */}
      <mesh scale={[0.3, 1.1, 0.3]}>
        <octahedronGeometry args={[1, 2]} />
        <meshBasicMaterial
          color="#b84dff"
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.45}
          toneMapped={false}
          transparent
        />
      </mesh>

      {/* Bright center equator point — the white-hot nucleus */}
      <mesh scale={[0.18, 0.18, 0.18]}>
        <icosahedronGeometry args={[1, 3]} />
        <meshBasicMaterial
          color={ICE}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.85}
          toneMapped={false}
          transparent
        />
      </mesh>

      {/* Core Point Lights — intense violet + white-hot accent */}
      <pointLight color="#c44dff" intensity={6.0} distance={10} decay={2} />
      <pointLight color={ICE} intensity={2.0} distance={4} decay={2} />
    </group>
  );
}

// 2. Equatorial Data Bands — Wide flat rings around the crystal waist (Saturn-style)
function EquatorialDataBands({ activity }: { activity: AiActivity }) {
  const groupRef = useRef<THREE.Group>(null);
  const materialsRef = useRef<THREE.ShaderMaterial[]>([]);

  // Bands at different heights & tilts matching reference images
  const bandConfigs = useMemo(
    () => [
      // Main equatorial band — widest, at center
      { innerR: 0.75, outerR: 1.15, y: 0, tiltX: 0.08, tiltZ: 0.03, speed: 0.7, scrollSpeed: 0.8 },
      // Upper band — slightly narrower, tilted
      { innerR: 0.85, outerR: 1.12, y: 0.32, tiltX: -0.12, tiltZ: 0.06, speed: -0.55, scrollSpeed: -1.0 },
      // Lower band — complementary
      { innerR: 0.8, outerR: 1.08, y: -0.28, tiltX: 0.1, tiltZ: -0.05, speed: 0.45, scrollSpeed: 0.6 },
      // Wider outer equatorial ring — thin accent
      { innerR: 1.25, outerR: 1.38, y: 0.05, tiltX: 0.05, tiltZ: -0.04, speed: -0.35, scrollSpeed: 1.2 },
    ],
    [],
  );

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);
    const energy = activityEnergy(activity);

    groupRef.current.children.forEach((band, i) => {
      const config = bandConfigs[i];
      if (!config) return;
      band.rotation.y += delta * config.speed * speed * 0.15;

      const mat = materialsRef.current[i];
      if (mat) {
        mat.uniforms.uTime.value = time;
        mat.uniforms.uEnergy.value = energy;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {bandConfigs.map((config, i) => (
        <mesh
          key={i}
          position={[0, config.y, 0]}
          rotation={[Math.PI * 0.5 + config.tiltX, 0, config.tiltZ]}
        >
          <ringGeometry args={[config.innerR, config.outerR, 128, 1]} />
          <shaderMaterial
            ref={(el) => {
              if (el) materialsRef.current[i] = el;
            }}
            vertexShader={dataBandVertexShader}
            fragmentShader={dataBandFragmentShader}
            uniforms={{
              uTime: { value: 0 },
              uEnergy: { value: 1 },
              uScrollSpeed: { value: config.scrollSpeed },
            }}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

// 3. Orbital Holographic Rings — Tilted torus rings at wider orbits (outer framework)
function OrbitalHolographicRings({ activity }: { activity: AiActivity }) {
  const groupRef = useRef<THREE.Group>(null);

  const ringConfigs = useMemo(
    () => [
      { radius: 1.7, tube: 0.012, tilt: [0.6, 0.15, 0.25] as const, speed: 0.22 },
      { radius: 2.0, tube: 0.01, tilt: [1.1, -0.2, -0.15] as const, speed: -0.18 },
      { radius: 2.3, tube: 0.008, tilt: [0.25, 0.4, 0.55] as const, speed: 0.14 },
    ],
    [],
  );

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const speed = activitySpeed(activity);

    groupRef.current.children.forEach((ring, i) => {
      const config = ringConfigs[i];
      if (!config) return;
      ring.rotation.z += delta * config.speed * speed;
      ring.rotation.x += delta * config.speed * speed * 0.3;
    });
  });

  return (
    <group ref={groupRef}>
      {ringConfigs.map((config, i) => (
        <mesh key={i} rotation={[config.tilt[0], config.tilt[1], config.tilt[2]]}>
          <torusGeometry args={[config.radius, config.tube, 12, 160]} />
          <meshBasicMaterial
            color={i === 0 ? ORCHID : VIOLET}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            opacity={0.3 - i * 0.06}
            toneMapped={false}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

// 4. Energy Base Platform — Multi-layer concentric platform
function EnergyBasePlatform({ activity }: { activity: AiActivity }) {
  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = time;
      shaderRef.current.uniforms.uEnergy.value = activityEnergy(activity);
    }
    if (groupRef.current) {
      groupRef.current.rotation.z += 0.001 * activitySpeed(activity);
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.95, 0]} rotation={[-Math.PI * 0.5, 0, 0]}>
      {/* Main concentric ripple disc */}
      <mesh>
        <circleGeometry args={[3.0, 160]} />
        <shaderMaterial
          ref={shaderRef}
          vertexShader={baseVertexShader}
          fragmentShader={baseFragmentShader}
          uniforms={{ uTime: { value: 0 }, uEnergy: { value: 1 } }}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>

      {/* Structural accent rings */}
      {[3.1, 3.25, 3.4, 3.6].map((r, i) => (
        <mesh key={i}>
          <ringGeometry args={[r, r + 0.04 - i * 0.005, 128, 1]} />
          <meshBasicMaterial
            color={i < 2 ? VIOLET : ORCHID}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            opacity={0.28 - i * 0.05}
            toneMapped={false}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

// 5. Vertical Energy Columns — Prominent tip-emission beams
function VerticalEnergyColumns({ activity }: { activity: AiActivity }) {
  const topRef = useRef<THREE.ShaderMaterial>(null);
  const botRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    const energy = activityEnergy(activity);

    if (topRef.current) {
      topRef.current.uniforms.uTime.value = time;
      topRef.current.uniforms.uEnergy.value = energy;
    }
    if (botRef.current) {
      botRef.current.uniforms.uTime.value = time;
      botRef.current.uniforms.uEnergy.value = energy;
    }
    if (groupRef.current) {
      const pulse = 0.8 + energy * 0.3 + Math.sin(time * 4.5) * 0.06;
      groupRef.current.scale.set(1, pulse, 1);
    }
  });

  const simpleVert = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;

  return (
    <group ref={groupRef}>
      {/* North beam — shader plane */}
      <mesh position={[0, 3.8, 0]} scale={[0.5, 5.5, 0.5]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          ref={topRef}
          vertexShader={simpleVert}
          fragmentShader={columnFragmentShader}
          uniforms={{ uTime: { value: 0 }, uEnergy: { value: 1 } }}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>

      {/* South beam — shader plane */}
      <mesh position={[0, -3.8, 0]} rotation={[0, 0, Math.PI]} scale={[0.5, 5.5, 0.5]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          ref={botRef}
          vertexShader={simpleVert}
          fragmentShader={columnFragmentShader}
          uniforms={{ uTime: { value: 0 }, uEnergy: { value: 1 } }}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>

      {/* North cone glow */}
      <mesh position={[0, 2.5, 0]}>
        <coneGeometry args={[0.12, 4.0, 16, 1, true]} />
        <meshBasicMaterial
          color={ICE}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.2}
          side={THREE.DoubleSide}
          toneMapped={false}
          transparent
        />
      </mesh>

      {/* South cone glow */}
      <mesh position={[0, -2.5, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.12, 4.0, 16, 1, true]} />
        <meshBasicMaterial
          color={ORCHID}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.15}
          side={THREE.DoubleSide}
          toneMapped={false}
          transparent
        />
      </mesh>

      {/* Cross beam for volumetric depth (rotated 90°) */}
      <mesh position={[0, 3.8, 0]} rotation={[0, Math.PI * 0.5, 0]} scale={[0.5, 5.5, 0.5]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          vertexShader={simpleVert}
          fragmentShader={columnFragmentShader}
          uniforms={{ uTime: { value: 0 }, uEnergy: { value: 1 } }}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>
      <mesh position={[0, -3.8, 0]} rotation={[0, Math.PI * 0.5, Math.PI]} scale={[0.5, 5.5, 0.5]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          vertexShader={simpleVert}
          fragmentShader={columnFragmentShader}
          uniforms={{ uTime: { value: 0 }, uEnergy: { value: 1 } }}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>
    </group>
  );
}

// 6. Crystalline Armor Plates — Larger diamond plates orbiting (not tiny shards)
function CrystallineArmorPlates({ activity }: { activity: AiActivity }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const plateCount = 16;

  const plates = useMemo(() => {
    const random = seededRandom(4411);
    return Array.from({ length: plateCount }, (_, i) => {
      const angle = (i / plateCount) * Math.PI * 2 + random() * 0.2;
      const tier = i % 3; // 0=equatorial, 1=upper, 2=lower
      const yBase = tier === 0 ? (random() - 0.5) * 0.6 : tier === 1 ? 0.5 + random() * 0.7 : -0.5 - random() * 0.7;
      return {
        angle,
        radius: 1.5 + random() * 0.5,
        y: yBase,
        sizeX: 0.12 + random() * 0.08,
        sizeY: 0.25 + random() * 0.2,
        sizeZ: 0.03 + random() * 0.02,
        phase: random() * Math.PI * 2,
        orbitSpeed: 0.08 + random() * 0.12,
      };
    });
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);
    const collapseFactor =
      activity === "thinking" ? 0.5 + Math.pow(Math.abs(Math.sin(time * 0.7)), 4) * 0.3 : 1.0;

    plates.forEach((plate, i) => {
      const currentAngle = plate.angle + time * plate.orbitSpeed * speed;
      const radius = plate.radius * collapseFactor;
      const hover = Math.sin(time * 0.9 + plate.phase) * 0.1;

      dummy.position.set(
        Math.cos(currentAngle) * radius,
        plate.y + hover,
        Math.sin(currentAngle) * radius,
      );
      // Face outward from center + slow tumble
      dummy.rotation.set(
        time * 0.2 + plate.phase,
        -currentAngle + Math.PI * 0.5,
        time * 0.15 + plate.phase * 0.5,
      );
      dummy.scale.set(plate.sizeX, plate.sizeY, plate.sizeZ);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, plateCount]}>
      <octahedronGeometry args={[1, 0]} />
      <meshPhysicalMaterial
        color="#5a18b0"
        emissive={VIOLET}
        emissiveIntensity={1.4}
        metalness={0.15}
        roughness={0.06}
        transmission={0.45}
        transparent
        opacity={0.78}
      />
    </instancedMesh>
  );
}

// 7. Power Field Particles — Dense orbital dust swarm
function PowerFieldParticles({ activity }: { activity: AiActivity }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 1000;

  const { positions, speeds, phases } = useMemo(() => {
    const random = seededRandom(7733);
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const phs = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 0.6 + random() * 3.0;
      const angle = random() * Math.PI * 2;
      const y = (random() - 0.5) * 3.8;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      spd[i] = 0.15 + random() * 0.5;
      phs[i] = random() * Math.PI * 2;
    }
    return { positions: pos, speeds: spd, phases: phs };
  }, []);

  useFrame(({ clock }, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);

    for (let i = 0; i < count; i++) {
      const x = arr[i * 3];
      const z = arr[i * 3 + 2];
      const radius = Math.sqrt(x * x + z * z);
      const currentAngle = Math.atan2(z, x);
      const orbitalSpeed = speeds[i] * speed * (0.35 / (radius + 0.35));
      const newAngle = currentAngle + orbitalSpeed * delta;

      arr[i * 3] = Math.cos(newAngle) * radius;
      arr[i * 3 + 1] += Math.sin(time * 1.5 + phases[i]) * 0.001;
      arr[i * 3 + 2] = Math.sin(newAngle) * radius;

      if (arr[i * 3 + 1] > 2.2) arr[i * 3 + 1] = -2.2;
      if (arr[i * 3 + 1] < -2.2) arr[i * 3 + 1] = 2.2;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={ORCHID}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        opacity={0.5}
        size={0.02}
        sizeAttenuation
        toneMapped={false}
        transparent
      />
    </points>
  );
}

// 8. Rising Energy Stream — Particles ascending from base toward crystal
function RisingEnergyStream({ activity }: { activity: AiActivity }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 400;

  const { positions, speeds, radii } = useMemo(() => {
    const random = seededRandom(9911);
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const rad = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = random() * Math.PI * 2;
      const r = 0.2 + random() * 1.8;

      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = -2.0 + random() * 4.0; // Start from base, rise up
      pos[i * 3 + 2] = Math.sin(angle) * r;

      spd[i] = 0.4 + random() * 0.8;
      rad[i] = r;
    }
    return { positions: pos, speeds: spd, radii: rad };
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const speed = activitySpeed(activity);

    for (let i = 0; i < count; i++) {
      // Rise upward
      arr[i * 3 + 1] += speeds[i] * delta * speed;

      // Spiral inward as they rise
      const x = arr[i * 3];
      const z = arr[i * 3 + 2];
      const angle = Math.atan2(z, x) + delta * 0.5;
      const r = Math.max(0.05, radii[i] * (1.0 - (arr[i * 3 + 1] + 2.0) / 4.0 * 0.6));
      arr[i * 3] = Math.cos(angle) * r;
      arr[i * 3 + 2] = Math.sin(angle) * r;

      // Wrap back to bottom
      if (arr[i * 3 + 1] > 2.0) {
        arr[i * 3 + 1] = -2.0;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={ICE}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        opacity={0.4}
        size={0.015}
        sizeAttenuation
        toneMapped={false}
        transparent
      />
    </points>
  );
}

// =====================================================================
// MAIN POWER SCENE — Xandarian Crystal Power Core
// =====================================================================
export function PowerScene({ activity = "idle" }: { activity?: AiActivity }) {
  return (
    <group name="xandarian-crystal-power-core" scale={1.2}>
      <ambientLight intensity={0.4} color={VIOLET_DEEP} />

      {/* 1. Multi-layer Concentric Base Platform */}
      <EnergyBasePlatform activity={activity} />

      {/* 2. Rising Energy Stream from base to crystal */}
      <RisingEnergyStream activity={activity} />

      {/* 3. Orbital Dust Particle Field */}
      <PowerFieldParticles activity={activity} />

      {/* 4. Crystalline Armor Plates */}
      <CrystallineArmorPlates activity={activity} />

      {/* 5. Outer Orbital Holographic Rings */}
      <OrbitalHolographicRings activity={activity} />

      {/* 6. Vertical Energy Columns (prominent tip beams) */}
      <VerticalEnergyColumns activity={activity} />

      {/* 7. Equatorial Data Band Rings (Saturn-style) */}
      <EquatorialDataBands activity={activity} />

      {/* 8. Xandarian Crystal Diamond Core */}
      <XandarianCrystalCore activity={activity} />
    </group>
  );
}
