import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AiActivity } from "../../App";
import { activityEnergy, activityPulse, activitySpeed, pathGeometry, seededRandom, segmentGeometry } from "../shared/coreMotion";

const STARK_ORANGE = "#ff7a18";
const AMBER_GOLD = "#ffc55c";
const ARC_CYAN = "#8ef7ff";
const TITANIUM = "#17100a";

// --- TRIANGLE SHAPE GENERATOR ---
function createTriangleShape(radius: number) {
  const shape = new THREE.Shape();
  for (let index = 0; index < 3; index += 1) {
    const angle = Math.PI / 2 + (index * Math.PI * 2) / 3;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (index === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
}

// 1. Lò Phản Ứng Arc Reactor 3D Tam Giác (3D Extruded Mark L Arc Reactor)
function Extruded3DArcReactor({ activity }: { activity: AiActivity }) {
  const rootRef = useRef<THREE.Group>(null);
  const apertureRef = useRef<THREE.Group>(null);
  const coreShaderRef = useRef<THREE.ShaderMaterial>(null);

  const outerGeom = useMemo(
    () =>
      new THREE.ExtrudeGeometry(createTriangleShape(0.85), {
        depth: 0.12,
        bevelEnabled: true,
        bevelSize: 0.04,
        bevelThickness: 0.04,
        bevelSegments: 3,
      }),
    []
  );

  const innerGeom = useMemo(
    () =>
      new THREE.ExtrudeGeometry(createTriangleShape(0.52), {
        depth: 0.16,
        bevelEnabled: true,
        bevelSize: 0.03,
        bevelThickness: 0.03,
        bevelSegments: 2,
      }),
    []
  );

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);

    if (rootRef.current) {
      rootRef.current.rotation.z = Math.sin(time * 0.2) * 0.04;
      rootRef.current.scale.setScalar(activityPulse(activity, time));
    }

    if (apertureRef.current) {
      apertureRef.current.rotation.z -= delta * 0.5 * speed;
    }

    if (coreShaderRef.current) {
      coreShaderRef.current.uniforms.uTime.value = time;
      coreShaderRef.current.uniforms.uEnergy.value = activityEnergy(activity);
    }
  });

  return (
    <group ref={rootRef} rotation={[0.02, -0.05, 0]}>
      {/* ExtrudeGeometry Kim Loại Titan Arc Reactor Outer Chassis */}
      <mesh geometry={outerGeom} position={[0, 0, -0.06]}>
        <meshStandardMaterial
          color={TITANIUM}
          emissive={STARK_ORANGE}
          emissiveIntensity={0.4}
          metalness={0.94}
          roughness={0.18}
        />
      </mesh>

      {/* Core Plasma Energy Glow Shader */}
      <mesh geometry={innerGeom} position={[0, 0, 0.05]} scale={0.96}>
        <shaderMaterial
          ref={coreShaderRef}
          vertexShader={`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`}
          fragmentShader={`
            uniform float uTime; uniform float uEnergy; varying vec2 vUv;
            void main(){
              vec2 p = vUv - vec2(0.5);
              float r = length(p);
              float spokes = pow(abs(sin(atan(p.y, p.x) * 9.0 - uTime * 2.0)), 10.0);
              float bands = pow(abs(sin(r * 48.0 - uTime * 5.5)), 8.0);
              float core = 1.0 - smoothstep(0.02, 0.45, r);

              float signal = (spokes * 0.65 + bands * 0.35 + core) * uEnergy;
              vec3 orange = vec3(1.0, 0.478, 0.094); // #ff7a18
              vec3 cyan   = vec3(0.557, 0.969, 1.0);   // #8ef7ff
              vec3 color = mix(orange, cyan, clamp(signal * 0.8, 0.0, 1.0));

              gl_FragColor = vec4(color * signal * 2.0, clamp(signal, 0.2, 1.0));
            }
          `}
          uniforms={{ uTime: { value: 0 }, uEnergy: { value: 1 } }}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
          transparent
        />
      </mesh>

      {/* Rotating Iris Aperture Ring Blades */}
      <group ref={apertureRef} position={[0, 0, 0.16]}>
        {Array.from({ length: 9 }, (_, index) => {
          const angle = (index * Math.PI * 2) / 9;
          return (
            <mesh key={index} position={[Math.cos(angle) * 0.28, Math.sin(angle) * 0.28, 0]} rotation={[0, 0, angle]}>
              <boxGeometry args={[0.3, 0.038, 0.038]} />
              <meshBasicMaterial color={index % 3 === 0 ? ARC_CYAN : AMBER_GOLD} toneMapped={false} />
            </mesh>
          );
        })}
      </group>

      <pointLight color={STARK_ORANGE} intensity={4.0} distance={5.0} position={[0, 0, 0.3]} />
      <pointLight color={ARC_CYAN} intensity={2.5} distance={3.5} position={[0, 0, 0.4]} />
    </group>
  );
}

