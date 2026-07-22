import JarvisCanvas from "../../core/JarvisCanvas";
import LegacyCinematicOrb from "./LegacyCinematicOrb";
import type { AiActivity, EnergyPalette } from "../../types/orb";

type CinematicOrbProps = {
  activity: AiActivity;
  palette?: EnergyPalette;
  resetSignal?: number;
};

export default function CinematicOrb({ activity, palette = "gold", resetSignal = 0 }: CinematicOrbProps) {
  if (palette === "gold") {
    return <LegacyCinematicOrb activity={activity} palette="gold" resetSignal={resetSignal} triangularCore />;
  }

  return (
    <JarvisCanvas
      activity={activity}
      palette={palette}
      resetSignal={resetSignal}
    />
  );
}
