import type { CSSProperties } from "react";
import type { AiActivity } from "../../App";

type CinematicOrbProps = {
  activity: AiActivity;
};

const orbitRings = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  radius: 28 + index * 3.7,
  tiltX: -74 + ((index * 29) % 148),
  tiltY: -58 + ((index * 37) % 116),
  tiltZ: (index * 23) % 180,
  speed: 12 + (index % 7) * 3,
  opacity: 0.32 + (index % 5) * 0.07,
  width: index % 4 === 0 ? 2 : 1
}));

const outerArcs = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  size: 72 + (index % 5) * 7,
  tiltX: -62 + ((index * 31) % 124),
  tiltY: -46 + ((index * 19) % 92),
  tiltZ: index * 33,
  duration: 18 + index * 1.8,
  delay: index * -0.55
}));

const beams = Array.from({ length: 17 }, (_, index) => ({
  id: index,
  angle: index * 21 + (index % 3) * 7,
  length: index % 5 === 0 ? 128 : 92 + (index % 4) * 12,
  thickness: index % 5 === 0 ? 3 : 1.4,
  delay: index * -0.19
}));

const particles = Array.from({ length: 96 }, (_, index) => {
  const angle = index * 137.5;
  const radius = 26 + ((index * 17) % 78);
  return {
    id: index,
    x: 50 + Math.cos((angle * Math.PI) / 180) * radius * (0.42 + (index % 7) * 0.018),
    y: 50 + Math.sin((angle * Math.PI) / 180) * radius * (0.32 + (index % 9) * 0.015),
    size: 1 + (index % 5) * 0.5,
    delay: index * -0.047,
    duration: 1.4 + (index % 8) * 0.23
  };
});

const networkLines = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  angle: index * 17 + (index % 4) * 13,
  width: 22 + (index % 6) * 8,
  x: 22 + ((index * 11) % 56),
  y: 18 + ((index * 19) % 58),
  delay: index * -0.08
}));

export default function CinematicOrb({ activity }: CinematicOrbProps) {
  return (
    <section className={`cinematic-orb ${activity}`} aria-hidden="true">
      <div className="orb-depth-plane back">
        {outerArcs.map((arc) => (
          <i
            className="orb-outer-arc"
            key={arc.id}
            style={
              {
                "--size": `${arc.size}%`,
                "--tilt-x": `${arc.tiltX}deg`,
                "--tilt-y": `${arc.tiltY}deg`,
                "--tilt-z": `${arc.tiltZ}deg`,
                "--duration": `${arc.duration}s`,
                "--delay": `${arc.delay}s`
            } as CSSProperties
            }
          />
        ))}
      </div>

      <div className="orb-particle-field">
        {particles.map((particle) => (
          <i
            key={particle.id}
            style={
              {
                "--x": `${particle.x}%`,
                "--y": `${particle.y}%`,
                "--size": `${particle.size}px`,
                "--delay": `${particle.delay}s`,
                "--duration": `${particle.duration}s`
            } as CSSProperties
            }
          />
        ))}
      </div>

      <div className="orb-network">
        {networkLines.map((line) => (
          <i
            key={line.id}
            style={
              {
                "--angle": `${line.angle}deg`,
                "--width": `${line.width}%`,
                "--x": `${line.x}%`,
                "--y": `${line.y}%`,
                "--delay": `${line.delay}s`
            } as CSSProperties
            }
          />
        ))}
      </div>

      <div className="orb-ring-stack">
        {orbitRings.map((ring) => (
          <i
            className="orb-ring"
            key={ring.id}
            style={
              {
                "--radius": `${ring.radius}%`,
                "--tilt-x": `${ring.tiltX}deg`,
                "--tilt-y": `${ring.tiltY}deg`,
                "--tilt-z": `${ring.tiltZ}deg`,
                "--duration": `${ring.speed}s`,
                "--opacity": ring.opacity,
                "--line": `${ring.width}px`
            } as CSSProperties
            }
          />
        ))}
      </div>

      <div className="orb-beams">
        {beams.map((beam) => (
          <i
            key={beam.id}
            style={
              {
                "--angle": `${beam.angle}deg`,
                "--length": `${beam.length}%`,
                "--thickness": `${beam.thickness}px`,
                "--delay": `${beam.delay}s`
            } as CSSProperties
            }
          />
        ))}
      </div>

      <div className="orb-sweeps">
        <i />
        <i />
        <i />
        <i />
      </div>

      <div className="orb-core">
        <i className="core-disc" />
        <i className="core-ring one" />
        <i className="core-ring two" />
        <i className="core-ring three" />
      </div>
    </section>
  );
}