// 2. Cánh Giáp Nanotech Co Giãn (Nanotech Armor Shell)
function NanotechArmorShell({ activity }: { activity: AiActivity }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const plates = useMemo(() => {
    const result: Array<{ angle: number; radius: number; depth: number; size: number; phase: number }> = [];
    for (let layer = 0; layer < 3; layer += 1) {
      const count = 9 + layer * 3;
      for (let index = 0; index < count; index += 1) {
        result.push({
          angle: (index * Math.PI * 2) / count + layer * 0.18,
          radius: 1.1 + layer * 0.35,
          depth: -0.14 - layer * 0.18,
          size: 0.22 + layer * 0.045,
          phase: index * 0.47 + layer,
        });
      }
    }
    return result;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.elapsedTime;
    const expansion = activity === "thinking" ? 0.28 : activity === "speaking" ? 0.15 : activity === "listening" ? -0.05 : 0;

    plates.forEach((plate, index) => {
      const oscillation = Math.sin(time * 1.6 + plate.phase) * 0.03;
      const radius = plate.radius + expansion + oscillation;

      dummy.position.set(
        Math.cos(plate.angle) * radius,
        Math.sin(plate.angle) * radius * 0.78,
        plate.depth + Math.sin(time * 0.8 + plate.phase) * 0.08
      );
      dummy.rotation.set(0.16 * Math.sin(plate.phase), -0.25, plate.angle + Math.PI / 2);
      dummy.scale.set(plate.size * 1.45, plate.size * 0.45, 0.08);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(index, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, plates.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#140c08"
        emissive={STARK_ORANGE}
        emissiveIntensity={0.4}
        metalness={0.92}
        roughness={0.22}
      />
    </instancedMesh>
  );
}

// 3. Màn Hình HUD Stark Hologram (Floating Stark HUD Panels)
function FloatingStarkHudPanels({ activity }: { activity: AiActivity }) {
  const rootRef = useRef<THREE.Group>(null);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);

  const panels = useMemo(
    () => [
      { position: [-2.2, 0.75, -0.4] as [number, number, number], rotation: [0.08, 0.48, -0.04] as [number, number, number], scale: [1.15, 0.7, 1] as [number, number, number] },
      { position: [2.15, 0.45, -0.24] as [number, number, number], rotation: [-0.04, -0.52, 0.06] as [number, number, number], scale: [0.95, 0.6, 1] as [number, number, number] },
      { position: [-1.65, -1.35, -0.68] as [number, number, number], rotation: [-0.16, 0.34, -0.14] as [number, number, number], scale: [0.8, 0.44, 1] as [number, number, number] },
      { position: [1.58, -1.4, -0.5] as [number, number, number], rotation: [0.14, -0.4, 0.12] as [number, number, number], scale: [0.88, 0.48, 1] as [number, number, number] },
    ],
    []
  );

  useFrame(({ clock }) => {
    if (rootRef.current) {
      rootRef.current.position.y = Math.sin(clock.elapsedTime * 0.45) * 0.05;
      rootRef.current.scale.setScalar(0.98 + activityEnergy(activity) * 0.025);
    }
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = clock.elapsedTime;
      shaderRef.current.uniforms.uEnergy.value = activityEnergy(activity);
    }
  });

  return (
    <group ref={rootRef}>
      {panels.map((panel, index) => (
        <mesh key={index} position={panel.position} rotation={panel.rotation} scale={panel.scale}>
          <planeGeometry args={[1, 1]} />
          <shaderMaterial
            ref={index === 0 ? shaderRef : undefined}
            vertexShader={`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`}
            fragmentShader={`
              uniform float uTime; uniform float uEnergy; varying vec2 vUv;
              void main(){
                vec2 p = vUv;
                float frame = max(step(p.x, 0.025) + step(0.975, p.x), step(p.y, 0.035) + step(0.965, p.y));
                float grid = (step(0.982, fract(p.x * 12.0)) + step(0.982, fract(p.y * 7.0))) * 0.2;
                float scan = smoothstep(0.03, 0.0, abs(p.y - fract(uTime * 0.18))) * 0.8;
                float graph = smoothstep(0.035, 0.0, abs(p.y - (0.35 + 0.16 * sin(p.x * 11.0 + uTime * 2.0)))) * 0.8;

                float alpha = clamp(frame + grid + scan + graph, 0.0, 1.0) * uEnergy;
                vec3 orange = vec3(1.0, 0.478, 0.094);
                vec3 cyan   = vec3(0.557, 0.969, 1.0);
                vec3 color = mix(orange, cyan, graph);

                gl_FragColor = vec4(color * 1.5, alpha * 0.68);
              }
            `}
            uniforms={{ uTime: { value: 0 }, uEnergy: { value: 1 } }}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

// 4. Luồng Dữ Liệu Conduits (Stark Data Streams)
function StarkDataStreams({ activity }: { activity: AiActivity }) {
  const rootRef = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    const targets = [
      new THREE.Vector3(-1.75, 0.68, -0.2),
      new THREE.Vector3(1.72, 0.38, -0.12),
      new THREE.Vector3(-1.3, -1.08, -0.38),
      new THREE.Vector3(1.26, -1.12, -0.3),
    ];
    const paths = targets.map((target, index) => {
      const points: THREE.Vector3[] = [];
      for (let step = 0; step <= 28; step += 1) {
        const t = step / 28;
        points.push(
          new THREE.Vector3(
            target.x * t,
            target.y * t + Math.sin(t * Math.PI) * (index % 2 ? -0.24 : 0.24),
            target.z * t + Math.sin(t * Math.PI * 2 + index) * 0.08
          )
        );
      }
      return points;
    });
    return pathGeometry(paths);
  }, []);

  const uplinkGeometry = useMemo(
    () =>
      segmentGeometry([
        [new THREE.Vector3(0, 0.85, 0), new THREE.Vector3(0, 2.45, -0.45)],
        [new THREE.Vector3(-0.08, 0.78, 0), new THREE.Vector3(-0.56, 2.1, -0.3)],
        [new THREE.Vector3(0.08, 0.78, 0), new THREE.Vector3(0.6, 2.2, -0.34)],
      ]),
    []
  );

  useFrame(({ clock }) => {
    if (rootRef.current) {
      rootRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.16) * 0.025;
      rootRef.current.scale.setScalar(0.98 + activityEnergy(activity) * 0.025);
    }
  });

  return (
    <group ref={rootRef}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial
          color={AMBER_GOLD}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.65}
          toneMapped={false}
          transparent
        />
      </lineSegments>
      <lineSegments geometry={uplinkGeometry}>
        <lineBasicMaterial
          color={ARC_CYAN}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.52}
          toneMapped={false}
          transparent
        />
      </lineSegments>
    </group>
  );
}

// --- MAIN SOUL SCENE ---
export function SoulScene({ activity = "idle" }: { activity?: AiActivity }) {
  return (
    <group name="stark-mark-l-arc-reactor" scale={1.25} rotation={[0.08, -0.18, 0.025]}>
      <ambientLight color={STARK_ORANGE} intensity={0.5} />
      <directionalLight color={AMBER_GOLD} intensity={1.8} position={[2.5, 3.2, 4]} />

      {/* 1. Floating Stark Hologram HUD Panels */}
      <FloatingStarkHudPanels activity={activity} />

      {/* 2. Stark Data Conduits Streams */}
      <StarkDataStreams activity={activity} />

      {/* 3. Nanotech Armor Scale Shell */}
      <NanotechArmorShell activity={activity} />

      {/* 4. Extruded 3D Mark L Arc Reactor */}
      <Extruded3DArcReactor activity={activity} />
    </group>
  );
}
