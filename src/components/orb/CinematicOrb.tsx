import JarvisCanvas from "../../core/JarvisCanvas";
import type { AiActivity, EnergyPalette } from "../../App";

type CinematicOrbProps = {
  activity: AiActivity;
  palette?: EnergyPalette;
  resetSignal?: number;
};

export default function CinematicOrb({ activity, palette = "gold", resetSignal = 0 }: CinematicOrbProps) {
  return (
    <JarvisCanvas
      activity={activity}
      palette={palette}
      resetSignal={resetSignal}
    />
  );
}
