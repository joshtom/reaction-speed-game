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
    <section className={`table-card ${motionClassNames.reveal}`}>
      <div className='section-title'>
        <Medal size={17} />
        <span>{CopyText.LastGames}</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>{CopyText.Rank}</th>
            <th>{CopyText.ModeName}</th>
            <th>{CopyText.Accuracy}</th>
            <th>{CopyText.Avg}</th>
            <th>{CopyText.Best}</th>
            <th>{CopyText.Miss}</th>
            <th>{CopyText.Rounds}</th>
          </tr>
        </thead>
        <tbody>
          {!games.length && (
            <tr>
              <td colSpan={7} className='empty-cell'>
                {CopyText.FinishGameToRank}
              </td>
            </tr>
          )}
          {games.map((game) => {
            const rank = ranked.indexOf(game.id);
            return (
              <tr key={game.id}>
                <td>
                  {rank >= 0 ? (
                    <span className={`medal-dot ${medalClass[rank]}`}>
                      {rank + 1}
                    </span>
                  ) : (
                    emptyValue
                  )}
                </td>
                <td>
                  <span className='history-mode'>{game.mode}</span>
                  <em>{game.groups.join(', ')}</em>
                </td>
                <td>{Math.round(game.accuracy * 100)}%</td>
                <td>{game.avg === null ? emptyValue : ms(game.avg)}</td>
                <td>{game.best === null ? emptyValue : ms(game.best)}</td>
                <td>{game.misses}</td>
                <td>{game.rounds}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
