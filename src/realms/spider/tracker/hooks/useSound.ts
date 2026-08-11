import { useTracker } from '../context/TrackerContext';

export function useSound() {
  const { state } = useTracker();
  const enabled = state.soundEnabled;

  const play = (soundName: string) => {
    if (!enabled) return;
    // TODO: Implement actual sound playback
    console.debug(`Playing sound: ${soundName}`);
  };

  const playUI = () => {
    if (!enabled) return;
    // TODO: Implement UI click sound
    console.debug('Playing UI sound');
  };

  const playNotification = () => {
    if (!enabled) return;
    // TODO: Implement notification sound
    console.debug('Playing notification sound');
  };

  return { play, playUI, playNotification, enabled };
}
