import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface OrbitingPlanetProps {
  radius: number;
  speed: number;
  size: number;
  color: string;
  tiltX: number;
  tiltZ: number;
  activity?: 'idle' | 'listening' | 'thinking' | 'speaking';
}

const OrbitRing: React.FC<{ radius: number; tiltX: number; tiltZ: number }> = ({ radius, tiltX, tiltZ }) => {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return pts;
  }, [radius]);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [points]);

  return (
    <line geometry={lineGeometry} rotation={[tiltX, 0, tiltZ]}>
      <lineBasicMaterial color="#f59e0b" transparent opacity={0.3} />
    </line>
  );
};

const OrbitingPlanet: React.FC<OrbitingPlanetProps> = ({ radius, speed, size, color, tiltX, tiltZ, activity }) => {
  const planetRef = useRef<THREE.Mesh>(null);
  const pivotRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    let speedMult = 1;
    if (activity === 'thinking') speedMult = 2;
    else if (activity === 'listening') speedMult = 0.5;

    if (pivotRef.current) {
      pivotRef.current.rotation.y += speed * delta * speedMult;
    }
    if (planetRef.current) {
      planetRef.current.rotation.y += speed * 2 * delta * speedMult;
    }
  });

  return (
    <group rotation={[tiltX, 0, tiltZ]}>
      <OrbitRing radius={radius} tiltX={0} tiltZ={0} />
      <group ref={pivotRef}>
        <mesh ref={planetRef} position={[radius, 0, 0]}>
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} roughness={0.4} metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
};

interface PersonalSolarSystemProps {
  activity?: 'idle' | 'listening' | 'thinking' | 'speaking';
}

export const PersonalSolarSystem: React.FC<PersonalSolarSystemProps> = ({ activity = 'idle' }) => {
  const starRef = useRef<THREE.Mesh>(null);
  const starMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (starRef.current) {
      starRef.current.rotation.y = t * 0.1;
      
      let scaleMult = 1;
      if (activity === 'speaking') {
        scaleMult = 1 + Math.sin(t * 5) * 0.05 + 0.1;
      } else if (activity === 'thinking') {
        scaleMult = 1 + Math.sin(t * 2) * 0.02;
      }
      
      starRef.current.scale.setScalar(scaleMult);
    }
    
    if (starMaterialRef.current) {
      let emissiveIntensity = 1.5;
      if (activity === 'thinking') emissiveIntensity = 2.5 + Math.sin(t * 8) * 0.5;
      if (activity === 'listening') emissiveIntensity = 1.0 + Math.sin(t) * 0.2;
      starMaterialRef.current.emissiveIntensity = emissiveIntensity;
    }

    if (glowRef.current) {
      glowRef.current.intensity = (activity === 'thinking' ? 4 : activity === 'speaking' ? 3 : 2) + Math.sin(t * 2) * 0.5;
    }
  });

  const planets = useMemo(() => [
    { radius: 3, speed: 0.5, size: 0.2, color: '#f97316', tiltX: 0.1, tiltZ: 0.2 },
    { radius: 4.5, speed: 0.3, size: 0.3, color: '#f59e0b', tiltX: -0.2, tiltZ: 0.1 },
    { radius: 6, speed: 0.2, size: 0.25, color: '#fbbf24', tiltX: 0.15, tiltZ: -0.15 },
    { radius: 8, speed: 0.15, size: 0.15, color: '#fff7ed', tiltX: -0.1, tiltZ: -0.2 },
    { radius: 10, speed: 0.1, size: 0.4, color: '#ea580c', tiltX: 0.3, tiltZ: 0.05 },
  ], []);

  return (
    <group>
      {/* Central Star */}
      <mesh ref={starRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial 
          ref={starMaterialRef}
          color="#f97316" 
          emissive="#f59e0b" 
          emissiveIntensity={1.5}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Star Glow */}
      <pointLight 
        ref={glowRef}
        color="#f59e0b" 
        distance={20} 
        intensity={2} 
        decay={2}
      />

      {/* Planets */}
      {planets.map((planet, i) => (
        <OrbitingPlanet key={i} {...planet} activity={activity} />
      ))}
    </group>
  );
};
