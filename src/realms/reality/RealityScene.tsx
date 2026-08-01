import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AiActivity } from "../../App";
import { activityEnergy, activityPulse, activitySpeed, pathGeometry, seededRandom, segmentGeometry } from "../shared/coreMotion";

const CRIMSON = "#ff203c";
const AETHER = "#ff4b56";
const GOLD = "#ffc35a";
const ASH = "#ffd6bd";

const aetherVertexShader = `
  uniform float uTime;
  uniform float uEnergy;
  varying vec3 vNormal;
  varying vec3 vPosition;
  float noise3(vec3 p){return sin(p.x*4.2+uTime)*sin(p.y*3.7-uTime*.8)*sin(p.z*5.1+uTime*.55);}
  void main(){
    vNormal=normalize(normalMatrix*normal);
    float n=noise3(position*1.8);
    vec3 displaced=position+normal*n*.13*uEnergy;
    vPosition=displaced;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(displaced,1.0);
  }
`;

const aetherFragmentShader = `
  uniform float uTime;
  uniform float uEnergy;
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main(){
    float veins=pow(abs(sin(vPosition.x*14.0+sin(vPosition.y*8.0)-uTime*2.2)),12.0);
    float fresnel=pow(1.0-abs(vNormal.z),2.2);
    float heat=.55+.45*sin(length(vPosition)*11.0-uTime*2.6);
    vec3 color=mix(vec3(.18,.0,.015),vec3(1.0,.025,.055),heat);
    color=mix(color,vec3(1.0,.65,.34),veins);
    float alpha=clamp(.42+fresnel*.42+veins*.5,0.0,1.0)*uEnergy;
    gl_FragColor=vec4(color*(.72+uEnergy*.32),alpha);
  }
`;

function AetherOrganism({ activity }: { activity: AiActivity }) {
  const root = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const shader = useRef<THREE.ShaderMaterial>(null);
  const lobes = useMemo(() => [
    { base: [-0.64, 0.22, -0.08] as [number, number, number], scale: [0.58, 0.42, 0.48] as [number, number, number], phase: 0.3 },
    { base: [0.58, -0.12, 0.02] as [number, number, number], scale: [0.46, 0.62, 0.42] as [number, number, number], phase: 1.5 },
    { base: [0.08, 0.66, -0.16] as [number, number, number], scale: [0.38, 0.5, 0.34] as [number, number, number], phase: 2.7 },
    { base: [-0.16, -0.7, -0.1] as [number, number, number], scale: [0.44, 0.48, 0.38] as [number, number, number], phase: 4.1 },
    { base: [0.72, 0.48, -0.28] as [number, number, number], scale: [0.3, 0.34, 0.28] as [number, number, number], phase: 5.2 },
  ], []);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const energy = activityEnergy(activity);
    if (root.current) {
      root.current.rotation.y += delta * 0.08 * activitySpeed(activity);
      root.current.rotation.z = Math.sin(time * 0.21) * 0.12;
      root.current.children.forEach((child, index) => {
        if (index === 0) return;
        const lobe = lobes[index - 1];
        if (!lobe) return;
        child.position.set(
          lobe.base[0] + Math.sin(time * 0.72 + lobe.phase) * 0.08,
          lobe.base[1] + Math.cos(time * 0.58 + lobe.phase) * 0.07,
          lobe.base[2] + Math.sin(time * 0.43 + lobe.phase) * 0.12,
        );
        const pulse = 1 + Math.sin(time * 2.4 + lobe.phase) * 0.08 * energy;
        child.scale.set(lobe.scale[0] * pulse, lobe.scale[1] / pulse, lobe.scale[2] * pulse);
      });
    }
    if (core.current) core.current.scale.setScalar(activityPulse(activity, time, 0.8));
    if (shader.current) {
      shader.current.uniforms.uTime.value = time;
      shader.current.uniforms.uEnergy.value = energy;
    }
  });

  return (
    <group ref={root} rotation={[0.08, 0.18, -0.05]}>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.72, 5]} />
        <shaderMaterial
          ref={shader}
          vertexShader={aetherVertexShader}
          fragmentShader={aetherFragmentShader}
          uniforms={{ uTime: { value: 0 }, uEnergy: { value: 1 } }}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          transparent
        />
      </mesh>
      {lobes.map((lobe, index) => (
        <mesh key={index} position={lobe.base} scale={lobe.scale}>
          <icosahedronGeometry args={[1, 3]} />
          <meshStandardMaterial color="#370008" emissive={index % 2 ? CRIMSON : AETHER} emissiveIntensity={1.35} metalness={0.06} roughness={0.35} transparent opacity={0.76} />
        </mesh>
      ))}
      <pointLight color={CRIMSON} intensity={1.25} distance={4.4} decay={2} />
    </group>
  );
}

