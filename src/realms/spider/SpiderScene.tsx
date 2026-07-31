import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AiActivity } from '../../App';
import { OrbEnergyField } from '../shared/OrbEnergyField';

const COLORS = {
  red: new THREE.Color('#ff1744'),
  white: new THREE.Color('#ffffff'),
  darkRed: new THREE.Color('#8b0000'),
  dark: new THREE.Color('#1a1a2e'),
  core: new THREE.Color('#ffffff'),
  hotRed: new THREE.Color('#ff6b6b')
};

// Cyber Spider Eye Core
function CyberSpiderEye({ activity }: { activity: AiActivity }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const outerFrameRef = useRef<THREE.LineSegments>(null);
  const innerFrameRef = useRef<THREE.LineSegments>(null);
  
  const outerPoints = useMemo(() => {
    // Angular spider eye shape
    const pts = [
      new THREE.Vector3(0, 0.4, 0),
      new THREE.Vector3(0.5, 0.1, 0),
      new THREE.Vector3(0.3, -0.4, 0),
      new THREE.Vector3(0, -0.1, 0),
      new THREE.Vector3(-0.3, -0.4, 0),
      new THREE.Vector3(-0.5, 0.1, 0),
      new THREE.Vector3(0, 0.4, 0),
    ];
    return pts;
  }, []);

  const innerPoints = useMemo(() => {
    return outerPoints.map(p => p.clone().multiplyScalar(0.7));
  }, [outerPoints]);
  
  const outerGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints(outerPoints), [outerPoints]);
  const innerGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints(innerPoints), [innerPoints]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    let pulse = 1.0;
    
    if (activity === 'speaking') {
      pulse = 1.0 + Math.sin(t * 15) * 0.3 + Math.random() * 0.2;
    } else if (activity === 'idle') {
      pulse = 1.0 + Math.sin(t * 2) * 0.05;
    } else if (activity === 'thinking') {
      pulse = 1.0 + Math.sin(t * 8) * 0.1;
    } else if (activity === 'listening') {
      pulse = 0.9 + Math.sin(t) * 0.02;
    }
    
    if (coreRef.current) {
      coreRef.current.scale.setScalar(pulse);
    }
    if (outerFrameRef.current) {
      outerFrameRef.current.scale.setScalar(pulse);
      outerFrameRef.current.rotation.z = Math.sin(t * 0.5) * 0.1;
    }
    if (innerFrameRef.current) {
      innerFrameRef.current.scale.setScalar(pulse);
      innerFrameRef.current.rotation.z = Math.sin(t * 0.5) * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color={COLORS.core} toneMapped={false} />
      </mesh>
      
      <line ref={outerFrameRef} geometry={outerGeo}>
        <lineBasicMaterial color={COLORS.red} linewidth={2} toneMapped={false} transparent depthWrite={false} />
      </line>
      
      <line ref={innerFrameRef} geometry={innerGeo}>
        <lineBasicMaterial color={COLORS.white} linewidth={1} toneMapped={false} transparent depthWrite={false} />
      </line>

      <mesh scale={[1.2, 1.2, 1.2]}>
        <shapeGeometry args={[new THREE.Shape(outerPoints.map(p => new THREE.Vector2(p.x, p.y)))]} />
        <meshBasicMaterial color={new THREE.Color('#000000')} opacity={0.8} transparent depthWrite={false} />
      </mesh>
    </group>
  );
}

