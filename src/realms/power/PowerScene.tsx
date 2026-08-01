import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AiActivity } from "../../App";
import { activityEnergy, activityPulse, activitySpeed, pathGeometry, seededRandom } from "../shared/coreMotion";

const VIOLET = "#8b3dff";
const MAGENTA = "#e14cff";
const ICE = "#eef1ff";

// --- GLSL SHADERS FOR BLACK HOLE SINGULARITY & GRAVITATIONAL LENSING ---

const lensVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const lensFragmentShader = `
  uniform float uTime;
  uniform float uEnergy;
  varying vec2 vUv;

  void main() {
    vec2 p = (vUv - vec2(0.5)) * 2.0;
    p.x *= 1.2;
    float r = length(p);
    float angle = atan(p.y, p.x);

    // Gravitational distortion rings
    float lens1 = smoothstep(0.02, 0.0, abs(r - (0.28 + 0.025 * sin(angle * 5.0 + uTime * 0.4))));
    float lens2 = smoothstep(0.03, 0.0, abs(r - (0.48 + 0.035 * sin(angle * 3.0 - uTime * 0.3))));
    float halo  = smoothstep(0.65, 0.25, r) * smoothstep(0.18, 0.32, r);

    vec3 colDeepViolet = vec3(0.545, 0.239, 1.0); // #8b3dff
    vec3 colNeonMag    = vec3(0.882, 0.298, 1.0); // #e14cff
    vec3 colQuantumIce = vec3(0.933, 0.945, 1.0); // #eef1ff

    vec3 color = mix(colDeepViolet, colNeonMag, lens1 + halo);
    color = mix(color, colQuantumIce, lens2);

    float alpha = (lens1 * 0.8 + lens2 * 0.6 + halo * 0.4) * uEnergy;
    gl_FragColor = vec4(color * 2.2, alpha);
  }
`;

const accretionVertexShader = `
  uniform float uTime;
  uniform float uSpeed;
  attribute float aSeed;
  varying float vSeed;

  void main() {
    vSeed = aSeed;
    float r = length(position.xy);
    // Inverse square orbital speed physics (1 / r^2)
    float speedFactor = 0.12 + 0.38 / (r * r + 0.05);
    float a = atan(position.y, position.x) + uTime * speedFactor * uSpeed;

    vec3 p = vec3(cos(a) * r, sin(a) * r, position.z + sin(uTime * 2.5 + aSeed * 14.0) * 0.02);
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);

    gl_PointSize = (2.2 + aSeed * 3.2) * (8.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const accretionFragmentShader = `
  uniform float uEnergy;
  varying float vSeed;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    float alpha = smoothstep(0.5, 0.0, d);

    vec3 colDeepViolet = vec3(0.545, 0.239, 1.0); // #8b3dff
    vec3 colNeonMag    = vec3(0.882, 0.298, 1.0); // #e14cff
    vec3 colQuantumIce = vec3(0.933, 0.945, 1.0); // #eef1ff

    vec3 color = mix(colDeepViolet, colNeonMag, vSeed);
    color = mix(color, colQuantumIce, pow(vSeed, 2.5));

    gl_FragColor = vec4(color * (1.2 + uEnergy * 0.6), alpha * (0.35 + vSeed * 0.65));
  }
