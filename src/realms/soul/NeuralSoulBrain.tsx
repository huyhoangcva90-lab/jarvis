import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type SoulActivity = 'idle' | 'listening' | 'thinking' | 'speaking';

interface NeuralSoulBrainProps {
  activity?: SoulActivity;
}

const NODE_COUNT = 620;
const PULSE_COUNT = 48;

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function createBrainNetwork() {
  const random = seededRandom(0x50a17);
  const nodes = new Float32Array(NODE_COUNT * 3);
  const hemispheres = new Int8Array(NODE_COUNT);

  for (let i = 0; i < NODE_COUNT; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const theta = random() * Math.PI * 2;
    const zUnit = random() * 2 - 1;
    const radial = Math.sqrt(1 - zUnit * zUnit);
    const nx = Math.abs(radial * Math.cos(theta));
    const ny = radial * Math.sin(theta);
    const nz = zUnit;
    const fold = 1 + 0.09 * Math.sin(theta * 7 + zUnit * 9) + 0.045 * Math.sin(theta * 13 - zUnit * 5);
    const lobe = 1 - Math.max(0, -nz) * 0.08 + Math.max(0, nz) * 0.04;

    nodes[i * 3] = side * (0.16 + nx * 1.36 * fold);
    nodes[i * 3 + 1] = ny * 1.06 * fold - 0.02 - Math.max(0, -nz) * 0.1;
    nodes[i * 3 + 2] = nz * 1.18 * lobe * fold;
    hemispheres[i] = side;
  }

  const connectionPairs: number[] = [];
  const pulsePairs: number[] = [];

  for (let i = 0; i < NODE_COUNT; i++) {
    for (let link = 0; link < 2; link++) {
      let best = -1;
      let bestDistance = Number.POSITIVE_INFINITY;

      for (let candidate = 0; candidate < 10; candidate++) {
        const j = Math.floor(random() * NODE_COUNT);
        if (j === i || hemispheres[j] !== hemispheres[i]) continue;
        const dx = nodes[i * 3] - nodes[j * 3];
        const dy = nodes[i * 3 + 1] - nodes[j * 3 + 1];
        const dz = nodes[i * 3 + 2] - nodes[j * 3 + 2];
        const distance = dx * dx + dy * dy + dz * dz;
        if (distance < bestDistance) {
          bestDistance = distance;
          best = j;
        }
      }

      if (best >= 0 && bestDistance < 0.42) connectionPairs.push(i, best);
    }
  }

  for (let i = 0; i < NODE_COUNT; i += 20) {
    const opposite = i % 2 === 0 ? Math.min(i + 1, NODE_COUNT - 1) : i - 1;
    connectionPairs.push(i, opposite);
  }

  const linePositions = new Float32Array(connectionPairs.length * 3);
  for (let i = 0; i < connectionPairs.length; i++) {
    const nodeIndex = connectionPairs[i];
    linePositions[i * 3] = nodes[nodeIndex * 3];
    linePositions[i * 3 + 1] = nodes[nodeIndex * 3 + 1];
    linePositions[i * 3 + 2] = nodes[nodeIndex * 3 + 2];
  }

  for (let i = 0; i < PULSE_COUNT; i++) {
    const pair = Math.floor(random() * (connectionPairs.length / 2)) * 2;
    pulsePairs.push(connectionPairs[pair], connectionPairs[pair + 1]);
  }

  return {
    nodes,
    linePositions,
    pulsePairs: new Uint16Array(pulsePairs),
    pulseOffsets: Float32Array.from({ length: PULSE_COUNT }, () => random()),
  };
}

