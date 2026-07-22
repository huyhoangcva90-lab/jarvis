import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { EnergyPalette } from "../App";

type RealmPlanet = {
  id: Exclude<EnergyPalette, "neutral">;
  color: string;
  radius: number;
  size: number;
  speed: number;
  tilt: number;
  phase: number;
};

const REALMS: RealmPlanet[] = [
  { id: "gold", color: "#ffd15c", radius: 0.82, size: 0.115, speed: 0.34, tilt: 0.28, phase: 0.2 },
  { id: "green", color: "#52ff9b", radius: 1.18, size: 0.1, speed: -0.25, tilt: -0.36, phase: 1.8 },
  { id: "blue", color: "#36d8ff", radius: 1.55, size: 0.13, speed: 0.19, tilt: 0.54, phase: 3.1 },
  { id: "red", color: "#ff526d", radius: 1.9, size: 0.105, speed: -0.15, tilt: -0.22, phase: 4.5 },
  { id: "violet", color: "#c65cff", radius: 2.24, size: 0.125, speed: 0.12, tilt: 0.42, phase: 5.7 },
  { id: "orange", color: "#ff8a34", radius: 2.58, size: 0.11, speed: -0.1, tilt: -0.5, phase: 0.9 },
];

function OrbitPath({ planet }: { planet: RealmPlanet }) {
  return (
    <mesh rotation={[Math.PI / 2 + planet.tilt, 0, 0]}>
      <torusGeometry args={[planet.radius, 0.006, 4, 128]} />
      <meshBasicMaterial
        blending={THREE.AdditiveBlending}
        color={planet.color}
        depthWrite={false}
        opacity={0.22}
        toneMapped={false}
        transparent
      />
    </mesh>
  );
}

function RealmPlanetNode({ planet, onSelect }: { planet: RealmPlanet; onSelect?: (palette: EnergyPalette) => void }) {
  const anchor = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }, delta) => {
    if (anchor.current) anchor.current.rotation.z = planet.phase + clock.elapsedTime * planet.speed;
    if (body.current) {
      body.current.rotation.y += delta * (0.52 + Math.abs(planet.speed));
      const target = hovered ? 1.38 : 1;
      const next = THREE.MathUtils.lerp(body.current.scale.x, target, 0.13);
      body.current.scale.setScalar(next);
    }
  });

  return (
    <group ref={anchor} rotation={[planet.tilt, 0, planet.phase]}>
      <group
        ref={body}
        position={[planet.radius, 0, 0]}
        onClick={(event) => {
          event.stopPropagation();
          onSelect?.(planet.id);
        }}
        onPointerEnter={(event) => {
          event.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = "";
        }}
      >
        <mesh>
          <icosahedronGeometry args={[planet.size, 1]} />
          <meshBasicMaterial color={planet.color} toneMapped={false} wireframe />
        </mesh>
        <mesh scale={1.55}>
          <sphereGeometry args={[planet.size, 16, 16]} />
          <meshBasicMaterial
            blending={THREE.AdditiveBlending}
            color={planet.color}
            depthWrite={false}
            opacity={hovered ? 0.34 : 0.14}
            toneMapped={false}
            transparent
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[planet.size * 1.55, 0.009, 4, 36]} />
          <meshBasicMaterial color={planet.color} opacity={0.62} toneMapped={false} transparent />
        </mesh>
      </group>
    </group>
  );
}

export default function JarvisNeutralCore({ onSelectRealm }: { onSelectRealm?: (palette: EnergyPalette) => void }) {
  const system = useRef<THREE.Group>(null);
  const dust = useRef<THREE.Points>(null);
  const dustGeometry = useMemo(() => {
    const positions = new Float32Array(110 * 3);
    for (let index = 0; index < 110; index += 1) {
      const angle = index * 2.39996;
      const radius = 0.48 + ((index * 37) % 100) / 100 * 2.35;
      positions[index * 3] = Math.cos(angle) * radius;
      positions[index * 3 + 1] = Math.sin(index * 1.71) * 0.28;
      positions[index * 3 + 2] = Math.sin(angle) * radius;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  useFrame(({ clock }, delta) => {
    if (system.current) system.current.rotation.y = Math.sin(clock.elapsedTime * 0.12) * 0.16;
    if (dust.current) dust.current.rotation.y -= delta * 0.025;
  });

  return (
    <group ref={system} rotation={[0.72, 0, -0.08]} scale={0.92}>
      <mesh>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshBasicMaterial color="#fff8e6" toneMapped={false} />
      </mesh>
      <mesh scale={2.8}>
        <sphereGeometry args={[0.12, 20, 20]} />
        <meshBasicMaterial blending={THREE.AdditiveBlending} color="#fff2c2" depthWrite={false} opacity={0.13} toneMapped={false} transparent />
      </mesh>

      {REALMS.map((planet) => <OrbitPath key={`orbit-${planet.id}`} planet={planet} />)}
      {REALMS.map((planet) => <RealmPlanetNode key={planet.id} onSelect={onSelectRealm} planet={planet} />)}

      <points ref={dust} geometry={dustGeometry}>
        <pointsMaterial blending={THREE.AdditiveBlending} color="#dbeafe" depthWrite={false} opacity={0.3} size={0.018} sizeAttenuation toneMapped={false} transparent />
      </points>
    </group>
  );
}