`;

// 1. Tâm Lỗ Đen & Thấu Kính Hấp Dẫn (Singularity & Gravitational Lensing)
function BlackHoleSingularity({ activity }: { activity: AiActivity }) {
  const rootRef = useRef<THREE.Group>(null);
  const lensRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);

    if (rootRef.current) {
      rootRef.current.rotation.z += delta * 0.08 * speed;
      rootRef.current.scale.setScalar(activityPulse(activity, time, 1.6));
    }

    if (lensRef.current) {
      lensRef.current.uniforms.uTime.value = time;
      lensRef.current.uniforms.uEnergy.value = activityEnergy(activity);
    }
  });

  return (
    <group ref={rootRef}>
      {/* Absolute Black Hole Event Horizon Sphere */}
      <mesh position={[0, 0, 0.28]}>
        <sphereGeometry args={[0.36, 64, 64]} />
        <meshBasicMaterial color="#000000" toneMapped={false} />
      </mesh>

      {/* Gravitational Lensing Distortion Shader Ring */}
      <mesh position={[0, 0, 0.2]} scale={1.55}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          ref={lensRef}
          vertexShader={lensVertexShader}
          fragmentShader={lensFragmentShader}
          uniforms={{ uTime: { value: 0 }, uEnergy: { value: 1 } }}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          transparent
        />
      </mesh>
    </group>
  );
}

// 2. Đĩa Bồi Tụ Plasma Tím Rực Rỡ (Cosmic Plasma Accretion Disk - 2,200 Particles with 1/r^2 Physics)
function CosmicPlasmaAccretionDisk({ activity }: { activity: AiActivity }) {
  const pointsRef = useRef<THREE.Points>(null);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);

  const count = 2200;
  const { positions, seeds } = useMemo(() => {
    const random = seededRandom(7719);
    const posData = new Float32Array(count * 3);
    const seedData = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 0.52 + Math.pow(random(), 1.65) * 2.2;
      const angle = random() * Math.PI * 2;

      posData[i * 3] = Math.cos(angle) * radius;
      posData[i * 3 + 1] = Math.sin(angle) * radius;
      posData[i * 3 + 2] = (random() - 0.5) * (0.035 + radius * 0.08);

      seedData[i] = random();
    }
    return { positions: posData, seeds: seedData };
  }, []);

  useFrame(({ clock }) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = clock.elapsedTime;
      shaderRef.current.uniforms.uSpeed.value = activitySpeed(activity);
      shaderRef.current.uniforms.uEnergy.value = activityEnergy(activity);
    }
  });

  return (
    <points ref={pointsRef} rotation={[1.14, 0.18, -0.28]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={shaderRef}
        vertexShader={accretionVertexShader}
        fragmentShader={accretionFragmentShader}
        uniforms={{ uTime: { value: 0 }, uSpeed: { value: 1 }, uEnergy: { value: 1 } }}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        transparent
      />
    </points>
  );
}

// 3. Tia Cực Phản Vật Chất (Relativistic Polar Jets)
function RelativisticPolarJets({ activity }: { activity: AiActivity }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const time = clock.elapsedTime;
    const pulse = 0.85 + activityEnergy(activity) * 0.3 + Math.sin(time * 5.0) * 0.06;
    groupRef.current.scale.set(1, pulse, 1);
  });

  return (
    <group ref={groupRef} rotation={[0.12, 0.18, -0.28]}>
      {/* North Polar Jet */}
      <mesh position={[0, 1.85, -0.2]}>
        <coneGeometry args={[0.1, 3.2, 24, 1, true]} />
        <meshBasicMaterial
          color={ICE}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.3}
          side={THREE.DoubleSide}
          toneMapped={false}
          transparent
        />
      </mesh>

      {/* South Polar Jet */}
      <mesh position={[0, -1.85, -0.2]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.1, 3.2, 24, 1, true]} />
        <meshBasicMaterial
          color={MAGENTA}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.25}
          side={THREE.DoubleSide}
          toneMapped={false}
          transparent
        />
      </mesh>
    </group>
  );
}

// 4. Mảnh Tinh Thể Sức Mạnh (Power Crystal Shards - Collapsing to Singularity)
function PowerCrystalShards({ activity }: { activity: AiActivity }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const shardCount = 48;
  const shards = useMemo(() => {
    const random = seededRandom(514);
    return Array.from({ length: shardCount }, (_, index) => {
      const angle = (index / shardCount) * Math.PI * 2 + random() * 0.28;
      const radius = 1.1 + random() * 2.05;
      return {
        angle,
        radius,
        yScale: 0.12 + random() * 0.38,
        phase: random() * Math.PI * 2,
        z: -0.35 + (random() - 0.5) * 2.4,
      };
    });
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);

    // Inward collapse toward black hole core during thinking state
    const collapseFactor = activity === "thinking" ? 0.35 + Math.pow(Math.abs(Math.sin(time * 0.8)), 6) * 0.3 : 1.0;

    shards.forEach((shard, index) => {
      const angle = shard.angle + time * 0.04 * speed * (index % 2 ? 1 : -1);
      const radius = shard.radius * collapseFactor;

      dummy.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.72,
        shard.z + Math.sin(time * 0.6 + shard.phase) * 0.12
      );
      dummy.rotation.set(shard.phase + time * 0.2, angle, time * 0.25 + shard.phase);
      dummy.scale.set(0.08, shard.yScale, 0.08);
      dummy.updateMatrix();

      meshRef.current?.setMatrixAt(index, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, shardCount]}>
      <tetrahedronGeometry args={[1, 0]} />
      <meshPhysicalMaterial
        color="#7a42ff"
        emissive={VIOLET}
        emissiveIntensity={0.8}
        metalness={0.1}
        roughness={0.1}
        transmission={0.45}
        transparent
        opacity={0.82}
      />
    </instancedMesh>
  );
}

// Quantum Energy Filament Branches
function QuantumFilamentBranches({ activity }: { activity: AiActivity }) {
  const rootRef = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    const random = seededRandom(818);
    const paths: THREE.Vector3[][] = [];
    for (let branch = 0; branch < 16; branch += 1) {
      const baseAngle = (branch / 16) * Math.PI * 2;
      const points: THREE.Vector3[] = [];
      for (let index = 0; index <= 42; index += 1) {
        const t = index / 42;
        const split = t > 0.55 ? ((branch % 3) - 1) * (t - 0.55) * 0.72 : 0;
        const radius = 0.48 + t * (1.8 + random() * 0.35);
        points.push(
          new THREE.Vector3(
            Math.cos(baseAngle + split) * radius,
            Math.sin(baseAngle + split) * radius * 0.82,
            -0.4 - t * 0.95 + Math.sin(t * Math.PI * 2 + branch) * 0.16
          )
        );
      }
      paths.push(points);
    }
    return pathGeometry(paths);
  }, []);

  useFrame(({ clock }, delta) => {
    if (!rootRef.current) return;
    rootRef.current.rotation.z -= delta * 0.025 * activitySpeed(activity);
    rootRef.current.scale.setScalar(0.94 + activityEnergy(activity) * 0.08 + Math.sin(clock.elapsedTime * 0.7) * 0.015);
  });

  return (
    <group ref={rootRef} rotation={[0.14, -0.2, 0]}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial
          color={MAGENTA}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.4}
          toneMapped={false}
          transparent
        />
      </lineSegments>
    </group>
  );
}

// --- MAIN POWER SCENE ---
export function PowerScene({ activity = "idle" }: { activity?: AiActivity }) {
  return (
    <group name="quantum-power-singularity-mcu" scale={1.25}>
      <ambientLight intensity={0.5} color={VIOLET} />

      {/* 1. Quantum Filament Energy Branches */}
      <QuantumFilamentBranches activity={activity} />

      {/* 2. Collapsing Power Crystal Shards */}
      <PowerCrystalShards activity={activity} />

      {/* 3. Relativistic Polar Jets */}
      <RelativisticPolarJets activity={activity} />

      {/* 4. 2,200 Particle 1/r^2 Cosmic Accretion Disk */}
      <CosmicPlasmaAccretionDisk activity={activity} />

      {/* 5. Absolute Black Hole Event Horizon Singularity & Lensing */}
      <BlackHoleSingularity activity={activity} />
    </group>
  );
}
