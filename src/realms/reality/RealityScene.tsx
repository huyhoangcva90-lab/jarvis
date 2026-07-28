import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AiActivity } from "../../types/orb";
import { LivingOrb } from "../../core/LivingOrb";

const TAU = Math.PI * 2;

function speedFor(activity: AiActivity) {
  return activity === "speaking" ? 2.1 : activity === "thinking" ? 1.55 : activity === "listening" ? 0.55 : 1;
}

function makeWorldTree() {
  const points: THREE.Vector3[] = [];
  const add = (a: [number, number, number], b: [number, number, number]) => points.push(new THREE.Vector3(...a), new THREE.Vector3(...b));
  
  // Trunk
  add([0, -1.2, 0], [0, 1.2, 0]);
  
  // Roots
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * TAU;
    const x = Math.cos(angle);
    const z = Math.sin(angle);
    add([0, -0.8, 0], [x*0.4, -1.2, z*0.4]);
    add([x*0.4, -1.2, z*0.4], [x*1.0, -1.6, z*1.0]);
    add([x*0.4, -1.2, z*0.4], [x*0.6 + z*0.3, -1.4, z*0.6 - x*0.3]);
  }
  
  // Branches
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * TAU;
    const x = Math.cos(angle);
    const z = Math.sin(angle);
    add([0, 0.4, 0], [x*0.5, 0.9, z*0.5]);
    add([x*0.5, 0.9, z*0.5], [x*1.2, 1.3, z*1.2]);
    add([x*0.5, 0.9, z*0.5], [x*0.9 - z*0.4, 1.4, z*0.9 + x*0.4]);
    
    // Higher branches
    const x2 = Math.cos(angle + 0.5);
    const z2 = Math.sin(angle + 0.5);
    add([0, 0.8, 0], [x2*0.4, 1.3, z2*0.4]);
    add([x2*0.4, 1.3, z2*0.4], [x2*1.0, 1.7, z2*1.0]);
  }
  
  return new THREE.BufferGeometry().setFromPoints(points);
}

function makeEgyptianBand() {
  const points: THREE.Vector3[] = [];
  const numRunes = 16;
  const radius = 2.6;
  const size = 0.18;
  
  for (let i = 0; i < numRunes; i++) {
    const angle = (i / numRunes) * TAU;
    const cx = Math.cos(angle) * radius;
    const cy = Math.sin(angle) * radius;
    
    const right = new THREE.Vector3(Math.cos(angle + Math.PI/2), Math.sin(angle + Math.PI/2), 0);
    const up = new THREE.Vector3(0, 0, 1);
    
    const addLine = (p1: [number, number], p2: [number, number]) => {
      const v1 = new THREE.Vector3(cx, cy, 0).add(right.clone().multiplyScalar(p1[0]*size)).add(up.clone().multiplyScalar(p1[1]*size));
      const v2 = new THREE.Vector3(cx, cy, 0).add(right.clone().multiplyScalar(p2[0]*size)).add(up.clone().multiplyScalar(p2[1]*size));
      points.push(v1, v2);
    };
    
    const type = i % 3;
    if (type === 0) {
      addLine([0, -1], [0, 0.5]);
      addLine([-0.5, 0.2], [0.5, 0.2]);
      addLine([0, 0.5], [-0.3, 0.8]);
      addLine([-0.3, 0.8], [0, 1]);
      addLine([0, 1], [0.3, 0.8]);
      addLine([0.3, 0.8], [0, 0.5]);
    } else if (type === 1) {
      addLine([-0.8, 0], [0, 0.5]);
      addLine([0, 0.5], [0.8, 0]);
      addLine([-0.8, 0], [0, -0.5]);
      addLine([0, -0.5], [0.8, 0]);
      addLine([0, 0], [0, -0.8]);
    } else {
      addLine([-0.8, -0.8], [0.8, -0.8]);
      addLine([-0.8, -0.8], [0, 0.8]);
      addLine([0.8, -0.8], [0, 0.8]);
      addLine([0, -0.8], [0, 0.8]);
    }
  }
  return new THREE.BufferGeometry().setFromPoints(points);
}

