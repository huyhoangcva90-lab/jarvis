import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AiActivity } from "../../App";
import { activityEnergy, activityPulse, activitySpeed, pathGeometry, seededRandom, segmentGeometry } from "../shared/coreMotion";

const ORANGE = "#ff7a18";
const GOLD = "#ffc55c";
const WHITE = "#fff8dc";
const CYAN = "#8ef7ff";

function triangleShape(radius: number, inset = 0) {
  const shape = new THREE.Shape();
  for (let index = 0; index < 3; index += 1) {
    const angle = Math.PI / 2 + index * Math.PI * 2 / 3;
    const x = Math.cos(angle) * (radius - inset);
    const y = Math.sin(angle) * (radius - inset);
    if (index === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
}

function ReactorKernel({ activity }: { activity: AiActivity }) {
  const root = useRef<THREE.Group>(null);
  const aperture = useRef<THREE.Group>(null);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  const outerGeometry = useMemo(() => new THREE.ExtrudeGeometry(triangleShape(0.78), { depth: 0.11, bevelEnabled: true, bevelSize: 0.035, bevelThickness: 0.035, bevelSegments: 2 }), []);
  const innerGeometry = useMemo(() => new THREE.ExtrudeGeometry(triangleShape(0.46), { depth: 0.15, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.025, bevelSegments: 2 }), []);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);
    if (root.current) {
      root.current.rotation.z = Math.sin(time * 0.19) * 0.035;
      root.current.scale.setScalar(activityPulse(activity, time));
    }
    if (aperture.current) aperture.current.rotation.z -= delta * 0.42 * speed;
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = time;
      shaderRef.current.uniforms.uEnergy.value = activityEnergy(activity);
    }
  });

  return (
    <group ref={root} rotation={[0.02, -0.05, 0]}>
      <mesh geometry={outerGeometry} position={[0, 0, -0.055]}>
        <meshStandardMaterial color="#17100a" emissive={ORANGE} emissiveIntensity={0.32} metalness={0.92} roughness={0.2} />
      </mesh>
      <mesh geometry={innerGeometry} position={[0, 0, 0.05]} scale={0.96}>
        <shaderMaterial
          ref={shaderRef}
          vertexShader={`varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`}
          fragmentShader={`
            uniform float uTime; uniform float uEnergy; varying vec2 vUv;
            void main(){
              vec2 p=vUv-.5; float r=length(p); float spokes=pow(abs(sin(atan(p.y,p.x)*9.0-uTime*1.8)),12.0);
              float bands=pow(abs(sin(r*46.0-uTime*5.0)),10.0);
              float core=1.0-smoothstep(.04,.48,r);
              float signal=(spokes*.6+bands*.32+core)*uEnergy;
              vec3 color=mix(vec3(1.0,.28,.03),vec3(1.0,.98,.74),clamp(signal,0.0,1.0));
              gl_FragColor=vec4(color*signal,clamp(signal,.16,1.0));
            }
          `}
          uniforms={{ uTime: { value: 0 }, uEnergy: { value: 1 } }}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
          transparent
        />
      </mesh>
      <group ref={aperture} position={[0, -0.02, 0.16]}>
        {Array.from({ length: 9 }, (_, index) => {
          const angle = index * Math.PI * 2 / 9;
          return (
            <mesh key={index} position={[Math.cos(angle) * 0.27, Math.sin(angle) * 0.27, 0]} rotation={[0, 0, angle]}>
              <boxGeometry args={[0.28, 0.035, 0.035]} />
              <meshBasicMaterial color={index % 3 === 0 ? WHITE : GOLD} toneMapped={false} />
            </mesh>
          );
        })}
      </group>
      <pointLight color={ORANGE} intensity={1.2} distance={4.2} decay={2} />
    </group>
  );
}

