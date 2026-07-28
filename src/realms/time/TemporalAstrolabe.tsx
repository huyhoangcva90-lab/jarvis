import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface TemporalAstrolabeProps {
  activity: 'idle' | 'listening' | 'thinking' | 'speaking';
}

export function TemporalAstrolabe({ activity }: TemporalAstrolabeProps) {
  const outerRingRef = useRef<THREE.Group>(null);
  const innerRingRef = useRef<THREE.Group>(null);
  const gearsRef = useRef<THREE.Group>(null);
  
  const hourHandRef = useRef<THREE.Group>(null);
  const minuteHandRef = useRef<THREE.Group>(null);
  const secondHandRef = useRef<THREE.Group>(null);

  // Constants
  const colors = {
    darkGreen: '#047857',
    emerald: '#10b981',
    brightGreen: '#22c55e',
    glowGreen: '#4ade80'
  };

  const ringMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: colors.darkGreen, 
    metalness: 0.8, 
    roughness: 0.2,
    emissive: colors.darkGreen,
    emissiveIntensity: 0.2,
    side: THREE.DoubleSide 
  }), []);

  const brightMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: colors.emerald, 
    metalness: 0.9, 
    roughness: 0.1,
    emissive: colors.brightGreen,
    emissiveIntensity: 0.5,
    side: THREE.DoubleSide 
  }), []);

  const handMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: colors.glowGreen,
    metalness: 0.5,
    roughness: 0.1,
    emissive: colors.glowGreen,
    emissiveIntensity: 0.8
  }), []);

  // Generate tick marks
  const ticks = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2;
      const isHour = i % 5 === 0;
      const innerRadius = isHour ? 3.8 : 4.0;
      const outerRadius = 4.2;
      
      const x1 = Math.cos(angle) * innerRadius;
      const z1 = Math.sin(angle) * innerRadius;
      const x2 = Math.cos(angle) * outerRadius;
      const z2 = Math.sin(angle) * outerRadius;

      arr.push(
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([x1, 0, z1, x2, 0, z2]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color={isHour ? colors.glowGreen : colors.emerald} linewidth={isHour ? 2 : 1} />
        </line>
      );
    }
    return arr;
  }, []);

  // Generate gear teeth
  const gearTeeth = useMemo(() => {
    const arr = [];
    const radius = 2.5;
    for (let i = 0; i < 36; i++) {
      const angle = (i / 36) * Math.PI * 2;
      arr.push(
        <mesh key={i} position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]} rotation={[0, -angle, 0]}>
          <boxGeometry args={[0.2, 0.05, 0.3]} />
          <primitive object={ringMaterial} />
        </mesh>
      );
    }
    return arr;
  }, [ringMaterial]);

  // State variables for stepped rotation
  const timeState = useRef({
    elapsed: 0,
    seconds: 0
  });

  useFrame((state, delta) => {
    // Determine speeds based on activity
    let speedMult = 1;
    let handDirection = 1;
    let isStepped = true;

    if (activity === 'thinking') {
      speedMult = 5;
      handDirection = -1;
      isStepped = false;
    } else if (activity === 'listening') {
      speedMult = 0.2;
    } else if (activity === 'speaking') {
      speedMult = 1.5;
    }

    // Smooth continuous rotations for rings
    if (outerRingRef.current) outerRingRef.current.rotation.y -= delta * 0.1 * speedMult;
    if (innerRingRef.current) innerRingRef.current.rotation.y += delta * 0.15 * speedMult;
    if (gearsRef.current) gearsRef.current.rotation.y -= delta * 0.2 * speedMult;

    // Hand rotations
    if (isStepped) {
      timeState.current.elapsed += delta * speedMult;
      if (timeState.current.elapsed > 1) { // Tick every second (adjusted by speedMult)
        timeState.current.elapsed = 0;
        timeState.current.seconds += 1;
        
        const secAngle = -timeState.current.seconds * (Math.PI * 2 / 60) * handDirection;
        const minAngle = -(timeState.current.seconds / 60) * (Math.PI * 2 / 60) * handDirection;
        const hourAngle = -(timeState.current.seconds / 3600) * (Math.PI * 2 / 12) * handDirection;

        // Apply with small spring-like overshoot if desired, but direct setting is fine for tick
        if (secondHandRef.current) secondHandRef.current.rotation.y = secAngle;
        if (minuteHandRef.current) minuteHandRef.current.rotation.y = minAngle;
        if (hourHandRef.current) hourHandRef.current.rotation.y = hourAngle;
      }
    } else {
      // Smooth continuous for thinking
      timeState.current.seconds += delta * 10 * handDirection; // Fast continuous back
      const secAngle = -timeState.current.seconds * (Math.PI * 2 / 60);
      const minAngle = -(timeState.current.seconds / 60) * (Math.PI * 2 / 60);
      const hourAngle = -(timeState.current.seconds / 3600) * (Math.PI * 2 / 12);
      
      if (secondHandRef.current) secondHandRef.current.rotation.y = secAngle;
      if (minuteHandRef.current) minuteHandRef.current.rotation.y = minAngle;
      if (hourHandRef.current) hourHandRef.current.rotation.y = hourAngle;
    }
  });

  return (
    <group>
      {/* Outer Calendar Ring */}
      <group ref={outerRingRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4.2, 4.5, 64]} />
          <primitive object={ringMaterial} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <ringGeometry args={[4.2, 4.5, 64]} />
          <primitive object={ringMaterial} />
        </mesh>
        {ticks}
      </group>

      {/* Inner Ring */}
      <group ref={innerRingRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.2, 3.4, 64]} />
          <primitive object={brightMaterial} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
          <ringGeometry args={[3.2, 3.4, 64]} />
          <primitive object={brightMaterial} />
        </mesh>
      </group>

      {/* Gears */}
      <group ref={gearsRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.0, 2.5, 36]} />
          <primitive object={ringMaterial} />
        </mesh>
        {gearTeeth}
        {/* Gear spokes */}
        {[0, 1, 2, 3].map(i => (
          <mesh key={i} rotation={[0, (i * Math.PI) / 4, 0]}>
            <boxGeometry args={[4.0, 0.04, 0.2]} />
            <primitive object={ringMaterial} />
          </mesh>
        ))}
      </group>

      {/* Clock Core Base */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 32]} />
        <primitive object={brightMaterial} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.2, 0.2, 0.2, 16]} />
        <primitive object={handMaterial} />
      </mesh>

      {/* Clock Hands */}
      {/* Hour Hand */}
      <group ref={hourHandRef}>
        <mesh position={[0, 0.1, -1.0]}>
          <boxGeometry args={[0.1, 0.02, 2.0]} />
          <primitive object={handMaterial} />
        </mesh>
        {/* Hand tip */}
        <mesh position={[0, 0.1, -2.0]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[0.2, 0.02, 0.2]} />
          <primitive object={handMaterial} />
        </mesh>
      </group>

      {/* Minute Hand */}
      <group ref={minuteHandRef}>
        <mesh position={[0, 0.12, -1.5]}>
          <boxGeometry args={[0.06, 0.02, 3.0]} />
          <primitive object={handMaterial} />
        </mesh>
        <mesh position={[0, 0.12, -3.0]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[0.15, 0.02, 0.15]} />
          <primitive object={handMaterial} />
        </mesh>
      </group>

      {/* Second Hand */}
      <group ref={secondHandRef}>
        <mesh position={[0, 0.14, -1.8]}>
          <boxGeometry args={[0.02, 0.02, 4.0]} />
          <primitive object={handMaterial} />
        </mesh>
        <mesh position={[0, 0.14, 0.2]}>
          <boxGeometry args={[0.02, 0.02, 0.4]} />
          <primitive object={handMaterial} />
        </mesh>
        {/* Center pin */}
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
          <primitive object={handMaterial} />
        </mesh>
      </group>
    </group>
  );
}
