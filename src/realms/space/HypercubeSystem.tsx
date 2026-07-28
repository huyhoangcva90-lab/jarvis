import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type SpaceActivity = "idle" | "listening" | "thinking" | "speaking";

function speedFor(activity: SpaceActivity) {
  return activity === "speaking" ? 2.5 : activity === "thinking" ? 1.6 : activity === "listening" ? 0.4 : 0.8;
}

// 4D Tesseract Vertices (16 vertices of a hypercube)
const TESSERACT_VERTICES_4D = Array.from({ length: 16 }, (_, i) => [
  (i & 1) ? 1 : -1,
  (i & 2) ? 1 : -1,
  (i & 4) ? 1 : -1,
  (i & 8) ? 1 : -1,
]);

// 32 Edges connecting vertices that differ by 1 bit
const TESSERACT_EDGES: [number, number][] = [];
for (let i = 0; i < 16; i++) {
  for (let j = i + 1; j < 16; j++) {
    const diff = i ^ j;
    if (diff === 1 || diff === 2 || diff === 4 || diff === 8) {
      TESSERACT_EDGES.push([i, j]);
    }
  }
}

// 8 Dimensional Anchor points for energy bridges
const ANCHORS = [
  [-2.8, -2.8, -2.8], [2.8, -2.8, -2.8], [-2.8, 2.8, -2.8], [2.8, 2.8, -2.8],
  [-2.8, -2.8, 2.8], [2.8, -2.8, 2.8], [-2.8, 2.8, 2.8], [2.8, 2.8, 2.8],
];