function AetherVeins({ activity }: { activity: AiActivity }) {
  const root = useRef<THREE.Group>(null);
  const geometry = useMemo(() => {
    const random = seededRandom(616);
    const paths: THREE.Vector3[][] = [];
    for (let strand = 0; strand < 18; strand += 1) {
      const angle = strand * Math.PI * 2 / 18 + random() * 0.3;
      const length = 1.3 + random() * 1.65;
      const points: THREE.Vector3[] = [];
      for (let index = 0; index <= 34; index += 1) {
        const t = index / 34;
        points.push(new THREE.Vector3(
          Math.cos(angle + Math.sin(t * Math.PI * 2) * 0.22) * length * t,
          Math.sin(angle) * length * t * 0.72 + Math.sin(t * Math.PI * 3 + strand) * 0.14,
          -0.15 - t * 0.72 + Math.sin(t * Math.PI * 2 + strand) * 0.18,
        ));
      }
      paths.push(points);
    }
    return pathGeometry(paths);
  }, []);

  useFrame(({ clock }, delta) => {
    if (!root.current) return;
    root.current.rotation.z -= delta * 0.026 * activitySpeed(activity);
    root.current.scale.setScalar(0.96 + activityEnergy(activity) * 0.06 + Math.sin(clock.elapsedTime * 0.8) * 0.02);
  });

  return (
    <group ref={root}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color={AETHER} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.54} toneMapped={false} transparent />
      </lineSegments>
    </group>
  );
}

