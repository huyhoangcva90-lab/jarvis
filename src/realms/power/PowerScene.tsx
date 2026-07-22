import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AgentFormation } from './AgentFormation';

type ActivityState = 'idle' | 'thinking' | 'speaking' | 'listening';

interface PowerSceneProps {
  activity?: ActivityState;
}

export function PowerScene({ activity = 'idle' }: PowerSceneProps) {
  const gridRef = useRef<THREE.GridHelper>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = time * 0.2;
      const scale1 = activity === 'speaking' ? 1.2 + Math.sin(time * 5) * 0.1 : 1;
      ring1Ref.current.scale.setScalar(scale1);
    }
    
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -time * 0.15;
      const scale2 = activity === 'thinking' ? 1.1 + Math.cos(time * 3) * 0.1 : 1;
      ring2Ref.current.scale.setScalar(scale2);
    }

    if (gridRef.current) {
      const material = gridRef.current.material as THREE.LineBasicMaterial;
      material.opacity = activity === 'thinking' ? 0.4 + Math.sin(time * 4) * 0.2 : 0.2;
    }
  });

  return (
    <group>
      {/* Lighting setup for the Power Realm */}
      <ambientLight intensity={0.2} color="#4a044e" />
      <pointLight position={[0, 5, 0]} intensity={2} color="#d946ef" distance={20} />
      <directionalLight position={[5, 10, -5]} intensity={1.5} color="#a855f7" />

      {/* Main Agent Formation */}
      <AgentFormation activity={activity} />

      {/* Tactical Grid Helper */}
      <gridHelper 
        ref={gridRef}
        args={[50, 50, '#d946ef', '#701a75']} 
        position={[0, -0.6, 0]} 
      />

      {/* Decorative Outer Shield Rings */}
      <group position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh ref={ring1Ref}>
          <ringGeometry args={[8, 8.2, 6]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
        
        <mesh ref={ring2Ref}>
          <ringGeometry args={[10, 10.1, 6]} />
          <meshBasicMaterial color="#d946ef" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      </group>
      
      {/* Background ambient fog */}
      <fog attach="fog" args={['#1a0024', 10, 40]} />
    </group>
  );
}
