import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AiActivity } from "../../App";
import { activityEnergy, activityPulse, activitySpeed, seededRandom } from "../shared/coreMotion";

const CRIMSON = "#ff203c";
const AETHER = "#ff4b56";
const GOLD = "#ffc35a";

// --- GLSL SHADERS FOR AETHER BLOB & REALITY FRACTURE ---

const aetherVertexShader = `
  uniform float uTime;
  uniform float uEnergy;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;

  // 3D Simplex noise generator
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

    // Organic liquid Aether fluid deformation
    float noise1 = snoise(position * 1.5 + vec3(0.0, uTime * 0.8, uTime * 0.5));
    float noise2 = snoise(position * 3.2 - vec3(uTime * 0.6, uTime * 0.9, 0.0));
    float displacement = (noise1 * 0.22 + noise2 * 0.12) * (0.8 + uEnergy * 0.6);

    vec3 newPos = position + normal * displacement;
    vWorldPosition = (modelMatrix * vec4(newPos, 1.0)).xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
`;

const aetherFragmentShader = `
  uniform float uTime;
  uniform float uEnergy;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;

  void main() {
    // Swirling crimson liquid blood vein math
    float veinPattern = pow(abs(sin(vPosition.x * 12.0 + sin(vPosition.y * 10.0 + uTime * 2.5))), 10.0);
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.4);

    vec3 colDeepDark = vec3(0.12, 0.0, 0.03);
    vec3 colCrimson  = vec3(1.0, 0.094, 0.235); // #ff203c
    vec3 colGold     = vec3(1.0, 0.765, 0.353); // #ffc35a

    vec3 baseColor = mix(colDeepDark, colCrimson, fresnel * 0.85 + 0.25);
    baseColor = mix(baseColor, colGold, veinPattern * 0.9);

    float alpha = (0.55 + fresnel * 0.45 + veinPattern * 0.3) * uEnergy;
    gl_FragColor = vec4(baseColor * (0.9 + uEnergy * 0.5), alpha);
  }
`;

const fractureFragmentShader = `
  uniform float uTime;
  uniform float uEnergy;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main() {
    vec2 st = (vUv - vec2(0.5)) * 7.0;
    vec2 id = floor(st);
    vec2 f  = fract(st) - vec2(0.5);

    float n = hash(id);
    // Voronoi glass shard reality cracks
    float crack = smoothstep(0.045, 0.0, abs(f.x + f.y * (n - 0.5) * 2.2));
    float pulse = 0.4 + 0.6 * pow(abs(sin(uTime * 0.8 + n * 6.28)), 6.0);

    vec3 colCrimson = vec3(1.0, 0.094, 0.235); // #ff203c
    vec3 colGold    = vec3(1.0, 0.765, 0.353); // #ffc35a
    vec3 color = mix(colCrimson, colGold, pulse);

    float alpha = crack * pulse * 0.35 * uEnergy;
    gl_FragColor = vec4(color * 2.2, alpha);
  }
`;

// --- COMPONENTS ---

