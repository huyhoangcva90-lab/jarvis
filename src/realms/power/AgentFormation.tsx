import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type ActivityState = 'idle' | 'thinking' | 'speaking' | 'listening';

interface AgentFormationProps {
  activity: ActivityState;
}

export function AgentFormation({ activity }: AgentFormationProps) {
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const shieldRef = useRef<THREE.Mesh>(null);
  const platformRef = useRef<THREE.Mesh>(null);

  const numAgents = 12;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Base positions for different formations
  const formations = useMemo(() => {
    const circle = [];
    const wedge = [];
    const tight = [];
    for (let i = 0; i < numAgents; i++) {
      const angle = (i / numAgents) * Math.PI * 2;
      // Circle
      circle.push(new THREE.Vector3(Math.cos(angle) * 4, 1, Math.sin(angle) * 4));
      // Wedge
      const row = Math.floor(i / 4);
      const col = i % 4;
      wedge.push(new THREE.Vector3((col - 1.5) * 2, 1 + row * 0.5, row * 2 - 2));
      // Tight
      tight.push(new THREE.Vector3(Math.cos(angle) * 2, 0.5, Math.sin(angle) * 2));
    }
    return { circle, wedge, tight };
  }, [numAgents]);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(numAgents * numAgents * 3);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [numAgents]);

  const lineMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: '#d946ef',
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    let targetFormation = formations.circle;
    let speed = 1;
    let pulseScale = 1;

    switch (activity) {
      case 'thinking':
        targetFormation = formations.wedge;
        speed = 2;
        pulseScale = 1.2 + Math.sin(time * 5) * 0.2;
        break;
      case 'speaking':
        targetFormation = formations.circle;
        speed = 3;
        pulseScale = 1.5 + Math.sin(time * 10) * 0.3;
        break;
      case 'listening':
        targetFormation = formations.tight;
        speed = 0.5;
        pulseScale = 0.9 + Math.sin(time * 2) * 0.1;
        break;
      case 'idle':
      default:
        targetFormation = formations.circle;
        speed = 1;
        pulseScale = 1 + Math.sin(time) * 0.1;
        break;
    }

    // Update nodes
    const positions = lineGeometry.attributes.position.array as Float32Array;
    let lineIdx = 0;

    const currentPositions: THREE.Vector3[] = [];

    if (nodesRef.current) {
      for (let i = 0; i < numAgents; i++) {
        const targetPos = targetFormation[i];
        
        // Add some organic hover motion
        const hoverY = Math.sin(time * speed + i) * 0.5;
        const currentPos = new THREE.Vector3(targetPos.x, targetPos.y + hoverY, targetPos.z);
        currentPositions.push(currentPos);
        
        dummy.position.lerp(currentPos, 0.1);
        
        // Scale pulse
        const scale = activity === 'speaking' ? pulseScale : 1 + Math.sin(time * 2 + i) * 0.1;
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        nodesRef.current.setMatrixAt(i, dummy.matrix);
      }
      nodesRef.current.instanceMatrix.needsUpdate = true;
    }

    // Update lines (connect all nodes)
    for (let i = 0; i < numAgents; i++) {
      for (let j = i + 1; j < numAgents; j++) {
        if (currentPositions[i] && currentPositions[j]) {
          positions[lineIdx++] = currentPositions[i].x;
          positions[lineIdx++] = currentPositions[i].y;
          positions[lineIdx++] = currentPositions[i].z;
          positions[lineIdx++] = currentPositions[j].x;
          positions[lineIdx++] = currentPositions[j].y;
          positions[lineIdx++] = currentPositions[j].z;
        }
      }
    }
    lineGeometry.attributes.position.needsUpdate = true;
    
    // Shield pulsing
    if (shieldRef.current) {
      shieldRef.current.rotation.y = time * 0.1;
      shieldRef.current.scale.setScalar(activity === 'listening' ? 1 : 1.1 + Math.sin(time * 2) * 0.05);
      const shieldMat = shieldRef.current.material as THREE.MeshStandardMaterial;
      shieldMat.opacity = activity === 'speaking' ? 0.4 : 0.2;
    }

    // Platform rotation
    if (platformRef.current) {
      platformRef.current.rotation.z = time * (activity === 'thinking' ? 0.5 : 0.1);
    }
    
    // Line opacity pulse
    if (activity === 'thinking' || activity === 'speaking') {
      lineMaterial.opacity = 0.3 + Math.sin(time * 8) * 0.2;
    } else {
      lineMaterial.opacity = 0.2;
    }
  });

  return (
    <group>
      {/* Central Hexagonal Prism Platform */}
      <mesh ref={platformRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <cylinderGeometry args={[2.5, 2.5, 0.5, 6]} />
        <meshStandardMaterial 
          color="#701a75" 
          emissive="#4a044e"
          emissiveIntensity={0.5}
          roughness={0.2} 
          metalness={0.8} 
        />
      </mesh>

      {/* Fleet of glowing nodes */}
      <instancedMesh ref={nodesRef} args={[undefined, undefined, numAgents]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial 
          color="#d946ef" 
          emissive="#a855f7" 
          emissiveIntensity={2} 
          toneMapped={false} 
        />
      </instancedMesh>

      {/* Connecting Laser Lines */}
      <lineSegments ref={linesRef} geometry={lineGeometry} material={lineMaterial} />

      {/* Hexagonal Shield Lattice */}
      <mesh ref={shieldRef} position={[0, 1, 0]}>
        <cylinderGeometry args={[6, 6, 4, 6]} />
        <meshStandardMaterial 
          color="#a855f7" 
          transparent 
          opacity={0.2} 
          wireframe 
          emissive="#a855f7"
          emissiveIntensity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
