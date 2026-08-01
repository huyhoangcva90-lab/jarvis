import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AiActivity } from "../../App";
import { activityEnergy, activityPulse, activitySpeed, seededRandom } from "../shared/coreMotion";

const BLUE = "#22b8ff";
const ICE = "#dcfbff";
const DEEP = "#0757ff";

// --- GLSL SHADERS ---

// 1. Volumetric Cosmic Nebula Core Shader (3D Noise Galaxy Swirl)
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
  varying vec2 vUv;

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
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vec3 p = vPosition * 2.2;
    float time = uTime * 0.45;

    // Multi-octave cosmic swirling noise
    float n1 = snoise(p + vec3(0.0, 0.0, time));
    float n2 = snoise(p * 2.1 - vec3(time * 0.6, 0.0, time * 0.4));
    float n3 = snoise(p * 4.2 + vec3(time * 0.8, -time * 0.5, 0.0));

    float nebula = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
    float density = smoothstep(-0.2, 0.85, nebula);

    // Fresnel edge brightness
    float viewAngle = abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)));
    float fresnel = pow(1.0 - viewAngle, 2.5);

    vec3 colDeep = vec3(0.027, 0.341, 1.0);  // DEEP SPACE #0757ff
    vec3 colBlue = vec3(0.133, 0.722, 1.0);  // COSMIC BLUE #22b8ff
    vec3 colIce  = vec3(0.863, 0.984, 1.0);  // ICE CYAN #dcfbff

    vec3 color = mix(colDeep, colBlue, density);
    color = mix(color, colIce, pow(density, 2.2) * 0.85);

    float alpha = (density * 0.45 + fresnel * 0.35) * uEnergy;
    gl_FragColor = vec4(color * (0.8 + uEnergy * 0.5), alpha);
  }
`;

// 2. Inner Glow & Electric Tendrils Shader (Crystal Shell Energy Arcs)
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
    // Edge proximity detection on box UVs
    vec2 edgeDist = abs(vUv - 0.5) * 2.0;
    float edgeFactor = max(edgeDist.x, edgeDist.y);
    float lineEdge = smoothstep(0.88, 0.98, edgeFactor);

    // High frequency electric arc flickering
    float noise = hash(vUv * 100.0 + floor(uTime * 25.0));
    float electricArc = step(0.68, noise) * lineEdge * uArcActivity;

    // Rim inner glow
    float viewAngle = abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)));
    float rimGlow = pow(1.0 - viewAngle, 3.0) * (0.3 + uEnergy * 0.5);

    vec3 iceColor = vec3(0.863, 0.984, 1.0);
    vec3 blueColor = vec3(0.133, 0.722, 1.0);

    vec3 finalColor = mix(blueColor, iceColor, electricArc + rimGlow);
    float finalAlpha = (rimGlow * 0.5 + electricArc * 0.85);

    gl_FragColor = vec4(finalColor * 1.5, finalAlpha);
  }
`;

// 3. Wormhole Vortex Tunnel Shader
const wormholeVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const wormholeFragmentShader = `
  uniform float uTime;
  uniform float uEnergy;
  varying vec2 vUv;

  void main() {
    vec2 st = vUv;
    float zScroll = st.y * 12.0 - uTime * 2.5;
    float spiral = st.x * 24.0 + st.y * 8.0 + uTime * 1.8;

    float grid = abs(sin(spiral) * sin(zScroll));
    float lines = smoothstep(0.75, 0.95, grid);

    float depthFade = smoothstep(0.0, 0.35, st.y) * (1.0 - smoothstep(0.75, 1.0, st.y));

    vec3 ice = vec3(0.863, 0.984, 1.0);
    vec3 deep = vec3(0.027, 0.341, 1.0);
    vec3 color = mix(deep, ice, lines * 0.8);

    gl_FragColor = vec4(color * (0.7 + uEnergy * 0.4), lines * depthFade * 0.35 * uEnergy);
  }
`;

// 4. Space-Time Distortion Shockwave Shader
const shockwaveVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const shockwaveFragmentShader = `
  uniform float uTime;
  uniform float uEnergy;
  uniform float uPulseIntensity;
  varying vec2 vUv;

  void main() {
    vec2 center = vUv - vec2(0.5);
    float dist = length(center) * 2.0;

    float waveTime = fract(uTime * 0.45);
    float ringWidth = 0.08;
    float ring = smoothstep(waveTime - ringWidth, waveTime, dist) - smoothstep(waveTime, waveTime + ringWidth, dist);

    float fade = (1.0 - smoothstep(0.0, 1.0, dist)) * (1.0 - waveTime);
    float alpha = ring * fade * 0.6 * uPulseIntensity * uEnergy;

    vec3 color = mix(vec3(0.133, 0.722, 1.0), vec3(0.863, 0.984, 1.0), ring);
    gl_FragColor = vec4(color * 1.8, alpha);
  }
`;

