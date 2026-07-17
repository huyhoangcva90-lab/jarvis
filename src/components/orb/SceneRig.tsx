import { useFrame } from "@react-three/fiber";
import { ReactNode, useRef } from "react";
import * as THREE from "three";

type SceneRigProps = {
  children: ReactNode;
};

export default function SceneRig({ children }: SceneRigProps) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ camera, clock }) => {
    const t = clock.elapsedTime;
    camera.position.x = Math.sin(t * 0.18) * 0.18;
    camera.position.y = Math.cos(t * 0.13) * 0.1;
    camera.position.z = 8.15 + Math.sin(t * 0.21) * 0.16;
    camera.lookAt(0, 0, 0);

    if (!group.current) return;
    group.current.rotation.x = Math.sin(t * 0.11) * 0.035;
    group.current.rotation.y = Math.sin(t * 0.09) * 0.045;
  });

  return <group ref={group}>{children}</group>;
}