// 1. Sinh Thể Chất Lỏng Aether 3D (Volumetric Aether Blob)
function VolumetricAetherBlob({ activity }: { activity: AiActivity }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  const lobesRef = useRef<THREE.Group>(null);

  const lobes = useMemo(() => [
    { base: [-0.65, 0.25, -0.1] as [number, number, number], scale: [0.55, 0.42, 0.45] as [number, number, number], phase: 0.3 },
    { base: [0.6, -0.15, 0.05] as [number, number, number], scale: [0.45, 0.6, 0.42] as [number, number, number], phase: 1.5 },
    { base: [0.1, 0.7, -0.15] as [number, number, number], scale: [0.38, 0.5, 0.35] as [number, number, number], phase: 2.7 },
    { base: [-0.15, -0.72, -0.1] as [number, number, number], scale: [0.42, 0.48, 0.38] as [number, number, number], phase: 4.1 },
  ], []);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);
    const energy = activityEnergy(activity);

    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.15 * speed;
      coreRef.current.rotation.z = Math.sin(time * 0.2) * 0.1;
      coreRef.current.scale.setScalar(activityPulse(activity, time, 0.8));
    }

    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = time;
      shaderRef.current.uniforms.uEnergy.value = energy;
    }

    if (lobesRef.current) {
      lobesRef.current.children.forEach((child, index) => {
        const lobe = lobes[index];
        if (!lobe) return;
        child.position.set(
          lobe.base[0] + Math.sin(time * 0.8 * speed + lobe.phase) * 0.12,
          lobe.base[1] + Math.cos(time * 0.65 * speed + lobe.phase) * 0.1,
          lobe.base[2] + Math.sin(time * 0.5 * speed + lobe.phase) * 0.14
        );
        const pulse = 1.0 + Math.sin(time * 3.0 + lobe.phase) * 0.1 * energy;
        child.scale.set(lobe.scale[0] * pulse, lobe.scale[1] / pulse, lobe.scale[2] * pulse);
      });
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Biến Dạng Sinh Học Lỏng Aether 3D Core Mesh */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.82, 32]} />
        <shaderMaterial
          ref={shaderRef}
          vertexShader={aetherVertexShader}
          fragmentShader={aetherFragmentShader}
          uniforms={{ uTime: { value: 0 }, uEnergy: { value: 1 } }}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          transparent
        />
      </mesh>

      {/* Các Thùy Sóng Nhịp Đập Aether (Aether Wave Lobes) */}
      <group ref={lobesRef}>
        {lobes.map((lobe, index) => (
          <mesh key={index} position={lobe.base} scale={lobe.scale}>
            <icosahedronGeometry args={[1, 16]} />
            <meshStandardMaterial
              color="#3a0009"
              emissive={index % 2 === 0 ? CRIMSON : AETHER}
              emissiveIntensity={1.8}
              metalness={0.1}
              roughness={0.3}
              transparent
              opacity={0.82}
            />
          </mesh>
        ))}
      </group>

      <pointLight color={CRIMSON} intensity={3.5} distance={5} decay={2} />
    </group>
  );
}

