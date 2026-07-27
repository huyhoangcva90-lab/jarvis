import { Canvas, useFrame } from "@react-three/fiber";
import { memo, useMemo, useRef } from "react";
import * as THREE from "three";
import type { AiEmotion, EmotionState } from "./model";

type Props = {
  emotion: AiEmotion;
  state: EmotionState;
};

const tempoSpeed: Record<EmotionState["tempo"], number> = {
  slow: 0.42,
  medium: 0.75,
  fast: 1.12,
  sharp: 1.65
};

function OrbScene({ state }: { state: EmotionState }) {
  const root = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const lattice = useRef<THREE.Group>(null);
  const pulse = useRef<THREE.Mesh>(null);

  const color = useMemo(() => new THREE.Color(state.color), [state.color]);
  const speed = tempoSpeed[state.tempo];

  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, index) => {
        const angle = (index / 20) * Math.PI * 2;
        const radius = 1.35 + (index % 5) * 0.11;
        return {
          id: index,
          position: [Math.cos(angle) * radius, Math.sin(angle * 1.7) * 0.26, Math.sin(angle) * radius] as [number, number, number],
          scale: 0.025 + (index % 4) * 0.008
        };
      }),
    []
  );

  useFrame((renderState, delta) => {
    const elapsed = renderState.clock.elapsedTime;

    if (root.current) {
      root.current.rotation.y += delta * speed * 0.34;
      root.current.rotation.x = Math.sin(elapsed * 0.22) * 0.08;
    }

    if (lattice.current) {
      lattice.current.rotation.z -= delta * speed * 0.62;
      lattice.current.rotation.y += delta * speed * 0.22;
    }

    if (core.current) {
      const breath = 1 + Math.sin(elapsed * speed * 1.8) * (state.tempo === "sharp" ? 0.09 : 0.045);
      core.current.scale.setScalar(breath);
    }

    if (pulse.current) {
      const pulseScale = 1.02 + Math.sin(elapsed * speed * 2.4) * 0.08;
      pulse.current.scale.setScalar(pulseScale);
      const material = pulse.current.material;
      if (material instanceof THREE.MeshBasicMaterial) {
        material.opacity = 0.12 + Math.max(0, Math.sin(elapsed * speed * 2.4)) * 0.18;
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.75} />
      <pointLight position={[2.4, 2.2, 2.8]} intensity={45} color={state.color} distance={6} />
      <pointLight position={[-2, -1, 1.5]} intensity={14} color="#9feeff" distance={5} />
      <group ref={root}>
        <mesh ref={pulse}>
          <sphereGeometry args={[1.22, 64, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.18} wireframe />
        </mesh>

        <mesh ref={core}>
          <sphereGeometry args={[0.58, 64, 64]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={2.35}
            metalness={0.45}
            roughness={0.24}
            transparent
            opacity={0.92}
          />
        </mesh>

        <group ref={lattice}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.92, 0.006, 8, 160]} />
            <meshBasicMaterial color={color} transparent opacity={0.72} />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.98, 0.006, 8, 160]} />
            <meshBasicMaterial color={color} transparent opacity={0.48} />
          </mesh>
          <mesh rotation={[0.8, 0.4, 0.25]}>
            <torusGeometry args={[1.12, 0.004, 8, 160]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.23} />
          </mesh>
          <mesh rotation={[-0.4, 0.8, 1.2]}>
            <torusGeometry args={[1.32, 0.004, 8, 160]} />
            <meshBasicMaterial color={color} transparent opacity={0.28} />
          </mesh>
        </group>

        {particles.map((particle) => (
          <mesh key={particle.id} position={particle.position} scale={particle.scale}>
            <sphereGeometry args={[1, 10, 10]} />
            <meshBasicMaterial color={particle.id % 3 === 0 ? "#ffffff" : color} transparent opacity={0.82} />
          </mesh>
        ))}
      </group>
    </>
  );
}

const MemoOrbScene = memo(OrbScene);

export default function LivingOrb3D({ emotion, state }: Props) {
  return (
    <div className={`living-orb-r3f emotion-${emotion}`} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.6]}
      >
        <MemoOrbScene state={state} />
      </Canvas>
    </div>
  );
}
