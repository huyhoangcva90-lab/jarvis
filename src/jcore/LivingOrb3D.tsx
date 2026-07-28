import TesseractOrb3D from "../tesseract/TesseractOrb3D";
import type { AiEmotion, EmotionState } from "./model";

type Props = {
  emotion: AiEmotion;
  state?: EmotionState;
};

export default function LivingOrb3D({ emotion }: Props) {
  return <TesseractOrb3D emotion={emotion} />;
}
