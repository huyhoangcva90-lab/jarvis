import { lazy, Suspense } from "react";
import type { AiActivity, EnergyPalette } from "../../App";
import type { LegacyEnergyPalette } from "./LegacyCinematicOrb";

const JarvisCanvas = lazy(() => import("../../core/JarvisCanvas"));
const LegacyCinematicOrb = lazy(() => import("./LegacyCinematicOrb"));

type CinematicOrbProps = {
  activity: AiActivity;
  palette?: EnergyPalette;
  resetSignal?: number;
};

export default function CinematicOrb({ activity, palette = "gold", resetSignal = 0 }: CinematicOrbProps) {
  return (
    <Suspense fallback={<div className="orb-loading" aria-hidden="true" />}>
      {palette === "gold" || palette === "red" || palette === "orange" ? (
        <LegacyCinematicOrb
          activity={activity}
          palette={palette as LegacyEnergyPalette}
          resetSignal={resetSignal}
        />
      ) : (
        <JarvisCanvas activity={activity} palette={palette} resetSignal={resetSignal} />
      )}
    </Suspense>
  );
}
