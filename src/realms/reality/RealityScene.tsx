import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AiActivity } from "../../App";
import { activityEnergy, activityPulse, activitySpeed, seededRandom } from "../shared/coreMotion";

// Palettes & Constants directly from MCU Concept Reference
const CRIMSON = "#ff1744";
const BLOOD_RED = "#d50000";
const DEEP_VOID = "#0a0004";
const DARK_MATTER = "#200008";
const HOT_CORE = "#ff8ba0";
const RUNIC_GOLD = "#ffb300";
const RUNIC_RED = "#ff2a4b";

// --- GLSL SHADERS ---

// 1. Aether Storm Core - Multi-layer Procedural 3D Simplex Fluid Noise with Dark Matter Veins
const aetherCoreVertexShader = `
  uniform float uTime;
  uniform float uEnergy;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  varying vec3 vViewDirection;

  // Simplex 3D Noise Generator
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod(i, 289.0 );
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;

    // Organic sentience fluid morphing - Multi-octave turbulence
    vec3 noiseCoord = position * 1.8;
    float n1 = snoise(noiseCoord + vec3(0.0, uTime * 0.7, uTime * 0.4));
    float n2 = snoise(noiseCoord * 2.5 - vec3(uTime * 0.9, 0.0, uTime * 0.6));
    float n3 = snoise(noiseCoord * 4.0 + vec3(uTime * 1.2, uTime * 0.5, 0.0)) * 0.5;

    float displacement = (n1 * 0.28 + n2 * 0.16 + n3 * 0.08) * (0.8 + uEnergy * 0.7);
    vec3 newPosition = position + normal * displacement;

    vec4 worldPos = modelMatrix * vec4(newPosition, 1.0);
    vWorldPosition = worldPos.xyz;
    vViewDirection = normalize(cameraPosition - worldPos.xyz);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const aetherCoreFragmentShader = `
  uniform float uTime;
  uniform float uEnergy;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  varying vec3 vViewDirection;

  void main() {
    float fresnel = pow(1.0 - max(dot(normalize(vNormal), normalize(vViewDirection)), 0.0), 2.2);

    // Dynamic swirling dark matter vortices & blood-plasma streams
    float swirl = sin(vPosition.y * 7.0 + vPosition.x * 5.0 + uTime * 3.0);
    float darkVeins = pow(abs(sin(vPosition.z * 11.0 + swirl * 2.0 - uTime * 2.2)), 8.0);
    float pulse = 0.5 + 0.5 * sin(uTime * 4.0 + vPosition.y * 6.0);

    vec3 colVoid    = vec3(0.04, 0.0, 0.015);
    vec3 colDarkRed = vec3(0.45, 0.0, 0.06);
    vec3 colCrimson = vec3(1.0, 0.09, 0.22);
    vec3 colHot     = vec3(1.0, 0.72, 0.82);

    // Layering from deep dark void to blazing crimson storm
    vec3 color = mix(colVoid, colDarkRed, fresnel * 0.8 + 0.2);
    color = mix(color, colCrimson, (1.0 - darkVeins * 0.85) * (0.6 + pulse * 0.4));
    color = mix(color, colHot, pow(fresnel, 3.5) * 0.85 + (1.0 - darkVeins) * pulse * 0.35);

    float alpha = (0.75 + fresnel * 0.35) * (0.7 + uEnergy * 0.35);
    gl_FragColor = vec4(color * (1.2 + uEnergy * 0.65), alpha);
  }
