import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { AiActivity } from "../../App";
import { activityEnergy, activityPulse, activitySpeed, seededRandom } from "../shared/coreMotion";

const BLUE = "#22b8ff";
const ICE  = "#dcfbff";
const DEEP = "#0757ff";

/* ━━━ GLSL: Internal Crystal Circuit Pattern ━━━ */

const crystalInternalVertex = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const crystalInternalFragment = `
  uniform float uTime;
  uniform float uEnergy;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    // --- Internal laser grid circuit pattern ---
    vec2 grid = fract(vUv * 8.0);
    float lineX = smoothstep(0.0, 0.06, grid.x) * (1.0 - smoothstep(0.94, 1.0, grid.x));
    float lineY = smoothstep(0.0, 0.06, grid.y) * (1.0 - smoothstep(0.94, 1.0, grid.y));
    float gridLines = 1.0 - lineX * lineY;

    // Traveling energy pulse along grid
    float pulse1 = sin(vUv.x * 25.0 - uTime * 4.0) * 0.5 + 0.5;
    float pulse2 = sin(vUv.y * 25.0 + uTime * 3.2) * 0.5 + 0.5;
    float energyFlow = max(pulse1 * gridLines, pulse2 * gridLines);

    // Fresnel rim for edge glow
    float viewAngle = abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)));
    float fresnel = pow(1.0 - viewAngle, 3.0);

    // Electric arc flicker on high activity
    float noise = hash(vUv * 80.0 + floor(uTime * 22.0));
    float arc = step(0.72, noise) * gridLines * uEnergy * 0.5;

    // Edge detection - bright edges of the box
    vec2 edgeDist = abs(vUv - 0.5) * 2.0;
    float edgeFactor = max(edgeDist.x, edgeDist.y);
    float edgeBright = smoothstep(0.88, 0.99, edgeFactor);

    vec3 colIce = vec3(0.863, 0.984, 1.0);   // #dcfbff
    vec3 colBlue = vec3(0.133, 0.722, 1.0);   // #22b8ff
    vec3 colDeep = vec3(0.027, 0.341, 1.0);   // #0757ff

    // Blend based on grid, pulse, and edge
    vec3 color = colDeep;
    color = mix(color, colBlue, energyFlow * 0.7);
    color = mix(color, colIce, edgeBright + arc);
    color = mix(color, colIce, fresnel * 0.8);

    float alpha = (gridLines * 0.35 + energyFlow * 0.25 + fresnel * 0.55 + edgeBright * 0.8 + arc * 0.6) * uEnergy;
    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(color * (1.2 + uEnergy * 0.6), alpha);
  }
`;

/* ━━━ GLSL: Outer Crystal Facets Refraction ━━━ */

const facetVertex = `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const facetFragment = `
  uniform float uTime;
  uniform float uEnergy;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec2 vUv;

  void main() {
    float viewAngle = abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)));
    float fresnel = pow(1.0 - viewAngle, 2.2);

    // Sharp crystalline edge highlight
    vec2 edgeDist = abs(vUv - 0.5) * 2.0;
    float edgeFactor = max(edgeDist.x, edgeDist.y);
    float edgeLine = smoothstep(0.92, 0.98, edgeFactor);

    // Subtle facet refraction shimmer
    float shimmer = sin(vWorldPos.x * 12.0 + vWorldPos.y * 8.0 + uTime * 1.5) * 0.5 + 0.5;
    shimmer *= fresnel;

    vec3 colIce = vec3(0.863, 0.984, 1.0);
    vec3 colBlue = vec3(0.133, 0.722, 1.0);

    vec3 color = mix(colBlue, colIce, edgeLine + shimmer * 0.4);
    float alpha = (fresnel * 0.35 + edgeLine * 0.65 + shimmer * 0.1) * (0.7 + uEnergy * 0.3);

    gl_FragColor = vec4(color * 1.6, alpha);
  }
