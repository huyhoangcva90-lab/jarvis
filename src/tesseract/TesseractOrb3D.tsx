import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AiEmotion, EmotionState } from "./tesseract";
import { emotions } from "./constants";

// 16 Vertices of a 4D Hypercube (Tesseract)
const TESSERACT_VERTICES_4D: Array<[number, number, number, number]> = Array.from({ length: 16 }, (_, i) => [
  i & 1 ? 1 : -1,
  i & 2 ? 1 : -1,
  i & 4 ? 1 : -1,
  i & 8 ? 1 : -1,
]);

// 32 Edges of a 4D Hypercube
const TESSERACT_EDGES: Array<[number, number]> = [];
for (let i = 0; i < 16; i++) {
  for (let j = i + 1; j < 16; j++) {
    const diff = i ^ j;
    if (diff === 1 || diff === 2 || diff === 4 || diff === 8) {
      TESSERACT_EDGES.push([i, j]);
    }
  }
}

const tempoSpeed: Record<EmotionState["tempo"], number> = {
  slow: 0.5,
  medium: 0.85,
  fast: 1.3,
  sharp: 1.8,
};

type TesseractOrbSceneProps = {
  emotion: AiEmotion;
};

function TesseractOrbScene({ emotion }: TesseractOrbSceneProps) {
  const state = emotions[emotion] ?? emotions.calm;
  const speed = tempoSpeed[state.tempo];
  const color = useMemo(() => new THREE.Color(state.color), [state.color]);

  const rootGroup = useRef<THREE.Group>(null);
  const coreMesh = useRef<THREE.Mesh>(null);
  const pulseMesh = useRef<THREE.Mesh>(null);
  const hypercubeOuterRef = useRef<THREE.BufferGeometry>(null);
  const hypercubeInnerRef = useRef<THREE.BufferGeometry>(null);
  const ringGroup = useRef<THREE.Group>(null);
  const wAngle = useRef(0);

  // Buffer positions for the outer & inner hypercubes
  const outerPositions = useMemo(() => new Float32Array(32 * 2 * 3), []);
  const innerPositions = useMemo(() => new Float32Array(32 * 2 * 3), []);

  // Ambient quantum halo particles
  const particles = useMemo(() => {
    return Array.from({ length: 48 }, (_, idx) => {
      const angle = (idx / 48) * Math.PI * 2;
      const radius = 1.3 + (idx % 6) * 0.12;
      return {
        id: idx,
        initialPos: [
          Math.cos(angle) * radius,
          (Math.sin(angle * 2.2) * 0.45),
          Math.sin(angle) * radius,
        ] as [number, number, number],
        size: 0.02 + (idx % 3) * 0.008,
      };
    });
  }, []);

  useFrame((renderState, delta) => {
    const elapsed = renderState.clock.elapsedTime;
    wAngle.current += delta * speed * 0.65;

    // 1. Root group gentle floating
    if (rootGroup.current) {
      rootGroup.current.rotation.y += delta * speed * 0.25;
      rootGroup.current.rotation.x = Math.sin(elapsed * 0.3) * 0.08;
    }

    // 2. Living core pulse & scale
    if (coreMesh.current) {
      const breath = 1 + Math.sin(elapsed * speed * 2.2) * 0.06;
      coreMesh.current.scale.setScalar(breath);
    }

    if (pulseMesh.current) {
      const pulseScale = 1.05 + Math.sin(elapsed * speed * 2.8) * 0.1;
      pulseMesh.current.scale.setScalar(pulseScale);
      const mat = pulseMesh.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = 0.15 + Math.max(0, Math.sin(elapsed * speed * 2.8)) * 0.22;
      }
    }

    // 3. Rotating Torus Lattice Rings
    if (ringGroup.current) {
      ringGroup.current.rotation.z -= delta * speed * 0.45;
      ringGroup.current.rotation.x += delta * speed * 0.2;
    }

    // 4. 4D Hypercube Projection Math (Rotating in X-W and Z-W 4D planes)
    const cosW = Math.cos(wAngle.current);
    const sinW = Math.sin(wAngle.current);
    const cosW2 = Math.cos(wAngle.current * 0.7);
    const sinW2 = Math.sin(wAngle.current * 0.7);

    // Project 4D -> 3D
    const project4Dto3D = (v: [number, number, number, number], scale3D: number, distance4D: number) => {
      // 4D Rotation in X-W plane
      let x = v[0] * cosW - v[3] * sinW;
      let y = v[1];
      let z = v[2];
      let w = v[0] * sinW + v[3] * cosW;

      // Secondary 4D Rotation in Z-W plane
      const zNew = z * cosW2 - w * sinW2;
      const wNew = z * sinW2 + w * cosW2;
      z = zNew;
      w = wNew;

      // Perspective projection from 4D -> 3D
      const perspective = scale3D / (distance4D - w * 0.35);
      return [x * perspective, y * perspective, z * perspective];
    };

    // Update Outer Hypercube Geometry
    if (hypercubeOuterRef.current) {
      let ptr = 0;
      for (const [i, j] of TESSERACT_EDGES) {
        const p1 = project4Dto3D(TESSERACT_VERTICES_4D[i], 1.25, 2.5);
        const p2 = project4Dto3D(TESSERACT_VERTICES_4D[j], 1.25, 2.5);

        outerPositions[ptr++] = p1[0];
        outerPositions[ptr++] = p1[1];
        outerPositions[ptr++] = p1[2];
        outerPositions[ptr++] = p2[0];
        outerPositions[ptr++] = p2[1];
        outerPositions[ptr++] = p2[2];
      }
      hypercubeOuterRef.current.attributes.position.needsUpdate = true;
    }

    // Update Inner Counter-Rotating Hypercube Geometry
    if (hypercubeInnerRef.current) {
      let ptr = 0;
      for (const [i, j] of TESSERACT_EDGES) {
        const v1 = TESSERACT_VERTICES_4D[i];
        const v2 = TESSERACT_VERTICES_4D[j];

        // Reverse rotation
        const p1 = project4Dto3D([-v1[0], v1[1], -v2[2], v1[3]], 0.72, 2.2);
        const p2 = project4Dto3D([-v2[0], v2[1], -v1[2], v2[3]], 0.72, 2.2);

        innerPositions[ptr++] = p1[0];
        innerPositions[ptr++] = p1[1];
        innerPositions[ptr++] = p1[2];
        innerPositions[ptr++] = p2[0];
        innerPositions[ptr++] = p2[1];
        innerPositions[ptr++] = p2[2];
      }
      hypercubeInnerRef.current.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[2.5, 2.5, 3]} intensity={50} color={state.color} distance={7} />
      <pointLight position={[-2.5, -2, -2]} intensity={20} color="#69e8ff" distance={6} />

      <group ref={rootGroup}>
        {/* Core Emissive Nucleus */}
        <mesh ref={coreMesh}>
          <sphereGeometry args={[0.52, 64, 64]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={2.8}
            metalness={0.5}
            roughness={0.2}
            transparent
            opacity={0.95}
          />
        </mesh>

        {/* Outer Aura Pulse Sphere */}
        <mesh ref={pulseMesh}>
          <sphereGeometry args={[1.15, 48, 48]} />
          <meshBasicMaterial color={color} transparent opacity={0.2} wireframe />
        </mesh>

        {/* 4D Outer Tesseract Wireframe */}
        <lineSegments>
          <bufferGeometry ref={hypercubeOuterRef}>
            <bufferAttribute
              attach="attributes-position"
              args={[outerPositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color={color} linewidth={2} transparent opacity={0.85} />
        </lineSegments>

        {/* 4D Inner Tesseract Counter-Rotating Wireframe */}
        <lineSegments>
          <bufferGeometry ref={hypercubeInnerRef}>
            <bufferAttribute
              attach="attributes-position"
              args={[innerPositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#ffffff" linewidth={1.5} transparent opacity={0.6} />
        </lineSegments>

        {/* Rotating Energy Torus Rings */}
        <group ref={ringGroup}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.05, 0.007, 12, 120]} />
            <meshBasicMaterial color={color} transparent opacity={0.75} />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[1.18, 0.005, 12, 120]} />
            <meshBasicMaterial color="#69e8ff" transparent opacity={0.5} />
          </mesh>
          <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
            <torusGeometry args={[1.35, 0.004, 12, 120]} />
            <meshBasicMaterial color={color} transparent opacity={0.3} />
          </mesh>
        </group>

        {/* Halo Particles */}
        {particles.map((p) => (
          <mesh key={p.id} position={p.initialPos} scale={p.size}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial
              color={p.id % 2 === 0 ? "#ffffff" : color}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>
    </>
  );
}

export default function TesseractOrb3D({ emotion }: { emotion: AiEmotion }) {
  return (
    <div className={`living-orb-r3f emotion-${emotion}`} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 4.0], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.6]}
      >
        <TesseractOrbScene emotion={emotion} />
      </Canvas>
    </div>
  );
}
