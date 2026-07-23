import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { LivingOrb } from "../../core/LivingOrb";
import { RealmAtmosphere } from "../../core/RealmAtmosphere";
import type { AiActivity } from "../../types/orb";

// --- Color Palette ---
const COLORS = {
  primary: "#ac4dff",
  accent: "#69e6ff",
  hot: "#e2a5ff",
  deep: "#7138d8",
  lightning: "#5ee7ff",
  core: "#f6e5ff",
};

const RING_DATA = [
  { radius: 1.5, segments: 16, size: [0.3, 0.05, 0.15], tilt: [0.2, 0, 0] },
  { radius: 1.8, segments: 12, size: [0.4, 0.08, 0.2], tilt: [0, 0.5, 0] },
  { radius: 2.1, segments: 20, size: [0.2, 0.04, 0.1], tilt: [-0.3, 0, 0.4] },
] as const;

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function speedFor(activity: AiActivity) {
  return activity === "speaking" ? 2.5 : activity === "thinking" ? 1.6 : activity === "listening" ? 0.5 : 1.0;
}

// 1. Bio-Mechanical Containment Rings
function ContainmentRings({ activity }: { activity: AiActivity }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const speed = speedFor(activity);

    const targetScale = activity === "listening" ? 0.9 : activity === "speaking" ? 1.2 : 1.0;
    const scale = THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 4, delta);
    groupRef.current.scale.setScalar(scale);

    groupRef.current.children.forEach((ring, i) => {
      ring.rotation.y += delta * speed * (i % 2 === 0 ? 0.5 : -0.3) * (i + 1);
      ring.rotation.x += delta * speed * 0.1 * (i === 1 ? -1 : 1);
    });
  });

  return (
    <group ref={groupRef}>
      {RING_DATA.map((data, i) => (
        <group key={i} rotation={data.tilt}>
          {Array.from({ length: data.segments }).map((_, j) => {
            const angle = (j / data.segments) * Math.PI * 2;
            const x = Math.cos(angle) * data.radius;
            const z = Math.sin(angle) * data.radius;
            return (
              <mesh key={j} position={[x, 0, z]} rotation={[0, -angle, 0]}>
                <boxGeometry args={data.size as [number, number, number]} />
                <meshBasicMaterial
                  color={COLORS.deep}
                  wireframe
                  transparent
                  opacity={0.8}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}

// 2. Plasma Core
function PlasmaCore({ activity }: { activity: AiActivity }) {
  const coreRef = useRef<THREE.Group>(null);
  const midRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!coreRef.current || !midRef.current) return;
    const speed = speedFor(activity);
    const time = state.clock.getElapsedTime();

    coreRef.current.rotation.y += delta * speed * 0.5;
    coreRef.current.rotation.z += delta * speed * 0.3;

    // Pulse mid sphere
    const pulse = 1 + Math.sin(time * speed * 4) * (activity === "speaking" ? 0.2 : 0.05);
    midRef.current.scale.setScalar(pulse);
  });

  return (
    <group ref={coreRef}>
      {/* Inner white-hot nucleus */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial
          color={COLORS.core}
          toneMapped={false}
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Mid plasma sphere */}
      <mesh ref={midRef}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial
          color={COLORS.primary}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      {/* Outer containment field */}
      <mesh>
        <dodecahedronGeometry args={[0.8]} />
        <meshBasicMaterial
          color={COLORS.accent}
          wireframe
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// 3. Lightning Arcs
function LightningArcs({ activity }: { activity: AiActivity }) {
  const linesRef = useRef<THREE.LineSegments>(null);
  const updateAccumulator = useRef(0);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = 30; // Max 30 lines
    const positions = new Float32Array(count * 6);
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(({ clock }, delta) => {
    if (!linesRef.current) return;
    updateAccumulator.current += delta;
    if (updateAccumulator.current < 1 / 30) return;
    updateAccumulator.current %= 1 / 30;

    const positions = linesRef.current.geometry.attributes.position.array as Float32Array;

    const count = positions.length / 6;
    let visibleArcs = 0;
    if (activity === "speaking") visibleArcs = count;
    else if (activity === "thinking") visibleArcs = Math.floor(count * 0.6);
    else if (activity === "listening") visibleArcs = 0;
    else visibleArcs = Math.floor(count * 0.2); // idle

    for (let i = 0; i < count; i++) {
      if (i < visibleArcs && Math.random() > 0.5) {
        const innerRadius = 0.8;
        const outerRadius = 2.1;

        const angle1 = Math.random() * Math.PI * 2;
        const theta1 = Math.random() * Math.PI;
        const sinTheta1 = Math.sin(theta1);

        const angle2 = Math.random() * Math.PI * 2;
        const theta2 = (Math.random() - 0.5) * 0.5 + Math.PI/2;

        positions[i*6] = sinTheta1 * Math.cos(angle1) * innerRadius;
        positions[i*6+1] = Math.cos(theta1) * innerRadius;
        positions[i*6+2] = sinTheta1 * Math.sin(angle1) * innerRadius;
        positions[i*6+3] = Math.cos(angle2) * outerRadius;
        positions[i*6+4] = Math.sin(theta2) * outerRadius * 0.5;
        positions[i*6+5] = Math.sin(angle2) * outerRadius;
      } else {
        positions[i*6] = 0; positions[i*6+1] = 0; positions[i*6+2] = 0;
        positions[i*6+3] = 0; positions[i*6+4] = 0; positions[i*6+5] = 0;
      }
    }
    linesRef.current.geometry.attributes.position.needsUpdate = true;

    // Flicker opacity
    const mat = linesRef.current.material as THREE.LineBasicMaterial;
    const baseline = activity === "speaking" ? 0.88 : activity === "thinking" ? 0.62 : 0.42;
    mat.opacity = baseline + Math.sin(clock.elapsedTime * 37) * 0.12;
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial
        color={COLORS.lightning}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </lineSegments>
  );
}

// 4. Alien Glyph Matrix
function GlyphMatrix({ activity }: { activity: AiActivity }) {
  const groupRef = useRef<THREE.Group>(null);

  const glyphs = useMemo(() => {
    const random = seededRandom(0xa11e);
    const arr: Array<{
      pos: [number, number, number];
      rot: [number, number, number];
    }> = [];
    for (let i = 0; i < 40; i++) {
      const theta = Math.acos(2 * random() - 1);
      const phi = random() * Math.PI * 2;
      const r = 2.5;
      const x = r * Math.sin(theta) * Math.cos(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(theta);
      arr.push({ pos: [x, y, z], rot: [random() * Math.PI, random() * Math.PI, 0] });
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const speed = speedFor(activity);
    groupRef.current.rotation.y += delta * speed * 0.2;
    groupRef.current.rotation.x -= delta * speed * 0.1;
  });

  return (
    <group ref={groupRef}>
      {glyphs.map((g, i) => (
        <group key={i} position={g.pos} rotation={g.rot}>
          <mesh>
            <ringGeometry args={[0.05, 0.08, 3]} />
            <meshBasicMaterial
              color={COLORS.hot}
              transparent
              opacity={0.6}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh rotation={[0,0,Math.PI/2]}>
            <planeGeometry args={[0.2, 0.02]} />
            <meshBasicMaterial
              color={COLORS.accent}
              transparent
              opacity={0.6}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 5. Energy Conduit Spines
function ConduitSpines({ activity }: { activity: AiActivity }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const count = 8;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      dummy.position.set(Math.cos(angle) * 1.5, 0, Math.sin(angle) * 1.5);
      // Point outward
      dummy.rotation.set(0, -angle + Math.PI/2, Math.PI/2);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy, count]);

  useFrame(({ clock }, delta) => {
    if (!meshRef.current) return;
    const speed = speedFor(activity);
    meshRef.current.rotation.y += delta * speed * 0.18;
    const pulse = activity === "speaking"
      ? 1 + Math.sin(clock.elapsedTime * 8) * 0.14
      : activity === "thinking"
        ? 1 + Math.sin(clock.elapsedTime * 3.2) * 0.06
        : 1;
    meshRef.current.scale.setScalar(pulse);
    if (materialRef.current) {
      materialRef.current.opacity = activity === "speaking" ? 0.82 : activity === "thinking" ? 0.64 : 0.48;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <cylinderGeometry args={[0.05, 0.1, 1.5, 4]} />
      <meshBasicMaterial
        ref={materialRef}
        color={COLORS.primary}
        wireframe
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

// 6. Containment Field Grid
function ContainmentField() {
  return (
    <mesh>
      <icosahedronGeometry args={[3.0, 2]} />
      <meshBasicMaterial
        color={COLORS.deep}
        wireframe
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// 7. Hovering Debris/Fragments
function HoveringDebris({ activity }: { activity: AiActivity }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 50;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const random = seededRandom(0xd3b215);
    return Array.from({ length: count }).map(() => ({
      pos: new THREE.Vector3((random() - 0.5) * 6, (random() - 0.5) * 6, (random() - 0.5) * 6),
      speed: random() * 0.5 + 0.1,
      phase: random() * Math.PI * 2,
      axis: new THREE.Vector3(random(), random(), random()).normalize(),
    }));
  }, [count]);

  useFrame(({ clock }, delta) => {
    if (!meshRef.current) return;
    const speed = speedFor(activity);

    particles.forEach((p, i) => {
      // Orbit around center
      p.pos.applyAxisAngle(p.axis, delta * speed * p.speed);
      dummy.position.copy(p.pos);
      dummy.rotation.set(
        p.phase + clock.elapsedTime * speed * p.speed,
        p.phase * 0.7 + clock.elapsedTime * speed * p.speed * 0.8,
        p.phase * 0.35,
      );
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <tetrahedronGeometry args={[0.08]} />
      <meshBasicMaterial
        color={COLORS.accent}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

export function AlienScene({ activity = "idle" }: { activity?: AiActivity }) {
  return (
    <LivingOrb activity={activity} color={COLORS.primary} accent={COLORS.accent}>
      <RealmAtmosphere
        activity={activity}
        primary={COLORS.primary}
        secondary={COLORS.lightning}
        hot={COLORS.core}
        variant="alien"
      />
      <ContainmentRings activity={activity} />
      <PlasmaCore activity={activity} />
      <LightningArcs activity={activity} />
      <GlyphMatrix activity={activity} />
      <ConduitSpines activity={activity} />
      <ContainmentField />
      <HoveringDebris activity={activity} />
    </LivingOrb>
  );
}

export default AlienScene;
