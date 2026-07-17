import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { AMBER, GOLD, HOT } from "./materials";

export default function CoreGlow() {
  const hotCore = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);

  const materials = useMemo(
    () => ({
      hot: new THREE.MeshBasicMaterial({
        color: HOT,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      }),
      amber: new THREE.MeshBasicMaterial({
        color: GOLD,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      }),
      shell: new THREE.MeshBasicMaterial({
        color: AMBER,
        transparent: true,
        opacity: 0.028,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    }),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const pulse = 1 + Math.sin(t * 3.1) * 0.07 + Math.sin(t * 9.4) * 0.025;
    if (hotCore.current) {
      hotCore.current.scale.setScalar(0.3 * pulse);
      materials.hot.opacity = 0.88 + Math.sin(t * 5.7) * 0.08;
    }
    if (halo.current) {
      halo.current.scale.set(0.72 + Math.sin(t * 1.7) * 0.055, 0.42 + Math.cos(t * 1.5) * 0.03, 0.72);
      halo.current.rotation.z = t * 0.28;
      materials.amber.opacity = 0.16 + Math.sin(t * 2.4) * 0.035;
    }
    if (shell.current) {
      shell.current.scale.set(1.28 + Math.sin(t * 0.9) * 0.06, 0.82 + Math.cos(t * 0.8) * 0.035, 1.28);
      shell.current.rotation.z = -t * 0.12;
      materials.shell.opacity = 0.018 + Math.sin(t * 1.8) * 0.01;
    }
    if (light.current) {
      light.current.intensity = 48 + Math.sin(t * 4.2) * 9;
    }
  });

  return (
    <group>
      <pointLight ref={light} color="#ffb83d" intensity={50} distance={9} decay={2} />
      <mesh ref={shell} material={materials.shell}>
        <sphereGeometry args={[1, 64, 64]} />
      </mesh>
      <mesh ref={halo} rotation={[0.4, 0.2, 0.18]} material={materials.amber}>
        <sphereGeometry args={[1, 64, 24]} />
      </mesh>
      <mesh ref={hotCore} material={materials.hot}>
        <sphereGeometry args={[1, 48, 48]} />
      </mesh>
    </group>
  );
}
