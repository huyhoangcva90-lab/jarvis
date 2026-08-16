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

// --- Crystal Core: Procedural Plasma Diamond ---
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

    // Organic crystal surface micro-displacement
    float noise1 = snoise(position * 2.0 + vec3(0.0, uTime * 0.4, uTime * 0.3));
    float noise2 = snoise(position * 4.5 - vec3(uTime * 0.3, 0.0, uTime * 0.5));
    float displacement = (noise1 * 0.06 + noise2 * 0.03) * (0.6 + uEnergy * 0.4);

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
    // Internal flowing plasma currents
    float plasma1 = snoise(vPosition * 3.0 + vec3(uTime * 0.6, uTime * 0.4, -uTime * 0.3));
    float plasma2 = snoise(vPosition * 5.5 - vec3(uTime * 0.5, -uTime * 0.7, uTime * 0.2));
    float plasma = (plasma1 * 0.6 + plasma2 * 0.4) * 0.5 + 0.5;

    // Energy veins pulsing through crystal lattice
    float vein = pow(abs(sin(vPosition.y * 16.0 + sin(vPosition.x * 14.0 + uTime * 2.5))), 10.0);

    // Fresnel edge illumination — extremely bright rim
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.6);

    // Color mixing
    vec3 colDeep   = vec3(0.44, 0.0, 0.8);   // #7000cc
    vec3 colViolet = vec3(0.545, 0.239, 1.0); // #8b3dff
    vec3 colOrchid = vec3(0.875, 0.502, 1.0); // #df80ff
    vec3 colIce    = vec3(0.933, 0.945, 1.0); // #eef1ff

    vec3 baseColor = mix(colDeep, colViolet, plasma * 0.8 + 0.2);
    baseColor = mix(baseColor, colOrchid, fresnel * 0.7 + vein * 0.6);
    baseColor = mix(baseColor, colIce, fresnel * fresnel * 0.65 + vein * 0.35);

    float alpha = (0.4 + fresnel * 0.6 + vein * 0.35 + plasma * 0.12) * uEnergy;
    gl_FragColor = vec4(baseColor * (1.3 + uEnergy * 0.7), alpha);
  }
`;

// --- Holographic Ring: Scrolling Runic Data Band ---
const ringVertexShader = `
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

const ringFragmentShader = `
  uniform float uTime;
  uniform float uEnergy;
  uniform float uOffset;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  float hash(float n) { return fract(sin(n) * 43758.5453); }

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - abs(dot(viewDir, normalize(vNormal))), 1.8);

    // Scrolling runic data band pattern
    float scroll = uTime * 0.9 + uOffset;
    float band = vUv.x * 48.0 + scroll;
    float runic = step(0.72, hash(floor(band) + floor(vUv.y * 3.0))) * 0.55;
    float scanLine = smoothstep(0.88, 1.0, sin(band * 3.14159) * 0.5 + 0.5) * 0.35;

    // Segment pulse gates
    float segment = smoothstep(0.02, 0.0, abs(fract(vUv.x * 14.0 + scroll * 0.3) - 0.5) - 0.42);

    vec3 colViolet = vec3(0.545, 0.239, 1.0);
    vec3 colOrchid = vec3(0.875, 0.502, 1.0);
    vec3 colIce    = vec3(0.933, 0.945, 1.0);

    vec3 color = mix(colViolet, colOrchid, fresnel * 0.55 + runic);
    color = mix(color, colIce, scanLine + fresnel * fresnel * 0.5);

    float alpha = (fresnel * 0.45 + runic * 0.35 + scanLine * 0.2 + segment * 0.12 + 0.06) * uEnergy;
    gl_FragColor = vec4(color * (1.6 + uEnergy * 0.4), alpha);
  }
`;

