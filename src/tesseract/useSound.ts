import { soundManager } from '../utils/soundManager';

export function useSound() {
  return {
    play: (name: 'click' | 'beep' | 'warning' | 'success') => soundManager.play(name),
    setEnabled: (on: boolean) => soundManager.setEnabled(on),
  };
}
