import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { AiActivity, EnergyPalette } from "../../App";

type RealmProps = {
  activity: AiActivity;
  palette: EnergyPalette;
};

const COLORS: Record<EnergyPalette, { accent: string; hot: string; deep: string }> = {
  gold: { accent: "#ff941f", hot: "#fff0aa", deep: "#8c3608" },
  blue: { accent: "#28c8ff", hot: "#d7f8ff", deep: "#063c72" },
  green: { accent: "#53ff8d", hot: "#dcffe6", deep: "#07592d" },
  red: { accent: "#ff315f", hot: "#ffd6dc", deep: "#6b081d" },
  violet: { accent: "#b45cff", hot: "#f3dcff", deep: "#3d0b72" },
  orange: { accent: "#ff6a18", hot: "#ffe0a8", deep: "#7c2406" }
};

function energy(activity: AiActivity) {
  if (activity === "speaking") return 1.55;
  if (activity === "thinking") return 1.25;
  if (activity === "listening") return 0.78;
  return 1;
}

function speed(activity: AiActivity) {
  if (activity === "speaking") return 1.8;
  if (activity === "thinking") return 1.35;
  if (activity === "listening") return 0.42;
  return 1;
}

function seededRandom(seed: number) {
  return () => {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function SharedCore({ activity, palette, shape = "sphere" }: RealmProps & { shape?: "sphere" | "octa" | "ico" }) {
  const root = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const color = COLORS[palette];

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    if (root.current) {
      const voice = activity === "speaking" ? Math.sin(t * 7.5) * 0.105 : Math.sin(t * 1.7) * 0.025;
      root.current.scale.setScalar((1 + voice) * (0.96 + energy(activity) * 0.045));
      root.current.rotation.y += delta * 0.18 * speed(activity);
    }
    if (shell.current) shell.current.rotation.z -= delta * 0.32 * speed(activity);
  });

  return (
    <group ref={root}>
      <mesh>
        {shape === "sphere" && <sphereGeometry args={[0.13, 24, 24]} />}
        {shape === "octa" && <octahedronGeometry args={[0.2, 1]} />}
        {shape === "ico" && <icosahedronGeometry args={[0.2, 1]} />}
        <meshBasicMaterial color={color.hot} toneMapped={false} />
      </mesh>
      <mesh ref={shell} scale={1.5}>
        {shape === "sphere" && <torusKnotGeometry args={[0.27, 0.018, 96, 5, 2, 3]} />}
        {shape === "octa" && <octahedronGeometry args={[0.33, 1]} />}
        {shape === "ico" && <icosahedronGeometry args={[0.34, 1]} />}
        <meshBasicMaterial blending={THREE.AdditiveBlending} color={color.accent} opacity={0.75} transparent wireframe={shape !== "sphere"} toneMapped={false} depthWrite={false} />
      </mesh>
      <mesh scale={2.4}>
        <sphereGeometry args={[0.26, 20, 20]} />
        <meshBasicMaterial blending={THREE.AdditiveBlending} color={color.accent} opacity={0.11} transparent toneMapped={false} depthWrite={false} />
      </mesh>
    </group>
  );
}

function HypercubeRealm({ activity, palette }: RealmProps) {
  const root = useRef<THREE.Group>(null);
  const outer = useRef<THREE.LineSegments>(null);
  const inner = useRef<THREE.LineSegments>(null);
  const colors = COLORS[palette];
  const cube = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(2.72, 2.72, 2.72)), []);
  const smallCube = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(1.22, 1.22, 1.22)), []);
  const connectors = useMemo(() => {
    const positions: number[] = [];
    for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) {
      positions.push(x * 0.61, y * 0.61, z * 0.61, x * 1.36, y * 1.36, z * 1.36);
    }
    return new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  }, []);
  const layers = useMemo(() => [0.78, 1.04, 1.3, 1.58], []);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const pace = speed(activity);
    if (root.current) root.current.rotation.y += delta * 0.08 * pace;
    if (outer.current) {
      outer.current.rotation.x += delta * 0.13 * pace;
      outer.current.rotation.z = Math.sin(t * 0.4) * 0.12;
    }
    if (inner.current) {
      inner.current.rotation.x -= delta * 0.28 * pace;
      inner.current.rotation.y -= delta * 0.34 * pace;
      inner.current.scale.setScalar(0.9 + Math.sin(t * (activity === "speaking" ? 6 : 1.8)) * 0.08);
    }
  });

  return (
    <group ref={root} rotation={[0.42, 0.18, 0.18]}>
      <lineSegments ref={outer} geometry={cube}><lineBasicMaterial color={colors.accent} transparent opacity={0.66} toneMapped={false} /></lineSegments>
      <lineSegments ref={inner} geometry={smallCube}><lineBasicMaterial color={colors.hot} transparent opacity={0.95} toneMapped={false} /></lineSegments>
      <lineSegments geometry={connectors}><lineBasicMaterial color={colors.accent} transparent opacity={0.38} toneMapped={false} /></lineSegments>
      {layers.map((scaleValue, index) => (
        <mesh key={scaleValue} rotation={[Math.PI / 2, index * 0.36, index * 0.21]} scale={[scaleValue, scaleValue, scaleValue]}>
          <torusGeometry args={[1.25, 0.006 + index * 0.001, 4, 72]} />
          <meshBasicMaterial blending={THREE.AdditiveBlending} color={index === 0 ? colors.hot : colors.accent} opacity={0.2 + index * 0.07} transparent toneMapped={false} depthWrite={false} />
        </mesh>
      ))}
      <SharedCore activity={activity} palette={palette} shape="octa" />
    </group>
  );
}