function makeGreekMeander() {
  const points: THREE.Vector3[] = [];
  const segments = 48;
  const radius = 3.0;
  const size = 0.22;
  
  for (let i = 0; i < segments; i++) {
    const angle1 = (i / segments) * TAU;
    const angle2 = ((i + 1) / segments) * TAU;
    const aMid = (angle1 + angle2) / 2;
    
    const p = (a: number, rOff: number, zOff: number) => {
      const r = radius + rOff * size;
      return new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, zOff * size);
    };
    
    points.push(p(angle1, 1, 1), p(angle1, -1, 1));
    points.push(p(angle1, -1, 1), p(aMid, -1, 1));
    points.push(p(aMid, -1, 1), p(aMid, 1, -1));
    points.push(p(aMid, 1, -1), p(angle2, 1, -1));
    points.push(p(angle2, 1, -1), p(angle2, 1, 1));
  }
  return new THREE.BufferGeometry().setFromPoints(points);
}

function makeDivineSeal() {
  const points: THREE.Vector3[] = [];
  const radius = 3.6;
  const add = (a: THREE.Vector3, b: THREE.Vector3) => points.push(a, b);
  
  for (let i = 0; i < 96; i++) {
    const a1 = (i / 96) * TAU;
    const a2 = ((i + 1) / 96) * TAU;
    add(new THREE.Vector3(Math.cos(a1)*radius, Math.sin(a1)*radius, 0), new THREE.Vector3(Math.cos(a2)*radius, Math.sin(a2)*radius, 0));
    add(new THREE.Vector3(Math.cos(a1)*(radius-0.15), Math.sin(a1)*(radius-0.15), 0), new THREE.Vector3(Math.cos(a2)*(radius-0.15), Math.sin(a2)*(radius-0.15), 0));
  }
  
  for (let i = 0; i < 3; i++) {
    const a1 = (i / 3) * TAU;
    const a2 = ((i + 1) / 3) * TAU;
    add(new THREE.Vector3(Math.cos(a1)*radius, Math.sin(a1)*radius, 0), new THREE.Vector3(Math.cos(a2)*radius, Math.sin(a2)*radius, 0));
    
    const b1 = (i / 3) * TAU + Math.PI;
    const b2 = ((i + 1) / 3) * TAU + Math.PI;
    add(new THREE.Vector3(Math.cos(b1)*radius, Math.sin(b1)*radius, 0), new THREE.Vector3(Math.cos(b2)*radius, Math.sin(b2)*radius, 0));
  }
  
  for (let i = 0; i < 8; i++) {
    const a1 = (i / 8) * TAU;
    const a2 = ((i + 1) / 8) * TAU;
    add(new THREE.Vector3(Math.cos(a1)*radius*0.6, Math.sin(a1)*radius*0.6, 0), new THREE.Vector3(Math.cos(a2)*radius*0.6, Math.sin(a2)*radius*0.6, 0));
  }
  
  return new THREE.BufferGeometry().setFromPoints(points);
}

