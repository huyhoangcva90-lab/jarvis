import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PersonalSolarSystem } from './PersonalSolarSystem';

interface SoulSceneProps {
  activity?: 'idle' | 'listening' | 'thinking' | 'speaking';
}

const StarDust: React.FC<{ activity: SoulSceneProps['activity'] }> = ({ activity }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const [positions, scales] = useMemo(() => {
    const particleCount = 1000;
    const pos = new Float32Array(particleCount * 3);
    const scl = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      // Create a spherical distribution
      const r = 15 + Math.random() * 25;
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
        size={0.15} 
        color="#fff7ed" 
        transparent 
        opacity={0.6} 
        sizeAttenuation 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export const SoulScene: React.FC<SoulSceneProps> = ({ activity = 'idle' }) => {
  return (
    <>
      <ambientLight intensity={0.1} color="#f97316" />
      <directionalLight position={[10, 10, 5]} intensity={0.5} color="#fff7ed" />
      
      <PersonalSolarSystem activity={activity} />
      <StarDust activity={activity} />
      
      {/* Background Fog for Auroral Glow */}
      <fog attach="fog" args={['#0f0a05', 10, 40]} />
    </>
  );
};
