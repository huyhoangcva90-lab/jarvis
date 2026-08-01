import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AiActivity } from "../../App";
import { activityEnergy, activityPulse, activitySpeed, seededRandom, segmentGeometry } from "../shared/coreMotion";

const RED = "#ff183b";
const HOT_RED = "#ff5870";
const WHITE = "#ffffff";

function eyeShape(mirror = 1) {
  const shape = new THREE.Shape();
  shape.moveTo(0.06 * mirror, 0.62);
  shape.bezierCurveTo(0.5 * mirror, 0.48, 0.72 * mirror, 0.08, 0.58 * mirror, -0.58);
  shape.bezierCurveTo(0.22 * mirror, -0.4, 0.04 * mirror, -0.08, 0.06 * mirror, 0.62);
  shape.closePath();
  return shape;
}

function PredatorEyes({ activity }: { activity: AiActivity }) {
  const root = useRef<THREE.Group>(null);
  const left = useRef<THREE.Mesh>(null);
  const right = useRef<THREE.Mesh>(null);
  const leftShape = useMemo(() => eyeShape(-1), []);
  const rightShape = useMemo(() => eyeShape(1), []);
  const leftGeometry = useMemo(() => new THREE.ShapeGeometry(leftShape, 12), [leftShape]);
  const rightGeometry = useMemo(() => new THREE.ShapeGeometry(rightShape, 12), [rightShape]);
  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    if (root.current) root.current.scale.setScalar(activityPulse(activity, time, 0.4));
    const aperture = activity === "listening" ? 0.68 : activity === "thinking" ? 0.84 : 1;
    if (left.current) {
      left.current.scale.y = aperture + Math.sin(time * 2.1) * 0.025;
      left.current.position.x = -0.42 - (activity === "thinking" ? Math.sin(time * 4.1) * 0.025 : 0);
    }
    if (right.current) {
      right.current.scale.y = aperture + Math.cos(time * 2.1) * 0.025;
      right.current.position.x = 0.42 + (activity === "thinking" ? Math.sin(time * 4.1) * 0.025 : 0);
    }
  });
  return (
    <group ref={root} position={[0, 0.12, 0.42]}>
      <mesh ref={left} geometry={leftGeometry}>
        <meshBasicMaterial color={WHITE} toneMapped={false} />
      </mesh>
      <mesh ref={right} geometry={rightGeometry}>
        <meshBasicMaterial color={WHITE} toneMapped={false} />
      </mesh>
      <mesh position={[-0.43, 0.12, -0.04]} scale={[1.16, 1.16, 1]} geometry={leftGeometry}>
        <meshBasicMaterial color={RED} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.42} toneMapped={false} transparent />
      </mesh>
      <mesh position={[0.43, 0.12, -0.04]} scale={[1.16, 1.16, 1]} geometry={rightGeometry}>
        <meshBasicMaterial color={RED} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.42} toneMapped={false} transparent />
      </mesh>
    </group>
  );
}

function CyberCranium({ activity }: { activity: AiActivity }) {
  const shell = useRef<THREE.Mesh>(null);
  useFrame(({ clock }, delta) => {
    if (!shell.current) return;
    shell.current.rotation.y = Math.sin(clock.elapsedTime * 0.34) * 0.12;
    shell.current.rotation.x = Math.sin(clock.elapsedTime * 0.19) * 0.055;
    shell.current.rotation.z += delta * 0.012 * activitySpeed(activity);
  });
  return (
    <group position={[0, 0.03, -0.18]}>
      <mesh scale={[1.16, 1.42, 0.72]}>
        <dodecahedronGeometry args={[1.02, 1]} />
        <meshStandardMaterial color="#030305" emissive="#120006" emissiveIntensity={0.35} metalness={0.86} roughness={0.28} />
      </mesh>
      <mesh ref={shell} scale={[1.22, 1.5, 0.78]}>
        <dodecahedronGeometry args={[1.02, 1]} />
        <meshBasicMaterial color={RED} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.26} toneMapped={false} transparent wireframe />
      </mesh>
      <mesh position={[0, -0.56, 0.34]} scale={[0.72, 0.38, 0.28]} rotation={[0.08, 0, 0]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#080204" emissive={RED} emissiveIntensity={0.28} metalness={0.9} roughness={0.25} />
      </mesh>
    </group>
  );
}

function SensorLegs({ activity }: { activity: AiActivity }) {
  const root = useRef<THREE.Group>(null);
  const geometry = useMemo(() => {
    const segments: Array<[THREE.Vector3, THREE.Vector3]> = [];
    for (let index = 0; index < 8; index += 1) {
      const side = index < 4 ? -1 : 1;
      const lane = index % 4;
      const start = new THREE.Vector3(side * (0.74 + lane * 0.08), 0.62 - lane * 0.39, -0.18);
      const jointA = new THREE.Vector3(side * (1.34 + lane * 0.18), 0.92 - lane * 0.58, -0.36 - lane * 0.08);
      const jointB = new THREE.Vector3(side * (1.92 + lane * 0.27), 0.6 - lane * 0.72, -0.7 - lane * 0.18);
      const tip = new THREE.Vector3(side * (2.58 + lane * 0.2), 0.28 - lane * 0.82, -0.9 - lane * 0.2);
      segments.push([start, jointA], [jointA, jointB], [jointB, tip]);
    }
    return segmentGeometry(segments);
  }, []);
  useFrame(({ clock }) => {
    if (!root.current) return;
    const time = clock.elapsedTime;
    root.current.scale.x = 0.96 + activityEnergy(activity) * 0.06;
    root.current.rotation.z = (activity === "thinking" ? Math.sin(time * 2.8) : Math.sin(time * 0.4)) * 0.035;
  });
  return (
    <group ref={root}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color={RED} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.78} toneMapped={false} transparent />
      </lineSegments>
      <lineSegments geometry={geometry} scale={1.035}>
        <lineBasicMaterial color="#35000a" depthWrite={false} opacity={0.72} transparent />
      </lineSegments>
    </group>
  );
}

