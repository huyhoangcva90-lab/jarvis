import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import type { AiActivity } from "../../App";

type PostFXProps = {
  activity: AiActivity;
};

export default function PostFX({ activity }: PostFXProps) {
  const intensity = activity === "speaking" ? 2.15 : activity === "thinking" ? 2 : activity === "listening" ? 1.9 : 1.65;
  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={intensity} luminanceThreshold={0.34} luminanceSmoothing={0.68} mipmapBlur kernelSize={KernelSize.MEDIUM} />
      <Vignette eskil={false} offset={0.24} darkness={0.68} />
    </EffectComposer>
  );
}
