import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AiActivity } from "../../App";
import { activityEnergy, activityPulse, activitySpeed, pathGeometry, seededRandom, segmentGeometry } from "../shared/coreMotion";

const EMERALD = "#23e777";
const MINT = "#66ff9f";
const PALE = "#e0ffea";
const BRONZE = "#8c6721";

// --- GLSL SHADERS FOR MYSTIC MANDALA & TIME LOOP ---

const mandalaVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const mandalaFragmentShader = `
  uniform float uTime;
  uniform float uEnergy;
  uniform float uDirection;
  varying vec2 vUv;

  void main() {
    vec2 p = vUv - vec2(0.5);
    float r = length(p) * 2.0;
    float angle = atan(p.y, p.x);

    // Concentric magical glyph circles
    float ring1 = smoothstep(0.02, 0.0, abs(r - 0.42));
    float ring2 = smoothstep(0.015, 0.0, abs(r - 0.75));
    float ring3 = smoothstep(0.01, 0.0, abs(r - 0.94));

    // Rosette petalled pattern (8-fold and 16-fold eldritch symmetry)
    float petals8 = abs(cos(angle * 8.0 + uTime * 0.8 * uDirection));
    float petals16 = abs(sin(angle * 16.0 - uTime * 1.2 * uDirection));
    float pattern = smoothstep(0.65, 0.98, petals8 * (1.0 - abs(r - 0.58) * 3.0));
    float patternOuter = smoothstep(0.7, 0.99, petals16 * (1.0 - abs(r - 0.85) * 4.0));

    // Ancient glyph notches on outer ring
    float notches = step(0.85, sin(angle * 24.0 + uTime * 0.5 * uDirection)) * ring3;

    float mandala = ring1 + ring2 + ring3 + pattern * 0.8 + patternOuter * 0.9 + notches;

    vec3 colEmerald = vec3(0.137, 0.905, 0.466); // #23e777
    vec3 colMint    = vec3(0.400, 1.000, 0.623); // #66ff9f
    vec3 color = mix(colEmerald, colMint, r);

    float alpha = (mandala * 0.75) * uEnergy * smoothstep(1.0, 0.8, r);
    gl_FragColor = vec4(color * 1.8, alpha);
  }
`;

const timeLoopShader = `
  uniform float uTime;
  uniform float uEnergy;
  uniform float uReversing;
  varying vec2 vUv;

  void main() {
    vec2 p = vUv - vec2(0.5);
    float dist = length(p) * 2.0;

    // Time loop expanding outwards then contracting back to core
    float cycle = fract(uTime * 0.5);
    float loopWave = uReversing > 0.5 ? (1.0 - cycle) : cycle;

    float width = 0.07;
    float ring = smoothstep(loopWave - width, loopWave, dist) - smoothstep(loopWave, loopWave + width, dist);
    float fade = (1.0 - dist) * (1.0 - abs(loopWave - dist));

    vec3 mint = vec3(0.4, 1.0, 0.62);
    vec3 pale = vec3(0.878, 1.0, 0.918);
    vec3 col = mix(mint, pale, ring);

    float alpha = ring * fade * 0.7 * uEnergy;
    gl_FragColor = vec4(col * 2.0, alpha);
  }
`;

// --- HELPER TO GENERATE 3D EXTRUDED GEAR GEOMETRY ---
function createGearGeometry(radius: number, teeth: number, depth: number) {
  const shape = new THREE.Shape();
  const toothDepth = radius * 0.14;
  const toothWidth = (Math.PI * 2) / teeth;

  for (let i = 0; i < teeth; i++) {
    const angle = i * toothWidth;
    const a1 = angle;
    const a2 = angle + toothWidth * 0.28;
    const a3 = angle + toothWidth * 0.52;
    const a4 = angle + toothWidth * 0.78;

    const rInner = radius;
    const rOuter = radius + toothDepth;

    if (i === 0) {
      shape.moveTo(Math.cos(a1) * rInner, Math.sin(a1) * rInner);
    } else {
      shape.lineTo(Math.cos(a1) * rInner, Math.sin(a1) * rInner);
    }

    shape.lineTo(Math.cos(a2) * rOuter, Math.sin(a2) * rOuter);
    shape.lineTo(Math.cos(a3) * rOuter, Math.sin(a3) * rOuter);
    shape.lineTo(Math.cos(a4) * rInner, Math.sin(a4) * rInner);
  }

  // Inner hole
  const holePath = new THREE.Path();
  const holeRadius = radius * 0.65;
  for (let i = 0; i <= 32; i++) {
    const a = (i / 32) * Math.PI * 2;
    const x = Math.cos(a) * holeRadius;
    const y = Math.sin(a) * holeRadius;
    if (i === 0) holePath.moveTo(x, y);
    else holePath.lineTo(x, y);
  }
  shape.holes.push(holePath);

  const extrudeSettings = {
    depth: depth,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.015,
    bevelThickness: 0.015,
  };

  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}

