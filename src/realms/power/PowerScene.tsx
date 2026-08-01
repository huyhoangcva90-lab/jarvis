import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AiActivity } from "../../App";
import { activityEnergy, activityPulse, activitySpeed, pathGeometry, seededRandom } from "../shared/coreMotion";

const VIOLET = "#8b3dff";
const MAGENTA = "#e14cff";
const ICE = "#eef1ff";

// --- GLSL SHADERS FOR PHOTON SPHERE & GRAVITATIONAL LENSING ---

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
    p.x *= 1.25;
    float r = length(p);
    float angle = atan(p.y, p.x);

    // Blazing Photon Sphere Ring directly framing the event horizon
    float photonRing = smoothstep(0.015, 0.0, abs(r - 0.52));
    float photonGlow = smoothstep(0.06, 0.0, abs(r - 0.52));

    // Gravitational lensing space warp distortion
    float lensWarp = smoothstep(0.03, 0.0, abs(r - (0.78 + 0.04 * sin(angle * 4.0 + uTime * 0.5))));
    float halo = smoothstep(0.95, 0.35, r) * smoothstep(0.25, 0.52, r);

    vec3 colViolet = vec3(0.545, 0.239, 1.0); // #8b3dff
    vec3 colMag    = vec3(0.882, 0.298, 1.0); // #e14cff
    vec3 colWhite  = vec3(0.933, 0.945, 1.0); // #eef1ff

    vec3 color = mix(colViolet, colMag, photonGlow + halo);
    color = mix(color, colWhite, photonRing * 1.5 + lensWarp);

    float alpha = (photonRing * 1.2 + photonGlow * 0.7 + lensWarp * 0.6 + halo * 0.45) * uEnergy;
    gl_FragColor = vec4(color * 2.5, alpha);
  }
`;

const accretionVertexShader = `
  uniform float uTime;
  uniform float uSpeed;
  attribute float aSeed;
  attribute float aArmOffset;
  varying float vSeed;

  void main() {
    vSeed = aSeed;
    float r = length(position.xy);

    // 1/r^2 inverse square orbital speed physics
    float speedFactor = 0.15 + 0.45 / (r * r + 0.04);
    float a = atan(position.y, position.x) + uTime * speedFactor * uSpeed + aArmOffset;

    // Spiral accretion arm turbulence
    vec3 p = vec3(cos(a) * r, sin(a) * r, position.z + sin(uTime * 3.0 + aSeed * 18.0) * 0.025);
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);

    gl_PointSize = (2.4 + aSeed * 3.6) * (9.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const accretionFragmentShader = `
  uniform float uEnergy;
  varying float vSeed;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    float alpha = smoothstep(0.5, 0.0, d);

    vec3 colViolet = vec3(0.545, 0.239, 1.0);
    vec3 colMag    = vec3(0.882, 0.298, 1.0);
    vec3 colWhite  = vec3(0.933, 0.945, 1.0);

    vec3 color = mix(colViolet, colMag, vSeed);
    color = mix(color, colWhite, pow(vSeed, 2.2));

    gl_FragColor = vec4(color * (1.3 + uEnergy * 0.7), alpha * (0.4 + vSeed * 0.6));
  }
`;

// 1. Black Hole Singularity & Photon Sphere
function BlackHoleSingularity({ activity }: { activity: AiActivity }) {
  const rootRef = useRef<THREE.Group>(null);
  const lensRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);

    if (rootRef.current) {
      rootRef.current.rotation.z += delta * 0.1 * speed;
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
      <mesh position={[0, 0, 0.35]}>
        <sphereGeometry args={[0.52, 64, 64]} />
        <meshBasicMaterial color="#000000" toneMapped={false} />
      </mesh>

      {/* Photon Sphere Ring & Gravitational Lensing Shader */}
      <mesh position={[0, 0, 0.25]} scale={1.85}>
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

// 2. Cosmic Plasma Accretion Disk (5,000+ Particles with 1/r^2 Physics)
function CosmicPlasmaAccretionDisk({ activity }: { activity: AiActivity }) {
  const shaderRef = useRef<THREE.ShaderMaterial>(null);

  const count = 5000;
  const { positions, seeds, armOffsets } = useMemo(() => {
    const random = seededRandom(9918);
    const posData = new Float32Array(count * 3);
    const seedData = new Float32Array(count);
    const armData = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 0.55 + Math.pow(random(), 1.5) * 2.5;
      const angle = random() * Math.PI * 2;
      const arm = (i % 3) * ((Math.PI * 2) / 3);

      posData[i * 3] = Math.cos(angle) * radius;
      posData[i * 3 + 1] = Math.sin(angle) * radius;
      posData[i * 3 + 2] = (random() - 0.5) * (0.04 + radius * 0.08);

      seedData[i] = random();
      armData[i] = arm;
    }
    return { positions: posData, seeds: seedData, armOffsets: armData };
  }, []);

  useFrame(({ clock }) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = clock.elapsedTime;
      shaderRef.current.uniforms.uSpeed.value = activitySpeed(activity);
      shaderRef.current.uniforms.uEnergy.value = activityEnergy(activity);
    }
  });

  return (
    <points rotation={[1.14, 0.18, -0.28]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
        <bufferAttribute attach="attributes-aArmOffset" args={[armOffsets, 1]} />
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

// 3. Relativistic Polar Jets (Full Viewport Height)
function RelativisticPolarJets({ activity }: { activity: AiActivity }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const time = clock.elapsedTime;
    const pulse = 0.9 + activityEnergy(activity) * 0.35 + Math.sin(time * 6.0) * 0.08;
    groupRef.current.scale.set(1, pulse, 1);
  });

  return (
    <group ref={groupRef} rotation={[0.12, 0.18, -0.28]}>
      {/* North Polar Jet (Inner Core + Outer Shear Cone) */}
      <mesh position={[0, 2.4, -0.2]}>
        <coneGeometry args={[0.14, 4.8, 32, 1, true]} />
        <meshBasicMaterial
          color={ICE}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.35}
          side={THREE.DoubleSide}
          toneMapped={false}
          transparent
        />
      </mesh>
      <mesh position={[0, 2.4, -0.2]} scale={[1.4, 1.0, 1.4]}>
        <coneGeometry args={[0.14, 4.8, 32, 1, true]} />
        <meshBasicMaterial
          color={MAGENTA}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.2}
          side={THREE.DoubleSide}
          toneMapped={false}
          transparent
        />
      </mesh>

      {/* South Polar Jet */}
      <mesh position={[0, -2.4, -0.2]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.14, 4.8, 32, 1, true]} />
        <meshBasicMaterial
          color={MAGENTA}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.3}
          side={THREE.DoubleSide}
          toneMapped={false}
          transparent
        />
      </mesh>
    </group>
  );
}

