import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AiActivity } from "../../App";
import { activityEnergy, activityPulse, activitySpeed, seededRandom } from "../shared/coreMotion";

const BLUE = "#22b8ff";
const ICE = "#dcfbff";
const DEEP = "#0757ff";

// --- GLSL SHADERS FOR VOLUMETRIC NEBULA, GLASS TENDRILLS & WORMHOLE ---

const nebulaVertexShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const nebulaFragmentShader = `
  uniform float uTime;
  uniform float uEnergy;
  varying vec3 vPosition;
  varying vec3 vNormal;

  // 3D Simplex Noise generator
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
    vec3 p = vPosition * 2.4;
    float time = uTime * 0.5;

    // Multi-octave cosmic galaxy swirling noise
    float n1 = snoise(p + vec3(0.0, 0.0, time));
    float n2 = snoise(p * 2.2 - vec3(time * 0.7, 0.0, time * 0.5));
    float n3 = snoise(p * 4.5 + vec3(time * 0.9, -time * 0.6, 0.0));

    float nebula = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
    float density = smoothstep(-0.15, 0.88, nebula);

    // Fresnel rim glow
    float viewAngle = abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)));
    float fresnel = pow(1.0 - viewAngle, 2.4);

    vec3 colDeep = vec3(0.027, 0.341, 1.0);  // DEEP SPACE #0757ff
    vec3 colBlue = vec3(0.133, 0.722, 1.0);  // COSMIC BLUE #22b8ff
    vec3 colIce  = vec3(0.863, 0.984, 1.0);  // ICE CYAN #dcfbff

    vec3 color = mix(colDeep, colBlue, density);
    color = mix(color, colIce, pow(density, 2.0) * 0.9);

    float alpha = (density * 0.5 + fresnel * 0.4) * uEnergy;
    gl_FragColor = vec4(color * (0.9 + uEnergy * 0.6), alpha);
  }
`;

// Inner Glow & Electric Tendrils Shader (Edge Arc Lightning)
const shellGlowVertexShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const shellGlowFragmentShader = `
  uniform float uTime;
  uniform float uEnergy;
  uniform float uArcActivity;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    // Edge proximity calculation for 12 edges on box UVs
    vec2 edgeDist = abs(vUv - 0.5) * 2.0;
    float edgeFactor = max(edgeDist.x, edgeDist.y);
    float lineEdge = smoothstep(0.86, 0.98, edgeFactor);

    // High frequency electric arc flickering
    float noise = hash(vUv * 120.0 + floor(uTime * 30.0));
    float electricArc = step(0.65, noise) * lineEdge * uArcActivity;

    // Rim inner glow
    float viewAngle = abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)));
    float rimGlow = pow(1.0 - viewAngle, 2.8) * (0.35 + uEnergy * 0.55);

    vec3 iceColor = vec3(0.863, 0.984, 1.0);
    vec3 blueColor = vec3(0.133, 0.722, 1.0);

    vec3 finalColor = mix(blueColor, iceColor, electricArc + rimGlow);
    float finalAlpha = (rimGlow * 0.55 + electricArc * 0.9);

    gl_FragColor = vec4(finalColor * 1.8, finalAlpha);
  }
`;

// Wormhole Tunnel Shader
const wormholeVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const wormholeFragmentShader = `
  uniform float uTime;
  uniform float uEnergy;
  varying vec2 vUv;

  void main() {
    vec2 st = vUv;
    float zScroll = st.y * 14.0 - uTime * 2.8;
    float spiral = st.x * 28.0 + st.y * 10.0 + uTime * 2.0;

    float grid = abs(sin(spiral) * sin(zScroll));
    float lines = smoothstep(0.72, 0.96, grid);
    float depthFade = smoothstep(0.0, 0.35, st.y) * (1.0 - smoothstep(0.75, 1.0, st.y));

    vec3 ice = vec3(0.863, 0.984, 1.0);
    vec3 deep = vec3(0.027, 0.341, 1.0);
    vec3 color = mix(deep, ice, lines * 0.85);

    gl_FragColor = vec4(color * (0.8 + uEnergy * 0.5), lines * depthFade * 0.42 * uEnergy);
  }
`;