// 1. Mechanical Agamotto Shutter (Bronze Blades + Time Stone Core)
function MechanicalAgamottoShutter({ activity }: { activity: AiActivity }) {
  const rootRef = useRef<THREE.Group>(null);
  const bladesRef = useRef<THREE.Group>(null);
  const stoneRef = useRef<THREE.Mesh>(null);
  const apertureRef = useRef(0);

  const bladeCount = 8;
  const bladeShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(0.6, 0.25, 1.1, 0.05);
    shape.lineTo(1.2, 0.45);
    shape.quadraticCurveTo(0.6, 0.75, 0, 0.55);
    shape.closePath();

    const extrudeSettings = { depth: 0.04, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01 };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);

    // Target aperture opening: idle = closed (0.15), speaking/thinking = fully open (0.85)
    const targetAperture = activity === "speaking" || activity === "thinking" ? 0.88 : activity === "listening" ? 0.45 : 0.18;
    apertureRef.current = THREE.MathUtils.lerp(apertureRef.current, targetAperture, 0.08);

    if (rootRef.current) {
      rootRef.current.scale.set(activityPulse(activity, time), activity === "listening" ? 0.92 : 1, 1);
      rootRef.current.rotation.y = Math.sin(time * 0.25) * 0.12;
    }

    if (bladesRef.current) {
      bladesRef.current.children.forEach((blade, index) => {
        const baseAngle = (index * Math.PI * 2) / bladeCount;
        const slideOffset = apertureRef.current * 0.48;
        const rotOffset = apertureRef.current * 0.55;

        blade.position.x = Math.cos(baseAngle) * slideOffset;
        blade.position.y = Math.sin(baseAngle) * slideOffset;
        blade.rotation.z = baseAngle + rotOffset;
      });
    }

    if (stoneRef.current) {
      stoneRef.current.rotation.y += delta * 1.4 * speed;
      stoneRef.current.rotation.x = Math.sin(time * 0.8) * 0.3;
      const stoneScale = 0.85 + activityEnergy(activity) * 0.18 + Math.sin(time * 7.0) * 0.05;
      stoneRef.current.scale.setScalar(stoneScale);
    }
  });

  return (
    <group ref={rootRef}>
      {/* Khung Mắt Đồng Thau Cố Định Outer Frame */}
      <mesh position={[0, 0, -0.05]}>
        <torusGeometry args={[1.35, 0.08, 16, 48]} />
        <meshStandardMaterial color={BRONZE} metalness={0.88} roughness={0.25} emissive={EMERALD} emissiveIntensity={0.15} />
      </mesh>

      {/* 8 Lá Khẩu Độ Kim Loại Đồng Thau (Bronze Shutter Blades) */}
      <group ref={bladesRef} position={[0, 0, 0.02]}>
        {Array.from({ length: bladeCount }, (_, index) => (
          <mesh key={index} geometry={bladeShape}>
            <meshStandardMaterial
              color={BRONZE}
              metalness={0.85}
              roughness={0.22}
              emissive={EMERALD}
              emissiveIntensity={0.12}
            />
          </mesh>
        ))}
      </group>

      {/* Viên Đá Time Stone Phát Sáng Rực Rỡ Ở Tâm */}
      <mesh ref={stoneRef} position={[0, 0, 0.18]}>
        <octahedronGeometry args={[0.26, 1]} />
        <meshStandardMaterial
          color="#0a8f45"
          emissive={EMERALD}
          emissiveIntensity={2.8}
          metalness={0.2}
          roughness={0.05}
          toneMapped={false}
        />
      </mesh>

      {/* Nguồn Sáng Tâm Đèn Xanh Lục Bảo */}
      <pointLight position={[0, 0, 0.22]} color={EMERALD} intensity={4.5} distance={5.5} decay={2} />
    </group>
  );
}

