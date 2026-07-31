import { Component, lazy, Suspense, useEffect, useRef, useState, type ErrorInfo, type ReactNode } from "react";
import type { AiActivity, EnergyPalette } from "../../App";
import type { LegacyEnergyPalette } from "./LegacyCinematicOrb";

const JarvisCanvas = lazy(() => import("../../core/JarvisCanvas"));
const LegacyCinematicOrb = lazy(() => import("./LegacyCinematicOrb"));

type CinematicOrbProps = {
  activity: AiActivity;
  palette?: EnergyPalette;
  resetSignal?: number;
};

class OrbErrorBoundary extends Component<
  { children: ReactNode; resetKey: string },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // The recovery UI is intentionally local; telemetry is handled by the host app.
  }

  componentDidUpdate(previousProps: Readonly<{ children: ReactNode; resetKey: string }>) {
    if (this.state.failed && previousProps.resetKey !== this.props.resetKey) {
      this.setState({ failed: false });
    }
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="orb-recovery" role="status">
          <span>ORB RENDER INTERRUPTED</span>
          <button type="button" onClick={() => window.location.reload()}>
            Reload renderer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function CinematicOrb({ activity, palette = "gold", resetSignal = 0 }: CinematicOrbProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    const cleanups = new Map<HTMLCanvasElement, () => void>();
    const watchCanvas = (canvas: HTMLCanvasElement) => {
      if (cleanups.has(canvas)) return;
      const handleLost = (event: Event) => {
        event.preventDefault();
        setContextLost(true);
      };
      const handleRestored = () => setContextLost(false);
      canvas.addEventListener("webglcontextlost", handleLost);
      canvas.addEventListener("webglcontextrestored", handleRestored);
      cleanups.set(canvas, () => {
        canvas.removeEventListener("webglcontextlost", handleLost);
        canvas.removeEventListener("webglcontextrestored", handleRestored);
      });
    };
    const scan = () => host.querySelectorAll("canvas").forEach(watchCanvas);
    const refreshCanvases = () => {
      cleanups.forEach((cleanup, canvas) => {
        if (host.contains(canvas)) return;
        cleanup();
        cleanups.delete(canvas);
      });
      scan();
    };
    const observer = new MutationObserver(refreshCanvases);
    observer.observe(host, { childList: true, subtree: true });
    refreshCanvases();

    return () => {
      observer.disconnect();
      cleanups.forEach((cleanup) => cleanup());
      cleanups.clear();
    };
  }, []);

  useEffect(() => {
    setContextLost(false);
  }, [palette]);

  return (
    <div ref={hostRef} className="orb-render-host">
      <OrbErrorBoundary resetKey={palette}>
        <Suspense fallback={<div className="orb-loading" aria-hidden="true" />}>
          {palette === "gold" || palette === "red" || palette === "orange" || palette === "violet" ? (
            <LegacyCinematicOrb
              activity={activity}
              palette={palette as LegacyEnergyPalette}
              resetSignal={resetSignal}
            />
          ) : (
            <JarvisCanvas activity={activity} palette={palette} resetSignal={resetSignal} />
          )}
        </Suspense>
      </OrbErrorBoundary>
      {contextLost && (
        <div className="orb-recovery" role="status">
          <span>GPU CONTEXT LOST</span>
          <button type="button" onClick={() => window.location.reload()}>
            Restore orb
          </button>
        </div>
      )}
    </div>
  );
}
