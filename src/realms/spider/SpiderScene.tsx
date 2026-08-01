import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AiActivity } from "../../App";
import { activityEnergy, activityPulse, activitySpeed, seededRandom } from "../shared/coreMotion";

const RED = "#ff183b";
const HOT_RED = "#ff5870";
const WHITE = "#ffffff";

// --- EYE SHAPE GENERATOR ---
function createEyeShape(mirror = 1) {
  const shape = new THREE.Shape();
  shape.moveTo(0.06 * mirror, 0.62);
  shape.quadraticCurveTo(0.5 * mirror, 0.48, 0.58 * mirror, -0.58);
  shape.quadraticCurveTo(0.22 * mirror, -0.4, 0.06 * mirror, 0.62);
  shape.closePath();
  return shape;
}

// 1. Mechanical Predator Shutter Eyes (Iron Spider Tactical Eyes)
function MechanicalPredatorShutterEyes({ activity }: { activity: AiActivity }) {
  const rootRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);

  const leftShape = useMemo(() => createEyeShape(-1), []);
  const rightShape = useMemo(() => createEyeShape(1), []);

  const leftGeom = useMemo(() => new THREE.ShapeGeometry(leftShape, 16), [leftShape]);
  const rightGeom = useMemo(() => new THREE.ShapeGeometry(rightShape, 16), [rightShape]);

  const frameExtrudeSettings = useMemo(
    () => ({ depth: 0.08, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02 }),
    []
  );

  const leftFrameGeom = useMemo(() => new THREE.ExtrudeGeometry(leftShape, frameExtrudeSettings), [leftShape, frameExtrudeSettings]);
  const rightFrameGeom = useMemo(() => new THREE.ExtrudeGeometry(rightShape, frameExtrudeSettings), [rightShape, frameExtrudeSettings]);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    if (rootRef.current) {
      rootRef.current.scale.setScalar(activityPulse(activity, time, 0.4));
    }

    // Dynamic aperture iris shutter opening/closing
    const apertureY = activity === "listening" ? 0.68 : activity === "thinking" ? 0.88 : activity === "speaking" ? 1.05 : 0.92;
    if (leftEyeRef.current) {
      leftEyeRef.current.scale.y = apertureY + Math.sin(time * 2.5) * 0.03;
    }
    if (rightEyeRef.current) {
      rightEyeRef.current.scale.y = apertureY + Math.cos(time * 2.5) * 0.03;
    }
  });

  return (
    <group ref={rootRef} position={[0, 0.12, 0.42]}>
      {/* 3D Metallic Red Eye Outer Frames */}
      <mesh position={[-0.43, 0, 0.02]} scale={[1.14, 1.14, 1]} geometry={leftFrameGeom}>
        <meshStandardMaterial color="#3a0009" emissive={RED} emissiveIntensity={0.8} metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0.43, 0, 0.02]} scale={[1.14, 1.14, 1]} geometry={rightFrameGeom}>
        <meshStandardMaterial color="#3a0009" emissive={RED} emissiveIntensity={0.8} metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Glowing Tactical White Shutter Inner Eyes */}
      <mesh ref={leftEyeRef} position={[-0.43, 0, 0.08]} geometry={leftGeom}>
        <meshBasicMaterial color={WHITE} toneMapped={false} />
      </mesh>
      <mesh ref={rightEyeRef} position={[0.43, 0, 0.08]} geometry={rightGeom}>
        <meshBasicMaterial color={WHITE} toneMapped={false} />
      </mesh>

      <pointLight color={WHITE} intensity={2.5} distance={3.5} position={[0, 0, 0.5]} />
    </group>
  );
}