// 2. Eldritch Time Mandalas (Mystic Mandala Arrays)
function EldritchTimeMandalas({ activity }: { activity: AiActivity }) {
  const mandala1Ref = useRef<THREE.ShaderMaterial>(null);
  const mandala2Ref = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);

  const isThinking = activity === "thinking";

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    const energy = activityEnergy(activity);
    const direction = isThinking ? -1 : 1;

    if (mandala1Ref.current) {
      mandala1Ref.current.uniforms.uTime.value = time;
      mandala1Ref.current.uniforms.uEnergy.value = energy;
      mandala1Ref.current.uniforms.uDirection.value = direction;
    }

    if (mandala2Ref.current) {
      mandala2Ref.current.uniforms.uTime.value = time * 0.8;
      mandala2Ref.current.uniforms.uEnergy.value = energy * 0.9;
      mandala2Ref.current.uniforms.uDirection.value = -direction;
    }

    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(time * 0.15) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Đĩa Ma Thuật Phù Chú 1 (Inner Mandala) */}
      <mesh position={[0, 0, -0.12]} scale={[3.4, 3.4, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          ref={mandala1Ref}
          vertexShader={mandalaVertexShader}
          fragmentShader={mandalaFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uEnergy: { value: 1 },
            uDirection: { value: 1 },
          }}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          transparent
        />
      </mesh>

      {/* Đĩa Ma Thuật Phù Chú 2 (Outer Mandala) */}
      <mesh position={[0, 0, -0.28]} scale={[4.8, 4.8, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          ref={mandala2Ref}
          vertexShader={mandalaVertexShader}
          fragmentShader={mandalaFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uEnergy: { value: 1 },
            uDirection: { value: -1 },
          }}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          transparent
        />
      </mesh>
    </group>
  );
}

// 3. Extruded Chronal Gears (Ma Trận Bánh Răng Thời Gian 3D)
function ExtrudedChronalGears({ activity }: { activity: AiActivity }) {
  const gear1Ref = useRef<THREE.Mesh>(null);
  const gear2Ref = useRef<THREE.Mesh>(null);
  const gear3Ref = useRef<THREE.Mesh>(null);

  const gear1Geom = useMemo(() => createGearGeometry(1.05, 12, 0.08), []);
  const gear2Geom = useMemo(() => createGearGeometry(1.55, 18, 0.08), []);
  const gear3Geom = useMemo(() => createGearGeometry(2.1, 24, 0.08), []);

  useFrame((_, delta) => {
    const speed = activitySpeed(activity);
    // TUA NGƯỢC CHIỀU xoay khi thinking (reverse rotation)
    const direction = activity === "thinking" ? -1.0 : 1.0;

    if (gear1Ref.current) gear1Ref.current.rotation.z += delta * 0.35 * speed * direction;
    if (gear2Ref.current) gear2Ref.current.rotation.z -= delta * 0.22 * speed * direction;
    if (gear3Ref.current) gear3Ref.current.rotation.z += delta * 0.14 * speed * direction;
  });

  return (
    <group position={[0, 0, -0.35]}>
      {/* Bánh Răng 1 (Trong) */}
      <mesh ref={gear1Ref} geometry={gear1Geom} position={[0, 0, 0]}>
        <meshStandardMaterial color={BRONZE} metalness={0.82} roughness={0.28} emissive={MINT} emissiveIntensity={0.25} />
      </mesh>

      {/* Bánh Răng 2 (Giữa) */}
      <mesh ref={gear2Ref} geometry={gear2Geom} position={[0, 0, -0.06]}>
        <meshStandardMaterial color={BRONZE} metalness={0.85} roughness={0.25} emissive={EMERALD} emissiveIntensity={0.2} />
      </mesh>

      {/* Bánh Răng 3 (Ngoài) */}
      <mesh ref={gear3Ref} geometry={gear3Geom} position={[0, 0, -0.12]}>
        <meshStandardMaterial color={BRONZE} metalness={0.88} roughness={0.22} emissive={MINT} emissiveIntensity={0.18} />
      </mesh>
    </group>
  );
}