// 2. Vết Nứt Thực Tại Vỡ Thủy Tinh (Spatial Reality Fracture Grid)
function SpatialRealityFractureGrid({ activity }: { activity: AiActivity }) {
  const fractureRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (fractureRef.current) {
      fractureRef.current.uniforms.uTime.value = clock.elapsedTime;
      fractureRef.current.uniforms.uEnergy.value = activityEnergy(activity);
    }
  });

  return (
    <mesh position={[0, 0, -1.6]} scale={[5.8, 4.4, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={fractureRef}
        vertexShader={`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`}
        fragmentShader={fractureFragmentShader}
        uniforms={{ uTime: { value: 0 }, uEnergy: { value: 1 } }}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        transparent
      />
    </mesh>
  );
}

// 3. Vành Đai Cột Đá Rune Cổ Đại (Runic Monolith Ring - Exactly 22 Columns)
function RunicMonolithRing({ activity }: { activity: AiActivity }) {
  const stonesRef = useRef<THREE.InstancedMesh>(null);
  const runesRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const stoneCount = 22;
  const monoliths = useMemo(() => {
    const random = seededRandom(2026);
    return Array.from({ length: stoneCount }, (_, index) => {
      const angle = (index / stoneCount) * Math.PI * 2;
      return {
        angle,
        radius: 2.1 + (random() - 0.5) * 0.35,
        height: 0.7 + random() * 0.5,
        z: -0.6 + (random() - 0.5) * 0.6,
        tilt: (random() - 0.5) * 0.3,
        phase: random() * Math.PI * 2,
      };
    });
  }, []);

  useFrame(({ clock }) => {
    if (!stonesRef.current || !runesRef.current) return;
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);

    monoliths.forEach((stone, index) => {
      const currentAngle = stone.angle + time * 0.03 * speed;
      const hoverY = Math.sin(time * 0.8 + stone.phase) * 0.08;
      const x = Math.cos(currentAngle) * stone.radius;
      const y = Math.sin(currentAngle) * stone.radius * 0.65 + hoverY;

      // Render 3D Dark Monolith Column
      dummy.position.set(x, y, stone.z);
      dummy.rotation.set(stone.tilt, -0.2, currentAngle + Math.PI / 2);
      dummy.scale.set(0.18, stone.height, 0.12);
      dummy.updateMatrix();
      stonesRef.current?.setMatrixAt(index, dummy.matrix);

      // Render Glowing Runic Script Etching on Column Face
      dummy.position.set(x * 1.004, y * 1.004, stone.z + 0.07);
      dummy.rotation.set(0, 0, currentAngle + Math.PI / 2);
      dummy.scale.set(0.11, 0.04, 0.015);
      dummy.updateMatrix();
      runesRef.current?.setMatrixAt(index, dummy.matrix);
    });

    stonesRef.current.instanceMatrix.needsUpdate = true;
    runesRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group rotation={[0.15, -0.06, 0.08]}>
      {/* 22 Cột Đá U Tối Cổ Đại */}
      <instancedMesh ref={stonesRef} args={[undefined, undefined, stoneCount]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#1a0408"
          emissive="#4a050d"
          emissiveIntensity={0.6}
          metalness={0.2}
          roughness={0.8}
        />
      </instancedMesh>

      {/* Ký Tự Rune Cổ Phát Sáng Vàng Kim #ffc35a & Đỏ #ff203c */}
      <instancedMesh ref={runesRef} args={[undefined, undefined, stoneCount]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={GOLD} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

// 4. Tàn Tro Năng Lượng (Reality Dust Embers - Thanos Dissolve Effect)
function RealityDustEmbers({ activity }: { activity: AiActivity }) {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 600;

  const { positions, velocities } = useMemo(() => {
    const random = seededRandom(8812);
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (random() - 0.5) * 5.5;
      pos[i * 3 + 1] = (random() - 0.5) * 4.5;
      pos[i * 3 + 2] = (random() - 0.5) * 3.5 - 0.3;

      vel[i * 3] = (random() - 0.5) * 0.4;
      vel[i * 3 + 1] = 0.3 + random() * 0.8; // Drifting upwards
      vel[i * 3 + 2] = (random() - 0.5) * 0.4;
    }
    return { positions: pos, velocities: vel };
  }, []);

  useFrame((_, delta) => {
    if (!particlesRef.current) return;
    const posAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const posArr = posAttr.array as Float32Array;

    const speed = activitySpeed(activity);

    for (let i = 0; i < count; i++) {
      posArr[i * 3] += velocities[i * 3] * delta * speed;
      posArr[i * 3 + 1] += velocities[i * 3 + 1] * delta * speed;
      posArr[i * 3 + 2] += velocities[i * 3 + 2] * delta * speed;

      // Loop particles back to bottom when they drift out
      if (posArr[i * 3 + 1] > 2.5) {
        posArr[i * 3 + 1] = -2.5;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={AETHER}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        opacity={0.65}
        size={0.035}
        sizeAttenuation
        toneMapped={false}
        transparent
      />
    </points>
  );
}

// --- MAIN REALITY SCENE ---
export function RealityScene({ activity = "idle" }: { activity?: AiActivity }) {
  return (
    <group name="reality-aether-forge-mcu" scale={1.25}>
      <ambientLight intensity={0.5} color={CRIMSON} />

      {/* 1. Spatial Reality Glass Fracture Grid */}
      <SpatialRealityFractureGrid activity={activity} />

      {/* 2. Thanos Reality Dust Embers */}
      <RealityDustEmbers activity={activity} />

      {/* 3. 22 Runic Monolith Ring */}
      <RunicMonolithRing activity={activity} />

      {/* 4. Volumetric Liquid Aether Blob */}
      <VolumetricAetherBlob activity={activity} />
    </group>
  );
}
