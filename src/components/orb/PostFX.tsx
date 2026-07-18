import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import type { AiActivity } from "../../App";

type PostFXProps = {
  activity: AiActivity;
};

export default function PostFX({ activity }: PostFXProps) {
  const intensity = activity === "speaking" ? 1.85 : activity === "thinking" ? 1.78 : activity === "listening" ? 1.68 : 1.45;
  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={intensity} luminanceThreshold={0.38} luminanceSmoothing={0.72} mipmapBlur kernelSize={KernelSize.SMALL} />
      <Vignette eskil={false} offset={0.24} darkness={0.68} />
    </EffectComposer>
  );
}
