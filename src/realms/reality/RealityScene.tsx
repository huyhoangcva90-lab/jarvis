import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import type { AiActivity } from "../../App";

/* ── Color Palette ─────────────────────────────────────── */
const CRIMSON = new THREE.Color("#ef2b2d");
const GOLD_BRONZE = new THREE.Color("#fbbf24");
const BLOOD = new THREE.Color("#991b1b");
const PARCHMENT = new THREE.Color("#ffd4a3");
const WHITE_FIRE = new THREE.Color("#fff2e0");

const TAU = Math.PI * 2;

function seeded(i: number, salt: number) {
  return Math.abs(Math.sin(i * 91.733 + salt * 37.19) * 43758.5453) % 1;
}

function activitySpeed(a: AiActivity) {
  if (a === "speaking") return 1.8;
  if (a === "thinking") return 2.4;
  if (a === "listening") return 0.55;
  return 1;
}

function activityEnergy(a: AiActivity) {
  if (a === "speaking") return 1.5;
  if (a === "thinking") return 1.3;
  if (a === "listening") return 0.7;
  return 1;
}

function polar(radius: number, angle: number, z = 0) {
  return new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, z);
}

/* ── 1. Aether Reality Core ────────────────────────────── */
function AetherCore({ activity }: { activity: AiActivity }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  const coreShader = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uEnergy: { value: 1.0 },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uEnergy;
      varying vec3 vPosition;
      varying vec3 vNormal;
      void main() {
        vPosition = position;
        vNormal = normal;
        vec3 p = position;
        float distortion = sin(p.x * 8.0 + uTime * 2.0) * sin(p.y * 6.0 - uTime * 1.5) * sin(p.z * 7.0 + uTime * 1.2);
        p += normal * distortion * 0.06 * uEnergy;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uEnergy;
      varying vec3 vPosition;
      varying vec3 vNormal;
      void main() {
        float flow = sin(vPosition.x * 12.0 + uTime * 3.0) * sin(vPosition.y * 10.0 - uTime * 2.2) * 0.5 + 0.5;
        float pulse = 0.6 + 0.4 * sin(uTime * 4.0 + length(vPosition) * 6.0);
        vec3 blood = vec3(0.93, 0.17, 0.18);
        vec3 fire = vec3(1.0, 0.85, 0.5);
        vec3 color = mix(blood, fire, flow * pulse * 0.6);
        float alpha = (0.35 + flow * 0.4) * uEnergy;
        gl_FragColor = vec4(color, alpha);
      }
    `,
  }), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const energy = activityEnergy(activity);
    if (coreRef.current) {
      const voicePulse = activity === "speaking"
        ? 1 + Math.sin(t * 7.5) * 0.18 + Math.sin(t * 12) * 0.06
        : activity === "thinking"
          ? 0.75 + Math.pow(Math.max(0, Math.sin(t * 2.5)), 10) * 0.8
          : 1 + Math.sin(t * 1.3) * 0.06;
      coreRef.current.scale.setScalar(voicePulse);
      const mat = coreRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms) {
        mat.uniforms.uTime.value = t;
        mat.uniforms.uEnergy.value = energy;
      }
    }
    if (haloRef.current) {
      const haloScale = activity === "speaking" ? 1.4 + Math.sin(t * 5.8) * 0.12 : 1.15;
      haloRef.current.scale.setScalar(haloScale);
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = t * 0.4;
      innerRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    }
  });

  return (
    <group>
      {/* White hot nucleus */}
      <mesh>
        <sphereGeometry args={[0.09, 20, 20]} />
        <meshBasicMaterial color="#fff8e0" toneMapped={false} />
      </mesh>

      {/* Aether blob with distortion shader */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.42, 4]} />
        <shaderMaterial
          args={[coreShader]}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
          transparent
        />
      </mesh>

      {/* Outer halo glow */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.58, 24, 24]} />
        <meshBasicMaterial
          blending={THREE.AdditiveBlending}
          color="#ef2b2d"
          depthWrite={false}
          opacity={0.1}
          toneMapped={false}
          transparent
        />
      </mesh>

      {/* Inner rotating tetrahedron */}
      <mesh ref={innerRef}>
        <tetrahedronGeometry args={[0.22, 0]} />
        <meshBasicMaterial
          blending={THREE.AdditiveBlending}
          color="#fbbf24"
          depthWrite={false}
          opacity={0.5}
          toneMapped={false}
          transparent
          wireframe
        />
      </mesh>
    </group>
  );
}

/* ── 2. Norse/Greek Runic Circles ──────────────────────── */
function RunicCircles({ activity }: { activity: AiActivity }) {
  const innerRing = useRef<THREE.Group>(null);
  const middleRing = useRef<THREE.Group>(null);
  const outerRing = useRef<THREE.Group>(null);

  // Inner runic circle with rune marks
  const innerGeo = useMemo(() => {
    const pts: number[] = [];
    // Circle
    for (let i = 0; i < 128; i++) {
      const a1 = (i / 128) * TAU;
      const a2 = ((i + 1) / 128) * TAU;
      pts.push(Math.cos(a1) * 1.2, Math.sin(a1) * 1.2, 0);
      pts.push(Math.cos(a2) * 1.2, Math.sin(a2) * 1.2, 0);
    }
    // Outer boundary
    for (let i = 0; i < 128; i++) {
      const a1 = (i / 128) * TAU;
      const a2 = ((i + 1) / 128) * TAU;
      pts.push(Math.cos(a1) * 1.42, Math.sin(a1) * 1.42, 0);
      pts.push(Math.cos(a2) * 1.42, Math.sin(a2) * 1.42, 0);
    }
    // Rune tick marks (24 divisions = Elder Futhark count)
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * TAU;
      const inner = i % 3 === 0 ? 1.12 : 1.18;
      pts.push(Math.cos(angle) * inner, Math.sin(angle) * inner, 0);
      pts.push(Math.cos(angle) * 1.44, Math.sin(angle) * 1.44, 0);
      // Mini rune strokes
      const c = polar(1.31, angle);
      const t = new THREE.Vector3(-Math.sin(angle), Math.cos(angle), 0).multiplyScalar(0.04);
      const r = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0).multiplyScalar(i % 2 ? 0.035 : -0.035);
      pts.push(c.x - t.x + r.x, c.y - t.y + r.y, 0);
      pts.push(c.x + t.x - r.x, c.y + t.y - r.y, 0);
      if (i % 4 === 0) {
        pts.push(c.x - t.x, c.y - t.y, 0);
        pts.push(c.x + t.x * 0.5 + r.x, c.y + t.y * 0.5 + r.y, 0);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, []);

  // Middle sacred geometry (Star of David + polygon)
  const middleGeo = useMemo(() => {
    const pts: number[] = [];
    // Triangle up
    for (let i = 0; i < 3; i++) {
      const a1 = (i / 3) * TAU + Math.PI / 2;
      const a2 = ((i + 1) / 3) * TAU + Math.PI / 2;
      pts.push(Math.cos(a1) * 1.85, Math.sin(a1) * 1.85, 0);
      pts.push(Math.cos(a2) * 1.85, Math.sin(a2) * 1.85, 0);
    }
    // Triangle down
    for (let i = 0; i < 3; i++) {
      const a1 = (i / 3) * TAU - Math.PI / 2;
      const a2 = ((i + 1) / 3) * TAU - Math.PI / 2;
      pts.push(Math.cos(a1) * 1.85, Math.sin(a1) * 1.85, 0);
      pts.push(Math.cos(a2) * 1.85, Math.sin(a2) * 1.85, 0);
    }
    // Hexagon
    for (let i = 0; i < 6; i++) {
      const a1 = (i / 6) * TAU;
      const a2 = ((i + 1) / 6) * TAU;
      pts.push(Math.cos(a1) * 2.05, Math.sin(a1) * 2.05, 0);
      pts.push(Math.cos(a2) * 2.05, Math.sin(a2) * 2.05, 0);
    }
    // Square
    for (let i = 0; i < 4; i++) {
      const a1 = (i / 4) * TAU + Math.PI / 4;
      const a2 = ((i + 1) / 4) * TAU + Math.PI / 4;
      pts.push(Math.cos(a1) * 1.92, Math.sin(a1) * 1.92, 0);
      pts.push(Math.cos(a2) * 1.92, Math.sin(a2) * 1.92, 0);
    }
    // Circle
    for (let i = 0; i < 96; i++) {
      const a1 = (i / 96) * TAU;
      const a2 = ((i + 1) / 96) * TAU;
      pts.push(Math.cos(a1) * 2.12, Math.sin(a1) * 2.12, 0);
      pts.push(Math.cos(a2) * 2.12, Math.sin(a2) * 2.12, 0);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, []);

  // Outer Norse rune band with Elder Futhark glyphs
  const outerGeo = useMemo(() => {
    const pts: number[] = [];
    // Double circle boundary
    for (let i = 0; i < 128; i++) {
      const a1 = (i / 128) * TAU;
      const a2 = ((i + 1) / 128) * TAU;
      pts.push(Math.cos(a1) * 2.52, Math.sin(a1) * 2.52, 0);
      pts.push(Math.cos(a2) * 2.52, Math.sin(a2) * 2.52, 0);
      pts.push(Math.cos(a1) * 2.78, Math.sin(a1) * 2.78, 0);
      pts.push(Math.cos(a2) * 2.78, Math.sin(a2) * 2.78, 0);
    }
    // Norse rune strokes in the band
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * TAU;
      const center = polar(2.65, angle);
      const tangent = new THREE.Vector3(-Math.sin(angle), Math.cos(angle), 0);
      const radial = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0);
      const w = 0.032 + (i % 4) * 0.008;
      const h = 0.045 + (i % 3) * 0.015;
      // Vertical stroke
      pts.push(center.x - radial.x * h, center.y - radial.y * h, 0);
      pts.push(center.x + radial.x * h, center.y + radial.y * h, 0);
      // Cross stroke
      if (i % 3 !== 1) {
        pts.push(center.x - tangent.x * w - radial.x * h * 0.4, center.y - tangent.y * w - radial.y * h * 0.4, 0);
        pts.push(center.x + tangent.x * w + radial.x * h * 0.4, center.y + tangent.y * w + radial.y * h * 0.4, 0);
      }
      // Branch stroke for some runes
      if (i % 4 === 0) {
        pts.push(center.x, center.y, 0);
        pts.push(center.x + tangent.x * w * 1.5 + radial.x * h * 0.6, center.y + tangent.y * w * 1.5 + radial.y * h * 0.6, 0);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, []);

  useFrame(({ clock }, delta) => {
    const speed = activitySpeed(activity);
    if (innerRing.current) innerRing.current.rotation.z += delta * 0.045 * speed;
    if (middleRing.current) middleRing.current.rotation.z -= delta * 0.028 * speed;
    if (outerRing.current) outerRing.current.rotation.z += delta * 0.018 * speed;
  });

  return (
    <group>
      <group ref={innerRing}>
        <lineSegments geometry={innerGeo}>
          <lineBasicMaterial blending={THREE.AdditiveBlending} color="#fbbf24" depthWrite={false} opacity={0.72} toneMapped={false} transparent />
        </lineSegments>
      </group>
      <group ref={middleRing}>
        <lineSegments geometry={middleGeo}>
          <lineBasicMaterial blending={THREE.AdditiveBlending} color="#ef2b2d" depthWrite={false} opacity={0.48} toneMapped={false} transparent />
        </lineSegments>
      </group>
      <group ref={outerRing}>
        <lineSegments geometry={outerGeo}>
          <lineBasicMaterial blending={THREE.AdditiveBlending} color="#fbbf24" depthWrite={false} opacity={0.52} toneMapped={false} transparent />
        </lineSegments>
      </group>
    </group>
  );
}

/* ── 3. Yggdrasil World Tree Constellation ─────────────── */
function YggdrasilConstellation() {
  const geoRef = useRef<THREE.LineSegments>(null);
  const geometry = useMemo(() => {
    const branches = [
      [[0, -2.5, -3.4], [0, 3.8, -3.4]],       // Main trunk
      [[0, 2.2, -3.4], [-2.5, 4.5, -3.7]],     // Upper left branch
      [[0, 2.2, -3.4], [2.5, 4.5, -3.7]],      // Upper right branch
      [[0, 1.2, -3.4], [-3.4, 2.7, -4]],        // Mid left
      [[0, 1.2, -3.4], [3.4, 2.7, -4]],         // Mid right
      [[0, -2.2, -3.4], [-2.6, -4.1, -3.8]],   // Root left
      [[0, -2.2, -3.4], [2.6, -4.1, -3.8]],    // Root right
      [[0, -1.5, -3.4], [-1.8, -3.2, -3.6]],   // Sub root
      [[0, -1.5, -3.4], [1.8, -3.2, -3.6]],    // Sub root
      [[0, 3.0, -3.4], [-1.2, 5.2, -3.8]],     // Crown branches
      [[0, 3.0, -3.4], [1.2, 5.2, -3.8]],
    ];
    const points = branches.flatMap(b => b.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  return (
    <lineSegments ref={geoRef} geometry={geometry}>
      <lineBasicMaterial color="#ff6a1a" transparent opacity={0.14} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
    </lineSegments>
  );
}

/* ── 4. Cosmic Embers ──────────────────────────────────── */
function CosmicEmbers({ activity }: { activity: AiActivity }) {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 420;
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 3.5 + seeded(i, 1) * 8;
      const theta = seeded(i, 2) * TAU;
      const y = (seeded(i, 3) - 0.5) * 10;
      data[i * 3] = Math.cos(theta) * radius;
      data[i * 3 + 1] = y;
      data[i * 3 + 2] = Math.sin(theta) * radius - 2;
    }
    return data;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const speed = activitySpeed(activity);
    pointsRef.current.rotation.y = clock.elapsedTime * 0.018 * speed;
    pointsRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.08) * 0.025;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ff3b18"
        size={0.04}
        transparent
        opacity={0.52}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
        sizeAttenuation
      />
    </points>
  );
}

/* ── 5. Celestial Armillary Rings ──────────────────────── */
function CelestialArmillary({ activity }: { activity: AiActivity }) {
  const groupRef = useRef<THREE.Group>(null);
  const stormRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    const speed = activitySpeed(activity);
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * 0.018 * speed;
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.12) * 0.08;
    }
    if (stormRef.current) {
      const pulse = activity === "speaking" ? 1.18 + Math.sin(clock.elapsedTime * 6) * 0.12 : 1;
      stormRef.current.scale.setScalar(pulse);
      stormRef.current.rotation.y -= delta * 0.08 * speed;
    }
  });

  return (
    <group>
      <group ref={groupRef} position={[0, 0.35, -1.1]}>
        {[3.2, 3.75, 4.35].map((radius, i) => (
          <mesh key={radius} rotation={[i * 0.72, i * 0.48, i * 0.31]}>
            <torusGeometry args={[radius, i === 0 ? 0.028 : 0.014, 6, 96]} />
            <meshBasicMaterial
              color={i === 1 ? "#fbbf24" : "#ef2b2d"}
              transparent
              opacity={0.28 - i * 0.05}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </mesh>
        ))}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4.65, 4.72, 48]} />
          <meshBasicMaterial color="#ff421d" transparent opacity={0.14} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
        </mesh>
      </group>

      {/* Storm seal glyph */}
      <group ref={stormRef} position={[0, -2.35, 0.35]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <ringGeometry args={[2.05, 2.12, 12]} />
          <meshBasicMaterial color="#ff351e" transparent opacity={0.38} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 12]}>
          <ringGeometry args={[2.48, 2.54, 6]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.18} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

/* ── 6. Fire Rune Particles ────────────────────────────── */
function FireRuneParticles({ activity }: { activity: AiActivity }) {
  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const geo = useMemo(() => {
    const count = 320;
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const angle = seeded(i, 1) * TAU;
      const radius = 0.6 + Math.pow(seeded(i, 2), 1.5) * 1.8;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (seeded(i, 3) - 0.5) * 0.08;
      positions[i * 3 + 2] = Math.sin(angle) * radius * (0.8 + seeded(i, 4) * 0.2);
      phases[i] = angle + seeded(i, 5) * 4;
      sizes[i] = 1.5 + seeded(i, 6) * 3.5;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    g.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    return g;
  }, []);

  const shader = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uEnergy: { value: 1 },
    },
    vertexShader: `
      attribute float aPhase;
      attribute float aSize;
      uniform float uTime;
      uniform float uEnergy;
      varying float vAlpha;
      void main() {
        vec3 p = position;
        float spin = uTime * (0.2 + fract(aPhase) * 0.1) * uEnergy;
        float c = cos(spin); float s = sin(spin);
        p.xz = mat2(c, -s, s, c) * p.xz;
        p.y += sin(uTime * 2.0 + aPhase * 2.5) * 0.02 * uEnergy;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = aSize * (22.0 / max(1.0, -mv.z));
        vAlpha = (0.35 + 0.65 * pow(0.5 + 0.5 * sin(uTime * 2.5 + aPhase * 8.0), 4.0)) * uEnergy;
      }
    `,
    fragmentShader: `
      varying float vAlpha;
      void main() {
        float mask = smoothstep(0.5, 0.05, length(gl_PointCoord - 0.5));
        vec3 color = mix(vec3(0.93, 0.17, 0.18), vec3(1.0, 0.82, 0.22), vAlpha * 0.5);
        gl_FragColor = vec4(color, mask * vAlpha * 0.72);
      }
    `,
  }), []);

  useFrame(({ clock }, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.elapsedTime;
      matRef.current.uniforms.uEnergy.value = activityEnergy(activity);
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.x = 0.55;
      pointsRef.current.rotation.y += delta * 0.1 * activitySpeed(activity);
    }
  });

  return (
    <points ref={pointsRef} geometry={geo}>
      <shaderMaterial
        ref={matRef}
        args={[shader]}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
        transparent
      />
    </points>
  );
}

/* ── 7. Fresnel Fire Shell ─────────────────────────────── */
function FresnelFireShell({ activity }: { activity: AiActivity }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const shader = useMemo(() => ({
    uniforms: {
      uEnergy: { value: 1 },
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
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        float fresnel = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 4.2);
        vec3 color = vec3(0.6, 0.1, 0.04);
        gl_FragColor = vec4(color, fresnel * 0.003 * uEnergy);
      }
    `,
  }), []);

  useFrame(() => {
    if (matRef.current) matRef.current.uniforms.uEnergy.value = activityEnergy(activity);
  });

  return (
    <mesh>
      <sphereGeometry args={[2.6, 48, 48]} />
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

/* ── Main RealityScene Export ──────────────────────────── */
export const RealityScene: React.FC<{ activity?: AiActivity }> = ({ activity = "idle" }) => {
  return (
    <group name="reality-runic-forge">
      <ambientLight intensity={0.13} color="#9f1239" />
      <directionalLight position={[4, 8, 5]} intensity={0.72} color="#ffd4a3" />
      <pointLight position={[0, 2.2, 1.8]} intensity={2.8} color="#ff2400" distance={13} decay={2} />

      <CosmicEmbers activity={activity} />
      <YggdrasilConstellation />
      <CelestialArmillary activity={activity} />
      <RunicCircles activity={activity} />
      <AetherCore activity={activity} />
      <FireRuneParticles activity={activity} />
      <FresnelFireShell activity={activity} />

      <fog attach="fog" args={["#090001", 7.5, 22]} />
    </group>
  );
};
