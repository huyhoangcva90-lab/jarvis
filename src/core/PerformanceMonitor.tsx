import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export default function PerformanceMonitor() {
  const { gl } = useThree();
  const fpsRef = useRef<number[]>([]);
  const lastTimeRef = useRef<number>(window.performance.now());
  const lastStateUpdateRef = useRef<number>(0);
  const [fps, setFps] = useState(60);

  useFrame(() => {
    const now = window.performance.now();
    const delta = now - lastTimeRef.current;
    lastTimeRef.current = now;

    const currentFps = 1000 / Math.max(1, delta);
    fpsRef.current.push(currentFps);

    // Keep last 60 frames
    if (fpsRef.current.length > 60) {
      fpsRef.current.shift();
    }

    // Average FPS
    const avgFps = fpsRef.current.reduce((a, b) => a + b, 0) / fpsRef.current.length;
    
    if (now - lastStateUpdateRef.current > 900 && Math.abs(avgFps - fps) > 5) {
      lastStateUpdateRef.current = now;
      setFps(Math.round(avgFps));
    }
  });

  useEffect(() => {
    // Dynamic quality adjustments based on FPS
    if (fps < 38) {
      // Degrade resolution limit
      const currentDpr = gl.getPixelRatio();
      if (currentDpr > 1) {
        gl.setPixelRatio(Math.max(1, currentDpr - 0.15));
        console.warn(`[Jarvis Performance] Frame rate dropped to ${fps} FPS. Reducing DPR to ${gl.getPixelRatio().toFixed(2)}`);
      }
    } else if (fps > 55) {
      // Recovery resolution limit
      const currentDpr = gl.getPixelRatio();
      if (currentDpr < 1.45) {
        gl.setPixelRatio(Math.min(1.45, currentDpr + 0.05));
      }
    }
  }, [fps, gl]);

  // Render FPS indicator in development mode or as a hidden debug overlay
  return null;
}
