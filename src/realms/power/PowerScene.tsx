import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AiActivity } from '../../App';

// ==========================================
// SHADERS
// ==========================================

const NOISE_GLSL = `
// Simplex 3D Noise 
// by Ian McEwan, Ashima Arts
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 1.0/7.0;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}
`;

const coreVertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
uniform float uTime;
uniform float uActivityPulse;

${NOISE_GLSL}

void main() {
  vUv = uv;
  vNormal = normal;
  
  float n = snoise(position * 5.0 + uTime * 2.0);
  vec3 pos = position + normal * n * 0.03 * uActivityPulse;
  vPosition = pos;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const coreFragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
uniform float uTime;
uniform vec3 uColor;

${NOISE_GLSL}

void main() {
  float n = snoise(vPosition * 8.0 - uTime * 3.0);
  float intensity = pow(0.6 + 0.4 * n, 2.0);
  
  vec3 glow = uColor * intensity * 2.5;
  
  // Core center white-hot
  float center = 1.0 - length(vPosition) * 4.0;
  center = clamp(center, 0.0, 1.0);
  glow += vec3(1.0) * pow(center, 3.0);

  gl_FragColor = vec4(glow, 1.0);
}
`;

const ringVertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const ringFragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;
uniform float uTime;
uniform vec3 uColor;
uniform float uSpeed;

${NOISE_GLSL}

void main() {
  float flow = fract(vUv.x * 3.0 - uTime * uSpeed);
  float noiseFlow = snoise(vec3(vUv.x * 10.0, vUv.y * 2.0, uTime));
  
  float glow = smoothstep(0.4, 0.5, flow) * smoothstep(0.6, 0.5, flow);
  glow += pow(max(0.0, noiseFlow), 2.0) * 0.8;
  
  // Edge fading on the torus
  float edge = smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);
  
  vec3 finalColor = uColor * glow * edge * 2.0;
  gl_FragColor = vec4(finalColor, glow * edge);
}
`;

const diskVertexShader = `
attribute float aAngle;
attribute float aRadius;
attribute float aSpeed;
attribute float aSize;
attribute vec3 aColor;

varying vec3 vColor;
varying float vAlpha;

uniform float uTime;
uniform float uExpansion;

void main() {
  vColor = aColor;
  
  // Spiral motion
  float currentAngle = aAngle - uTime * aSpeed;
  float currentRadius = mod(aRadius - uTime * aSpeed * 0.5, 3.0);
  currentRadius = mix(currentRadius, currentRadius * uExpansion, 0.5);
  
  if(currentRadius < 0.2) currentRadius += 2.8; // Respawn

  float x = cos(currentAngle) * currentRadius;
  float z = sin(currentAngle) * currentRadius;
  float y = sin(currentAngle * 5.0 + uTime) * 0.05 * currentRadius; // Slight vertical wave
  
  vec3 pos = vec3(x, y, z);
  
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  
  // Size attenuation
  gl_PointSize = aSize * (10.0 / -mvPosition.z);
  
  // Fade out at edges and center
  vAlpha = smoothstep(0.0, 0.5, currentRadius) * smoothstep(3.0, 1.5, currentRadius);
}
`;

const diskFragmentShader = `
varying vec3 vColor;
varying float vAlpha;

void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;
  
  float glow = pow(1.0 - (dist * 2.0), 1.5);
  gl_FragColor = vec4(vColor * glow * 1.5, vAlpha * glow);
}
`;

const lensingVertexShader = `
varying vec3 vNormal;
varying vec3 vViewPosition;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const lensingFragmentShader = `
varying vec3 vNormal;
varying vec3 vViewPosition;
uniform vec3 uColor;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewPosition);
  
  float rim = 1.0 - max(dot(viewDir, normal), 0.0);
  float rimPower = pow(rim, 6.0); // Sharp edge
  float innerGlow = pow(rim, 2.0) * 0.1;
  
  vec3 color = uColor * (rimPower * 3.0 + innerGlow);
  float alpha = rimPower * 0.8 + innerGlow * 0.2;
  
  gl_FragColor = vec4(color, alpha);
}
`;

// ==========================================
// COMPONENTS
// ==========================================

const SingularityCore = ({ activity }: { activity: AiActivity }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#ffffff') },
    uActivityPulse: { value: 1.0 }
  }), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    uniforms.uTime.value = t;
    
    let targetScale = 1.0;
    let targetPulse = 1.0;
    
    switch (activity) {
      case 'listening':
        targetScale = 0.9;
        targetPulse = 0.5;
        break;
      case 'thinking':
        // Contract sharply then release (thought burst pattern)
        targetScale = 0.8 + Math.sin(t * 8) * 0.1;
        targetPulse = 2.0;
        break;
      case 'speaking':
        targetScale = 1.2 + Math.sin(t * 7) * 0.15;
        targetPulse = 3.0;
        break;
      case 'idle':
      default:
        targetScale = 1.0 + Math.sin(t * 2) * 0.05;
        targetPulse = 1.0;
        break;
    }
    
    if (meshRef.current) {
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    if (haloRef.current) {
      haloRef.current.scale.lerp(new THREE.Vector3(targetScale * 1.5, targetScale * 1.5, targetScale * 1.5), 0.1);
      const haloMat = haloRef.current.material as THREE.MeshBasicMaterial;
      haloMat.opacity = THREE.MathUtils.lerp(haloMat.opacity, activity === 'speaking' ? 0.5 : 0.25, 0.1);
    }
    
    uniforms.uActivityPulse.value = THREE.MathUtils.lerp(uniforms.uActivityPulse.value, targetPulse, 0.1);
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.105, 64, 64]} />
        <shaderMaterial
          vertexShader={coreVertexShader}
          fragmentShader={coreFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Halo */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshBasicMaterial 
          color="#d8b4fe" 
          transparent 
          opacity={0.25} 
          depthWrite={false} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

const GravitationalRings = ({ activity }: { activity: AiActivity }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const ringsData = useMemo(() => [
    { radius: 0.6, tube: 0.015, color: '#a855f7', tilt: [Math.PI/3, Math.PI/4, 0], speed: 1.0 },
    { radius: 1.2, tube: 0.02, color: '#7c3aed', tilt: [-Math.PI/4, Math.PI/3, Math.PI/6], speed: -0.7 },
    { radius: 1.8, tube: 0.03, color: '#6d28d9', tilt: [Math.PI/2.5, -Math.PI/6, Math.PI/2], speed: 0.5 }
  ], []);

  const uniformsArray = useMemo(() => ringsData.map(r => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(r.color) },
    uSpeed: { value: r.speed }
  })), [ringsData]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    let speedMult = 1.0;
    if (activity === 'speaking') speedMult = 2.0;
    else if (activity === 'listening') speedMult = 0.5;
    else if (activity === 'thinking') speedMult = -1.5; // reverse briefly
    
    uniformsArray.forEach((u, i) => {
      u.uTime.value += state.clock.getDelta() * speedMult;
      // Also slowly rotate the entire rings for extra dynamics
      if (groupRef.current) {
        const mesh = groupRef.current.children[i] as THREE.Mesh;
        mesh.rotation.y += state.clock.getDelta() * 0.1 * (i % 2 === 0 ? 1 : -1) * speedMult;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {ringsData.map((ring, i) => (
        <mesh key={i} rotation={new THREE.Euler(...ring.tilt)}>
          <torusGeometry args={[ring.radius, ring.tube, 32, 100]} />
          <shaderMaterial
            vertexShader={ringVertexShader}
            fragmentShader={ringFragmentShader}
            uniforms={uniformsArray[i]}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

const AccretionDisk = ({ activity }: { activity: AiActivity }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 800;

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uExpansion: { value: 1.0 }
  }), []);

  const { positions, angles, radii, speeds, sizes, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const ang = new Float32Array(count);
    const rad = new Float32Array(count);
    const spd = new Float32Array(count);
    const sz = new Float32Array(count);
    const col = new Float32Array(count * 3);

    const colorOuter = new THREE.Color('#4c1d95');
    const colorMid = new THREE.Color('#9333ea');
    const colorInner = new THREE.Color('#f3e8ff');

    for (let i = 0; i < count; i++) {
      ang[i] = Math.random() * Math.PI * 2;
      const r = 0.2 + Math.pow(Math.random(), 1.5) * 2.8;
      rad[i] = r;
      spd[i] = (1.0 / (r + 0.5)) * (0.5 + Math.random() * 0.5);
      sz[i] = Math.random() * 8.0 + 2.0;

      const c = new THREE.Color();
      if (r < 1.0) c.lerpColors(colorInner, colorMid, r);
      else c.lerpColors(colorMid, colorOuter, (r - 1.0) / 1.8);

      col[i*3] = c.r;
      col[i*3+1] = c.g;
      col[i*3+2] = c.b;
      
      // Init positions at 0, shader handles placement
      pos[i*3] = 0; pos[i*3+1] = 0; pos[i*3+2] = 0;
    }

    return { positions: pos, angles: ang, radii: rad, speeds: spd, sizes: sz, colors: col };
  }, [count]);

  useFrame((state) => {
    const dt = state.clock.getDelta();
    uniforms.uTime.value += dt * (activity === 'speaking' ? 2.5 : activity === 'thinking' ? 1.5 : 1.0);
    
    let targetExp = 1.0;
    if (activity === 'speaking') targetExp = 1.3;
    if (activity === 'listening') targetExp = 0.8;
    
    uniforms.uExpansion.value = THREE.MathUtils.lerp(uniforms.uExpansion.value, targetExp, 0.05);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aAngle" count={count} array={angles} itemSize={1} />
        <bufferAttribute attach="attributes-aRadius" count={count} array={radii} itemSize={1} />
        <bufferAttribute attach="attributes-aSpeed" count={count} array={speeds} itemSize={1} />
        <bufferAttribute attach="attributes-aSize" count={count} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-aColor" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={diskVertexShader}
        fragmentShader={diskFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const CosmicConstellation = () => {
  const groupRef = useRef<THREE.Group>(null);
  const count = 250;
  
  const { positions, linesPos } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const pts: THREE.Vector3[] = [];
    
    for (let i = 0; i < count; i++) {
      // Spherical shell 3.5 - 5.0
      const r = 3.5 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      pos[i*3] = x; pos[i*3+1] = y; pos[i*3+2] = z;
      pts.push(new THREE.Vector3(x, y, z));
    }

    // Connect nearby stars
    const lp: number[] = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        if (pts[i].distanceTo(pts[j]) < 1.2) {
          lp.push(pts[i].x, pts[i].y, pts[i].z);
          lp.push(pts[j].x, pts[j].y, pts[j].z);
        }
      }
    }
    
    return { positions: pos, linesPos: new Float32Array(lp) };
  }, [count]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.01;
      groupRef.current.rotation.x += delta * 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.03} color="#e9d5ff" transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={linesPos.length / 3} array={linesPos} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#a855f7" transparent opacity={0.15} depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>
    </group>
  );
};

const GammaRayJets = ({ activity }: { activity: AiActivity }) => {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const count = 160; // 80 per jet (up/down)

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const isUp = i < count / 2;
      return {
        y: isUp ? Math.random() * 4 : -Math.random() * 4,
        speed: 1.0 + Math.random() * 2.0,
        x: (Math.random() - 0.5) * 0.1,
        z: (Math.random() - 0.5) * 0.1,
        isUp,
        scale: Math.random() * 0.5 + 0.5,
      };
    });
  }, [count]);

  useFrame((state, delta) => {
    if (!instancedMeshRef.current) return;
    
    const time = state.clock.elapsedTime;
    let speedMult = 1.0;
    if (activity === 'speaking') speedMult = 3.0;
    if (activity === 'thinking') speedMult = 1.5;

    particles.forEach((p, i) => {
      // Move outwards
      p.y += (p.isUp ? 1 : -1) * p.speed * speedMult * delta;
      
      // Wiggle
      const wiggleX = Math.sin(time * 5 + i) * 0.05 * (Math.abs(p.y) / 2);
      const wiggleZ = Math.cos(time * 5 + i) * 0.05 * (Math.abs(p.y) / 2);
      
      // Respawn
      if (Math.abs(p.y) > 4.0) {
        p.y = p.isUp ? 0.1 : -0.1;
      }

      dummy.position.set(p.x + wiggleX, p.y, p.z + wiggleZ);
      
      // Scale based on distance (taper off)
      const distScale = Math.max(0, 1 - Math.abs(p.y) / 4);
      const finalScale = p.scale * distScale * (activity === 'speaking' ? 2 : 1);
      
      dummy.scale.set(finalScale, finalScale * 4, finalScale); // stretch along Y
      dummy.updateMatrix();
      instancedMeshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={instancedMeshRef} args={[undefined, undefined, count]} blending={THREE.AdditiveBlending} depthWrite={false}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color="#f3e8ff" transparent opacity={0.6} toneMapped={false} />
    </instancedMesh>
  );
};

const GravitationalLensing = () => {
  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color('#4c1d95') }
  }), []);

  return (
    <mesh>
      <sphereGeometry args={[2.5, 64, 64]} />
      <shaderMaterial
        vertexShader={lensingVertexShader}
        fragmentShader={lensingFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

const EnergyLightning = ({ activity }: { activity: AiActivity }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Create a pool of lines
  const linesCount = 8;
  const segments = 10;
  
  const arcs = useMemo(() => {
    return Array.from({ length: linesCount }, () => ({
      active: false,
      timer: 0,
      duration: 0,
      target: new THREE.Vector3(),
      positions: new Float32Array((segments + 1) * 3)
    }));
  }, [linesCount, segments]);

  const geometries = useMemo(() => {
    return arcs.map(() => new THREE.BufferGeometry());
  }, [arcs]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    
    let prob = 0.01;
    if (activity === 'thinking') prob = 0.08;
    if (activity === 'speaking') prob = 0.05;

    arcs.forEach((arc, i) => {
      if (!arc.active) {
        if (Math.random() < prob) {
          arc.active = true;
          arc.timer = 0;
          arc.duration = 0.1 + Math.random() * 0.2; // short flashes
          // Random outer point
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);
          const r = 1.0 + Math.random() * 1.5;
          arc.target.set(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
          );
        }
      } else {
        arc.timer += delta;
        if (arc.timer > arc.duration) {
          arc.active = false;
          // Clear geometry
          geometries[i].setAttribute('position', new THREE.BufferAttribute(new Float32Array(0), 3));
        } else {
          // Update points with noise
          for (let j = 0; j <= segments; j++) {
            const pct = j / segments;
            const basePos = new THREE.Vector3().lerpVectors(new THREE.Vector3(0,0,0), arc.target, pct);
            
            if (j > 0 && j < segments) {
              const noiseX = (Math.random() - 0.5) * 0.3;
              const noiseY = (Math.random() - 0.5) * 0.3;
              const noiseZ = (Math.random() - 0.5) * 0.3;
              basePos.add(new THREE.Vector3(noiseX, noiseY, noiseZ));
            }
            
            arc.positions[j*3] = basePos.x;
            arc.positions[j*3+1] = basePos.y;
            arc.positions[j*3+2] = basePos.z;
          }
          geometries[i].setAttribute('position', new THREE.BufferAttribute(arc.positions, 3));
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      {geometries.map((geo, i) => (
        <line key={i} geometry={geo}>
          <lineBasicMaterial color="#e9d5ff" transparent opacity={0.8} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </line>
      ))}
    </group>
  );
};

// ==========================================
// MAIN SCENE
// ==========================================

export function PowerScene({ activity = 'idle' }: { activity?: AiActivity }) {
  return (
    <group>
      {/* Lighting */}
      <ambientLight color="#2e1065" intensity={0.15} />
      <pointLight position={[0, 0, 2]} color="#a855f7" intensity={2.5} distance={8} />
      
      {/* Fog handled via R3F parent typically, but we can add it local to scene if context allows.
          Since fog is usually applied to the Canvas, doing it via a mesh in the background is an alternative,
          but the instructions specify fog: [#0a0015, 7, 20]. We can attach it to the scene graph. */}
      <fog attach="fog" args={['#0a0015', 7, 20]} />

      <SingularityCore activity={activity} />
      <GravitationalRings activity={activity} />
      <AccretionDisk activity={activity} />
      <CosmicConstellation />
      <GammaRayJets activity={activity} />
      <GravitationalLensing />
      <EnergyLightning activity={activity} />
    </group>
  );
}