function RunicMonoliths({ activity }: { activity: AiActivity }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const glyphRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const stones = useMemo(() => {
    const random = seededRandom(2024);
    return Array.from({ length: 22 }, (_, index) => {
      const angle = index / 22 * Math.PI * 2;
      const gap = index === 3 || index === 4 || index === 13;
      return {
        angle,
        radius: 2.0 + (random() - 0.5) * 0.42,
        yScale: gap ? 0.08 : 0.34 + random() * 0.5,
        z: -0.7 + (random() - 0.5) * 0.8,
        tilt: (random() - 0.5) * 0.42,
        phase: random() * Math.PI * 2,
      };
    });
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current || !glyphRef.current) return;
    const time = clock.elapsedTime;
    stones.forEach((stone, index) => {
      const radius = stone.radius + (activity === "thinking" ? Math.sin(time * 1.4 + stone.phase) * 0.1 : 0);
      const x = Math.cos(stone.angle) * radius;
      const y = Math.sin(stone.angle) * radius * 0.7;
      dummy.position.set(x, y, stone.z);
      dummy.rotation.set(stone.tilt, -0.2, stone.angle + Math.PI / 2 + stone.tilt);
      dummy.scale.set(0.18, stone.yScale, 0.11);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(index, dummy.matrix);

      dummy.position.set(x * 1.003, y * 1.003, stone.z + 0.13);
      dummy.rotation.set(0, 0, stone.angle + Math.PI / 2 + stone.tilt);
      dummy.scale.set(0.1, 0.025, 0.014);
      dummy.updateMatrix();
      glyphRef.current?.setMatrixAt(index, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    glyphRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group rotation={[0.18, -0.08, 0.12]}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, stones.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#24090a" emissive="#5a080e" emissiveIntensity={0.5} metalness={0.2} roughness={0.82} />
      </instancedMesh>
      <instancedMesh ref={glyphRef} args={[undefined, undefined, stones.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={GOLD} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

function AncientRuneScript({ activity }: { activity: AiActivity }) {
  const group = useRef<THREE.Group>(null);
  const geometry = useMemo(() => {
    const segments: Array<[THREE.Vector3, THREE.Vector3]> = [];
    const random = seededRandom(991);
    for (let index = 0; index < 48; index += 1) {
      const x = (random() - 0.5) * 4.8;
      const y = (random() - 0.5) * 3.7;
      const z = -0.82 - random() * 0.8;
      const height = 0.1 + random() * 0.18;
      const lean = (random() - 0.5) * 0.14;
      segments.push([new THREE.Vector3(x - lean, y - height, z), new THREE.Vector3(x + lean, y + height, z)]);
      if (index % 2 === 0) segments.push([new THREE.Vector3(x - 0.1, y, z), new THREE.Vector3(x + 0.1, y + (index % 4 ? 0.08 : -0.08), z)]);
    }
    return segmentGeometry(segments);
  }, []);
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.position.y = Math.sin(clock.elapsedTime * 0.34) * 0.06;
    group.current.scale.setScalar(0.98 + activityEnergy(activity) * 0.025);
  });
  return (
    <group ref={group}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color={GOLD} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.36} toneMapped={false} transparent />
      </lineSegments>
    </group>
  );
}

function RealityFracture({ activity }: { activity: AiActivity }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  useFrame(({ clock }) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = clock.elapsedTime;
    material.current.uniforms.uEnergy.value = activityEnergy(activity);
  });
  return (
    <mesh position={[0, 0, -1.6]} scale={[5.3, 4.1, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={material}
        vertexShader={`varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`}
        fragmentShader={`
          uniform float uTime; uniform float uEnergy; varying vec2 vUv;
          float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
          void main(){
            vec2 p=(vUv-.5)*8.0; vec2 id=floor(p); vec2 f=fract(p)-.5;
            float n=hash(id); float crack=smoothstep(.055,.0,abs(f.x+f.y*(n-.5)*1.8));
            float pulse=.35+.65*pow(abs(sin(uTime*.7+n*6.28)),8.0);
            float alpha=crack*pulse*.16*uEnergy;
            gl_FragColor=vec4(vec3(1.0,.035,.02)+vec3(.6,.28,.08)*pulse,alpha);
          }
        `}
        uniforms={{ uTime: { value: 0 }, uEnergy: { value: 1 } }}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        transparent
      />
    </mesh>
  );
}

function RealityEmbers({ activity }: { activity: AiActivity }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const random = seededRandom(4040);
    const values = new Float32Array(380 * 3);
    for (let index = 0; index < 380; index += 1) {
      values[index * 3] = (random() - 0.5) * 5.2;
      values[index * 3 + 1] = (random() - 0.5) * 4.2;
      values[index * 3 + 2] = (random() - 0.5) * 3.4 - 0.4;
    }
    return values;
  }, []);
  useFrame((_, delta) => {
    if (points.current) points.current.rotation.y += delta * 0.026 * activitySpeed(activity);
  });
  return (
    <points ref={points}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial color={ASH} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.38} size={0.027} sizeAttenuation toneMapped={false} transparent />
    </points>
  );
}

export const RealityScene = ({ activity = "idle" }: { activity?: AiActivity }) => (
  <group name="reality-aether-forge" scale={0.92}>
    <RealityFracture activity={activity} />
    <AncientRuneScript activity={activity} />
    <RunicMonoliths activity={activity} />
    <RealityEmbers activity={activity} />
    <AetherVeins activity={activity} />
    <AetherOrganism activity={activity} />
  </group>
);