`;

// 2. Concentric Runic Anchor / Mandala Shader (Floor / Back Runic Circle)
const runicMandalaFragmentShader = `
  uniform float uTime;
  uniform float uEnergy;
  uniform vec3 uColor;
  uniform vec3 uHotColor;
  varying vec2 vUv;

  void main() {
    vec2 p = vUv - vec2(0.5);
    float r = length(p) * 2.0;
    float a = atan(p.y, p.x);

    if (r > 1.0) discard;

    // Rings math
    float ring1 = smoothstep(0.015, 0.0, abs(r - 0.92));
    float ring2 = smoothstep(0.012, 0.0, abs(r - 0.78));
    float ring3 = smoothstep(0.015, 0.0, abs(r - 0.55));
    float ring4 = smoothstep(0.02, 0.0, abs(r - 0.32));
    float ring5 = smoothstep(0.01, 0.0, abs(r - 0.15));

    // Radial spokes & Eldritch Runes division
    float spokes = smoothstep(0.015, 0.0, abs(sin(a * 8.0 + uTime * 0.15))) * step(0.32, r) * step(r, 0.92);
    float innerSpokes = smoothstep(0.02, 0.0, abs(sin(a * 16.0 - uTime * 0.25))) * step(0.55, r) * step(r, 0.78);
    float runes = step(0.65, fract(sin(floor(a * 12.0) * 45.12 + floor(r * 20.0) * 88.3) * 43758.5453)) * 
                  step(0.78, r) * step(r, 0.92);

    float totalPattern = ring1 + ring2 + ring3 + ring4 + ring5 + spokes * 0.6 + innerSpokes * 0.7 + runes * 0.8;
    float pulse = 0.7 + 0.3 * sin(uTime * 3.5 - r * 8.0);

    vec3 col = mix(uColor, uHotColor, totalPattern * 0.6 + pulse * 0.4);
    float alpha = totalPattern * (0.35 + pulse * 0.45) * (0.7 + uEnergy * 0.4);
    
    // Edge fade
    alpha *= smoothstep(1.0, 0.85, r);

    gl_FragColor = vec4(col * (1.3 + uEnergy * 0.5), alpha);
  }