`;

/* ━━━ 1. Crystal Tesseract Core ━━━
   Single monolithic crystal cube with internal circuit patterns,
   like the reference image — NOT separated Rubik segments */

function CrystalTesseractCore({ activity }: { activity: AiActivity }) {
  const groupRef = useRef<THREE.Group>(null);
  const internalMatRef = useRef<THREE.ShaderMaterial>(null);
  const facetMatRef = useRef<THREE.ShaderMaterial>(null);
  const innerCubeRef = useRef<THREE.Mesh>(null);

  const mainGeo = useMemo(() => new THREE.BoxGeometry(2.0, 2.0, 2.0), []);
  const innerGeo = useMemo(() => new THREE.BoxGeometry(1.85, 1.85, 1.85, 12, 12, 12), []);

  // Inset beveled sub-frame wireframes (visible internal faceted structure)
  const frameGeos = useMemo(() => {
    const sizes = [1.92, 1.5, 1.1, 0.7];
    return sizes.map(s => {
      const box = new THREE.BoxGeometry(s, s, s);
      const edges = new THREE.EdgesGeometry(box);
      box.dispose();
      return edges;
    });
  }, []);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);
    const energy = activityEnergy(activity);

    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.14 * speed;
      groupRef.current.rotation.x = Math.sin(time * 0.28) * 0.12;
      groupRef.current.rotation.z = Math.cos(time * 0.22) * 0.06;
    }

    if (internalMatRef.current) {
      internalMatRef.current.uniforms.uTime.value = time;
      internalMatRef.current.uniforms.uEnergy.value = energy;
    }

    if (facetMatRef.current) {
      facetMatRef.current.uniforms.uTime.value = time;
      facetMatRef.current.uniforms.uEnergy.value = energy;
    }

    // Inner sub-frames counter-rotate for depth
    if (innerCubeRef.current) {
      innerCubeRef.current.rotation.y -= delta * 0.08 * speed;
      innerCubeRef.current.rotation.x += delta * 0.05 * speed;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer PBR Crystal Glass Shell */}
      <mesh geometry={mainGeo}>
        <meshPhysicalMaterial
          color="#aaddff"
          transmission={0.82}
          roughness={0.05}
          metalness={0.15}
          clearcoat={1.0}
          clearcoatRoughness={0.02}
          ior={1.65}
          transparent
          opacity={0.88}
          reflectivity={0.95}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Crystal facet edge shimmer overlay */}
      <mesh geometry={mainGeo} scale={1.002}>
        <shaderMaterial
          ref={facetMatRef}
          vertexShader={facetVertex}
          fragmentShader={facetFragment}
          uniforms={{
            uTime: { value: 0 },
            uEnergy: { value: 1 },
          }}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.FrontSide}
          transparent
        />
      </mesh>

      {/* Internal circuit laser grid (visible through glass) */}
      <mesh geometry={innerGeo} scale={0.96}>
        <shaderMaterial
          ref={internalMatRef}
          vertexShader={crystalInternalVertex}
          fragmentShader={crystalInternalFragment}
          uniforms={{
            uTime: { value: 0 },
            uEnergy: { value: 1 },
          }}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>

      {/* Internal wireframe sub-structures (nested cubes) */}
      <group ref={innerCubeRef}>
        {frameGeos.map((geo, i) => (
          <lineSegments key={i} geometry={geo} rotation={[i * 0.12, i * 0.15, i * 0.08]}>
            <lineBasicMaterial
              color={i < 2 ? ICE : BLUE}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              opacity={0.45 + i * 0.12}
              toneMapped={false}
              transparent
            />
          </lineSegments>
        ))}
      </group>
    </group>
  );
}

/* ━━━ 2. Corner God Rays — 8 light beams from cube corners ━━━ */

function CornerGodRays({ activity }: { activity: AiActivity }) {
  const groupRef = useRef<THREE.Group>(null);

  // 8 corners of a cube
  const corners = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (const x of [-1, 1]) {
      for (const y of [-1, 1]) {
        for (const z of [-1, 1]) {
          positions.push([x * 1.0, y * 1.0, z * 1.0]);
        }
      }
    }
    return positions;
  }, []);

  // Create ray geometries pointing outward from each corner
  const rayGeo = useMemo(() => new THREE.PlaneGeometry(0.04, 3.0), []);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const energy = activityEnergy(activity);
    const speed = activitySpeed(activity);

    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.06 * speed;

      // Pulse the ray brightness via scale
      const pulse = 0.7 + Math.sin(time * 3.5) * 0.3 * energy;
      groupRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef}>
      {corners.map((pos, i) => {
        // Ray direction: from center toward corner
        const dir = new THREE.Vector3(...pos).normalize();
        const lookAt = new THREE.Vector3().addVectors(
          new THREE.Vector3(...pos),
          dir.multiplyScalar(2)
        );

        return (
          <group key={i} position={pos}>
            {/* Two crossed planes for volumetric look */}
            <mesh geometry={rayGeo} lookAt={lookAt}>
              <meshBasicMaterial
                color={ICE}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                opacity={0.35}
                transparent
                toneMapped={false}
              />
            </mesh>
            <mesh geometry={rayGeo} lookAt={lookAt} rotation={[0, 0, Math.PI / 2]}>
              <meshBasicMaterial
                color={BLUE}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                opacity={0.25}
                transparent
                toneMapped={false}
              />
            </mesh>
            {/* Corner glow point */}
            <mesh>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshBasicMaterial color={ICE} toneMapped={false} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/* ━━━ 3. Central Cross Beams — 6-axis light shooting through cube ━━━ */

function CentralBeams({ activity }: { activity: AiActivity }) {
  const raysRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);
    const energy = activityEnergy(activity);

    if (raysRef.current) {
      raysRef.current.rotation.z += delta * 0.35 * speed;
      const beamScale = 1.0 + Math.sin(time * 5.5) * 0.12 * energy;
      raysRef.current.scale.setScalar(beamScale);
    }

    if (lightRef.current) {
      lightRef.current.intensity = 3.0 + energy * 3.0 + Math.sin(time * 6.0) * 1.2;
    }
  });

  return (
    <group>
      {/* Octahedron nucleus */}
      <mesh>
        <octahedronGeometry args={[0.15, 0]} />
        <meshBasicMaterial color={ICE} toneMapped={false} />
      </mesh>

      {/* 6-direction cross beams */}
      <group ref={raysRef}>
        {[
          [0, 0, 0],
          [0, 0, Math.PI / 3],
          [0, 0, (2 * Math.PI) / 3],
        ].map((rot, i) => (
          <mesh key={`z${i}`} rotation={rot as [number, number, number]}>
            <planeGeometry args={[0.06, 2.8]} />
            <meshBasicMaterial
              color={ICE}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              opacity={0.4}
              transparent
              toneMapped={false}
            />
          </mesh>
        ))}
        {[
          [Math.PI / 6, Math.PI / 2, 0],
          [Math.PI / 2, Math.PI / 2, 0],
          [(5 * Math.PI) / 6, Math.PI / 2, 0],
        ].map((rot, i) => (
          <mesh key={`x${i}`} rotation={rot as [number, number, number]}>
            <planeGeometry args={[0.05, 2.4]} />
            <meshBasicMaterial
              color={BLUE}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              opacity={0.3}
              transparent
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      <pointLight ref={lightRef} color={ICE} intensity={5} distance={10} />
    </group>
  );
}

/* ━━━ 4. Floating Data Debris — orbiting crystal fragments ━━━ */

function FloatingDebris({ activity }: { activity: AiActivity }) {
  const debrisCount = 180;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const debrisGeo = useMemo(() => new THREE.BoxGeometry(0.04, 0.04, 0.04), []);

  // Pre-compute orbital parameters
  const orbits = useMemo(() => {
    const rng = seededRandom(3377);
    return Array.from({ length: debrisCount }, () => ({
      radius: 1.5 + rng() * 3.5,
      angle: rng() * Math.PI * 2,
      speed: (0.15 + rng() * 0.6) * (rng() > 0.5 ? 1 : -1),
      height: (rng() - 0.5) * 3.5,
      tilt: (rng() - 0.5) * 0.8,
      size: 0.3 + rng() * 0.8,
    }));
  }, []);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);

    if (!meshRef.current) return;

    for (let i = 0; i < debrisCount; i++) {
      const o = orbits[i];
      const currentAngle = o.angle + time * o.speed * speed;

      dummy.position.set(
        Math.cos(currentAngle) * o.radius,
        o.height + Math.sin(time * 0.8 + i) * 0.15,
        Math.sin(currentAngle) * o.radius
      );
      dummy.rotation.set(
        time * o.speed * 2,
        time * o.speed * 1.5,
        o.tilt
      );
      dummy.scale.setScalar(o.size);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[debrisGeo, undefined, debrisCount]}>
      <meshBasicMaterial
        color={ICE}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        opacity={0.5}
        toneMapped={false}
        transparent
      />
    </instancedMesh>
  );
}

/* ━━━ 5. Orbital Dot Ring ━━━ */

const DOT_COUNT = 36;

function OrbitalDotRing({
  activity,
  baseRadius = 2.4,
  tiltX = 0,
  tiltZ = 0,
  phase = 0,
}: {
  activity: AiActivity;
  baseRadius?: number;
  tiltX?: number;
  tiltZ?: number;
  phase?: number;
}) {
  const dotsRef = useRef<THREE.InstancedMesh>(null);
  const ringRef = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const dotGeo = useMemo(() => new THREE.SphereGeometry(0.032, 8, 8), []);
  const currentRadius = useRef(baseRadius);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);

    // Activity-driven radius modulation
    let targetRadius = baseRadius;
    if (activity === "listening") targetRadius = baseRadius + 0.18;
    else if (activity === "thinking") targetRadius = baseRadius + Math.sin(time * 4.6) * 0.22;
    else if (activity === "speaking") targetRadius = baseRadius + Math.sin(time * 8.4) * 0.3;

    currentRadius.current = THREE.MathUtils.lerp(currentRadius.current, targetRadius, 0.1);
    const r = currentRadius.current;

    if (ringRef.current) {
      ringRef.current.rotation.y += delta * 0.22 * speed;
    }

    if (dotsRef.current) {
      for (let i = 0; i < DOT_COUNT; i++) {
        const angle = (i / DOT_COUNT) * Math.PI * 2;
        dummy.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);

        const basePulse = activityPulse(activity, time, phase + i * 0.4);
        const brightFactor = activity === "speaking" ? 1.35 : activity === "thinking" ? 1.15 : 1.0;
        dummy.scale.setScalar(basePulse * brightFactor);
        dummy.updateMatrix();
        dotsRef.current.setMatrixAt(i, dummy.matrix);
      }
      dotsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group rotation={[tiltX, 0, tiltZ]} ref={ringRef}>
      <instancedMesh ref={dotsRef} args={[dotGeo, undefined, DOT_COUNT]}>
        <meshBasicMaterial
          color="#ffffff"
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </instancedMesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[baseRadius, 0.007, 8, 96]} />
        <meshBasicMaterial
          color={ICE}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.4}
          transparent
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/* ━━━ 6. Background Starfield ━━━ */

function BackgroundStarfield() {
  const count = 500;
  const positions = useMemo(() => {
    const rng = seededRandom(2048);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = rng() * Math.PI * 2;
      const phi = Math.acos(2 * rng() - 1);
      const r = 4 + rng() * 6;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.elapsedTime * 0.006;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        opacity={0.45}
        size={0.02}
        sizeAttenuation
        toneMapped={false}
        transparent
      />
    </points>
  );
}

/* ━━━ 7. Hover Zoom Rig ━━━ */

function HoverZoomRig({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const { gl } = useThree();
  const hovered = useRef(false);
  const currentScale = useRef(1.0);

  useEffect(() => {
    const canvas = gl.domElement;
    const onEnter = () => { hovered.current = true; };
    const onLeave = () => { hovered.current = false; };
    canvas.addEventListener("pointerenter", onEnter);
    canvas.addEventListener("pointerleave", onLeave);
    return () => {
      canvas.removeEventListener("pointerenter", onEnter);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [gl.domElement]);

  useFrame(() => {
    const target = hovered.current ? 1.12 : 1.0;
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, target, 0.06);
    if (groupRef.current) {
      groupRef.current.scale.setScalar(currentScale.current);
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

/* ━━━ MAIN SPACE SCENE ━━━ */

export function SpaceScene({ activity = "idle" }: { activity?: AiActivity }) {
  return (
    <group name="crystal-tesseract-space-scene" scale={1.25}>
      <ambientLight intensity={0.4} color={DEEP} />

      <HoverZoomRig>
        {/* Background stars */}
        <BackgroundStarfield />

        {/* Floating crystal data debris */}
        <FloatingDebris activity={activity} />

        {/* Orbital dot rings — gyroscope effect */}
        <OrbitalDotRing activity={activity} baseRadius={2.4} tiltX={0} tiltZ={0} phase={0} />
        <OrbitalDotRing activity={activity} baseRadius={2.15} tiltX={1.05} tiltZ={0.4} phase={2.0} />

        {/* Corner god rays — 8 beams from cube vertices */}
        <CornerGodRays activity={activity} />

        {/* Central cross beams + nucleus */}
        <CentralBeams activity={activity} />

        {/* THE CRYSTAL CUBE — monolithic with internal circuit pattern */}
        <CrystalTesseractCore activity={activity} />
      </HoverZoomRig>
    </group>
  );
}