function TacticalWeb({ activity }: { activity: AiActivity }) {
  const root = useRef<THREE.Group>(null);
  const { geometry, nodes } = useMemo(() => {
    const random = seededRandom(2099);
    const nodeList = Array.from({ length: 74 }, () => new THREE.Vector3(
      (random() - 0.5) * 5.4,
      (random() - 0.5) * 4.1,
      -0.85 - random() * 1.55,
    ));
    const segments: Array<[THREE.Vector3, THREE.Vector3]> = [];
    nodeList.forEach((node, index) => {
      let nearest = -1;
      let nearestDistance = Number.POSITIVE_INFINITY;
      for (let other = 0; other < nodeList.length; other += 1) {
        if (other === index) continue;
        const distance = node.distanceToSquared(nodeList[other]);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = other;
        }
      }
      if (nearest >= 0 && index < nearest) segments.push([node, nodeList[nearest]]);
      if (index % 5 === 0) segments.push([node, new THREE.Vector3(node.x * 0.46, node.y * 0.46, -0.62)]);
    });
    const values = new Float32Array(nodeList.length * 3);
    nodeList.forEach((node, index) => {
      values[index * 3] = node.x;
      values[index * 3 + 1] = node.y;
      values[index * 3 + 2] = node.z;
    });
    return { geometry: segmentGeometry(segments), nodes: values };
  }, []);
  useFrame(({ clock }) => {
    if (!root.current) return;
    root.current.rotation.y = Math.sin(clock.elapsedTime * 0.18) * 0.08;
    root.current.scale.setScalar(0.98 + activityEnergy(activity) * 0.028);
  });
  return (
    <group ref={root}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color={RED} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.22} toneMapped={false} transparent />
      </lineSegments>
      <points>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[nodes, 3]} /></bufferGeometry>
        <pointsMaterial color={WHITE} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.58} size={0.03} sizeAttenuation toneMapped={false} transparent />
      </points>
    </group>
  );
}

function LaserGrid({ activity }: { activity: AiActivity }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  useFrame(({ clock }) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = clock.elapsedTime;
    material.current.uniforms.uEnergy.value = activityEnergy(activity);
  });
  return (
    <mesh position={[0, -1.55, -0.4]} rotation={[-Math.PI / 2.7, 0, 0]} scale={[6.2, 5.6, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={material}
        vertexShader={`varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`}
        fragmentShader={`
          uniform float uTime; uniform float uEnergy; varying vec2 vUv;
          void main(){
            vec2 p=vUv; float gx=smoothstep(.035,.0,abs(fract(p.x*18.0)-.5));
            float gy=smoothstep(.035,.0,abs(fract((p.y+uTime*.04)*14.0)-.5));
            float fade=smoothstep(0.0,.25,p.y)*(1.0-smoothstep(.72,1.0,p.y));
            float scan=smoothstep(.045,.0,abs(p.y-fract(uTime*.16)));
            float alpha=(gx+gy)*.12*fade+scan*.3;
            gl_FragColor=vec4(vec3(1.0,.01,.06)*uEnergy,alpha*uEnergy);
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

function TargetingReticles({ activity }: { activity: AiActivity }) {
  const root = useRef<THREE.Group>(null);
  const geometry = useMemo(() => segmentGeometry([
    [new THREE.Vector3(-2.55, 1.25, -0.2), new THREE.Vector3(-2.05, 1.25, -0.2)],
    [new THREE.Vector3(-2.3, 1, -0.2), new THREE.Vector3(-2.3, 1.5, -0.2)],
    [new THREE.Vector3(1.85, -0.85, -0.1), new THREE.Vector3(2.45, -0.85, -0.1)],
    [new THREE.Vector3(2.15, -1.15, -0.1), new THREE.Vector3(2.15, -0.55, -0.1)],
  ]), []);
  useFrame(({ clock }) => {
    if (!root.current) return;
    root.current.position.x = activity === "thinking" ? Math.sin(clock.elapsedTime * 3.4) * 0.18 : 0;
    root.current.scale.setScalar(0.94 + activityEnergy(activity) * 0.06);
  });
  return (
    <group ref={root}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color={WHITE} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.62} toneMapped={false} transparent />
      </lineSegments>
    </group>
  );
}

export function SpiderScene({ activity = "idle" }: { activity?: AiActivity }) {
  return (
    <group name="spider-tactical-neural-core" scale={0.92}>
      <LaserGrid activity={activity} />
      <TacticalWeb activity={activity} />
      <TargetingReticles activity={activity} />
      <SensorLegs activity={activity} />
      <CyberCranium activity={activity} />
      <PredatorEyes activity={activity} />
      <pointLight color={HOT_RED} intensity={0.72} distance={4.8} decay={2} position={[0, 0.2, 1.2]} />
    </group>
  );
}