function NanotechArmor({ activity }: { activity: AiActivity }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const plates = useMemo(() => {
    const result: Array<{ angle: number; radius: number; depth: number; size: number; phase: number }> = [];
    for (let layer = 0; layer < 3; layer += 1) {
      const count = 9 + layer * 3;
      for (let index = 0; index < count; index += 1) {
        result.push({
          angle: index * Math.PI * 2 / count + layer * 0.18,
          radius: 1.05 + layer * 0.32,
          depth: -0.14 - layer * 0.18,
          size: 0.2 + layer * 0.045,
          phase: index * 0.47 + layer,
        });
      }
    }
    return result;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.elapsedTime;
    const expansion = activity === "thinking" ? 0.24 : activity === "speaking" ? 0.12 : activity === "listening" ? -0.04 : 0;
    plates.forEach((plate, index) => {
      const oscillation = Math.sin(time * 1.5 + plate.phase) * 0.025;
      const radius = plate.radius + expansion + oscillation;
      dummy.position.set(Math.cos(plate.angle) * radius, Math.sin(plate.angle) * radius * 0.78, plate.depth + Math.sin(time * 0.7 + plate.phase) * 0.08);
      dummy.rotation.set(0.16 * Math.sin(plate.phase), -0.25, plate.angle + Math.PI / 2);
      dummy.scale.set(plate.size * 1.4, plate.size * 0.42, 0.075);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(index, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, plates.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#140c08" emissive={ORANGE} emissiveIntensity={0.34} metalness={0.9} roughness={0.26} />
    </instancedMesh>
  );
}

function StarkHudPanels({ activity }: { activity: AiActivity }) {
  const root = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const panels = useMemo(() => [
    { position: [-2.18, 0.72, -0.4] as [number, number, number], rotation: [0.08, 0.48, -0.04] as [number, number, number], scale: [1.12, 0.68, 1] as [number, number, number] },
    { position: [2.12, 0.42, -0.24] as [number, number, number], rotation: [-0.04, -0.52, 0.06] as [number, number, number], scale: [0.92, 0.58, 1] as [number, number, number] },
    { position: [-1.62, -1.3, -0.68] as [number, number, number], rotation: [-0.16, 0.34, -0.14] as [number, number, number], scale: [0.78, 0.42, 1] as [number, number, number] },
    { position: [1.54, -1.38, -0.5] as [number, number, number], rotation: [0.14, -0.4, 0.12] as [number, number, number], scale: [0.86, 0.46, 1] as [number, number, number] },
  ], []);

  useFrame(({ clock }) => {
    if (root.current) {
      root.current.position.y = Math.sin(clock.elapsedTime * 0.44) * 0.045;
      root.current.scale.setScalar(0.98 + activityEnergy(activity) * 0.025);
    }
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime;
      materialRef.current.uniforms.uEnergy.value = activityEnergy(activity);
    }
  });

  return (
    <group ref={root}>
      {panels.map((panel, index) => (
        <mesh key={index} position={panel.position} rotation={panel.rotation} scale={panel.scale}>
          <planeGeometry args={[1, 1]} />
          <shaderMaterial
            ref={index === 0 ? materialRef : undefined}
            vertexShader={`varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`}
            fragmentShader={`
              uniform float uTime; uniform float uEnergy; varying vec2 vUv;
              void main(){
                vec2 p=vUv; float frame=max(step(p.x,.025)+step(.975,p.x),step(p.y,.035)+step(.965,p.y));
                float grid=(step(.985,fract(p.x*12.0))+step(.985,fract(p.y*7.0)))*.18;
                float scan=smoothstep(.03,0.0,abs(p.y-fract(uTime*.18)))*.75;
                float graph=smoothstep(.035,0.0,abs(p.y-(.35+.16*sin(p.x*11.0+uTime*2.0))))*.72;
                float alpha=clamp(frame+grid+scan+graph,0.0,1.0)*uEnergy;
                gl_FragColor=vec4(mix(vec3(1.0,.32,.03),vec3(.55,1.0,1.0),graph),alpha*.62);
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

function DataConduits({ activity }: { activity: AiActivity }) {
  const root = useRef<THREE.Group>(null);
  const geometry = useMemo(() => {
    const targets = [
      new THREE.Vector3(-1.72, 0.65, -0.2),
      new THREE.Vector3(1.7, 0.35, -0.12),
      new THREE.Vector3(-1.28, -1.05, -0.38),
      new THREE.Vector3(1.24, -1.1, -0.3),
    ];
    const paths = targets.map((target, index) => {
      const points: THREE.Vector3[] = [];
      for (let step = 0; step <= 26; step += 1) {
        const t = step / 26;
        points.push(new THREE.Vector3(
          target.x * t,
          target.y * t + Math.sin(t * Math.PI) * (index % 2 ? -0.22 : 0.22),
          target.z * t + Math.sin(t * Math.PI * 2 + index) * 0.08,
        ));
      }
      return points;
    });
    return pathGeometry(paths);
  }, []);
  const uplinkGeometry = useMemo(() => segmentGeometry([
    [new THREE.Vector3(0, 0.82, 0), new THREE.Vector3(0, 2.4, -0.45)],
    [new THREE.Vector3(-0.08, 0.75, 0), new THREE.Vector3(-0.54, 2.08, -0.3)],
    [new THREE.Vector3(0.08, 0.75, 0), new THREE.Vector3(0.58, 2.18, -0.34)],
  ]), []);

  useFrame(({ clock }) => {
    if (!root.current) return;
    root.current.rotation.z = Math.sin(clock.elapsedTime * 0.16) * 0.025;
    root.current.scale.setScalar(0.98 + activityEnergy(activity) * 0.025);
  });

  return (
    <group ref={root}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color={GOLD} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.56} toneMapped={false} transparent />
      </lineSegments>
      <lineSegments geometry={uplinkGeometry}>
        <lineBasicMaterial color={CYAN} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.42} toneMapped={false} transparent />
      </lineSegments>
    </group>
  );
}

function DiagnosticParticles({ activity }: { activity: AiActivity }) {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const random = seededRandom(8505);
    const values = new Float32Array(280 * 3);
    for (let index = 0; index < 280; index += 1) {
      const band = index % 4;
      const angle = random() * Math.PI * 2;
      const radius = 0.9 + band * 0.52 + random() * 0.25;
      values[index * 3] = Math.cos(angle) * radius;
      values[index * 3 + 1] = Math.sin(angle) * radius * 0.72;
      values[index * 3 + 2] = (random() - 0.5) * 1.45;
    }
    return values;
  }, []);
  useFrame(({ clock }, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.z -= delta * 0.055 * activitySpeed(activity);
    pointsRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.18) * 0.08;
  });
  return (
    <points ref={pointsRef}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial color={WHITE} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.48} size={0.026} sizeAttenuation toneMapped={false} transparent />
    </points>
  );
}

export function SoulScene({ activity = "idle" }: { activity?: AiActivity }) {
  return (
    <group name="stark-jarvis-reactor" scale={0.96} rotation={[0.08, -0.18, 0.025]}>
      <ambientLight color="#ff6a10" intensity={0.12} />
      <directionalLight color="#ffd7a0" intensity={0.64} position={[2.5, 3.2, 4]} />
      <StarkHudPanels activity={activity} />
      <DataConduits activity={activity} />
      <DiagnosticParticles activity={activity} />
      <NanotechArmor activity={activity} />
      <ReactorKernel activity={activity} />
    </group>
  );
}