// 4. Power Crystal Shards & Quantum Arcs (64 Shards in Inclined Orbits)
function PowerCrystalShardsAndLightning({ activity }: { activity: AiActivity }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const shardCount = 64;
  const shards = useMemo(() => {
    const random = seededRandom(1088);
    return Array.from({ length: shardCount }, (_, index) => {
      const angle = (index / shardCount) * Math.PI * 2 + random() * 0.3;
      const radius = 1.2 + random() * 2.2;
      return {
        angle,
        radius,
        yScale: 0.14 + random() * 0.42,
        phase: random() * Math.PI * 2,
        z: -0.4 + (random() - 0.5) * 2.8,
      };
    });
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);

    // Inward collapse toward black hole core during thinking state
    const collapseFactor = activity === "thinking" ? 0.3 + Math.pow(Math.abs(Math.sin(time * 0.8)), 6) * 0.3 : 1.0;

    shards.forEach((shard, index) => {
      const angle = shard.angle + time * 0.045 * speed * (index % 2 ? 1 : -1);
      const radius = shard.radius * collapseFactor;

      dummy.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.72,
        shard.z + Math.sin(time * 0.7 + shard.phase) * 0.14
      );
      dummy.rotation.set(shard.phase + time * 0.22, angle, time * 0.28 + shard.phase);
      dummy.scale.set(0.09, shard.yScale, 0.09);
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
        emissiveIntensity={1.0}
        metalness={0.1}
        roughness={0.08}
        transmission={0.52}
        transparent
        opacity={0.88}
      />
    </instancedMesh>
  );
}

// Quantum Filament Branches
function QuantumFilamentBranches({ activity }: { activity: AiActivity }) {
  const rootRef = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    const random = seededRandom(818);
    const paths: THREE.Vector3[][] = [];
    for (let branch = 0; branch < 18; branch += 1) {
      const baseAngle = (branch / 18) * Math.PI * 2;
      const points: THREE.Vector3[] = [];
      for (let index = 0; index <= 42; index += 1) {
        const t = index / 42;
        const split = t > 0.55 ? ((branch % 3) - 1) * (t - 0.55) * 0.72 : 0;
        const radius = 0.5 + t * (2.0 + random() * 0.4);
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
    rootRef.current.rotation.z -= delta * 0.028 * activitySpeed(activity);
    rootRef.current.scale.setScalar(0.94 + activityEnergy(activity) * 0.08 + Math.sin(clock.elapsedTime * 0.7) * 0.015);
  });

  return (
    <group ref={rootRef} rotation={[0.14, -0.2, 0]}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial
          color={MAGENTA}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.42}
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
    <group name="quantum-power-singularity-mcu" scale={1.28}>
      <ambientLight intensity={0.6} color={VIOLET} />

      {/* 1. Quantum Filament Energy Branches */}
      <QuantumFilamentBranches activity={activity} />

      {/* 2. 64 Collapsing Power Crystal Shards */}
      <PowerCrystalShardsAndLightning activity={activity} />

      {/* 3. Full-Height Relativistic Polar Jets */}
      <RelativisticPolarJets activity={activity} />

      {/* 4. 5,000+ Particle 1/r^2 Cosmic Accretion Galaxy Disk */}
      <CosmicPlasmaAccretionDisk activity={activity} />

      {/* 5. Absolute Black Hole Event Horizon Singularity & Photon Sphere */}
      <BlackHoleSingularity activity={activity} />
    </group>
  );
}