// --- COMPONENTS ---

// 1. Tesseract Glass Shell (MeshPhysicalMaterial + Inner Glow + Electric Tendrils)
function TesseractGlassShell({ activity }: { activity: AiActivity }) {
  const innerGlowRef = useRef<THREE.ShaderMaterial>(null);
  const outerBoxRef = useRef<THREE.Mesh>(null);

  const isHighActivity = activity === "speaking" || activity === "thinking";

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);

    if (outerBoxRef.current) {
      outerBoxRef.current.rotation.y += delta * 0.15 * speed;
      outerBoxRef.current.rotation.x = Math.sin(time * 0.3) * 0.12;
    }

    if (innerGlowRef.current) {
      innerGlowRef.current.uniforms.uTime.value = time;
      innerGlowRef.current.uniforms.uEnergy.value = activityEnergy(activity);
      innerGlowRef.current.uniforms.uArcActivity.value = isHighActivity
        ? activity === "speaking" ? 1.4 : 1.0
        : 0.25;
    }
  });

  return (
    <group>
      {/* Khối Lập Phương Pha Lê 3D Nguyên Khối */}
      <mesh ref={outerBoxRef}>
        <boxGeometry args={[2.0, 2.0, 2.0]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.85}
          roughness={0.1}
          metalness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          ior={1.52}
          transparent
          opacity={0.92}
          reflectivity={0.9}
        />
      </mesh>

      {/* Quầng Sáng Nội Tại & Tia Sét Điện Ziczac (Inner Glow & Electric Tendrils) */}
      <mesh scale={0.98}>
        <boxGeometry args={[1.98, 1.98, 1.98]} />
        <shaderMaterial
          ref={innerGlowRef}
          vertexShader={shellGlowVertexShader}
          fragmentShader={shellGlowFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uEnergy: { value: 1 },
            uArcActivity: { value: 0.3 },
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

// 2. Volumetric Cosmic Nebula Core + Space Stone
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
      stoneRef.current.rotation.x += delta * 0.9 * speed;
      stoneRef.current.rotation.y += delta * 1.3 * speed;
      const pulse = 0.85 + Math.sin(time * 6.0) * 0.05 + energy * 0.12;
      stoneRef.current.scale.setScalar(pulse);
    }

    if (raysRef.current) {
      raysRef.current.rotation.z += delta * 0.4 * speed;
      raysRef.current.scale.setScalar(1 + Math.sin(time * 8.0) * 0.08 * energy);
    }
  });

  return (
    <group>
      {/* Tâm Mây Tinh Vân Vũ Trụ 3D (Custom 3D Noise Shader) */}
      <mesh scale={0.92}>
        <boxGeometry args={[1.75, 1.75, 1.75, 12, 12, 12]} />
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

      {/* Viên Đá Space Stone Hình Bát Diện & Rays Năng Lượng Xuyên Thấu */}
      <mesh ref={stoneRef}>
        <octahedronGeometry args={[0.18, 0]} />
        <meshBasicMaterial color={ICE} toneMapped={false} />
      </mesh>

      <group ref={raysRef}>
        {[0, Math.PI / 3, (2 * Math.PI) / 3].map((angle, index) => (
          <mesh key={index} rotation={[0, 0, angle]}>
            <planeGeometry args={[0.06, 1.8]} />
            <meshBasicMaterial
              color={ICE}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              opacity={0.4}
              transparent
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// 3. Electric Hypercube 4D Matrix (Vertices + Glowing Laser Edges)
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

    const a = time * 0.35 * speed;
    const b = time * 0.25 * speed;
    const c = time * 0.18 * speed;
    const ca = Math.cos(a), sa = Math.sin(a);
    const cb = Math.cos(b), sb = Math.sin(b);
    const cc = Math.cos(c), sc = Math.sin(c);

    // Compute 4D rotation and 3D projection
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
        const pulseScale = (0.045 + Math.sin(time * 8.0 + index) * 0.015) * energy;
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

    if (nodesRef.current) {
      nodesRef.current.instanceMatrix.needsUpdate = true;
    }

    if (lineRef.current) {
      lineRef.current.rotation.y += delta * 0.1 * speed;
      lineRef.current.scale.setScalar(activityPulse(activity, time));
    }
  });

  return (
    <group rotation={[0.2, -0.3, 0.08]}>
      {/* Sợi dây Laser Dạ Quang Hypercube 4D */}
      <lineSegments ref={lineRef} geometry={geometry}>
        <lineBasicMaterial
          color={ICE}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.9}
          toneMapped={false}
          transparent
        />
      </lineSegments>

      {/* Sợi dây phụ sắc xanh sâu DEEP SPACE */}
      <lineSegments geometry={geometry} scale={1.12}>
        <lineBasicMaterial
          color={DEEP}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.35}
          toneMapped={false}
          transparent
        />
      </lineSegments>

      {/* 16 Điểm Kết Nối Vertices Nhấp Nháy Hạt Sáng */}
      <instancedMesh ref={nodesRef} args={[undefined, undefined, 16]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial color={ICE} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

// 4. Space Wormhole Tunnel & Starlight Particle Vortex
function SpaceWormholeTunnel({ activity }: { activity: AiActivity }) {
  const wormholeShaderRef = useRef<THREE.ShaderMaterial>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const particleCount = 600;
  const { positions, initialAngles, initialRadii, speeds } = useMemo(() => {
    const random = seededRandom(1088);
    const pos = new Float32Array(particleCount * 3);
    const angles = new Float32Array(particleCount);
    const radii = new Float32Array(particleCount);
    const spds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const angle = random() * Math.PI * 2;
      const radius = 0.5 + random() * 3.8;
      const z = -6.0 + random() * 8.0;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = z;

      angles[i] = angle;
      radii[i] = radius;
      spds[i] = 0.4 + random() * 1.2;
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
        initialAngles[i] += delta * speeds[i] * 0.8 * speed;
        const currentAngle = initialAngles[i];
        let z = posArray[i * 3 + 2] + delta * speeds[i] * 2.2 * speed;
        if (z > 2.0) z = -6.0;

        const currentRadius = initialRadii[i] * (1.0 + (z + 6.0) * 0.15);

        posArray[i * 3] = Math.cos(currentAngle) * currentRadius;
        posArray[i * 3 + 1] = Math.sin(currentAngle) * currentRadius;
        posArray[i * 3 + 2] = z;
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group position={[0, 0, -2.2]}>
      {/* Phễu Đường Hầm Xoáy Lỗ Sâu Wormhole 3D */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.6, 4.8, 10, 32, 32, true]} />
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

      {/* Hạt Bụi Tinh Tú (Starlight Particles) Bị Hút / Bắn Tỏa */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={ICE}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.65}
          size={0.032}
          sizeAttenuation
          toneMapped={false}
          transparent
        />
      </points>
    </group>
  );
}

// 5. Space-time Distortion Shockwaves (Gravitational Ripples)
function SpacetimeDistortionShockwaves({ activity }: { activity: AiActivity }) {
  const shockwaveRef = useRef<THREE.ShaderMaterial>(null);

  const pulseIntensity = activity === "speaking" ? 1.6 : activity === "thinking" ? 1.1 : 0.2;

  useFrame(({ clock }) => {
    if (shockwaveRef.current) {
      shockwaveRef.current.uniforms.uTime.value = clock.elapsedTime;
      shockwaveRef.current.uniforms.uEnergy.value = activityEnergy(activity);
      shockwaveRef.current.uniforms.uPulseIntensity.value = pulseIntensity;
    }
  });

  return (
    <group position={[0, 0, -0.4]}>
      {[0, 0.4, 0.8].map((offset, idx) => (
        <mesh key={idx} scale={[4.5 + idx * 0.8, 4.5 + idx * 0.8, 1]}>
          <planeGeometry args={[1, 1]} />
          <shaderMaterial
            ref={idx === 0 ? shockwaveRef : undefined}
            vertexShader={shockwaveVertexShader}
            fragmentShader={shockwaveFragmentShader}
            uniforms={{
              uTime: { value: offset },
              uEnergy: { value: 1 },
              uPulseIntensity: { value: pulseIntensity },
            }}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

// --- MAIN SPACE SCENE ---
export function SpaceScene({ activity = "idle" }: { activity?: AiActivity }) {
  return (
    <group name="mcu-tesseract-space-scene" scale={1.25}>
      {/* 1. Cinematic Environment Lighting */}
      <ambientLight intensity={0.6} color={DEEP} />
      <pointLight position={[0, 0, 0]} intensity={5.0} distance={8} color={ICE} />
      <directionalLight position={[5, 5, 5]} intensity={2.2} color={BLUE} />
      <directionalLight position={[-5, -5, -5]} intensity={1.4} color={DEEP} />

      {/* 2. Wormhole Tunnel & Starlight Particle Vortex */}
      <SpaceWormholeTunnel activity={activity} />

      {/* 3. Space-time Gravitational Shockwaves */}
      <SpacetimeDistortionShockwaves activity={activity} />

      {/* 4. Electric 4D Hypercube Matrix */}
      <ElectricHypercube4D activity={activity} />

      {/* 5. Volumetric Cosmic Nebula Core & Space Stone */}
      <VolumetricCosmicNebulaCore activity={activity} />

      {/* 6. Translucent Tesseract Glass Shell */}
      <TesseractGlassShell activity={activity} />
    </group>
  );
}
