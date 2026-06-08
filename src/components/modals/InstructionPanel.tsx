import { BookOpen, X } from 'lucide-react';
import { motionClassNames } from '../../animationVocabulary';
import { CopyText } from '../../copy';

export function InstructionPanel({ onClose }: { onClose: () => void }) {
  return (
    <div
      className='modal-backdrop'
      role='dialog'
      aria-modal='true'
      aria-label={CopyText.Instructions}
    >
      <section className={`instruction-panel ${motionClassNames.popIn}`}>
        <div className='modal-heading'>
          <div className='section-title'>
            <BookOpen size={18} />
            <span>{CopyText.HowToPlay}</span>
          </div>
          <button
            className='icon-button'
            type='button'
            onClick={onClose}
            title={CopyText.CloseInstructions}
            aria-label={CopyText.CloseInstructions}
          >
            <X size={18} />
          </button>
        </div>
        <div className='instruction-panel-scroll'>
          <div className='instruction-grid'>
            <div>
              <strong>{CopyText.InstructionConnectTitle}</strong>
              <p>{CopyText.InstructionConnectBody}</p>
            </div>
            <div>
              <strong>{CopyText.InstructionReactTitle}</strong>
              <p>{CopyText.InstructionReactBody}</p>
            </div>
            <div>
              <strong>{CopyText.InstructionScoreTitle}</strong>
              <p>{CopyText.InstructionScoreBody}</p>
            </div>
            <div>
              <strong>{CopyText.InstructionKeyboardTitle}</strong>
              <p>{CopyText.InstructionKeyboardBody}</p>
            </div>
          </div>
        </div>
        <button className='primary' onClick={onClose}>
          {CopyText.BackToArena}
        </button>
      </section>
    </div>
  );
}
