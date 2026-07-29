import { MysticTimeCore } from "./MysticTimeCore";
import { OrbEnergyField } from "../shared/OrbEnergyField";

export interface TimeSceneProps {
  activity: "idle" | "listening" | "thinking" | "speaking";
}

export function TimeScene({ activity = "idle" }: TimeSceneProps) {
  return (
    <group>
      <ambientLight color="#0c6f3c" intensity={0.18} />
      <OrbEnergyField
        activity={activity}
        color="#0e9f58"
        hotColor="#c8ffdf"
        radius={2.28}
        particleCount={220}
        opacity={0.34}
      />
      <MysticTimeCore activity={activity} />
    </group>
  );
}
