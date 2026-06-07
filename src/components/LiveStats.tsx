import { motionClassNames } from '../animationVocabulary';
import { CopyText, emptyValue } from '../copy';
import { ms } from '../gameUtils';
import type { LiveStatsValue } from '../types';
import type { CustomStyle } from './componentUtils';

export function LiveStats({
  stats,
  hits,
  misses,
  streak,
  round,
}: {
  stats: LiveStatsValue;
  hits: number;
  misses: number;
  streak: number;
  round: string;
}) {
  const items: Array<[string, string | number]> = [
    [CopyText.Last, stats.last ? ms(stats.last) : emptyValue],
    [CopyText.Average, stats.avg ? ms(stats.avg) : emptyValue],
    [CopyText.Best, stats.best ? ms(stats.best) : emptyValue],
    [CopyText.Streak, streak],
    [CopyText.Hits, hits],
    [CopyText.Misses, misses],
    [CopyText.Round, round],
  ];

  return (
    <section className={`stats-grid ${motionClassNames.stagger}`}>
      {items.map(([label, value], index) => {
        const style: CustomStyle = { '--stagger-index': index };
        return (
          <div
            className={`stat-tile ${motionClassNames.numberTicker}`}
            style={style}
            key={label}
          >
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        );
      })}
    </section>
  );
}
