import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { HypercubeSystem } from './HypercubeSystem';

interface SpaceSceneProps {
  activity?: 'idle' | 'thinking' | 'speaking';
}

export const SpaceScene: React.FC<SpaceSceneProps> = ({ activity = 'idle' }) => {
  const gridRef = useRef<THREE.Mesh>(null!);
  const portalsRef = useRef<THREE.Group>(null!);
  const riftRef = useRef<THREE.Line>(null!);

  const gridGeometry = useMemo(() => new THREE.PlaneGeometry(20, 20, 32, 32), []);
  const initialPositions = useMemo(() => {
    return new Float32Array(gridGeometry.attributes.position.array);
  }, [gridGeometry]);

  const riftGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    let y = 10;
    for (let i = 0; i < 20; i++) {
      points.push(new THREE.Vector3(
        (Math.random() - 0.5) * 3,
        y,
        -5
      ));
      y -= 1;
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    
    // Warp grid
    if (gridRef.current) {
      const positions = gridRef.current.geometry.attributes.position.array as Float32Array;
      const waveSpeed = activity === 'speaking' ? 5 : 1;
      const waveHeight = activity === 'speaking' ? 2 : 0.5;
      
      for (let i = 0; i < positions.length; i += 3) {
        const x = initialPositions[i];
        const y = initialPositions[i + 1];
        positions[i + 2] = initialPositions[i + 2] + Math.sin(x * 0.5 + time * waveSpeed) * Math.cos(y * 0.5 + time * waveSpeed) * waveHeight;
      }
      gridRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Portals
    if (portalsRef.current) {
      let portalSpeed = 0.2;
      if (activity === 'thinking') portalSpeed = 1.5;
      if (activity === 'speaking') portalSpeed = 0.5;

      portalsRef.current.children.forEach((child, index) => {
        child.rotation.z += delta * portalSpeed * (index % 2 === 0 ? 1 : -1);
        const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        
        if (activity === 'thinking') {
            material.opacity = 0.4 + Math.sin(time * 5 + index) * 0.3;
        } else {
            material.opacity = 0.4;
        }
      });
    }

    // Rift pulse
    if (riftRef.current) {
      const material = riftRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.5 + Math.sin(time * (activity === 'speaking' ? 10 : 2)) * 0.3;
    }
  });

  return (
    <group>
      {/* Warp Grid */}
      <mesh ref={gridRef} position={[0, 0, -10]} rotation={[-Math.PI / 4, 0, 0]}>
        <primitive object={gridGeometry} attach="geometry" />
        <meshBasicMaterial color="#003366" wireframe transparent opacity={0.3} />
      </mesh>

      {/* Dimensional Portals */}
      <group ref={portalsRef}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[0, 0, -3 - i * 2]} rotation={[0, 0, Math.random() * Math.PI]}>
            <ringGeometry args={[3 + i * 0.5, 3.2 + i * 0.5, 32]} />
            <meshBasicMaterial color="#00ffff" transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>

      {/* Spatial Rift */}
      <line ref={riftRef} geometry={riftGeometry}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </line>

      {/* Hypercube System */}
      <HypercubeSystem activity={activity} />
    </group>
  );
};
