import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { Agent } from "../App";

type Props = { agents: Agent[]; selectedId: string; onSelect: (id: string) => void };

function WindowBand({ y, color, active, onClick }: { y: number; color: string; active: boolean; onClick: (e: ThreeEvent<MouseEvent>) => void }) {
  return (
    <group position={[0, y, 0]} onClick={onClick}>
      <mesh scale={active ? [1.08, 1.08, 1.08] : [1, 1, 1]}>
        <boxGeometry args={[1.78, 0.54, 1.06]} />
        <meshStandardMaterial color={active ? color : "#07131d"} emissive={color} emissiveIntensity={active ? 1.8 : 0.22} metalness={0.72} roughness={0.22} transparent opacity={0.93} />
      </mesh>
      <mesh position={[0, 0, 0.536]}>
        <planeGeometry args={[1.48, 0.32]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 0.76 : 0.16} />
      </mesh>
    </group>
  );
}

function Tower({ agents, selectedId, onSelect }: Props) {
  const root = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Mesh>(null);
  const levels = useMemo(() => agents.map((_, i) => 0.05 + i * 0.62), [agents]);

  useFrame((state, delta) => {
    if (root.current) root.current.rotation.y += delta * 0.055;
    if (halo.current) halo.current.rotation.z -= delta * 0.13;
    root.current?.position.set(0, Math.sin(state.clock.elapsedTime * 0.55) * 0.035 - 1.65, 0);
  });

  return (
    <>
      <ambientLight intensity={0.48} />
      <directionalLight position={[4, 8, 5]} intensity={2.2} color="#b8e8ff" />
      <pointLight position={[-4, 2, 3]} intensity={22} distance={9} color="#d02030" />
      <group ref={root} rotation={[0.04, -0.42, 0]}>
        <mesh position={[0, -0.85, 0]}>
          <cylinderGeometry args={[1.23, 1.52, 1.8, 6]} />
          <meshStandardMaterial color="#050b10" metalness={0.88} roughness={0.24} />
        </mesh>
        {agents.map((agent, index) => (
          <WindowBand key={agent.id} y={levels[index]} color={agent.color} active={agent.id === selectedId} onClick={(e) => { e.stopPropagation(); onSelect(agent.id); }} />
        ))}
        <mesh position={[0, 3.92, 0]}>
          <coneGeometry args={[1.12, 1.25, 5]} />
          <meshStandardMaterial color="#0a1218" metalness={0.9} roughness={0.18} />
        </mesh>
        <mesh position={[0, 4.55, 0]}>
          <cylinderGeometry args={[0.045, 0.1, 1.5, 8]} />
          <meshBasicMaterial color="#ff394c" />
        </mesh>
        <mesh position={[1.35, 2.78, 0]} rotation={[0, 0, -0.03]}>
          <boxGeometry args={[1.55, 0.1, 1.18]} />
          <meshStandardMaterial color="#111b22" metalness={0.84} roughness={0.25} />
        </mesh>
        <mesh position={[1.35, 2.85, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.45, 0.55, 48]} />
          <meshBasicMaterial color="#6edcff" transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
        <mesh ref={halo} position={[0, -1.74, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.1, 2.13, 96]} />
          <meshBasicMaterial color="#51bfe9" transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </>
  );
}

export default function AvengersTower(props: Props) {
  return (
    <div className="tower-canvas">
      <Canvas camera={{ position: [0, 1.35, 9.4], fov: 37, near: 0.1, far: 40 }} dpr={[1, 1.6]} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
        <Tower {...props} />
      </Canvas>
    </div>
  );
}
