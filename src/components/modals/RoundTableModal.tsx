import { Trophy, X } from 'lucide-react';
import { motionClassNames } from '../../animationVocabulary';
import { CopyText } from '../../copy';
import type { RoundRecord } from '../../types';
import { RoundTable } from '../RoundTable';

export function RoundTableModal({
  rounds,
  onClose,
}: {
  rounds: RoundRecord[];
  onClose: () => void;
}) {
  return (
    <div
      className='modal-backdrop'
      role='dialog'
      aria-modal='true'
      aria-label={CopyText.CurrentRun}
    >
      <section className={`rounds-modal ${motionClassNames.popIn}`}>
        <div className='modal-heading'>
          <div className='section-title'>
            <Trophy size={18} />
            <span>{CopyText.CurrentRun}</span>
          </div>
          <button
            className='icon-button'
            type='button'
            onClick={onClose}
            title={CopyText.CloseCurrentRun}
            aria-label={CopyText.CloseCurrentRun}
          >
            <X size={18} />
          </button>
        </div>
        <div className='rounds-modal-scroll'>
          <RoundTable rounds={rounds} />
        </div>
      </section>
    </div>
  );
}
