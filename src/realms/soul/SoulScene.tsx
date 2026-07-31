import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { AiActivity } from '../../App';

interface SoulSceneProps {
  activity?: AiActivity;
}

// Shaders for Arc Reactor Core
const coreVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const coreFragmentShader = `
  uniform float time;
  uniform float intensity;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  // Simplex noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                       -0.577350269189626,  // -1.0 + 2.0 * C.x
                        0.024390243902439); // 1.0 / 41.0
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i); // Avoid truncation effects in permutation
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    float dist = length(vUv - 0.5) * 2.0;
    float noise = snoise(vUv * 5.0 - time * 1.5) * 0.2;
    float glow = 1.0 - smoothstep(0.0, 0.8 + noise, dist);
    
    vec3 colorA = vec3(1.0, 0.8, 0.4); // bright yellow/white
    vec3 colorB = vec3(1.0, 0.55, 0.1); // orange
    
    vec3 finalColor = mix(colorB, colorA, glow * 1.5) * intensity;
    
    float alpha = glow * intensity;
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

const fresnelVertexShader = `
  varying vec3 vViewPosition;
  varying vec3 vNormal;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fresnelFragmentShader = `
  uniform vec3 color;
  varying vec3 vViewPosition;
  varying vec3 vNormal;
  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = dot(viewDir, normal);
    fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
    fresnel = pow(fresnel, 3.0);
    gl_FragColor = vec4(color * fresnel * 1.5, fresnel * 0.4);
  }
`;

// Helper for generating deterministic random numbers
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

const ArcReactorCore = ({ activity }: { activity: AiActivity }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const triangleRef = useRef<THREE.Group>(null);
  const hexRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = t;
      let intensity = 1.0;
      if (activity === 'speaking') {
        intensity = 1.5 + Math.sin(t * 8) * 0.3;
      } else if (activity === 'thinking') {
        intensity = 1.2 + Math.random() * 0.4;
      } else if (activity === 'listening') {
        intensity = 0.5;
      }
      materialRef.current.uniforms.intensity.value = intensity;
    }
    
    if (triangleRef.current) {
      triangleRef.current.rotation.z = t * 0.2;
    }
    if (hexRef.current) {
      hexRef.current.rotation.z = -t * 0.1;
    }
  });

  return (
    <group>
      {/* Central bright point */}
      <mesh>
        <circleGeometry args={[0.15, 32]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={coreVertexShader}
          fragmentShader={coreFragmentShader}
          uniforms={{
            time: { value: 0 },
            intensity: { value: 1.0 }
          }}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Inner Triangle Frame */}
      <group ref={triangleRef}>
        <mesh>
          <ringGeometry args={[0.2, 0.22, 3]} />
          <meshBasicMaterial color="#fffde0" transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      </group>

      {/* Circular containment ring */}
      <mesh>
        <torusGeometry args={[0.35, 0.02, 16, 64]} />
        <meshBasicMaterial color="#ff8c18" transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      
      {/* Outer Hexagonal Frame */}
      <group ref={hexRef}>
        <mesh>
          <ringGeometry args={[0.45, 0.5, 6]} />
          <meshBasicMaterial color="#ffd06b" transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
};

