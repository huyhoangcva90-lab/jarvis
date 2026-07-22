import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TemporalAstrolabe } from './TemporalAstrolabe';

export interface TimeSceneProps {
  activity: 'idle' | 'listening' | 'thinking' | 'speaking';
}

function WavyTimeline({ activity }: { activity: 'idle' | 'listening' | 'thinking' | 'speaking' }) {
  const curveRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Generate curve path once
  const curve = useMemo(() => {
    const points = [];
    for (let i = -10; i <= 10; i += 0.5) {
      points.push(new THREE.Vector3(i, 0, Math.sin(i * 0.5) * 1.5));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  const tubeGeometry = useMemo(() => new THREE.TubeGeometry(curve, 100, 0.05, 8, false), [curve]);

  const tubeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#047857',
    emissive: '#10b981',
    emissiveIntensity: 0.5,
    transparent: true,
    opacity: 0.3,
    wireframe: true
  }), []);

  // Generate particles along the curve
  const particleCount = 200;
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const t = Math.random();
      const point = curve.getPoint(t);
      positions[i * 3] = point.x + (Math.random() - 0.5) * 0.5;
      positions[i * 3 + 1] = point.y + (Math.random() - 0.5) * 0.5;
      positions[i * 3 + 2] = point.z + (Math.random() - 0.5) * 0.5;
    }
    return positions;
  }, [curve]);

  const particleGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    // Add custom attribute for particle 't' position along curve to animate
    const uvs = new Float32Array(particleCount);
    for(let i=0; i<particleCount; i++) uvs[i] = Math.random();
    geo.setAttribute('uT', new THREE.BufferAttribute(uvs, 1));
    return geo;
  }, [particlePositions]);

  const particleMaterial = useMemo(() => new THREE.PointsMaterial({
    color: '#4ade80',
    size: 0.08,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  }), []);

  const timeRef = useRef(0);

  useFrame((state, delta) => {
    timeRef.current += delta;

    // Tube waveform modulation
    if (curveRef.current) {
      const positions = curveRef.current.geometry.attributes.position;
      let waveSpeed = 1;
      let waveAmp = 0.1;

      if (activity === 'speaking') {
        waveSpeed = 5;
        waveAmp = 0.5;
      } else if (activity === 'listening') {
        waveSpeed = 0.5;
        waveAmp = 0.05;
      }

      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const z = positions.getZ(i);
        // Animate Y position based on X and Time
        const yOffset = Math.sin(x * 2 - timeRef.current * waveSpeed) * waveAmp * Math.cos(z);
        positions.setY(i, yOffset);
      }
      positions.needsUpdate = true;
    }

    // Particle flow
    if (particlesRef.current) {
      let flowSpeed = 0.1;
      let pulse = 1.0;

      if (activity === 'listening') {
        flowSpeed = 0.05;
        pulse = 0.5 + Math.sin(timeRef.current * 4) * 0.5;
      } else if (activity === 'thinking') {
        flowSpeed = 0.5;
      } else if (activity === 'speaking') {
        flowSpeed = 0.2;
      }

      const positions = particlesRef.current.geometry.attributes.position;
      const uTs = particlesRef.current.geometry.attributes.uT;

      for (let i = 0; i < particleCount; i++) {
        let t = uTs.getX(i);
        t += delta * flowSpeed;
        if (t > 1) t -= 1;
        uTs.setX(i, t);

        const point = curve.getPoint(t);
        
        // Add current Y offset from the animated tube if desired, 
        // or just base curve + some noise
        let waveAmp = activity === 'speaking' ? 0.5 : 0.1;
        let waveSpeed = activity === 'speaking' ? 5 : 1;
        const waveY = Math.sin(point.x * 2 - timeRef.current * waveSpeed) * waveAmp;

        positions.setX(i, point.x);
        positions.setY(i, point.y + waveY + (Math.random() - 0.5) * 0.2);
        positions.setZ(i, point.z + (Math.random() - 0.5) * 0.2);
      }
      positions.needsUpdate = true;
      (particlesRef.current.material as THREE.PointsMaterial).opacity = 0.5 * pulse + 0.3;
    }
  });

  return (
    <group>
      <mesh ref={curveRef} geometry={tubeGeometry} material={tubeMaterial} />
      <points ref={particlesRef} geometry={particleGeometry} material={particleMaterial} />
    </group>
  );
}

export function TimeScene({ activity = 'idle' }: TimeSceneProps) {
  return (
    <group>
      <ambientLight intensity={0.2} color="#10b981" />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#4ade80" />
      <pointLight position={[0, 0, 0]} intensity={2} color="#22c55e" distance={10} />
      
      {/* Tilt the entire astrolabe slightly for a better view */}
      <group rotation={[-Math.PI / 6, 0, 0]}>
        <TemporalAstrolabe activity={activity} />
        <WavyTimeline activity={activity} />
      </group>
    </group>
  );
}
