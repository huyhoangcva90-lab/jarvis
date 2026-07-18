import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { AiActivity } from "../../App";
import { seeded } from "./materials";

const PARTICLE_COUNT = 1550;

type ParticleShellProps = {
  activity: AiActivity;
};

export default function ParticleShell({ activity }: ParticleShellProps) {
  const points = useRef<THREE.Points>(null);
  const { positions, colors, sizes } = useMemo(() => {
    const positionData = new Float32Array(PARTICLE_COUNT * 3);
    const colorData = new Float32Array(PARTICLE_COUNT * 3);
    const sizeData = new Float32Array(PARTICLE_COUNT);
    const gold = new THREE.Color("#ffb83d");
    const hot = new THREE.Color("#fff2bf");
    const amber = new THREE.Color("#ff7827");

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const a = seeded(i * 2.11) * Math.PI * 2;
      const b = Math.acos(seeded(i * 3.72) * 2 - 1);
      const shellBias = seeded(i * 5.19);
      const r = shellBias > 0.62 ? 1.4 + seeded(i * 6.1) * 2.2 : seeded(i * 7.7) * 2.2;
      const clusterPull = Math.max(0, Math.sin(a * 2.8 + i * 0.006));
      const densityPocket = 0.52 + clusterPull * 0.42 + Math.sin(a * 7 + i * 0.01) * 0.08;
      positionData[i * 3] = Math.sin(b) * Math.cos(a) * r * densityPocket;
      positionData[i * 3 + 1] = Math.cos(b) * r * (0.58 + seeded(i * 1.6) * 0.24);
      positionData[i * 3 + 2] = Math.sin(b) * Math.sin(a) * r * (0.62 + clusterPull * 0.22);
      const color = shellBias > 0.93 ? hot : shellBias > 0.68 ? amber : gold;
      colorData[i * 3] = color.r;
      colorData[i * 3 + 1] = color.g;
      colorData[i * 3 + 2] = color.b;
      sizeData[i] = 0.018 + seeded(i * 8.44) * 0.045;
    }

    return { positions: positionData, colors: colorData, sizes: sizeData };
  }, []);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uActivity: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.25) }
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float uTime;
        uniform float uActivity;
        uniform float uPixelRatio;
        void main() {
          vColor = color;
          vec3 p = position;
          p.x += sin(uTime * (.18 + uActivity * .28) + position.y * 3.2) * (.035 + uActivity * .035);
          p.y += cos(uTime * (.14 + uActivity * .22) + position.x * 2.4) * (.028 + uActivity * .026);
          p.z += sin(uTime * (.16 + uActivity * .2) + position.x * 2.1) * (.035 + uActivity * .03);
          vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = size * (360.0 + uActivity * 130.0) * uPixelRatio / max(1.0, -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          vec2 uv = gl_PointCoord - vec2(.5);
          float d = length(uv);
          float alpha = smoothstep(.5, .08, d);
          gl_FragColor = vec4(vColor, alpha * (.66 + uActivity * .42));
        }
      `,
      vertexColors: true
    });
  }, []);

  useFrame(({ clock }) => {
    const target = activity === "speaking" ? 1 : activity === "thinking" ? 0.78 : activity === "listening" ? 0.5 : 0;
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uActivity.value = THREE.MathUtils.lerp(material.uniforms.uActivity.value as number, target, 0.08);
    if (points.current) {
      points.current.rotation.y = clock.elapsedTime * (0.035 + target * 0.04);
      points.current.rotation.x = Math.sin(clock.elapsedTime * 0.09) * 0.04;
    }
  });

  return (
    <points ref={points} material={material}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
    </points>
  );
}
