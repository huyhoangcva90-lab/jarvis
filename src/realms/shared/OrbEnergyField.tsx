import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import type { AiActivity } from "../../App";

type OrbEnergyFieldProps = {
  activity: AiActivity;
  color: string;
  hotColor: string;
  radius?: number;
  particleCount?: number;
  opacity?: number;
};

function seeded(index: number, salt: number) {
  return Math.abs(Math.sin(index * 127.13 + salt * 311.7) * 43758.5453) % 1;
}

const vertexShader = `
  uniform float uTime;
  uniform float uEnergy;
  varying vec3 vNormal;
  varying vec3 vViewDirection;
  varying float vFlow;

  void main() {
    vec3 transformed = position;
    float flow =
      sin(position.y * 8.0 + uTime * 1.25) *
      sin(position.x * 6.5 - uTime * 0.72) *
      sin(position.z * 7.5 + uTime * 0.48);
    transformed += normal * flow * (0.026 + uEnergy * 0.022);
    vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
    vec4 viewPosition = viewMatrix * worldPosition;
    vNormal = normalize(normalMatrix * normal);
    vViewDirection = normalize(-viewPosition.xyz);
    vFlow = flow;
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  uniform vec3 uHotColor;
  uniform float uOpacity;
  uniform float uEnergy;
  varying vec3 vNormal;
  varying vec3 vViewDirection;
  varying float vFlow;

  void main() {
    float fresnel = pow(1.0 - max(dot(vNormal, vViewDirection), 0.0), 2.35);
    float filament = smoothstep(0.42, 0.92, abs(vFlow));
    vec3 color = mix(uColor, uHotColor, filament * 0.72 + fresnel * 0.38);
    float alpha = (fresnel * 0.72 + filament * 0.2 + 0.025) * uOpacity * (0.78 + uEnergy * 0.22);
    gl_FragColor = vec4(color, alpha);
  }
`;

export function OrbEnergyField({
  activity,
  color,
  hotColor,
  radius = 2.05,
  particleCount = 260,
  opacity = 0.72,
}: OrbEnergyFieldProps) {
  const shellRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uEnergy: { value: 0.35 },
          uColor: { value: new THREE.Color(color) },
          uHotColor: { value: new THREE.Color(hotColor) },
          uOpacity: { value: opacity },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    [color, hotColor, opacity],
  );

  const particleGeometry = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let index = 0; index < particleCount; index += 1) {
      const y = seeded(index, 1) * 2 - 1;
      const angle = seeded(index, 2) * Math.PI * 2;
      const shellRadius = radius * (1.08 + seeded(index, 3) * 0.34);
      const horizontal = Math.sqrt(1 - y * y);
      positions[index * 3] = Math.cos(angle) * horizontal * shellRadius;
      positions[index * 3 + 1] = y * shellRadius;
      positions[index * 3 + 2] = Math.sin(angle) * horizontal * shellRadius;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [particleCount, radius]);

  useFrame(({ clock }, delta) => {
    const energy = activity === "speaking" ? 1 : activity === "thinking" ? 0.78 : activity === "listening" ? 0.48 : 0.3;
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uEnergy.value = THREE.MathUtils.lerp(material.uniforms.uEnergy.value, energy, 0.06);
    if (shellRef.current) {
      shellRef.current.rotation.y += delta * (0.045 + energy * 0.055);
      shellRef.current.rotation.z -= delta * 0.018;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y -= delta * (0.018 + energy * 0.032);
      particlesRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.13) * 0.08;
    }
  });

  return (
    <group name="shared-orb-energy-field">
      <mesh ref={shellRef} material={material}>
        <icosahedronGeometry args={[radius, 5]} />
      </mesh>
      <points ref={particlesRef} geometry={particleGeometry}>
        <pointsMaterial
          color={hotColor}
          size={0.026}
          opacity={0.62}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </group>
  );
}
