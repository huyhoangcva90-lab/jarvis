import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AiActivity } from "../../types/orb";
import { LivingOrb } from "../../core/LivingOrb";

const TAU = Math.PI * 2;

function speedFor(activity: AiActivity) {
  return activity === "speaking" ? 2.1 : activity === "thinking" ? 1.55 : activity === "listening" ? 0.55 : 1;
}

function buildNanotechShell() {
  const points: THREE.Vector3[] = [];
  const radius = 2.4;
  const PHI = Math.PI * (3 - Math.sqrt(5));
  const numSamples = 140;
  for (let i = 0; i < numSamples; i++) {
    const y = 1 - (i / (numSamples - 1)) * 2;
    if (y < -0.2) continue; // Cover top ~60%
    
    const r = Math.sqrt(1 - y * y);
    const theta = PHI * i;
    
    const cx = Math.cos(theta) * r * radius;
    const cy = y * radius;
    const cz = Math.sin(theta) * r * radius;
    
    const hexSize = 0.22;
    for (let j = 0; j < 6; j++) {
      const a1 = (j / 6) * TAU;
      const a2 = ((j + 1) / 6) * TAU;
      
      const normal = new THREE.Vector3(cx, cy, cz).normalize();
      const up = Math.abs(normal.y) > 0.99 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
      const tangent = new THREE.Vector3().crossVectors(up, normal).normalize();
      const bitangent = new THREE.Vector3().crossVectors(normal, tangent).normalize();
      
      const p1 = new THREE.Vector3(cx, cy, cz)
        .add(tangent.clone().multiplyScalar(Math.cos(a1) * hexSize))
        .add(bitangent.clone().multiplyScalar(Math.sin(a1) * hexSize));
      const p2 = new THREE.Vector3(cx, cy, cz)
        .add(tangent.clone().multiplyScalar(Math.cos(a2) * hexSize))
        .add(bitangent.clone().multiplyScalar(Math.sin(a2) * hexSize));
      points.push(p1, p2);
    }
  }
  return new THREE.BufferGeometry().setFromPoints(points);
}

function buildCircuits() {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * TAU;
    const startR = 1.3;
    const midR1 = startR + 0.3 + (i % 3) * 0.2;
    const midR2 = midR1 + 0.4 + (i % 2) * 0.2;
    
    const dir = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0);
    const ortho = new THREE.Vector3(-Math.sin(angle), Math.cos(angle), 0);
    
    const p0 = dir.clone().multiplyScalar(startR);
    const p1 = dir.clone().multiplyScalar(midR1);
    
    const shiftDir = i % 2 === 0 ? 1 : -1;
    const shiftMag = 0.3;
    const p2 = p1.clone().add(ortho.clone().multiplyScalar(shiftMag * shiftDir));
    const p3 = p2.clone().add(dir.clone().multiplyScalar(midR2 - midR1));
    
    points.push(p0, p1, p1, p2, p2, p3);
    
    const crossSize = 0.06;
    points.push(
      p3.clone().add(dir.clone().multiplyScalar(crossSize)), p3.clone().add(dir.clone().multiplyScalar(-crossSize)),
      p3.clone().add(ortho.clone().multiplyScalar(crossSize)), p3.clone().add(ortho.clone().multiplyScalar(-crossSize))
    );
  }
  return new THREE.BufferGeometry().setFromPoints(points);
}

function buildTickMarks() {
  const points: THREE.Vector3[] = [];
  const radius = 2.8;
  for (let i = 0; i < 72; i++) {
    const angle = (i / 72) * TAU;
    const isMajor = i % 6 === 0;
    const rIn = radius;
    const rOut = radius + (isMajor ? 0.18 : 0.06);
    points.push(
      new THREE.Vector3(Math.cos(angle) * rIn, Math.sin(angle) * rIn, 0),
      new THREE.Vector3(Math.cos(angle) * rOut, Math.sin(angle) * rOut, 0)
    );
  }
  for (let i = 0; i < 72; i++) {
    const a1 = (i / 72) * TAU;
    const a2 = ((i + 1) / 72) * TAU;
    points.push(
      new THREE.Vector3(Math.cos(a1) * radius, Math.sin(a1) * radius, 0),
      new THREE.Vector3(Math.cos(a2) * radius, Math.sin(a2) * radius, 0)
    );
  }
  return new THREE.BufferGeometry().setFromPoints(points);
}

