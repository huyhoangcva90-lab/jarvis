import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function JarvisNeutralCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const signalsRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // 6 Realm positions on a circle of radius 2.5
  const realmSignals = useMemo(() => {
    const colors = [
      "#eab308", // Mind (Gold/Yellow)
      "#22c55e", // Time (Green)
      "#3b82f6", // Space (Blue)
      "#ef4444", // Reality (Red)
      "#a855f7", // Power (Purple/Violet)
      "#f97316", // Soul (Orange)
    ];

    return colors.map((color, i) => {
      const angle = (i / 6) * Math.PI * 2;
      return {
        color: new THREE.Color(color),
        position: new THREE.Vector3(Math.cos(angle) * 2.5, 0, Math.sin(angle) * 2.5),
        angle,
      };
    });
  }, []);

  // Sparse particles for the background data fragments
  const particleGeometry = useMemo(() => {
    const count = 60;
    const positions = new Float32Array(count * 3);
    const random = () => Math.random() - 0.5;
    for (let i = 0; i < count; i++) {
      const r = 1.0 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = random() * 0.5;
      positions[i * 3 + 2] = Math.sin(theta) * r;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;

    // Pulse core
    if (coreRef.current) {
      const scale = 1 + Math.sin(t * 3) * 0.08;
      coreRef.current.scale.setScalar(scale);
      coreRef.current.rotation.y += delta * 0.5;
    }

    // Slowly rotate outer signals
    if (signalsRef.current) {
      signalsRef.current.rotation.y += delta * 0.12;
    }

    // Slowly rotate particles
    if (particlesRef.current) {
      particlesRef.current.rotation.y -= delta * 0.08;
    }
  });

  return (
    <group>
      {/* Neutral Core Centerpiece */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshBasicMaterial color="#fffdec" toneMapped={false} />
      </mesh>
      
      {/* Subtle core glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.12, 0.13, 32]} />
        <meshBasicMaterial color="#fffdec" opacity={0.3} transparent toneMapped={false} />
      </mesh>

      {/* 6 Color Signals in the distance */}
      <group ref={signalsRef}>
        {realmSignals.map((sig, i) => (
          <group key={i} position={sig.position}>
            {/* Small node sphere */}
            <mesh>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshBasicMaterial color={sig.color} toneMapped={false} />
            </mesh>
            {/* Small glow halo */}
            <mesh scale={2.5}>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshBasicMaterial
                color={sig.color}
                opacity={0.15}
                transparent
                blending={THREE.AdditiveBlending}
                toneMapped={false}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Sparse background particles */}
      <points ref={particlesRef} geometry={particleGeometry}>
        <pointsMaterial
          color="#fffdec"
          size={0.02}
          opacity={0.4}
          transparent
          sizeAttenuation
          toneMapped={false}
        />
      </points>
    </group>
  );
}
