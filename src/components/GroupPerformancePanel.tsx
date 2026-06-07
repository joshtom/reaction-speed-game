import { Activity } from 'lucide-react';
import { motionClassNames } from '../animationVocabulary';
import { CopyText, emptyValue } from '../copy';
import { ms } from '../gameUtils';
import type { GroupPerformance } from '../types';

export function GroupPerformancePanel({
  performance,
  best,
  weakest,
}: {
  performance: GroupPerformance[];
  best: GroupPerformance | null;
  weakest: GroupPerformance | null;
}) {
  return (
    <section className={`group-card ${motionClassNames.reveal}`}>
      <div className='section-title'>
        <Activity size={17} />
        <span>{CopyText.GroupReadout}</span>
      </div>
      <div className='group-highlights'>
        <div>
          <span>{CopyText.BestGroup}</span>
          <strong>{best ? best.label : CopyText.NeedMoreRounds}</strong>
        </div>
        <div>
          <span>{CopyText.WeakestGroup}</span>
          <strong>{weakest ? weakest.label : CopyText.NeedMoreRounds}</strong>
        </div>
      </div>
      <div className='group-score-grid'>
        {performance.map((group) => (
          <div className='group-score-item' key={group.group}>
            <span>{group.label}</span>
            <strong>{group.avg === null ? emptyValue : ms(group.avg)}</strong>
            <em>
              {group.hits}/{group.rounds}
            </em>
          </div>
        ))}
      </div>
    </section>
  );
}
