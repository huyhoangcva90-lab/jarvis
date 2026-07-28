import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { FinancialCitadel } from './FinancialCitadel';
import * as THREE from 'three';

interface RealitySceneProps {
  activity?: 'idle' | 'listening' | 'thinking' | 'speaking';
}

export const RealityScene: React.FC<RealitySceneProps> = ({ activity = 'idle' }) => {
  const ringsRef = useRef<THREE.Group>(null);
  const gridRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    let speed = 1;
    if (activity === 'thinking') speed = 3;
    if (activity === 'speaking') speed = 2;
    if (activity === 'listening') speed = 0.5;

    if (ringsRef.current) {
        ringsRef.current.rotation.y -= delta * speed * 0.1;
        ringsRef.current.children.forEach((ring, i) => {
            ring.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.2 + i) * 0.2;
        });
    }
  });

  return (
    <group>
      <ambientLight intensity={0.2} color="#ff0000" />
      <directionalLight position={[10, 20, 10]} intensity={1.5} color="#ffcccc" />
      <pointLight position={[0, 5, 0]} intensity={2} color="#ff3300" distance={20} />

      <FinancialCitadel activity={activity} />

      {/* Heavy ground plane wireframe */}
      <mesh ref={gridRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[50, 50, 20, 20]} />
        <meshBasicMaterial color="#7f1d1d" wireframe transparent opacity={0.3} />
      </mesh>
      
      {/* Ground solid plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#050000" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Transparent glowing vault rings surrounding the citadel */}
      <group ref={ringsRef} position={[0, 0, 0]}>
        {[10, 14, 18].map((radius, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <ringGeometry args={[radius, radius + 0.2, 64]} />
            <meshBasicMaterial color="#ef4444" transparent opacity={0.2 - i * 0.05} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
