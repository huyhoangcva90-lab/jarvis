import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AiActivity } from "../../App";
import { activityEnergy, activityPulse, activitySpeed, seededRandom } from "../shared/coreMotion";

const RED = "#ff183b";
const HOT_RED = "#ff5870";
const WHITE = "#ffffff";

// --- ENLARGED BOLD IRON SPIDER EYE SHAPE GENERATOR ---
function createBoldEyeShape(mirror = 1) {
  const shape = new THREE.Shape();
  // Magnified eye contour dimensions (2.4x larger, bold predator slant)
  shape.moveTo(0.14 * mirror, 1.42);
  shape.quadraticCurveTo(1.18 * mirror, 1.08, 1.38 * mirror, -1.28);
  shape.quadraticCurveTo(0.52 * mirror, -0.88, 0.14 * mirror, 1.42);
  shape.closePath();
  return shape;
}

// 1. Mechanical Predator Shutter Eyes (Iron Spider Tactical Eyes - High-Impact Scale)
function MechanicalPredatorShutterEyes({ activity }: { activity: AiActivity }) {
  const rootRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);

  const leftShape = useMemo(() => createBoldEyeShape(-1), []);
  const rightShape = useMemo(() => createBoldEyeShape(1), []);

  const leftGeom = useMemo(() => new THREE.ShapeGeometry(leftShape, 24), [leftShape]);
  const rightGeom = useMemo(() => new THREE.ShapeGeometry(rightShape, 24), [rightShape]);

  const frameExtrudeSettings = useMemo(
    () => ({ depth: 0.16, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 3 }),
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
    const apertureY = activity === "listening" ? 0.75 : activity === "thinking" ? 0.92 : activity === "speaking" ? 1.08 : 0.96;
    if (leftEyeRef.current) {
      leftEyeRef.current.scale.y = apertureY + Math.sin(time * 2.5) * 0.035;
    }
    if (rightEyeRef.current) {
      rightEyeRef.current.scale.y = apertureY + Math.cos(time * 2.5) * 0.035;
    }
  });

  return (
    <group ref={rootRef} position={[0, 0.15, 0.55]}>
      {/* 3D Metallic Red Eye Outer Armor Frames */}
      <mesh position={[-0.92, 0, 0.02]} scale={[1.18, 1.18, 1]} geometry={leftFrameGeom}>
        <meshStandardMaterial color="#3a0009" emissive={RED} emissiveIntensity={1.2} metalness={0.92} roughness={0.18} />
      </mesh>
      <mesh position={[0.92, 0, 0.02]} scale={[1.18, 1.18, 1]} geometry={rightFrameGeom}>
        <meshStandardMaterial color="#3a0009" emissive={RED} emissiveIntensity={1.2} metalness={0.92} roughness={0.18} />
      </mesh>

      {/* Glowing Tactical White Shutter Inner Eyes */}
      <mesh ref={leftEyeRef} position={[-0.92, 0, 0.14]} geometry={leftGeom}>
        <meshBasicMaterial color={WHITE} toneMapped={false} />
      </mesh>
      <mesh ref={rightEyeRef} position={[0.92, 0, 0.14]} geometry={rightGeom}>
        <meshBasicMaterial color={WHITE} toneMapped={false} />
      </mesh>

      {/* Red Specular Eye Rim Contour */}
      <mesh position={[-0.92, 0, 0.16]} scale={[1.04, 1.04, 1]} geometry={leftGeom}>
        <meshBasicMaterial color={HOT_RED} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.4} toneMapped={false} transparent />
      </mesh>
      <mesh position={[0.92, 0, 0.16]} scale={[1.04, 1.04, 1]} geometry={rightGeom}>
        <meshBasicMaterial color={HOT_RED} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.4} toneMapped={false} transparent />
      </mesh>

      <pointLight color={WHITE} intensity={4.0} distance={5.5} position={[0, 0, 0.8]} />
      <pointLight color={RED} intensity={3.0} distance={4.5} position={[0, 0, 0.4]} />
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
      return { side, lane };
    });
  }, []);

  useFrame(({ clock }) => {
    if (!rootRef.current) return;
    const time = clock.elapsedTime;
    const speed = activitySpeed(activity);

    // Breathing kinematics animation
    rootRef.current.rotation.z = Math.sin(time * 0.8 * speed) * 0.04;
    rootRef.current.scale.setScalar(0.98 + activityEnergy(activity) * 0.07);
  });

  return (
    <group ref={rootRef} position={[0, 0, -0.2]}>
      {legs.map((leg, idx) => {
        const { side, lane } = leg;
        const startX = side * (0.8 + lane * 0.1);
        const startY = 0.6 - lane * 0.35;

        const jointAX = side * (1.8 + lane * 0.22);
        const jointAY = 1.2 - lane * 0.48;

        const jointBX = side * (2.8 + lane * 0.32);
        const jointBY = 0.6 - lane * 0.68;

        const tipX = side * (3.6 + lane * 0.28);
        const tipY = 0.1 - lane * 0.82;

        return (
          <group key={idx}>
            {/* Segment 1 */}
            <mesh position={[(startX + jointAX) / 2, (startY + jointAY) / 2, -0.2]}>
              <boxGeometry args={[Math.abs(jointAX - startX), 0.12, 0.12]} />
              <meshStandardMaterial color="#2a040b" emissive={RED} emissiveIntensity={0.8} metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Joint Sphere A */}
            <mesh position={[jointAX, jointAY, -0.2]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshBasicMaterial color={WHITE} toneMapped={false} />
            </mesh>

            {/* Segment 2 */}
            <mesh position={[(jointAX + jointBX) / 2, (jointAY + jointBY) / 2, -0.3]}>
              <boxGeometry args={[Math.abs(jointBX - jointAX), 0.09, 0.09]} />
              <meshStandardMaterial color="#2a040b" emissive={HOT_RED} emissiveIntensity={0.7} metalness={0.92} roughness={0.18} />
            </mesh>

            {/* Joint Sphere B */}
            <mesh position={[jointBX, jointBY, -0.3]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshBasicMaterial color={RED} toneMapped={false} />
            </mesh>

            {/* Segment 3 Tip */}
            <mesh position={[(jointBX + tipX) / 2, (jointBY + tipY) / 2, -0.4]}>
              <boxGeometry args={[Math.abs(tipX - jointBX), 0.06, 0.06]} />
              <meshStandardMaterial color="#120004" emissive={RED} emissiveIntensity={1.0} metalness={0.95} roughness={0.12} />
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
    for (let i = 0; i < 72; i++) {
      posList.push(
        new THREE.Vector3((random() - 0.5) * 6.5, (random() - 0.5) * 5.0, -0.8 - random() * 1.8)
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
      {[1.6, 2.8, 4.2].map((r, idx) => (
        <mesh key={idx} position={[0, 0, -0.5]} rotation={[0, 0, idx * 0.5]}>
          <ringGeometry args={[r, r + 0.02, 64]} />
          <meshBasicMaterial color={RED} blending={THREE.AdditiveBlending} opacity={0.4} transparent toneMapped={false} />
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
        <pointsMaterial color={WHITE} blending={THREE.AdditiveBlending} opacity={0.75} size={0.04} sizeAttenuation transparent toneMapped={false} />
      </points>

      {/* Floor Tactical Laser Grid Plane */}
      <mesh position={[0, -2.1, -0.4]} rotation={[-Math.PI / 2.6, 0, 0]} scale={[7.8, 6.8, 1]}>
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
              float alpha = (gx + gy) * 0.16 * fade + scan * 0.4;
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
    <group position={[0, 0.05, -0.2]}>
      {/* Dark Armor Dodecahedron Chassis */}
      <mesh scale={[1.6, 1.9, 0.95]}>
        <dodecahedronGeometry args={[1.02, 1]} />
        <meshStandardMaterial color="#080204" emissive="#28000a" emissiveIntensity={0.5} metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Red Emissive Wireframe Shell */}
      <mesh ref={shellRef} scale={[1.66, 1.98, 1.02]}>
        <dodecahedronGeometry args={[1.02, 1]} />
        <meshBasicMaterial color={RED} blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.35} toneMapped={false} transparent wireframe />
      </mesh>
    </group>
  );
}

// --- MAIN SPIDER SCENE ---
export function SpiderScene({ activity = "idle" }: { activity?: AiActivity }) {
  return (
    <group name="iron-spider-tactical-hud-mcu" scale={1.28}>
      <ambientLight intensity={0.6} color={RED} />

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