function RuneRing({ radius, teeth, rotation, color, opacity = 0.62 }: { radius: number; teeth: number; rotation: [number, number, number]; color: string; opacity?: number }) {
  const geometry = useMemo(() => {
    const positions: number[] = [];
    for (let i = 0; i < teeth; i += 1) {
      if (i % 7 === 2 || i % 11 === 5) continue;
      const a = (i / teeth) * Math.PI * 2;
      const half = i % 5 === 0 ? 0.095 : 0.052;
      const r0 = radius - half;
      const r1 = radius + half;
      positions.push(Math.cos(a) * r0, Math.sin(a) * r0, 0, Math.cos(a) * r1, Math.sin(a) * r1, 0);
      const b = a + Math.PI * 2 / teeth * 0.72;
      positions.push(Math.cos(a) * radius, Math.sin(a) * radius, 0, Math.cos(b) * radius, Math.sin(b) * radius, 0);
    }
    return new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  }, [radius, teeth]);
  return <lineSegments geometry={geometry} rotation={rotation}><lineBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} /></lineSegments>;
}

function TemporalRealm({ activity, palette }: RealmProps) {
  const root = useRef<THREE.Group>(null);
  const rings = useRef<THREE.Group>(null);
  const colors = COLORS[palette];
  useFrame(({ clock }, delta) => {
    const pace = speed(activity);
    if (root.current) root.current.rotation.y = Math.sin(clock.elapsedTime * 0.22) * 0.2;
    if (rings.current) {
      rings.current.rotation.z += delta * 0.12 * pace;
      rings.current.rotation.x = 0.2 + Math.sin(clock.elapsedTime * 0.37) * 0.08;
      rings.current.scale.setScalar(1 + (activity === "speaking" ? Math.sin(clock.elapsedTime * 6.4) * 0.035 : 0));
    }
  });
  return (
    <group ref={root} rotation={[-0.12, 0.12, -0.18]}>
      <group ref={rings}>
        <RuneRing radius={0.72} teeth={32} rotation={[0, 0, 0]} color={colors.hot} opacity={0.76} />
        <RuneRing radius={1.12} teeth={48} rotation={[0.14, 0.2, 0]} color={colors.accent} />
        <RuneRing radius={1.55} teeth={64} rotation={[-0.22, 0.12, 0]} color={colors.accent} opacity={0.45} />
        <RuneRing radius={1.96} teeth={84} rotation={[0.28, -0.24, 0]} color={colors.accent} opacity={0.32} />
        {[0, 1, 2].map((index) => (
          <mesh key={index} rotation={[0.22 + index * 0.48, index * 0.56, index * 0.82]}>
            <torusGeometry args={[1.04 + index * 0.34, 0.008, 4, 96]} />
            <meshBasicMaterial color={colors.accent} transparent opacity={0.34 - index * 0.06} toneMapped={false} />
          </mesh>
        ))}
      </group>
      <SharedCore activity={activity} palette={palette} shape="ico" />
    </group>
  );
}