const HudRings = ({ activity }: { activity: AiActivity }) => {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);
  const ring4Ref = useRef<THREE.Group>(null);

  const ring2Segments = useMemo(() => {
    const segments = [];
    for (let i = 0; i < 24; i++) {
      const length = seededRandom(i) > 0.5 ? 0.15 : 0.05;
      segments.push(
        <mesh key={i} rotation={[0, 0, (i / 24) * Math.PI * 2]}>
          <ringGeometry args={[1.18, 1.22, 16, 1, 0, length]} />
          <meshBasicMaterial color="#ff9d2e" transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      );
    }
    return segments;
  }, []);
  
  const ring3Nodes = useMemo(() => {
    const nodes = [];
    for (let i = 0; i < 12; i++) {
      nodes.push(
        <mesh key={i} position={[Math.cos((i / 12) * Math.PI * 2) * 1.6, Math.sin((i / 12) * Math.PI * 2) * 1.6, 0]}>
          <circleGeometry args={[0.03, 6]} />
          <meshBasicMaterial color="#ffc46b" transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      );
    }
    return nodes;
  }, []);

  const ring4Brackets = useMemo(() => {
    const brackets = [];
    for (let i = 0; i < 4; i++) {
      brackets.push(
        <mesh key={i} rotation={[0, 0, (i / 4) * Math.PI * 2 + Math.PI/4]}>
          <ringGeometry args={[1.98, 2.02, 16, 1, -0.1, 0.2]} />
          <meshBasicMaterial color="#ff7a18" transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      );
    }
    return brackets;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    let speedMult = 1.0;
    if (activity === 'listening') speedMult = 0.2;
    if (activity === 'thinking') speedMult = 1.5;
    if (activity === 'speaking') speedMult = 2.0;

    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.3 * speedMult;
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.4 * speedMult;
    if (ring3Ref.current) ring3Ref.current.rotation.z = t * 0.2 * speedMult;
    if (ring4Ref.current) ring4Ref.current.rotation.z = -t * 0.1 * speedMult;
  });

  return (
    <group>
      {/* Ring 1 - Solid torus with tick marks */}
      <mesh ref={ring1Ref}>
        <ringGeometry args={[0.78, 0.82, 64]} />
        <meshBasicMaterial color="#ff9d2e" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      
      {/* Ring 2 - Dashed segments */}
      <group ref={ring2Ref}>{ring2Segments}</group>
      
      {/* Ring 3 - Thin ring with nodes */}
      <group ref={ring3Ref}>
        <mesh>
          <ringGeometry args={[1.59, 1.61, 64]} />
          <meshBasicMaterial color="#ffc46b" transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
        {ring3Nodes}
      </group>
      
      {/* Ring 4 - Outer containment with brackets */}
      <group ref={ring4Ref}>
        <mesh>
          <ringGeometry args={[1.99, 2.0, 64]} />
          <meshBasicMaterial color="#ff7a18" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
        {ring4Brackets}
      </group>
    </group>
  );
};