export function ArcCoreScene({ activity }: { activity: AiActivity }) {
  const root = useRef<THREE.Group>(null);
  const apertureGroup = useRef<THREE.Group>(null);
  const innerHud = useRef<THREE.Group>(null);
  const middleHud = useRef<THREE.Group>(null);
  const outerHud = useRef<THREE.LineSegments>(null);
  const nanotech = useRef<THREE.LineSegments>(null);
  const circuits = useRef<THREE.LineSegments>(null);
  const beamsGroup = useRef<THREE.Group>(null);
  const particles = useRef<THREE.Points>(null);
  const coreInner = useRef<THREE.Mesh>(null);
  
  const nanotechGeom = useMemo(buildNanotechShell, []);
  const circuitGeom = useMemo(buildCircuits, []);
  const tickGeom = useMemo(buildTickMarks, []);
  
  const particleGeom = useMemo(() => {
    const pts = [];
    for(let i=0; i<150; i++) {
      const r = 1.5 + Math.random() * 2.5;
      const theta = Math.random() * TAU;
      const y = (Math.random() - 0.5) * 1.5;
      pts.push(new THREE.Vector3(Math.cos(theta)*r, y, Math.sin(theta)*r));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  const nanotechMaterial = useMemo(() => new THREE.LineBasicMaterial({ color: "#ff9a32", transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.3, toneMapped: false }), []);
  const circuitMaterial = useMemo(() => new THREE.LineBasicMaterial({ color: "#ff7a16", transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.5, toneMapped: false }), []);
  const beamsMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: "#f1ffff", transparent: true, opacity: 0.4, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }), []);

  const bladeRefs = useRef<(THREE.Group | null)[]>([]);

  useEffect(() => {
    return () => {
      nanotechGeom.dispose();
      circuitGeom.dispose();
      tickGeom.dispose();
      particleGeom.dispose();
      nanotechMaterial.dispose();
      circuitMaterial.dispose();
      beamsMaterial.dispose();
    };
  }, [nanotechGeom, circuitGeom, tickGeom, particleGeom, nanotechMaterial, circuitMaterial, beamsMaterial]);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const speed = speedFor(activity);
    
    if (root.current) {
      root.current.rotation.y = Math.sin(t * 0.5) * 0.1;
      root.current.rotation.x = Math.sin(t * 0.3) * 0.1;
    }
    
    if (innerHud.current) innerHud.current.rotation.z += delta * 0.5 * speed;
    if (middleHud.current) middleHud.current.rotation.z -= delta * 0.3 * speed;
    if (outerHud.current) outerHud.current.rotation.z += delta * 0.15 * speed;
    
    if (particles.current) {
      particles.current.rotation.y += delta * 0.2 * speed;
      if (activity === "speaking") {
        particles.current.rotation.y += delta * 0.8;
      }
      const pScale = activity === "thinking" ? 0.6 : 1;
      particles.current.scale.lerp(new THREE.Vector3(pScale, pScale, pScale), 0.05);
    }

    if (nanotech.current) {
      nanotech.current.rotation.y -= delta * 0.1 * speed;
      nanotechMaterial.opacity = activity === "speaking" ? 0.4 + Math.sin(t * 15) * 0.3 : 0.2 + Math.sin(t * 2) * 0.1;
    }

    circuitMaterial.opacity = activity === "thinking" ? 0.5 + Math.sin(t * 12) * 0.4 : 0.5;
    
    const targetApertureRotation = activity === "speaking" ? -0.7 : activity === "thinking" ? 0.3 : 0;
    bladeRefs.current.forEach((blade) => {
      if (blade) {
        blade.rotation.z += (targetApertureRotation - blade.rotation.z) * delta * 5;
      }
    });
    
    if (beamsGroup.current) {
      beamsGroup.current.rotation.z -= delta * 0.4 * speed;
      if (activity === "speaking") {
        beamsMaterial.opacity = 0.6 + Math.sin(t * 20) * 0.4;
        beamsGroup.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
      } else {
        beamsMaterial.opacity = 0.1 + Math.sin(t * 3) * 0.05;
        beamsGroup.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }

    if (coreInner.current) {
      const corePulse = activity === "speaking" ? Math.sin(t * 10) * 0.15 : Math.sin(t * 2) * 0.05;
      coreInner.current.scale.setScalar(1 + corePulse);
    }
  });

  return (
    <LivingOrb activity={activity} color="#ff861c" accent="#d8fbff">
      <group ref={root} scale={0.85}>
        
        <lineSegments ref={nanotech} geometry={nanotechGeom} material={nanotechMaterial} />

        <points ref={particles} geometry={particleGeom}>
          <pointsMaterial color="#f1ffff" size={0.04} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.6} toneMapped={false} />
        </points>

        <group rotation={[0, 0, 0]}>
          <lineSegments ref={circuits} geometry={circuitGeom} material={circuitMaterial} position={[0, 0, -0.4]} />

          <group ref={apertureGroup} position={[0, 0, 0.3]}>
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * TAU;
              return (
                <group key={i} rotation={[0, 0, angle]} position={[0, 0, 0]}>
                   <group position={[1.1, 0, 0]} ref={(el) => { bladeRefs.current[i] = el; }}>
                     <mesh position={[-0.5, 0, 0]} rotation={[Math.PI/4, 0, Math.PI/2]}>
                        <cylinderGeometry args={[0.05, 0.22, 1.1, 4]} />
                        <meshBasicMaterial color="#ff7a16" transparent opacity={0.6} wireframe depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
                     </mesh>
                     <mesh position={[-0.5, 0, 0.05]} rotation={[Math.PI/4, 0, Math.PI/2]}>
                        <cylinderGeometry args={[0.02, 0.1, 0.9, 4]} />
                        <meshBasicMaterial color="#ff861c" transparent opacity={0.8} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
                     </mesh>
                   </group>
                </group>
              );
            })}
          </group>

          <group position={[0, 0, 0.5]}>
            <group ref={innerHud}>
              {Array.from({ length: 24 }).map((_, i) => (
                <mesh key={i} position={[Math.cos((i/24)*TAU)*1.8, Math.sin((i/24)*TAU)*1.8, 0]} rotation={[0, 0, (i/24)*TAU]}>
                  <boxGeometry args={[0.08, 0.12, 0.02]} />
                  <meshBasicMaterial color="#d8fbff" transparent opacity={0.7} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
                </mesh>
              ))}
            </group>
            
            <group ref={middleHud}>
              {Array.from({ length: 6 }).map((_, i) => (
                <mesh key={i} rotation={[0, 0, (i/6)*TAU]}>
                  <ringGeometry args={[2.1, 2.4, 16, 1, 0, TAU / 8]} />
                  <meshBasicMaterial color="#bdf5ff" transparent opacity={0.4} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
                </mesh>
              ))}
            </group>
            
            <lineSegments ref={outerHud} geometry={tickGeom}>
              <lineBasicMaterial color="#d8fbff" transparent opacity={0.6} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
            </lineSegments>
          </group>

          <group ref={beamsGroup} position={[0, 0, -0.1]}>
            {Array.from({ length: 6 }).map((_, i) => (
              <mesh key={i} rotation={[0, 0, (i/6)*TAU - Math.PI/2]} position={[Math.cos((i/6)*TAU)*2, Math.sin((i/6)*TAU)*2, 0]} material={beamsMaterial}>
                <cylinderGeometry args={[0.01, 0.04, 4, 8]} />
              </mesh>
            ))}
          </group>

          <group position={[0, 0, 0.1]}>
            <mesh rotation={[Math.PI/2, 0, 0]}>
              <cylinderGeometry args={[0.7, 0.7, 0.1, 32]} />
              <meshBasicMaterial color="#ff7a16" transparent opacity={0.3} wireframe depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
            </mesh>
            
            <mesh>
              <torusGeometry args={[0.5, 0.08, 16, 48]} />
              <meshBasicMaterial color="#ff9a32" transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
            </mesh>
            
            <mesh ref={coreInner} rotation={[Math.PI/2, 0, 0]} position={[0, 0, 0.1]}>
              <cylinderGeometry args={[0.3, 0.3, 0.15, 24]} />
              <meshBasicMaterial color="#f1ffff" toneMapped={false} />
            </mesh>
            
            <mesh position={[0, 0, 0.2]} rotation={[Math.PI/2, 0, Math.PI]}>
              <cylinderGeometry args={[0.2, 0.2, 0.05, 3]} />
              <meshBasicMaterial color="#bdf5ff" transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
            </mesh>
          </group>
        </group>
        
        <pointLight color="#ff861c" distance={8} intensity={3.0} />
      </group>
    </LivingOrb>
  );
}