export function RealityScene({ activity = "idle" }: { activity?: AiActivity }) {
  const root = useRef<THREE.Group>(null);
  const treeRef = useRef<THREE.LineSegments>(null);
  const runeRingRef = useRef<THREE.Group>(null);
  const hieroRingRef = useRef<THREE.LineSegments>(null);
  const meanderRingRef = useRef<THREE.LineSegments>(null);
  const sealRef = useRef<THREE.LineSegments>(null);
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const entrance = useRef(0);
  
  const runeMats = useRef<THREE.LineBasicMaterial[]>([]);

  const treeGeo = useMemo(makeWorldTree, []);
  const hieroGeo = useMemo(makeEgyptianBand, []);
  const meanderGeo = useMemo(makeGreekMeander, []);
  const sealGeo = useMemo(makeDivineSeal, []);
  const particleGeo = useMemo(() => new THREE.TetrahedronGeometry(0.05, 0), []);
  const nodeGeo = useMemo(() => new THREE.OctahedronGeometry(0.15, 0), []);

  const RUNE_SHAPES = useMemo(() => {
    const shapes: THREE.BufferGeometry[] = [];
    const size = 0.15;
    for (let i = 0; i < 5; i++) {
      const pts: THREE.Vector3[] = [];
      const addLine = (p1: [number, number], p2: [number, number]) => {
        pts.push(new THREE.Vector3(p1[0]*size, p1[1]*size, 0));
        pts.push(new THREE.Vector3(p2[0]*size, p2[1]*size, 0));
      };
      addLine([0, -1], [0, 1]);
      if (i === 0) { 
        addLine([0, 0], [0.8, 0.5]); addLine([0, 0.5], [0.8, 1]);
      } else if (i === 1) { 
        addLine([0, 1], [0.5, 0]); addLine([0.5, 0], [0, -1]);
      } else if (i === 2) { 
        addLine([0, 0.5], [0.8, 0]); addLine([0.8, 0], [0, -0.5]);
      } else if (i === 3) { 
        addLine([0, 0], [0.8, -0.8]); addLine([0, 0.5], [0.8, -0.3]);
      } else { 
        addLine([0, 1], [0.8, 0.5]); addLine([0.8, 0.5], [0, 0]); addLine([0, 0], [0.8, -1]);
      }
      shapes.push(new THREE.BufferGeometry().setFromPoints(pts));
    }
    return shapes;
  }, []);

  const realmNodes = useMemo(() => {
    return Array.from({ length: 9 }, (_, i) => {
      const angle = (i / 9) * TAU;
      const r = 3.2;
      return new THREE.Vector3(Math.cos(angle)*r, Math.sin(angle)*r, (Math.random()-0.5)*1.8);
    });
  }, []);

  const realmLinesGeo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i=0; i<realmNodes.length; i++) {
      pts.push(realmNodes[i], new THREE.Vector3(0,0,0));
      pts.push(realmNodes[i], realmNodes[(i+1)%9]);
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [realmNodes]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particleData = useMemo(() => {
    return Array.from({ length: 120 }, () => ({
      angle: Math.random() * TAU,
      radius: 1.8 + Math.random() * 1.5,
      speed: 0.1 + Math.random() * 0.3,
      yOff: (Math.random() - 0.5) * 2,
      zOff: (Math.random() - 0.5) * 1.5
    }));
  }, []);

  useEffect(() => {
    return () => {
      treeGeo.dispose();
      hieroGeo.dispose();
      meanderGeo.dispose();
      sealGeo.dispose();
      particleGeo.dispose();
      nodeGeo.dispose();
      realmLinesGeo.dispose();
      RUNE_SHAPES.forEach(s => s.dispose());
    };
  }, [treeGeo, hieroGeo, meanderGeo, sealGeo, particleGeo, nodeGeo, realmLinesGeo, RUNE_SHAPES]);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const speed = speedFor(activity);
    
    entrance.current = THREE.MathUtils.lerp(entrance.current, 1, delta * 1.5);
    const e = entrance.current;

    if (root.current) {
      root.current.rotation.y += delta * 0.05 * speed;
      root.current.rotation.x = 0.1 + Math.sin(t * 0.2) * 0.05;
    }

    if (sealRef.current) sealRef.current.scale.setScalar(e);
    
    if (runeRingRef.current) {
      runeRingRef.current.scale.setScalar(Math.max(0, (e - 0.1) * 1.1));
      runeRingRef.current.rotation.z -= delta * 0.12 * speed;
    }
    if (hieroRingRef.current) {
      hieroRingRef.current.scale.setScalar(Math.max(0, (e - 0.2) * 1.25));
      hieroRingRef.current.rotation.z += delta * 0.08 * speed;
    }
    if (meanderRingRef.current) {
      meanderRingRef.current.scale.setScalar(Math.max(0, (e - 0.3) * 1.4));
      meanderRingRef.current.rotation.z -= delta * 0.1 * speed;
    }

    if (treeRef.current) {
      const pulse = Math.sin(t * 2 * speed) * 0.05;
      treeRef.current.scale.setScalar(Math.max(0, e * (1 + (activity === "speaking" ? pulse * 3 : pulse))));
      treeRef.current.rotation.y += delta * 0.2 * speed;
    }

    runeMats.current.forEach((mat, i) => {
      if (!mat) return;
      if (activity === "thinking") {
        const activeIdx = Math.floor(t * 12) % 24;
        const dist = Math.min(Math.abs(activeIdx - i), Math.abs(activeIdx - i + 24), Math.abs(activeIdx - i - 24));
        const glow = Math.max(0, 1 - dist * 0.25);
        mat.opacity = 0.2 + glow * 0.8;
        mat.color.setHex(glow > 0.5 ? 0xfff4d5 : 0xffcb58);
      } else if (activity === "speaking") {
        mat.opacity = 0.8 + Math.sin(t * 15 + i) * 0.2;
        mat.color.setHex(0xffe295);
      } else if (activity === "listening") {
        mat.opacity = 0.5 + Math.sin(t * 3 + i) * 0.2;
        mat.color.setHex(0xffcb58);
      } else {
        mat.opacity = 0.3;
        mat.color.setHex(0xffcb58);
      }
    });

    if (particlesRef.current) {
      particleData.forEach((p, i) => {
        const currentSpeed = (activity === "thinking" ? p.speed * 2.5 : activity === "speaking" ? p.speed * 5 : p.speed) * speed;
        p.angle += delta * currentSpeed;
        
        let radius = p.radius;
        if (activity === "speaking") {
          radius += Math.sin(t * 8 + i) * 0.4;
        }
        
        dummy.position.set(
          Math.cos(p.angle) * radius,
          Math.sin(p.angle) * radius,
          p.zOff + Math.sin(t * 1.5 + i) * 0.3
        );
        dummy.rotation.x = t * p.speed;
        dummy.rotation.y = t * p.speed;
        
        const baseScale = Math.max(0, e);
        if (activity === "thinking") {
          dummy.scale.setScalar(baseScale * (Math.random() > 0.85 ? 1.8 : 1));
        } else if (activity === "speaking") {
          dummy.scale.setScalar(baseScale * 1.5);
        } else {
          dummy.scale.setScalar(baseScale);
        }
        
        dummy.updateMatrix();
        particlesRef.current!.setMatrixAt(i, dummy.matrix);
      });
      particlesRef.current.instanceMatrix.needsUpdate = true;
    }

    if (linesRef.current) {
      const crackle = activity === "speaking" ? Math.random() * 0.5 : (activity === "thinking" ? Math.random() * 0.2 : 0);
      (linesRef.current.material as THREE.LineBasicMaterial).opacity = 0.2 + crackle;
    }
  });

  return (
    <LivingOrb activity={activity} color="#ff314e" accent="#ffd36b">
      <group ref={root} scale={0.75}>
        <lineSegments ref={sealRef} geometry={sealGeo}>
          <lineBasicMaterial color="#ff4356" transparent opacity={0.4} depthWrite={false} toneMapped={false} blending={THREE.AdditiveBlending} />
        </lineSegments>

        <group ref={meanderRingRef} rotation={[Math.PI * 0.1, 0, 0]}>
          <lineSegments geometry={meanderGeo}>
            <lineBasicMaterial color="#ff314e" transparent opacity={0.6} depthWrite={false} toneMapped={false} blending={THREE.AdditiveBlending} />
          </lineSegments>
        </group>

        <group ref={hieroRingRef} rotation={[-Math.PI * 0.15, Math.PI * 0.05, 0]}>
          <lineSegments geometry={hieroGeo}>
            <lineBasicMaterial color="#ffd36b" transparent opacity={0.7} depthWrite={false} toneMapped={false} blending={THREE.AdditiveBlending} />
          </lineSegments>
        </group>

        <group ref={runeRingRef}>
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i / 24) * TAU;
            const cx = Math.cos(angle) * 2.2;
            const cy = Math.sin(angle) * 2.2;
            return (
              <lineSegments key={i} position={[cx, cy, 0]} rotation={[0, 0, angle - Math.PI / 2]} geometry={RUNE_SHAPES[i % 5]}>
                <lineBasicMaterial ref={(el: THREE.LineBasicMaterial | null) => { if (el) runeMats.current[i] = el; }} color="#ffcb58" transparent opacity={0.3} depthWrite={false} toneMapped={false} blending={THREE.AdditiveBlending} />
              </lineSegments>
            );
          })}
        </group>

        <lineSegments ref={treeRef} geometry={treeGeo}>
          <lineBasicMaterial color="#ffe295" transparent opacity={0.8} depthWrite={false} toneMapped={false} blending={THREE.AdditiveBlending} />
        </lineSegments>

        <lineSegments ref={linesRef} geometry={realmLinesGeo}>
          <lineBasicMaterial color="#ff4356" transparent opacity={0.2} depthWrite={false} toneMapped={false} blending={THREE.AdditiveBlending} />
        </lineSegments>

        <group>
          {realmNodes.map((pos, i) => (
            <mesh key={i} position={pos}>
              <octahedronGeometry args={[0.15, 0]} />
              <meshBasicMaterial color="#ffd36b" transparent opacity={0.8} depthWrite={false} toneMapped={false} blending={THREE.AdditiveBlending} wireframe />
            </mesh>
          ))}
        </group>

        <instancedMesh ref={particlesRef} args={[particleGeo, undefined, 120]}>
          <meshBasicMaterial color="#ff314e" transparent opacity={0.6} depthWrite={false} toneMapped={false} blending={THREE.AdditiveBlending} />
        </instancedMesh>

        <pointLight color="#ff314e" distance={8} intensity={2.5} />
      </group>
    </LivingOrb>
  );
}
