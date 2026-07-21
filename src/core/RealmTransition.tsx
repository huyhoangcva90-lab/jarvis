import { useEffect, useRef, useState, ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type RealmTransitionProps = {
  palette: string;
  children: (activePalette: string) => ReactNode;
};

export default function RealmTransition({ palette, children }: RealmTransitionProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [activePalette, setActivePalette] = useState(palette);
  const [transitionState, setTransitionState] = useState<"idle" | "out" | "in">("idle");
  const transitionProgress = useRef(1); // 0 = fully collapsed/hidden, 1 = fully expanded/visible

  useEffect(() => {
    if (palette !== activePalette) {
      setTransitionState("out");
    }
  }, [palette, activePalette]);

  useFrame((_, delta) => {
    if (transitionState === "out") {
      transitionProgress.current = THREE.MathUtils.lerp(transitionProgress.current, 0, delta * 12);
      if (transitionProgress.current < 0.05) {
        transitionProgress.current = 0;
        setActivePalette(palette);
        setTransitionState("in");
      }
    } else if (transitionState === "in") {
      transitionProgress.current = THREE.MathUtils.lerp(transitionProgress.current, 1, delta * 8);
      if (transitionProgress.current > 0.95) {
        transitionProgress.current = 1;
        setTransitionState("idle");
      }
    }

    if (groupRef.current) {
      // Scale down and fade opacity (controlled by scaling and stretching)
      groupRef.current.scale.setScalar(transitionProgress.current);
      // Lean rotation during transition
      groupRef.current.rotation.y = (1 - transitionProgress.current) * Math.PI * 0.25;
    }
  });

  return (
    <group ref={groupRef}>
      {children(activePalette)}
    </group>
  );
}