// --- COMPONENTS ---

// 1. Tesseract Glass Shell (PBR Glass + Inner Glow + Procedural Electric Tendrils)
function TesseractGlassShell({ activity }: { activity: AiActivity }) {
  const innerGlowRef = useRef<THREE.ShaderMaterial>(null);
  const outerBoxRef = useRef<THREE.Mesh>(null);

  const isHighActivity = activity === "speaking" || activity === "thinking";

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);

    if (outerBoxRef.current) {
      outerBoxRef.current.rotation.y += delta * 0.16 * speed;
      outerBoxRef.current.rotation.x = Math.sin(time * 0.3) * 0.12;
    }

    if (innerGlowRef.current) {
      innerGlowRef.current.uniforms.uTime.value = time;
      innerGlowRef.current.uniforms.uEnergy.value = activityEnergy(activity);
      innerGlowRef.current.uniforms.uArcActivity.value = isHighActivity
        ? activity === "speaking" ? 1.5 : 1.1
        : 0.35;
    }
  });

  return (
    <group>
      {/* Pristine PBR Physical Glass Cube */}
      <mesh ref={outerBoxRef}>
        <boxGeometry args={[2.0, 2.0, 2.0]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.88}
          roughness={0.08}
          metalness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.04}
          ior={1.55}
          transparent
          opacity={0.94}
          reflectivity={0.95}
        />
      </mesh>

      {/* Edge Electric Tendrils & Inner Glow */}
      <mesh scale={0.98}>
        <boxGeometry args={[1.98, 1.98, 1.98]} />
        <shaderMaterial
          ref={innerGlowRef}
          vertexShader={shellGlowVertexShader}
          fragmentShader={shellGlowFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uEnergy: { value: 1 },
            uArcActivity: { value: 0.35 },
          }}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>
    </group>
  );
}