function RealityRealm({ activity, palette }: RealmProps) {
  const root = useRef<THREE.Group>(null);
  const crown = useRef<THREE.Group>(null);
  const colors = COLORS[palette];
  const columns = useMemo(() => Array.from({ length: 12 }, (_, index) => ({ angle: index / 12 * Math.PI * 2, height: 0.65 + (index % 4) * 0.22 })), []);
  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    if (root.current) root.current.rotation.y += delta * 0.055 * speed(activity);
    if (crown.current) {
      crown.current.rotation.z -= delta * 0.11 * speed(activity);
      crown.current.scale.y = 1 + Math.sin(t * (activity === "speaking" ? 6.8 : 1.2)) * 0.045;
    }
  });
  return (
    <group ref={root} rotation={[0.12, 0, -0.1]}>
      <group ref={crown}>
        {columns.map((item, index) => (
          <mesh key={index} position={[Math.cos(item.angle) * 1.55, Math.sin(item.angle) * 1.55, 0]} rotation={[0, 0, item.angle]}>
            <boxGeometry args={[0.035, item.height, 0.035]} />
            <meshBasicMaterial color={index % 3 === 0 ? colors.hot : colors.accent} transparent opacity={0.62} toneMapped={false} />
          </mesh>
        ))}
        {[0.92, 1.48, 2.04].map((radius, index) => <RuneRing key={radius} radius={radius} teeth={28 + index * 16} rotation={[0.28 * index, 0.42 * index, 0.18 * index]} color={colors.accent} opacity={0.58 - index * 0.12} />)}
      </group>
      <mesh rotation={[0.4, 0.25, 0.2]}>
        <octahedronGeometry args={[0.48, 0]} />
        <meshBasicMaterial color={colors.accent} wireframe transparent opacity={0.88} toneMapped={false} />
      </mesh>
      <SharedCore activity={activity} palette={palette} shape="octa" />
    </group>
  );
}

function PowerRealm({ activity, palette }: RealmProps) {
  const root = useRef<THREE.Group>(null);
  const nodes = useRef<THREE.InstancedMesh>(null);
  const colors = COLORS[palette];
  const count = 18;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const positions = useMemo(() => Array.from({ length: count }, (_, index) => {
    const ring = index < 6 ? 0.86 : index < 12 ? 1.34 : 1.82;
    const section = index % 6;
    return new THREE.Vector3(Math.cos(section / 6 * Math.PI * 2) * ring, (index % 3 - 1) * 0.22, Math.sin(section / 6 * Math.PI * 2) * ring);
  }), []);
  const links = useMemo(() => {
    const data: number[] = [];
    positions.forEach((point, index) => {
      const next = positions[(index + 1) % positions.length];
      data.push(point.x, point.y, point.z, next.x, next.y, next.z, 0, 0, 0, point.x, point.y, point.z);
    });
    return new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(data, 3));
  }, [positions]);
  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    if (root.current) root.current.rotation.y += delta * 0.13 * speed(activity);
    if (!nodes.current) return;
    positions.forEach((point, index) => {
      dummy.position.copy(point);
      dummy.position.y += Math.sin(t * (0.8 + index % 3 * 0.22) + index) * 0.08;
      dummy.scale.setScalar((index % 6 === 0 ? 1.45 : 1) * (1 + Math.sin(t * 2.2 + index) * 0.12) * energy(activity));
      dummy.updateMatrix();
      nodes.current!.setMatrixAt(index, dummy.matrix);
    });
    nodes.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <group ref={root} rotation={[0.38, 0.1, 0.12]}>
      <instancedMesh ref={nodes} args={[undefined, undefined, count]}>
        <octahedronGeometry args={[0.085, 0]} />
        <meshBasicMaterial color={colors.hot} toneMapped={false} />
      </instancedMesh>
      <lineSegments geometry={links}><lineBasicMaterial color={colors.accent} transparent opacity={0.34} toneMapped={false} /></lineSegments>
      {[0.78, 1.28, 1.78].map((radius, index) => (
        <mesh key={radius} rotation={[Math.PI / 2, index * 0.42, 0]}>
          <torusGeometry args={[radius, 0.012, 5, 6]} />
          <meshBasicMaterial color={colors.accent} transparent opacity={0.42 - index * 0.08} toneMapped={false} />
        </mesh>
      ))}
      <SharedCore activity={activity} palette={palette} shape="ico" />
    </group>
  );
}

