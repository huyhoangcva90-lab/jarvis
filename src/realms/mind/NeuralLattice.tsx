import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState, useEffect } from "react";
import type { AiActivity } from "../../types/orb";
import type { LegacyOrbPalette } from "./MindScene";

// Colors (Gold Palette)
const WHITE_HOT = new THREE.Color("#fff8d6");
const COPPER_GLOW = new THREE.Color("#d65f10");

const LATTICE_COLORS: Record<LegacyOrbPalette, [string, string]> = {
  gold: ["#fff8d6", "#d65f10"],
  green: ["#f5fff6", "#18bd58"],
  violet: ["#fff6ff", "#7f35ff"],
  orange: ["#fff5de", "#ed5f12"],
};

function seededRandom(seed: number) {
  return () => {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function activityEnergy(activity: AiActivity) {
  if (activity === "speaking") return 1.52;
  if (activity === "thinking") return 1.28;
  if (activity === "listening") return 0.82;
  return 1;
}

function activitySpeed(activity: AiActivity) {
  if (activity === "speaking") return 1.85;
  if (activity === "thinking") return 1.42;
  if (activity === "listening") return 0.46;
  return 1;
}

const lineShader = {
  uniforms: {
    uTime: { value: 0 },
    uEnergy: { value: 1 },
    uOpacity: { value: 1 },
    uColor: { value: WHITE_HOT }
  },
  vertexShader: `
    attribute float aPhase;
    attribute float aIntensity;
    varying float vFront;
    varying float vPhase;
    varying float vIntensity;
    void main() {
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mv;
      vFront = smoothstep(-9.4, -5.2, mv.z);
      vPhase = aPhase;
      vIntensity = aIntensity;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uEnergy;
    uniform float uOpacity;
    uniform vec3 uColor;
    varying float vFront;
    varying float vPhase;
    varying float vIntensity;
    void main() {
      float pulse = pow(0.5 + 0.5 * sin(uTime * (1.1 + vIntensity * 2.4) + vPhase), 3.0);
      float packet = smoothstep(0.89, 1.0, sin(vPhase * 8.0 - uTime * 2.6));
      float alpha = uOpacity * (0.18 + vIntensity * 0.46 + packet * 0.44) * mix(0.18, 1.0, vFront);
      alpha *= mix(0.72, 1.18, pulse) * uEnergy;
      gl_FragColor = vec4(uColor, alpha);
    }
  `
};

function makeLineShader() {
  return {
    uniforms: THREE.UniformsUtils.clone(lineShader.uniforms),
    vertexShader: lineShader.vertexShader,
    fragmentShader: lineShader.fragmentShader
  };
}

function buildCoreSpokeGeometry() {
  const random = seededRandom(60879);
  const positions: number[] = [];
  const phases: number[] = [];
  const intensities: number[] = [];
  for (let index = 0; index < 42; index += 1) {
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    const direction = new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.cos(phi),
      Math.sin(phi) * Math.sin(theta)
    );
    const inner = 0.24 + random() * 0.32;
    const outer = 1.04 + random() * (index % 5 === 0 ? 1.34 : 0.82);
    const start = direction.clone().multiplyScalar(inner);
    const end = direction.clone().multiplyScalar(outer);
    positions.push(start.x, start.y, start.z, end.x, end.y, end.z);
    phases.push(random() * 6.28, random() * 6.28);
    intensities.push(0.35 + random() * 0.65, 0.35 + random() * 0.65);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("aPhase", new THREE.Float32BufferAttribute(phases, 1));
  geometry.setAttribute("aIntensity", new THREE.Float32BufferAttribute(intensities, 1));
  return geometry;
}

function CoreSpokes({ activity, flashRef }: { activity: AiActivity, flashRef: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(buildCoreSpokeGeometry, []);
  const shader = useMemo(makeLineShader, []);

  useFrame(({ clock }, delta) => {
    const energy = activityEnergy(activity) * (1 + flashRef.current * 2.0);
    if (material.current) {
      material.current.uniforms.uTime.value = clock.elapsedTime;
      material.current.uniforms.uEnergy.value = energy * (activity === "speaking" ? 1.22 : 1);
      material.current.uniforms.uOpacity.value = activity === "speaking" ? 0.82 : 0.7;
      material.current.uniforms.uColor.value.copy(WHITE_HOT);
    }
    if (group.current) {
      group.current.rotation.y += delta * 0.055 * activitySpeed(activity);
      group.current.rotation.x = Math.sin(clock.elapsedTime * 0.18) * 0.05;
      group.current.scale.setScalar(1 + flashRef.current * 0.2);
    }
  });

  return (
    <group ref={group}>
      <lineSegments geometry={geometry}>
        <shaderMaterial
          ref={material}
          args={[shader]}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
          transparent
        />
      </lineSegments>
    </group>
  );
}

function TriangularMindCage({ activity, flashRef }: { activity: AiActivity, flashRef: React.MutableRefObject<number> }) {
  const outer = useRef<THREE.LineSegments>(null);
  const inner = useRef<THREE.LineSegments>(null);
  const outerMaterial = useRef<THREE.LineBasicMaterial>(null);
  const innerMaterial = useRef<THREE.LineBasicMaterial>(null);
  const geometry = useMemo(() => {
    const source = new THREE.IcosahedronGeometry(2.02, 2);
    const wireframe = new THREE.WireframeGeometry(source);
    source.dispose();
    return wireframe;
  }, []);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const speed = activitySpeed(activity);
    const energy = activityEnergy(activity);
    const speakingPulse = activity === "speaking" ? Math.sin(t * 7.2) * 0.035 : 0;
    const thinkingPulse = activity === "thinking" ? Math.sin(t * 3.4) * 0.018 : 0;
    const scale = 1 + speakingPulse + thinkingPulse + flashRef.current * 0.075;

    if (outer.current) {
      outer.current.rotation.x += delta * 0.035 * speed;
      outer.current.rotation.y += delta * 0.052 * speed;
      outer.current.rotation.z -= delta * 0.018 * speed;
      outer.current.scale.setScalar(scale);
    }
    if (inner.current) {
      inner.current.rotation.x -= delta * 0.026 * speed;
      inner.current.rotation.y -= delta * 0.041 * speed;
      inner.current.rotation.z += delta * 0.023 * speed;
      inner.current.scale.setScalar(0.91 - speakingPulse * 0.42 + flashRef.current * 0.035);
    }
    if (outerMaterial.current) {
      outerMaterial.current.opacity = 0.2 + energy * 0.13 + flashRef.current * 0.24;
    }
    if (innerMaterial.current) {
      innerMaterial.current.opacity = 0.08 + energy * 0.075 + flashRef.current * 0.12;
    }
  });

  return (
    <group rotation={[0.08, -0.18, 0.06]}>
      <lineSegments ref={outer} geometry={geometry}>
        <lineBasicMaterial
          ref={outerMaterial}
          blending={THREE.AdditiveBlending}
          color={WHITE_HOT}
          depthWrite={false}
          opacity={0.34}
          toneMapped={false}
          transparent
        />
      </lineSegments>
      <lineSegments ref={inner} geometry={geometry}>
        <lineBasicMaterial
          ref={innerMaterial}
          blending={THREE.AdditiveBlending}
          color={COPPER_GLOW}
          depthWrite={false}
          opacity={0.15}
          toneMapped={false}
          transparent
        />
      </lineSegments>
    </group>
  );
}

export function NeuralLattice({ activity, palette = "gold" }: { activity: AiActivity; palette?: LegacyOrbPalette }) {
  const [white, copper] = LATTICE_COLORS[palette];
  WHITE_HOT.set(white);
  COPPER_GLOW.set(copper);
  const [flash, setFlash] = useState(0);
  const flashRef = useRef(0);

  useEffect(() => {
    let timer: any;
    const triggerFlash = () => {
      setFlash(1);
      setTimeout(() => setFlash(0), 100);
      const nextTime = 500 + Math.random() * 2500;
      if (activity === 'thinking') {
        timer = setTimeout(triggerFlash, nextTime * 0.5);
      } else {
        timer = setTimeout(triggerFlash, nextTime);
      }
    };
    timer = setTimeout(triggerFlash, 1000);
    return () => clearTimeout(timer);
  }, [activity]);

  useFrame((_, delta) => {
    flashRef.current = THREE.MathUtils.lerp(flashRef.current, flash, delta * 8);
  });

  return (
    <group scale={[1.3, 0.8, 1.1]} position={[0.1, -0.05, 0]} rotation={[0.2, 0.1, -0.1]}>
      <CoreSpokes activity={activity} flashRef={flashRef} />
      <TriangularMindCage activity={activity} flashRef={flashRef} />
    </group>
  );
}