// 2. Volumetric Cosmic Nebula Core + Space Stone Nucleus
function VolumetricCosmicNebulaCore({ activity }: { activity: AiActivity }) {
  const nebulaRef = useRef<THREE.ShaderMaterial>(null);
  const stoneRef = useRef<THREE.Mesh>(null);
  const raysRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);
    const energy = activityEnergy(activity);

    if (nebulaRef.current) {
      nebulaRef.current.uniforms.uTime.value = time;
      nebulaRef.current.uniforms.uEnergy.value = energy;
    }

    if (stoneRef.current) {
      stoneRef.current.rotation.x += delta * 1.0 * speed;
      stoneRef.current.rotation.y += delta * 1.4 * speed;
      const pulse = 0.88 + Math.sin(time * 6.5) * 0.06 + energy * 0.14;
      stoneRef.current.scale.setScalar(pulse);
    }

    if (raysRef.current) {
      raysRef.current.rotation.z += delta * 0.45 * speed;
      raysRef.current.scale.setScalar(1 + Math.sin(time * 8.0) * 0.1 * energy);
    }
  });

  return (
    <group>
      {/* Volumetric 3D Galaxy Core (Custom 3D Noise Shader) */}
      <mesh scale={0.92}>
        <boxGeometry args={[1.78, 1.78, 1.78, 16, 16, 16]} />
        <shaderMaterial
          ref={nebulaRef}
          vertexShader={nebulaVertexShader}
          fragmentShader={nebulaFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uEnergy: { value: 1 },
          }}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>

      {/* Space Stone Nucleus & 6 Cross Volumetric Energy Beams */}
      <mesh ref={stoneRef}>
        <octahedronGeometry args={[0.2, 0]} />
        <meshBasicMaterial color={ICE} toneMapped={false} />
      </mesh>

      <group ref={raysRef}>
        {[0, Math.PI / 3, (2 * Math.PI) / 3].map((angle, index) => (
          <mesh key={index} rotation={[0, 0, angle]}>
            <planeGeometry args={[0.08, 1.95]} />
            <meshBasicMaterial
              color={ICE}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              opacity={0.5}
              transparent
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      <pointLight color={ICE} intensity={4.5} distance={6} position={[0, 0, 0]} />
    </group>
  );
}

// 3. Electric Hypercube 4D Matrix (Vertices + Laser Wires)
function ElectricHypercube4D({ activity }: { activity: AiActivity }) {
  const lineRef = useRef<THREE.LineSegments>(null);
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const { geometry, vertices, edges } = useMemo(() => {
    const source: Array<[number, number, number, number]> = [];
    for (let index = 0; index < 16; index += 1) {
      source.push([
        index & 1 ? 1 : -1,
        index & 2 ? 1 : -1,
        index & 4 ? 1 : -1,
        index & 8 ? 1 : -1,
      ]);
    }
    const connections: Array<[number, number]> = [];
    for (let index = 0; index < source.length; index += 1) {
      for (let dimension = 0; dimension < 4; dimension += 1) {
        const neighbor = index ^ (1 << dimension);
        if (index < neighbor) connections.push([index, neighbor]);
      }
    }
    const positions = new Float32Array(connections.length * 6);
    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geometry: buffer, vertices: source, edges: connections };
  }, []);

  const projectedCoords = useMemo(() => new Float32Array(16 * 3), []);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);
    const energy = activityEnergy(activity);

    const positions = geometry.attributes.position as THREE.BufferAttribute;
    const array = positions.array as Float32Array;

    const a = time * 0.38 * speed;
    const b = time * 0.28 * speed;
    const c = time * 0.2 * speed;
    const ca = Math.cos(a), sa = Math.sin(a);
    const cb = Math.cos(b), sb = Math.sin(b);
    const cc = Math.cos(c), sc = Math.sin(c);

    // Compute double 4D rotation and perspective projection
    vertices.forEach(([sourceX, sourceY, sourceZ, sourceW], index) => {
      let x = sourceX * ca - sourceW * sa;
      let w = sourceX * sa + sourceW * ca;
      let y = sourceY * cb - w * sb;
      w = sourceY * sb + w * cb;
      let z = sourceZ * cc - w * sc;
      w = sourceZ * sc + w * cc;

      const projection = 1.75 / (2.65 - w * 0.38);
      const px = x * projection;
      const py = y * projection;
      const pz = z * projection;

      projectedCoords[index * 3] = px;
      projectedCoords[index * 3 + 1] = py;
      projectedCoords[index * 3 + 2] = pz;

      if (nodesRef.current) {
        dummy.position.set(px, py, pz);
        const pulseScale = (0.05 + Math.sin(time * 8.5 + index) * 0.018) * energy;
        dummy.scale.setScalar(pulseScale);
        dummy.updateMatrix();
        nodesRef.current.setMatrixAt(index, dummy.matrix);
      }
    });

    edges.forEach(([from, to], index) => {
      const offset = index * 6;
      array[offset] = projectedCoords[from * 3];
      array[offset + 1] = projectedCoords[from * 3 + 1];
      array[offset + 2] = projectedCoords[from * 3 + 2];
      array[offset + 3] = projectedCoords[to * 3];
      array[offset + 4] = projectedCoords[to * 3 + 1];
      array[offset + 5] = projectedCoords[to * 3 + 2];
    });

    positions.needsUpdate = true;
    if (nodesRef.current) nodesRef.current.instanceMatrix.needsUpdate = true;

    if (lineRef.current) {
      lineRef.current.rotation.y += delta * 0.12 * speed;
      lineRef.current.scale.setScalar(activityPulse(activity, time));
    }
  });

  return (
    <group rotation={[0.2, -0.3, 0.08]}>
      {/* Hypercube 4D Laser Wires */}
      <lineSegments ref={lineRef} geometry={geometry}>
        <lineBasicMaterial
          color={ICE}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.92}
          toneMapped={false}
          transparent
        />
      </lineSegments>

      <lineSegments geometry={geometry} scale={1.12}>
        <lineBasicMaterial
          color={DEEP}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.4}
          toneMapped={false}
          transparent
        />
      </lineSegments>

      {/* 16 Glowing 4D Vertices Nodes */}
      <instancedMesh ref={nodesRef} args={[undefined, undefined, 16]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial color={ICE} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

// 4. Space Wormhole Tunnel & 1,200 Starlight Particles
function SpaceWormholeTunnel({ activity }: { activity: AiActivity }) {
  const wormholeShaderRef = useRef<THREE.ShaderMaterial>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const particleCount = 1200;
  const { positions, initialAngles, initialRadii, speeds } = useMemo(() => {
    const random = seededRandom(1088);
    const pos = new Float32Array(particleCount * 3);
    const angles = new Float32Array(particleCount);
    const radii = new Float32Array(particleCount);
    const spds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const angle = random() * Math.PI * 2;
      const radius = 0.5 + random() * 4.2;
      const z = -7.0 + random() * 9.0;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = z;

      angles[i] = angle;
      radii[i] = radius;
      spds[i] = 0.4 + random() * 1.4;
    }
    return { positions: pos, initialAngles: angles, initialRadii: radii, speeds: spds };
  }, []);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);

    if (wormholeShaderRef.current) {
      wormholeShaderRef.current.uniforms.uTime.value = time;
      wormholeShaderRef.current.uniforms.uEnergy.value = activityEnergy(activity);
    }

    if (particlesRef.current) {
      const posAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        initialAngles[i] += delta * speeds[i] * 0.9 * speed;
        const currentAngle = initialAngles[i];
        let z = posArray[i * 3 + 2] + delta * speeds[i] * 2.5 * speed;
        if (z > 2.0) z = -7.0;

        const currentRadius = initialRadii[i] * (1.0 + (z + 7.0) * 0.15);

        posArray[i * 3] = Math.cos(currentAngle) * currentRadius;
        posArray[i * 3 + 1] = Math.sin(currentAngle) * currentRadius;
        posArray[i * 3 + 2] = z;
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group position={[0, 0, -2.5]}>
      {/* 3D Wormhole Funnel Cylinder Mesh */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.6, 5.2, 11, 32, 32, true]} />
        <shaderMaterial
          ref={wormholeShaderRef}
          vertexShader={wormholeVertexShader}
          fragmentShader={wormholeFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uEnergy: { value: 1 },
          }}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>

      {/* 1,200 Starlight Particles Spiraling Inwards/Outwards */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={ICE}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.7}
          size={0.035}
          sizeAttenuation
          toneMapped={false}
          transparent
        />
      </points>
    </group>
  );
}

// --- MAIN SPACE SCENE ---
export function SpaceScene({ activity = "idle" }: { activity?: AiActivity }) {
  return (
    <group name="mcu-tesseract-space-scene" scale={1.25}>
      <ambientLight intensity={0.6} color={DEEP} />

      {/* 1. Wormhole Tunnel & 1,200 Starlight Particle Vortex */}
      <SpaceWormholeTunnel activity={activity} />

      {/* 2. Electric 4D Hypercube Matrix */}
      <ElectricHypercube4D activity={activity} />

      {/* 3. Volumetric Cosmic Nebula Core & Space Stone Nucleus */}
      <VolumetricCosmicNebulaCore activity={activity} />

      {/* 4. Translucent PBR Tesseract Glass Shell & Edge Arcs */}
      <TesseractGlassShell activity={activity} />
    </group>
  );
}