// 2. Extruded 3D Mechanical Spider Legs (8 Jointed Metallic Legs - Waldoors)
function Extruded3DSpiderLegs({ activity }: { activity: AiActivity }) {
  const rootRef = useRef<THREE.Group>(null);

  const legs = useMemo(() => {
    return Array.from({ length: 8 }, (_, index) => {
      const side = index < 4 ? -1 : 1;
      const lane = index % 4;
      const angle = side * (0.45 + lane * 0.28);
      return { side, lane, angle };
    });
  }, []);

  useFrame(({ clock }) => {
    if (!rootRef.current) return;
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);

    // Breathing kinematics animation
    rootRef.current.rotation.z = Math.sin(time * 0.8 * speed) * 0.04;
    rootRef.current.scale.setScalar(0.96 + activityEnergy(activity) * 0.06);
  });

  return (
    <group ref={rootRef} position={[0, 0, -0.15]}>
      {legs.map((leg, idx) => {
        const { side, lane } = leg;
        const startX = side * (0.5 + lane * 0.06);
        const startY = 0.4 - lane * 0.25;

        const jointAX = side * (1.2 + lane * 0.15);
        const jointAY = 0.8 - lane * 0.35;

        const jointBX = side * (1.8 + lane * 0.22);
        const jointBY = 0.4 - lane * 0.48;

        const tipX = side * (2.4 + lane * 0.18);
        const tipY = 0.1 - lane * 0.55;

        return (
          <group key={idx}>
            {/* Segment 1 */}
            <mesh position={[(startX + jointAX) / 2, (startY + jointAY) / 2, -0.2]}>
              <boxGeometry args={[Math.abs(jointAX - startX), 0.08, 0.08]} />
              <meshStandardMaterial color="#2a040b" emissive={RED} emissiveIntensity={0.6} metalness={0.88} roughness={0.25} />
            </mesh>

            {/* Joint Sphere A */}
            <mesh position={[jointAX, jointAY, -0.2]}>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshBasicMaterial color={WHITE} toneMapped={false} />
            </mesh>

            {/* Segment 2 */}
            <mesh position={[(jointAX + jointBX) / 2, (jointAY + jointBY) / 2, -0.3]}>
              <boxGeometry args={[Math.abs(jointBX - jointAX), 0.06, 0.06]} />
              <meshStandardMaterial color="#2a040b" emissive={HOT_RED} emissiveIntensity={0.5} metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Joint Sphere B */}
            <mesh position={[jointBX, jointBY, -0.3]}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshBasicMaterial color={RED} toneMapped={false} />
            </mesh>

            {/* Segment 3 Tip */}
            <mesh position={[(jointBX + tipX) / 2, (jointBY + tipY) / 2, -0.4]}>
              <boxGeometry args={[Math.abs(tipX - jointBX), 0.04, 0.04]} />
              <meshStandardMaterial color="#120004" emissive={RED} emissiveIntensity={0.8} metalness={0.95} roughness={0.15} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// 3. Tactical Holographic Web Radar (Mạng Nhện Radar Tác Chiến)
function TacticalHolographicWebRadar({ activity }: { activity: AiActivity }) {
  const webRef = useRef<THREE.Group>(null);
  const laserMaterialRef = useRef<THREE.ShaderMaterial>(null);

  const { points } = useMemo(() => {
    const random = seededRandom(2099);
    const posList: THREE.Vector3[] = [];
    for (let i = 0; i < 64; i++) {
      posList.push(
        new THREE.Vector3((random() - 0.5) * 5.2, (random() - 0.5) * 4.0, -0.8 - random() * 1.5)
      );
    }
    return { points: posList };
  }, []);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    if (webRef.current) {
      webRef.current.rotation.y = Math.sin(time * 0.18) * 0.08;
    }
    if (laserMaterialRef.current) {
      laserMaterialRef.current.uniforms.uTime.value = time;
      laserMaterialRef.current.uniforms.uEnergy.value = activityEnergy(activity);
    }
  });

  return (
    <group ref={webRef}>
      {/* Target Reticle Concentric Circles */}
      {[1.2, 2.2, 3.2].map((r, idx) => (
        <mesh key={idx} position={[0, 0, -0.5]} rotation={[0, 0, idx * 0.5]}>
          <ringGeometry args={[r, r + 0.015, 64]} />
          <meshBasicMaterial color={RED} blending={THREE.AdditiveBlending} opacity={0.35} transparent toneMapped={false} />
        </mesh>
      ))}

      {/* Holographic Radar Nodes */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(points.flatMap((p) => [p.x, p.y, p.z])), 3]}
          />
        </bufferGeometry>
        <pointsMaterial color={WHITE} blending={THREE.AdditiveBlending} opacity={0.65} size={0.035} sizeAttenuation transparent toneMapped={false} />
      </points>

      {/* Floor Tactical Laser Grid Plane */}
      <mesh position={[0, -1.55, -0.4]} rotation={[-Math.PI / 2.6, 0, 0]} scale={[6.2, 5.6, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          ref={laserMaterialRef}
          vertexShader={`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`}
          fragmentShader={`
            uniform float uTime; uniform float uEnergy; varying vec2 vUv;
            void main(){
              vec2 p = vUv;
              float gx = smoothstep(0.035, 0.0, abs(fract(p.x * 18.0) - 0.5));
              float gy = smoothstep(0.035, 0.0, abs(fract((p.y + uTime * 0.05) * 14.0) - 0.5));
              float fade = smoothstep(0.0, 0.25, p.y) * (1.0 - smoothstep(0.75, 1.0, p.y));
              float scan = smoothstep(0.04, 0.0, abs(p.y - fract(uTime * 0.18)));
              float alpha = (gx + gy) * 0.14 * fade + scan * 0.35;
              gl_FragColor = vec4(vec3(1.0, 0.094, 0.235) * uEnergy, alpha * uEnergy);
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

// 4. Cyber Cranium Inner Core (12-sided Dodecahedron Cyber Skull Chassis)
function CyberCraniumInnerCore({ activity }: { activity: AiActivity }) {
  const shellRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    if (shellRef.current) {
      shellRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.3) * 0.12;
      shellRef.current.rotation.z += delta * 0.015 * activitySpeed(activity);
    }
  });

  return (
    <group position={[0, 0.04, -0.18]}>
      {/* Dark Armor Dodecahedron Chassis */}
      <mesh scale={[1.16, 1.42, 0.72]}>
        <dodecahedronGeometry args={[1.02, 1]} />
        <meshStandardMaterial color="#080204" emissive="#200008" emissiveIntensity={0.4} metalness={0.88} roughness={0.25} />
      </mesh>

      {/* Red Emissive Wireframe Shell */}
      <mesh ref={shellRef} scale={[1.22, 1.5, 0.78]}>
        <dodecahedronGeometry args={[1.02, 1]} />
        <meshBasicMaterial color={RED} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.3} toneMapped={false} transparent wireframe />
      </mesh>
    </group>
  );
}

// --- MAIN SPIDER SCENE ---
export function SpiderScene({ activity = "idle" }: { activity?: AiActivity }) {
  return (
    <group name="iron-spider-tactical-hud" scale={0.92}>
      <ambientLight intensity={0.5} color={RED} />

      {/* 1. Tactical Holographic Web Radar & Laser Grid */}
      <TacticalHolographicWebRadar activity={activity} />

      {/* 2. 8 Extruded 3D Mechanical Spider Legs */}
      <Extruded3DSpiderLegs activity={activity} />

      {/* 3. Cyber Cranium Inner Core */}
      <CyberCraniumInnerCore activity={activity} />

      {/* 4. Mechanical Predator Shutter Eyes */}
      <MechanicalPredatorShutterEyes activity={activity} />
    </group>
  );
}