function BrainShell() {
  return (
    <group>
      {([-1, 1] as const).map((side) => (
        <mesh key={side} position={[side * 0.65, -0.02, 0]} scale={[0.88, 1.06, 1.16]}>
          <icosahedronGeometry args={[1, 2]} />
          <meshBasicMaterial
            color="#0788ad"
            wireframe
            transparent
            opacity={0.075}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export const NeuralSoulBrain: React.FC<NeuralSoulBrainProps> = ({ activity = 'idle' }) => {
  const brainRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const coreMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const lineMaterialRef = useRef<THREE.LineBasicMaterial>(null);
  const nodeMaterialRef = useRef<THREE.PointsMaterial>(null);
  const pulseGeometryRef = useRef<THREE.BufferGeometry>(null);
  const neuralData = useMemo(createBrainNetwork, []);
  const pulsePositions = useMemo(() => new Float32Array(PULSE_COUNT * 3), []);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const speed = activity === 'thinking' ? 1.75 : activity === 'speaking' ? 2.35 : activity === 'listening' ? 0.62 : 0.9;
    const energy = activity === 'thinking' ? 1 : activity === 'speaking' ? 0.82 : activity === 'listening' ? 0.45 : 0.28;

    if (brainRef.current) {
      brainRef.current.rotation.y += delta * 0.055 * speed;
      brainRef.current.rotation.x = -0.08 + Math.sin(t * 0.23) * 0.025;
      brainRef.current.position.y = Math.sin(t * 0.48) * 0.045;
    }

    if (coreRef.current) {
      const pulse = 0.83 + energy * 0.16 + Math.sin(t * 3.2 * speed) * (0.035 + energy * 0.04);
      coreRef.current.scale.setScalar(pulse);
      coreRef.current.rotation.x += delta * 0.3 * speed;
      coreRef.current.rotation.y -= delta * 0.45 * speed;
    }

    if (coreMaterialRef.current) {
      coreMaterialRef.current.opacity = 0.74 + energy * 0.2 + Math.sin(t * 4.2) * 0.04;
    }
    if (lineMaterialRef.current) {
      lineMaterialRef.current.opacity = 0.13 + energy * 0.19 + Math.sin(t * 1.7) * 0.025;
    }
    if (nodeMaterialRef.current) {
      nodeMaterialRef.current.opacity = 0.52 + energy * 0.33;
      nodeMaterialRef.current.size = 0.022 + energy * 0.009;
    }

    const direction = activity === 'speaking' ? -1 : 1;
    for (let i = 0; i < PULSE_COUNT; i++) {
      const start = neuralData.pulsePairs[i * 2];
      const end = neuralData.pulsePairs[i * 2 + 1];
      let progress = (neuralData.pulseOffsets[i] + t * 0.13 * speed * direction) % 1;
      if (progress < 0) progress += 1;
      const inverse = 1 - progress;
      pulsePositions[i * 3] = neuralData.nodes[start * 3] * inverse + neuralData.nodes[end * 3] * progress;
      pulsePositions[i * 3 + 1] = neuralData.nodes[start * 3 + 1] * inverse + neuralData.nodes[end * 3 + 1] * progress;
      pulsePositions[i * 3 + 2] = neuralData.nodes[start * 3 + 2] * inverse + neuralData.nodes[end * 3 + 2] * progress;
    }

    const pulseAttribute = pulseGeometryRef.current?.getAttribute('position') as THREE.BufferAttribute | undefined;
    if (pulseAttribute) pulseAttribute.needsUpdate = true;
  });

  return (
    <group ref={brainRef} scale={1.42}>
      <BrainShell />

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[neuralData.linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={lineMaterialRef}
          color="#17c8f4"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </lineSegments>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[neuralData.nodes, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={nodeMaterialRef}
          color="#8eeaff"
          size={0.026}
          transparent
          opacity={0.72}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
          toneMapped={false}
        />
      </points>

      <points>
        <bufferGeometry ref={pulseGeometryRef}>
          <bufferAttribute attach="attributes-position" args={[pulsePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#ffd08a"
          size={0.075}
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
          toneMapped={false}
        />
      </points>

      <mesh ref={coreRef} scale={0.9}>
        <icosahedronGeometry args={[0.36, 2]} />
        <meshBasicMaterial
          ref={coreMaterialRef}
          color="#ff8a25"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.012, 6, 72]} />
        <meshBasicMaterial color="#ffc06b" transparent opacity={0.42} toneMapped={false} />
      </mesh>
      <mesh rotation={[0.35, 0.1, Math.PI / 2]}>
        <torusGeometry args={[0.47, 0.009, 6, 72]} />
        <meshBasicMaterial color="#16bde8" transparent opacity={0.28} toneMapped={false} />
      </mesh>

      <group position={[0, -1.08, -0.04]}>
        <mesh scale={[0.22, 0.62, 0.25]}>
          <icosahedronGeometry args={[0.62, 1]} />
          <meshBasicMaterial color="#0ea5c6" wireframe transparent opacity={0.2} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
};
