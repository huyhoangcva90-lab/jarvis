import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type TimeActivity = "idle" | "listening" | "thinking" | "speaking";

const TAU = Math.PI * 2;
const WHITE = "#ffffff";
const PALE = "#dfffee";
const EMERALD = "#57ff9a";
const GREEN = "#18c96b";
const DEEP = "#08723d";

function polar(radius: number, angle: number, z = 0) {
  return new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, z);
}

function closePath(points: THREE.Vector3[]) {
  return [...points, points[0].clone()];
}

function segmentsFromPaths(paths: THREE.Vector3[][]) {
  const vertices: number[] = [];
  paths.forEach((path) => {
    for (let index = 0; index < path.length - 1; index += 1) {
      const a = path[index];
      const b = path[index + 1];
      vertices.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  return geometry;
}

function circlePath(radius: number, segments = 96, z = 0, phase = 0) {
  return Array.from({ length: segments + 1 }, (_, index) => polar(radius, phase + (index / segments) * TAU, z));
}

function polygonPath(sides: number, radius: number, phase: number, z: number) {
  return closePath(Array.from({ length: sides }, (_, index) => polar(radius, phase + (index / sides) * TAU, z)));
}

export function MysticTimeCore({ activity }: { activity: TimeActivity }) {
  const root = useRef<THREE.Group>(null);
  const nucleus = useRef<THREE.Mesh>(null);
  const nucleusHalo = useRef<THREE.Mesh>(null);
  const coreRays = useRef<THREE.LineSegments>(null);
  const iris = useRef<THREE.Group>(null);
  const clock = useRef<THREE.Group>(null);
  const mandala = useRef<THREE.Group>(null);
  const ancientGeometry = useRef<THREE.Group>(null);
  const nodes = useRef<THREE.Group>(null);
  const gear = useRef<THREE.Group>(null);
  const gyroA = useRef<THREE.Group>(null);
  const gyroB = useRef<THREE.Group>(null);
  const brokenOrbit = useRef<THREE.Group>(null);
  const sphereGrid = useRef<THREE.Group>(null);
  const glyphField = useRef<THREE.Group>(null);
  const reduceMotion = useRef(false);
  const clockTarget = useRef(0);
  const clockElapsed = useRef(0);

  const rayGeometry = useMemo(() => {
    const paths = Array.from({ length: 12 }, (_, index) => {
      const angle = (index / 12) * TAU + (index % 2) * 0.08;
      const inner = index % 3 === 0 ? 0.18 : 0.23;
      const outer = 0.38 + (index % 4) * 0.055;
      return [polar(inner, angle, 0.28), polar(outer, angle, 0.28)];
    });
    return segmentsFromPaths(paths);
  }, []);

  const eyeGeometry = useMemo(() => {
    const upper: THREE.Vector3[] = [];
    const lower: THREE.Vector3[] = [];
    for (let index = 0; index <= 48; index += 1) {
      const x = -1.28 + (index / 48) * 2.56;
      const normalized = x / 1.28;
      const y = Math.pow(Math.max(0, 1 - normalized * normalized), 0.72) * 0.48;
      upper.push(new THREE.Vector3(x, y, 0.2));
      lower.push(new THREE.Vector3(x, -y, 0.2));
    }
    return segmentsFromPaths([
      upper,
      lower,
      [new THREE.Vector3(-1.55, 0, 0.2), new THREE.Vector3(-1.28, 0, 0.2)],
      [new THREE.Vector3(1.28, 0, 0.2), new THREE.Vector3(1.55, 0, 0.2)],
      [new THREE.Vector3(0, 0.48, 0.2), new THREE.Vector3(0, 0.78, 0.2)],
      [new THREE.Vector3(-0.13, 0.57, 0.2), new THREE.Vector3(0, 0.78, 0.2), new THREE.Vector3(0.13, 0.57, 0.2)],
      [new THREE.Vector3(0, -0.48, 0.2), new THREE.Vector3(0, -0.78, 0.2)],
      [new THREE.Vector3(-0.13, -0.57, 0.2), new THREE.Vector3(0, -0.78, 0.2), new THREE.Vector3(0.13, -0.57, 0.2)],
    ]);
  }, []);

  const apertureGeometry = useMemo(() => {
    const blades = Array.from({ length: 8 }, (_, index) => {
      const angle = (index / 8) * TAU;
      return closePath([
        polar(0.18, angle, 0.25),
        polar(0.47, angle + 0.13, 0.25),
        polar(0.31, angle + TAU / 8, 0.25),
      ]);
    });
    return segmentsFromPaths(blades);
  }, []);

  const clockGeometry = useMemo(() => {
    const paths: THREE.Vector3[][] = [circlePath(1.62, 120, 0.08), circlePath(1.82, 120, 0.08)];
    for (let index = 0; index < 12; index += 1) {
      const angle = (index / 12) * TAU;
      const inner = index % 3 === 0 ? 1.57 : 1.64;
      paths.push([polar(inner, angle, 0.09), polar(1.84, angle, 0.09)]);
      const glyphCenter = polar(1.72, angle, 0.1);
      const tangent = new THREE.Vector3(-Math.sin(angle), Math.cos(angle), 0).multiplyScalar(0.06);
      paths.push([
        glyphCenter.clone().sub(tangent),
        glyphCenter.clone().add(tangent),
        glyphCenter.clone().add(new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0).multiplyScalar(index % 2 ? 0.04 : -0.04)),
      ]);
    }
    paths.push([new THREE.Vector3(0, 0, 0.12), polar(1.52, Math.PI * 0.38, 0.12)]);
    return segmentsFromPaths(paths);
  }, []);

  const mandalaGeometry = useMemo(() => {
    const petals = Array.from({ length: 8 }, (_, index) => {
      const angle = (index / 8) * TAU;
      const large = index % 2 === 0;
      const outer = large ? 2.42 : 2.18;
      const halfWidth = large ? 0.16 : 0.12;
      return closePath([
        polar(1.02, angle, 0.02),
        polar(1.7, angle - halfWidth, 0.02),
        polar(outer, angle, 0.02),
        polar(1.7, angle + halfWidth, 0.02),
      ]);
    });
    return segmentsFromPaths([...petals, circlePath(2.02, 96, 0.01), circlePath(2.48, 96, 0.01)]);
  }, []);

  const runeGeometry = useMemo(() => {
    const paths: THREE.Vector3[][] = [circlePath(2.63, 128, -0.03), circlePath(2.86, 128, -0.03)];
    for (let index = 0; index < 30; index += 1) {
      const angle = (index / 30) * TAU;
      const center = polar(2.745, angle, -0.015);
      const tangent = new THREE.Vector3(-Math.sin(angle), Math.cos(angle), 0);
      const radial = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0);
      const width = 0.035 + (index % 4) * 0.008;
      const height = 0.045 + (index % 3) * 0.012;
      paths.push([
        center.clone().add(tangent.clone().multiplyScalar(-width)).add(radial.clone().multiplyScalar(-height)),
        center.clone().add(tangent.clone().multiplyScalar(width)).add(radial.clone().multiplyScalar(height)),
      ]);
      if (index % 3 !== 1) {
        paths.push([
          center.clone().add(tangent.clone().multiplyScalar(-width)).add(radial.clone().multiplyScalar(height)),
          center.clone().add(tangent.clone().multiplyScalar(width * 0.4)).add(radial.clone().multiplyScalar(-height)),
        ]);
      }
    }
    return segmentsFromPaths(paths);
  }, []);

  const ancientLineGeometry = useMemo(() => segmentsFromPaths([
    polygonPath(3, 3.08, Math.PI / 2, -0.08),
    polygonPath(3, 3.08, -Math.PI / 2, -0.08),
    polygonPath(4, 2.95, Math.PI / 4, -0.075),
    polygonPath(8, 3.18, Math.PI / 8, -0.07),
    circlePath(3.04, 128, -0.09),
  ]), []);

  const gearGeometry = useMemo(() => {
    const paths: THREE.Vector3[][] = [];
    for (let index = 0; index < 32; index += 1) {
      if (index % 7 === 3) continue;
      const angle = (index / 32) * TAU;
      const next = angle + TAU / 32 * 0.68;
      paths.push([polar(3.43, angle, -0.12), polar(3.43, next, -0.12)]);
      const toothRadius = index % 4 === 0 ? 3.68 : 3.58;
      paths.push(closePath([
        polar(3.45, angle - 0.022, -0.1),
        polar(toothRadius, angle, -0.1),
        polar(3.45, angle + 0.022, -0.1),
      ]));
    }
    return segmentsFromPaths(paths);
  }, []);

  const brokenOrbitGeometry = useMemo(() => {
    const paths: THREE.Vector3[][] = [];
    const fragments = [0.055, 0.08, 0.045, 0.095, 0.06, 0.075, 0.05, 0.065, 0.085];
    let cursor = 0.02;
    fragments.forEach((length, index) => {
      const start = cursor * TAU;
      const end = (cursor + length) * TAU;
      const points = Array.from({ length: 10 }, (_, pointIndex) => {
        const ratio = pointIndex / 9;
        return polar(4.18 + (index % 3) * 0.055, THREE.MathUtils.lerp(start, end, ratio), -0.18);
      });
      paths.push(points);
      cursor += length + 0.012 + (index % 2) * 0.005;
    });
    return segmentsFromPaths(paths);
  }, []);

  const gyroRuneGeometry = useMemo(() => {
    const paths: THREE.Vector3[][] = [];
    for (let index = 0; index < 23; index += 1) {
      if (index % 7 === 4) continue;
      const angle = (index / 23) * TAU;
      const inner = 3.7 - (index % 3) * 0.025;
      const outer = 3.91 + (index % 4) * 0.018;
      paths.push([polar(inner, angle, 0), polar(outer, angle, 0)]);
      if (index % 4 === 0) paths.push([polar(3.77, angle + 0.018, 0), polar(3.9, angle + 0.042, 0)]);
    }
    return segmentsFromPaths(paths);
  }, []);

  const gridGeometry = useMemo(() => {
    const paths: THREE.Vector3[][] = [];
    const radius = 4.02;
    for (let latitude = -4; latitude <= 4; latitude += 1) {
      const phi = (latitude / 10) * Math.PI;
      const ringRadius = Math.cos(phi) * radius;
      const z = Math.sin(phi) * radius;
      paths.push(Array.from({ length: 65 }, (_, index) => {
        const angle = (index / 64) * TAU;
        const noise = 1 + Math.sin(index * 0.77 + latitude * 2.1) * 0.008;
        return new THREE.Vector3(Math.cos(angle) * ringRadius * noise, Math.sin(angle) * ringRadius * noise, z);
      }));
    }
    for (let longitude = 0; longitude < 12; longitude += 1) {
      const theta = (longitude / 12) * TAU;
      paths.push(Array.from({ length: 49 }, (_, index) => {
        const phi = -Math.PI / 2 + (index / 48) * Math.PI;
        const warpedRadius = radius * (1 + Math.sin(index * 0.61 + longitude) * 0.007);
        return new THREE.Vector3(
          Math.cos(phi) * Math.cos(theta) * warpedRadius,
          Math.cos(phi) * Math.sin(theta) * warpedRadius,
          Math.sin(phi) * warpedRadius,
        );
      }));
    }
    return segmentsFromPaths(paths);
  }, []);

  const glyphShardGeometry = useMemo(() => {
    const paths: THREE.Vector3[][] = [];
    for (let index = 0; index < 42; index += 1) {
      const seed = Math.sin(index * 91.73) * 43758.5453;
      const random = seed - Math.floor(seed);
      const angle = (index / 42) * TAU + random * 0.11;
      const radius = 4.34 + (index % 5) * 0.09;
      const length = 0.055 + (index % 4) * 0.025;
      paths.push([polar(radius, angle, (random - 0.5) * 1.2), polar(radius + length, angle + 0.025, (random - 0.5) * 1.2)]);
      if (index % 3 === 0) paths.push([polar(radius, angle, 0.1), polar(radius, angle + 0.045, 0.1)]);
    }
    return segmentsFromPaths(paths);
  }, []);

  const dustGeometry = useMemo(() => {
    const positions = new Float32Array(180 * 3);
    for (let index = 0; index < 180; index += 1) {
      const u = (Math.sin(index * 12.9898) * 43758.5453) % 1;
      const v = (Math.sin(index * 78.233 + 2.4) * 12741.371) % 1;
      const angle = Math.abs(u) * TAU;
      const radius = 3.8 + Math.abs(v) * 1.1;
      positions[index * 3] = Math.cos(angle) * radius;
      positions[index * 3 + 1] = Math.sin(angle) * radius;
      positions[index * 3 + 2] = (Math.abs(u + v) % 1 - 0.5) * 2.8;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => { reduceMotion.current = media.matches; };
    syncPreference();
    media.addEventListener("change", syncPreference);
    return () => media.removeEventListener("change", syncPreference);
  }, []);

  useFrame(({ clock: sceneClock }, delta) => {
    if (reduceMotion.current) return;
    const t = sceneClock.elapsedTime;
    const speed = activity === "thinking" ? 1.75 : activity === "speaking" ? 1.4 : activity === "listening" ? 0.62 : 1;
    if (root.current) root.current.rotation.z = Math.sin(t * 0.16) * 0.014;

    const thoughtBurst = Math.pow(Math.max(0, Math.sin(t * 2.45)), 12);
    const nucleusScale = activity === "speaking"
      ? 1 + Math.sin(t * 8.2) * 0.24 + Math.sin(t * 13.7) * 0.08
      : activity === "thinking"
        ? 0.72 + thoughtBurst * 0.95
        : 1 + Math.sin(t * 1.35) * (activity === "listening" ? 0.12 : 0.075);
    nucleus.current?.scale.setScalar(nucleusScale);
    nucleusHalo.current?.scale.setScalar(0.92 + nucleusScale * 0.34);
    if (coreRays.current) {
      coreRays.current.rotation.z -= delta * 0.34 * speed;
      (coreRays.current.material as THREE.LineBasicMaterial).opacity = 0.24 + Math.max(0, Math.sin(t * 3.1)) * 0.5 + thoughtBurst * 0.2;
    }

    if (iris.current) {
      const irisOpen = activity === "thinking" ? 0.84 + thoughtBurst * 0.2 : 0.96 + Math.sin(t * 0.8) * 0.025;
      iris.current.scale.setScalar(irisOpen);
      iris.current.rotation.z -= delta * 0.18 * speed;
    }

    clockElapsed.current += delta * speed;
    if (clockElapsed.current >= 0.72) {
      clockElapsed.current %= 0.72;
      clockTarget.current -= TAU / 12;
    }
    if (clock.current) clock.current.rotation.z = THREE.MathUtils.lerp(clock.current.rotation.z, clockTarget.current, Math.min(1, delta * 13));
    if (mandala.current) {
      mandala.current.rotation.z += delta * 0.055 * speed;
      const open = activity === "thinking" ? 0.9 + thoughtBurst * 0.1 : 0.96 + Math.sin(t * 0.55) * 0.018;
      mandala.current.scale.setScalar(open);
    }
    if (ancientGeometry.current) ancientGeometry.current.rotation.z -= delta * 0.028 * speed;
    if (nodes.current) {
      nodes.current.rotation.z += delta * 0.045;
      nodes.current.children.forEach((node, index) => {
        const signal = Math.max(0, Math.sin(t * 3.2 - index * 0.72));
        node.scale.setScalar(0.88 + signal * 0.28);
        node.rotation.z += delta * (index % 2 === 0 ? 0.42 : -0.34);
      });
    }
    if (gear.current) gear.current.rotation.z -= delta * 0.075 * speed;
    if (gyroA.current) gyroA.current.rotation.z += delta * 0.12 * speed;
    if (gyroB.current) gyroB.current.rotation.z -= delta * 0.095 * speed;
    if (brokenOrbit.current) brokenOrbit.current.rotation.z += delta * 0.11 * speed;
    if (sphereGrid.current) sphereGrid.current.rotation.y += delta * 0.026;
    if (glyphField.current) {
      glyphField.current.rotation.z -= delta * 0.036;
      glyphField.current.rotation.y = Math.sin(t * 0.2) * 0.12;
    }
  });

  return (
    <group ref={root} rotation={[0.08, -0.08, 0]} scale={0.58}>
      {/* 1 — AI nucleus */}
      <mesh ref={nucleus} position={[0, 0, 0.34]}>
        <sphereGeometry args={[0.115, 24, 24]} />
        <meshBasicMaterial color={WHITE} toneMapped={false} />
      </mesh>
      <mesh ref={nucleusHalo} position={[0, 0, 0.3]}>
        <sphereGeometry args={[0.235, 24, 24]} />
        <meshBasicMaterial blending={THREE.AdditiveBlending} color={EMERALD} depthWrite={false} opacity={0.22} toneMapped={false} transparent />
      </mesh>
      <lineSegments ref={coreRays} geometry={rayGeometry}>
        <lineBasicMaterial blending={THREE.AdditiveBlending} color={PALE} depthWrite={false} opacity={0.5} toneMapped={false} transparent />
      </lineSegments>

      {/* 2 — mechanical Eye of Agamotto */}
      <lineSegments geometry={eyeGeometry}>
        <lineBasicMaterial blending={THREE.AdditiveBlending} color={PALE} depthWrite={false} opacity={0.92} toneMapped={false} transparent />
      </lineSegments>
      {[0.32, 0.5, 0.68].map((radius, index) => (
        <mesh key={radius} position={[0, 0, 0.19 - index * 0.012]}>
          <torusGeometry args={[radius, index === 0 ? 0.018 : 0.012, 6, 96]} />
          <meshBasicMaterial blending={THREE.AdditiveBlending} color={index === 0 ? WHITE : EMERALD} depthWrite={false} opacity={0.82 - index * 0.14} toneMapped={false} transparent />
        </mesh>
      ))}
      <group ref={iris}>
        <lineSegments geometry={apertureGeometry}>
          <lineBasicMaterial blending={THREE.AdditiveBlending} color={WHITE} depthWrite={false} opacity={0.9} toneMapped={false} transparent />
        </lineSegments>
      </group>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 1.43, 0, 0.18]}>
          <mesh><torusGeometry args={[0.12, 0.022, 5, 32]} /><meshBasicMaterial color={GREEN} toneMapped={false} /></mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}><boxGeometry args={[0.3, 0.035, 0.035]} /><meshBasicMaterial color={PALE} toneMapped={false} /></mesh>
        </group>
      ))}

      {/* 3 — stepped time lock */}
      <group ref={clock}>
        <lineSegments geometry={clockGeometry}>
          <lineBasicMaterial blending={THREE.AdditiveBlending} color={EMERALD} depthWrite={false} opacity={0.72} toneMapped={false} transparent />
        </lineSegments>
      </group>

      {/* 4 — eight-petal iris mandala */}
      <group ref={mandala}>
        <lineSegments geometry={mandalaGeometry}>
          <lineBasicMaterial blending={THREE.AdditiveBlending} color={PALE} depthWrite={false} opacity={0.74} toneMapped={false} transparent />
        </lineSegments>
      </group>

      {/* 5 — custom non-Latin rune band */}
      <lineSegments geometry={runeGeometry}>
        <lineBasicMaterial blending={THREE.AdditiveBlending} color={EMERALD} depthWrite={false} opacity={0.58} toneMapped={false} transparent />
      </lineSegments>

      {/* 6 — Ancient One dimensional geometry */}
      <group ref={ancientGeometry}>
        <lineSegments geometry={ancientLineGeometry}>
          <lineBasicMaterial blending={THREE.AdditiveBlending} color={PALE} depthWrite={false} opacity={0.27} toneMapped={false} transparent />
        </lineSegments>
      </group>

      {/* 7 — eight stabilizer nodes */}
      <group ref={nodes}>
        {Array.from({ length: 8 }, (_, index) => {
          const angle = (index / 8) * TAU;
          return (
            <group key={index} position={[Math.cos(angle) * 3.2, Math.sin(angle) * 3.2, 0.16]}>
              <mesh><torusGeometry args={[index % 2 === 0 ? 0.17 : 0.125, 0.018, 5, 28]} /><meshBasicMaterial blending={THREE.AdditiveBlending} color={index % 2 === 0 ? PALE : EMERALD} depthWrite={false} opacity={0.82} toneMapped={false} transparent /></mesh>
              <mesh><ringGeometry args={[0.045, 0.075, 6]} /><meshBasicMaterial blending={THREE.AdditiveBlending} color={WHITE} depthWrite={false} opacity={0.72} side={THREE.DoubleSide} toneMapped={false} transparent /></mesh>
            </group>
          );
        })}
      </group>

      {/* 8 — asymmetrical magic gear */}
      <group ref={gear}>
        <lineSegments geometry={gearGeometry}>
          <lineBasicMaterial blending={THREE.AdditiveBlending} color={GREEN} depthWrite={false} opacity={0.54} toneMapped={false} transparent />
        </lineSegments>
      </group>

      {/* 9 — crossed spherical gyroscope rings */}
      <group ref={gyroA} rotation={[Math.PI / 3, 0.12, 0]}>
        <mesh>
          <torusGeometry args={[3.82, 0.018, 6, 192]} />
          <meshBasicMaterial blending={THREE.AdditiveBlending} color={PALE} depthWrite={false} opacity={0.38} toneMapped={false} transparent />
        </mesh>
        <lineSegments geometry={gyroRuneGeometry}>
          <lineBasicMaterial blending={THREE.AdditiveBlending} color={PALE} depthWrite={false} opacity={0.28} toneMapped={false} transparent />
        </lineSegments>
      </group>
      <group ref={gyroB} rotation={[-Math.PI / 3, -0.12, 0]}>
        <mesh>
          <torusGeometry args={[3.88, 0.014, 6, 192]} />
          <meshBasicMaterial blending={THREE.AdditiveBlending} color={EMERALD} depthWrite={false} opacity={0.32} toneMapped={false} transparent />
        </mesh>
        <lineSegments geometry={gyroRuneGeometry}>
          <lineBasicMaterial blending={THREE.AdditiveBlending} color={EMERALD} depthWrite={false} opacity={0.24} toneMapped={false} transparent />
        </lineSegments>
      </group>

      {/* 10 — incomplete chain orbit */}
      <group ref={brokenOrbit}>
        <lineSegments geometry={brokenOrbitGeometry}>
          <lineBasicMaterial blending={THREE.AdditiveBlending} color={PALE} depthWrite={false} opacity={0.48} toneMapped={false} transparent />
        </lineSegments>
      </group>

      {/* 11 — faint deformed spherical energy grid */}
      <group ref={sphereGrid} rotation={[0.2, 0.34, 0]}>
        <lineSegments geometry={gridGeometry}>
          <lineBasicMaterial blending={THREE.AdditiveBlending} color={EMERALD} depthWrite={false} opacity={0.1} toneMapped={false} transparent />
        </lineSegments>
      </group>

      {/* 12 — floating rune shards, dust and short trails */}
      <group ref={glyphField}>
        <lineSegments geometry={glyphShardGeometry}>
          <lineBasicMaterial blending={THREE.AdditiveBlending} color={PALE} depthWrite={false} opacity={0.38} toneMapped={false} transparent />
        </lineSegments>
        <points geometry={dustGeometry}>
          <pointsMaterial blending={THREE.AdditiveBlending} color={EMERALD} depthWrite={false} opacity={0.34} size={0.027} sizeAttenuation toneMapped={false} transparent />
        </points>
      </group>

      <pointLight color={EMERALD} distance={9} intensity={2.2} position={[0, 0, 1.4]} />
    </group>
  );
}
