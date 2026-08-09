import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import type { AiActivity, EnergyPalette } from "../../App";
import { activityEnergy, activityPulse, activitySpeed, seededRandom } from "../shared/coreMotion";

type TonyPalette = Extract<EnergyPalette, "violet" | "red" | "green" | "orange">;
type Profile = { primary: string; hot: string; metal: string; accent: string; tilt: number; direction: number; seed: number };

const PROFILES: Record<TonyPalette, Profile> = {
  violet: { primary: "#b947ff", hot: "#f1c6ff", metal: "#160d22", accent: "#7a19ff", tilt: 0.7, direction: -1, seed: 1401 },
  red: { primary: "#ff284d", hot: "#ffd0d7", metal: "#24090e", accent: "#b40022", tilt: 0.48, direction: 1, seed: 2209 },
  green: { primary: "#22ef83", hot: "#c9ffe3", metal: "#071b12", accent: "#00a95a", tilt: 0.58, direction: -1, seed: 3109 },
  orange: { primary: "#ff861f", hot: "#fff0cf", metal: "#211006", accent: "#e84b00", tilt: 0.38, direction: 1, seed: 4109 },
};

const plasmaVertex = `
  uniform float uTime; uniform float uEnergy;
  varying vec3 vNormal; varying vec3 vView; varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec3 p = position + normal * (sin(position.y * 12.0 + uTime * 2.4) * 0.018 + sin(position.x * 15.0 - uTime * 3.1) * 0.012) * uEnergy;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vView = normalize(-mv.xyz); vPosition = position;
    gl_Position = projectionMatrix * mv;
  }
`;

const plasmaFragment = `
  uniform float uTime; uniform float uEnergy; uniform vec3 uPrimary; uniform vec3 uHot;
  varying vec3 vNormal; varying vec3 vView; varying vec3 vPosition;
  void main() {
    float fresnel = pow(1.0 - max(dot(normalize(vNormal), normalize(vView)), 0.0), 2.2);
    float bands = 0.5 + 0.5 * sin(vPosition.y * 18.0 + vPosition.x * 9.0 - uTime * 4.0);
    float veins = pow(0.5 + 0.5 * sin((vPosition.x + vPosition.z) * 25.0 + uTime * 5.0), 7.0);
    float signal = 0.55 + bands * 0.34 + veins * 0.55 + fresnel * 1.2;
    vec3 color = mix(uPrimary, uHot, clamp(veins + fresnel * 0.72, 0.0, 1.0));
    gl_FragColor = vec4(color * signal * (0.58 + uEnergy * 0.38), 0.88);
  }
`;

const glassVertex = `
  varying vec3 vNormal; varying vec3 vView;
  void main() { vNormal = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position, 1.0); vView = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }
`;
const glassFragment = `
  uniform float uTime; uniform float uEnergy; uniform vec3 uColor;
  varying vec3 vNormal; varying vec3 vView;
  void main() {
    float rim = pow(1.0 - max(dot(normalize(vNormal), normalize(vView)), 0.0), 3.0);
    float scan = 0.45 + 0.55 * sin((vNormal.y + 1.0) * 27.0 - uTime * 1.8);
    gl_FragColor = vec4(uColor * (0.8 + rim * 1.45), rim * (0.075 + scan * 0.045) * uEnergy);
  }
`;

function PlasmaNucleus({ activity, profile }: { activity: AiActivity; profile: Profile }) {
  const root = useRef<THREE.Group>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const wire = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uEnergy: { value: 1 }, uPrimary: { value: new THREE.Color(profile.primary) }, uHot: { value: new THREE.Color(profile.hot) } }), [profile]);
  useFrame(({ clock }, delta) => {
    const speed = activitySpeed(activity);
    root.current?.scale.setScalar(activityPulse(activity, clock.elapsedTime));
    if (wire.current) { wire.current.rotation.x += delta * 0.18 * speed * profile.direction; wire.current.rotation.y -= delta * 0.24 * speed; }
    if (material.current) { material.current.uniforms.uTime.value = clock.elapsedTime; material.current.uniforms.uEnergy.value = activityEnergy(activity); }
  });
  return <group ref={root}>
    <mesh><icosahedronGeometry args={[0.72, 5]} /><shaderMaterial ref={material} vertexShader={plasmaVertex} fragmentShader={plasmaFragment} uniforms={uniforms} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} transparent /></mesh>
    <mesh ref={wire} scale={1.18}><icosahedronGeometry args={[0.72, 2]} /><meshBasicMaterial color={profile.hot} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.2} toneMapped={false} transparent wireframe /></mesh>
    <pointLight color={profile.primary} intensity={2.6} distance={4.5} decay={2} />
  </group>;
}

