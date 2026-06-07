import { motionClassNames } from '../animationVocabulary';
import type { GameStatus } from '../types';

export function GameToast({
  message,
  celebration,
  status,
}: {
  message: string;
  celebration: string;
  status: GameStatus;
}) {
  if (status === 'welcome' || (!message && !celebration)) return null;

  return (
    <div
      className={`game-toast ${motionClassNames.popIn}`}
      key={`${message}-${celebration}`}
    >
      {message && <span>{message}</span>}
      {celebration && <strong>{celebration}</strong>}
    </div>
  );
}