// 4. Timeline Ribbon Streams (Dải Năng Lượng Multiverse)
function TimelineRibbonStreams({ activity }: { activity: AiActivity }) {
  const streamGroup = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.InstancedMesh>(null);

  const particleCount = 48;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const curves = useMemo(() => {
    const list: THREE.CatmullRomCurve3[] = [];
    const random = seededRandom(452);

    for (let b = 0; b < 6; b++) {
      const side = b % 2 === 0 ? 1 : -1;
      const points: THREE.Vector3[] = [];

      for (let i = 0; i <= 5; i++) {
        const t = i / 5;
        points.push(
          new THREE.Vector3(
            side * (0.4 + t * 2.2 + random() * 0.2),
            (b - 2.5) * 0.45 + Math.sin(t * Math.PI * 1.5 + b) * 0.4,
            -0.3 - t * 0.8 + Math.cos(t * Math.PI) * 0.3
          )
        );
      }
      list.push(new THREE.CatmullRomCurve3(points));
    }
    return list;
  }, []);

  const tubeGeometries = useMemo(() => {
    return curves.map((curve) => new THREE.TubeGeometry(curve, 40, 0.018, 8, false));
  }, [curves]);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);

    if (streamGroup.current) {
      streamGroup.current.position.z = Math.sin(time * 0.4) * 0.06;
    }

    if (particlesRef.current) {
      curves.forEach((curve, cIdx) => {
        for (let p = 0; p < 8; p++) {
          const index = cIdx * 8 + p;
          const progress = (time * 0.25 * speed + (p / 8) + cIdx * 0.15) % 1.0;
          const pt = curve.getPoint(progress);

          dummy.position.copy(pt);
          dummy.scale.setScalar(0.038 + Math.sin(progress * Math.PI) * 0.02);
          dummy.updateMatrix();
          particlesRef.current?.setMatrixAt(index, dummy.matrix);
        }
      });
      particlesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={streamGroup}>
      {tubeGeometries.map((geom, idx) => (
        <mesh key={idx} geometry={geom}>
          <meshBasicMaterial
            color={MINT}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            opacity={0.48}
            transparent
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Hạt Năng Lượng Chạy Dọc Dải Thời Gian Multiverse */}
      <instancedMesh ref={particlesRef} args={[undefined, undefined, particleCount]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color={PALE} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

// 5. Time Loop Shockwaves (Hiệu Ứng Sóng Xung Kích Vòng Lặp Thời Gian)
function TimeLoopShockwaves({ activity }: { activity: AiActivity }) {
  const shockwaveMaterial = useRef<THREE.ShaderMaterial>(null);

  const isReversing = activity === "thinking";

  useFrame(({ clock }) => {
    if (shockwaveMaterial.current) {
      shockwaveMaterial.current.uniforms.uTime.value = clock.elapsedTime;
      shockwaveMaterial.current.uniforms.uEnergy.value = activityEnergy(activity);
      shockwaveMaterial.current.uniforms.uReversing.value = isReversing ? 1.0 : 0.0;
    }
  });

  return (
    <mesh position={[0, 0, -0.08]} scale={[4.2, 4.2, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={shockwaveMaterial}
        vertexShader={`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`}
        fragmentShader={timeLoopShader}
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

// --- MAIN TIME SCENE ---
export interface TimeSceneProps {
  activity?: AiActivity;
}

export function TimeScene({ activity = "idle" }: TimeSceneProps) {
  return (
    <group name="agamotto-temporal-eye-scene" scale={1.25}>
      {/* 1. Ambient & Point Lighting */}
      <ambientLight intensity={0.5} color={BRONZE} />
      <directionalLight position={[4, 4, 4]} intensity={1.8} color={MINT} />

      {/* 2. Time Loop Shockwaves */}
      <TimeLoopShockwaves activity={activity} />

      {/* 3. Eldritch Time Mandalas */}
      <EldritchTimeMandalas activity={activity} />

      {/* 4. Timeline Ribbon Streams */}
      <TimelineRibbonStreams activity={activity} />

      {/* 5. Extruded 3D Chronal Gears */}
      <ExtrudedChronalGears activity={activity} />

      {/* 6. Mechanical Agamotto Shutter & Time Stone */}
      <MechanicalAgamottoShutter activity={activity} />
    </group>
  );
}
