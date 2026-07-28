import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NeuralSoulBrain } from './NeuralSoulBrain';

interface SoulSceneProps {
  activity?: 'idle' | 'listening' | 'thinking' | 'speaking';
}

const NeuralField: React.FC<{ activity: SoulSceneProps['activity'] }> = ({ activity }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const [positions, scales] = useMemo(() => {
    const particleCount = 420;
    const pos = new Float32Array(particleCount * 3);
    const scl = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const r = 4.5 + Math.random() * 8;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      
      scl[i] = Math.random();
    }
    
    return [pos, scl];
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pointsRef.current) {
      let speed = 0.05;
      if (activity === 'thinking') speed = 0.15;
      else if (activity === 'listening') speed = 0.02;

      pointsRef.current.rotation.y = t * speed;
      pointsRef.current.rotation.x = Math.sin(t * speed * 0.5) * 0.1;
      
      if (activity === 'speaking') {
        pointsRef.current.position.y = Math.sin(t * 2) * 0.5;
      } else {
        pointsRef.current.position.y = THREE.MathUtils.lerp(pointsRef.current.position.y, 0, 0.05);
      }
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          args={[positions, 3]}
        />
        <bufferAttribute 
          attach="attributes-scale" 
          args={[scales, 1]}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.055}
        color="#31c9ed"
        transparent 
        opacity={0.38}
        sizeAttenuation 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export const SoulScene: React.FC<SoulSceneProps> = ({ activity = 'idle' }) => {
  return (
    <>
      <ambientLight intensity={0.08} color="#0ea5e9" />
      <directionalLight position={[6, 8, 5]} intensity={0.28} color="#ffd7a3" />
      
      <NeuralSoulBrain activity={activity} />
      <NeuralField activity={activity} />
      
      <fog attach="fog" args={['#04090d', 7, 24]} />
    </>
  );
};
