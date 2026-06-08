import { useMemo } from 'react';
import { Medal } from 'lucide-react';
import { motionClassNames } from '../animationVocabulary';
import { CopyText, emptyValue } from '../copy';
import { ms } from '../gameUtils';
import type { GameSummary } from '../types';

export function GameHistory({ games }: { games: GameSummary[] }) {
  const ranked = useMemo(() => {
    return [...games]
      .sort((a, b) => {
        if (a.avg === null && b.avg === null) return a.misses - b.misses;
        if (a.avg === null) return 1;
        if (b.avg === null) return -1;
        return a.avg - b.avg || a.misses - b.misses;
      })
      .slice(0, 3)
      .map((game) => game.id);
  }, [games]);

  const medalClass = ['gold', 'silver', 'bronze'];

  return (
    <section className={`history-card ${motionClassNames.reveal}`}>
      <div className='section-title'>
        <Medal size={17} />
        <span>{CopyText.LastGames}</span>
      </div>
      {!games.length && (
        <div className='empty-cell'>{CopyText.FinishGameToRank}</div>
      )}
      {!!games.length && (
        <div className='history-list'>
          {games.map((game) => {
            const rank = ranked.indexOf(game.id);
            return (
              <article className='history-row' key={game.id}>
                <div className='history-summary'>
                  {rank >= 0 ? (
                    <span className={`medal-dot ${medalClass[rank]}`}>
                      {rank + 1}
                    </span>
                  ) : (
                    <span className='history-rank'>{emptyValue}</span>
                  )}
                  <div>
                    <strong>{game.mode}</strong>
                    <em>{game.groups.join(', ')}</em>
                  </div>
                </div>
                <div className='history-metrics'>
                  <span>
                    {CopyText.Accuracy}
                    <strong>{Math.round(game.accuracy * 100)}%</strong>
                  </span>
                  <span>
                    {CopyText.Avg}
                    <strong>{game.avg === null ? emptyValue : ms(game.avg)}</strong>
                  </span>
                  <span>
                    {CopyText.Best}
                    <strong>{game.best === null ? emptyValue : ms(game.best)}</strong>
                  </span>
                  <span>
                    {CopyText.Miss}
                    <strong>{game.misses}</strong>
                  </span>
                  <span>
                    {CopyText.Rounds}
                    <strong>{game.rounds}</strong>
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
