import JarvisCanvas from "../../core/JarvisCanvas";
import LegacyCinematicOrb, { type LegacyEnergyPalette } from "./LegacyCinematicOrb";
import type { AiActivity, EnergyPalette } from "../../App";

type CinematicOrbProps = {
  activity: AiActivity;
  palette?: EnergyPalette;
  resetSignal?: number;
};

export default function CinematicOrb({ activity, palette = "gold", resetSignal = 0 }: CinematicOrbProps) {
  if (palette === "gold" || palette === "red" || palette === "violet" || palette === "orange") {
    return <LegacyCinematicOrb activity={activity} palette={palette as LegacyEnergyPalette} resetSignal={resetSignal} />;
  }

  return (
    <JarvisCanvas
      activity={activity}
      palette={palette}
      resetSignal={resetSignal}
    />
  );
}