// --- Energy Base Platform: Concentric Ripple Disc ---
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

    // Expanding concentric energy ripples
    float ripple1 = smoothstep(0.015, 0.0, abs(fract(dist * 8.0 - uTime * 0.4) - 0.5) - 0.47);
    float ripple2 = smoothstep(0.02,  0.0, abs(fract(dist * 5.0 + uTime * 0.25) - 0.5) - 0.46);

    // Radial energy spoke lines
    float radial = smoothstep(0.018, 0.0, abs(fract(angle / 6.2832 * 24.0) - 0.5) - 0.47);

    // Central glow falloff
    float glow = smoothstep(0.5, 0.04, dist);
    float outerFade = smoothstep(0.5, 0.32, dist);

    vec3 colDeep   = vec3(0.42, 0.0, 0.7);
    vec3 colViolet = vec3(0.545, 0.239, 1.0);
    vec3 colOrchid = vec3(0.875, 0.502, 1.0);

    vec3 color = mix(colDeep, colViolet, ripple1 + ripple2);
    color = mix(color, colOrchid, glow * 0.5 + radial * 0.3);

    float alpha = (ripple1 * 0.5 + ripple2 * 0.3 + radial * 0.18 * outerFade + glow * 0.4) * uEnergy;
    gl_FragColor = vec4(color * 2.0, alpha);
  }
`;

// --- Vertical Energy Column: Tip-emission beam shader ---
const columnFragmentShader = `
  uniform float uTime;
  uniform float uEnergy;
  varying vec2 vUv;

  void main() {
    float centerDist = abs(vUv.x - 0.5) * 2.0;

    // Core beam intensity (brightest at center)
    float beam = smoothstep(1.0, 0.0, centerDist) * 0.6;
    float coreBeam = smoothstep(0.25, 0.0, centerDist) * 0.8;

    // Pulsing energy waves along the column
    float wave = smoothstep(0.8, 1.0, sin(vUv.y * 30.0 - uTime * 6.0) * 0.5 + 0.5) * 0.3;

    // Fade out toward the far tip
    float tipFade = smoothstep(1.0, 0.2, vUv.y);

    vec3 colOrchid = vec3(0.875, 0.502, 1.0);
    vec3 colIce    = vec3(0.933, 0.945, 1.0);

    vec3 color = mix(colOrchid, colIce, coreBeam + wave);

    float alpha = (beam + coreBeam + wave) * tipFade * uEnergy;
    gl_FragColor = vec4(color * 2.2, alpha);
  }
