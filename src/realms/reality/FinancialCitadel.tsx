import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FinancialCitadelProps {
  activity: 'idle' | 'listening' | 'thinking' | 'speaking';
}

export const FinancialCitadel: React.FC<FinancialCitadelProps> = ({ activity }) => {
  const pillarsRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.Group>(null);
  
  // Create pillar data
  const pillars = useMemo(() => {
    const arr = [];
    const count = 12;
    const radius = 5;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const height = 3 + Math.random() * 5;
      arr.push({ x, z, height, phase: Math.random() * Math.PI * 2 });
    }
    return arr;
  }, []);

  const lines = useMemo(() => {
      const arr = [];
      for (let i=0; i<pillars.length; i++) {
          const p1 = pillars[i];
          const p2 = pillars[(i+1)%pillars.length];
          const points = [
              new THREE.Vector3(p1.x, p1.height/2, p1.z),
              new THREE.Vector3(p2.x, p2.height/2, p2.z)
          ];
          arr.push(new THREE.BufferGeometry().setFromPoints(points));
      }
      return arr;
  }, [pillars]);


  const colorPrimary = new THREE.Color('#ef4444');
  const colorSecondary = new THREE.Color('#b91c1c');
  const colorGlow = new THREE.Color('#ffaa00');

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    
    let speed = 1;
    let intensity = 1;
    
    if (activity === 'thinking') {
        speed = 3;
        intensity = 2;
    } else if (activity === 'speaking') {
        speed = 2;
        intensity = 3;
    } else if (activity === 'listening') {
        speed = 0.5;
        intensity = 1.2;
    }

    if (pillarsRef.current) {
        pillarsRef.current.children.forEach((child, i) => {
            const p = pillars[i];
            // Translate up and down
            child.position.y = (p.height / 2) + Math.sin(time * speed + p.phase) * 0.5;
            
            const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
            if (activity === 'speaking' || activity === 'thinking') {
                mat.emissiveIntensity = (Math.sin(time * speed * 2 + p.phase) * 0.5 + 0.5) * intensity;
            } else {
                mat.emissiveIntensity = 0.2;
            }
        });
    }

    if (coreRef.current) {
        coreRef.current.rotation.y += delta * speed * 0.5;
        coreRef.current.rotation.z += delta * speed * 0.2;
        
        coreRef.current.children.forEach((ring, i) => {
            ring.rotation.x += delta * speed * (i % 2 === 0 ? 1 : -1) * 0.3;
        });
    }
  });

  return (
    <group>
      {/* Vault Core */}
      <group ref={coreRef} position={[0, 4, 0]}>
        <mesh>
          <torusGeometry args={[1, 0.1, 16, 32]} />
          <meshStandardMaterial color={colorPrimary} emissive={colorPrimary} emissiveIntensity={0.8} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.5, 0.05, 16, 32]} />
          <meshStandardMaterial color={colorSecondary} emissive={colorSecondary} emissiveIntensity={0.5} />
        </mesh>
        <mesh rotation={[0, Math.PI / 4, 0]}>
          <torusGeometry args={[2, 0.02, 16, 32]} />
          <meshStandardMaterial color={colorGlow} emissive={colorGlow} emissiveIntensity={1} />
        </mesh>
      </group>

      {/* Pillars */}
      <group ref={pillarsRef}>
        {pillars.map((p, i) => (
          <mesh key={i} position={[p.x, p.height / 2, p.z]} castShadow receiveShadow>
            <cylinderGeometry args={[0.8, 0.8, p.height, 4]} />
            <meshStandardMaterial 
              color="#111111" 
              metalness={0.9} 
              roughness={0.1}
              emissive={colorPrimary}
              emissiveIntensity={0.2}
            />
          </mesh>
        ))}
      </group>
      
      {/* Resource Bridges */}
      <group ref={linesRef}>
          {lines.map((geom, i) => (
              <line key={i} geometry={geom}>
                  <lineBasicMaterial color="#ef4444" transparent opacity={0.6} />
              </line>
          ))}
      </group>
    </group>
  );
};