const DataStreams = ({ activity }: { activity: AiActivity }) => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particleData = useMemo(() => {
    const data = [];
    for (let i = 0; i < 60; i++) {
      const conduit = Math.floor(Math.random() * 14);
      const angle = (conduit / 14) * Math.PI * 2;
      data.push({
        angle,
        radius: Math.random() * 3 + 0.5,
        speed: Math.random() * 0.5 + 0.5,
        size: i % 7 === 0 ? 0.08 : 0.03
      });
    }
    return data;
  }, []);

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(60 * 3);
    const sz = new Float32Array(60);
    particleData.forEach((p, i) => {
      sz[i] = p.size;
    });
    return [pos, sz];
  }, [particleData]);

  useFrame((state) => {
    if (!particlesRef.current) return;
    const dt = state.clock.getDelta();
    
    let speedMult = 1.0;
    if (activity === 'listening') speedMult = 0.0;
    if (activity === 'thinking') speedMult = 2.0;
    if (activity === 'speaking') speedMult = 3.0;

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < 60; i++) {
      const p = particleData[i];
      p.radius += p.speed * dt * speedMult;
      if (p.radius > 4.0) p.radius = 0.5;
      
      // Curved path effect (slight spiral)
      const currentAngle = p.angle + p.radius * 0.2;
      
      positions[i * 3] = Math.cos(currentAngle) * p.radius;
      positions[i * 3 + 1] = Math.sin(currentAngle) * p.radius;
      positions[i * 3 + 2] = 0;
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={60} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={60} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial 
        color="#fffde0"
        size={0.05}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
};

const RepulsorWaves = ({ activity }: { activity: AiActivity }) => {
  const wavesRef = useRef<THREE.Group>(null);
  
  const waveData = useRef([{ radius: 0.5, active: false, opacity: 0 }, { radius: 0.5, active: false, opacity: 0 }]);
  const lastPulseRef = useRef(0);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const dt = state.clock.getDelta();
    
    if (activity === 'speaking') {
      if (t - lastPulseRef.current > 1.5) {
        lastPulseRef.current = t;
        // Fire a wave
        const wave = waveData.current.find(w => !w.active);
        if (wave) {
          wave.active = true;
          wave.radius = 0.5;
          wave.opacity = 1.0;
        }
      }
    }

    if (wavesRef.current) {
      wavesRef.current.children.forEach((child, i) => {
        const wave = waveData.current[i];
        if (wave.active) {
          wave.radius += 2.0 * dt; // expand speed
          wave.opacity -= 0.8 * dt; // fade speed
          if (wave.opacity <= 0) {
            wave.active = false;
          }
          child.scale.setScalar(wave.radius);
          (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({
            color: '#ff8c18',
            transparent: true,
            opacity: Math.max(0, wave.opacity),
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            toneMapped: false,
            side: THREE.DoubleSide
          });
        } else {
           (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({opacity: 0, transparent: true});
        }
      });
    }
  });

  return (
    <group ref={wavesRef}>
      <mesh>
        <ringGeometry args={[0.95, 1.0, 64]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <mesh>
        <ringGeometry args={[0.95, 1.0, 64]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
};

const SchematicGrid = () => {
  const lines = useMemo(() => {
    const l = [];
    // Concentric circles
    for (let i = 1; i <= 4; i++) {
      l.push(
        <mesh key={`circle-${i}`}>
          <ringGeometry args={[i - 0.005, i + 0.005, 64]} />
          <meshBasicMaterial color="#ff7a18" transparent opacity={0.1} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      );
    }
    // Radial lines
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI;
      l.push(
        <mesh key={`line-${i}`} rotation={[0, 0, angle]}>
          <planeGeometry args={[8, 0.01]} />
          <meshBasicMaterial color="#ff7a18" transparent opacity={0.08} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      );
    }
    return l;
  }, []);

  return <group>{lines}</group>;
};

const AmbientParticles = ({ activity }: { activity: AiActivity }) => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const [positions, phases] = useMemo(() => {
    const pos = new Float32Array(300 * 3);
    const ph = new Float32Array(300);
    for (let i = 0; i < 300; i++) {
      const r = 2 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      
      ph[i] = Math.random() * Math.PI * 2;
    }
    return [pos, ph];
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    const t = state.clock.elapsedTime;
    
    let speedMult = 1.0;
    if (activity === 'listening') speedMult = 0.5;
    if (activity === 'thinking') speedMult = 2.0;
    if (activity === 'speaking') speedMult = 3.0;

    particlesRef.current.rotation.y = t * 0.05 * speedMult;
    particlesRef.current.rotation.z = t * 0.03 * speedMult;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={300} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-phase" count={300} array={phases} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial 
        color="#ffd06b"
        size={0.03}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
};

const FresnelShell = () => {
  return (
    <mesh>
      <sphereGeometry args={[4.5, 32, 32]} />
      <shaderMaterial
        vertexShader={fresnelVertexShader}
        fragmentShader={fresnelFragmentShader}
        uniforms={{
          color: { value: new THREE.Color("#7a2608") }
        }}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export const SoulScene: React.FC<SoulSceneProps> = ({ activity = 'idle' }) => {
  return (
    <group>
      <fog attach="fog" args={['#060200', 7, 22]} />
      <ambientLight color="#4a2100" intensity={0.12} />
      <pointLight position={[0, 0, 1.5]} color="#ff8c18" intensity={2.8} distance={9} />
      <directionalLight position={[5, 8, 4]} color="#ffd7a3" intensity={0.3} />

      <SchematicGrid />
      <ArcReactorCore activity={activity} />
      <HudRings activity={activity} />
      <DataStreams activity={activity} />
      <RepulsorWaves activity={activity} />
      <AmbientParticles activity={activity} />
      <FresnelShell />
    </group>
  );
};