function SoulRealm({ activity, palette }: RealmProps) {
  const root = useRef<THREE.Group>(null);
  const points = useRef<THREE.Points>(null);
  const colors = COLORS[palette];
  const geometry = useMemo(() => {
    const random = seededRandom(78133);
    const positions: number[] = [];
    const sizes: number[] = [];
    const perLobe = 625;
    for (const lobe of [-1, 1]) {
      for (let index = 0; index < perLobe; index += 1) {
        const yUnit = 1 - (index / (perLobe - 1)) * 2;
        const radial = Math.sqrt(Math.max(0, 1 - yUnit * yUnit));
        const angle = index * Math.PI * (3 - Math.sqrt(5));
        const wrinkle = 1 + Math.sin(angle * 3 + yUnit * 8) * 0.075 + (random() - 0.5) * 0.035;
        const x = lobe * 0.48 + Math.cos(angle) * radial * 0.72 * wrinkle;
        const y = yUnit * 1.34 + Math.sin(angle * 2) * 0.035;
        const z = Math.sin(angle) * radial * 0.78 * wrinkle;
        positions.push(x, y, z);
        sizes.push(0.8 + random() * 1.5);
      }
    }
    const result = new THREE.BufferGeometry();
    result.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    result.setAttribute("aSize", new THREE.Float32BufferAttribute(sizes, 1));
    return result;
  }, []);
  const synapses = useMemo(() => {
    const random = seededRandom(7711);
    const source = geometry.getAttribute("position") as THREE.BufferAttribute;
    const lines: number[] = [];
    const perLobe = source.count / 2;
    for (let index = 0; index < 110; index += 1) {
      const offset = index % 2 === 0 ? 0 : perLobe;
      const a = offset + Math.floor(random() * (perLobe - 32));
      const b = Math.min(offset + perLobe - 1, a + 3 + Math.floor(random() * 24));
      lines.push(source.getX(a), source.getY(a), source.getZ(a), source.getX(b), source.getY(b), source.getZ(b));
    }
    for (let bridge = 0; bridge < 22; bridge += 1) {
      const a = Math.floor((bridge + 1) / 23 * (perLobe - 1));
      const b = perLobe + a;
      lines.push(source.getX(a), source.getY(a), source.getZ(a), source.getX(b), source.getY(b), source.getZ(b));
    }
    return new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(lines, 3));
  }, [geometry]);
  const shader = useMemo(() => ({
    uniforms: { uColor: { value: new THREE.Color(colors.accent) }, uTime: { value: 0 }, uEnergy: { value: 1 } },
    vertexShader: `attribute float aSize; uniform float uTime; uniform float uEnergy; varying float vPulse; void main(){ vec3 p=position; float wave=sin(uTime*1.7+position.y*5.0+position.x*3.0); p += normalize(position+vec3(.001))*wave*.018*uEnergy; vec4 mv=modelViewMatrix*vec4(p,1.0); gl_Position=projectionMatrix*mv; gl_PointSize=aSize*uEnergy*(13.0/max(1.0,-mv.z)); vPulse=.55+.45*sin(uTime*2.8+position.x*7.0+position.y*4.0); }`,
    fragmentShader: `uniform vec3 uColor; varying float vPulse; void main(){ float d=length(gl_PointCoord-.5); float a=smoothstep(.5,.04,d)*(.35+vPulse*.65); gl_FragColor=vec4(uColor,a); }`
  }), [colors.accent]);
  useFrame(({ clock }, delta) => {
    if (root.current) {
      root.current.rotation.y += delta * 0.09 * speed(activity);
      root.current.scale.setScalar(1 + (activity === "speaking" ? Math.sin(clock.elapsedTime * 6.6) * 0.05 : Math.sin(clock.elapsedTime) * 0.012));
    }
    if (points.current) {
      const material = points.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = clock.elapsedTime;
      material.uniforms.uEnergy.value = energy(activity);
    }
  });
  return (
    <group ref={root} rotation={[0.08, 0.16, -0.05]}>
      <points ref={points} geometry={geometry}>
        <shaderMaterial args={[shader]} blending={THREE.AdditiveBlending} depthWrite={false} transparent toneMapped={false} />
      </points>
      <lineSegments geometry={synapses}><lineBasicMaterial color={colors.hot} transparent opacity={0.19} toneMapped={false} /></lineSegments>
      <SharedCore activity={activity} palette={palette} shape="sphere" />
    </group>
  );
}

export function RealmSignature({ activity, palette }: RealmProps) {
  if (palette === "blue") return <HypercubeRealm activity={activity} palette={palette} />;
  if (palette === "green") return <TemporalRealm activity={activity} palette={palette} />;
  if (palette === "red") return <RealityRealm activity={activity} palette={palette} />;
  if (palette === "violet") return <PowerRealm activity={activity} palette={palette} />;
  if (palette === "orange") return <SoulRealm activity={activity} palette={palette} />;
  return null;
}
