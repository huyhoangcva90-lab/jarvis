import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AiActivity } from "../../App";
import { activityEnergy, activityPulse, activitySpeed, pathGeometry, seededRandom } from "../shared/coreMotion";

const VIOLET = "#8b3dff";
const MAGENTA = "#e14cff";
const ICE = "#eef1ff";

function Singularity({ activity }: { activity: AiActivity }) {
  const root = useRef<THREE.Group>(null);
  const horizon = useRef<THREE.ShaderMaterial>(null);
  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    if (root.current) {
      root.current.rotation.z += delta * 0.08 * activitySpeed(activity);
      root.current.scale.setScalar(activityPulse(activity, time, 1.6));
    }
    if (horizon.current) {
      horizon.current.uniforms.uTime.value = time;
      horizon.current.uniforms.uEnergy.value = activityEnergy(activity);
    }
  });
  return (
    <group ref={root}>
      <mesh position={[0, 0, 0.28]}>
        <circleGeometry args={[0.34, 96]} />
        <meshBasicMaterial color="#000000" depthWrite toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.2]} scale={1.5}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          ref={horizon}
          vertexShader={`varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`}
          fragmentShader={`
            uniform float uTime; uniform float uEnergy; varying vec2 vUv;
            void main(){
              vec2 p=vUv-.5; float r=length(p); float a=atan(p.y,p.x);
              float ring=smoothstep(.035,.0,abs(r-.265));
              float plasma=pow(abs(sin(a*7.0-r*38.0-uTime*2.4)),8.0)*smoothstep(.42,.2,r)*smoothstep(.14,.22,r);
              float alpha=(ring+plasma*.65)*uEnergy;
              vec3 color=mix(vec3(.22,.02,.9),vec3(1.0,.55,1.0),plasma+ring);
              gl_FragColor=vec4(color*alpha,alpha);
            }
          `}
          uniforms={{ uTime: { value: 0 }, uEnergy: { value: 1 } }}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          transparent
        />
      </mesh>
    </group>
  );
}

function AccretionDisk({ activity }: { activity: AiActivity }) {
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const { positions, seeds } = useMemo(() => {
    const random = seededRandom(7719);
    const count = 1800;
    const positionData = new Float32Array(count * 3);
    const seedData = new Float32Array(count);
    for (let index = 0; index < count; index += 1) {
      const radius = 0.52 + Math.pow(random(), 1.65) * 2.15;
      const angle = random() * Math.PI * 2;
      positionData[index * 3] = Math.cos(angle) * radius;
      positionData[index * 3 + 1] = Math.sin(angle) * radius;
      positionData[index * 3 + 2] = (random() - 0.5) * (0.035 + radius * 0.075);
      seedData[index] = random();
    }
    return { positions: positionData, seeds: seedData };
  }, []);

  useFrame(({ clock }) => {
    if (material.current) {
      material.current.uniforms.uTime.value = clock.elapsedTime;
      material.current.uniforms.uSpeed.value = activitySpeed(activity);
      material.current.uniforms.uEnergy.value = activityEnergy(activity);
    }
  });

  return (
    <points ref={points} rotation={[1.14, 0.18, -0.28]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={`
          uniform float uTime; uniform float uSpeed; attribute float aSeed; varying float vSeed;
          void main(){
            vSeed=aSeed; float r=length(position.xy); float a=atan(position.y,position.x)+uTime*(.12+.34/(r*r))*uSpeed;
            vec3 p=vec3(cos(a)*r,sin(a)*r,position.z+sin(uTime*2.0+aSeed*12.0)*.018);
            vec4 mv=modelViewMatrix*vec4(p,1.0); gl_PointSize=(2.0+aSeed*2.8)*(7.0/-mv.z); gl_Position=projectionMatrix*mv;
          }
        `}
        fragmentShader={`
          uniform float uEnergy; varying float vSeed;
          void main(){float d=length(gl_PointCoord-.5); float a=smoothstep(.5,.0,d); vec3 c=mix(vec3(.18,.02,.95),vec3(1.0,.7,1.0),vSeed); gl_FragColor=vec4(c*uEnergy,a*(.28+vSeed*.65));}
        `}
        uniforms={{ uTime: { value: 0 }, uSpeed: { value: 1 }, uEnergy: { value: 1 } }}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        transparent
      />
    </points>
  );
}

function QuantumBranches({ activity }: { activity: AiActivity }) {
  const root = useRef<THREE.Group>(null);
  const geometry = useMemo(() => {
    const random = seededRandom(818);
    const paths: THREE.Vector3[][] = [];
    for (let branch = 0; branch < 16; branch += 1) {
      const baseAngle = branch / 16 * Math.PI * 2;
      const points: THREE.Vector3[] = [];
      for (let index = 0; index <= 42; index += 1) {
        const t = index / 42;
        const split = t > 0.55 ? (branch % 3 - 1) * (t - 0.55) * 0.72 : 0;
        const radius = 0.48 + t * (1.8 + random() * 0.35);
        points.push(new THREE.Vector3(
          Math.cos(baseAngle + split) * radius,
          Math.sin(baseAngle + split) * radius * 0.82,
          -0.4 - t * 0.95 + Math.sin(t * Math.PI * 2 + branch) * 0.16,
        ));
      }
      paths.push(points);
    }
    return pathGeometry(paths);
  }, []);
  useFrame(({ clock }, delta) => {
    if (!root.current) return;
    root.current.rotation.z -= delta * 0.025 * activitySpeed(activity);
    root.current.scale.setScalar(0.94 + activityEnergy(activity) * 0.08 + Math.sin(clock.elapsedTime * 0.7) * 0.015);
  });
  return (
    <group ref={root} rotation={[0.14, -0.2, 0]}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color={MAGENTA} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.3} toneMapped={false} transparent />
      </lineSegments>
    </group>
  );
}