export function HypercubeSystem({ activity = "idle" }: { activity?: SpaceActivity }) {
  const root = useRef<THREE.Group>(null);
  
  // Tesseract
  const tesseractGeoRef = useRef<THREE.BufferGeometry>(null);
  const tesseractInnerGeoRef = useRef<THREE.BufferGeometry>(null);
  const wAngle = useRef(0);
  
  // Spatial Warp Grid
  const gridGeoRef = useRef<THREE.PlaneGeometry>(null);
  
  // Portal Vortex
  const portalGroup = useRef<THREE.Group>(null);
  const portalParticlesGeoRef = useRef<THREE.BufferGeometry>(null);
  
  // Dimensional Rifts
  const riftGeoRef = useRef<THREE.BufferGeometry>(null);
  const riftMatRef = useRef<THREE.LineBasicMaterial>(null);
  
  // Quantum Foam
  const foamGeoRef = useRef<THREE.BufferGeometry>(null);
  
  // Energy Bridges
  const bridgeGeoRef = useRef<THREE.BufferGeometry>(null);
  const anchorCubesRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Entrance state
  const entrance = useRef(0);

  // Initialization
  const { portalParticlesGeo, foamGeo, riftGeo, tesseractGeo, tesseractInnerGeo, bridgeGeo } = useMemo(() => {
    // Portal Particles
    const pGeo = new THREE.BufferGeometry();
    const pCount = 600;
    pGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pCount * 3), 3));
    const pPhases = new Float32Array(pCount);
    const pRings = new Float32Array(pCount);
    for (let i = 0; i < pCount; i++) {
      pPhases[i] = Math.random() * Math.PI * 2;
      pRings[i] = i % 3;
    }
    pGeo.setAttribute('phase', new THREE.BufferAttribute(pPhases, 1));
    pGeo.setAttribute('ring', new THREE.BufferAttribute(pRings, 1));

    // Quantum Foam
    const fGeo = new THREE.BufferGeometry();
    const fCount = 800;
    const fPos = new Float32Array(fCount * 3);
    for (let i = 0; i < fCount * 3; i++) fPos[i] = (Math.random() - 0.5) * 20;
    fGeo.setAttribute('position', new THREE.BufferAttribute(fPos, 3));
    const fVels = new Float32Array(fCount * 3);
    for (let i = 0; i < fCount * 3; i++) fVels[i] = (Math.random() - 0.5) * 0.02;
    fGeo.setAttribute('velocity', new THREE.BufferAttribute(fVels, 3));

    // Rifts
    const rGeo = new THREE.BufferGeometry();
    rGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(30 * 2 * 3), 3));

    // Tesseract
    const tGeo = new THREE.BufferGeometry();
    tGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(32 * 2 * 3), 3));
    
    const tInnerGeo = new THREE.BufferGeometry();
    tInnerGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(32 * 2 * 3), 3));

    // Bridges
    const bGeo = new THREE.BufferGeometry();
    bGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(8 * 2 * 3), 3));

    return { 
      portalParticlesGeo: pGeo, 
      foamGeo: fGeo, 
      riftGeo: rGeo, 
      tesseractGeo: tGeo,
      tesseractInnerGeo: tInnerGeo,
      bridgeGeo: bGeo 
    };
  }, []);

  useEffect(() => {
    // Init anchor cubes
    if (anchorCubesRef.current) {
      ANCHORS.forEach((pos, i) => {
        dummy.position.set(...pos as [number, number, number]);
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        anchorCubesRef.current!.setMatrixAt(i, dummy.matrix);
      });
      anchorCubesRef.current.instanceMatrix.needsUpdate = true;
    }
    
    return () => {
      portalParticlesGeo.dispose();
      foamGeo.dispose();
      riftGeo.dispose();
      tesseractGeo.dispose();
      tesseractInnerGeo.dispose();
      bridgeGeo.dispose();
    };
  }, [bridgeGeo, dummy, foamGeo, portalParticlesGeo, riftGeo, tesseractGeo, tesseractInnerGeo]);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const speed = speedFor(activity);
    const dTime = delta * speed;

    // Entrance Animation
    if (entrance.current < 1) {
      entrance.current += delta * 0.6;
      const s = THREE.MathUtils.clamp(entrance.current, 0, 1);
      const ease = 1 - Math.pow(1 - s, 4);
      if (root.current) {
        root.current.scale.setScalar(ease);
      }
    }

    // 4D Tesseract Projection
    wAngle.current += dTime * 0.4;
    const theta = wAngle.current;
    
    const projected = TESSERACT_VERTICES_4D.map(([x, y, z, w]) => {
      // Rotation in XW plane (morphing the 4th dimension)
      const x2 = x * Math.cos(theta) - w * Math.sin(theta);
      const w2 = x * Math.sin(theta) + w * Math.cos(theta);
      
      // Secondary rotation in ZW plane to make it more complex
      const z2 = z * Math.cos(theta * 0.5) - w2 * Math.sin(theta * 0.5);
      const w3 = z * Math.sin(theta * 0.5) + w2 * Math.cos(theta * 0.5);
      
      // Project to 3D
      const distance = 2.8;
      const w_factor = 1.0 / (distance - w3);
      
      return [x2 * w_factor * 2, y * w_factor * 2, z2 * w_factor * 2];
    });

    if (tesseractGeoRef.current && tesseractInnerGeoRef.current) {
      const pos = tesseractGeoRef.current.attributes.position.array as Float32Array;
      const posInner = tesseractInnerGeoRef.current.attributes.position.array as Float32Array;
      let idx = 0;
      for (const [i, j] of TESSERACT_EDGES) {
        // Outer tesseract
        pos[idx] = projected[i][0]; pos[idx+1] = projected[i][1]; pos[idx+2] = projected[i][2];
        pos[idx+3] = projected[j][0]; pos[idx+4] = projected[j][1]; pos[idx+5] = projected[j][2];
        
        // Inner tesseract (scaled and inverted)
        posInner[idx] = projected[i][0] * 0.4; posInner[idx+1] = projected[i][1] * 0.4; posInner[idx+2] = projected[i][2] * 0.4;
        posInner[idx+3] = projected[j][0] * 0.4; posInner[idx+4] = projected[j][1] * 0.4; posInner[idx+5] = projected[j][2] * 0.4;
        
        idx += 6;
      }
      tesseractGeoRef.current.attributes.position.needsUpdate = true;
      tesseractInnerGeoRef.current.attributes.position.needsUpdate = true;
    }
    
    // Tesseract overall rotation
    if (root.current) {
      root.current.rotation.x = Math.sin(t * 0.2) * 0.2;
      root.current.rotation.y += dTime * 0.15;
      root.current.rotation.z = Math.cos(t * 0.15) * 0.15;
    }

    // Energy Bridges (connecting to specific projected vertices)
    if (bridgeGeoRef.current) {
      const bPos = bridgeGeoRef.current.attributes.position.array as Float32Array;
      // Connect first 8 projected vertices to the 8 fixed anchors
      for(let i = 0; i < 8; i++) {
        bPos[i*6] = projected[i][0];
        bPos[i*6+1] = projected[i][1];
        bPos[i*6+2] = projected[i][2];
        bPos[i*6+3] = ANCHORS[i][0];
        bPos[i*6+4] = ANCHORS[i][1];
        bPos[i*6+5] = ANCHORS[i][2];
      }
      bridgeGeoRef.current.attributes.position.needsUpdate = true;
    }

    // Anchor Cubes Rotation
    if (anchorCubesRef.current) {
      const pulse = activity === "speaking" ? Math.sin(t * 10) * 0.2 : 0;
      for (let i = 0; i < 8; i++) {
        dummy.position.set(...ANCHORS[i] as [number, number, number]);
        dummy.rotation.set(t * speed + i, t * speed * 1.2 + i, t * speed * 0.8 + i);
        dummy.scale.setScalar(0.4 + pulse);
        dummy.updateMatrix();
        anchorCubesRef.current.setMatrixAt(i, dummy.matrix);
      }
      anchorCubesRef.current.instanceMatrix.needsUpdate = true;
    }

    // Spatial Warp Grid
    if (gridGeoRef.current) {
      const pos = gridGeoRef.current.attributes.position;
      const intensity = activity === "speaking" ? 1.5 : activity === "thinking" ? 1.0 : 0.3;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const dist = Math.sqrt(x*x + y*y);
        // Space bends heavily near center (x=0, y=0)
        let z = -Math.exp(-dist * 0.3) * 6.0 * intensity;
        // Subtle ripple
        z += Math.sin(dist * 1.5 - t * speed * 2) * 0.3 * intensity;
        pos.setZ(i, z);
      }
      pos.needsUpdate = true;
    }

    // Cosmic Portal Vortex
    if (portalGroup.current) {
      portalGroup.current.rotation.z -= dTime * 0.2;
      const scaleBase = activity === "listening" ? 0.85 : activity === "speaking" ? 1.1 : 1.0;
      const vortexPulse = Math.sin(t * 4) * 0.05 * (activity === "speaking" ? 2 : 1);
      portalGroup.current.scale.setScalar(scaleBase + vortexPulse);
    }
    
    // Portal Particles
    if (portalParticlesGeoRef.current) {
      const pPos = portalParticlesGeoRef.current.attributes.position.array as Float32Array;
      const pPhase = portalParticlesGeoRef.current.attributes.phase.array as Float32Array;
      const pRing = portalParticlesGeoRef.current.attributes.ring.array as Float32Array;
      
      for (let i = 0; i < pPos.length / 3; i++) {
        pPhase[i] += dTime * (1.0 + pRing[i] * 0.5);
        const rIndex = pRing[i];
        const radius = 4 + rIndex * 1.5;
        const tilt = rIndex * 0.4;
        const p = pPhase[i];
        
        // Circular orbit
        let x = Math.cos(p) * radius;
        let y = Math.sin(p) * radius;
        let z = Math.sin(p * 3) * 0.3; // wobbly
        
        // Apply ring tilt
        const xRot = x * Math.cos(tilt) - z * Math.sin(tilt);
        const zRot = x * Math.sin(tilt) + z * Math.cos(tilt);
        
        pPos[i*3] = xRot;
        pPos[i*3+1] = y;
        pPos[i*3+2] = zRot;
      }
      portalParticlesGeoRef.current.attributes.position.needsUpdate = true;
      portalParticlesGeoRef.current.attributes.phase.needsUpdate = true;
    }

    // Dimensional Rifts
    if (riftGeoRef.current && riftMatRef.current) {
      const isActive = activity === "speaking" || activity === "thinking";
      riftMatRef.current.opacity = isActive ? 0.8 : 0;
      
      if (isActive) {
        const rPos = riftGeoRef.current.attributes.position.array as Float32Array;
        // Randomly scatter rift lines every few frames
        if (Math.random() < 0.2 * speed) {
          for (let i = 0; i < 30; i++) {
            const rx = (Math.random() - 0.5) * 12;
            const ry = (Math.random() - 0.5) * 12;
            const rz = (Math.random() - 0.5) * 12;
            const len = Math.random() * 2 + 0.5;
            rPos[i*6] = rx;
            rPos[i*6+1] = ry;
            rPos[i*6+2] = rz;
            rPos[i*6+3] = rx + (Math.random()-0.5)*len;
            rPos[i*6+4] = ry + (Math.random()-0.5)*len;
            rPos[i*6+5] = rz + (Math.random()-0.5)*len;
          }
          riftGeoRef.current.attributes.position.needsUpdate = true;
        }
      }
    }

    // Quantum Foam Drift
    if (foamGeoRef.current) {
      const fPos = foamGeoRef.current.attributes.position.array as Float32Array;
      const fVel = foamGeoRef.current.attributes.velocity.array as Float32Array;
      const agitation = activity === "speaking" ? 3 : 1;
      for (let i = 0; i < fPos.length; i++) {
        fPos[i] += fVel[i] * agitation;
        // Wrap around
        if (fPos[i] > 10) fPos[i] = -10;
        if (fPos[i] < -10) fPos[i] = 10;
      }
      foamGeoRef.current.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={root}>
      {/* 4D Tesseract Outer */}
      <lineSegments>
        <bufferGeometry ref={tesseractGeoRef} />
        <lineBasicMaterial 
          color="#28baff" 
          blending={THREE.AdditiveBlending} 
          transparent 
          opacity={0.8} 
          depthWrite={false} 
          toneMapped={false} 
        />
      </lineSegments>

      {/* 4D Tesseract Inner */}
      <lineSegments>
        <bufferGeometry ref={tesseractInnerGeoRef} />
        <lineBasicMaterial 
          color="#f4ffff" 
          blending={THREE.AdditiveBlending} 
          transparent 
          opacity={0.9} 
          depthWrite={false} 
          toneMapped={false} 
        />
      </lineSegments>
      
      {/* Energy Bridges */}
      <lineSegments>
        <bufferGeometry ref={bridgeGeoRef} />
        <lineBasicMaterial 
          color="#77f7ff" 
          blending={THREE.AdditiveBlending} 
          transparent 
          opacity={0.3} 
          depthWrite={false} 
          toneMapped={false} 
        />
      </lineSegments>
      
      {/* Dimensional Anchor Nodes */}
      <instancedMesh ref={anchorCubesRef} args={[new THREE.BoxGeometry(1, 1, 1), undefined, 8]}>
        <meshBasicMaterial 
          color="#a7ffff" 
          blending={THREE.AdditiveBlending} 
          transparent 
          opacity={0.6} 
          wireframe 
          depthWrite={false} 
          toneMapped={false} 
        />
      </instancedMesh>

      {/* Tesseract Core Light */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#f4ffff" toneMapped={false} />
      </mesh>

      {/* Spatial Warp Grid */}
      <mesh position={[0, 0, -6]}>
        <planeGeometry args={[30, 30, 45, 45]} ref={gridGeoRef} />
        <meshBasicMaterial 
          color="#1a8cff" 
          wireframe 
          transparent 
          opacity={0.15} 
          blending={THREE.AdditiveBlending} 
          depthWrite={false} 
          toneMapped={false}
        />
      </mesh>

      {/* Cosmic Portal Vortex */}
      <group ref={portalGroup}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[Math.PI / 2 + i * 0.4, i * 0.2, 0]}>
            <torusGeometry args={[4 + i * 1.5, 0.03, 8, 100]} />
            <meshBasicMaterial 
              color="#28baff" 
              transparent 
              opacity={0.3 - i * 0.08} 
              blending={THREE.AdditiveBlending} 
              depthWrite={false} 
              toneMapped={false} 
            />
          </mesh>
        ))}
        {/* Swirling Vortex Particles */}
        <points>
          <bufferGeometry ref={portalParticlesGeoRef} />
          <pointsMaterial 
            color="#a7ffff" 
            size={0.06} 
            transparent 
            opacity={0.8} 
            blending={THREE.AdditiveBlending} 
            depthWrite={false} 
            toneMapped={false} 
          />
        </points>
      </group>

      {/* Dimensional Rifts */}
      <lineSegments>
        <bufferGeometry ref={riftGeoRef} />
        <lineBasicMaterial 
          ref={riftMatRef}
          color="#eaffff" 
          blending={THREE.AdditiveBlending} 
          transparent 
          depthWrite={false} 
          toneMapped={false} 
        />
      </lineSegments>

      {/* Quantum Foam Particles */}
      <points>
        <bufferGeometry ref={foamGeoRef} />
        <pointsMaterial 
          color="#77f7ff" 
          size={0.04} 
          transparent 
          opacity={0.4} 
          blending={THREE.AdditiveBlending} 
          depthWrite={false} 
          toneMapped={false} 
        />
      </points>
    </group>
  );
}
