import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AiActivity } from "../../types/orb";
import { LivingOrb } from "../../core/LivingOrb";

const TAU = Math.PI * 2;

function rate(activity: AiActivity) {
  return activity === "speaking" ? 2.1 : activity === "thinking" ? 1.55 : activity === "listening" ? 0.55 : 1;
}

function makeMandalaLayer(radius: number, points: number, skip: number) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < points; i++) {
    const a1 = (i / points) * TAU;
    const a2 = (((i + skip) % points) / points) * TAU;
    pts.push(new THREE.Vector3(Math.cos(a1) * radius, Math.sin(a1) * radius, 0));
    pts.push(new THREE.Vector3(Math.cos(a2) * radius, Math.sin(a2) * radius, 0));
  }
  return pts;
}

function makeRunesGeometry(count: number, radius: number) {
  const pts: THREE.Vector3[] = [];
  const angles: number[] = [];
  
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * TAU;
    const cx = Math.cos(angle) * radius;
    const cy = Math.sin(angle) * radius;
    
    const strokes = 3 + Math.floor(Math.random() * 4);
    for (let j = 0; j < strokes; j++) {
      const r1 = Math.random() * 0.15;
      const t1 = Math.random() * TAU;
      const r2 = Math.random() * 0.15;
      const t2 = Math.random() * TAU;
      pts.push(new THREE.Vector3(cx + Math.cos(t1)*r1, cy + Math.sin(t1)*r1, 0));
      pts.push(new THREE.Vector3(cx + Math.cos(t2)*r2, cy + Math.sin(t2)*r2, 0));
      angles.push(angle, angle);
    }
  }
  const geom = new THREE.BufferGeometry().setFromPoints(pts);
  geom.setAttribute('angle', new THREE.BufferAttribute(new Float32Array(angles), 1));
  geom.setAttribute('color', new THREE.BufferAttribute(new Float32Array(pts.length * 3), 3));
  return geom;
}

function makeEyeGeometry() {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < 32; i++) {
    const t1 = (i / 32) * Math.PI;
    const t2 = ((i + 1) / 32) * Math.PI;
    pts.push(new THREE.Vector3(Math.cos(t1)*1.2, Math.sin(t1)*0.6, 0));
    pts.push(new THREE.Vector3(Math.cos(t2)*1.2, Math.sin(t2)*0.6, 0));
    pts.push(new THREE.Vector3(Math.cos(t1)*1.2, -Math.sin(t1)*0.6, 0));
    pts.push(new THREE.Vector3(Math.cos(t2)*1.2, -Math.sin(t2)*0.6, 0));
  }
  for (let i = 0; i < 32; i++) {
    const t1 = (i / 32) * TAU;
    const t2 = ((i + 1) / 32) * TAU;
    pts.push(new THREE.Vector3(Math.cos(t1)*0.5, Math.sin(t1)*0.5, 0));
    pts.push(new THREE.Vector3(Math.cos(t2)*0.5, Math.sin(t2)*0.5, 0));
  }
  for (let i = 0; i < 16; i++) {
    const t1 = (i / 16) * TAU;
    const t2 = ((i + 1) / 16) * TAU;
    pts.push(new THREE.Vector3(Math.cos(t1)*0.2, Math.sin(t1)*0.2, 0));
    pts.push(new THREE.Vector3(Math.cos(t2)*0.2, Math.sin(t2)*0.2, 0));
  }
  return new THREE.BufferGeometry().setFromPoints(pts);
}

