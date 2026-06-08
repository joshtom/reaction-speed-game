import { CopyText } from '../copy';
import type { CustomStyle } from './componentUtils';

export function RoundProgressTracker({
  roundsPlayed,
  roundsPerGame,
}: {
  roundsPlayed: number;
  roundsPerGame: number;
}) {
  const completed = Math.min(roundsPlayed, roundsPerGame);
  const style: CustomStyle = { '--round-count': roundsPerGame };

  return (
    <div
      className='round-progress-tracker'
      aria-label={`${CopyText.Round} progress ${completed} of ${roundsPerGame}`}
    >
      <div className='round-progress-meta'>
        <span>{CopyText.Round} progress</span>
        <strong>
          {completed}/{roundsPerGame}
        </strong>
      </div>
      <div className='round-segments' style={style}>
        {Array.from({ length: roundsPerGame }).map((_, index) => (
          <span className={index < completed ? 'complete' : ''} key={index} />
        ))}
      </div>
    </div>
  );
}
