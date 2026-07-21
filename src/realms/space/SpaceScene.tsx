import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { HypercubeSystem } from './HypercubeSystem';

interface SpaceSceneProps {
  activity?: 'idle' | 'listening' | 'thinking' | 'speaking';
}

function seededUnit(index: number) {
  const value = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

const PORTAL_SPECS = [
  { z: -2.8, radius: 2.9, tilt: [0.08, 0.18, 0.2] as [number, number, number], speed: 0.18 },
  { z: -4.8, radius: 3.55, tilt: [-0.1, -0.24, 0.82] as [number, number, number], speed: -0.14 },
  { z: -7.2, radius: 4.15, tilt: [0.16, 0.38, -0.46] as [number, number, number], speed: 0.11 },
  { z: -9.6, radius: 4.8, tilt: [-0.22, 0.08, 1.24] as [number, number, number], speed: -0.08 },
];

function RouteCapsules({ activity }: { activity: SpaceSceneProps['activity'] }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 42;
  const geometry = useMemo(() => {
    const result = new THREE.BufferGeometry();
    result.setAttribute('position', new THREE.BufferAttribute(new Float32Array(particleCount * 3), 3));
    result.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(Array.from({ length: particleCount }, (_, i) => 0.045 + (i % 4) * 0.012)), 1));
    return result;
  }, []);

  const shader = useMemo(() => ({
    uniforms: { uColor: { value: new THREE.Color('#9beeff') } },
    vertexShader: `
      attribute float aSize;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = aSize * (120.0 / max(1.0, -mv.z));
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float core = smoothstep(0.44, 0.02, d);
        gl_FragColor = vec4(uColor, core);
      }
    `
  }), []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const speed = activity === 'thinking' ? 0.42 : activity === 'speaking' ? 0.26 : activity === 'listening' ? 0.08 : 0.15;
    const positions = geometry.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < particleCount; i += 1) {
      const lane = i % PORTAL_SPECS.length;
      const phase = (state.clock.elapsedTime * speed + i * 0.037) % 1;
      const portal = PORTAL_SPECS[lane];
      const curve = Math.sin(phase * Math.PI);
      const side = seededUnit(i + 4) - 0.5;
      positions.setXYZ(
        i,
        side * 3.8 * (1 - phase * 0.42) + Math.sin(phase * 8 + i) * 0.08,
        (lane - 1.5) * 0.42 * curve + Math.cos(phase * 5 + i) * 0.05,
        1.6 + (portal.z - 1.6) * phase
      );
    }
    positions.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <shaderMaterial args={[shader]} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} transparent />
    </points>
  );
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
        (seededUnit(i + 11) - 0.5) * 3,
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
        {PORTAL_SPECS.map((portal, i) => (
          <mesh key={i} position={[0, 0, portal.z]} rotation={portal.tilt}>
            <ringGeometry args={[portal.radius, portal.radius + 0.18, 48]} />
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
      <RouteCapsules activity={activity} />
    </group>
  );
};
