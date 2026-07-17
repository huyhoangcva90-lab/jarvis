import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";

export default function PostFX() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={1.8} luminanceThreshold={0.35} luminanceSmoothing={0.65} mipmapBlur kernelSize={KernelSize.MEDIUM} />
      <Vignette eskil={false} offset={0.24} darkness={0.68} />
    </EffectComposer>
  );
}
