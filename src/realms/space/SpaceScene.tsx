import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import type { AiActivity } from "../../App";
import { OrbEnergyField } from "../shared/OrbEnergyField";

/* ── Color Palette ─────────────────────────────────────── */
const CYAN       = new THREE.Color("#35d8ff");
const ICE        = new THREE.Color("#d9ffff");
const COBALT     = new THREE.Color("#087eaa");
const DEEP_BLUE  = new THREE.Color("#024a6e");
const WHITE      = new THREE.Color("#f8ffff");

function seeded(i: number, salt: number) {
  return Math.abs(Math.sin(i * 127.13 + salt * 311.7) * 43758.5453) % 1;
}

function activitySpeed(a: AiActivity) {
  if (a === "speaking") return 1.9;
  if (a === "thinking") return 1.45;
  if (a === "listening") return 0.62;
  return 1;
}

function activityEnergy(a: AiActivity) {
  if (a === "speaking") return 1.5;
  if (a === "thinking") return 1.28;
  if (a === "listening") return 0.75;
  return 1;
}

/* ── 1. Tesseract 4D Hypercube Core ────────────────────── */
function TesseractCore({ activity }: { activity: AiActivity }) {
  const root = useRef<THREE.Group>(null);
  const outerRef = useRef<THREE.LineSegments>(null);
  const innerRef = useRef<THREE.LineSegments>(null);
  const midRef = useRef<THREE.LineSegments>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  const outerGeo = useMemo(() => {
    const s = new THREE.BoxGeometry(2.56, 2.56, 2.56);
    const g = new THREE.EdgesGeometry(s); s.dispose(); return g;
  }, []);
  const innerGeo = useMemo(() => {
    const s = new THREE.BoxGeometry(1.44, 1.44, 1.44);
    const g = new THREE.EdgesGeometry(s); s.dispose(); return g;
  }, []);
  const midGeo = useMemo(() => {
    const s = new THREE.BoxGeometry(1.92, 1.92, 1.92);
    const g = new THREE.EdgesGeometry(s); s.dispose(); return g;
  }, []);

  // Bridge connectors between inner and outer cubes
  const bridgeGeo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) {
      pts.push(new THREE.Vector3(x * 0.72, y * 0.72, z * 0.72));
      pts.push(new THREE.Vector3(x * 1.28, y * 1.28, z * 1.28));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  // Core glow shader
  const coreShader = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uEnergy: { value: 1.0 },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uEnergy;
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        float pulse = 0.7 + 0.3 * sin(uTime * 3.0 + length(vPosition) * 8.0);
        float swirl = sin(vPosition.x * 12.0 + uTime * 2.5) * sin(vPosition.y * 10.0 - uTime * 1.8) * 0.5 + 0.5;
        vec3 color = mix(vec3(0.21, 0.85, 1.0), vec3(0.85, 1.0, 1.0), swirl * pulse);
        float alpha = (0.25 + swirl * 0.35) * uEnergy;
        gl_FragColor = vec4(color, alpha);
      }
    `,
  }), []);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const speed = activitySpeed(activity);
    const energy = activityEnergy(activity);

    if (root.current) {
      root.current.rotation.x += delta * 0.11 * speed;
      root.current.rotation.y += delta * 0.18 * speed;
    }
    if (outerRef.current) {
      outerRef.current.rotation.z += delta * 0.07 * speed;
      outerRef.current.rotation.x += delta * 0.04 * speed;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x -= delta * 0.2 * speed;
      innerRef.current.rotation.y -= delta * 0.14 * speed;
      const pulse = 0.88 + Math.sin(t * 1.8 * speed) * 0.12;
      innerRef.current.scale.setScalar(pulse);
    }
    if (midRef.current) {
      midRef.current.rotation.y += delta * 0.12 * speed;
      midRef.current.rotation.z -= delta * 0.08 * speed;
      const midPulse = activity === "thinking"
        ? 0.85 + Math.pow(Math.max(0, Math.sin(t * 2.5)), 8) * 0.35
        : 1 + Math.sin(t * 1.2) * 0.04;
      midRef.current.scale.setScalar(midPulse);
    }
    if (coreRef.current) {
      const voicePulse = activity === "speaking"
        ? 1 + Math.sin(t * 7.2) * 0.15 + Math.sin(t * 11.3) * 0.06
        : activity === "thinking"
          ? 0.8 + Math.pow(Math.max(0, Math.sin(t * 2.8)), 10) * 0.7
          : 1 + Math.sin(t * 1.4) * 0.06;
      coreRef.current.scale.setScalar(voicePulse);
      const mat = coreRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms) {
        mat.uniforms.uTime.value = t;
        mat.uniforms.uEnergy.value = energy;
      }
    }
    if (haloRef.current) {
      const haloScale = activity === "speaking" ? 1.3 + Math.sin(t * 5.8) * 0.15 : 1.1;
      haloRef.current.scale.setScalar(haloScale);
    }
  });

  return (
    <group ref={root} scale={0.86}>
      {/* Outer cube wireframe */}
      <lineSegments ref={outerRef} geometry={outerGeo} rotation={[0.18, 0.32, 0.12]}>
        <lineBasicMaterial blending={THREE.AdditiveBlending} color="#35d8ff" depthWrite={false} opacity={0.78} toneMapped={false} transparent />
      </lineSegments>

      {/* Mid cube wireframe */}
      <lineSegments ref={midRef} geometry={midGeo} rotation={[0.4, -0.2, 0.3]}>
        <lineBasicMaterial blending={THREE.AdditiveBlending} color="#56ffb1" depthWrite={false} opacity={0.42} toneMapped={false} transparent />
      </lineSegments>

      {/* Inner cube wireframe */}
      <lineSegments ref={innerRef} geometry={innerGeo} rotation={[-0.34, 0.26, -0.18]}>
        <lineBasicMaterial blending={THREE.AdditiveBlending} color="#56ffb1" depthWrite={false} opacity={0.88} toneMapped={false} transparent />
      </lineSegments>

      {/* Bridge connectors */}
      <lineSegments geometry={bridgeGeo}>
        <lineBasicMaterial blending={THREE.AdditiveBlending} color="#d9ffff" depthWrite={false} opacity={0.48} toneMapped={false} transparent />
      </lineSegments>

      {/* Core glow sphere with shader */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.38, 32, 32]} />
        <shaderMaterial
          args={[coreShader]}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
          transparent
        />
      </mesh>

      {/* White hot center */}
      <mesh>
        <sphereGeometry args={[0.105, 20, 20]} />
        <meshBasicMaterial color="#f1ffff" toneMapped={false} />
      </mesh>

      {/* Outer halo */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshBasicMaterial
          blending={THREE.AdditiveBlending}
          color="#35d8ff"
          depthWrite={false}
          opacity={0.08}
          toneMapped={false}
          transparent
        />
      </mesh>

      {/* Vertex nodes at cube corners */}
      {[...Array(8)].map((_, i) => {
        const x = (i & 1 ? 1 : -1) * 1.75;
        const y = (i & 2 ? 1 : -1) * 1.05;
        const z = (i & 4 ? 1 : -1) * 0.42;
        return (
          <mesh key={i} position={[x + (seeded(i, 1) - 0.5) * 0.3, y + (seeded(i, 2) - 0.5) * 0.3, z]}>
            <boxGeometry args={[0.14, 0.14, 0.14]} />
            <meshBasicMaterial
              blending={THREE.AdditiveBlending}
              color={i % 2 ? "#56ffb1" : "#35d8ff"}
              depthWrite={false}
              opacity={0.7}
              toneMapped={false}
              transparent
              wireframe
            />
          </mesh>
        );
      })}
    </group>
  );
}

/* ── 2. Dimensional Portal Rings ───────────────────────── */
function DimensionalRings({ activity }: { activity: AiActivity }) {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);
  const ring4 = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const speed = activitySpeed(activity);
    const energy = activityEnergy(activity);

    if (ring1.current) {
      ring1.current.rotation.x += delta * 0.15 * speed;
      ring1.current.rotation.z += delta * 0.08 * speed;
      const s = activity === "speaking" ? 1 + Math.sin(t * 6) * 0.06 : 1;
      ring1.current.scale.setScalar(s);
    }
    if (ring2.current) {
      ring2.current.rotation.y -= delta * 0.12 * speed;
      ring2.current.rotation.x += delta * 0.05 * speed;
    }
    if (ring3.current) {
      ring3.current.rotation.z += delta * 0.09 * speed;
      ring3.current.rotation.y -= delta * 0.06 * speed;
    }
    if (ring4.current) {
      ring4.current.rotation.x -= delta * 0.07 * speed;
      ring4.current.rotation.z -= delta * 0.04 * speed;
      const breath = 1 + Math.sin(t * 0.8) * 0.02 * energy;
      ring4.current.scale.setScalar(breath);
    }
  });

  return (
    <group>
      <mesh ref={ring1} rotation={[0.3, 0.1, 0.5]}>
        <torusGeometry args={[1.72, 0.022, 6, 128]} />
        <meshBasicMaterial blending={THREE.AdditiveBlending} color="#35d8ff" depthWrite={false} opacity={0.72} toneMapped={false} transparent />
      </mesh>
      <mesh ref={ring2} rotation={[1.1, 0.4, -0.2]}>
        <torusGeometry args={[2.08, 0.016, 6, 128]} />
        <meshBasicMaterial blending={THREE.AdditiveBlending} color="#56ffb1" depthWrite={false} opacity={0.55} toneMapped={false} transparent />
      </mesh>
      <mesh ref={ring3} rotation={[0.6, 1.2, 0.8]}>
        <torusGeometry args={[2.42, 0.012, 6, 128]} />
        <meshBasicMaterial blending={THREE.AdditiveBlending} color="#87ecff" depthWrite={false} opacity={0.38} toneMapped={false} transparent />
      </mesh>
      <mesh ref={ring4} rotation={[1.4, 0.2, 1.1]}>
        <torusGeometry args={[2.78, 0.009, 6, 128]} />
        <meshBasicMaterial blending={THREE.AdditiveBlending} color="#d9ffff" depthWrite={false} opacity={0.22} toneMapped={false} transparent />
      </mesh>
    </group>
  );
}

/* ── 3. Spatial Star Field ─────────────────────────────── */
function SpatialStarField({ activity }: { activity: AiActivity }) {
  const starsRef = useRef<THREE.Points>(null);
  const connectionsRef = useRef<THREE.LineSegments>(null);

  const starGeo = useMemo(() => {
    const count = 280;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * seeded(i, 1) - 1);
      const theta = seeded(i, 2) * Math.PI * 2;
      const r = 3.2 + seeded(i, 3) * 2.2;
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      positions[i * 3 + 1] = Math.cos(phi) * r;
      positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  const connectionGeo = useMemo(() => {
    const positions: number[] = [];
    const starPositions = starGeo.getAttribute("position") as THREE.BufferAttribute;
    const threshold = 1.8;
    let count = 0;
    for (let i = 0; i < 120 && count < 60; i++) {
      for (let j = i + 1; j < 120 && count < 60; j++) {
        const dx = starPositions.getX(i) - starPositions.getX(j);
        const dy = starPositions.getY(i) - starPositions.getY(j);
        const dz = starPositions.getZ(i) - starPositions.getZ(j);
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < threshold) {
          positions.push(
            starPositions.getX(i), starPositions.getY(i), starPositions.getZ(i),
            starPositions.getX(j), starPositions.getY(j), starPositions.getZ(j)
          );
          count++;
        }
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [starGeo]);

  useFrame(({ clock }, delta) => {
    const speed = activity === "thinking" ? 0.08 : 0.025;
    if (starsRef.current) starsRef.current.rotation.y -= delta * speed;
    if (connectionsRef.current) connectionsRef.current.rotation.y -= delta * speed;
  });

  return (
    <group>
      <points ref={starsRef} geometry={starGeo}>
        <pointsMaterial
          blending={THREE.AdditiveBlending}
          color="#87ecff"
          depthWrite={false}
          opacity={0.42}
          size={0.028}
          sizeAttenuation
          toneMapped={false}
          transparent
        />
      </points>
      <lineSegments ref={connectionsRef} geometry={connectionGeo}>
        <lineBasicMaterial
          blending={THREE.AdditiveBlending}
          color="#35d8ff"
          depthWrite={false}
          opacity={0.12}
          toneMapped={false}
          transparent
        />
      </lineSegments>
    </group>
  );
}

/* ── 4. Dimensional Rift Lightning ─────────────────────── */
function DimensionalRifts({ activity }: { activity: AiActivity }) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRefs = useRef<THREE.LineBasicMaterial[]>([]);

  const riftGeos = useMemo(() => {
    return Array.from({ length: 6 }, (_, riftIndex) => {
      const angle = (riftIndex / 6) * Math.PI * 2;
      const segments = 8;
      const pts: number[] = [];
      for (let s = 0; s < segments; s++) {
        const t = s / (segments - 1);
        const r = 0.3 + t * 2.2;
        const jitterX = (seeded(riftIndex * 100 + s, 1) - 0.5) * 0.4 * t;
        const jitterY = (seeded(riftIndex * 100 + s, 2) - 0.5) * 0.4 * t;
        pts.push(
          Math.cos(angle) * r + jitterX,
          Math.sin(angle) * r + jitterY,
          (seeded(riftIndex * 100 + s, 3) - 0.5) * 0.6 * t
        );
        if (s < segments - 1) {
          const t2 = (s + 1) / (segments - 1);
          const r2 = 0.3 + t2 * 2.2;
          const jX2 = (seeded(riftIndex * 100 + s + 1, 1) - 0.5) * 0.4 * t2;
          const jY2 = (seeded(riftIndex * 100 + s + 1, 2) - 0.5) * 0.4 * t2;
          pts.push(
            Math.cos(angle) * r2 + jX2,
            Math.sin(angle) * r2 + jY2,
            (seeded(riftIndex * 100 + s + 1, 3) - 0.5) * 0.6 * t2
          );
        }
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
      return geo;
    });
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    materialRefs.current.forEach((mat, i) => {
      if (!mat) return;
      const flicker = Math.pow(Math.max(0, Math.sin(t * (3 + i * 0.7) + i * 1.2)), 4);
      const baseOpacity = activity === "speaking" ? 0.6 : activity === "thinking" ? 0.45 : 0.18;
      mat.opacity = baseOpacity * flicker;
    });
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(t * 0.15) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {riftGeos.map((geo, i) => (
        <lineSegments key={i} geometry={geo}>
          <lineBasicMaterial
            ref={(el) => { if (el) materialRefs.current[i] = el; }}
            blending={THREE.AdditiveBlending}
            color={i % 2 === 0 ? "#87ecff" : "#56ffb1"}
            depthWrite={false}
            opacity={0.2}
            toneMapped={false}
            transparent
          />
        </lineSegments>
      ))}
    </group>
  );
}

/* ── 5. Fresnel Gravitational Shell ────────────────────── */
function FresnelShell({ activity }: { activity: AiActivity }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const shader = useMemo(() => ({
    uniforms: {
      uEnergy: { value: 1 },
      uColor: { value: DEEP_BLUE },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vView = normalize(cameraPosition - world.xyz);
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: `
      uniform float uEnergy;
      uniform vec3 uColor;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        float fresnel = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 4.0);
        gl_FragColor = vec4(uColor, fresnel * 0.003 * uEnergy);
      }
    `,
  }), []);

  useFrame(() => {
    if (matRef.current) {
      matRef.current.uniforms.uEnergy.value = activityEnergy(activity);
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[2.8, 48, 48]} />
      <shaderMaterial
        ref={matRef}
        args={[shader]}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.BackSide}
        toneMapped={false}
        transparent
      />
    </mesh>
  );
}

/* ── 6. Coordinate Axis Beams ──────────────────────────── */
function AxisBeams({ activity }: { activity: AiActivity }) {
  const groupRef = useRef<THREE.Group>(null);

  const beamGeo = useMemo(() => {
    const pts: number[] = [];
    // 4D coordinate axes rendered as thin beams
    const axes = [
      [[0, 0, 0], [2.5, 0, 0]],
      [[0, 0, 0], [-2.5, 0, 0]],
      [[0, 0, 0], [0, 2.5, 0]],
      [[0, 0, 0], [0, -2.5, 0]],
      [[0, 0, 0], [0, 0, 2.5]],
      [[0, 0, 0], [0, 0, -2.5]],
      // Diagonals (W dimension projected)
      [[0, 0, 0], [1.4, 1.4, 1.4]],
      [[0, 0, 0], [-1.4, -1.4, -1.4]],
    ];
    axes.forEach(([a, b]) => {
      pts.push(a[0], a[1], a[2], b[0], b[1], b[2]);
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, []);

  useFrame(({ clock }, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.03 * activitySpeed(activity);
      groupRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.12) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={beamGeo}>
        <lineBasicMaterial
          blending={THREE.AdditiveBlending}
          color="#35d8ff"
          depthWrite={false}
          opacity={0.12}
          toneMapped={false}
          transparent
        />
      </lineSegments>
    </group>
  );
}

/* ── Main SpaceScene Export ─────────────────────────────── */
export function SpaceScene({ activity = "idle" }: { activity?: AiActivity }) {
  return (
    <group name="space-tesseract-realm">
      <ambientLight color="#003348" intensity={0.12} />
      <pointLight position={[0, 0, 2.1]} color="#35d8ff" intensity={2.5} distance={8} decay={2} />

      <OrbEnergyField
        activity={activity}
        color="#087eaa"
        hotColor="#b9f5ff"
        radius={2.18}
        particleCount={280}
        opacity={0.38}
      />

      <TesseractCore activity={activity} />
      <DimensionalRings activity={activity} />
      <SpatialStarField activity={activity} />
      <DimensionalRifts activity={activity} />
      <FresnelShell activity={activity} />
      <AxisBeams activity={activity} />

      <fog attach="fog" args={["#00040a", 7, 20]} />
    </group>
  );
}
