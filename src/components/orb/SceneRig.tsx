import { useFrame } from "@react-three/fiber";
import { ReactNode, useRef } from "react";
import * as THREE from "three";
import type { AiActivity } from "../../App";

type SceneRigProps = {
  children: ReactNode;
  activity: AiActivity;
};

export default function SceneRig({ activity, children }: SceneRigProps) {
  const group = useRef<THREE.Group>(null);
  const responseLevel = useRef(0);

  useFrame(({ camera, clock }) => {
    const t = clock.elapsedTime;
    const target = activity === "speaking" ? 1 : activity === "thinking" ? 0.58 : activity === "listening" ? 0.32 : 0;
    responseLevel.current = THREE.MathUtils.lerp(responseLevel.current, target, 0.055);
    const speakingWave = Math.sin(t * 4.35) * responseLevel.current;
    const slowBreath = Math.sin(t * 1.12) * responseLevel.current;

    camera.position.x = Math.sin(t * 0.18) * 0.18;
    camera.position.y = Math.cos(t * 0.13) * 0.1;
    camera.position.z = 8.15 + Math.sin(t * 0.21) * 0.16 - responseLevel.current * 0.22;
    camera.lookAt(0, 0, 0);

    if (!group.current) return;
    group.current.rotation.x = Math.sin(t * 0.11) * 0.035 + slowBreath * 0.012;
    group.current.rotation.y = Math.sin(t * 0.09) * 0.045 + responseLevel.current * Math.sin(t * 0.38) * 0.02;
    const scale = 1 + responseLevel.current * 0.055 + speakingWave * 0.035;
    group.current.scale.setScalar(scale);
  });

  return <group ref={group}>{children}</group>;
}
