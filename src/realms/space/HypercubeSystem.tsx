import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HypercubeSystemProps {
  activity?: 'idle' | 'listening' | 'thinking' | 'speaking';
}

export const HypercubeSystem: React.FC<HypercubeSystemProps> = ({ activity = 'idle' }) => {
  const outerCubeRef = useRef<THREE.LineSegments>(null!);
  const innerCubeRef = useRef<THREE.LineSegments>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);

  // Basic box geometry for the wireframes
  const geometry = useMemo(() => {
    const boxGeo = new THREE.BoxGeometry(2, 2, 2);
    return new THREE.WireframeGeometry(boxGeo);
  }, []);

  // Spatial routing lines geometry
  const routingLinesGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const numLines = 20;
    for (let i = 0; i < numLines; i++) {
      const start = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize().multiplyScalar(1);
      
      const end = start.clone().multiplyScalar(3 + Math.random() * 2);
      
      points.push(start, end);
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, []);

  useFrame((state, delta) => {
    // Rotation logic based on activity
    let speed = 0.5;
    if (activity === 'thinking') speed = 1.0;
    if (activity === 'speaking') speed = 2.0;

    if (outerCubeRef.current) {
      outerCubeRef.current.rotation.x += delta * 0.2 * speed;
      outerCubeRef.current.rotation.y += delta * 0.3 * speed;
      
      if (activity === 'speaking') {
         outerCubeRef.current.rotation.z += delta * 0.5;
      }
    }

    if (innerCubeRef.current) {
      innerCubeRef.current.rotation.x -= delta * 0.3 * speed;
      innerCubeRef.current.rotation.y -= delta * 0.4 * speed;

      // Morphing scale logic
      const scale = 0.3 + (Math.sin(state.clock.elapsedTime * speed) * 0.5 + 0.5) * 0.5;
      innerCubeRef.current.scale.set(scale, scale, scale);
    }
    
    if (linesRef.current) {
      linesRef.current.rotation.y += delta * 0.1 * speed;
      // Pulse effect
      const material = linesRef.current.material as THREE.LineBasicMaterial;
      if (activity === 'thinking') {
         material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 10) * 0.5;
      } else {
         material.opacity = 0.3;
      }
    }
  });

  return (
    <group>
      <lineSegments ref={outerCubeRef} geometry={geometry}>
        <lineBasicMaterial color="#00ffff" transparent opacity={0.8} />
      </lineSegments>
      
      <lineSegments ref={innerCubeRef} geometry={geometry} scale={[0.5, 0.5, 0.5]}>
        <lineBasicMaterial color="#00aaff" transparent opacity={0.9} />
      </lineSegments>

      <lineSegments ref={linesRef} geometry={routingLinesGeometry}>
        <lineBasicMaterial color="#0088ff" transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
};