function NanotechArmor({ activity, profile }: { activity: AiActivity; profile: Profile }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const plates = useMemo(() => Array.from({ length: 36 }, (_, index) => ({ angle: ((index % 12) / 12) * Math.PI * 2 + Math.floor(index / 12) * 0.13, band: Math.floor(index / 12), phase: index * 0.47 })), []);
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const time = clock.elapsedTime;
    const gap = activity === "thinking" ? 0.16 : activity === "speaking" ? 0.1 : activity === "listening" ? -0.04 : 0;
    plates.forEach((plate, index) => {
      const radius = 1.13 + plate.band * 0.32 + gap + Math.sin(time * 1.4 + plate.phase) * 0.025;
      const angle = plate.angle + time * 0.035 * profile.direction * (plate.band % 2 ? -1 : 1);
      dummy.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, (plate.band - 1) * -0.16);
      dummy.rotation.set(0.12 * (plate.band - 1), -0.18, angle + Math.PI / 2);
      dummy.scale.set(0.31 + plate.band * 0.035, 0.095, 0.055); dummy.updateMatrix(); mesh.current?.setMatrixAt(index, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  return <instancedMesh ref={mesh} args={[undefined, undefined, plates.length]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color={profile.metal} emissive={profile.primary} emissiveIntensity={0.65} metalness={0.96} roughness={0.2} /></instancedMesh>;
}

function GyroscopicReactor({ activity, profile }: { activity: AiActivity; profile: Profile }) {
  const rings = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  useFrame(({ clock }, delta) => {
    const factor = activity === "speaking" ? 1.55 : activity === "thinking" ? 1.25 : activity === "listening" ? 0.62 : 0.88;
    if (rings.current) { rings.current.rotation.x += delta * 0.11 * factor * profile.direction; rings.current.rotation.y -= delta * 0.14 * factor; rings.current.rotation.z = Math.sin(clock.elapsedTime * 0.22) * 0.08; }
    if (inner.current) inner.current.rotation.z += delta * 0.32 * factor * -profile.direction;
  });
  const ringData = [
    { radius: 1.78, tube: 0.018, rotation: [0, 0, 0] as [number, number, number] },
    { radius: 1.94, tube: 0.012, rotation: [Math.PI / 2, 0, 0] as [number, number, number] },
    { radius: 2.12, tube: 0.014, rotation: [0, Math.PI / 2, 0] as [number, number, number] },
  ];
  return <group ref={rings} rotation={[profile.tilt, 0.24, 0]}>
    {ringData.map((ring, index) => <mesh key={ring.radius} rotation={ring.rotation}><torusGeometry args={[ring.radius, ring.tube, 8, 128]} /><meshBasicMaterial color={index === 1 ? profile.hot : profile.primary} blending={THREE.AdditiveBlending} depthWrite={false} opacity={index === 1 ? 0.42 : 0.3} toneMapped={false} transparent /></mesh>)}
    <group ref={inner} rotation={[-profile.tilt * 0.55, 0, 0]}>
      <mesh><torusGeometry args={[1.45, 0.045, 10, 96]} /><meshStandardMaterial color={profile.metal} emissive={profile.accent} emissiveIntensity={1.2} metalness={0.9} roughness={0.18} /></mesh>
      {Array.from({ length: 16 }, (_, index) => { const angle = (index / 16) * Math.PI * 2; return <mesh key={index} position={[Math.cos(angle) * 1.45, Math.sin(angle) * 1.45, 0]} rotation={[0, 0, angle]}><boxGeometry args={[0.22, 0.052, 0.06]} /><meshBasicMaterial color={index % 4 === 0 ? profile.hot : profile.primary} toneMapped={false} /></mesh>; })}
    </group>
  </group>;
}

function DataHalo({ activity, profile }: { activity: AiActivity; profile: Profile }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const random = seededRandom(profile.seed); const values = new Float32Array(520 * 3);
    for (let index = 0; index < 520; index += 1) { const radius = 1.72 + random() * 1.45; const theta = random() * Math.PI * 2; const phi = Math.acos(2 * random() - 1); values[index * 3] = radius * Math.sin(phi) * Math.cos(theta); values[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.78; values[index * 3 + 2] = radius * Math.cos(phi) * 0.72; }
    return values;
  }, [profile.seed]);
  useFrame(({ clock }) => { if (!points.current) return; const speed = activitySpeed(activity); points.current.rotation.y = clock.elapsedTime * 0.045 * speed * profile.direction; points.current.rotation.z = -clock.elapsedTime * 0.018 * speed; points.current.scale.setScalar(0.98 + activityEnergy(activity) * 0.035); });
  return <points ref={points}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial color={profile.hot} size={0.018} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.64} sizeAttenuation toneMapped={false} transparent /></points>;
}

function FresnelShell({ activity, profile }: { activity: AiActivity; profile: Profile }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uEnergy: { value: 1 }, uColor: { value: new THREE.Color(profile.primary) } }), [profile]);
  useFrame(({ clock }) => { if (material.current) { material.current.uniforms.uTime.value = clock.elapsedTime; material.current.uniforms.uEnergy.value = activityEnergy(activity); } });
  return <mesh scale={[1, 1, 0.96]}><sphereGeometry args={[2.28, 64, 64]} /><shaderMaterial ref={material} vertexShader={glassVertex} fragmentShader={glassFragment} uniforms={uniforms} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} transparent /></mesh>;
}

export function TonyOrbScene({ activity = "idle", palette }: { activity?: AiActivity; palette: TonyPalette }) {
  const root = useRef<THREE.Group>(null); const profile = PROFILES[palette];
  useFrame(({ clock }) => { if (root.current) { root.current.position.y = Math.sin(clock.elapsedTime * 0.55) * 0.045; root.current.rotation.z = Math.sin(clock.elapsedTime * 0.18) * 0.025; } });
  return <group ref={root} name={`stark-${palette}-orb`} scale={0.8} rotation={[0.04, -0.08, 0]}>
    <ambientLight color={profile.primary} intensity={0.34} /><directionalLight color={profile.hot} intensity={1.4} position={[3, 3, 4]} />
    <DataHalo activity={activity} profile={profile} /><GyroscopicReactor activity={activity} profile={profile} /><NanotechArmor activity={activity} profile={profile} /><PlasmaNucleus activity={activity} profile={profile} /><FresnelShell activity={activity} profile={profile} />
  </group>;
}
