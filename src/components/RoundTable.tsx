import { Trophy } from 'lucide-react';
import { motionClassNames } from '../animationVocabulary';
import { CopyText, emptyValue } from '../copy';
import { ms } from '../gameUtils';
import type { RoundRecord } from '../types';

export function RoundTable({ rounds }: { rounds: RoundRecord[] }) {
  return (
    <section className={`table-card ${motionClassNames.reveal}`}>
      <div className='section-title'>
        <Trophy size={17} />
        <span>{CopyText.CurrentRun}</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>{CopyText.Prompt}</th>
            <th>{CopyText.Result}</th>
            <th>{CopyText.Time}</th>
            <th>{CopyText.Grade}</th>
          </tr>
        </thead>
        <tbody>
          {!rounds.length && (
            <tr>
              <td colSpan={5} className='empty-cell'>
                {CopyText.NoRoundsYet}
              </td>
            </tr>
          )}
          {rounds.map((round) => (
            <tr key={round.number}>
              <td>{round.number}</td>
              <td>{round.prompt}</td>
              <td className={round.correct ? 'good' : 'bad'}>{round.result}</td>
              <td>{round.time === null ? emptyValue : ms(round.time)}</td>
              <td className={`grade ${round.grade.toLowerCase()}`}>
                {round.grade}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