function CrystalProbabilityField({ activity }: { activity: AiActivity }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const shards = useMemo(() => {
    const random = seededRandom(514);
    return Array.from({ length: 46 }, (_, index) => {
      const angle = index / 46 * Math.PI * 2 + random() * 0.28;
      const radius = 1.1 + random() * 2.05;
      return {
        angle,
        radius,
        yScale: 0.11 + random() * 0.36,
        phase: random() * Math.PI * 2,
        z: -0.35 + (random() - 0.5) * 2.4,
      };
    });
  }, []);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const time = clock.elapsedTime;
    const collapse = activity === "thinking" ? 0.82 + Math.pow(Math.abs(Math.sin(time * 0.72)), 8) * 0.3 : 1;
    shards.forEach((shard, index) => {
      const angle = shard.angle + time * 0.035 * activitySpeed(activity) * (index % 2 ? 1 : -1);
      const radius = shard.radius * collapse;
      dummy.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.72, shard.z + Math.sin(time * 0.6 + shard.phase) * 0.12);
      dummy.rotation.set(shard.phase + time * 0.18, angle, time * 0.24 + shard.phase);
      dummy.scale.set(0.075, shard.yScale, 0.075);
      dummy.updateMatrix();
      mesh.current?.setMatrixAt(index, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, shards.length]}>
      <tetrahedronGeometry args={[1, 0]} />
      <meshPhysicalMaterial color="#7a42ff" emissive={VIOLET} emissiveIntensity={0.72} metalness={0.08} roughness={0.08} transmission={0.38} transparent opacity={0.76} />
    </instancedMesh>
  );
}

function GravitationalLensing({ activity }: { activity: AiActivity }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  useFrame(({ clock }) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = clock.elapsedTime;
    material.current.uniforms.uEnergy.value = activityEnergy(activity);
  });
  return (
    <mesh position={[0, 0, -1.55]} scale={[5.1, 4.0, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={material}
        vertexShader={`varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`}
        fragmentShader={`
          uniform float uTime; uniform float uEnergy; varying vec2 vUv;
          void main(){
            vec2 p=(vUv-.5)*2.0; p.x*=1.18; float r=length(p); float a=atan(p.y,p.x);
            float lens=smoothstep(.018,.0,abs(r-(.28+.025*sin(a*5.0+uTime*.35))));
            float prism=smoothstep(.025,.0,abs(r-(.48+.035*sin(a*3.0-uTime*.22))));
            vec3 color=vec3(lens*.2+prism*.55,lens*.05+prism*.12,lens+prism);
            gl_FragColor=vec4(color*uEnergy,(lens+prism)*.3*uEnergy);
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

function PolarJets({ activity }: { activity: AiActivity }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.scale.y = 0.82 + activityEnergy(activity) * 0.28 + Math.sin(clock.elapsedTime * 4) * 0.04;
  });
  return (
    <group ref={group} rotation={[0.12, 0.18, -0.28]}>
      <mesh position={[0, 1.72, -0.2]}>
        <coneGeometry args={[0.08, 2.8, 18, 1, true]} />
        <meshBasicMaterial color={ICE} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.16} side={THREE.DoubleSide} toneMapped={false} transparent />
      </mesh>
      <mesh position={[0, -1.72, -0.2]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.08, 2.8, 18, 1, true]} />
        <meshBasicMaterial color={MAGENTA} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.12} side={THREE.DoubleSide} toneMapped={false} transparent />
      </mesh>
    </group>
  );
}

export function PowerScene({ activity = "idle" }: { activity?: AiActivity }) {
  return (
    <group name="quantum-singularity-intelligence" scale={0.94}>
      <GravitationalLensing activity={activity} />
      <QuantumBranches activity={activity} />
      <CrystalProbabilityField activity={activity} />
      <PolarJets activity={activity} />
      <AccretionDisk activity={activity} />
      <Singularity activity={activity} />
    </group>
  );
}