// Nano-Web Grid
function NanoWebGrid({ activity }: { activity: AiActivity }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const { redLines, whiteLines } = useMemo(() => {
    const redPts: THREE.Vector3[] = [];
    const whitePts: THREE.Vector3[] = [];
    
    const spokes = 10;
    const rings = 8;
    const maxRadius = 1.8;
    
    for (let i = 0; i < spokes; i++) {
      const angle = (i / spokes) * Math.PI * 2;
      const isWhite = i % 4 === 0;
      const pts = isWhite ? whitePts : redPts;
      
      pts.push(new THREE.Vector3(0, 0, 0));
      pts.push(new THREE.Vector3(Math.cos(angle) * maxRadius, Math.sin(angle) * maxRadius, 0));
      
      // Add ring segments
      for (let j = 1; j <= rings; j++) {
        const r = (j / rings) * maxRadius;
        const nextAngle = ((i + 1) / spokes) * Math.PI * 2;
        
        // slight distortion
        const distortR = r + (Math.sin(angle * 3) * 0.05);
        const distortNextR = r + (Math.sin(nextAngle * 3) * 0.05);
        
        const p1 = new THREE.Vector3(Math.cos(angle) * distortR, Math.sin(angle) * distortR, 0);
        const p2 = new THREE.Vector3(Math.cos(nextAngle) * distortNextR, Math.sin(nextAngle) * distortNextR, 0);
        
        pts.push(p1);
        pts.push(p2);
      }
    }
    
    const redLines = new THREE.BufferGeometry().setFromPoints(redPts);
    const whiteLines = new THREE.BufferGeometry().setFromPoints(whitePts);
    
    return { redLines, whiteLines };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      let speed = 0.1;
      let targetScale = 1.0;
      
      if (activity === 'thinking') { speed = 0.5; targetScale = 1.0; }
      else if (activity === 'speaking') { speed = 0.3; targetScale = 1.05; }
      else if (activity === 'listening') { speed = 0.05; targetScale = 0.95; }
      
      groupRef.current.rotation.y += speed * 0.01;
      groupRef.current.rotation.z += speed * 0.005;
      
      const breath = Math.sin(t * 2) * 0.02;
      const curScale = groupRef.current.scale.x;
      const newScale = THREE.MathUtils.lerp(curScale, targetScale + breath, 0.05);
      groupRef.current.scale.setScalar(newScale);
    }
  });

  return (
    <group ref={groupRef}>
      <group rotation={[0, 0, 0]}>
        <lineSegments geometry={redLines}>
          <lineBasicMaterial color={COLORS.red} transparent opacity={0.6} depthWrite={false} toneMapped={false} />
        </lineSegments>
        <lineSegments geometry={whiteLines}>
          <lineBasicMaterial color={COLORS.white} transparent opacity={0.8} depthWrite={false} toneMapped={false} />
        </lineSegments>
      </group>
      
      <group rotation={[Math.PI / 2, 0, 0]}>
        <lineSegments geometry={redLines}>
          <lineBasicMaterial color={COLORS.red} transparent opacity={0.3} depthWrite={false} toneMapped={false} />
        </lineSegments>
      </group>
      
      <group rotation={[0, Math.PI / 2, 0]}>
        <lineSegments geometry={redLines}>
          <lineBasicMaterial color={COLORS.red} transparent opacity={0.3} depthWrite={false} toneMapped={false} />
        </lineSegments>
      </group>
    </group>
  );
}