function makeGearGeometry(radius: number, teeth: number) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < teeth; i++) {
    const a1 = (i / teeth) * TAU;
    const a2 = ((i + 0.3) / teeth) * TAU;
    const a3 = ((i + 0.5) / teeth) * TAU;
    const a4 = ((i + 0.8) / teeth) * TAU;
    const a5 = ((i + 1) / teeth) * TAU;
    const rInner = radius * 0.85;
    const rOuter = radius;
    
    pts.push(new THREE.Vector3(Math.cos(a1)*rInner, Math.sin(a1)*rInner, 0));
    pts.push(new THREE.Vector3(Math.cos(a2)*rInner, Math.sin(a2)*rInner, 0));
    pts.push(new THREE.Vector3(Math.cos(a2)*rInner, Math.sin(a2)*rInner, 0));
    pts.push(new THREE.Vector3(Math.cos(a3)*rOuter, Math.sin(a3)*rOuter, 0));
    pts.push(new THREE.Vector3(Math.cos(a3)*rOuter, Math.sin(a3)*rOuter, 0));
    pts.push(new THREE.Vector3(Math.cos(a4)*rOuter, Math.sin(a4)*rOuter, 0));
    pts.push(new THREE.Vector3(Math.cos(a4)*rOuter, Math.sin(a4)*rOuter, 0));
    pts.push(new THREE.Vector3(Math.cos(a5)*rInner, Math.sin(a5)*rInner, 0));
    
    if (i % 3 === 0) {
      pts.push(new THREE.Vector3(Math.cos(a1)*rInner, Math.sin(a1)*rInner, 0));
      pts.push(new THREE.Vector3(0, 0, 0));
    }
  }
  return new THREE.BufferGeometry().setFromPoints(pts);
}