`;

// =====================================================================
// COMPONENTS
// =====================================================================

// 1. Xandarian Crystal Core — Double Octahedron with Internal Plasma
function XandarianCrystalCore({ activity }: { activity: AiActivity }) {
  const coreRef = useRef<THREE.Group>(null);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);
    const energy = activityEnergy(activity);

    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.18 * speed;
      coreRef.current.rotation.z = Math.sin(time * 0.15) * 0.05;
      coreRef.current.scale.setScalar(activityPulse(activity, time, 1.2));
    }

    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = time;
      shaderRef.current.uniforms.uEnergy.value = energy;
    }
  });

  return (
    <group ref={coreRef}>
      {/* Outer Crystal Diamond Shell — tall elongated octahedron */}
      <mesh scale={[0.72, 1.55, 0.72]}>
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

      {/* Inner Solid Core Glow — white-hot energy nucleus */}
      <mesh scale={[0.32, 0.62, 0.32]}>
        <octahedronGeometry args={[1, 2]} />
        <meshBasicMaterial
          color="#c44dff"
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.6}
          toneMapped={false}
          transparent
        />
      </mesh>

      {/* Core Point Lights — intense violet + white accent */}
      <pointLight color="#c44dff" intensity={5.0} distance={8} decay={2} />
      <pointLight color={ICE} intensity={1.5} distance={3.5} decay={2} />
    </group>
  );
}

// 2. Holographic Orbital Rings — 3 Tilted Torus Data Bands
function HolographicOrbitalRings({ activity }: { activity: AiActivity }) {
  const ringsRef = useRef<THREE.Group>(null);
  const materialsRef = useRef<THREE.ShaderMaterial[]>([]);

  const ringConfigs = useMemo(
    () => [
      { radius: 1.55, tube: 0.032, tilt: [Math.PI * 0.5, 0.18, 0.12] as [number, number, number], speed: 0.32, offset: 0 },
      { radius: 1.9, tube: 0.025, tilt: [0.35, Math.PI * 0.38, -0.08] as [number, number, number], speed: -0.25, offset: 2.09 },
      { radius: 2.25, tube: 0.02, tilt: [0.75, -0.12, Math.PI * 0.44] as [number, number, number], speed: 0.2, offset: 4.19 },
    ],
    [],
  );

  useFrame(({ clock }, delta) => {
    if (!ringsRef.current) return;
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);
    const energy = activityEnergy(activity);

    ringsRef.current.children.forEach((ring, i) => {
      const config = ringConfigs[i];
      if (!config) return;
      ring.rotation.z += delta * config.speed * speed;
      ring.scale.setScalar(activityPulse(activity, time, i * 1.5));

      const mat = materialsRef.current[i];
      if (mat) {
        mat.uniforms.uTime.value = time;
        mat.uniforms.uEnergy.value = energy;
      }
    });
  });

  return (
    <group ref={ringsRef}>
      {ringConfigs.map((config, i) => (
        <mesh key={i} rotation={config.tilt}>
          <torusGeometry args={[config.radius, config.tube, 16, 128]} />
          <shaderMaterial
            ref={(el) => {
              if (el) materialsRef.current[i] = el;
            }}
            vertexShader={ringVertexShader}
            fragmentShader={ringFragmentShader}
            uniforms={{
              uTime: { value: 0 },
              uEnergy: { value: 1 },
              uOffset: { value: config.offset },
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

// 3. Energy Base Platform — Concentric Rings with Ripple Glow
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
      groupRef.current.rotation.z += 0.002 * activitySpeed(activity);
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.6, 0]} rotation={[-Math.PI * 0.5, 0, 0]}>
      {/* Main Concentric Ripple Disc */}
      <mesh>
        <circleGeometry args={[2.8, 128]} />
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

      {/* Outer Accent Ring */}
      <mesh>
        <ringGeometry args={[2.9, 3.05, 128, 1]} />
        <meshBasicMaterial
          color={VIOLET}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.3}
          toneMapped={false}
          transparent
        />
      </mesh>

      {/* Secondary Outer Ring */}
      <mesh>
        <ringGeometry args={[3.15, 3.22, 128, 1]} />
        <meshBasicMaterial
          color={ORCHID}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.18}
          toneMapped={false}
          transparent
        />
      </mesh>
    </group>
  );
}

// 4. Vertical Energy Columns — Twin beams from crystal tips
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
      const pulse = 0.85 + energy * 0.25 + Math.sin(time * 5.0) * 0.06;
      groupRef.current.scale.set(1, pulse, 1);
    }
  });

  const simpleVert = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;

  return (
    <group ref={groupRef}>
      {/* North Energy Column — upward from top tip */}
      <mesh position={[0, 3.2, 0]} scale={[0.35, 4.8, 0.35]}>
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

      {/* South Energy Column — downward from bottom tip */}
      <mesh position={[0, -3.2, 0]} rotation={[0, 0, Math.PI]} scale={[0.35, 4.8, 0.35]}>
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

      {/* Inner core cone glow — north */}
      <mesh position={[0, 2.0, 0]}>
        <coneGeometry args={[0.1, 3.5, 16, 1, true]} />
        <meshBasicMaterial
          color={ICE}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.22}
          side={THREE.DoubleSide}
          toneMapped={false}
          transparent
        />
      </mesh>

      {/* Inner core cone glow — south */}
      <mesh position={[0, -2.0, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.1, 3.5, 16, 1, true]} />
        <meshBasicMaterial
          color={ORCHID}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.18}
          side={THREE.DoubleSide}
          toneMapped={false}
          transparent
        />
      </mesh>
    </group>
  );
}

// 5. Power Field Particles — Orbital Dust Swarm
function PowerFieldParticles({ activity }: { activity: AiActivity }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 800;

  const { positions, speeds, phases } = useMemo(() => {
    const random = seededRandom(7733);
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const phs = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 0.8 + random() * 2.5;
      const angle = random() * Math.PI * 2;
      const y = (random() - 0.5) * 3.2;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      spd[i] = 0.2 + random() * 0.55;
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
      const orbitalSpeed = speeds[i] * speed * (0.4 / (radius + 0.4));
      const newAngle = currentAngle + orbitalSpeed * delta;

      arr[i * 3] = Math.cos(newAngle) * radius;
      arr[i * 3 + 1] += Math.sin(time * 1.8 + phases[i]) * 0.0015;
      arr[i * 3 + 2] = Math.sin(newAngle) * radius;

      // Wrap vertical position
      if (arr[i * 3 + 1] > 2.0) arr[i * 3 + 1] = -2.0;
      if (arr[i * 3 + 1] < -2.0) arr[i * 3 + 1] = 2.0;
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
        opacity={0.55}
        size={0.022}
        sizeAttenuation
        toneMapped={false}
        transparent
      />
    </points>
  );
}

// 6. Floating Crystal Shards — Orbiting Instanced Octahedra
function FloatingCrystalShards({ activity }: { activity: AiActivity }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const shardCount = 28;

  const shards = useMemo(() => {
    const random = seededRandom(5522);
    return Array.from({ length: shardCount }, () => {
      const angle = random() * Math.PI * 2;
      return {
        angle,
        radius: 1.3 + random() * 1.4,
        y: (random() - 0.5) * 2.2,
        size: 0.05 + random() * 0.1,
        heightScale: 1.8 + random() * 2.8,
        phase: random() * Math.PI * 2,
        orbitSpeed: 0.12 + random() * 0.22,
      };
    });
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);
    const collapseFactor =
      activity === "thinking" ? 0.45 + Math.pow(Math.abs(Math.sin(time * 0.6)), 4) * 0.35 : 1.0;

    shards.forEach((shard, i) => {
      const currentAngle = shard.angle + time * shard.orbitSpeed * speed;
      const radius = shard.radius * collapseFactor;
      const hover = Math.sin(time * 1.2 + shard.phase) * 0.14;

      dummy.position.set(
        Math.cos(currentAngle) * radius,
        shard.y + hover,
        Math.sin(currentAngle) * radius,
      );
      dummy.rotation.set(
        time * 0.35 + shard.phase,
        currentAngle,
        time * 0.28 + shard.phase * 0.7,
      );
      dummy.scale.set(shard.size, shard.size * shard.heightScale, shard.size);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, shardCount]}>
      <octahedronGeometry args={[1, 0]} />
      <meshPhysicalMaterial
        color="#6a20cc"
        emissive={VIOLET}
        emissiveIntensity={1.2}
        metalness={0.1}
        roughness={0.08}
        transmission={0.48}
        transparent
        opacity={0.82}
      />
    </instancedMesh>
  );
}

// =====================================================================
// MAIN POWER SCENE — Xandarian Crystal Power Core
// =====================================================================
export function PowerScene({ activity = "idle" }: { activity?: AiActivity }) {
  return (
    <group name="xandarian-crystal-power-core" scale={1.28}>
      <ambientLight intensity={0.45} color={VIOLET_DEEP} />

      {/* 1. Concentric Energy Base Platform */}
      <EnergyBasePlatform activity={activity} />

      {/* 2. Orbital Dust Particle Field */}
      <PowerFieldParticles activity={activity} />

      {/* 3. Floating Crystal Shards */}
      <FloatingCrystalShards activity={activity} />

      {/* 4. Vertical Energy Columns (tip beams) */}
      <VerticalEnergyColumns activity={activity} />

      {/* 5. 3 Holographic Orbital Data Rings */}
      <HolographicOrbitalRings activity={activity} />

      {/* 6. Xandarian Crystal Diamond Core */}
      <XandarianCrystalCore activity={activity} />
    </group>
  );
}