`;

// --- 3D SUB-COMPONENTS ---

// 1. Aether Storm Core Mesh (The living cloud / stone storm)
function AetherStormCore({ activity }: { activity: AiActivity }) {
  const outerBlob = useRef<THREE.Mesh>(null);
  const innerBlob = useRef<THREE.Mesh>(null);
  const coreLight = useRef<THREE.PointLight>(null);
  const outerMat = useRef<THREE.ShaderMaterial>(null);
  const innerMat = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);
    const energy = activityEnergy(activity);
    const pulse = activityPulse(activity, time, 0.6);

    if (outerBlob.current) {
      outerBlob.current.rotation.y += delta * 0.25 * speed;
      outerBlob.current.rotation.z = Math.sin(time * 0.3) * 0.15;
      outerBlob.current.scale.setScalar(1.08 * pulse);
    }
    if (innerBlob.current) {
      innerBlob.current.rotation.y -= delta * 0.4 * speed;
      innerBlob.current.rotation.x += delta * 0.2 * speed;
      innerBlob.current.scale.setScalar(0.72 * (2.0 - pulse));
    }
    if (outerMat.current) {
      outerMat.current.uniforms.uTime.value = time;
      outerMat.current.uniforms.uEnergy.value = energy;
    }
    if (innerMat.current) {
      innerMat.current.uniforms.uTime.value = time * 1.5;
      innerMat.current.uniforms.uEnergy.value = energy * 1.2;
    }
    if (coreLight.current) {
      coreLight.current.intensity = 4.5 + energy * 4.0 + Math.sin(time * 8.0) * 1.2;
    }
  });

  return (
    <group name="aether-storm-core">
      {/* Outer Volumetric Aether Plasma Shell */}
      <mesh ref={outerBlob}>
        <icosahedronGeometry args={[0.92, 32]} />
        <shaderMaterial
          ref={outerMat}
          vertexShader={aetherCoreVertexShader}
          fragmentShader={aetherCoreFragmentShader}
          uniforms={{ uTime: { value: 0 }, uEnergy: { value: 1 } }}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          transparent
        />
      </mesh>

      {/* Dense High-Frequency Inner Core */}
      <mesh ref={innerBlob}>
        <icosahedronGeometry args={[0.65, 24]} />
        <shaderMaterial
          ref={innerMat}
          vertexShader={aetherCoreVertexShader}
          fragmentShader={aetherCoreFragmentShader}
          uniforms={{ uTime: { value: 0 }, uEnergy: { value: 1 } }}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          transparent
        />
      </mesh>

      {/* Central Blazing Singularity */}
      <mesh scale={0.22}>
        <octahedronGeometry args={[1, 3]} />
        <meshBasicMaterial color={HOT_CORE} toneMapped={false} />
      </mesh>

      <pointLight ref={coreLight} color={CRIMSON} distance={7} intensity={6} />
      <pointLight color={HOT_CORE} distance={3} intensity={4} />
    </group>
  );
}

// 2. Containment Frame (Curved Segmented Alien / Dark Claws Enclosing the Aether)
function ContainmentFrame({ activity }: { activity: AiActivity }) {
  const frameGroup = useRef<THREE.Group>(null);

  // Generate curved talon / claw profiles positioned around the perimeter
  const claws = useMemo(() => {
    const clawCount = 6;
    return Array.from({ length: clawCount }, (_, i) => {
      const angle = (i / clawCount) * Math.PI * 2;
      return {
        angle,
        heightScale: 1.0 + (i % 2 === 0 ? 0.25 : -0.15),
        radius: 1.38,
        tilt: 0.18 * (i % 2 === 0 ? 1 : -1),
      };
    });
  }, []);

  useFrame(({ clock }, delta) => {
    if (!frameGroup.current) return;
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);
    const energy = activityEnergy(activity);

    // Floating breathing motion
    frameGroup.current.rotation.y += delta * 0.08 * speed;
    frameGroup.current.position.y = Math.sin(time * 0.8) * 0.05;
    
    // Breathing scale expansion during high activity
    const pulseScale = 1.0 + Math.sin(time * 2.0) * 0.02 * energy;
    frameGroup.current.scale.set(pulseScale, pulseScale, pulseScale);
  });

  return (
    <group ref={frameGroup} name="containment-claws-frame">
      {claws.map((claw, idx) => {
        const x = Math.cos(claw.angle) * claw.radius;
        const z = Math.sin(claw.angle) * claw.radius;
        return (
          <group key={idx} position={[x, 0, z]} rotation={[claw.tilt, -claw.angle + Math.PI / 2, 0]}>
            {/* Primary Curved Talon Spine */}
            <mesh scale={[0.07, claw.heightScale * 1.35, 0.16]} position={[0, 0, 0]}>
              <coneGeometry args={[1, 2, 5]} />
              <meshStandardMaterial
                color={DARK_MATTER}
                emissive={CRIMSON}
                emissiveIntensity={0.65}
                metalness={0.92}
                roughness={0.25}
              />
            </mesh>

            {/* Inward Curved Pincer Tip (Top) */}
            <mesh
              scale={[0.05, 0.45, 0.1]}
              position={[0, claw.heightScale * 1.1, -0.18]}
              rotation={[-0.75, 0, 0]}
            >
              <coneGeometry args={[1, 2, 4]} />
              <meshStandardMaterial
                color="#120004"
                emissive={HOT_CORE}
                emissiveIntensity={1.2}
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>

            {/* Inward Curved Pincer Tip (Bottom) */}
            <mesh
              scale={[0.05, 0.45, 0.1]}
              position={[0, -claw.heightScale * 1.1, -0.18]}
              rotation={[0.75, 0, 0]}
            >
              <coneGeometry args={[1, 2, 4]} />
              <meshStandardMaterial
                color="#120004"
                emissive={HOT_CORE}
                emissiveIntensity={1.2}
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>

            {/* Glowing Aetheric Conduit Seam on Talon */}
            <mesh scale={[0.02, claw.heightScale * 1.2, 0.03]} position={[0, 0, 0.08]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial color={CRIMSON} toneMapped={false} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// 3. Dark Void Swirls & Energy Tendrils (Volumetric Spirals & Arcs)
function DarkVoidTendrils({ activity }: { activity: AiActivity }) {
  const tendrilsRef = useRef<THREE.Group>(null);
  const count = 12;

  const curves = useMemo(() => {
    const rng = seededRandom(9931);
    return Array.from({ length: count }, (_, i) => {
      const points: THREE.Vector3[] = [];
      const baseAngle = (i / count) * Math.PI * 2;
      const length = 18;
      for (let j = 0; j < length; j++) {
        const t = j / length;
        const radius = 0.25 + t * (1.45 + rng() * 0.4);
        const theta = baseAngle + t * (Math.PI * 1.4) * (i % 2 === 0 ? 1 : -1);
        const y = (t - 0.5) * 1.8 + Math.sin(t * Math.PI * 2) * 0.3;
        points.push(new THREE.Vector3(Math.cos(theta) * radius, y, Math.sin(theta) * radius));
      }
      return new THREE.CatmullRomCurve3(points);
    });
  }, []);

  useFrame(({ clock }, delta) => {
    if (!tendrilsRef.current) return;
    const speed = activitySpeed(activity);
    tendrilsRef.current.rotation.y += delta * 0.35 * speed;
    tendrilsRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.4) * 0.1;
  });

  return (
    <group ref={tendrilsRef} name="dark-void-tendrils">
      {curves.map((curve, idx) => (
        <mesh key={idx}>
          <tubeGeometry args={[curve, 28, 0.016 + (idx % 3) * 0.008, 6, false]} />
          <meshStandardMaterial
            color={idx % 2 === 0 ? DEEP_VOID : DARK_MATTER}
            emissive={idx % 3 === 0 ? CRIMSON : BLOOD_RED}
            emissiveIntensity={idx % 2 === 0 ? 1.4 : 0.6}
            metalness={0.9}
            roughness={0.2}
            transparent
            opacity={0.88}
          />
        </mesh>
      ))}
    </group>
  );
}

// 4. Runic Resonance Anchor (Horizontal Floor Grid + Vertical Arcane Halo)
function RunicResonanceAnchor({ activity }: { activity: AiActivity }) {
  const floorRef = useRef<THREE.ShaderMaterial>(null);
  const haloRef = useRef<THREE.ShaderMaterial>(null);
  const floorGroup = useRef<THREE.Group>(null);
  const haloGroup = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const energy = activityEnergy(activity);
    const speed = activitySpeed(activity);

    if (floorRef.current) {
      floorRef.current.uniforms.uTime.value = time;
      floorRef.current.uniforms.uEnergy.value = energy;
    }
    if (haloRef.current) {
      haloRef.current.uniforms.uTime.value = time * 0.8;
      haloRef.current.uniforms.uEnergy.value = energy;
    }
    if (floorGroup.current) {
      floorGroup.current.rotation.z -= delta * 0.05 * speed;
    }
    if (haloGroup.current) {
      haloGroup.current.rotation.z += delta * 0.03 * speed;
    }
  });

  return (
    <group name="runic-resonance-anchor">
      {/* 1. Concentric Runic Ground Anchor Plane (Below Orb) */}
      <group ref={floorGroup} position={[0, -1.75, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <planeGeometry args={[4.8, 4.8]} />
          <shaderMaterial
            ref={floorRef}
            vertexShader={`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`}
            fragmentShader={runicMandalaFragmentShader}
            uniforms={{
              uTime: { value: 0 },
              uEnergy: { value: 1 },
              uColor: { value: new THREE.Color(RUNIC_RED) },
              uHotColor: { value: new THREE.Color(RUNIC_GOLD) },
            }}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* 2. Vertical Ancient Runic Anchor Halo (Behind Orb) */}
      <group ref={haloGroup} position={[0, 0, -1.2]} rotation={[0.08, 0, 0]}>
        <mesh>
          <planeGeometry args={[5.2, 5.2]} />
          <shaderMaterial
            ref={haloRef}
            vertexShader={`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`}
            fragmentShader={runicMandalaFragmentShader}
            uniforms={{
              uTime: { value: 0 },
              uEnergy: { value: 1 },
              uColor: { value: new THREE.Color(RUNIC_RED) },
              uHotColor: { value: new THREE.Color(HOT_CORE) },
            }}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}

// 5. Aetheric Nebula Dust & Thanos Embers (Upward Swirling Particles)
function AethericNebulaParticles({ activity }: { activity: AiActivity }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 900;

  const { positions, velocities, randomOffsets } = useMemo(() => {
    const rng = seededRandom(4418);
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const offs = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 0.6 + rng() * 2.8;
      const theta = rng() * Math.PI * 2;
      const y = (rng() - 0.5) * 4.2;

      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(theta) * radius * 0.85;

      vel[i * 3] = (rng() - 0.5) * 0.2;
      vel[i * 3 + 1] = 0.25 + rng() * 0.75; // Upward drift (Reality dissolution)
      vel[i * 3 + 2] = (rng() - 0.5) * 0.2;

      offs[i] = rng() * Math.PI * 2;
    }
    return { positions: pos, velocities: vel, randomOffsets: offs };
  }, []);

  useFrame(({ clock }, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const posArr = posAttr.array as Float32Array;
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);

    for (let i = 0; i < count; i++) {
      posArr[i * 3 + 1] += velocities[i * 3 + 1] * delta * speed;
      posArr[i * 3] += Math.sin(time * 1.5 + randomOffsets[i]) * 0.005;
      posArr[i * 3 + 2] += Math.cos(time * 1.5 + randomOffsets[i]) * 0.005;

      // Wrap around bounds
      if (posArr[i * 3 + 1] > 2.6) {
        posArr[i * 3 + 1] = -2.4;
      }
    }
    posAttr.needsUpdate = true;
    pointsRef.current.rotation.y = time * 0.03 * speed;
  });

  return (
    <points ref={pointsRef} name="aether-nebula-particles">
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={CRIMSON}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        opacity={0.68}
        size={0.038}
        sizeAttenuation
        toneMapped={false}
        transparent
      />
    </points>
  );
}

// 6. Energy Arcs / Aether Discharge Lightning
function EnergyArcs({ activity }: { activity: AiActivity }) {
  const lineRef = useRef<THREE.LineSegments>(null);
  const arcCount = 8;
  const segmentsPerArc = 6;

  const positions = useMemo(() => new Float32Array(arcCount * segmentsPerArc * 6), []);
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    const energy = activityEnergy(activity);
    const speed = activitySpeed(activity);
    let ptr = 0;

    for (let i = 0; i < arcCount; i++) {
      const angle = (i / arcCount) * Math.PI * 2 + time * 0.5 * speed;
      const baseRadius = 0.75;
      let currentPos = new THREE.Vector3(
        Math.cos(angle) * baseRadius,
        Math.sin(angle * 2.0) * 0.35,
        Math.sin(angle) * baseRadius
      );

      for (let j = 0; j < segmentsPerArc; j++) {
        const nextPos = currentPos.clone().add(
          new THREE.Vector3(
            (Math.sin(time * 12.0 + i * 5 + j) - 0.5) * 0.28 * energy,
            (Math.cos(time * 15.0 + i * 3 + j) - 0.5) * 0.28 * energy + 0.08,
            (Math.sin(time * 10.0 + j * 7) - 0.5) * 0.28 * energy
          )
        );

        positions[ptr++] = currentPos.x;
        positions[ptr++] = currentPos.y;
        positions[ptr++] = currentPos.z;
        positions[ptr++] = nextPos.x;
        positions[ptr++] = nextPos.y;
        positions[ptr++] = nextPos.z;

        currentPos = nextPos;
      }
    }

    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        color={HOT_CORE}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        opacity={0.85}
        toneMapped={false}
        transparent
      />
    </lineSegments>
  );
}

// 7. Accretion Void Rings (Tilted Dark Matter Ring System)
function AccretionVoidRings({ activity }: { activity: AiActivity }) {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    const speed = activitySpeed(activity);
    if (ring1.current) ring1.current.rotation.z += delta * 0.12 * speed;
    if (ring2.current) ring2.current.rotation.z -= delta * 0.18 * speed;
  });

  return (
    <group rotation={[0.42, 0.15, 0.2]} name="accretion-void-rings">
      <mesh ref={ring1}>
        <torusGeometry args={[1.85, 0.012, 8, 120]} />
        <meshBasicMaterial
          color={CRIMSON}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.4}
          transparent
        />
      </mesh>
      <mesh ref={ring2} rotation={[0.3, 0.4, 0]}>
        <torusGeometry args={[2.15, 0.008, 8, 120]} />
        <meshBasicMaterial
          color={HOT_CORE}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.3}
          transparent
        />
      </mesh>
    </group>
  );
}

// --- MAIN REALITY SCENE EXPORT ---
export function RealityScene({ activity = "idle" }: { activity?: AiActivity }) {
  return (
    <group name="reality-stone-aether-mcu-core" scale={1.05}>
      {/* Cinematic Lighting Setup */}
      <ambientLight color={DEEP_VOID} intensity={0.6} />
      <directionalLight color={HOT_CORE} intensity={1.8} position={[2.5, 3.5, 4.0]} />
      <pointLight color={CRIMSON} distance={10} intensity={3.5} position={[-2.5, -1.0, 2.0]} />

      {/* 1. Runic Mandala Anchor (Back Halo & Floor Plane) */}
      <RunicResonanceAnchor activity={activity} />

      {/* 2. Thanos Reality Embers & Aetheric Nebula Cloud */}
      <AethericNebulaParticles activity={activity} />

      {/* 3. Dark Void Swirls Tendrils */}
      <DarkVoidTendrils activity={activity} />

      {/* 4. Accretion Void Rings */}
      <AccretionVoidRings activity={activity} />

      {/* 5. Containment Claw Frame (Spiked Alien Frame) */}
      <ContainmentFrame activity={activity} />

      {/* 6. Aether Storm Core (Living Volumetric Simplex Fluid Sphere) */}
      <AetherStormCore activity={activity} />

      {/* 7. Discharge Energy Arcs */}
      <EnergyArcs activity={activity} />
    </group>
  );
}
export default RealityScene;