export function MysticTimeCore({ activity }: { activity: AiActivity }) {
  const root = useRef<THREE.Group>(null);
  const mandalaLayer1 = useRef<THREE.LineSegments>(null);
  const mandalaLayer2 = useRef<THREE.LineSegments>(null);
  const mandalaLayer3 = useRef<THREE.LineSegments>(null);
  const runesRing = useRef<THREE.LineSegments>(null);
  const eyeGroup = useRef<THREE.Group>(null);
  const gear1 = useRef<THREE.LineSegments>(null);
  const gear2 = useRef<THREE.LineSegments>(null);
  const portalRings = useRef<THREE.Group>(null);
  const particleGroup = useRef<THREE.Points>(null);
  const entrance = useRef({ time: 0 });

  const geoMandala1 = useMemo(() => new THREE.BufferGeometry().setFromPoints([...makeMandalaLayer(1.5, 8, 3), ...makeMandalaLayer(1.8, 16, 5)]), []);
  const geoMandala2 = useMemo(() => new THREE.BufferGeometry().setFromPoints(makeMandalaLayer(2.2, 12, 5)), []);
  const geoMandala3 = useMemo(() => new THREE.BufferGeometry().setFromPoints(makeMandalaLayer(2.6, 24, 7)), []);
  const geoRunes = useMemo(() => makeRunesGeometry(32, 2.8), []);
  const geoEye = useMemo(() => makeEyeGeometry(), []);
  const geoGear1 = useMemo(() => makeGearGeometry(1.2, 12), []);
  const geoGear2 = useMemo(() => makeGearGeometry(0.8, 8), []);

  const geoParticles = useMemo(() => {
    const pos = new Float32Array(200 * 3);
    const angles = new Float32Array(200);
    const radii = new Float32Array(200);
    for (let i = 0; i < 200; i++) {
      const angle = Math.random() * TAU;
      const rChoice = Math.random();
      const rBase = rChoice < 0.33 ? 1.5 : rChoice < 0.66 ? 2.2 : 2.6;
      const radius = rBase + (Math.random() - 0.5) * 0.05;
      angles[i] = angle;
      radii[i] = radius;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geom.setAttribute("angle", new THREE.BufferAttribute(angles, 1));
    geom.setAttribute("radius", new THREE.BufferAttribute(radii, 1));
    return geom;
  }, []);

  useEffect(() => {
    return () => {
      geoMandala1.dispose();
      geoMandala2.dispose();
      geoMandala3.dispose();
      geoRunes.dispose();
      geoEye.dispose();
      geoGear1.dispose();
      geoGear2.dispose();
      geoParticles.dispose();
    };
  }, [geoMandala1, geoMandala2, geoMandala3, geoRunes, geoEye, geoGear1, geoGear2, geoParticles]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const speed = rate(activity);
    
    entrance.current.time = Math.min(1, entrance.current.time + delta * 0.8);
    const scale = entrance.current.time === 1 ? 1 : 1 - Math.pow(2, -10 * entrance.current.time);
    
    if (root.current) {
      root.current.scale.setScalar(scale * 0.85);
      root.current.rotation.x = Math.sin(t * 0.5) * 0.1;
      root.current.rotation.y = Math.cos(t * 0.4) * 0.1;
    }

    if (mandalaLayer1.current) {
      mandalaLayer1.current.rotation.z += delta * 0.1 * speed;
      mandalaLayer1.current.scale.setScalar(1 + (activity === "thinking" ? Math.sin(t * 3) * 0.05 : 0));
    }
    if (mandalaLayer2.current) {
      mandalaLayer2.current.rotation.z -= delta * 0.15 * speed;
      mandalaLayer2.current.scale.setScalar(1 + (activity === "thinking" ? Math.cos(t * 2.5) * 0.05 : 0));
    }
    if (mandalaLayer3.current) {
      mandalaLayer3.current.rotation.z += delta * 0.05 * speed;
      mandalaLayer3.current.scale.setScalar(1 + (activity === "thinking" ? Math.sin(t * 2) * 0.05 : 0));
    }

    if (runesRing.current) {
      runesRing.current.rotation.z -= delta * 0.08 * speed;
      const geom = runesRing.current.geometry;
      const anglesAttr = geom.attributes.angle.array;
      const colorsAttr = geom.attributes.color.array;
      const baseOpacity = (activity === "thinking" || activity === "speaking") ? 0.6 + Math.sin(t * 10) * 0.4 : 0.8;
      const progress = entrance.current.time * TAU * 1.5;
      const baseColor = new THREE.Color("#c9ffda");
      for (let i = 0; i < anglesAttr.length; i++) {
         const a = anglesAttr[i];
         const intensity = a < progress ? baseOpacity : 0.0;
         colorsAttr[i * 3] = baseColor.r * intensity;
         colorsAttr[i * 3 + 1] = baseColor.g * intensity;
         colorsAttr[i * 3 + 2] = baseColor.b * intensity;
      }
      geom.attributes.color.needsUpdate = true;
    }

    if (eyeGroup.current) {
      let targetEyeY = 1.0;
      let targetEyeX = 1.0;
      let targetEyeR = 0;
      if (activity === "listening") { targetEyeY = 0.5; }
      else if (activity === "thinking") { targetEyeY = 0.2; targetEyeX = 0.8; targetEyeR = Math.sin(t * 3) * 0.4; }
      else if (activity === "speaking") { targetEyeY = 1.5; targetEyeX = 1.2; }
      eyeGroup.current.scale.y = THREE.MathUtils.lerp(eyeGroup.current.scale.y, targetEyeY, 0.1);
      eyeGroup.current.scale.x = THREE.MathUtils.lerp(eyeGroup.current.scale.x, targetEyeX, 0.1);
      eyeGroup.current.rotation.z = THREE.MathUtils.lerp(eyeGroup.current.rotation.z, targetEyeR, 0.1);
    }

    if (gear1.current && gear2.current) {
      if (activity === "thinking") {
        const tick = Math.floor(t * 4) / 4;
        gear1.current.rotation.z = -tick * 0.5;
        gear2.current.rotation.z = tick * 0.8;
      } else {
        gear1.current.rotation.z -= delta * 0.3 * speed;
        gear2.current.rotation.z += delta * 0.5 * speed;
      }
    }

    if (portalRings.current) {
      portalRings.current.rotation.x += delta * 0.2 * speed;
      portalRings.current.rotation.y += delta * 0.3 * speed;
      const glowOp = activity === "speaking" ? 0.8 : 0.3;
      portalRings.current.children.forEach(child => {
        if ((child as THREE.Mesh).material) {
          ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = THREE.MathUtils.lerp(
            ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity, glowOp, 0.1
          );
        }
      });
    }

    if (particleGroup.current) {
      const positions = particleGroup.current.geometry.attributes.position.array as Float32Array;
      const angles = particleGroup.current.geometry.attributes.angle.array as Float32Array;
      const radii = particleGroup.current.geometry.attributes.radius.array as Float32Array;
      const particleSpeed = (activity === "speaking" ? 3.0 : 0.8) * delta;
      
      for (let i = 0; i < 200; i++) {
        angles[i] += particleSpeed * (i % 2 === 0 ? 1 : -1) * (1.5 / radii[i]);
        const a = angles[i];
        const r = radii[i];
        positions[i * 3] = Math.cos(a) * r;
        positions[i * 3 + 1] = Math.sin(a) * r;
        positions[i * 3 + 2] = Math.sin(a * 4 + t) * 0.15;
      }
      particleGroup.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <LivingOrb activity={activity} color="#48ff91" accent="#eafff1">
      <group ref={root}>
        <lineSegments ref={mandalaLayer1} geometry={geoMandala1} position={[0,0,-0.1]}>
          <lineBasicMaterial blending={THREE.AdditiveBlending} color="#48ff91" depthWrite={false} opacity={0.6} toneMapped={false} transparent />
        </lineSegments>
        <lineSegments ref={mandalaLayer2} geometry={geoMandala2} position={[0,0,-0.15]}>
          <lineBasicMaterial blending={THREE.AdditiveBlending} color="#25b96a" depthWrite={false} opacity={0.5} toneMapped={false} transparent />
        </lineSegments>
        <lineSegments ref={mandalaLayer3} geometry={geoMandala3} position={[0,0,-0.2]}>
          <lineBasicMaterial blending={THREE.AdditiveBlending} color="#82ffaf" depthWrite={false} opacity={0.4} toneMapped={false} transparent />
        </lineSegments>
        <lineSegments ref={runesRing} geometry={geoRunes} position={[0,0,-0.05]}>
          <lineBasicMaterial blending={THREE.AdditiveBlending} vertexColors depthWrite={false} toneMapped={false} transparent />
        </lineSegments>
        
        <group ref={eyeGroup} position={[0,0,0.1]}>
          <lineSegments geometry={geoEye}>
             <lineBasicMaterial blending={THREE.AdditiveBlending} color="#eafff1" depthWrite={false} opacity={0.9} toneMapped={false} transparent />
          </lineSegments>
          <mesh>
             <circleGeometry args={[0.05, 16]} />
             <meshBasicMaterial blending={THREE.AdditiveBlending} color="#82ffaf" depthWrite={false} toneMapped={false} transparent />
          </mesh>
        </group>

        <lineSegments ref={gear1} geometry={geoGear1} position={[0,0,0.05]}>
          <lineBasicMaterial blending={THREE.AdditiveBlending} color="#48ff91" depthWrite={false} opacity={0.6} toneMapped={false} transparent />
        </lineSegments>
        <lineSegments ref={gear2} geometry={geoGear2} position={[0,0,0.02]}>
          <lineBasicMaterial blending={THREE.AdditiveBlending} color="#25b96a" depthWrite={false} opacity={0.8} toneMapped={false} transparent />
        </lineSegments>

        <group ref={portalRings} scale={1.8}>
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <torusGeometry args={[1.5, 0.015, 4, 64]} />
            <meshBasicMaterial blending={THREE.AdditiveBlending} color="#48ff91" depthWrite={false} transparent toneMapped={false} opacity={0.4}/>
            <mesh position={[1.5, 0, 0]}><tetrahedronGeometry args={[0.05]} /><meshBasicMaterial color="#eafff1" /></mesh>
            <mesh position={[-1.5, 0, 0]}><tetrahedronGeometry args={[0.05]} /><meshBasicMaterial color="#eafff1" /></mesh>
          </mesh>
          <mesh rotation={[0, Math.PI / 4, 0]}>
            <torusGeometry args={[1.6, 0.01, 4, 64]} />
            <meshBasicMaterial blending={THREE.AdditiveBlending} color="#eafff1" depthWrite={false} transparent toneMapped={false} opacity={0.3}/>
            <mesh position={[0, 1.6, 0]}><tetrahedronGeometry args={[0.05]} /><meshBasicMaterial color="#25b96a" /></mesh>
          </mesh>
          <mesh rotation={[Math.PI / 3, Math.PI / 3, 0]}>
            <torusGeometry args={[1.7, 0.02, 4, 64]} />
            <meshBasicMaterial blending={THREE.AdditiveBlending} color="#25b96a" depthWrite={false} transparent toneMapped={false} opacity={0.5}/>
            <mesh position={[1.7 * 0.707, 1.7 * 0.707, 0]}><tetrahedronGeometry args={[0.05]} /><meshBasicMaterial color="#48ff91" /></mesh>
          </mesh>
        </group>

        <points ref={particleGroup} geometry={geoParticles}>
          <pointsMaterial size={0.04} color="#82ffaf" blending={THREE.AdditiveBlending} depthWrite={false} transparent opacity={0.8} toneMapped={false} />
        </points>
      </group>
    </LivingOrb>
  );
}