// Holographic Laser Grid
const HologramMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    color: { value: COLORS.red }
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPos;
    void main() {
      vUv = uv;
      vPos = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 color;
    varying vec2 vUv;
    varying vec3 vPos;
    void main() {
      float scan = sin(vPos.y * 15.0 - time * 3.0) * 0.5 + 0.5;
      float gridX = abs(fract(vUv.x * 20.0) - 0.5) * 2.0;
      float gridY = abs(fract(vUv.y * 20.0) - 0.5) * 2.0;
      float lineX = smoothstep(0.85, 1.0, gridX);
      float lineY = smoothstep(0.85, 1.0, gridY);
      float alpha = (lineX + lineY) * scan * 0.15;
      gl_FragColor = vec4(color, alpha);
    }
  `,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  side: THREE.DoubleSide
});

function HologramGrid() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.time.value = state.clock.getElapsedTime();
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2.0, 32, 32]} />
      <primitive object={HologramMaterial} attach="material" />
    </mesh>
  );
}

// Signal Packets
function SignalPackets({ activity }: { activity: AiActivity }) {
  const count = 40;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const packetData = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      angle: Math.random() * Math.PI * 2,
      radius: Math.random() * 1.5 + 0.2,
      speed: (Math.random() * 0.5 + 0.5) * (Math.random() > 0.5 ? 1 : -1),
      plane: Math.floor(Math.random() * 3), // 0: XY, 1: XZ, 2: YZ
      isLarge: i % 7 === 0,
      isWhite: Math.random() > 0.7
    }));
  }, [count]);

  const colors = useMemo(() => {
    const cols = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const color = packetData[i].isWhite ? COLORS.white : COLORS.red;
      color.toArray(cols, i * 3);
    }
    return cols;
  }, [count, packetData]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    let speedMult = 1.0;
    if (activity === 'thinking') speedMult = 3.0;
    if (activity === 'speaking') speedMult = 2.0;
    if (activity === 'listening') speedMult = 0.3;
    
    packetData.forEach((data, i) => {
      data.angle += data.speed * speedMult * 0.02;
      
      let x = Math.cos(data.angle) * data.radius;
      let y = Math.sin(data.angle) * data.radius;
      let z = 0;
      
      if (data.plane === 1) { z = y; y = 0; }
      else if (data.plane === 2) { z = x; x = 0; }
      
      dummy.position.set(x, y, z);
      const scale = data.isLarge ? 1.5 : 0.8;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[new THREE.SphereGeometry(0.015, 8, 8), undefined, count]}>
      <meshBasicMaterial toneMapped={false} transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} />
      <instancedBufferAttribute attach="geometry-attributes-color" args={[colors, 3]} />
    </instancedMesh>
  );
}

// Spider Legs
function SpiderLegs({ activity }: { activity: AiActivity }) {
  const groupRef = useRef<THREE.Group>(null);
  const count = 8;
  
  const curves = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const pts = [];
      for (let j = 0; j <= 10; j++) {
        const t = j / 10;
        const r = t * 1.5 + 0.1;
        const bend = Math.sin(t * Math.PI) * 0.4;
        pts.push(new THREE.Vector3(
          Math.cos(angle) * r,
          Math.sin(angle) * r,
          -bend
        ));
      }
      arr.push(new THREE.CatmullRomCurve3(pts));
    }
    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.z = t * 0.05;
      
      if (activity === 'speaking') {
        const pulse = 1.0 + Math.sin(t * 10) * 0.05;
        groupRef.current.scale.setScalar(pulse);
      } else {
        groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, 1.0, 0.1));
      }
    }
  });

  return (
    <group ref={groupRef}>
      {curves.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 20, 0.02, 8, false]} />
          <meshBasicMaterial 
            color={i % 2 === 0 ? COLORS.red : COLORS.dark} 
            toneMapped={false}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// Multiverse Matrix Nodes
function MatrixNodes({ activity }: { activity: AiActivity }) {
  const groupRef = useRef<THREE.Group>(null);
  const count = 12;
  const nodes = useMemo(() => {
    return Array.from({ length: count }, () => {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 1.4 + Math.random() * 0.4;
      return {
        pos: new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        ),
        phase: Math.random() * Math.PI * 2,
        isRed: Math.random() > 0.5
      };
    });
  }, []);

  const lines = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    nodes.forEach(node => {
      pts.push(new THREE.Vector3(0, 0, 0));
      pts.push(node.pos);
    });
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [nodes]);

  const materials = useRef<THREE.MeshBasicMaterial[]>([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    materials.current.forEach((mat, i) => {
      let intensity = 0.5 + Math.sin(t * 2 + nodes[i].phase) * 0.3;
      if (activity === 'thinking') {
        intensity = 0.5 + Math.sin(t * 10 + i * 0.5) * 0.5; // sequential bright
      }
      mat.opacity = intensity;
    });

    if (groupRef.current) {
      groupRef.current.children.forEach(child => {
        child.rotation.x += 0.01;
        child.rotation.y += 0.02;
      });
    }
  });

  return (
    <group>
      <lineSegments geometry={lines}>
        <lineBasicMaterial color={COLORS.red} transparent opacity={0.15} depthWrite={false} toneMapped={false} />
      </lineSegments>
      <group ref={groupRef}>
        {nodes.map((node, i) => (
          <mesh key={i} position={node.pos}>
            <octahedronGeometry args={[0.04, 0]} />
            <meshBasicMaterial 
              ref={(el) => { if(el) materials.current[i] = el; }}
              color={node.isRed ? COLORS.red : COLORS.white}
              toneMapped={false}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// Ambient Dark Particles
function DarkParticles() {
  const count = 200;
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.0 + Math.random() * 1.5;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial 
        size={0.02} 
        color={COLORS.darkRed} 
        transparent 
        opacity={0.4} 
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function SpiderScene({ activity = 'idle' }: { activity?: AiActivity }) {
  return (
    <>
      <color attach="background" args={['#020000']} />
      <fog attach="fog" args={['#050000', 7, 19]} />
      
      <ambientLight color="#1a0000" intensity={0.1} />
      <pointLight position={[0, 0, 2.1]} color="#ff1744" intensity={2.0} distance={7} />

      <CyberSpiderEye activity={activity} />
      <NanoWebGrid activity={activity} />
      <HologramGrid />
      <SignalPackets activity={activity} />
      <SpiderLegs activity={activity} />
      <MatrixNodes activity={activity} />
      <DarkParticles />
      
      <OrbEnergyField 
        color="#8b0000"
        hotColor="#ff6b6b"
        radius={2.3}
        particleCount={280}
        opacity={0.28}
      />
    </>
  );
}
