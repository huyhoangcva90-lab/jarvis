import { MysticTimeCore } from "./MysticTimeCore";

export interface TimeSceneProps {
  activity: "idle" | "listening" | "thinking" | "speaking";
}

export function TimeScene({ activity = "idle" }: TimeSceneProps) {
  return (
    <group>
      <ambientLight color="#0c6f3c" intensity={0.18} />
      <MysticTimeCore activity={activity} />
    </group>
  );
}
